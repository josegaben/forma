import { NextResponse } from "next/server";
import { validatePublicHttpUrl } from "@/lib/ssrf-guard";
import { recordTelemetryEvent } from "@/lib/telemetry";
import { generateWebDoctorDiagnosis } from "@/lib/web-doctor";
import { analyzeWebsiteUrl } from "../../../../forma-xray/src/analyzer.mjs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * Unified Design Craft + Google PageSpeed Insights v5 Live Audit (/api/audit?url=...)
 * Combines forma-xray's 5-layer CSS/Motion/Anti-Slop inspection with live Google Lighthouse CWV metrics.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checked = validatePublicHttpUrl(searchParams.get("url") || "");
  if (!checked.ok) {
    return NextResponse.json(
      { error: checked.error },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const targetUrl = checked.url.toString();
  void recordTelemetryEvent({
    event: "agent_scrape_api",
    request,
    target: `audit:${checked.url.hostname}`,
  });

  const psiKey = process.env.PAGESPEED_API_KEY || process.env.GOOGLE_API_KEY || "";
  const psiEndpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
    targetUrl
  )}&category=PERFORMANCE&category=ACCESSIBILITY&strategy=desktop${
    psiKey ? `&key=${encodeURIComponent(psiKey)}` : ""
  }`;

  const [xraySettled, psiSettled] = await Promise.allSettled([
    analyzeWebsiteUrl(targetUrl, { timeoutMs: 9000 }),
    fetch(psiEndpoint, { signal: AbortSignal.timeout(12000) }).then((r) =>
      r.ok ? r.json() : null
    ),
  ]);

  if (xraySettled.status === "rejected") {
    return NextResponse.json(
      {
        error:
          xraySettled.reason instanceof Error
            ? xraySettled.reason.message
            : "Failed to analyze target URL",
      },
      { status: 422, headers: CORS_HEADERS }
    );
  }

  const xray = xraySettled.value;
  const psiRaw = psiSettled.status === "fulfilled" ? psiSettled.value : null;
  const lhr = psiRaw?.lighthouseResult;

  const coreWebVitals = lhr
    ? {
        source: "Google PageSpeed Insights v5 (Lighthouse Desktop)",
        performanceScore: Math.round((lhr.categories?.performance?.score ?? 0) * 100),
        accessibilityScore: Math.round((lhr.categories?.accessibility?.score ?? 0) * 100),
        fcp: lhr.audits?.["first-contentful-paint"]?.displayValue || null,
        lcp: lhr.audits?.["largest-contentful-paint"]?.displayValue || null,
        cls: lhr.audits?.["cumulative-layout-shift"]?.displayValue || null,
        tbt: lhr.audits?.["total-blocking-time"]?.displayValue || null,
      }
    : {
        source: "forma-xray Static + CSS Compositor Heuristics (PageSpeed quota/timeout)",
        honorsReducedMotion: xray.layers.motion.honorsReducedMotion,
        usesTabularNums: xray.layers.layout.modernPlatform.tabularNums,
        usesContainerQueries: xray.layers.layout.modernPlatform.containerQueries,
      };

  const doctor = generateWebDoctorDiagnosis(
    xray,
    lhr
      ? {
          performanceScore: Math.round((lhr.categories?.performance?.score ?? 0) * 100),
          accessibilityScore: Math.round((lhr.categories?.accessibility?.score ?? 0) * 100),
          lcp: lhr.audits?.["largest-contentful-paint"]?.displayValue || null,
          cls: lhr.audits?.["cumulative-layout-shift"]?.displayValue || null,
        }
      : null
  );

  return NextResponse.json(
    {
      url: xray.url,
      hostname: xray.hostname,
      title: xray.title,
      craftScore: xray.craftScore,
      antiSlopGrade: xray.antiSlopAudit.grade,
      strengths: xray.antiSlopAudit.strengths,
      warnings: xray.antiSlopAudit.warnings,
      coreWebVitals,
      doctor,
      tokens: {
        mode: xray.layers.surface.mode,
        bg: xray.layers.surface.bg,
        ink: xray.layers.surface.ink,
        accent: xray.layers.surface.accent,
        primaryFont: xray.layers.typography.primaryFont,
        primaryEasing: xray.layers.motion.primaryEasing,
      },
    },
    { headers: CORS_HEADERS }
  );
}
