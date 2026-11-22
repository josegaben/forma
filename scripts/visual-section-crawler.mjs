#!/usr/bin/env node
/**
 * forma Proprietary Visual Section Vault Crawler (Playwright + Gemini Vision + Clean DOM)
 *
 * Renders top benchmark & newly discovered websites in headless Chromium, extracts
 * canonical UI sections (navbar, hero, bento-features, pricing, cta-footer), saves
 * cropped section screenshots into public/section-vault/, distills Clean Semantic DOM
 * skeletons, and catalogs each section with Gemini 4 Hydrogen Vision (or Playwright
 * Computed Geometry fallback) into src/data/section-vault.json.
 *
 * Modes:
 *   node scripts/visual-section-crawler.mjs                 # Single deep pass
 *   node scripts/visual-section-crawler.mjs --limit=10      # Cap sites per pass
 *   node scripts/visual-section-crawler.mjs --watch         # Continuous daemon loop
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { scanWebsiteSections } from "../forma-xray/src/section-scanner.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const VAULT_JSON_PATH = resolve(__dirname, "../src/data/section-vault.json");
const DISCOVERED_PATH = resolve(__dirname, "../src/data/discovered-feed.json");
const SCREENSHOT_DIR = resolve(__dirname, "../public/section-vault");

const PRIORITY_VISUAL_SEEDS = [
  "https://treg.to",
  "https://resiz.es",
  "https://pdepablo.com",
  "https://www.rareui.com",
  "https://coss.com/ui",
  "https://kokonutui.com",
  "https://motion-primitives.com",
  "https://deadsimplesites.com",
  "https://www.raycast.com",
  "https://vercel.com",
  "https://stripe.com",
  "https://attio.com",
  "https://clerk.com",
  "https://www.fontshare.com",
  "https://evilmartians.com",
  "https://linear.app",
  "https://dub.co",
  "https://resend.com",
  "https://cal.com",
  "https://mintlify.com",
  "https://zed.dev",
  "https://midday.ai",
  "https://trigger.dev",
];

function inferDomainTags(hostname, siteTitle, cleanDom) {
  const blob = `${hostname} ${siteTitle} ${cleanDom}`.toLowerCase();
  const tags = new Set();
  if (/agent|mcp|llm|ai|prompt|model/.test(blob)) tags.add("ai-agents");
  if (/cli|sdk|api|developer|git|code|terminal|postgres|cloud|infra/.test(blob)) tags.add("devtools");
  if (/price|pricing|billing|invoice|finance|revenue|\$\d+/.test(blob)) tags.add("fintech-saas");
  if (/doc|guide|reference|knowledge/.test(blob)) tags.add("docs");
  if (/calendar|schedule|booking|workflow|team/.test(blob)) tags.add("productivity");
  if (tags.size === 0) tags.add("modern-saas");
  return [...tags];
}

async function runVisualVaultPass(limit = 8) {
  console.log(`[forma-visual-vault] Starting Playwright + Vision pass (limit=${limit})...`);
  const forceRefresh = process.argv.includes("--refresh");

  let existing = [];
  if (existsSync(VAULT_JSON_PATH)) {
    try {
      const prev = JSON.parse(readFileSync(VAULT_JSON_PATH, "utf8"));
      existing = Array.isArray(prev.sections) ? prev.sections : [];
    } catch {
      existing = [];
    }
  }
  const existingHosts = new Set(existing.map((s) => s.hostname.replace(/^www\./, "")));

  // Combine priority seeds + highest-scoring sites from discovered-feed.json
  const urls = [...PRIORITY_VISUAL_SEEDS];
  if (existsSync(DISCOVERED_PATH)) {
    try {
      const feed = JSON.parse(readFileSync(DISCOVERED_PATH, "utf8"));
      for (const s of feed.sites || []) {
        if (s.url && !urls.includes(s.url)) urls.push(s.url);
      }
    } catch {
      // ignore
    }
  }

  // Prioritize un-scanned flagship references first unless --refresh is passed
  const prioritized = forceRefresh
    ? urls
    : [
        ...urls.filter((u) => {
          try {
            return !existingHosts.has(new URL(u).hostname.replace(/^www\./, ""));
          } catch {
            return false;
          }
        }),
        ...urls,
      ].filter((u, idx, arr) => arr.indexOf(u) === idx);

  const targets = prioritized.slice(0, limit);
  const harvested = [];

  // Process 2 sites concurrently so Chromium memory stays featherlight and polite
  for (let i = 0; i < targets.length; i += 2) {
    const pair = targets.slice(i, i + 2);
    const settled = await Promise.allSettled(
      pair.map(async (targetUrl) => {
        const res = await scanWebsiteSections(targetUrl, {
          screenshotDir: SCREENSHOT_DIR,
          publicPrefix: "/section-vault",
          probePricingSubpage: true,
          timeoutMs: 20000,
        });
        return res;
      })
    );

    for (const item of settled) {
      if (item.status === "fulfilled" && item.value.sections.length > 0) {
        const { hostname, sections } = item.value;
        for (const sec of sections) {
          harvested.push({
            ...sec,
            tags: inferDomainTags(sec.hostname, sec.siteTitle, sec.cleanDom),
          });
        }
        console.log(
          `  ✓ ${hostname} — captured ${sections.length} sections (${sections
            .map((s) => s.kind)
            .join(", ")})`
        );
      } else if (item.status === "rejected") {
        console.warn(`  ⚠ Skipped site: ${item.reason?.message || item.reason}`);
      }
    }
  }

  // Merge with existing vault entries by section id
  if (existsSync(VAULT_JSON_PATH)) {
    try {
      const prev = JSON.parse(readFileSync(VAULT_JSON_PATH, "utf8"));
      existing = Array.isArray(prev.sections) ? prev.sections : [];
    } catch {
      existing = [];
    }
  }

  const merged = new Map();
  for (const oldSec of existing) merged.set(oldSec.id, oldSec);
  for (const newSec of harvested) merged.set(newSec.id, newSec);

  const allSections = [...merged.values()].sort(
    (a, b) => (b.vision?.visualCraftScore || 85) - (a.vision?.visualCraftScore || 85)
  );

  const countsByKind = allSections.reduce((acc, sec) => {
    acc[sec.kind] = (acc[sec.kind] || 0) + 1;
    return acc;
  }, {});

  const payload = {
    lastVisualScanAt: new Date().toISOString(),
    visionEngine:
      process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY
        ? `${process.env.FORMA_VISION_MODEL || "gemini-4-hydrogen"}-vision`
        : "playwright-computed-geometry (set GEMINI_API_KEY for Gemini 4 Hydrogen Vision)",
    totalSections: allSections.length,
    countsByKind,
    sections: allSections,
  };

  mkdirSync(dirname(VAULT_JSON_PATH), { recursive: true });
  writeFileSync(VAULT_JSON_PATH, JSON.stringify(payload, null, 2), "utf8");
  console.log(
    `[forma-visual-vault] Saved ${allSections.length} real visual sections (${JSON.stringify(
      countsByKind
    )}) to src/data/section-vault.json`
  );
}

async function main() {
  const isWatch = process.argv.includes("--watch");
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? Math.max(1, Number(limitArg.split("=")[1])) : 8;
  const intervalArg = process.argv.find((a) => a.startsWith("--interval="));
  const intervalSec = intervalArg ? Math.max(120, Number(intervalArg.split("=")[1])) : 3600;

  await runVisualVaultPass(limit);

  if (isWatch) {
    console.log(`[forma-visual-vault] Daemon active — deep-rendering new sections every ${intervalSec}s...`);
    setInterval(() => {
      runVisualVaultPass(limit).catch((e) =>
        console.error("[forma-visual-vault] pass error:", e.message)
      );
    }, intervalSec * 1000);
  }
}

main().catch((err) => {
  console.error("[forma-visual-vault] fatal:", err);
  process.exit(1);
});
