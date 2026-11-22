"use client";

import React, { useState } from "react";
import { ArrowUpRight, Download, Play, SlidersHorizontal } from "lucide-react";

export function BeforeAfterShowcase({ lang }: { lang: "en" | "es" }) {
  const [viewMode, setViewMode] = useState<"video" | "slider">("video");
  const [splitPct, setSplitPct] = useState(46);

  const videoSrc = lang === "en" ? "/forma-ab-demo-en.mp4" : "/forma-ab-demo.mp4";
  const videoDownloadName =
    lang === "en" ? "forma-before-after-en.mp4" : "forma-before-after-es.mp4";
  const withoutHref = lang === "en" ? "/demo/en/without-forma" : "/demo/without-forma";
  const withHref = lang === "en" ? "/demo/en/with-forma" : "/demo/with-forma";

  return (
    <section
      id="proof"
      className="py-16 px-5 border-t border-[var(--line)] bg-[#f6f5f2]"
    >
      <div className="mx-auto max-w-[1120px]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-7">
          <div>
            <div
              className="text-[11.5px] text-[#E06D44] uppercase tracking-wider mb-1.5"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              {lang === "es"
                ? "BENCHMARK A/B CIEGO · MISMO PROMPT, MISMO MODELO"
                : "BLIND A/B BENCHMARK · SAME PROMPT, SAME MODEL"}
            </div>
            <h2
              className="text-[clamp(1.95rem,3.6vw,2.8rem)] leading-[1.06] tracking-[-0.025em] font-normal"
              style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
            >
              {lang === "es"
                ? "El antes y después de una web muy sencilla"
                : "Before and after on a dead-simple prompt"}
            </h2>
            <p className="text-[14px] text-[var(--muted)] mt-1.5 max-w-[680px]">
              {lang === "es"
                ? "Prompt: «Hazme una web muy sencilla para Kanso, un pequeño tostador de café de especialidad en Madrid con suscripción mensual.»"
                : "Prompt: “Build a very simple one-page website for Kanso, a small specialty coffee roaster in Madrid with a monthly subscription.”"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="inline-flex p-1 rounded-full bg-white border border-[var(--line)] text-[12px]">
              <button
                type="button"
                onClick={() => setViewMode("video")}
                className={`px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                  viewMode === "video"
                    ? "bg-[#141413] text-white font-medium"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                <Play className="w-3 h-3" />
                <span>{lang === "es" ? "Vídeo (22s)" : "Video (22s)"}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("slider")}
                className={`px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                  viewMode === "slider"
                    ? "bg-[#141413] text-white font-medium"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>{lang === "es" ? "Comparador interactivo" : "Interactive Split"}</span>
              </button>
            </div>

            <a
              href={videoSrc}
              download={videoDownloadName}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[var(--line-strong)] hover:bg-[var(--panel)] text-[12px] font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === "es" ? "Descargar MP4 (ES)" : "Download MP4 (EN)"}</span>
            </a>
          </div>
        </div>

        {/* Double-Bezel Stage */}
        <div className="rounded-[22px] p-2.5 bg-white border border-[var(--line)] shadow-[var(--shadow-md)]">
          {viewMode === "video" ? (
            <div className="rounded-[16px] overflow-hidden bg-[#fbfbfa] border border-[var(--line)] aspect-video">
              <video
                key={videoSrc}
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
                controls
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative h-[510px] rounded-[16px] overflow-hidden border border-[var(--line)] select-none">
                {/* Right / Base Layer: WITH FORMA */}
                <iframe
                  src={withHref}
                  title="With forma"
                  className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                />

                {/* Left Clipped Layer: WITHOUT FORMA */}
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden border-r-[3px] border-[#E06D44]"
                  style={{ width: `${splitPct}%` }}
                >
                  <iframe
                    src={withoutHref}
                    title="Without forma"
                    className="w-[1096px] h-full border-0 pointer-events-none"
                  />
                </div>

                {/* Top Badges */}
                <span
                  className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-slate-950/90 text-red-400 text-[11px] border border-red-500/30"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  {lang === "es" ? "SIN FORMA · 34/100" : "WITHOUT FORMA · 34/100"}
                </span>
                <span
                  className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-[#1f1b18]/90 text-[#4ade80] text-[11px]"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  {lang === "es" ? "CON FORMA · 98/100 A+" : "WITH FORMA · 98/100 A+"}
                </span>
              </div>

              <div className="px-3 py-1 flex items-center gap-4">
                <span
                  className="text-[11px] text-[var(--muted)] shrink-0"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  {lang === "es" ? "Desliza para comparar:" : "Slide to compare:"}
                </span>
                <input
                  type="range"
                  min={8}
                  max={92}
                  value={splitPct}
                  onChange={(e) => setSplitPct(Number(e.target.value))}
                  aria-label="Comparison split percentage"
                  className="flex-1 accent-[#E06D44] cursor-ew-resize"
                />
              </div>
            </div>
          )}

          {/* Direct Links to Both Full-Screen Benchmark Pages */}
          <div className="mt-3 px-2 py-1 flex flex-wrap items-center justify-between gap-3 text-[12px]">
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={withoutHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[var(--muted)] hover:text-[var(--ink)]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                <span>{withoutHref} (34/100)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href={withHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[#118453] font-medium hover:underline"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                <span>{withHref} (98/100 A+)</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <span
              className="text-[11px] text-[var(--muted)]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              Sanzo Wada #142 + Newsreader + DeadSimple × P de Pablo
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
