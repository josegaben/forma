#!/usr/bin/env node
/**
 * Renders a deterministic 1920x1080 H.264 MP4 launch video comparing:
 *   Control A: Same simple prompt in ChatGPT/raw AI WITHOUT forma
 *   Experimental B: Exact same prompt WITH forma (DESIGN.md)
 */

import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const FRAMES_DIR = resolve(ROOT, ".video_frames_tmp");
const OUTPUT_MP4 = resolve(ROOT, "public/forma-ab-demo.mp4");

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const BASE_URL = process.env.BASE_URL || "http://localhost:3030";

const FPS = 30;
const DURATION_SEC = 22;
const TOTAL_FRAMES = FPS * DURATION_SEC;

function buildStageHtml(beforeDataUri, afterDataUri) {
  return `<!DOCTYPE html>
<html lang="es">
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

  /* Persistent Top Brand Header */
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
  .logo {
    display: flex;
    align-items: center;
    gap: 14px;
  }
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

  /* Browser Mock Frame */
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
    background: #0f172a;
  }
  .viewport img {
    width: 100%;
    display: block;
    transform-origin: top center;
  }

  /* Audit Panel */
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
  <!-- Top Brand Header -->
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
    <div id="phase-badge" class="pill-tag mono">TEST A/B CIEGO · MISMO PROMPT</div>
  </div>

  <!-- SCENE 1: THE SIMPLE PROMPT -->
  <div id="scene-1" class="scene" style="flex-direction:column; text-align:center; padding: 0 140px;">
    <div class="mono" style="font-size: 16px; color:#E06D44; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:20px;">
      LA PRUEBA DEL ANTES Y DESPUÉS
    </div>
    <h1 class="serif" style="font-size: 76px; font-weight:400; letter-spacing:-0.03em; line-height:1.03; margin-bottom: 38px;">
      Mismo prompt sencillo.<br/>Misma IA. Cero plantillas.
    </h1>
    <div style="width: 1120px; background:#fff; border:1.5px solid rgba(20,20,19,0.15); border-radius:24px; padding:28px 34px; box-shadow:0 20px 50px rgba(0,0,0,0.06); text-align:left;">
      <div class="mono" style="font-size:13px; color:#8a8880; margin-bottom:10px;">PROMPT ENVIADO AL AGENTE:</div>
      <div id="typed-prompt" style="font-size:26px; line-height:1.4; color:#141413; font-weight:500; min-height:72px;"></div>
    </div>
  </div>

  <!-- SCENE 2: WITHOUT FORMA (AI SLOP) -->
  <div id="scene-2" class="scene" style="padding-top: 44px;">
    <div class="browser-card">
      <div class="browser-bar mono">
        <div class="dots"><span></span><span></span><span></span></div>
        <span>kanso-coffee-ai-default.app — Sin forma (Raw LLM)</span>
        <span style="color:#dc2626; font-weight:500;">SLOP DETECTED</span>
      </div>
      <div class="viewport">
        <img id="img-before" src="${beforeDataUri}" alt="Without forma" />
      </div>
    </div>
    <div class="audit-col">
      <div class="score-box" style="border-color: rgba(220,38,38,0.28); background:#fffafa;">
        <div class="mono" style="font-size:13px; color:#dc2626; text-transform:uppercase;">SIN FORMA · CHATGPT / IA POR DEFECTO</div>
        <div class="mono" style="font-size:64px; font-weight:700; color:#dc2626; line-height:1.05; margin-top:6px;">34<span style="font-size:26px; opacity:0.65;">/100</span></div>
        <div style="font-size:16px; color:#6e6d68; margin-top:6px;">Auditoría automática forma-xray</div>
      </div>
      <div class="check-pill" id="bad-1"><span style="color:#dc2626; font-weight:700;">✕</span> Degradado morado/rosa genérico de IA</div>
      <div class="check-pill" id="bad-2"><span style="color:#dc2626; font-weight:700;">✕</span> Eyebrows falsos "01 //" y punto LIVE falso</div>
      <div class="check-pill" id="bad-3"><span style="color:#dc2626; font-weight:700;">✕</span> 3 tarjetas clónicas + buzzwords vacías</div>
      <div class="check-pill" id="bad-4"><span style="color:#dc2626; font-weight:700;">✕</span> Plan "Enterprise 99€/mes" para una cafetería</div>
    </div>
  </div>

  <!-- SCENE 3: CONNECTING FORMA -->
  <div id="scene-3" class="scene" style="flex-direction:column; padding: 0 120px;">
    <div class="mono" style="font-size:15px; color:#118453; margin-bottom:14px;">CONECTANDO FORMA EN 1 LÍNEA (MCP / LLMS.TXT)</div>
    <h2 class="serif" style="font-size:62px; font-weight:400; letter-spacing:-0.03em; margin-bottom:32px;">
      forma cruza las mejores referencias para tu idea
    </h2>
    <div style="background:#141413; color:#fbfbfa; border-radius:18px; padding:20px 28px; width:920px; display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; box-shadow:0 20px 50px rgba(0,0,0,0.16);">
      <span class="mono" style="font-size:20px;"><span style="color:#706f69;">$</span> set up forma - https://forma.to/llms.txt</span>
      <span class="mono" style="background:#fff; color:#141413; padding:6px 18px; border-radius:99px; font-size:15px; font-weight:500;">✓ DESIGN.md</span>
    </div>
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:18px; width:1360px;">
      <div id="mix-1" class="score-box" style="padding:22px;">
        <div class="mono" style="font-size:12px; color:#8a8880;">01 · PALETA 60-30-10</div>
        <div style="display:flex; height:18px; border-radius:99px; overflow:hidden; margin:14px 0; border:1px solid rgba(0,0,0,0.12);">
          <span style="width:55%; background:#f5f1e8;"></span>
          <span style="width:25%; background:#1f1b18;"></span>
          <span style="width:20%; background:#c4492b;"></span>
        </div>
        <div style="font-size:18px; font-weight:600;">Sanzo Wada #142</div>
        <div class="mono" style="font-size:13px; color:#118453; margin-top:4px;">15.2:1 WCAG AAA</div>
      </div>
      <div id="mix-2" class="score-box" style="padding:22px;">
        <div class="mono" style="font-size:12px; color:#8a8880;">02 · TIPOGRAFÍA</div>
        <div class="serif" style="font-size:38px; margin:8px 0;">Aa Bb</div>
        <div style="font-size:18px; font-weight:600;">Newsreader + Geist</div>
        <div class="mono" style="font-size:13px; color:#6e6d68; margin-top:4px;">tabular-nums activo</div>
      </div>
      <div id="mix-3" class="score-box" style="padding:22px;">
        <div class="mono" style="font-size:12px; color:#8a8880;">03 · ESTRUCTURA</div>
        <div class="mono" style="font-size:15px; background:#f3f2ee; padding:8px 12px; border-radius:8px; margin:12px 0; display:inline-block;">1px Ledger + Dock</div>
        <div style="font-size:18px; font-weight:600;">DeadSimple × P de Pablo</div>
        <div class="mono" style="font-size:13px; color:#6e6d68; margin-top:4px;">860px medida limpia</div>
      </div>
      <div id="mix-4" class="score-box" style="padding:22px;">
        <div class="mono" style="font-size:12px; color:#8a8880;">04 · GUARDRAILS</div>
        <div class="mono" style="font-size:15px; background:#ecfdf5; color:#118453; padding:8px 12px; border-radius:8px; margin:12px 0; display:inline-block;">unslop-ui activo</div>
        <div style="font-size:18px; font-weight:600;">0% Clichés de IA</div>
        <div class="mono" style="font-size:13px; color:#6e6d68; margin-top:4px;">Suscripción real 24 €</div>
      </div>
    </div>
  </div>

  <!-- SCENE 4: WITH FORMA -->
  <div id="scene-4" class="scene" style="padding-top: 44px;">
    <div class="browser-card">
      <div class="browser-bar mono">
        <div class="dots"><span></span><span></span><span></span></div>
        <span>kanso.madrid — Mismo prompt + forma DESIGN.md</span>
        <span style="color:#118453; font-weight:500;">98/100 A+</span>
      </div>
      <div class="viewport" style="background:#f5f1e8;">
        <img id="img-after" src="${afterDataUri}" alt="With forma" />
      </div>
    </div>
    <div class="audit-col">
      <div class="score-box" style="border-color: rgba(17,132,83,0.30); background:#f6fef9;">
        <div class="mono" style="font-size:13px; color:#118453; text-transform:uppercase;">CON FORMA · MISMO AGENTE + DESIGN.MD</div>
        <div class="mono" style="font-size:64px; font-weight:700; color:#118453; line-height:1.05; margin-top:6px;">98<span style="font-size:26px; opacity:0.65;">/100 A+</span></div>
        <div style="font-size:16px; color:#54645e; margin-top:6px;">Identidad propia con criterio humano</div>
      </div>
      <div class="check-pill" id="good-1"><span style="color:#118453; font-weight:700;">✓</span> Paleta japonesa Sanzo Wada 60-30-10 (15.2:1)</div>
      <div class="check-pill" id="good-2"><span style="color:#118453; font-weight:700;">✓</span> Tabla editorial de fincas y altitud (tabular-nums)</div>
      <div class="check-pill" id="good-3"><span style="color:#118453; font-weight:700;">✓</span> Dock flotante inferior esmerilado</div>
      <div class="check-pill" id="good-4"><span style="color:#118453; font-weight:700;">✓</span> Cero iconos de relleno · Suscripción honesta 24 €</div>
    </div>
  </div>

  <!-- SCENE 5: SIDE-BY-SIDE SPLIT WIPE + END CTA -->
  <div id="scene-5" class="scene" style="flex-direction:column; padding-top:42px;">
    <div style="position:relative; width:1460px; height:760px; border-radius:22px; overflow:hidden; border:1px solid rgba(20,20,19,0.16); box-shadow:0 30px 80px rgba(0,0,0,0.14);">
      <!-- Underneath: AFTER (With forma) -->
      <img src="${afterDataUri}" style="position:absolute; inset:0; width:100%; object-fit:cover; object-position:top;" />
      <!-- Clipped on Left: BEFORE (Without forma) -->
      <div id="split-left" style="position:absolute; inset:0; width:50%; overflow:hidden; border-right:3px solid #E06D44;">
        <img src="${beforeDataUri}" style="width:1460px; max-width:none; object-fit:cover; object-position:top;" />
      </div>
      <div class="mono" style="position:absolute; top:20px; left:20px; background:rgba(15,23,42,0.88); color:#f87171; padding:8px 16px; border-radius:99px; font-size:14px;">
        SIN FORMA · 34/100
      </div>
      <div class="mono" style="position:absolute; top:20px; right:20px; background:rgba(20,20,19,0.90); color:#4ade80; padding:8px 16px; border-radius:99px; font-size:14px;">
        CON FORMA · 98/100 A+
      </div>
    </div>
    <div style="margin-top:26px; display:flex; align-items:center; gap:24px;">
      <span class="serif" style="font-size:34px;">Dale gusto visual real a tu agente:</span>
      <span class="mono" style="background:#141413; color:#fbfbfa; padding:12px 26px; border-radius:99px; font-size:20px;">forma.to · github.com/josegaben/forma</span>
    </div>
  </div>

  <script>
    const PROMPT_TEXT = "«Hazme una web muy sencilla para Kanso, un pequeño tostador de café de especialidad en Madrid con suscripción mensual.»";

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
        badge.textContent = "01 / MISMO PROMPT SENCILLO";
        const op = t < 0.4 ? easeOutExpo(t / 0.4) : t > 3.4 ? 1 - clamp01((t - 3.4) / 0.4) : 1;
        s1.style.opacity = String(op);
        const chars = Math.floor(clamp01((t - 0.35) / 2.2) * PROMPT_TEXT.length);
        document.getElementById('typed-prompt').textContent = PROMPT_TEXT.slice(0, chars);
      } else if (t < 9.4) {
        badge.textContent = "02 / RESULTADO SIN FORMA (IA POR DEFECTO)";
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
        badge.textContent = "03 / SÍNTESIS EN FORMA.TO";
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
        badge.textContent = "04 / MISMO PROMPT CON FORMA (98/100 A+)";
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
        badge.textContent = "ANTES VS DESPUÉS · FORMA.TO";
        const local = t - 18.6;
        const op = local < 0.4 ? easeOutExpo(local / 0.4) : 1;
        s5.style.opacity = String(op);
        // Smooth wipe: starts at 82% (showing mostly BEFORE), sweeps to 18% (revealing AFTER), settles at 46%
        let pct = 50;
        if (local < 1.5) {
          pct = 82 - easeInOutCubic(local / 1.5) * 64; // 82% -> 18%
        } else if (local < 2.7) {
          pct = 18 + easeInOutCubic((local - 1.5) / 1.2) * 30; // 18% -> 48%
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

  console.log("[video] Launching local Chrome via playwright-core...");
  const browser = await chromium.launch({
    executablePath: CHROME_PATH,
    headless: true,
  });

  try {
    // 1. Capture crisp high-res full screenshots of BOTH live benchmark pages
    const capPage = await browser.newPage({
      viewport: { width: 1360, height: 1120 },
      deviceScaleFactor: 1.5,
    });

    console.log("[video] Capturing /demo/without-forma (Control A)...");
    await capPage.goto(`${BASE_URL}/demo/without-forma`, { waitUntil: "networkidle" });
    const beforeBuf = await capPage.screenshot({ type: "jpeg", quality: 92 });
    const beforeDataUri = `data:image/jpeg;base64,${beforeBuf.toString("base64")}`;

    console.log("[video] Capturing /demo/with-forma (Experimental B)...");
    await capPage.goto(`${BASE_URL}/demo/with-forma`, { waitUntil: "networkidle" });
    const afterBuf = await capPage.screenshot({ type: "jpeg", quality: 94 });
    const afterDataUri = `data:image/jpeg;base64,${afterBuf.toString("base64")}`;
    await capPage.close();

    // 2. Render 660 deterministic 1920x1080 frames
    const stagePage = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
    });

    const stagePath = resolve(FRAMES_DIR, "_stage.html");
    writeFileSync(stagePath, buildStageHtml(beforeDataUri, afterDataUri), "utf8");
    await stagePage.goto(`file://${stagePath}`, { waitUntil: "networkidle" });
    await stagePage.evaluate(() => document.fonts.ready);

    console.log(`[video] Rendering ${TOTAL_FRAMES} frames at 1920x1080 (${FPS}fps)...`);
    for (let f = 0; f < TOTAL_FRAMES; f++) {
      const t = f / FPS;
      await stagePage.evaluate((timeSec) => {
        window.setFrameTime(timeSec);
      }, t);
      const frameFile = resolve(FRAMES_DIR, `frame-${String(f).padStart(4, "0")}.jpg`);
      await stagePage.screenshot({ path: frameFile, type: "jpeg", quality: 92 });
    }

    // 3. Encode H.264 MP4 compatible with X (Twitter), QuickTime, Safari & Chrome
    console.log("[video] Encoding H.264 1080p MP4 via ffmpeg...");
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

    console.log(`✓ Rendered ${OUTPUT_MP4}`);
  } finally {
    await browser.close();
    rmSync(FRAMES_DIR, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error("[video] fatal:", err);
  process.exit(1);
});
