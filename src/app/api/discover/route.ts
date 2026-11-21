import { NextResponse } from "next/server";
import discoveredFeed from "@/data/discovered-feed.json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("mode");
  const minScore = Number(searchParams.get("minScore") || 0);
  const q = (searchParams.get("q") || "").trim().toLowerCase();

  const filtered = discoveredFeed.sites.filter((s) => {
    if (mode && (mode === "light" || mode === "dark") && s.mode !== mode) return false;
    if (minScore && s.craftScore < minScore) return false;
    if (!q) return true;
    return [s.hostname, s.title, s.sourceGallery, s.primaryFont, ...s.motionEngines]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  return NextResponse.json(
    {
      lastCrawlAt: discoveredFeed.lastCrawlAt,
      galleriesMonitored: discoveredFeed.galleriesMonitored,
      count: filtered.length,
      sites: filtered,
    },
    { headers: { "Access-Control-Allow-Origin": "*" } }
  );
}
