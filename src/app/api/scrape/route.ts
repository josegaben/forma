import { NextResponse } from "next/server";
import { convertScrapedSiteToFormat, type DiscoveredSite } from "@/lib/scraper";
import { validatePublicHttpUrl } from "@/lib/ssrf-guard";
import { recordTelemetryEvent } from "@/lib/telemetry";
import { analyzeWebsiteUrl } from "../../../../forma-xray/src/analyzer.mjs";

export const maxDuration = 60;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

async function handleScrape(rawUrl: string) {
  const checked = validatePublicHttpUrl(rawUrl);
  if (!checked.ok) {
    return NextResponse.json(
      { error: checked.error },
      { status: 400, headers: CORS_HEADERS }
    );
  }
  const parsed = checked.url;

  try {
    const xray = await analyzeWebsiteUrl(parsed.toString(), { timeoutMs: 9000 });
    void recordTelemetryEvent({ event: "agent_scrape_api", target: parsed.hostname });
    const site: DiscoveredSite = {
      id: `live-${xray.hostname.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`,
      url: xray.url,
      hostname: xray.hostname,
      title: xray.title.slice(0, 72),
      description: xray.description.slice(0, 160),
      sourceGallery: "Live X-Ray",
      scrapedAt: xray.analyzedAt,
      craftScore: xray.craftScore,
      grade: xray.antiSlopAudit.grade,
      strengths: xray.antiSlopAudit.strengths,
      mode: xray.layers.surface.mode === "dark" ? "dark" : "light",
      bg: xray.layers.surface.bg,
      ink: xray.layers.surface.ink,
      accent: xray.layers.surface.accent,
      palette: xray.layers.surface.topHexPalette.slice(0, 5).map((p: { value: string }) => p.value),
      primaryFont: xray.layers.typography.primaryFont,
      primaryEasing: xray.layers.motion.primaryEasing,
      bezierCurves: xray.layers.motion.bezierCurves.slice(0, 4),
      keyframes: xray.layers.motion.keyframes.slice(0, 8),
      motionEngines: xray.layers.motion.detectedEngines,
      honorsReducedMotion: xray.layers.motion.honorsReducedMotion,
    };

    const format = convertScrapedSiteToFormat(site);
    return NextResponse.json(
      {
        site,
        format,
        designMd: xray.designMd,
        rawLayers: xray.layers,
      },
      { headers: CORS_HEADERS }
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to inspect target URL" },
      { status: 422, headers: CORS_HEADERS }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  return handleScrape(searchParams.get("url") || "");
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return handleScrape(String(body.url || ""));
}
