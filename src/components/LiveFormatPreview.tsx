"use client";

import React from "react";
import type { ComposedGenome } from "@/lib/composer";
import type { TailoredPreviewContent } from "@/lib/synthesizer";

interface LiveFormatPreviewProps {
  genome: ComposedGenome;
  content: TailoredPreviewContent;
  lang: "en" | "es";
}

export function LiveFormatPreview({
  genome,
  content,
  lang,
}: LiveFormatPreviewProps) {
  const s = genome.layers.surface.surface;
  const t = genome.layers.typography;
  const l = genome.layers.layout;
  const c = genome.layers.components;
  const m = genome.layers.motion.motion;

  const isSerifHeading =
    t.id === "claude-academy" || t.id === "a1-monograph";
  const hasItalicWord = t.typography.useItalicAccent || isSerifHeading;
  const navStyle = l.layout.navStyle;
  const isSingleCol = l.id === "dead-simple" || l.id === "rauno-craft";
  const isIndustrial = s.texture === "anodized-grid" || c.id === "hardware-teenage";

  const backgroundPattern: React.CSSProperties =
    s.texture === "halftone-map"
      ? {
          backgroundImage: `radial-gradient(${
            s.mode === "dark" ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.12)"
          } 1px, transparent 1px)`,
          backgroundSize: "13px 13px",
        }
      : s.texture === "stone-dots"
      ? {
          backgroundImage: `radial-gradient(${
            s.mode === "dark" ? "rgba(255,255,255,0.09)" : "rgba(24,24,21,0.08)"
          } 1px, transparent 1px)`,
          backgroundSize: "16px 16px",
        }
      : s.texture === "architect-grid" || s.texture === "anodized-grid"
      ? {
          backgroundImage: `linear-gradient(to right, ${s.line} 1px, transparent 1px), linear-gradient(to bottom, ${s.line} 1px, transparent 1px)`,
          backgroundSize: s.texture === "anodized-grid" ? "28px 28px" : "60px 60px",
        }
      : {};

  const headingFontFamily =
    t.typography.displayFont ||
    (isSerifHeading ? "var(--font-editorial), Georgia, serif" : "var(--font-geist), sans-serif");
  const bodyFontFamily = t.typography.bodyFont || "var(--font-geist), sans-serif";
  const fontImportHref =
    t.typography.googleFontsImport && t.typography.googleFontsImport.startsWith("https://")
      ? t.typography.googleFontsImport
      : null;

  return (
    <div
      className="relative overflow-hidden rounded-[18px] border transition-colors duration-300"
      style={{
        backgroundColor: s.bg,
        color: s.ink,
        borderColor: s.line,
        fontFamily: bodyFontFamily,
        fontSizeAdjust: "from-font",
        ...backgroundPattern,
      }}
    >
      {fontImportHref && <link rel="stylesheet" href={fontImportHref} />}
      {/* Clean Minimal Window Bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 border-b text-[11px]"
        style={{
          backgroundColor: s.panel,
          borderColor: s.line,
          color: s.muted,
          fontFamily: "var(--font-mono), monospace",
        }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full opacity-35" style={{ backgroundColor: s.ink }} />
          <span className="w-2.5 h-2.5 rounded-full opacity-20" style={{ backgroundColor: s.ink }} />
          <span className="w-2.5 h-2.5 rounded-full opacity-12" style={{ backgroundColor: s.ink }} />
          <span className="ml-2.5 opacity-80">{content.domainSlug}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline opacity-70">{m.easing}</span>
          <span
            className="px-2 py-0.5 rounded text-[10px]"
            style={{ backgroundColor: s.badgeBg, color: s.ink }}
          >
            {genome.mixCode}
          </span>
        </div>
      </div>

      {/* Simulated Live Website Canvas */}
      <div
        className={`relative px-6 sm:px-10 pt-6 ${
          navStyle === "bottom-dock" ? "pb-20" : "pb-10"
        } min-h-[430px] flex flex-col justify-between ${
          navStyle === "rail-header" ? "mx-4 sm:mx-8 border-x" : ""
        }`}
        style={{ borderColor: s.line }}
      >
        {/* Navigation Choreography */}
        {navStyle === "floating-pill" && (
          <div
            className="mx-auto flex items-center justify-between gap-6 px-4 py-2 rounded-full border text-[12px] w-full max-w-[460px]"
            style={{
              backgroundColor:
                s.mode === "dark" ? "rgba(26,26,28,0.88)" : "rgba(255,255,255,0.90)",
              borderColor: s.line,
              backdropFilter: "blur(12px)",
            }}
          >
            <span className="font-semibold tracking-tight">{content.brandName}</span>
            <div className="flex items-center gap-4 text-[11.5px]" style={{ color: s.muted }}>
              <span>{lang === "es" ? "Producto" : "Product"}</span>
              <span>{lang === "es" ? "Clientes" : "Customers"}</span>
              <span>Docs</span>
            </div>
            <span
              className="px-3 py-1 font-medium text-[11px]"
              style={{
                backgroundColor: s.accent,
                color: s.accentInk,
                borderRadius: s.radiusPill,
              }}
            >
              {lang === "es" ? "Acceso" : "Sign in"}
            </span>
          </div>
        )}

        {(navStyle === "minimal-inline" || navStyle === "rail-header") && (
          <div
            className={`flex items-center justify-between pb-3.5 text-[12px] ${
              navStyle === "rail-header" ? "border-b" : ""
            }`}
            style={{ borderColor: s.line }}
          >
            <span
              className="font-semibold tracking-tight"
              style={{ fontFamily: isIndustrial ? "var(--font-mono), monospace" : undefined }}
            >
              {isIndustrial ? `${content.brandName.toLowerCase()} // sys.01` : content.brandName}
            </span>
            <div className="flex items-center gap-4" style={{ color: s.muted }}>
              <span>{lang === "es" ? "Plataforma" : "Platform"}</span>
              <span>Pricing</span>
              <span
                className="px-3 py-1 font-medium text-[11px]"
                style={{
                  backgroundColor: s.accent,
                  color: s.accentInk,
                  borderRadius: s.radiusPill,
                }}
              >
                {lang === "es" ? "Empezar" : "Start"}
              </span>
            </div>
          </div>
        )}

        {navStyle === "bottom-dock" && (
          <div className="flex items-center justify-between">
            <span
              className="px-3.5 py-1 text-[12px] font-medium"
              style={{
                backgroundColor: s.badgeBg,
                color: s.ink,
                borderRadius: "9999px",
              }}
            >
              {content.brandName}
            </span>
            <span
              className="text-[11px] tabular-nums"
              style={{ color: s.muted, fontFamily: "var(--font-mono), monospace" }}
            >
              {content.badge}
            </span>
          </div>
        )}

        {/* Tailored Hero Stage */}
        <div
          className={`my-7 ${
            isSingleCol || navStyle === "bottom-dock"
              ? "text-left max-w-[540px]"
              : "text-center mx-auto max-w-[580px]"
          }`}
        >
          {navStyle !== "bottom-dock" && (
            <div
              className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10.5px] border"
              style={{
                backgroundColor: s.badgeBg,
                borderColor: s.line,
                color: s.muted,
                borderRadius: s.radiusPill,
                fontFamily: "var(--font-mono), monospace",
              }}
            >
              <span>{content.badge}</span>
            </div>
          )}

          <h4
            className="leading-[1.04] mb-3"
            style={{
              fontFamily: headingFontFamily,
              letterSpacing: t.typography.h1Tracking,
              fontSize: isSerifHeading
                ? "clamp(2rem, 3.6vw, 2.75rem)"
                : "clamp(1.85rem, 3.2vw, 2.45rem)",
              fontWeight: isSerifHeading ? 400 : 600,
            }}
          >
            {content.headlineStart}{" "}
            <span
              style={
                hasItalicWord
                  ? {
                      fontFamily: "var(--font-editorial), Georgia, serif",
                      fontStyle: "italic",
                      fontWeight: 400,
                    }
                  : undefined
              }
            >
              {content.headlineAccent}
            </span>
          </h4>

          <p
            className={`text-[13.5px] leading-relaxed mb-5 line-clamp-2 ${
              isSingleCol || navStyle === "bottom-dock" ? "" : "mx-auto max-w-[490px]"
            }`}
            style={{ color: s.muted }}
          >
            {content.subtitle}
          </p>

          <div
            className={`flex flex-wrap items-center gap-2.5 ${
              isSingleCol || navStyle === "bottom-dock" ? "justify-start" : "justify-center"
            }`}
          >
            <span
              className="px-4 py-2 text-[12.5px] font-medium inline-flex items-center gap-1.5 transition-transform duration-150 hover:scale-[1.02]"
              style={{
                backgroundColor: s.accent,
                color: s.accentInk,
                borderRadius: s.radiusPill,
                boxShadow: isIndustrial ? `0 2px 0 ${s.ink}` : undefined,
              }}
            >
              {content.primaryCta}
            </span>
            <span
              className="px-4 py-2 text-[12.5px] border"
              style={{
                backgroundColor: s.surface,
                color: s.ink,
                borderColor: s.line,
                borderRadius: s.radiusPill,
                fontFamily: content.secondaryCta.startsWith("$")
                  ? "var(--font-mono), monospace"
                  : undefined,
              }}
            >
              {content.secondaryCta}
            </span>
          </div>
        </div>

        {/* Tailored Component Showcase Row */}
        <div
          className={`grid ${
            isSingleCol ? "grid-cols-1 max-w-[540px]" : "grid-cols-1 sm:grid-cols-3"
          } gap-3`}
        >
          <div
            className="p-3.5 border text-left"
            style={{
              backgroundColor: s.surface,
              borderColor: s.line,
              borderRadius: s.radiusCard,
              boxShadow: s.shadow !== "none" ? "0 2px 10px rgba(0,0,0,0.04)" : "none",
            }}
          >
            <div
              className="text-[10px] mb-1"
              style={{ color: s.muted, fontFamily: "var(--font-mono), monospace" }}
            >
              {content.metric1Label}
            </div>
            <div className="text-[17px] font-semibold tabular-nums">{content.metric1Value}</div>
            <div className="text-[11.5px] mt-0.5 truncate" style={{ color: s.muted }}>
              {content.metric1Sub}
            </div>
          </div>

          {!isSingleCol && (
            <>
              <div
                className="p-3.5 border text-left"
                style={{
                  backgroundColor: s.surface,
                  borderColor: s.line,
                  borderRadius: s.radiusCard,
                  boxShadow: s.shadow !== "none" ? "0 2px 10px rgba(0,0,0,0.04)" : "none",
                }}
              >
                <div
                  className="text-[10px] mb-1"
                  style={{ color: s.muted, fontFamily: "var(--font-mono), monospace" }}
                >
                  {content.metric2Label}
                </div>
                <div className="text-[17px] font-semibold tabular-nums">{content.metric2Value}</div>
                <div className="text-[11.5px] mt-0.5 truncate" style={{ color: s.muted }}>
                  {content.metric2Sub}
                </div>
              </div>

              <div
                className="p-3.5 border text-left flex flex-col justify-between"
                style={{
                  backgroundColor: s.panel,
                  borderColor: s.line,
                  borderRadius: s.radiusCard,
                }}
              >
                <div
                  className="text-[10px]"
                  style={{ color: s.muted, fontFamily: "var(--font-mono), monospace" }}
                >
                  PALETTE & TYPE
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full border border-black/15"
                      style={{ backgroundColor: s.bg }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/15"
                      style={{ backgroundColor: s.ink }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/15"
                      style={{ backgroundColor: s.accent }}
                    />
                  </div>
                  <span
                    className="text-[12px] font-medium"
                    style={{ fontFamily: headingFontFamily }}
                  >
                    Aa · {t.typography.displayFont.split(",")[0].replace(/'/g, "")}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Frosted Bottom Dock when layout === bottom-dock */}
        {navStyle === "bottom-dock" && (
          <div
            className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-4 px-4 py-1.5 rounded-full border text-[11px]"
            style={{
              backgroundColor:
                s.mode === "dark" ? "rgba(30,30,32,0.86)" : "rgba(242,242,242,0.88)",
              borderColor: s.line,
              backdropFilter: "blur(14px)",
            }}
          >
            <span>Work</span>
            <span style={{ color: s.muted }}>Principles</span>
            <span
              className="px-2.5 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: s.ink, color: s.bg }}
            >
              Contact
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
