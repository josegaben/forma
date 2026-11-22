"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { CURATED_COLOR_PALETTES, type CuratedColorPalette } from "@/data/color-palettes";
import {
  CRAFT_TOOLS_AND_ASSETS,
  RARE_COMPONENTS,
  TYPOGRAPHY_PAIRINGS,
  type RareComponentItem,
  type TypographyPairing,
} from "@/data/compendium";
import { WEB_FORMATS, type WebFormat } from "@/data/formats";
import {
  GLOBAL_DESIGN_DIRECTORIES,
  type GlobalDesignDirectory,
} from "@/data/world-references";
import {
  FormatVisualThumb,
  PaletteVisualThumb,
} from "@/components/FormatVisualThumb";
import { ComponentLiveMicroStage } from "@/components/InteractiveComponentCard";
import {
  getAllVaultSections,
  SECTION_KIND_LABELS,
  type VisualSectionItem,
} from "@/lib/section-vault";

interface ExplorerEntry {
  id: string;
  group:
    | "Components"
    | "Section Vault"
    | "Formats"
    | "Palettes"
    | "Typography"
    | "Shaders & Icons"
    | "Directories";
  title: string;
  subtitle: string;
  actionLabel: string;
  formatRef?: WebFormat;
  paletteRef?: CuratedColorPalette;
  componentRef?: RareComponentItem;
  sectionRef?: VisualSectionItem;
  fontRef?: TypographyPairing;
  directoryRef?: GlobalDesignDirectory;
  externalUrl?: string;
  cliCopy?: string;
}

export function CommandExplorerModal({
  open,
  onClose,
  lang,
  onSelectFormat,
  onSelectPalette,
  onInspectComponent,
  onPinSection,
  onSelectFontPairing,
  onXrayUrl,
}: {
  open: boolean;
  onClose: () => void;
  lang: "en" | "es";
  onSelectFormat: (id: string) => void;
  onSelectPalette: (pal: CuratedColorPalette) => void;
  onInspectComponent: (comp: RareComponentItem) => void;
  onPinSection?: (sectionId: string) => void;
  onSelectFontPairing?: (pairingId: string) => void;
  onXrayUrl?: (url: string) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Modern Web Guidance: Safari fallback for <dialog closedby="any">
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);

    let cleanupClick = () => {};
    if (!("closedBy" in HTMLDialogElement.prototype)) {
      const onBackdrop = (event: MouseEvent) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const inside =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (!inside) dialog.close();
      };
      dialog.addEventListener("click", onBackdrop);
      cleanupClick = () => dialog.removeEventListener("click", onBackdrop);
    }

    return () => {
      dialog.removeEventListener("close", handleClose);
      cleanupClick();
    };
  }, [onClose]);

  const entries: ExplorerEntry[] = useMemo(() => {
    const list: ExplorerEntry[] = [
      ...RARE_COMPONENTS.map((c) => ({
        id: `comp-${c.id}`,
        group: "Components" as const,
        title: c.name,
        subtitle: lang === "es" ? c.descriptionEs : c.description,
        actionLabel: c.cliInstall,
        componentRef: c,
      })),
      ...getAllVaultSections().map((s) => ({
        id: `sec-${s.id}`,
        group: "Section Vault" as const,
        title: `[${SECTION_KIND_LABELS[s.kind].badge}] ${s.hostname} — ${s.vision.archetype}`,
        subtitle: s.vision.layoutMechanics,
        actionLabel: "Pin real section + Clean DOM into DESIGN.md",
        sectionRef: s,
      })),
      ...WEB_FORMATS.map((f) => ({
        id: `fmt-${f.id}`,
        group: "Formats" as const,
        title: f.name,
        subtitle: lang === "es" ? f.taglineEs : f.tagline,
        actionLabel: "Apply 5-layer format",
        formatRef: f,
      })),
      ...CURATED_COLOR_PALETTES.map((p) => ({
        id: `pal-${p.id}`,
        group: "Palettes" as const,
        title: lang === "es" ? p.nameEs : p.name,
        subtitle: lang === "es" ? p.psychologyEs : p.psychology,
        actionLabel: `${p.harmony} · Apply palette`,
        paletteRef: p,
      })),
      ...TYPOGRAPHY_PAIRINGS.map((t) => ({
        id: `type-${t.id}`,
        group: "Typography" as const,
        title: t.name,
        subtitle: `${t.foundry} — ${lang === "es" ? t.vibeEs : t.vibe}`,
        actionLabel: "Apply live typography pairing to Studio",
        fontRef: t,
        cliCopy: `@import url('${t.cssImport}');`,
      })),
      ...CRAFT_TOOLS_AND_ASSETS.map((a) => ({
        id: `asset-${a.id}`,
        group: "Shaders & Icons" as const,
        title: a.name,
        subtitle: lang === "es" ? a.whyUseItEs : a.whyUseIt,
        actionLabel: a.installOrUsage,
        externalUrl: a.url,
        cliCopy: a.installOrUsage,
      })),
      ...GLOBAL_DESIGN_DIRECTORIES.map((d) => ({
        id: `dir-${d.name}`,
        group: "Directories" as const,
        title: d.name,
        subtitle: `${d.category} · ${d.url}`,
        actionLabel: "Live X-Ray into Studio →",
        directoryRef: d,
        externalUrl: d.url,
      })),
    ];

    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) =>
      `${item.group} ${item.title} ${item.subtitle} ${item.actionLabel}`
        .toLowerCase()
        .includes(q)
    );
  }, [query, lang]);

  const safeIdx = Math.min(activeIndex, Math.max(0, entries.length - 1));
  const activeEntry = entries[safeIdx];

  const triggerEntry = (entry: ExplorerEntry | undefined) => {
    if (!entry) return;
    if (entry.componentRef) {
      onClose();
      onInspectComponent(entry.componentRef);
    } else if (entry.sectionRef) {
      onPinSection?.(entry.sectionRef.id);
      onClose();
      document.getElementById("section-vault")?.scrollIntoView({ behavior: "smooth" });
    } else if (entry.formatRef) {
      onClose();
      onSelectFormat(entry.formatRef.id);
    } else if (entry.paletteRef) {
      onClose();
      onSelectPalette(entry.paletteRef);
    } else if (entry.fontRef) {
      onClose();
      onSelectFontPairing?.(entry.fontRef.id);
    } else if (entry.directoryRef) {
      onClose();
      if (onXrayUrl) {
        onXrayUrl(entry.directoryRef.url);
      } else {
        window.open(entry.directoryRef.url, "_blank", "noreferrer");
      }
    } else if (entry.cliCopy) {
      navigator.clipboard.writeText(entry.cliCopy).catch(() => {});
      if (entry.externalUrl) window.open(entry.externalUrl, "_blank", "noreferrer");
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: "any" } as Record<string, string>)}
      aria-label="Search compendium"
      className="dna-modal max-w-[760px]"
    >
      <div
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(entries.length - 1, i + 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(0, i - 1));
          } else if (e.key === "Enter" && activeEntry) {
            e.preventDefault();
            triggerEntry(activeEntry);
          }
        }}
      >
        {/* Search Input Top Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--line)]">
          <Search className="w-4 h-4 text-[var(--muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder={
              lang === "es"
                ? "Buscar componentes, formatos, paletas, fuentes, shaders..."
                : "Search components, formats, palettes, fonts, shaders..."
            }
            className="flex-1 text-[14px] bg-transparent focus:outline-none"
          />
          <form method="dialog">
            <button
              type="submit"
              className="px-2 py-0.5 rounded-md border border-[var(--line)] text-[11px] text-[var(--muted)] cursor-pointer"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              esc
            </button>
          </form>
        </div>

        {/* Split Two-Pane Explorer (Rare UI screenshot homage!) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 h-[360px] overflow-hidden">
          {/* Left Navigable List */}
          <div className="sm:col-span-6 h-full overflow-y-auto p-2 border-r border-[var(--line)] space-y-0.5">
            {entries.map((entry, idx) => {
              const isSelected = idx === safeIdx;
              const prevGroup = idx > 0 ? entries[idx - 1].group : null;
              return (
                <React.Fragment key={entry.id}>
                  {entry.group !== prevGroup && (
                    <div
                      className="px-2.5 pt-2.5 pb-1 text-[10px] uppercase tracking-wider text-[var(--muted)]"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      {entry.group}
                    </div>
                  )}
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => triggerEntry(entry)}
                    className={`w-full px-3 py-2 rounded-[10px] text-left text-[13px] flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[var(--panel)] text-[var(--ink)] font-medium"
                        : "text-[var(--muted)] hover:text-[var(--ink)]"
                    }`}
                  >
                    <span className="truncate">{entry.title}</span>
                    {isSelected && <ArrowUpRight className="w-3.5 h-3.5 text-[#E06D44] shrink-0" />}
                  </button>
                </React.Fragment>
              );
            })}
            {entries.length === 0 && (
              <p className="p-4 text-[13px] text-[var(--muted)]">
                {lang === "es" ? "Sin resultados." : "No matching items."}
              </p>
            )}
          </div>

          {/* Right Live Visual Preview Stage */}
          <div className="hidden sm:flex sm:col-span-6 p-4 flex-col justify-between bg-[#fbfbfa]">
            {activeEntry ? (
              <>
                <div className="h-[195px] rounded-[14px] bg-[#f2f1ed] border border-[var(--line)] p-2 flex items-center justify-center overflow-hidden">
                  {activeEntry.componentRef ? (
                    <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center">
                      <ComponentLiveMicroStage
                        kind={activeEntry.componentRef.previewKind}
                        dark={false}
                      />
                    </div>
                  ) : activeEntry.sectionRef ? (
                    <img
                      src={activeEntry.sectionRef.screenshotUrl}
                      alt={activeEntry.title}
                      width={340}
                      height={180}
                      className="w-full h-full rounded-[10px] object-cover object-top"
                    />
                  ) : activeEntry.formatRef ? (
                    <FormatVisualThumb
                      format={activeEntry.formatRef}
                      heightClass="h-full"
                    />
                  ) : activeEntry.paletteRef ? (
                    <PaletteVisualThumb
                      palette={activeEntry.paletteRef}
                      lang={lang}
                    />
                  ) : (
                    <div className="w-full h-full rounded-[10px] bg-white border border-[var(--line)] p-4 flex flex-col justify-center text-left">
                      <span
                        className="text-[10px] text-[#E06D44] mb-1"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        {activeEntry.group}
                      </span>
                      <div
                        className="text-[22px] leading-tight"
                        style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
                      >
                        {activeEntry.title}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3">
                  <h4 className="text-[14.5px] font-semibold">{activeEntry.title}</h4>
                  <p className="text-[12.5px] text-[var(--muted)] mt-1 line-clamp-2">
                    {activeEntry.subtitle}
                  </p>
                  <div
                    className="mt-2.5 px-2.5 py-1.5 rounded-[8px] bg-[var(--panel)] text-[11px] text-[var(--ink)] truncate"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {activeEntry.actionLabel}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Bottom Keyboard Hint Bar */}
        <div
          className="px-4 py-2.5 border-t border-[var(--line)] bg-[var(--panel)]/60 flex items-center justify-between text-[11px] text-[var(--muted)]"
          style={{ fontFamily: "var(--font-mono), monospace" }}
        >
          <span>↑ ↓ navigate · ↵ apply</span>
          <span className="text-[#E06D44] font-medium">
            {entries.length} {lang === "es" ? "recursos" : "items"}
          </span>
        </div>
      </div>
    </dialog>
  );
}
