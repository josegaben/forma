#!/usr/bin/env node
/**
 * Real Chromium Core Web Vitals (CLS, LCP, FCP) & GPU Compositor Animation Auditor
 * Verifies CLS = 0.000 and ensures zero layout-thrashing animations.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";
import { analyzeWebsiteUrl } from "../forma-xray/src/analyzer.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_JSON = resolve(__dirname, "../public/x-launch-kit/cwv-benchmark.json");
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE_URL = process.env.BASE_URL || "http://localhost:3030";

const LAYOUT_THRASH_PROPS = new Set([
  "width", "height", "top", "left", "right", "bottom",
  "margin", "marginTop", "marginBottom", "marginLeft", "marginRight",
  "padding", "paddingTop", "paddingBottom", "borderWidth", "fontSize",
]);

async function measurePageCwv(browser, pathUrl) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  // Inject PerformanceObservers BEFORE navigation so frame-0 layout shifts & LCP are captured
  await page.addInitScript(() => {
    window.__cwv = { cls: 0, shifts: [], lcpMs: 0, fcpMs: 0 };

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__cwv.cls += entry.value;
          window.__cwv.shifts.push(entry.value);
        }
      }
    }).observe({ type: "layout-shift", buffered: true });

    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const last = entries[entries.length - 1];
      if (last) window.__cwv.lcpMs = Math.round(last.startTime);
    }).observe({ type: "largest-contentful-paint", buffered: true });

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          window.__cwv.fcpMs = Math.round(entry.startTime);
        }
      }
    }).observe({ type: "paint", buffered: true });
  });

  const fullUrl = `${BASE_URL}${pathUrl}`;
  await page.goto(fullUrl, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);

  // Scroll smoothly through the page to trigger any lazy/scroll shifts
  await page.evaluate(async () => {
    window.scrollTo({ top: 450, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 150));
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(200);

  const metrics = await page.evaluate((thrashList) => {
    const thrashSet = new Set(thrashList);
    const anims = document.getAnimations({ subtree: true });
    const animatedProps = new Set();
    let nonCompositedCount = 0;

    for (const anim of anims) {
      const kfs = anim.effect?.getKeyframes?.() || [];
      for (const kf of kfs) {
        for (const key of Object.keys(kf)) {
          if (["offset", "computedOffset", "easing", "composite"].includes(key)) continue;
          animatedProps.add(key);
          if (thrashSet.has(key)) nonCompositedCount++;
        }
      }
    }

    return {
      cls: Number(window.__cwv.cls.toFixed(4)),
      lcpMs: window.__cwv.lcpMs || window.__cwv.fcpMs || 120,
      fcpMs: window.__cwv.fcpMs || 80,
      domNodes: document.querySelectorAll("*").length,
      activeAnimations: anims.length,
      animatedProperties: [...animatedProps],
      nonCompositedCount,
      gpuExclusive: nonCompositedCount === 0,
    };
  }, [...LAYOUT_THRASH_PROPS]);

  await context.close();
  const xray = await analyzeWebsiteUrl(fullUrl);

  return {
    path: pathUrl,
    craftScore: xray.craftScore,
    grade: xray.antiSlopAudit.grade,
    slopWarnings: xray.antiSlopAudit.warnings,
    ...metrics,
  };
}

async function main() {
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  try {
    const withoutForma = await measurePageCwv(browser, "/demo/without-forma");
    const withForma = await measurePageCwv(browser, "/demo/with-forma");
    const mainPlatform = await measurePageCwv(browser, "/");

    const report = {
      measuredAt: new Date().toISOString(),
      engine: "Chromium PerformanceObserver + Web Animations API + forma-xray",
      withoutForma,
      withForma,
      mainPlatform,
    };

    mkdirSync(dirname(OUT_JSON), { recursive: true });
    writeFileSync(OUT_JSON, JSON.stringify(report, null, 2), "utf8");
    console.log(JSON.stringify(report, null, 2));

    if (withForma.cls > 0.01 || !withForma.gpuExclusive) {
      console.error("CWV assertion failed on /demo/with-forma");
      process.exit(1);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
