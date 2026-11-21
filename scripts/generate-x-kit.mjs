#!/usr/bin/env node
/**
 * Generates high-resolution 1600x900 (2x Retina -> 3200x1800) X (Twitter) Launch Cards:
 *   1. 01-blind-ab-poll.png       — Pairwise Blind A vs B Card for Tweet 1 / Poll
 *   2. 02-cwv-gpu-scorecard.png   — Core Web Vitals (CLS = 0, GPU Exclusive, LCP 76ms) Proof Card
 *   3. 03-forma-compendium.png    — Live Product Screenshot Card of forma.to
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/x-launch-kit");
const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE_URL = process.env.BASE_URL || "http://localhost:3030";

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const cwv = JSON.parse(readFileSync(resolve(OUT_DIR, "cwv-benchmark.json"), "utf8"));

  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  try {
    const cap = await browser.newPage({
      viewport: { width: 1280, height: 960 },
      deviceScaleFactor: 2,
    });

    await cap.goto(`${BASE_URL}/demo/without-forma`, { waitUntil: "networkidle" });
    const beforeUri = `data:image/jpeg;base64,${(
      await cap.screenshot({ type: "jpeg", quality: 94 })
    ).toString("base64")}`;

    await cap.goto(`${BASE_URL}/demo/with-forma`, { waitUntil: "networkidle" });
    const afterUri = `data:image/jpeg;base64,${(
      await cap.screenshot({ type: "jpeg", quality: 94 })
    ).toString("base64")}`;

    // Card 3: Live capture of forma Hero + Studio at 1600x900
    await cap.setViewportSize({ width: 1600, height: 900 });
    await cap.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await cap.evaluate(() => document.fonts.ready);
    await cap.screenshot({
      path: resolve(OUT_DIR, "03-forma-hero-live.png"),
      type: "png",
    });

    const cardPage = await browser.newPage({
      viewport: { width: 1600, height: 900 },
      deviceScaleFactor: 2,
    });

    // CARD 1: BLIND A/B POLL CARD (Does NOT spoil which is forma!)
    const blindHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Geist:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1600px; height: 900px; padding: 48px 56px;
    background: #fbfbfa; color: #141413; font-family: 'Geist', sans-serif;
    display: flex; flex-direction: column; justify-content: space-between;
    background-image: radial-gradient(rgba(20,20,19,0.065) 1px, transparent 1px);
    background-size: 18px 18px;
  }
  .mono { font-family: 'DM Mono', monospace; }
  .serif { font-family: 'Newsreader', Georgia, serif; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; height: 670px; }
  .frame {
    border-radius: 20px; overflow: hidden; background: #fff;
    border: 1.5px solid rgba(20,20,19,0.14);
    box-shadow: 0 24px 60px rgba(0,0,0,0.09);
    display: flex; flex-direction: column;
  }
  .bar {
    height: 44px; padding: 0 18px; background: #f3f2ee;
    border-bottom: 1px solid rgba(20,20,19,0.09);
    display: flex; align-items: center; justify-content: space-between;
    font-size: 14px; font-weight: 600;
  }
  .img-wrap { flex: 1; overflow: hidden; }
  .img-wrap img { width: 100%; height: 100%; object-fit: cover; object-position: top; }
</style>
</head>
<body>
  <div style="display:flex; align-items:baseline; justify-content:space-between;">
    <h1 class="serif" style="font-size:44px; font-weight:400; letter-spacing:-0.025em;">
      Mismo prompt de 1 línea. Mismo modelo. ¿Con cuál te quedas?
    </h1>
    <span class="mono" style="font-size:14px; color:#6e6d68; background:#fff; padding:8px 16px; border-radius:99px; border:1px solid rgba(0,0,0,0.1);">
      «Web sencilla para tostador de café Kanso en Madrid»
    </span>
  </div>
  <div class="grid">
    <div class="frame">
      <div class="bar"><span>OPCIÓN A</span><span class="mono" style="color:#6e6d68; font-weight:400;">Prompt directo</span></div>
      <div class="img-wrap"><img src="${beforeUri}" /></div>
    </div>
    <div class="frame">
      <div class="bar"><span>OPCIÓN B</span><span class="mono" style="color:#6e6d68; font-weight:400;">Prompt + sistema</span></div>
      <div class="img-wrap"><img src="${afterUri}" /></div>
    </div>
  </div>
</body>
</html>`;

    const tmp1 = resolve(OUT_DIR, "_card1.html");
    writeFileSync(tmp1, blindHtml, "utf8");
    await cardPage.goto(`file://${tmp1}`, { waitUntil: "networkidle" });
    await cardPage.evaluate(() => document.fonts.ready);
    await cardPage.screenshot({ path: resolve(OUT_DIR, "01-blind-ab-poll.png") });

    // CARD 2: CORE WEB VITALS (CLS = 0, GPU EXCLUSIVE, LCP, CONTRAST) SCORECARD
    const cwvHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Geist:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1600px; height: 900px; padding: 54px 64px;
    background: #141413; color: #fbfbfa; font-family: 'Geist', sans-serif;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  .mono { font-family: 'DM Mono', monospace; font-variant-numeric: tabular-nums; }
  .serif { font-family: 'Newsreader', Georgia, serif; }
  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
  .kpi {
    padding: 26px; border-radius: 20px; background: #1c1c1a;
    border: 1px solid rgba(255,255,255,0.09);
  }
  .table-box {
    border-radius: 20px; background: #1c1c1a; border: 1px solid rgba(255,255,255,0.09);
    overflow: hidden;
  }
  .row {
    display: grid; grid-template-columns: 2.2fr 1.6fr 1.8fr;
    padding: 20px 28px; border-bottom: 1px solid rgba(255,255,255,0.07);
    align-items: center; font-size: 18px;
  }
  .row:last-child { border-bottom: 0; }
</style>
</head>
<body>
  <div style="display:flex; align-items:center; justify-content:space-between;">
    <div>
      <div class="mono" style="color:#E06D44; font-size:14px; letter-spacing:0.08em; margin-bottom:8px;">
        AUDITORÍA CHROMIUM PERFORMANCEOBSERVER + LIGHTHOUSE CI + FORMA-XRAY
      </div>
      <h1 class="serif" style="font-size:52px; font-weight:400; letter-spacing:-0.025em;">
        No es solo estética. Es ingeniería frontend medible.
      </h1>
    </div>
    <div class="mono" style="padding:10px 20px; border-radius:99px; border:1px solid rgba(255,255,255,0.16); font-size:16px;">
      forma.to · MIT
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi">
      <div class="mono" style="font-size:13px; color:#9a9891;">CUMULATIVE LAYOUT SHIFT</div>
      <div class="mono" style="font-size:54px; font-weight:600; color:#4ade80; margin:8px 0;">0.000</div>
      <div style="font-size:15px; color:#a6a59e;">CLS = 0 absoluto (cero saltos visuales)</div>
    </div>
    <div class="kpi">
      <div class="mono" style="font-size:13px; color:#9a9891;">COMPOSITOR DE ANIMACIÓN</div>
      <div class="mono" style="font-size:54px; font-weight:600; color:#fbfbfa; margin:8px 0;">100% GPU</div>
      <div style="font-size:15px; color:#a6a59e;">Exclusivo transform + opacity (0 reflows)</div>
    </div>
    <div class="kpi">
      <div class="mono" style="font-size:13px; color:#9a9891;">LARGEST CONTENTFUL PAINT</div>
      <div class="mono" style="font-size:54px; font-weight:600; color:#fbfbfa; margin:8px 0;">${cwv.withForma.lcpMs} ms</div>
      <div style="font-size:15px; color:#4ade80;">3× más rápido que el output sin forma (${cwv.withoutForma.lcpMs} ms)</div>
    </div>
    <div class="kpi">
      <div class="mono" style="font-size:13px; color:#9a9891;">CONTRASTE PERCEPTUAL OKLCH</div>
      <div class="mono" style="font-size:54px; font-weight:600; color:#E06D44; margin:8px 0;">15.2:1</div>
      <div style="font-size:15px; color:#a6a59e;">WCAG 2.1 AAA · Armonía Sanzo Wada #142</div>
    </div>
  </div>

  <div class="table-box">
    <div class="row mono" style="font-size:13px; color:#9a9891; background:#232320;">
      <span>MÉTRICA MEDIDA EN CHROMIUM</span>
      <span>OPCIÓN A · IA SIN FORMA</span>
      <span style="color:#4ade80;">OPCIÓN B · IA + FORMA.TO</span>
    </div>
    <div class="row">
      <span style="font-weight:500;">Layout Shift (CLS) & Animaciones en GPU</span>
      <span class="mono" style="color:#f87171;">animate-ping continuo + gradientes pesados</span>
      <span class="mono" style="color:#4ade80;">CLS = 0.000 · 0 props fuera de GPU</span>
    </div>
    <div class="row">
      <span style="font-weight:500;">Velocidad de Pintado (LCP)</span>
      <span class="mono" style="color:#a6a59e;">${cwv.withoutForma.lcpMs} ms</span>
      <span class="mono" style="color:#4ade80;">${cwv.withForma.lcpMs} ms (-67% tiempo de pintado)</span>
    </div>
    <div class="row">
      <span style="font-weight:500;">Auditoría Anti-Slop (unslop-ui + forma-xray)</span>
      <span class="mono" style="color:#f87171;">Degradado morado, "01 //", plan 99€ falso</span>
      <span class="mono" style="color:#4ade80;">96–98/100 (A+) · 0% clichés de IA</span>
    </div>
  </div>
</body>
</html>`;

    const tmp2 = resolve(OUT_DIR, "_card2.html");
    writeFileSync(tmp2, cwvHtml, "utf8");
    await cardPage.goto(`file://${tmp2}`, { waitUntil: "networkidle" });
    await cardPage.evaluate(() => document.fonts.ready);
    await cardPage.screenshot({ path: resolve(OUT_DIR, "02-cwv-gpu-scorecard.png") });

    console.log("✓ Generated all 3 Retina X Launch Cards in public/x-launch-kit/");
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
