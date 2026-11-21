#!/usr/bin/env node
/**
 * forma Continuous Web Design & Motion Discovery Crawler
 * Crawls curated design galleries + benchmark domains using forma-xray,
 * scores every site for Craft & Anti-Slop purity, and updates src/data/discovered-feed.json.
 *
 * Modes:
 *   node scripts/continuous-crawler.mjs                  # Single discovery pass
 *   node scripts/continuous-crawler.mjs --watch          # Continuous background loop (default every 30m)
 */

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { analyzeWebsiteUrl } from "../forma-xray/src/analyzer.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = resolve(__dirname, "../src/data/discovered-feed.json");

const GALLERY_FEEDS = [
  { name: "deadsimplesites.com", url: "https://deadsimplesites.com" },
  { name: "minimal.gallery", url: "https://minimal.gallery" },
  { name: "httpster.net", url: "https://httpster.net" },
  { name: "landings.dev", url: "https://landings.dev" },
  { name: "a1.gallery", url: "https://a1.gallery" },
  { name: "darkmodedesign.com", url: "https://www.darkmodedesign.com" },
  { name: "saaslandingpage.com", url: "https://saaslandingpage.com" },
  { name: "lapa.ninja", url: "https://www.lapa.ninja" },
  { name: "onepagelove.com", url: "https://onepagelove.com" },
  { name: "brutalistwebsites.com", url: "https://brutalistwebsites.com" },
  { name: "bentogrids.com", url: "https://bentogrids.com" },
  { name: "footer.design", url: "https://www.footer.design" },
];

const SEED_BENCHMARKS = [
  { url: "https://treg.to", sourceGallery: "treg.to" },
  { url: "https://resiz.es", sourceGallery: "resiz.es" },
  { url: "https://pdepablo.com", sourceGallery: "pdepablo.com" },
  { url: "https://linear.app", sourceGallery: "a1.gallery" },
  { url: "https://raycast.com", sourceGallery: "21st.dev" },
  { url: "https://resend.com", sourceGallery: "darkmodedesign.com" },
  { url: "https://dub.co", sourceGallery: "landings.dev" },
  { url: "https://zed.dev", sourceGallery: "deadsimplesites.com" },
  { url: "https://midday.ai", sourceGallery: "godly.website" },
  { url: "https://mintlify.com", sourceGallery: "curated.design" },
  { url: "https://vercel.com", sourceGallery: "a1.gallery" },
  { url: "https://stripe.com", sourceGallery: "awwwards.com" },
  { url: "https://cal.com", sourceGallery: "landings.dev" },
  { url: "https://supabase.com", sourceGallery: "darkmodedesign.com" },
  { url: "https://teenage.engineering", sourceGallery: "minimal.gallery" },
  { url: "https://daylightcomputer.com", sourceGallery: "godly.website" },
  { url: "https://attio.com", sourceGallery: "landings.dev" },
  { url: "https://fey.com", sourceGallery: "godly.website" },
  { url: "https://clerk.com", sourceGallery: "21st.dev" },
  { url: "https://rauno.me", sourceGallery: "deadsimplesites.com" },
  { url: "https://emilkowal.ski", sourceGallery: "a1.gallery" },
  { url: "https://cursor.com", sourceGallery: "godly.website" },
  { url: "https://railway.com", sourceGallery: "darkmodedesign.com" },
  { url: "https://planetscale.com", sourceGallery: "landings.dev" },
  { url: "https://turso.tech", sourceGallery: "darkmodedesign.com" },
  { url: "https://trigger.dev", sourceGallery: "21st.dev" },
  { url: "https://inngest.com", sourceGallery: "landings.dev" },
  { url: "https://posthog.com", sourceGallery: "saaslandingpage.com" },
  { url: "https://plain.com", sourceGallery: "minimal.gallery" },
  { url: "https://campsite.com", sourceGallery: "refero.design" },
  { url: "https://amie.so", sourceGallery: "godly.website" },
  { url: "https://cron.com", sourceGallery: "a1.gallery" },
  { url: "https://arc.net", sourceGallery: "awwwards.com" },
  { url: "https://read.cv", sourceGallery: "minimal.gallery" },
  { url: "https://cosmos.so", sourceGallery: "curated.design" },
  { url: "https://workos.com", sourceGallery: "landings.dev" },
  { url: "https://liveblocks.io", sourceGallery: "21st.dev" },
  { url: "https://neon.tech", sourceGallery: "darkmodedesign.com" },
];

const IGNORED_DOMAINS = new Set([
  "twitter.com", "x.com", "github.com", "linkedin.com", "instagram.com",
  "youtube.com", "facebook.com", "fonts.googleapis.com", "fonts.gstatic.com",
  "googletagmanager.com", "cloudflare.com", "discord.gg", "discord.com",
  "deadsimplesites.com", "minimal.gallery", "httpster.net", "landings.dev", "a1.gallery",
]);

async function discoverOutboundLinksFromGalleries() {
  const discovered = [];
  await Promise.all(
    GALLERY_FEEDS.map(async (gallery) => {
      try {
        const res = await fetch(gallery.url, {
          signal: AbortSignal.timeout(6000),
          headers: { "User-Agent": "forma-discovery-bot/1.0 (+https://forma.to)" },
        });
        if (!res.ok) return;
        const html = await res.text();
        const links = [...html.matchAll(/href=["'](https?:\/\/[^"'#\s>]+)["']/gi)]
          .map((m) => m[1])
          .filter((href) => {
            try {
              const u = new URL(href);
              const host = u.hostname.replace(/^www\./, "");
              if (IGNORED_DOMAINS.has(host)) return false;
              if (/^(img|cdn|assets|static|media|api|fonts)\./i.test(u.hostname)) return false;
              if (/a1\.gallery|landings\.dev|darkmodedesign|saaslandingpage|lapa\.ninja/i.test(host)) return false;
              if (/\.(png|jpg|jpeg|svg|webp|css|js|xml|ico)$/i.test(u.pathname)) return false;
              return u.pathname === "/" || u.pathname.length < 16;
            } catch {
              return false;
            }
          });

        for (const link of [...new Set(links)].slice(0, 3)) {
          const origin = new URL(link).origin;
          discovered.push({ url: origin, sourceGallery: gallery.name });
        }
      } catch {
        // Ignore unreachable gallery feed silently
      }
    })
  );
  return discovered;
}

async function runDiscoveryCycle() {
  console.log(`[forma-crawler] Starting discovery pass at ${new Date().toISOString()}...`);
  const dynamicLinks = await discoverOutboundLinksFromGalleries();

  const candidateMap = new Map();
  for (const item of [...SEED_BENCHMARKS, ...dynamicLinks]) {
    const key = item.url.replace(/\/$/, "");
    if (!candidateMap.has(key)) candidateMap.set(key, item);
  }

  const candidates = [...candidateMap.values()].slice(0, 62);
  const results = [];

  // Process in polite batches of 8
  for (let i = 0; i < candidates.length; i += 8) {
    const batch = candidates.slice(i, i + 8);
    const settled = await Promise.allSettled(
      batch.map(async (cand) => {
        const xray = await analyzeWebsiteUrl(cand.url, { timeoutMs: 7500 });
        return {
          id: `live-${xray.hostname.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`,
          url: xray.url,
          hostname: xray.hostname,
          title: xray.title.slice(0, 72),
          description: xray.description.slice(0, 160),
          sourceGallery: cand.sourceGallery,
          scrapedAt: xray.analyzedAt,
          craftScore: xray.craftScore,
          grade: xray.antiSlopAudit.grade,
          strengths: xray.antiSlopAudit.strengths,
          mode: xray.layers.surface.mode,
          bg: xray.layers.surface.bg,
          ink: xray.layers.surface.ink,
          accent: xray.layers.surface.accent,
          palette: xray.layers.surface.topHexPalette.slice(0, 5).map((p) => p.value),
          primaryFont: xray.layers.typography.primaryFont,
          primaryEasing: xray.layers.motion.primaryEasing,
          bezierCurves: xray.layers.motion.bezierCurves.slice(0, 3),
          keyframes: xray.layers.motion.keyframes.slice(0, 6),
          motionEngines: xray.layers.motion.detectedEngines,
          honorsReducedMotion: xray.layers.motion.honorsReducedMotion,
        };
      })
    );

    for (const item of settled) {
      if (item.status === "fulfilled") {
        results.push(item.value);
        console.log(`  ✓ ${item.value.hostname} — Score ${item.value.craftScore} (${item.value.mode}, ${item.value.primaryFont})`);
      }
    }
  }

  // Merge with any previously discovered high-scoring entries
  let existingItems = [];
  if (existsSync(OUTPUT_PATH)) {
    try {
      const prev = JSON.parse(readFileSync(OUTPUT_PATH, "utf8"));
      existingItems = Array.isArray(prev.sites) ? prev.sites : [];
    } catch {
      existingItems = [];
    }
  }

  const mergedMap = new Map();
  for (const prevItem of existingItems) mergedMap.set(prevItem.hostname, prevItem);
  for (const freshItem of results) mergedMap.set(freshItem.hostname, freshItem);

  const ranked = [...mergedMap.values()]
    .sort((a, b) => b.craftScore - a.craftScore)
    .slice(0, 64);

  const payload = {
    lastCrawlAt: new Date().toISOString(),
    totalIndexed: ranked.length,
    galleriesMonitored: GALLERY_FEEDS.map((g) => g.name),
    sites: ranked,
  };

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, JSON.stringify(payload, null, 2), "utf8");
  console.log(`[forma-crawler] Saved ${ranked.length} ranked designs to src/data/discovered-feed.json`);
}

async function main() {
  const isWatch = process.argv.includes("--watch");
  const intervalArg = process.argv.find((a) => a.startsWith("--interval="));
  const intervalSec = intervalArg ? Math.max(60, Number(intervalArg.split("=")[1])) : 1800;

  await runDiscoveryCycle();

  if (isWatch) {
    console.log(`[forma-crawler] Watch daemon active — re-scanning galleries every ${intervalSec}s...`);
    setInterval(() => {
      runDiscoveryCycle().catch((err) => console.error("[forma-crawler] cycle error:", err.message));
    }, intervalSec * 1000);
  }
}

main().catch((err) => {
  console.error("[forma-crawler] fatal:", err);
  process.exit(1);
});
