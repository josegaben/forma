#!/usr/bin/env node
/**
 * Renders the English 1920x1080 H.264 MP4 launch video (`public/forma-ab-demo-en.mp4`)
 * comparing:
 *   Control A: Same simple prompt in ChatGPT/raw AI WITHOUT forma (English)
 *   Experimental B: Exact same prompt WITH forma DESIGN.md (English)
 */

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const FRAMES_DIR = resolve(ROOT, ".video_frames_en_tmp");
const OUTPUT_MP4 = resolve(ROOT, "public/forma-ab-demo-en.mp4");

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium-browser",
].filter(Boolean);

const FPS = 30;
const DURATION_SEC = 22;
const TOTAL_FRAMES = FPS * DURATION_SEC;

function buildControlAHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #020617; color: #ffffff; font-family: 'Inter', -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
  .nav { border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(15,23,42,0.85); padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; }
  .brand { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 20px; }
  .brand-icon { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(45deg, #9333ea, #ec4899); display: flex; align-items: center; justify-content: center; }
  .brand-text { background: linear-gradient(90deg, #c084fc, #f472b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .nav-links { display: flex; align-items: center; gap: 24px; font-size: 14px; color: #cbd5e1; }
  .cta-grad { padding: 9px 18px; border-radius: 999px; background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899); color: #fff; font-weight: 700; border: 0; box-shadow: 0 10px 25px rgba(168,85,247,0.35); }
  .hero { padding: 76px 24px; text-align: center; background: radial-gradient(circle at top, rgba(79,70,229,0.35), rgba(88,28,135,0.18), #020617 72%); }
  .eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 999px; background: rgba(168,85,247,0.15); border: 1px solid rgba(192,132,252,0.3); color: #d8b4fe; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 22px; }
  .dot { width: 8px; height: 8px; border-radius: 99px; background: #4ade80; }
  .hero h1 { font-size: 52px; font-weight: 800; max-width: 780px; margin: 0 auto; line-height: 1.12; }
  .hero p { margin: 20px auto 0; font-size: 18px; color: #94a3b8; max-width: 660px; line-height: 1.55; }
  .hero-btns { margin-top: 30px; display: flex; justify-content: center; gap: 16px; }
  .btn-main { padding: 14px 28px; border-radius: 999px; background: linear-gradient(90deg, #6366f1, #9333ea); color: #fff; font-weight: 700; font-size: 15px; border: 0; box-shadow: 0 14px 30px rgba(147,51,234,0.35); }
  .btn-ghost { padding: 14px 28px; border-radius: 999px; background: #0f172a; border: 1px solid #334155; color: #cbd5e1; font-size: 15px; }
  .sec { padding: 56px 32px; max-width: 1120px; margin: 0 auto; }
  .sec-head { text-align: center; margin-bottom: 40px; }
  .sec-kicker { font-size: 12px; font-weight: 700; letter-spacing: 0.12em; color: #c084fc; margin-bottom: 8px; }
  .grid3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .card { padding: 24px; border-radius: 18px; background: rgba(15,23,42,0.92); border: 1px solid rgba(168,85,247,0.22); }
  .icon-circle { width: 48px; height: 48px; border-radius: 99px; background: rgba(168,85,247,0.2); display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 16px; }
  .price-card { padding: 24px; border-radius: 18px; background: #0f172a; border: 1px solid #1e293b; position: relative; }
  .price-pop { background: linear-gradient(180deg, rgba(88,28,135,0.45), #0f172a); border: 2px solid #a855f7; }
  .pop-badge { position: absolute; top: -12px; right: 16px; padding: 3px 12px; border-radius: 99px; background: #a855f7; font-size: 10px; font-weight: 700; }
</style>
</head>
<body>
  <nav class="nav">
    <div class="brand"><span class="brand-icon">☕</span><span class="brand-text">KansoCoffee</span></div>
    <div class="nav-links"><span>Home</span><span>Features</span><span>Pricing</span><button class="cta-grad">Get Started Free! 🚀</button></div>
  </nav>
  <section class="hero">
    <div class="eyebrow"><span class="dot"></span><span>● LIVE · 01 // THE FUTURE OF COFFEE IN MADRID</span></div>
    <h1>Supercharge your mornings and take your coffee to the <span class="brand-text">next level</span></h1>
    <p>At Kanso we revolutionize the way you experience specialty coffee through a seamless, frictionless morning workflow built to unlock your daily potential.</p>
    <div class="hero-btns"><button class="btn-main">Subscribe Now ✨</button><button class="btn-ghost">Learn More</button></div>
  </section>
  <section class="sec">
    <div class="sec-head">
      <div class="sec-kicker">02 // WHY CHOOSE US</div>
      <h2 style="font-size:30px; font-weight:800;">Powerful features built for you</h2>
      <p style="color:#94a3b8; margin-top:8px;">Discover all the amazing features that make our coffee subscription stand out.</p>
    </div>
    <div class="grid3">
      <div class="card"><div class="icon-circle">⚡</div><div style="font-size:11px; font-weight:700; color:#c084fc; margin-bottom:4px;">01 // QUALITY</div><h3 style="font-size:20px; font-weight:700; margin-bottom:8px;">100% Premium Beans</h3><p style="font-size:14px; color:#94a3b8; line-height:1.55;">We carefully curate the world's finest beans to guarantee an unmatched cup every morning.</p></div>
      <div class="card"><div class="icon-circle">🚀</div><div style="font-size:11px; font-weight:700; color:#c084fc; margin-bottom:4px;">02 // SPEED</div><h3 style="font-size:20px; font-weight:700; margin-bottom:8px;">Ultra-Fast Delivery</h3><p style="font-size:14px; color:#94a3b8; line-height:1.55;">Our smart logistics engine delivers your subscription straight to your doorstep with zero friction.</p></div>
      <div class="card"><div class="icon-circle">💎</div><div style="font-size:11px; font-weight:700; color:#c084fc; margin-bottom:4px;">03 // EXPERIENCE</div><h3 style="font-size:20px; font-weight:700; margin-bottom:8px;">Game-Changing Flavor</h3><p style="font-size:14px; color:#94a3b8; line-height:1.55;">Transform your daily routine with aromatic profiles engineered to maximize your productivity.</p></div>
    </div>
  </section>
  <section class="sec" style="padding-top:16px;">
    <div class="sec-head"><div class="sec-kicker" style="color:#f472b6;">03 // FLEXIBLE PLANS</div><h2 style="font-size:28px; font-weight:800;">Pick the right tier to scale your energy</h2></div>
    <div class="grid3">
      <div class="price-card"><div style="color:#94a3b8; font-size:14px;">Starter</div><div style="font-size:32px; font-weight:800; margin:8px 0;">$19<span style="font-size:14px; font-weight:400;">/mo</span></div><button style="margin-top:12px; width:100%; padding:10px; border-radius:10px; background:#1e293b; color:#fff; border:0; font-weight:600;">Choose Starter</button></div>
      <div class="price-card price-pop"><span class="pop-badge">MOST POPULAR 🔥</span><div style="color:#d8b4fe; font-size:14px;">Pro Roaster</div><div style="font-size:32px; font-weight:800; margin:8px 0;">$39<span style="font-size:14px; font-weight:400;">/mo</span></div><button style="margin-top:12px; width:100%; padding:10px; border-radius:10px; background:#9333ea; color:#fff; border:0; font-weight:700;">Choose Pro</button></div>
      <div class="price-card"><div style="color:#94a3b8; font-size:14px;">Enterprise</div><div style="font-size:32px; font-weight:800; margin:8px 0;">$99<span style="font-size:14px; font-weight:400;">/mo</span></div><button style="margin-top:12px; width:100%; padding:10px; border-radius:10px; background:#1e293b; color:#fff; border:0; font-weight:600;">Contact Sales</button></div>
    </div>
  </section>
</body>
</html>`;
}

function buildExperimentalBHtml() {
  const photoPath = resolve(ROOT, "public/showcase/kanso-editorial.jpg");
  const photoB64 = existsSync(photoPath)
    ? `data:image/jpeg;base64,${readFileSync(photoPath).toString("base64")}`
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Geist:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f5f1e8; color: #1f1b18; font-family: 'Geist', sans-serif; padding-bottom: 96px; -webkit-font-smoothing: antialiased; }
  .mono { font-family: 'DM Mono', monospace; font-variant-numeric: tabular-nums; }
  .serif { font-family: 'Newsreader', Georgia, serif; }
  .wrap { max-width: 1120px; margin: 0 auto; padding: 0 28px; }
  header { padding: 22px 28px; max-width: 1120px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(31,27,24,0.12); }
  .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center; padding-top: 44px; }
  h1 { font-size: 52px; line-height: 1.03; letter-spacing: -0.03em; font-weight: 400; }
  .lead { margin-top: 18px; font-size: 15.5px; line-height: 1.65; color: #5e554d; }
  .cta { display: inline-block; padding: 13px 24px; border-radius: 999px; background: #c4492b; color: #fbf9f4; font-size: 13.5px; font-weight: 500; border: 0; }
  .photo-frame { border-radius: 20px; padding: 10px; background: #fbf9f4; border: 1px solid rgba(31,27,24,0.12); }
  .photo-inner { position: relative; border-radius: 14px; overflow: hidden; height: 320px; }
  .photo-inner img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .bento-grid { display: grid; grid-template-columns: 7fr 5fr; gap: 24px; margin-top: 44px; }
  .ledger-card { border-radius: 18px; padding: 26px; background: #fbf9f4; border: 1px solid rgba(31,27,24,0.11); }
  .row { padding: 16px 0; display: grid; grid-template-columns: 80px 1fr 90px 80px; gap: 12px; align-items: baseline; border-bottom: 1px solid rgba(31,27,24,0.10); }
  .walnut-card { border-radius: 18px; padding: 28px; background: #1f1b18; color: #fbf9f4; display: flex; flex-direction: column; justify-content: space-between; }
  .dock { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); padding: 8px 18px; border-radius: 999px; background: rgba(251,249,244,0.9); border: 1px solid rgba(31,27,24,0.12); display: flex; align-items: center; gap: 20px; font-size: 12px; }
</style>
</head>
<body>
  <header>
    <div style="display:flex; align-items:baseline; gap:12px;">
      <span class="serif" style="font-size:24px;">Kanso</span>
      <span class="mono" style="font-size:11px; color:#6d645b;">Roasters · Chamberí, Madrid</span>
    </div>
    <div class="mono" style="display:flex; gap:20px; align-items:center; font-size:12px; color:#6d645b;">
      <span>Nov 2026 Harvest</span><span>C/ Trafalgar 14</span><span style="padding:4px 12px; border-radius:99px; background:#e7dfd0; color:#1f1b18;">Next roast: Tue 07:00</span>
    </div>
  </header>
  <main class="wrap">
    <section class="hero-grid">
      <div>
        <h1 class="serif">Single-origin coffee roasted every Tuesday in <em style="color:#c4492b;">small batches.</em></h1>
        <p class="lead">We source three seasonal micro-lots directly from growers in Huila, Gedeb, and Usulután. Roasted on our Loring S15 drum in Madrid and dispatched within 24 hours.</p>
        <div style="margin-top:24px; display:flex; align-items:center; gap:14px;">
          <button class="cta">Join Tuesday's roast · €24 →</button>
          <span style="padding:12px 20px; border-radius:99px; background:#fbf9f4; border:1px solid rgba(31,27,24,0.18); font-size:13px;">Explore 3 origins</span>
        </div>
        <div style="margin-top:26px; padding-top:20px; border-top:1px solid rgba(31,27,24,0.12); display:grid; grid-template-columns:repeat(3,1fr); gap:16px;">
          <div><div class="serif" style="font-size:22px;">88.5 pts</div><div class="mono" style="font-size:11px; color:#6d645b;">Mean SCA score</div></div>
          <div><div class="serif" style="font-size:22px;">204.5 °C</div><div class="mono" style="font-size:11px; color:#6d645b;">First crack · 08:42</div></div>
          <div><div class="serif" style="font-size:22px;">&lt; 24 h</div><div class="mono" style="font-size:11px; color:#6d645b;">Drum to doorstep</div></div>
        </div>
      </div>
      <div class="photo-frame">
        <div class="photo-inner">
          <img src="${photoB64}" alt="Kanso Madrid Lot 04" />
          <div style="position:absolute; bottom:12px; left:12px; right:12px; border-radius:11px; padding:10px 14px; background:rgba(251,249,244,0.92); display:flex; justify-content:space-between; align-items:center;">
            <div><div class="mono" style="font-size:10px; color:#c4492b;">LOT 04 · FINCA EL PUENTE (1,950 M)</div><div style="font-size:13px; font-weight:500;">Red plum · Raw panela · Dark cacao</div></div>
            <span class="mono" style="font-size:12px; font-weight:600;">SCA 88.5</span>
          </div>
        </div>
      </div>
    </section>
    <section class="bento-grid">
      <div class="ledger-card">
        <div class="mono" style="padding-bottom:10px; border-bottom:1px solid rgba(31,27,24,0.14); display:flex; justify-content:space-between; font-size:11px; color:#6d645b;"><span>Current harvest menu · 3 farms</span><span>Light–medium omni roast</span></div>
        <div class="row"><span class="mono" style="font-size:11px; color:#c4492b;">LOT 04</span><div><div style="font-size:15px; font-weight:500;">Finca El Puente · Huila, Colombia</div><div style="font-size:12.5px; color:#6d645b;">Red plum, raw panela & 85% cacao</div></div><span class="mono" style="font-size:11.5px; color:#6d645b;">SCA 88.5</span><span class="mono" style="font-size:13px; text-align:right; font-weight:500;">€14.50</span></div>
        <div class="row"><span class="mono" style="font-size:11px; color:#c4492b;">LOT 05</span><div><div style="font-size:15px; font-weight:500;">Worka Sakaro · Gedeb, Ethiopia</div><div style="font-size:12.5px; color:#6d645b;">Bergamot, white jasmine & peach</div></div><span class="mono" style="font-size:11.5px; color:#6d645b;">SCA 89.0</span><span class="mono" style="font-size:13px; text-align:right; font-weight:500;">€16.00</span></div>
        <div class="row" style="border-bottom:0;"><span class="mono" style="font-size:11px; color:#c4492b;">LOT 06</span><div><div style="font-size:15px; font-weight:500;">Los Pirineos · Usulután, El Salvador</div><div style="font-size:12.5px; color:#6d645b;">Hazelnut, orange blossom & mandarin</div></div><span class="mono" style="font-size:11.5px; color:#6d645b;">SCA 87.8</span><span class="mono" style="font-size:13px; text-align:right; font-weight:500;">€14.00</span></div>
      </div>
      <div class="walnut-card">
        <div>
          <span class="mono" style="display:inline-block; padding:4px 10px; border-radius:99px; background:rgba(251,249,244,0.12); color:#e7dfd0; font-size:10.5px;">Monthly subscription · Cancel anytime</span>
          <h3 class="serif" style="font-size:27px; line-height:1.1; font-weight:400; margin-top:12px;">Two distinct single-origin bags every first Tuesday.</h3>
          <p style="font-size:13px; color:#b8afa4; margin-top:10px; line-height:1.55;">2 × 250 g freshly roasted bags with V60 & espresso recipes. Pause or skip in one click.</p>
        </div>
        <div style="padding-top:18px; border-top:1px solid rgba(251,249,244,0.12); display:flex; align-items:flex-end; justify-content:space-between;">
          <div><div class="mono" style="font-size:28px; font-weight:600;">€24</div><div class="mono" style="font-size:11px; color:#b8afa4;">24h shipping included</div></div>
          <button class="cta">Start subscription →</button>
        </div>
      </div>
    </section>
  </main>
  <div class="dock"><span>Harvest (3)</span><span style="color:#6d645b;">Roastery</span><span style="color:#6d645b;">Subscription</span><span class="mono" style="padding:4px 12px; border-radius:99px; background:#1f1b18; color:#fbf9f4; font-size:11px;">€24 / mo</span></div>
</body>
</html>`;
}

function buildEnglishStageHtml(beforeDataUri, afterDataUri) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Geist:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1920px;
    height: 1080px;
    overflow: hidden;
    background-color: #fbfbfa;
    background-image: radial-gradient(rgba(20, 20, 19, 0.07) 1.2px, transparent 1.2px);
    background-size: 20px 20px;
    color: #141413;
    font-family: 'Geist', -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    position: relative;
  }
  .mono { font-family: 'DM Mono', monospace; font-variant-numeric: tabular-nums; }
  .serif { font-family: 'Newsreader', Georgia, serif; }

  .topbar {
    position: absolute;
    top: 38px;
    left: 64px;
    right: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 50;
  }
  .logo { display: flex; align-items: center; gap: 14px; }
  .pill-tag {
    padding: 8px 18px;
    border-radius: 999px;
    background: rgba(255,255,255,0.92);
    border: 1px solid rgba(20,20,19,0.10);
    font-size: 15px;
    color: #6e6d68;
  }

  .scene {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
  }

  .browser-card {
    width: 1180px;
    height: 780px;
    border-radius: 22px;
    overflow: hidden;
    background: #fff;
    border: 1px solid rgba(20,20,19,0.14);
    box-shadow: 0 30px 80px rgba(20,20,19,0.14), 0 4px 16px rgba(20,20,19,0.06);
    display: flex;
    flex-direction: column;
  }
  .browser-bar {
    height: 44px;
    background: #f3f2ee;
    border-bottom: 1px solid rgba(20,20,19,0.09);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 18px;
    font-size: 13px;
    color: #6e6d68;
  }
  .dots { display: flex; gap: 7px; }
  .dots span { width: 11px; height: 11px; border-radius: 99px; background: rgba(20,20,19,0.22); }
  .viewport {
    flex: 1;
    position: relative;
    overflow: hidden;
    background: #020617;
  }
  .viewport img {
    width: 100%;
    display: block;
    transform-origin: top center;
  }

  .audit-col {
    width: 520px;
    margin-left: 48px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .score-box {
    padding: 26px 28px;
    border-radius: 20px;
    background: #fff;
    border: 1px solid rgba(20,20,19,0.10);
    box-shadow: 0 12px 32px rgba(20,20,19,0.06);
  }
  .check-pill {
    padding: 14px 18px;
    border-radius: 14px;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 12px;
    background: #fff;
    border: 1px solid rgba(20,20,19,0.09);
  }
</style>
</head>
<body>
  <div class="topbar">
    <div class="logo">
      <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#141413"/>
        <path d="M7.5 8.5C7.5 7.95 7.95 7.5 8.5 7.5H24.5C25.05 7.5 25.5 7.95 25.5 8.5V11.75C25.5 12.3 25.05 12.75 24.5 12.75H12.75V13.75H7.5V8.5Z" fill="#FAF9F6"/>
        <rect x="13.25" y="14.75" width="9.25" height="4.75" rx="1.25" fill="#E06D44"/>
        <rect x="7.5" y="14.75" width="4.25" height="9.75" rx="1.25" fill="#FAF9F6"/>
        <rect x="19.75" y="21.25" width="5.75" height="3.25" rx="1" fill="#FAF9F6" fill-opacity="0.5"/>
      </svg>
      <span style="font-size: 25px; font-weight: 600; letter-spacing: -0.04em;">forma<span class="mono" style="font-size:17px; color:#8a8880; font-weight:400;">.to</span></span>
    </div>
    <div id="phase-badge" class="pill-tag mono">BLIND A/B BENCHMARK · SAME PROMPT</div>
  </div>

  <!-- SCENE 1: THE SIMPLE PROMPT -->
  <div id="scene-1" class="scene" style="flex-direction:column; text-align:center; padding: 0 140px;">
    <div class="mono" style="font-size: 16px; color:#E06D44; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:20px;">
      BEFORE & AFTER BENCHMARK
    </div>
    <h1 class="serif" style="font-size: 76px; font-weight:400; letter-spacing:-0.03em; line-height:1.03; margin-bottom: 38px;">
      Same dead-simple prompt.<br/>Same AI model. Zero templates.
    </h1>
    <div style="width: 1120px; background:#fff; border:1.5px solid rgba(20,20,19,0.15); border-radius:24px; padding:28px 34px; box-shadow:0 20px 50px rgba(0,0,0,0.06); text-align:left;">
      <div class="mono" style="font-size:13px; color:#8a8880; margin-bottom:10px;">PROMPT SENT TO THE AGENT:</div>
      <div id="typed-prompt" style="font-size:26px; line-height:1.4; color:#141413; font-weight:500; min-height:72px;"></div>
    </div>
  </div>

  <!-- SCENE 2: WITHOUT FORMA (AI SLOP) -->
  <div id="scene-2" class="scene" style="padding-top: 44px;">
    <div class="browser-card">
      <div class="browser-bar mono">
        <div class="dots"><span></span><span></span><span></span></div>
        <span>kanso-coffee-ai-default.app — Without forma (Raw LLM)</span>
        <span style="color:#dc2626; font-weight:500;">SLOP DETECTED</span>
      </div>
      <div class="viewport">
        <img id="img-before" src="${beforeDataUri}" alt="Without forma" />
      </div>
    </div>
    <div class="audit-col">
      <div class="score-box" style="border-color: rgba(220,38,38,0.28); background:#fffafa;">
        <div class="mono" style="font-size:13px; color:#dc2626; text-transform:uppercase;">WITHOUT FORMA · DEFAULT CHATGPT / LLM</div>
        <div class="mono" style="font-size:64px; font-weight:700; color:#dc2626; line-height:1.05; margin-top:6px;">34<span style="font-size:26px; opacity:0.65;">/100</span></div>
        <div style="font-size:16px; color:#6e6d68; margin-top:6px;">Automated forma-xray craft audit</div>
      </div>
      <div class="check-pill" id="bad-1"><span style="color:#dc2626; font-weight:700;">✕</span> Generic AI purple-to-pink neon gradient</div>
      <div class="check-pill" id="bad-2"><span style="color:#dc2626; font-weight:700;">✕</span> Fake "01 //" eyebrows & pulsing LIVE dot</div>
      <div class="check-pill" id="bad-3"><span style="color:#dc2626; font-weight:700;">✕</span> 3 cloned icon cards + SaaS buzzwords</div>
      <div class="check-pill" id="bad-4"><span style="color:#dc2626; font-weight:700;">✕</span> "$99/mo Enterprise" tier for a local roaster</div>
    </div>
  </div>

  <!-- SCENE 3: CONNECTING FORMA -->
  <div id="scene-3" class="scene" style="flex-direction:column; padding: 0 120px;">
    <div class="mono" style="font-size:15px; color:#118453; margin-bottom:14px;">ONE-LINE AGENT CONNECTION (MCP / LLMS.TXT)</div>
    <h2 class="serif" style="font-size:62px; font-weight:400; letter-spacing:-0.03em; margin-bottom:32px;">
      forma cross-pollinates elite web DNA for your idea
    </h2>
    <div style="background:#141413; color:#fbfbfa; border-radius:18px; padding:20px 28px; width:920px; display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; box-shadow:0 20px 50px rgba(0,0,0,0.16);">
      <span class="mono" style="font-size:20px;"><span style="color:#706f69;">$</span> set up forma - https://forma.to/llms.txt</span>
      <span class="mono" style="background:#fff; color:#141413; padding:6px 18px; border-radius:99px; font-size:15px; font-weight:500;">✓ DESIGN.md</span>
    </div>
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:18px; width:1360px;">
      <div id="mix-1" class="score-box" style="padding:22px;">
        <div class="mono" style="font-size:12px; color:#8a8880;">01 · 60-30-10 PALETTE</div>
        <div style="display:flex; height:18px; border-radius:99px; overflow:hidden; margin:14px 0; border:1px solid rgba(0,0,0,0.12);">
          <span style="width:55%; background:#f5f1e8;"></span>
          <span style="width:25%; background:#1f1b18;"></span>
          <span style="width:20%; background:#c4492b;"></span>
        </div>
        <div style="font-size:18px; font-weight:600;">Sanzo Wada #142</div>
        <div class="mono" style="font-size:13px; color:#118453; margin-top:4px;">15.2:1 WCAG AAA</div>
      </div>
      <div id="mix-2" class="score-box" style="padding:22px;">
        <div class="mono" style="font-size:12px; color:#8a8880;">02 · TYPOGRAPHY</div>
        <div class="serif" style="font-size:38px; margin:8px 0;">Aa Bb</div>
        <div style="font-size:18px; font-weight:600;">Newsreader + Geist</div>
        <div class="mono" style="font-size:13px; color:#6e6d68; margin-top:4px;">tabular-nums active</div>
      </div>
      <div id="mix-3" class="score-box" style="padding:22px;">
        <div class="mono" style="font-size:12px; color:#8a8880;">03 · ARCHITECTURE</div>
        <div class="mono" style="font-size:15px; background:#f3f2ee; padding:8px 12px; border-radius:8px; margin:12px 0; display:inline-block;">1px Ledger + Dock</div>
        <div style="font-size:18px; font-weight:600;">DeadSimple × P de Pablo</div>
        <div class="mono" style="font-size:13px; color:#6e6d68; margin-top:4px;">860px HTML Skeleton</div>
      </div>
      <div id="mix-4" class="score-box" style="padding:22px;">
        <div class="mono" style="font-size:12px; color:#8a8880;">04 · GUARDRAILS</div>
        <div class="mono" style="font-size:15px; background:#ecfdf5; color:#118453; padding:8px 12px; border-radius:8px; margin:12px 0; display:inline-block;">unslop-ui active</div>
        <div style="font-size:18px; font-weight:600;">0% AI Slop Clichés</div>
        <div class="mono" style="font-size:13px; color:#6e6d68; margin-top:4px;">CLS = 0.000 · 100% GPU</div>
      </div>
    </div>
  </div>

  <!-- SCENE 4: WITH FORMA -->
  <div id="scene-4" class="scene" style="padding-top: 44px;">
    <div class="browser-card">
      <div class="browser-bar mono">
        <div class="dots"><span></span><span></span><span></span></div>
        <span>kanso.madrid — Same prompt + forma DESIGN.md</span>
        <span style="color:#118453; font-weight:500;">98/100 A+</span>
      </div>
      <div class="viewport" style="background:#f5f1e8;">
        <img id="img-after" src="${afterDataUri}" alt="With forma" />
      </div>
    </div>
    <div class="audit-col">
      <div class="score-box" style="border-color: rgba(17,132,83,0.30); background:#f6fef9;">
        <div class="mono" style="font-size:13px; color:#118453; text-transform:uppercase;">WITH FORMA · SAME AGENT + DESIGN.MD</div>
        <div class="mono" style="font-size:64px; font-weight:700; color:#118453; line-height:1.05; margin-top:6px;">98<span style="font-size:26px; opacity:0.65;">/100 A+</span></div>
        <div style="font-size:16px; color:#54645e; margin-top:6px;">Bespoke brand craft & human restraint</div>
      </div>
      <div class="check-pill" id="good-1"><span style="color:#118453; font-weight:700;">✓</span> Sanzo Wada 60-30-10 silk palette (15.2:1 AAA)</div>
      <div class="check-pill" id="good-2"><span style="color:#118453; font-weight:700;">✓</span> Editorial farm & altitude ledger (tabular-nums)</div>
      <div class="check-pill" id="good-3"><span style="color:#118453; font-weight:700;">✓</span> Translucent frosted Swiss bottom dock</div>
      <div class="check-pill" id="good-4"><span style="color:#118453; font-weight:700;">✓</span> Zero filler icons · Honest €24/mo subscription</div>
    </div>
  </div>

  <!-- SCENE 5: SIDE-BY-SIDE SPLIT WIPE + END CTA -->
  <div id="scene-5" class="scene" style="flex-direction:column; padding-top:42px;">
    <div style="position:relative; width:1460px; height:760px; border-radius:22px; overflow:hidden; border:1px solid rgba(20,20,19,0.16); box-shadow:0 30px 80px rgba(20,20,19,0.14);">
      <img src="${afterDataUri}" style="position:absolute; inset:0; width:100%; object-fit:cover; object-position:top;" />
      <div id="split-left" style="position:absolute; inset:0; width:50%; overflow:hidden; border-right:3px solid #E06D44;">
        <img src="${beforeDataUri}" style="width:1460px; max-width:none; object-fit:cover; object-position:top;" />
      </div>
      <div class="mono" style="position:absolute; top:20px; left:20px; background:rgba(15,23,42,0.88); color:#f87171; padding:8px 16px; border-radius:99px; font-size:14px;">
        WITHOUT FORMA · 34/100
      </div>
      <div class="mono" style="position:absolute; top:20px; right:20px; background:rgba(20,20,19,0.90); color:#4ade80; padding:8px 16px; border-radius:99px; font-size:14px;">
        WITH FORMA · 98/100 A+
      </div>
    </div>
    <div style="margin-top:26px; display:flex; align-items:center; gap:24px;">
      <span class="serif" style="font-size:34px;">Give your AI coding agent real taste:</span>
      <span class="mono" style="background:#141413; color:#fbfbfa; padding:12px 26px; border-radius:99px; font-size:20px;">forma.to · github.com/josegaben/forma</span>
    </div>
  </div>

  <script>
    const PROMPT_TEXT = "“Build a very simple one-page website for Kanso, a small specialty coffee roaster in Madrid with a monthly subscription.”";

    function clamp01(x) { return Math.max(0, Math.min(1, x)); }
    function easeOutExpo(x) {
      const t = clamp01(x);
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }
    function easeInOutCubic(x) {
      const t = clamp01(x);
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    window.setFrameTime = function(t) {
      const s1 = document.getElementById('scene-1');
      const s2 = document.getElementById('scene-2');
      const s3 = document.getElementById('scene-3');
      const s4 = document.getElementById('scene-4');
      const s5 = document.getElementById('scene-5');
      const badge = document.getElementById('phase-badge');

      [s1, s2, s3, s4, s5].forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(0px)'; });

      if (t < 3.8) {
        badge.textContent = "01 / SAME DEAD-SIMPLE PROMPT";
        const op = t < 0.4 ? easeOutExpo(t / 0.4) : t > 3.4 ? 1 - clamp01((t - 3.4) / 0.4) : 1;
        s1.style.opacity = String(op);
        const chars = Math.floor(clamp01((t - 0.35) / 2.2) * PROMPT_TEXT.length);
        document.getElementById('typed-prompt').textContent = PROMPT_TEXT.slice(0, chars);
      } else if (t < 9.4) {
        badge.textContent = "02 / OUTPUT WITHOUT FORMA (RAW LLM)";
        const local = t - 3.8;
        const op = local < 0.4 ? easeOutExpo(local / 0.4) : t > 9.0 ? 1 - clamp01((t - 9.0) / 0.4) : 1;
        s2.style.opacity = String(op);
        const scrollPx = easeInOutCubic((local - 0.8) / 3.8) * 340;
        document.getElementById('img-before').style.transform = 'translateY(-' + scrollPx.toFixed(1) + 'px)';
        ['bad-1','bad-2','bad-3','bad-4'].forEach((id, idx) => {
          const p = easeOutExpo((local - (0.4 + idx * 0.35)) / 0.45);
          const el = document.getElementById(id);
          el.style.opacity = String(p);
          el.style.transform = 'translateX(' + ((1 - p) * 24).toFixed(1) + 'px)';
        });
      } else if (t < 13.6) {
        badge.textContent = "03 / SYNTHESIS IN FORMA.TO";
        const local = t - 9.4;
        const op = local < 0.4 ? easeOutExpo(local / 0.4) : t > 13.2 ? 1 - clamp01((t - 13.2) / 0.4) : 1;
        s3.style.opacity = String(op);
        ['mix-1','mix-2','mix-3','mix-4'].forEach((id, idx) => {
          const p = easeOutExpo((local - (0.3 + idx * 0.25)) / 0.5);
          const el = document.getElementById(id);
          el.style.opacity = String(p);
          el.style.transform = 'translateY(' + ((1 - p) * 22).toFixed(1) + 'px)';
        });
      } else if (t < 18.6) {
        badge.textContent = "04 / SAME PROMPT WITH FORMA (98/100 A+)";
        const local = t - 13.6;
        const op = local < 0.4 ? easeOutExpo(local / 0.4) : t > 18.2 ? 1 - clamp01((t - 18.2) / 0.4) : 1;
        s4.style.opacity = String(op);
        const scrollPx = easeInOutCubic((local - 0.9) / 3.4) * 230;
        document.getElementById('img-after').style.transform = 'translateY(-' + scrollPx.toFixed(1) + 'px)';
        ['good-1','good-2','good-3','good-4'].forEach((id, idx) => {
          const p = easeOutExpo((local - (0.4 + idx * 0.32)) / 0.45);
          const el = document.getElementById(id);
          el.style.opacity = String(p);
          el.style.transform = 'translateX(' + ((1 - p) * 24).toFixed(1) + 'px)';
        });
      } else {
        badge.textContent = "BEFORE VS AFTER · FORMA.TO";
        const local = t - 18.6;
        const op = local < 0.4 ? easeOutExpo(local / 0.4) : 1;
        s5.style.opacity = String(op);
        let pct = 50;
        if (local < 1.5) {
          pct = 82 - easeInOutCubic(local / 1.5) * 64;
        } else if (local < 2.7) {
          pct = 18 + easeInOutCubic((local - 1.5) / 1.2) * 30;
        } else {
          pct = 48;
        }
        document.getElementById('split-left').style.width = pct.toFixed(2) + '%';
      }
    };
  </script>
</body>
</html>`;
}

async function main() {
  rmSync(FRAMES_DIR, { recursive: true, force: true });
  mkdirSync(FRAMES_DIR, { recursive: true });
  mkdirSync(dirname(OUTPUT_MP4), { recursive: true });

  const executablePath = CHROME_CANDIDATES.find((p) => p && existsSync(p));
  const browser = await chromium.launch({
    ...(executablePath ? { executablePath } : {}),
    headless: true,
    args: ["--no-sandbox"],
  });

  try {
    const capPage = await browser.newPage({
      viewport: { width: 1360, height: 1120 },
      deviceScaleFactor: 1.5,
    });

    const controlAPath = resolve(FRAMES_DIR, "_control_a_en.html");
    writeFileSync(controlAPath, buildControlAHtml(), "utf8");
    await capPage.goto(`file://${controlAPath}`, { waitUntil: "networkidle" });
    await capPage.evaluate(() => document.fonts.ready);
    const beforeBuf = await capPage.screenshot({ type: "jpeg", quality: 92 });
    const beforeDataUri = `data:image/jpeg;base64,${beforeBuf.toString("base64")}`;

    const expBPath = resolve(FRAMES_DIR, "_exp_b_en.html");
    writeFileSync(expBPath, buildExperimentalBHtml(), "utf8");
    await capPage.goto(`file://${expBPath}`, { waitUntil: "networkidle" });
    await capPage.evaluate(() => document.fonts.ready);
    const afterBuf = await capPage.screenshot({ type: "jpeg", quality: 94 });
    const afterDataUri = `data:image/jpeg;base64,${afterBuf.toString("base64")}`;
    await capPage.close();

    const stagePage = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });

    const stagePath = resolve(FRAMES_DIR, "_stage_en.html");
    writeFileSync(stagePath, buildEnglishStageHtml(beforeDataUri, afterDataUri), "utf8");
    await stagePage.goto(`file://${stagePath}`, { waitUntil: "networkidle" });
    await stagePage.evaluate(() => document.fonts.ready);

    console.log(`[video-en] Rendering ${TOTAL_FRAMES} English frames at 1920x1080 (${FPS}fps)...`);
    for (let f = 0; f < TOTAL_FRAMES; f++) {
      const t = f / FPS;
      await stagePage.evaluate((timeSec) => {
        window.setFrameTime(timeSec);
      }, t);
      const frameFile = resolve(FRAMES_DIR, `frame-${String(f).padStart(4, "0")}.jpg`);
      await stagePage.screenshot({ path: frameFile, type: "jpeg", quality: 92 });
    }

    console.log("[video-en] Encoding H.264 1080p MP4 via ffmpeg...");
    execFileSync(
      "ffmpeg",
      [
        "-y",
        "-framerate",
        String(FPS),
        "-i",
        resolve(FRAMES_DIR, "frame-%04d.jpg"),
        "-c:v",
        "libx264",
        "-preset",
        "slow",
        "-crf",
        "18",
        "-pix_fmt",
        "yuv420p",
        "-movflags",
        "+faststart",
        OUTPUT_MP4,
      ],
      { stdio: "inherit" }
    );

    console.log(`✓ Rendered English video: ${OUTPUT_MP4}`);
  } finally {
    await browser.close();
    rmSync(FRAMES_DIR, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error("[video-en] fatal:", err);
  process.exit(1);
});
