import React from "react";
import type { WebFormat } from "@/data/formats";

export function FormatVisualThumb({
  format,
  heightClass = "h-[168px]",
}: {
  format: WebFormat;
  heightClass?: string;
}) {
  const s = format.surface;
  const nav = format.layout.navStyle;
  const isSerif =
    format.id === "claude-academy" ||
    format.id === "a1-monograph" ||
    format.typography.useItalicAccent;
  const isSingle = format.id === "dead-simple" || format.id === "rauno-craft";

  const bgPattern: React.CSSProperties =
    s.texture === "halftone-map"
      ? {
          backgroundImage: `radial-gradient(${
            s.mode === "dark" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.14)"
          } 1px, transparent 1px)`,
          backgroundSize: "10px 10px",
        }
      : s.texture === "architect-grid" || s.texture === "anodized-grid"
      ? {
          backgroundImage: `linear-gradient(to right, ${s.line} 1px, transparent 1px), linear-gradient(to bottom, ${s.line} 1px, transparent 1px)`,
          backgroundSize: s.texture === "anodized-grid" ? "22px 22px" : "36px 36px",
        }
      : s.texture === "stone-dots"
      ? {
          backgroundImage: `radial-gradient(${
            s.mode === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.09)"
          } 1px, transparent 1px)`,
          backgroundSize: "12px 12px",
        }
      : {};

  return (
    <div
      className={`relative w-full ${heightClass} overflow-hidden rounded-[11px] border p-3.5 flex flex-col justify-between select-none transition-transform duration-300 group-hover:scale-[1.01]`}
      style={{
        backgroundColor: s.bg,
        color: s.ink,
        borderColor: s.line,
        ...bgPattern,
      }}
      aria-hidden="true"
    >
      {/* Top Miniature Navbar */}
      {nav === "floating-pill" ? (
        <div
          className="mx-auto w-[84%] h-5 rounded-full border px-2.5 flex items-center justify-between"
          style={{
            backgroundColor: s.surface,
            borderColor: s.line,
          }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.ink }} />
          <div className="flex gap-1.5">
            <span className="w-5 h-1 rounded-full opacity-35" style={{ backgroundColor: s.ink }} />
            <span className="w-5 h-1 rounded-full opacity-35" style={{ backgroundColor: s.ink }} />
          </div>
          <span
            className="w-7 h-2.5 rounded-full"
            style={{ backgroundColor: s.accent }}
          />
        </div>
      ) : (
        <div
          className={`flex items-center justify-between pb-2 ${
            nav === "rail-header" ? "border-b" : ""
          }`}
          style={{ borderColor: s.line }}
        >
          <span
            className="text-[10px] font-semibold tracking-tight opacity-85"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            {format.inspiredBy[0]?.name.split(" ")[0] || format.shortCode}
          </span>
          <span
            className="px-2 py-0.5 text-[9px] font-medium"
            style={{
              backgroundColor: s.accent,
              color: s.accentInk,
              borderRadius: s.radiusPill,
            }}
          >
            {s.mode}
          </span>
        </div>
      )}

      {/* Center Miniature Hero & Typography Specimen */}
      <div className={`my-auto ${isSingle || nav === "bottom-dock" ? "text-left" : "text-center"}`}>
        <div
          className="leading-[1.04] tracking-[-0.03em] mb-1.5"
          style={{
            fontFamily: isSerif
              ? "var(--font-editorial), Georgia, serif"
              : "var(--font-geist), sans-serif",
            fontSize: isSerif ? "20px" : "17px",
            fontWeight: isSerif ? 400 : 600,
            fontStyle: format.typography.useItalicAccent ? "italic" : "normal",
          }}
        >
          {format.name.split(" ").slice(0, 2).join(" ")}
        </div>
        <div
          className={`h-1.5 rounded-full opacity-25 mb-2.5 ${
            isSingle || nav === "bottom-dock" ? "w-[68%]" : "w-[62%] mx-auto"
          }`}
          style={{ backgroundColor: s.ink }}
        />
      </div>

      {/* Bottom Miniature UI Cards or Dock */}
      {nav === "bottom-dock" ? (
        <div className="flex items-center justify-between gap-2">
          <div
            className="h-9 flex-1 rounded-[8px] border"
            style={{ backgroundColor: s.surface, borderColor: s.line }}
          />
          <div
            className="px-2.5 py-1 rounded-full border text-[9px] font-medium"
            style={{ backgroundColor: s.panel, borderColor: s.line }}
          >
            Dock · 1px
          </div>
          <div
            className="h-9 flex-1 rounded-[8px] border"
            style={{ backgroundColor: s.surface, borderColor: s.line }}
          />
        </div>
      ) : format.id === "treg-gateway" ? (
        <div
          className="h-7 rounded-[7px] px-2.5 flex items-center justify-between text-[9px]"
          style={{
            backgroundColor: "#171716",
            color: "#faf9f6",
            fontFamily: "var(--font-mono), monospace",
          }}
        >
          <span>$ set up /llms.txt</span>
          <span className="px-1.5 py-0.2 bg-white text-[#171716] rounded-full text-[8px]">
            copy
          </span>
        </div>
      ) : (
        <div className={`grid ${isSingle ? "grid-cols-1" : "grid-cols-2"} gap-2`}>
          <div
            className="h-9 px-2.5 flex items-center justify-between border"
            style={{
              backgroundColor: s.surface,
              borderColor: s.line,
              borderRadius: s.radiusCard === "0px" ? "0px" : "8px",
            }}
          >
            <span className="w-8 h-1.5 rounded-full opacity-45" style={{ backgroundColor: s.ink }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.accent }} />
          </div>
          {!isSingle && (
            <div
              className="h-9 px-2.5 flex items-center justify-between border"
              style={{
                backgroundColor: s.surface,
                borderColor: s.line,
                borderRadius: s.radiusCard === "0px" ? "0px" : "8px",
              }}
            >
              <span className="w-10 h-1.5 rounded-full opacity-30" style={{ backgroundColor: s.ink }} />
              <span className="text-[9px] opacity-60" style={{ fontFamily: "var(--font-mono), monospace" }}>
                Aa
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function MotionCurveMini({ easing }: { easing: string }) {
  // Extract cubic-bezier points to draw a real visual SVG curve!
  const match = easing.match(
    /cubic-bezier\(\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*\)/i
  );
  const [x1, y1, x2, y2] = match
    ? match.slice(1).map(Number)
    : [0.22, 1, 0.36, 1];

  const cx1 = 8 + x1 * 64;
  const cy1 = 38 - y1 * 30;
  const cx2 = 8 + x2 * 64;
  const cy2 = 38 - y2 * 30;

  return (
    <svg width="80" height="44" viewBox="0 0 80 44" fill="none" className="shrink-0">
      <line x1="8" y1="38" x2="72" y2="38" stroke="currentColor" strokeOpacity="0.14" />
      <line x1="8" y1="8" x2="72" y2="8" stroke="currentColor" strokeOpacity="0.10" strokeDasharray="2 2" />
      <path
        d={`M 8 38 C ${cx1} ${cy1}, ${cx2} ${cy2}, 72 8`}
        stroke="#E06D44"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="8" cy="38" r="2.5" fill="currentColor" fillOpacity="0.4" />
      <circle cx="72" cy="8" r="2.5" fill="#E06D44" />
    </svg>
  );
}
