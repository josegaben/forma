"use client";

import React, { useEffect, useState } from "react";
import { Check, Copy, Loader2, Search } from "lucide-react";

interface SvglLogoItem {
  id: number;
  title: string;
  categories: string[];
  svgLightUrl: string;
  svgDarkUrl: string;
  brandSite: string;
  svg?: string;
}

interface IconifyItem {
  id: string;
  pack: string;
  name: string;
  svgUrl: string;
  svg: string;
}

export function ConnectedServicesHub({ lang }: { lang: "en" | "es" }) {
  const [mode, setMode] = useState<"logos" | "icons">("logos");
  const [iconPack, setIconPack] = useState<"all" | "ph" | "tabler" | "iconoir">("all");
  const [query, setQuery] = useState("stripe");
  const [loading, setLoading] = useState(false);
  const [logos, setLogos] = useState<SvglLogoItem[]>([]);
  const [icons, setIcons] = useState<IconifyItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [liveStatusMsg, setLiveStatusMsg] = useState("");

  const runSearch = async (targetMode: "logos" | "icons", q: string, pack: string) => {
    setLoading(true);
    try {
      const cleanQ = q.trim() || (targetMode === "logos" ? "vercel" : "terminal");
      const setQs =
        targetMode === "icons" && pack !== "all" ? `&set=${encodeURIComponent(pack)}` : "";
      const inlineQs = targetMode === "logos" ? "&inline=true" : "";
      const res = await fetch(
        `/api/assets?kind=${targetMode}&q=${encodeURIComponent(cleanQ)}&limit=8${setQs}${inlineQs}`
      );
      const data = await res.json();
      if (targetMode === "logos") {
        setLogos(Array.isArray(data.logos) ? data.logos : []);
      } else {
        setIcons(Array.isArray(data.icons) ? data.icons : []);
      }
    } catch {
      // ignore transient errors
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void runSearch(mode, query, iconPack);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, iconPack]);

  const handleCopySvg = async (key: string, valueToCopy: string) => {
    try {
      await navigator.clipboard.writeText(valueToCopy);
      setCopiedId(key);
      setLiveStatusMsg(
        liveStatusMsg === "Copied SVG" ? "Copied SVG\u00A0" : "Copied SVG"
      );
      setTimeout(() => {
        setCopiedId((prev) => (prev === key ? null : prev));
        setLiveStatusMsg("");
      }, 1800);
    } catch {
      setLiveStatusMsg("Copy failed");
    }
  };

  return (
    <div className="rounded-[20px] p-5 bg-white border border-[var(--line)] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[16px] font-semibold tracking-[-0.02em]">
            {lang === "es"
              ? "Buscador vectorial conectado en vivo (SVGL + Iconify)"
              : "Live Connected Vector Engine (SVGL Brand Logos + Iconify)"}
          </h3>
          <p className="text-[12.5px] text-[var(--muted)]">
            {lang === "es"
              ? "Copia <svg> oficiales de marcas tech o iconos Phosphor / Tabler / Iconoir sin alucinaciones."
              : "Copy official <svg> brand marks or Phosphor / Tabler / Iconoir vectors with zero hallucination."}
          </p>
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-[var(--panel)] border border-[var(--line)] self-start">
          <button
            type="button"
            onClick={() => {
              setMode("logos");
              setQuery("stripe");
            }}
            className={`min-h-[1.875rem] px-3 py-1 rounded-full text-[11.5px] font-medium cursor-pointer transition-colors ${
              mode === "logos" ? "bg-[#141413] text-white" : "text-[var(--muted)]"
            }`}
          >
            {lang === "es" ? "Logos SVGL (450+)" : "SVGL Logos (450+)"}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("icons");
              setQuery("terminal");
            }}
            className={`min-h-[1.875rem] px-3 py-1 rounded-full text-[11.5px] font-medium cursor-pointer transition-colors ${
              mode === "icons" ? "bg-[#141413] text-white" : "text-[var(--muted)]"
            }`}
          >
            {lang === "es" ? "Iconos (18k+)" : "Vector Icons (18k+)"}
          </button>
        </div>
      </div>

      {/* Native <form> for IME-safe Enter submission */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void runSearch(mode, query, iconPack);
        }}
        className="flex flex-wrap items-center gap-2"
      >
        <div className="flex-1 min-w-[210px] flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fbfbfa] border border-[var(--line-strong)]">
          <Search className="w-3.5 h-3.5 text-[var(--muted)] shrink-0" />
          <label htmlFor="live-vector-search" className="sr-only">
            {lang === "es" ? "Buscar logo o icono SVG" : "Search SVG logo or icon"}
          </label>
          <input
            id="live-vector-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              mode === "logos"
                ? "stripe, anthropic, vercel, cloudflare, postgres..."
                : "terminal, shield, sparkle, database, waveform..."
            }
            className="flex-1 bg-transparent text-[13px] focus:outline-none min-h-[1.75rem]"
          />
        </div>

        {mode === "icons" && (
          <div className="inline-flex items-center gap-1">
            {(
              [
                ["all", "All"],
                ["ph", "Phosphor"],
                ["tabler", "Tabler"],
                ["iconoir", "Iconoir"],
              ] as const
            ).map(([id, lbl]) => (
              <button
                key={id}
                type="button"
                onClick={() => setIconPack(id)}
                className={`min-h-[2rem] px-2.5 py-1 rounded-full text-[11px] cursor-pointer ${
                  iconPack === id
                    ? "bg-[#141413] text-white font-medium"
                    : "bg-[#f2f1ed] text-[var(--muted)]"
                }`}
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                {lbl}
              </button>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="min-h-[2.125rem] px-4 py-1.5 rounded-full bg-[#141413] text-white text-[12px] font-medium cursor-pointer inline-flex items-center gap-1.5"
        >
          {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>{lang === "es" ? "Buscar SVG" : "Search SVG"}</span>
        </button>

        {/* Accessible screen-reader status region outside copy buttons */}
        <span role="status" className="sr-only">
          {liveStatusMsg}
        </span>
      </form>

      {mode === "logos" ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {logos.map((logo) => {
            const key = `logo-${logo.id}`;
            const isCopied = copiedId === key;
            return (
              <div
                key={logo.id}
                className="rounded-[14px] p-3 bg-[#f7f6f2] border border-[var(--line)] flex flex-col justify-between gap-3"
              >
                <div className="h-12 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo.svgLightUrl}
                    alt={logo.title}
                    width={36}
                    height={36}
                    className="max-h-9 max-w-[110px] object-contain"
                  />
                </div>
                <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-[var(--line)]">
                  <span className="text-[12px] font-medium truncate">{logo.title}</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopySvg(key, logo.svg || logo.svgLightUrl)
                    }
                    aria-label={`Copy ${logo.title} SVG`}
                    className="min-h-[1.625rem] min-w-[1.625rem] px-2 py-0.5 rounded-full bg-white border border-[var(--line)] text-[10.5px] inline-flex items-center gap-1 cursor-pointer shrink-0"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-[#118453]" aria-hidden="true" />
                        <span>SVG</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-2.5 h-2.5" aria-hidden="true" />
                        <span>SVG</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {icons.map((ic) => {
            const key = `ic-${ic.id}`;
            const isCopied = copiedId === key;
            return (
              <div
                key={ic.id}
                className="rounded-[14px] p-3 bg-[#f7f6f2] border border-[var(--line)] flex flex-col justify-between gap-3"
              >
                <div className="h-11 flex items-center justify-center text-[#141413]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ic.svgUrl}
                    alt={ic.id}
                    width={26}
                    height={26}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-[var(--line)]">
                  <span
                    className="text-[11px] truncate text-[var(--muted)]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {ic.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopySvg(key, ic.svg || ic.svgUrl)}
                    aria-label={`Copy ${ic.id} SVG`}
                    className="min-h-[1.625rem] min-w-[1.625rem] px-2 py-0.5 rounded-full bg-white border border-[var(--line)] text-[10.5px] inline-flex items-center gap-1 cursor-pointer shrink-0"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-[#118453]" aria-hidden="true" />
                        <span>SVG</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-2.5 h-2.5" aria-hidden="true" />
                        <span>SVG</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
