import { NextResponse } from "next/server";
import { composeFormatGenome, recommendMixFromBrief } from "@/lib/composer";
import { meterCloudCall } from "@/lib/credits";
import { escapeXml, validatePublicHttpUrl } from "@/lib/ssrf-guard";
import { recommendPaletteForIdea } from "@/lib/synthesizer";
import { recordTelemetryEvent } from "@/lib/telemetry";
import { analyzeWebsiteUrl } from "../../../../forma-xray/src/analyzer.mjs";
import { runPlaywrightRuntimeProbe } from "../../../../forma-xray/src/playwright-probe.mjs";

export const maxDuration = 60;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, X-Forma-Key, X-Gemini-Key, X-Forma-Max-Cost, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

function generateSwissSvgLogo(brandName: string, bg: string, ink: string, accent: string) {
  const raw = (brandName || "Forma").trim().slice(0, 48);
  const clean = escapeXml(raw);
  const tsxSafe = raw.replace(/[`$\\{}<>]/g, "");
  const initial = escapeXml((raw[0] || "F").toUpperCase());
  const svgMark = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 32 32" fill="none" aria-label="${clean} mark">
  <rect width="32" height="32" rx="8" fill="${ink}"/>
  <rect x="7" y="7" width="18" height="4.5" rx="1.25" fill="${bg}"/>
  <rect x="7" y="13.75" width="4.5" height="11.25" rx="1.25" fill="${bg}"/>
  <rect x="13.5" y="13.75" width="11.5" height="4.75" rx="1.25" fill="${accent}"/>
  <circle cx="22.5" cy="22.5" r="2.5" fill="${bg}" fill-opacity="0.55"/>
  <!-- Brand initial reference: ${initial} -->
</svg>`;

  const ogImageTsx = `import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "${bg}",
          color: "${ink}",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "18px", fontSize: 32, fontWeight: 600 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "${accent}" }} />
          <span>${tsxSafe}</span>
        </div>
        <div style={{ fontSize: 74, lineHeight: 1.04, letterSpacing: "-0.03em", maxWidth: "960px" }}>
          Built with precision and human taste.
        </div>
      </div>
    ),
    size
  );
}`;

  return { svgMark, ogImageTsx };
}

/**
 * Unified Metered Cloud Gateway (/api/cloud) — treg.to /call/ style!
 * Supports:
 *   - tool: "visual_anti_slop_qa" ($0.05/call or $0.00 BYOK)
 *   - tool: "generate_brand_kit"  ($0.08/call or $0.00 BYOK)
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const tool = String(body.tool || "visual_anti_slop_qa");

  if (tool === "visual_anti_slop_qa") {
    const checked = validatePublicHttpUrl(String(body.url || ""));
    if (!checked.ok) {
      return NextResponse.json(
        { error: checked.error },
        { status: 400, headers: CORS_HEADERS }
      );
    }
    const targetUrl = checked.url.toString();

    const metered = await meterCloudCall({
      request,
      operation: "visual_anti_slop_qa",
      target: checked.url.hostname,
      costUsd: 0.05,
    });

    if (!metered.allowed) {
      return NextResponse.json(
        { error: metered.error, balanceUsd: metered.wallet.balanceUsd },
        { status: 402, headers: { ...CORS_HEADERS, ...metered.headers } }
      );
    }

    void recordTelemetryEvent({
      event: "agent_scrape_api",
      request,
      target: `qa:${targetUrl.slice(0, 60)}`,
    });

    let runtimeData = null;
    try {
      runtimeData = await runPlaywrightRuntimeProbe(targetUrl);
    } catch {
      runtimeData = null;
    }

    const xray = await analyzeWebsiteUrl(targetUrl, { runtimeData });
    const fixes: string[] = [];
    if (xray.antiSlopAudit.warnings.length > 0) {
      for (const w of xray.antiSlopAudit.warnings) {
        fixes.push(`Remove ${w} and replace with 60-30-10 neutral surface + single focal accent.`);
      }
    }
    if (!xray.layers.motion.honorsReducedMotion) {
      fixes.push("Add `@media (prefers-reduced-motion: reduce)` rule disabling non-essential motion.");
    }
    if (!xray.layers.layout.modernPlatform.tabularNums) {
      fixes.push("Add `font-variant-numeric: tabular-nums` to all KPI counters, prices, and tables.");
    }

    return NextResponse.json(
      {
        tool: "visual_anti_slop_qa",
        url: xray.url,
        craftScore: xray.craftScore,
        grade: xray.antiSlopAudit.grade,
        warnings: xray.antiSlopAudit.warnings,
        strengths: xray.antiSlopAudit.strengths,
        runtimeAnimationsCount: runtimeData?.animations?.length ?? 0,
        actionableFixes: fixes,
        billing: {
          mode: metered.billingMode,
          chargedUsd: metered.chargedUsd,
          remainingBalanceUsd: metered.wallet.balanceUsd,
        },
      },
      { headers: { ...CORS_HEADERS, ...metered.headers } }
    );
  }

  if (tool === "generate_brand_kit") {
    const projectName = String(body.projectName || "Acme").trim();
    const projectBrief = String(
      body.projectBrief || "Modern software product engineered with restraint."
    ).trim();

    const metered = await meterCloudCall({
      request,
      operation: "generate_brand_kit",
      target: projectName.slice(0, 40),
      costUsd: 0.08,
    });

    if (!metered.allowed) {
      return NextResponse.json(
        { error: metered.error, balanceUsd: metered.wallet.balanceUsd },
        { status: 402, headers: { ...CORS_HEADERS, ...metered.headers } }
      );
    }

    void recordTelemetryEvent({
      event: "agent_compose_api",
      request,
      target: `brand_kit:${projectName.slice(0, 40)}`,
    });

    const rec = recommendMixFromBrief(projectBrief);
    const pal = recommendPaletteForIdea(projectBrief);
    const genome = composeFormatGenome({
      ...rec.selection,
      paletteId: body.paletteId || pal.id,
      projectName,
      projectBrief,
    });

    const s = genome.layers.surface.surface;
    const { svgMark, ogImageTsx } = generateSwissSvgLogo(
      projectName,
      s.bg,
      s.ink,
      s.accent
    );

    return NextResponse.json(
      {
        tool: "generate_brand_kit",
        projectName,
        mixCode: genome.mixCode,
        palette: {
          id: pal.id,
          name: pal.name,
          bg: s.bg,
          ink: s.ink,
          accent: s.accent,
          contrastRatioText: genome.contrastRatioText,
        },
        files: {
          "public/logo.svg": svgMark,
          "src/app/icon.svg": svgMark,
          "src/app/opengraph-image.tsx": ogImageTsx,
          "src/styles/tokens.css": genome.cssTokens,
          "DESIGN.md": genome.masterPrompt,
        },
        billing: {
          mode: metered.billingMode,
          chargedUsd: metered.chargedUsd,
          remainingBalanceUsd: metered.wallet.balanceUsd,
        },
      },
      { headers: { ...CORS_HEADERS, ...metered.headers } }
    );
  }

  return NextResponse.json(
    { error: `Unsupported cloud tool: ${tool}` },
    { status: 400, headers: CORS_HEADERS }
  );
}
