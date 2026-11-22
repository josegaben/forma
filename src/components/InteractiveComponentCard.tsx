"use client";

import React, { useState } from "react";
import { ArrowUpRight, Check, Code2, Moon, Sun } from "lucide-react";
import type { RareComponentItem } from "@/data/compendium";

export function ComponentLiveMicroStage({
  kind,
  dark,
}: {
  kind: RareComponentItem["previewKind"];
  dark: boolean;
}) {
  const [orbColor, setOrbColor] = useState("#E06D44");
  const [activeNav, setActiveNav] = useState(0);
  const [counterVal, setCounterVal] = useState(98.4);

  const surface = dark ? "#18181b" : "#ffffff";
  const ink = dark ? "#f4f4f5" : "#141413";
  const muted = dark ? "#9ca3af" : "#71706b";
  const border = dark ? "rgba(255,255,255,0.10)" : "rgba(20,20,19,0.09)";

  switch (kind) {
    case "fluid-orb":
      return (
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <span
              className="absolute inset-0 rounded-full blur-md opacity-50 transition-colors duration-300"
              style={{ background: `radial-gradient(circle, #fff 0%, ${orbColor} 75%)` }}
            />
            <span
              className="relative w-11 h-11 rounded-full border border-white/30 shadow-inner transition-transform duration-300 group-hover:scale-110"
              style={{
                background: `radial-gradient(circle at 30% 30%, #ffffff 0%, ${orbColor} 65%, #141413 100%)`,
              }}
            />
          </div>
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
            style={{ backgroundColor: surface, borderColor: border }}
          >
            {["#E06D44", "#2563EB", "#118453", "#8B5CF6"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOrbColor(c);
                }}
                aria-label={`Color ${c}`}
                className="w-3 h-3 rounded-full cursor-pointer transition-transform hover:scale-125"
                style={{
                  backgroundColor: c,
                  outline: orbColor === c ? `1.5px solid ${ink}` : "none",
                  outlineOffset: "1px",
                }}
              />
            ))}
          </div>
        </div>
      );

    case "prompt-box":
      return (
        <div
          className="w-[86%] rounded-[14px] border p-2.5 shadow-xs transition-transform duration-200 group-hover:-translate-y-0.5"
          style={{ backgroundColor: surface, borderColor: border, color: ink }}
        >
          <div className="text-[11px] mb-2.5 text-left" style={{ color: muted }}>
            Design a calm clinical portal...
          </div>
          <div
            className="flex items-center justify-between pt-2 border-t text-[10px]"
            style={{ borderColor: border, fontFamily: "var(--font-mono), monospace" }}
          >
            <span
              className="px-2 py-0.5 rounded-full"
              style={{ backgroundColor: dark ? "#27272a" : "#f3f3f0" }}
            >
              Claude 4 ▾
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#E06D44] text-white font-medium">
              ↑
            </span>
          </div>
        </div>
      );

    case "folder-3d":
      return (
        <div className="relative w-28 h-20 flex items-end justify-center select-none">
          <div
            className="absolute w-20 h-12 top-2 rounded-[7px] border transition-all duration-300 group-hover:-translate-y-2.5 group-hover:-rotate-8"
            style={{ backgroundColor: surface, borderColor: border }}
          />
          <div
            className="absolute w-20 h-12 top-2.5 rounded-[7px] border transition-all duration-300 group-hover:-translate-y-3 group-hover:rotate-8"
            style={{ backgroundColor: surface, borderColor: border }}
          />
          <div
            className="relative w-24 h-12 rounded-[10px] px-2.5 py-2 flex items-end justify-between text-[10px] font-medium shadow-md"
            style={{
              backgroundColor: dark ? "#27272a" : "#171716",
              color: "#fbfbfa",
            }}
          >
            <span>DESIGN.md</span>
            <span className="opacity-60 font-mono">05</span>
          </div>
        </div>
      );

    case "streaming-text":
      return (
        <div className="space-y-2 w-[84%] text-left">
          <div
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[10.5px]"
            style={{
              backgroundColor: surface,
              borderColor: border,
              color: ink,
              fontFamily: "var(--font-mono), monospace",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E06D44]" />
            <span>Crossing 4 references...</span>
          </div>
          <div className="space-y-1 pl-1">
            <div className="h-1.5 w-[90%] rounded-full opacity-35" style={{ backgroundColor: ink }} />
            <div className="h-1.5 w-[64%] rounded-full opacity-20" style={{ backgroundColor: ink }} />
          </div>
        </div>
      );

    case "rail-toc":
      return (
        <div
          className="border-l pl-3 space-y-1.5 text-left text-[11px]"
          style={{ borderColor: border }}
        >
          {["01 Tokens", "02 Typography", "03 Motion"].map((t, idx) => (
            <div
              key={t}
              className="flex items-center gap-2"
              style={{
                color: idx === 0 ? "#E06D44" : muted,
                fontWeight: idx === 0 ? 600 : 400,
                fontFamily: "var(--font-mono), monospace",
              }}
            >
              <span>{t}</span>
            </div>
          ))}
        </div>
      );

    case "gooey-nav":
      return (
        <div
          className="inline-flex p-1 rounded-full border gap-0.5"
          style={{ backgroundColor: surface, borderColor: border }}
        >
          {["Studio", "Specs", "MCP"].map((tab, i) => (
            <button
              key={tab}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveNav(i);
              }}
              className="px-2.5 py-1 rounded-full text-[10.5px] font-medium transition-all cursor-pointer"
              style={{
                backgroundColor: activeNav === i ? ink : "transparent",
                color: activeNav === i ? surface : muted,
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      );

    case "animated-counter":
      return (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setCounterVal((v) => (v > 99 ? 94.2 : +(v + 1.1).toFixed(1)));
          }}
          className="px-4 py-2.5 rounded-[12px] border text-left cursor-pointer"
          style={{ backgroundColor: surface, borderColor: border, color: ink }}
        >
          <div className="text-[9.5px] font-mono" style={{ color: muted }}>
            CONVERSION · CLICK +
          </div>
          <div className="text-[20px] font-semibold tabular-nums tracking-tight">
            {counterVal}%
          </div>
        </button>
      );

    case "keycap-cta":
      return (
        <button
          type="button"
          onClick={(e) => e.stopPropagation()}
          className="px-4 py-2 rounded-[6px] bg-[#ff4d00] text-white text-[11px] font-mono font-medium border border-[#141413] shadow-[0_3px_0_#141413] active:translate-y-[2px] active:shadow-none transition-all duration-75 cursor-pointer"
        >
          deploy [⌘↵]
        </button>
      );

    case "duration-scrub":
      return (
        <div
          className="px-3.5 py-2.5 rounded-[12px] border flex items-center gap-3"
          style={{ backgroundColor: surface, borderColor: border, color: ink }}
        >
          <span className="text-[11px] font-mono font-semibold tabular-nums">160ms</span>
          <div className="flex items-end gap-1 h-4">
            {[35, 55, 75, 100, 75, 55, 35, 60, 40].map((h, i) => (
              <span
                key={i}
                className="w-[2px] rounded-full"
                style={{
                  height: `${h}%`,
                  backgroundColor: h === 100 ? "#E06D44" : ink,
                  opacity: h === 100 ? 1 : 0.28,
                }}
              />
            ))}
          </div>
        </div>
      );

    case "command-menu":
      return (
        <div
          className="w-[84%] rounded-[12px] border p-2.5 text-left"
          style={{ backgroundColor: surface, borderColor: border, color: ink }}
        >
          <div
            className="flex items-center justify-between pb-1.5 mb-1.5 border-b text-[10px]"
            style={{ borderColor: border, color: muted }}
          >
            <span>Search 200+ items...</span>
            <kbd className="px-1 rounded bg-black/5 font-mono">⌘K</kbd>
          </div>
          <div className="text-[10.5px] font-medium flex items-center justify-between">
            <span>Fluid Orb</span>
            <span className="text-[#E06D44]">↗</span>
          </div>
        </div>
      );

    case "morph-toast":
      return (
        <div className="relative w-[84%] flex flex-col items-center">
          <div
            className="w-[88%] h-3 rounded-t-[9px] border border-b-0 opacity-50 transition-transform duration-200 group-hover:-translate-y-1"
            style={{ backgroundColor: surface, borderColor: border }}
          />
          <div
            className="w-full px-3 py-2 rounded-[10px] border flex items-center justify-between text-[10.5px] shadow-sm"
            style={{
              backgroundColor: dark ? "#18181b" : "#141413",
              borderColor: border,
              color: "#fbfbfa",
              fontFamily: "var(--font-mono), monospace",
            }}
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
              <span>Added to DESIGN.md</span>
            </span>
            <span className="opacity-60">140ms</span>
          </div>
        </div>
      );

    default:
      return (
        <div
          className="w-[82%] rounded-t-[14px] border border-b-0 p-3 translate-y-3 transition-transform duration-200 group-hover:translate-y-1"
          style={{ backgroundColor: surface, borderColor: border, color: ink }}
        >
          <div className="w-7 h-1 rounded-full mx-auto mb-2 opacity-25" style={{ backgroundColor: ink }} />
          <div className="text-[11px] font-medium">Spring Sheet Drawer</div>
          <div className="text-[9.5px] font-mono" style={{ color: muted }}>
            cubic-bezier(0.32, 0.72, 0, 1)
          </div>
        </div>
      );
  }
}

export function InteractiveComponentCard({
  item,
  lang,
  onInspectCode,
}: {
  item: RareComponentItem;
  lang: "en" | "es";
  onInspectCode: (item: RareComponentItem) => void;
}) {
  const [darkStage, setDarkStage] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(item.cliInstall);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
      void fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "install_component", target: item.id }),
      }).catch(() => {});
    } catch {
      // ignore
    }
  };

  return (
    <article className="group rounded-[20px] p-2 bg-[#f2f1ed] border border-[var(--line)] hover:border-[var(--line-strong)] transition-colors flex flex-col justify-between">
      {/* Nested Double-Bezel Stage (Rare UI signature aesthetic!) */}
      <div
        className="relative h-[176px] rounded-[14px] border overflow-hidden flex items-center justify-center transition-colors duration-200"
        style={{
          backgroundColor: darkStage ? "#0d0d0f" : "#ffffff",
          borderColor: darkStage ? "rgba(255,255,255,0.08)" : "rgba(20,20,19,0.07)",
        }}
      >
        {/* Stage Top-Right Floating Pill Controls (Install · Code · Theme) */}
        <div
          className="absolute top-2.5 right-2.5 z-10 inline-flex items-center gap-0.5 px-1.5 py-1 rounded-full border text-[10.5px] opacity-90 group-hover:opacity-100 transition-opacity"
          style={{
            backgroundColor: darkStage ? "rgba(24,24,27,0.9)" : "rgba(251,251,250,0.92)",
            borderColor: darkStage ? "rgba(255,255,255,0.12)" : "rgba(20,20,19,0.10)",
            color: darkStage ? "#f4f4f5" : "#141413",
          }}
        >
          <button
            type="button"
            onClick={copyInstall}
            className="px-2 py-0.5 rounded-full hover:bg-black/5 cursor-pointer font-medium inline-flex items-center gap-1"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[#118453]" />
                <span>CLI</span>
              </>
            ) : (
              <span>Install</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => onInspectCode(item)}
            title="View TSX code & MCP setup"
            className="p-1 rounded-full hover:bg-black/5 cursor-pointer"
          >
            <Code2 className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => setDarkStage((d) => !d)}
            title="Toggle stage theme"
            className="p-1 rounded-full hover:bg-black/5 cursor-pointer"
          >
            {darkStage ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
          </button>
        </div>

        <ComponentLiveMicroStage kind={item.previewKind} dark={darkStage} />
      </div>

      {/* Clean Bottom Caption Bar */}
      <div className="px-2.5 pt-2.5 pb-1 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="text-[14px] font-semibold tracking-[-0.02em] truncate">
              {item.name}
            </h3>
            {item.isNew && (
              <span
                className="px-1.5 py-0.2 rounded-full bg-[#E06D44]/14 text-[#c95026] text-[9.5px] font-medium"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                NEW
              </span>
            )}
          </div>
          <p className="text-[11.5px] text-[var(--muted)] truncate">
            {lang === "es" ? item.descriptionEs : item.description}
          </p>
        </div>

        <a
          href={item.providerUrl}
          target="_blank"
          rel="noreferrer"
          title={`Source: ${item.provider}`}
          className="shrink-0 w-7 h-7 rounded-full bg-white border border-[var(--line)] flex items-center justify-center text-[#E06D44] hover:border-[var(--line-strong)] transition-colors"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </article>
  );
}
