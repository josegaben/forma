"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Code2,
  Copy,
  Eye,
  ExternalLink,
  Pin,
  Sparkles,
  X,
} from "lucide-react";
import {
  getSectionVaultFeed,
  SECTION_KIND_LABELS,
  type SectionKind,
  type VisualSectionItem,
} from "@/lib/section-vault";

interface SectionVaultShowcaseProps {
  lang: "en" | "es";
  pinnedSectionIds: string[];
  onTogglePinSection: (sectionId: string) => void;
}

const FILTER_TABS: { id: SectionKind | "all"; en: string; es: string }[] = [
  { id: "all", en: "All Sections", es: "Todas las Secciones" },
  { id: "hero", en: "Heros", es: "Heros" },
  { id: "navbar", en: "Navbars", es: "Navbars" },
  { id: "pricing", en: "Pricing Tables", es: "Tablas de Precios" },
  { id: "bento-features", en: "Bento & Features", es: "Bento y Features" },
  { id: "cta-footer", en: "Footers & CTAs", es: "Footers y CTAs" },
];

export function SectionVaultShowcase({
  lang,
  pinnedSectionIds,
  onTogglePinSection,
}: SectionVaultShowcaseProps) {
  const vaultFeed = useMemo(() => getSectionVaultFeed(), []);
  const [selectedTab, setSelectedTab] = useState<SectionKind | "all">("all");
  const [modeFilter, setModeFilter] = useState<"all" | "light" | "dark">("all");
  const [showAll, setShowAll] = useState(false);
  const [activeSection, setActiveSection] = useState<VisualSectionItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live on-demand Playwright section scan state
  const [liveScanUrl, setLiveScanUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [liveScannedSections, setLiveScannedSections] = useState<VisualSectionItem[]>([]);
  const [scanMessage, setScanMessage] = useState("");

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Modern Web Guidance: Safari fallback for <dialog closedby="any">
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || "closedBy" in HTMLDialogElement.prototype) return;

    const onBackdropClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isDialogContent) dialog.close();
    };

    dialog.addEventListener("click", onBackdropClick);
    return () => dialog.removeEventListener("click", onBackdropClick);
  }, []);

  const allSections = useMemo(() => {
    const combined = [...liveScannedSections, ...(vaultFeed.sections || [])];
    const seen = new Set<string>();
    return combined.filter((s) => {
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
  }, [liveScannedSections, vaultFeed.sections]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: allSections.length };
    for (const s of allSections) {
      map[s.kind] = (map[s.kind] || 0) + 1;
    }
    return map;
  }, [allSections]);

  const filteredSections = useMemo(() => {
    const list = allSections.filter((s) => {
      if (selectedTab !== "all" && s.kind !== selectedTab) return false;
      if (modeFilter !== "all" && s.computedSpec.mode !== modeFilter) return false;
      return true;
    });
    return showAll ? list : list.slice(0, 9);
  }, [allSections, selectedTab, modeFilter, showAll]);

  const totalMatching = useMemo(() => {
    return allSections.filter((s) => {
      if (selectedTab !== "all" && s.kind !== selectedTab) return false;
      if (modeFilter !== "all" && s.computedSpec.mode !== modeFilter) return false;
      return true;
    }).length;
  }, [allSections, selectedTab, modeFilter]);

  const handleSelectTab = (tabId: SectionKind | "all") => {
    setSelectedTab(tabId);
    setShowAll(false);
    const btn = tabRefs.current[tabId];
    btn?.scrollIntoView({ block: "nearest", inline: "nearest" });
  };

  const openInspector = (item: VisualSectionItem) => {
    setActiveSection(item);
    requestAnimationFrame(() => dialogRef.current?.showModal());
  };

  const copySnippet = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(key);
      setTimeout(() => setCopiedId((prev) => (prev === key ? null : prev)), 1800);
    } catch {
      // ignore
    }
  };

  const handleLiveSectionScan = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = liveScanUrl.trim();
    if (!raw) return;
    setScanning(true);
    setScanMessage("");
    try {
      const res = await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: raw }),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.sections) && data.sections.length > 0) {
        const enriched: VisualSectionItem[] = data.sections.map((s: VisualSectionItem) => ({
          ...s,
          tags: s.tags || ["live-scan"],
        }));
        setLiveScannedSections((prev) => [...enriched, ...prev]);
        setScanMessage(
          lang === "es"
            ? `✓ ${enriched.length} secciones renderizadas y extraídas de ${data.hostname}`
            : `✓ ${enriched.length} live sections rendered & extracted from ${data.hostname}`
        );
        setLiveScanUrl("");
      } else {
        setScanMessage(data.error || "Could not segment target URL.");
      }
    } catch {
      setScanMessage("Playwright runtime is available in local/CI environments.");
    } finally {
      setScanning(false);
    }
  };

  return (
    <section
      id="section-vault"
      className="py-16 px-5 border-t border-[var(--line)] bg-[#fbfbfa]"
    >
      <div className="mx-auto max-w-[1140px] space-y-7">
        {/* Header & Live Playwright Scanner Bar */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div className="max-w-[650px]">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[var(--line)] text-[11px] text-[var(--muted)] mb-3"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#118453]" />
              <span>
                PLAYWRIGHT + VISION VAULT · {allSections.length} REAL CLIENT-RENDERED SECTIONS
              </span>
            </div>
            <h2
              className="text-[clamp(1.9rem,3.4vw,2.65rem)] leading-[1.08] tracking-[-0.02em] font-normal"
              style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
            >
              {lang === "es"
                ? "Arquitectura real por sección: captura + DOM limpio."
                : "Real section blueprints: live pixels + Clean DOM."}
            </h2>
            <p className="mt-2 text-[14px] text-[var(--muted)] leading-[1.55]">
              {lang === "es"
                ? "Nuestro crawler con Playwright renderiza webs hidratadas en cliente, recorta Heros, Navbars, Bentos y Tablas de Precios reales, destila su esqueleto DOM limpio y lo inyecta en tu instrucción DESIGN.md."
                : "Our headless Playwright + Vision crawler renders client-hydrated websites, crops real Heros, Navbars, Bento grids, and Pricing matrices, distills their Clean Semantic DOM skeleton, and injects them directly into your AI prompt."}
            </p>
          </div>

          {/* Live URL Section Scanner Form */}
          <form
            onSubmit={handleLiveSectionScan}
            className="flex flex-col gap-1.5 w-full lg:w-[390px]"
          >
            <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white border border-[var(--line-strong)] shadow-[var(--shadow-sm)]">
              <input
                type="text"
                value={liveScanUrl}
                onChange={(e) => setLiveScanUrl(e.target.value)}
                placeholder={
                  lang === "es"
                    ? "Escanear URL con Playwright (ej. stripe.com)..."
                    : "Deep-scan URL sections (e.g. stripe.com)..."
                }
                aria-label="URL to deep-scan with Playwright"
                className="flex-1 min-w-0 px-3 py-1 text-[12.5px] bg-transparent outline-none placeholder:text-[var(--muted-2)]"
              />
              <button
                type="submit"
                disabled={scanning}
                className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#141413] text-white text-[12px] font-medium hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {scanning
                    ? lang === "es"
                      ? "Renderizando..."
                      : "Rendering..."
                    : lang === "es"
                    ? "Extraer DOM"
                    : "Scan DOM"}
                </span>
              </button>
            </div>
            {scanMessage && (
              <p
                className="text-[11px] text-[#118453] px-3"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                {scanMessage}
              </p>
            )}
          </form>
        </div>

        {/* Single-Row Accessible Filter Bar (Modern Web Guidance: tabs) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)]">
          <div
            role="tablist"
            aria-label="Filter visual section blueprints"
            className="flex items-center gap-5 overflow-x-auto max-w-full"
          >
            {FILTER_TABS.map((tab) => {
              const isSelected = selectedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={(el) => {
                    tabRefs.current[tab.id] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelectTab(tab.id)}
                  className="vault-tab py-2.5 text-[13px] cursor-pointer whitespace-nowrap"
                >
                  <span>{lang === "es" ? tab.es : tab.en}</span>
                  <span
                    className="ml-1.5 text-[11px] text-[var(--muted-2)] tabular-nums"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {counts[tab.id] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mode Toggle + Pinned Counter */}
          <div className="flex items-center gap-2 pb-2 sm:pb-0">
            {pinnedSectionIds.length > 0 && (
              <span
                className="px-2.5 py-1 rounded-full bg-[#118453]/10 text-[#118453] text-[11px] font-medium tabular-nums"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                {pinnedSectionIds.length} pinned in DESIGN.md
              </span>
            )}
            <div
              className="inline-flex items-center p-0.5 rounded-full bg-[var(--panel)] border border-[var(--line)] text-[11px]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              {(["all", "light", "dark"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModeFilter(m)}
                  className={`px-2.5 py-0.5 rounded-full cursor-pointer capitalize ${
                    modeFilter === m
                      ? "bg-white text-[var(--ink)] shadow-xs font-medium"
                      : "text-[var(--muted)]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Section Blueprint Cards (Modern Web Guidance: card + optimize-image-priority) */}
        <div
          role="tabpanel"
          aria-label="Visual section blueprints grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredSections.map((sec) => {
            const isPinned = pinnedSectionIds.includes(sec.id);
            const isNavbar = sec.kind === "navbar";
            return (
              <article
                key={sec.id}
                className="visual-card overflow-hidden flex flex-col justify-between"
              >
                {/* Real Playwright Section Crop */}
                <img
                  src={sec.screenshotUrl}
                  alt={`${sec.hostname} ${sec.kind} — ${sec.vision.archetype}`}
                  width={720}
                  height={isNavbar ? 120 : 450}
                  loading="lazy"
                  onClick={() => openInspector(sec)}
                  className={`w-full border-b border-[var(--line)] cursor-pointer ${
                    isNavbar
                      ? "aspect-[16/5] object-contain p-3 bg-[#f1f0ec]"
                      : "aspect-[16/10] object-cover object-top"
                  }`}
                />

                <header className="px-4 pt-3.5 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div
                      className="flex items-center gap-2 text-[10.5px] text-[var(--muted)]"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      <span className="px-1.5 py-0.5 rounded bg-[var(--panel)] text-[var(--ink)] font-medium">
                        {SECTION_KIND_LABELS[sec.kind].badge}
                      </span>
                      <span className="truncate">{sec.hostname}</span>
                      <span>·</span>
                      <span className="text-[#118453] tabular-nums">
                        {sec.vision.visualCraftScore}
                      </span>
                    </div>
                    <h3 className="mt-1 text-[14.5px] font-semibold leading-snug line-clamp-1">
                      {sec.vision.archetype}
                    </h3>
                  </div>

                  <span
                    className="shrink-0 w-4 h-4 rounded-full border border-black/15 mt-1"
                    style={{ backgroundColor: sec.computedSpec.bg }}
                    title={`Surface ${sec.computedSpec.bg} (${sec.computedSpec.mode})`}
                  />
                </header>

                <div className="px-4 py-2.5 space-y-2">
                  <p className="text-[12.5px] text-[var(--muted)] line-clamp-2 leading-[1.45]">
                    {sec.vision.layoutMechanics}
                  </p>
                  <div
                    className="flex flex-wrap items-center gap-1.5 text-[10.5px] text-[var(--muted)]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    <span className="px-2 py-0.5 rounded-full bg-[var(--panel)]">
                      {sec.computedSpec.headlineFont || "System"} · {sec.computedSpec.headlineSize}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[var(--panel)]">
                      {sec.computedSpec.layoutMode}
                    </span>
                  </div>
                </div>

                <footer className="px-4 pb-3.5 pt-2 border-t border-[var(--line)] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => openInspector(sec)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--line-strong)] text-[11.5px] font-medium hover:bg-[var(--panel)] cursor-pointer"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{lang === "es" ? "Ver DOM limpio" : "Clean DOM"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onTogglePinSection(sec.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11.5px] font-medium cursor-pointer transition-colors ${
                      isPinned
                        ? "bg-[#118453] text-white"
                        : "bg-[#141413] text-white hover:opacity-90"
                    }`}
                  >
                    {isPinned ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{lang === "es" ? "Fijado en IA" : "Pinned in AI"}</span>
                      </>
                    ) : (
                      <>
                        <Pin className="w-3.5 h-3.5" />
                        <span>{lang === "es" ? "Usar sección" : "Inject section"}</span>
                      </>
                    )}
                  </button>
                </footer>
              </article>
            );
          })}
        </div>

        {/* Show All Toggle */}
        {totalMatching > 9 && (
          <div className="flex justify-center pt-1">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="px-5 py-2 rounded-full bg-white border border-[var(--line-strong)] text-[12.5px] font-medium hover:bg-[var(--panel)] cursor-pointer tabular-nums"
            >
              {showAll
                ? lang === "es"
                  ? "Mostrar menos secciones"
                  : "Show fewer sections"
                : lang === "es"
                ? `Ver las ${totalMatching} secciones reales`
                : `Browse all ${totalMatching} real sections`}
            </button>
          </div>
        )}
      </div>

      {/* Native <dialog closedby="any"> Modal for Clean DOM + Vision Spec Inspection */}
      <dialog
        ref={dialogRef}
        {...({ closedby: "any" } as Record<string, string>)}
        aria-labelledby="section-inspector-title"
        className="dna-modal max-w-[920px]"
      >
        {activeSection && (
          <div className="p-6 space-y-5">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-[var(--line)]">
              <div>
                <div
                  className="flex items-center gap-2 text-[11px] text-[#E06D44]"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  <span>{SECTION_KIND_LABELS[activeSection.kind].badge}</span>
                  <span>·</span>
                  <span>{activeSection.hostname}</span>
                  <span>·</span>
                  <span>Craft {activeSection.vision.visualCraftScore}/100</span>
                </div>
                <h3 id="section-inspector-title" className="text-[19px] font-semibold mt-0.5">
                  {activeSection.vision.archetype}
                </h3>
                <p className="text-[12.5px] text-[var(--muted)] mt-0.5">
                  {activeSection.vision.summary}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={activeSection.pageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[var(--line)] text-[11.5px] text-[var(--muted)] hover:text-[var(--ink)]"
                >
                  <span>Live URL</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <form method="dialog">
                  <button
                    type="submit"
                    aria-label="Close"
                    className="p-2 rounded-full bg-[var(--panel)] hover:bg-[var(--panel-2)] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* Cropped Live Screenshot Preview */}
            <div className="rounded-[14px] overflow-hidden border border-[var(--line)] bg-[#f2f1ed]">
              <img
                src={activeSection.screenshotUrl}
                alt={`${activeSection.hostname} ${activeSection.kind}`}
                width={900}
                height={420}
                className="w-full max-h-[340px] object-contain mx-auto"
              />
            </div>

            {/* Vision Micro-Details & Computed Style Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-[14px] bg-[var(--panel)] border border-[var(--line)] space-y-2">
                <div
                  className="flex items-center gap-1.5 text-[11px] text-[var(--muted)] uppercase"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>VISION & SPATIAL MICRO-DETAILS</span>
                </div>
                <ul className="space-y-1.5 text-[12.5px] text-[var(--ink)] list-disc pl-4">
                  {activeSection.vision.microDetails.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-[14px] bg-[var(--panel)] border border-[var(--line)] space-y-2">
                <div
                  className="text-[11px] text-[var(--muted)] uppercase"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  COMPUTED BROWSER TOKENS (GETCOMPUTEDSTYLE)
                </div>
                <div
                  className="grid grid-cols-2 gap-2 text-[12px]"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  <div>
                    <span className="text-[var(--muted)]">Surface: </span>
                    <strong>{activeSection.computedSpec.bg}</strong>
                  </div>
                  <div>
                    <span className="text-[var(--muted)]">Ink: </span>
                    <strong>{activeSection.computedSpec.ink}</strong>
                  </div>
                  <div>
                    <span className="text-[var(--muted)]">Heading: </span>
                    <strong>{activeSection.computedSpec.headlineFont}</strong>
                  </div>
                  <div>
                    <span className="text-[var(--muted)]">Scale: </span>
                    <strong>
                      {activeSection.computedSpec.headlineSize} (
                      {activeSection.computedSpec.headlineTracking})
                    </strong>
                  </div>
                  <div>
                    <span className="text-[var(--muted)]">Layout: </span>
                    <strong>{activeSection.computedSpec.layoutMode}</strong>
                  </div>
                  <div>
                    <span className="text-[var(--muted)]">Radius: </span>
                    <strong>{activeSection.computedSpec.radiusSample}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Clean Semantic DOM Blueprint + Copy Action */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span
                  className="text-[11px] text-[var(--muted)] uppercase"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  CLEAN SEMANTIC DOM SKELETON + COMPUTED ANNOTATIONS
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      copySnippet(
                        "dom-prompt",
                        `${activeSection.vision.agentRecreationPrompt}\n\n\`\`\`html\n${activeSection.cleanDom}\n\`\`\``
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[var(--line-strong)] text-[11.5px] font-medium cursor-pointer"
                  >
                    {copiedId === "dom-prompt" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#118453]" />
                        <span>Copied Blueprint</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Section Prompt + DOM</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => onTogglePinSection(activeSection.id)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11.5px] font-medium cursor-pointer ${
                      pinnedSectionIds.includes(activeSection.id)
                        ? "bg-[#118453] text-white"
                        : "bg-[#141413] text-white"
                    }`}
                  >
                    {pinnedSectionIds.includes(activeSection.id)
                      ? "✓ Pinned in DESIGN.md"
                      : "+ Pin to DESIGN.md"}
                  </button>
                </div>
              </div>
              <pre
                className="p-4 rounded-[14px] bg-[#141413] text-[#eae9e4] text-[11.5px] leading-[1.55] whitespace-pre-wrap break-words max-h-[260px] overflow-y-auto"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                <code>{activeSection.cleanDom}</code>
              </pre>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
