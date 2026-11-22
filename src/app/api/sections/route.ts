import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { NextResponse } from "next/server";
import {
  type SectionKind,
  type SectionVaultFeed,
  type VisualSectionItem,
  getSectionVaultFeed,
} from "@/lib/section-vault";
import { meterCloudCall } from "@/lib/credits";
import { validatePublicHttpUrl } from "@/lib/ssrf-guard";
import { recordTelemetryEvent } from "@/lib/telemetry";
import { scanWebsiteSections } from "../../../../forma-xray/src/section-scanner.mjs";

export const maxDuration = 60;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, X-Forma-Key, X-Gemini-Key, X-Forma-Max-Cost, Authorization",
};

function readFreshVaultFeed(): SectionVaultFeed {
  try {
    const filePath = resolve(process.cwd(), "src/data/section-vault.json");
    if (existsSync(filePath)) {
      return JSON.parse(readFileSync(filePath, "utf8")) as SectionVaultFeed;
    }
  } catch {
    // fallback to bundled JSON
  }
  return getSectionVaultFeed();
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kind = (searchParams.get("kind") || "all") as SectionKind | "all";
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const mode = (searchParams.get("mode") || "all") as "light" | "dark" | "all";
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") || 24)));

  void recordTelemetryEvent({
    event: "agent_discover_api",
    request,
    target: `sections:${kind}`,
  });

  const feed = readFreshVaultFeed();
  const filtered = (feed.sections || [])
    .filter((sec: VisualSectionItem) => {
      if (kind !== "all" && sec.kind !== kind) return false;
      if (mode !== "all" && sec.computedSpec.mode !== mode) return false;
      if (!query) return true;
      const hay = `${sec.hostname} ${sec.siteTitle} ${sec.kind} ${sec.vision.archetype} ${sec.vision.summary} ${sec.tags.join(" ")}`.toLowerCase();
      return query.split(/\s+/).every((tok) => hay.includes(tok));
    })
    .slice(0, limit);

  return NextResponse.json(
    {
      lastVisualScanAt: feed.lastVisualScanAt,
      visionEngine: feed.visionEngine,
      totalInVault: feed.totalSections,
      countsByKind: feed.countsByKind,
      returned: filtered.length,
      sections: filtered,
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
      operation: "scan_live_sections",
      target: checked.url.hostname,
      costUsd: 0.04,
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
      target: `visual-sections:${checked.url.hostname}`,
    });

    const headerByok = request.headers.get("x-gemini-key")?.trim();

    const result = await scanWebsiteSections(targetUrl, {
      probePricingSubpage: body.probePricing !== false,
      apiKey: headerByok || undefined,
    });

    return NextResponse.json(
      {
        ...result,
        billing: {
          mode: metered.billingMode,
          chargedUsd: metered.chargedUsd,
          remainingBalanceUsd: metered.wallet.balanceUsd,
        },
      },
      { headers: { ...CORS_HEADERS, ...metered.headers } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to scan visual sections";
    return NextResponse.json({ error: message }, { status: 422, headers: CORS_HEADERS });
  }
}
