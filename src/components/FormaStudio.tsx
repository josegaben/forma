"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Download,
  Loader2,
  RefreshCw,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import { WEB_FORMATS, type WebFormat } from "@/data/formats";
import { GLOBAL_DESIGN_DIRECTORIES } from "@/data/world-references";
import discoveredFeed from "@/data/discovered-feed.json";
import { composeFormatGenome, type TargetStack } from "@/lib/composer";
import {
  convertScrapedSiteToFormat,
  type DiscoveredSite,
} from "@/lib/scraper";
import {
  cycleFormatOption,
  findMatchingScrapedSites,
  generateTailoredPreviewContent,
  recommendMixFromBrief,
} from "@/lib/synthesizer";
import {
  AgentBadgeRow,
  FormaLogo,
  GitHubIcon,
} from "@/components/FormaLogo";
import {
  FormatVisualThumb,
  MotionCurveMini,
} from "@/components/FormatVisualThumb";
import { LiveFormatPreview } from "@/components/LiveFormatPreview";

const GITHUB_REPO_URL = "https://github.com/josegaben/forma";
const GITHUB_XRAY_URL = "https://github.com/josegaben/forma-xray";

const HERO_ROLES = [
  { en: "a design engineer", es: "un design engineer" },
  { en: "a Swiss brand studio", es: "un estudio de marca suizo" },
  { en: "a SaaS UI architect", es: "un arquitecto UI SaaS" },
  { en: "a motion director", es: "un director de motion" },
];

const QUICK_IDEAS = [
  {
    labelEn: "AI voice receptionist for medical clinics",
    labelEs: "Recepcionista de voz IA para clínicas médicas",
    idea: "AI voice receptionist and patient scheduling for private medical clinics, warm, calm and trustworthy",
  },
  {
    labelEn: "Dark Kubernetes & FinOps agent platform",
    labelEs: "Plataforma oscura de agentes Kubernetes y FinOps",
    idea: "Conversational Kubernetes & FinOps cloud infrastructure platform, dark halftone like resiz.es with minimalist Swiss dock",
  },
  {
    labelEn: "Programmable B2B treasury & payouts",
    labelEs: "Tesorería B2B y pagos globales programables",
    idea: "Programmable B2B treasury, global payouts and real-time cashflow ledger like Stripe and Midday",
  },
  {
    labelEn: "Minimalist creative studio & architecture",
    labelEs: "Estudio creativo minimalista y dirección de arte",
    idea: "Creative direction and digital product studio like pdepablo and a1.gallery, pure Swiss whitespace and frosted dock",
  },
];

export function FormaStudio() {
  const [lang, setLang] = useState<"en" | "es">("en");
  const [origin, setOrigin] = useState("https://forma.to");
  const [roleIdx, setRoleIdx] = useState(0);

  // Agent bootstrap bar state
  const [agentTab, setAgentTab] = useState<"llms" | "mcp" | "cli">("llms");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Core Project Idea & Crossed Genome State
  const [ideaInput, setIdeaInput] = useState(
    "Conversational Kubernetes & FinOps cloud infrastructure platform, dark halftone like resiz.es with minimalist Swiss dock"
  );
  const [customFormats, setCustomFormats] = useState<WebFormat[]>([]);
  const [scrapingUrl, setScrapingUrl] = useState(false);
  const [scrapeNotice, setScrapeNotice] = useState("");

  const [surfaceId, setSurfaceId] = useState("resizes-infra");
  const [typographyId, setTypographyId] = useState("resizes-infra");
  const [layoutId, setLayoutId] = useState("pdepablo-studio");
  const [componentsId, setComponentsId] = useState("twentyfirst-craft");
  const [motionId, setMotionId] = useState("rauno-craft");
  const [stack, setStack] = useState<TargetStack>("nextjs-tailwind");

  // Visual Gallery state
  const [galleryTab, setGalleryTab] = useState<"formats" | "scraped">("formats");
  const [modeFilter, setModeFilter] = useState<"all" | "light" | "dark">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllGallery, setShowAllGallery] = useState(false);

  // Clean Code / Spec Drawer Modal (<dialog closedby="any">)
  const [modalTab, setModalTab] = useState<"prompt" | "rules" | "css" | "mcp">("prompt");
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const allFormats = useMemo(
    () => [...customFormats, ...WEB_FORMATS],
    [customFormats]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
      const params = new URLSearchParams(window.location.search);
      if (params.get("surface")) setSurfaceId(params.get("surface")!);
      if (params.get("type")) setTypographyId(params.get("type")!);
      if (params.get("layout")) setLayoutId(params.get("layout")!);
      if (params.get("comp")) setComponentsId(params.get("comp")!);
      if (params.get("motion")) setMotionId(params.get("motion")!);
      if (params.get("idea")) setIdeaInput(params.get("idea")!);
      const qLang = params.get("lang");
      if (qLang === "en" || qLang === "es") setLang(qLang);
    }
  }, []);

  // Gentle hero role cycling
  useEffect(() => {
    const id = setInterval(() => {
      setRoleIdx((i) => (i + 1) % HERO_ROLES.length);
    }, 3400);
    return () => clearInterval(id);
  }, []);

  // Modern Web Guidance: Safari fallback for <dialog closedby="any">
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!("closedBy" in HTMLDialogElement.prototype)) {
      const onBackdropClick = (event: MouseEvent) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const inside =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (!inside) dialog.close();
      };
      dialog.addEventListener("click", onBackdropClick);
      return () => dialog.removeEventListener("click", onBackdropClick);
    }
  }, []);

  const copyText = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 1800);
    } catch {
      // ignore
    }
  };

  const tailoredContent = useMemo(
    () => generateTailoredPreviewContent(ideaInput, lang),
    [ideaInput, lang]
  );

  const composed = useMemo(
    () =>
      composeFormatGenome({
        surfaceId,
        typographyId,
        layoutId,
        componentsId,
        motionId,
        projectName: tailoredContent.brandName,
        projectBrief: ideaInput,
        stack,
        enforceUnslop: true,
        customFormats,
      }),
    [
      surfaceId,
      typographyId,
      layoutId,
      componentsId,
      motionId,
      tailoredContent.brandName,
      ideaInput,
      stack,
      customFormats,
    ]
  );

  const matchedScrapedSiblings = useMemo(
    () =>
      findMatchingScrapedSites(
        ideaInput,
        composed.layers.surface.surface.mode,
        4
      ),
    [ideaInput, composed.layers.surface.surface.mode]
  );

  // Unified Smart Action: handles BOTH natural-language ideas AND pasted live URLs!
  const handleSynthesize = async (overrideIdea?: string) => {
    const raw = (overrideIdea ?? ideaInput).trim();
    if (overrideIdea !== undefined) setIdeaInput(overrideIdea);
    setScrapeNotice("");

    // Check if the user included a live URL to scrape & cross-remix!
    const urlMatch = raw.match(/https?:\/\/[^\s]+/i);
    if (urlMatch || /^[a-z0-9-]+\.[a-z]{2,}(\/.*)?$/i.test(raw)) {
      const targetUrl = urlMatch ? urlMatch[0] : `https://${raw}`;
      setScrapingUrl(true);
      try {
        const res = await fetch("/api/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: targetUrl }),
        });
        const data = await res.json();
        if (res.ok && data.format) {
          const fmt = data.format as WebFormat;
          setCustomFormats((prev) => [fmt, ...prev.filter((f) => f.id !== fmt.id)]);
          const rec = recommendMixFromBrief(raw);
          setSurfaceId(fmt.id);
          setTypographyId(fmt.id);
          setLayoutId(rec.selection.layoutId);
          setComponentsId(rec.selection.componentsId);
          setMotionId(fmt.id);
          setScrapeNotice(
            lang === "es"
              ? `✓ ADN extraído en vivo de ${data.site.hostname} (${data.site.craftScore}/100) y cruzado con ${composed.layers.layout.name}`
              : `✓ Live DNA scraped from ${data.site.hostname} (${data.site.craftScore}/100) & crossed with ${composed.layers.layout.name}`
          );
          document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
          setScrapingUrl(false);
          return;
        }
      } catch {
        // Fall back to semantic brief matching
      }
      setScrapingUrl(false);
    }

    const rec = recommendMixFromBrief(raw);
    setSurfaceId(rec.selection.surfaceId);
    setTypographyId(rec.selection.typographyId);
    setLayoutId(rec.selection.layoutId);
    setComponentsId(rec.selection.componentsId);
    setMotionId(rec.selection.motionId);
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
  };

  const blendDiscoveredSite = (site: DiscoveredSite) => {
    const fmt = convertScrapedSiteToFormat(site);
    setCustomFormats((prev) => [fmt, ...prev.filter((f) => f.id !== fmt.id)]);
    setSurfaceId(fmt.id);
    setTypographyId(fmt.id);
    setMotionId(fmt.id);
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
  };

  const applyFullFormat = (id: string) => {
    setSurfaceId(id);
    setTypographyId(id);
    setLayoutId(id);
    setComponentsId(id);
    setMotionId(id);
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
  };

  const shareStyleLink = () => {
    const url = new URL(origin);
    url.searchParams.set("surface", surfaceId);
    url.searchParams.set("type", typographyId);
    url.searchParams.set("layout", layoutId);
    url.searchParams.set("comp", componentsId);
    url.searchParams.set("motion", motionId);
    url.searchParams.set("idea", ideaInput.slice(0, 140));
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", url.toString());
    }
    copyText("share", url.toString());
  };

  const downloadDesignMd = () => {
    const blob = new Blob([composed.masterPrompt], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DESIGN-${tailoredContent.brandName.toLowerCase().replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredFormats = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = allFormats.filter((f) => {
      if (modeFilter !== "all" && f.surface.mode !== modeFilter) return false;
      if (!q) return true;
      return [
        f.name,
        f.category,
        f.tagline,
        ...f.keywords,
        ...f.inspiredBy.map((s) => s.name),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    return showAllGallery ? list : list.slice(0, 9);
  }, [allFormats, modeFilter, searchQuery, showAllGallery]);

  const filteredScraped = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = (discoveredFeed.sites as DiscoveredSite[]).filter((s) => {
      if (modeFilter !== "all" && s.mode !== modeFilter) return false;
      if (!q) return true;
      return `${s.hostname} ${s.title} ${s.primaryFont} ${s.sourceGallery}`
        .toLowerCase()
        .includes(q);
    });
    return showAllGallery ? list : list.slice(0, 9);
  }, [modeFilter, searchQuery, showAllGallery]);

  const agentCommands: Record<typeof agentTab, string> = {
    llms: `set up forma - ${origin}/llms.txt`,
    mcp: `claude mcp add --transport http forma ${origin}/api/mcp`,
    cli: `npx forma-xray https://resiz.es --out DESIGN.md`,
  };

  const totalReferencesCount =
    WEB_FORMATS.length +
    discoveredFeed.sites.length +
    GLOBAL_DESIGN_DIRECTORIES.length;

  const directoriesRow1 = GLOBAL_DESIGN_DIRECTORIES.slice(0, 29);
  const directoriesRow2 = GLOBAL_DESIGN_DIRECTORIES.slice(29);

  const modalCodeContent =
    modalTab === "prompt"
      ? composed.masterPrompt
      : modalTab === "rules"
      ? composed.cursorClaudeRules
      : modalTab === "css"
      ? composed.cssTokens
      : `# 1. Connect forma MCP server in Claude Code:\nclaude mcp add --transport http forma ${origin}/api/mcp\n\n# 2. Or pull this exact custom style into DESIGN.md:\ncurl -fsSL "${origin}/api/compose?surface=${surfaceId}&typography=${typographyId}&layout=${layoutId}&components=${componentsId}&motion=${motionId}&project=${encodeURIComponent(
          tailoredContent.brandName
        )}&format=markdown" > DESIGN.md`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* MINIMAL AIRY TOP BAR (Exact treg.to simplicity + Repo link) */}
      <header className="sticky top-0 z-30 bg-[#fbfbfa]/85 backdrop-blur-md border-b border-[var(--line)]">
        <nav
          aria-label="Primary"
          className="mx-auto max-w-[1160px] h-[56px] px-5 flex items-center justify-between"
        >
          <a href="#" aria-label="forma home">
            <FormaLogo size={28} />
          </a>

          <div className="flex items-center gap-5 text-[13.5px] text-[var(--muted)]">
            <a
              href="#studio"
              className="hidden sm:inline hover:text-[var(--ink)] transition-colors"
            >
              {lang === "es" ? "Estudio" : "Studio"}
            </a>
            <a
              href="#catalog"
              className="hidden sm:inline hover:text-[var(--ink)] transition-colors"
            >
              {lang === "es" ? "Galería" : "Gallery"}
            </a>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[var(--ink)] font-medium hover:opacity-75 transition-opacity"
            >
              <GitHubIcon className="w-[17px] h-[17px]" />
              <span>Repo</span>
            </a>

            <button
              type="button"
              onClick={() => setLang((l) => (l === "en" ? "es" : "en"))}
              className="px-2.5 py-1 rounded-full border border-[var(--line)] hover:border-[var(--line-strong)] text-[11px] text-[var(--ink)] cursor-pointer"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              {lang === "en" ? "EN · ES" : "ES · EN"}
            </button>

            <a
              href="#agent-bar"
              className="hidden md:inline-flex px-3.5 py-1.5 rounded-full bg-[#141413] text-[#fbfbfa] text-[12.5px] font-medium hover:opacity-90 transition-opacity"
            >
              {lang === "es" ? "Conectar agente" : "Connect agent"}
            </a>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* HERO — Pure treg.to Airy Editorial Clarity */}
        <section className="editorial-dot-canvas pt-16 sm:pt-20 pb-16 px-5">
          <div className="mx-auto max-w-[880px] text-center">
            {/* Top Monospace Pill */}
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[var(--line)] text-[12px] tracking-wide text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--line-strong)] transition-colors mb-8"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              <span>
                {totalReferencesCount}+ {lang === "es" ? "referencias" : "references"} ·{" "}
                {GLOBAL_DESIGN_DIRECTORIES.length}{" "}
                {lang === "es" ? "directorios" : "directories"} · open source ↗
              </span>
            </a>

            {/* Editorial Newsreader H1 (matching the uploaded treg.to aesthetic!) */}
            <h1
              className="text-[clamp(2.9rem,6.8vw,5.35rem)] leading-[1.01] tracking-[-0.03em] font-normal text-[#141413]"
              style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
            >
              {lang === "es"
                ? "OpenRouter para diseño web"
                : "OpenRouter for web design"}
            </h1>

            {/* Subtitle with Real Agent Icons */}
            <p
              className="mt-5 text-[clamp(1.25rem,2.3vw,1.7rem)] text-[var(--muted)] font-normal flex flex-wrap items-center justify-center gap-x-2 gap-y-2"
              style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
            >
              <span>{lang === "es" ? "Convierte" : "Turn"}</span>
              <AgentBadgeRow />
              <span>{lang === "es" ? "en" : "into"}</span>
              <button
                type="button"
                onClick={() => setRoleIdx((i) => (i + 1) % HERO_ROLES.length)}
                className="text-[#141413] underline decoration-black/20 underline-offset-4 hover:decoration-black cursor-pointer"
              >
                {lang === "es" ? HERO_ROLES[roleIdx].es : HERO_ROLES[roleIdx].en}
              </button>
            </p>

            {/* THE SINGLE EFFORTLESS IDEA INPUT BAR */}
            <div className="mt-10 mx-auto max-w-[720px]">
              <div className="p-2 rounded-[20px] bg-white border border-[var(--line-strong)] shadow-[var(--shadow-md)] flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  value={ideaInput}
                  onChange={(e) => setIdeaInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSynthesize();
                  }}
                  aria-label="Describe your project idea or paste a URL"
                  placeholder={
                    lang === "es"
                      ? "Describe tu idea de proyecto (o pega una URL para cruzar su estilo)..."
                      : "Describe your project idea (or paste any URL to remix its style)..."
                  }
                  className="flex-1 px-4 py-2.5 text-[14.5px] text-[var(--ink)] bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  disabled={scrapingUrl}
                  onClick={() => handleSynthesize()}
                  className="px-5 py-3 rounded-[14px] bg-[#141413] text-[#fbfbfa] text-[13.5px] font-medium inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shrink-0 disabled:opacity-60"
                >
                  {scrapingUrl ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{lang === "es" ? "Analizando..." : "Analyzing..."}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#E06D44]" />
                      <span>
                        {lang === "es" ? "Crear estilo →" : "Synthesize style →"}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* 4 Subtle Clickable Idea Starters */}
              <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5">
                {QUICK_IDEAS.map((item) => (
                  <button
                    key={item.labelEn}
                    type="button"
                    onClick={() => handleSynthesize(item.idea)}
                    className="px-3 py-1 rounded-full bg-white/80 hover:bg-white border border-[var(--line)] hover:border-[var(--line-strong)] text-[11.5px] text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                  >
                    {lang === "es" ? item.labelEs : item.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* GIVE THIS TO YOUR AGENT — Compact treg.to Dark Bar */}
            <div
              id="agent-bar"
              className="mt-8 mx-auto max-w-[600px] rounded-[16px] bg-[#141413] text-[#fbfbfa] p-3.5 shadow-[var(--shadow-lg)] text-left"
            >
              <div className="flex items-center justify-between gap-2 mb-2 px-1">
                <span className="text-[12px] text-[#a6a59e] font-medium">
                  {lang === "es"
                    ? "O conecta directamente tu agente"
                    : "Or give this directly to your agent"}
                </span>
                <div
                  className="flex items-center gap-1 text-[10.5px]"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  {(
                    [
                      ["llms", "llms.txt"],
                      ["mcp", "MCP"],
                      ["cli", "CLI"],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setAgentTab(key)}
                      className={`px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                        agentTab === key
                          ? "bg-white/15 text-white"
                          : "text-[#8a8982] hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 bg-[#0a0a09] border border-white/10 rounded-[11px] px-3.5 py-2">
                <code
                  className="text-[12px] text-[#ededeb] overflow-x-auto whitespace-nowrap"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  <span className="text-[#706f69] select-none">$ </span>
                  {agentCommands[agentTab]}
                </code>
                <button
                  type="button"
                  onClick={() => copyText("hero", agentCommands[agentTab])}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#141413] text-[11.5px] font-medium hover:bg-[#eae9e4] cursor-pointer"
                >
                  {copiedKey === "hero" ? (
                    <>
                      <Check className="w-3 h-3 text-[#118453]" />
                      <span>{lang === "es" ? "Copiado" : "Copied"}</span>
                    </>
                  ) : (
                    <span>{lang === "es" ? "copiar" : "copy"}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 1: VISUAL CROSSED STYLE STUDIO (Zero Clutter, 100% Visual!) */}
        <section id="studio" className="py-12 px-5">
          <div className="mx-auto max-w-[1120px]">
            {scrapeNotice && (
              <div
                className="mb-4 px-4 py-2 rounded-full bg-[#ecfdf5] border border-[#118453]/20 text-[#118453] text-[12px] inline-flex items-center gap-2"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                <span>{scrapeNotice}</span>
              </div>
            )}

            {/* 4 Visual Crossed-Website Pillars (Click ↻ to cycle any pillar visually!) */}
            <div className="mb-4 flex items-center justify-between">
              <span
                className="text-[11.5px] tracking-wide uppercase text-[var(--muted)]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                {lang === "es"
                  ? "ESTILO PERSONALIZADO CRUZANDO ESTAS REFERENCIAS"
                  : "CUSTOM STYLE CROSSED FROM THESE REFERENCES"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSurfaceId(cycleFormatOption(surfaceId, allFormats));
                  setLayoutId(cycleFormatOption(layoutId, allFormats));
                  setMotionId(cycleFormatOption(motionId, allFormats));
                }}
                className="inline-flex items-center gap-1.5 text-[12px] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                <RefreshCw className="w-3 h-3" />
                <span>{lang === "es" ? "Recombinar" : "Remix all"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              {/* Pillar 1: Palette */}
              <div className="p-4 rounded-[16px] bg-white border border-[var(--line)] flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10.5px] text-[var(--muted)]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {lang === "es" ? "PALETA Y LUZ" : "PALETTE & SURFACE"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSurfaceId(cycleFormatOption(surfaceId, allFormats))}
                    title="Swap palette source"
                    className="p-1 rounded-full hover:bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-7 h-7 rounded-full border border-black/15"
                    style={{ backgroundColor: composed.layers.surface.surface.bg }}
                  />
                  <span
                    className="w-7 h-7 rounded-full border border-black/15"
                    style={{ backgroundColor: composed.layers.surface.surface.ink }}
                  />
                  <span
                    className="w-7 h-7 rounded-full border border-black/15"
                    style={{ backgroundColor: composed.layers.surface.surface.accent }}
                  />
                  <span
                    className="ml-auto text-[11px] text-[var(--muted)]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {composed.layers.surface.surface.bg}
                  </span>
                </div>
                <div className="text-[13px] font-medium truncate">
                  {composed.layers.surface.inspiredBy[0]?.name} ·{" "}
                  <span className="text-[var(--muted)] font-normal">
                    {composed.layers.surface.name}
                  </span>
                </div>
              </div>

              {/* Pillar 2: Typography */}
              <div className="p-4 rounded-[16px] bg-white border border-[var(--line)] flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10.5px] text-[var(--muted)]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {lang === "es" ? "TIPOGRAFÍA" : "TYPOGRAPHY"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setTypographyId(cycleFormatOption(typographyId, allFormats))}
                    title="Swap typography source"
                    className="p-1 rounded-full hover:bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-baseline justify-between">
                  <span
                    className="text-[28px] leading-none"
                    style={{
                      fontFamily:
                        composed.layers.typography.id === "claude-academy" ||
                        composed.layers.typography.id === "a1-monograph" ||
                        composed.layers.typography.typography.useItalicAccent
                          ? "var(--font-editorial), Georgia, serif"
                          : "var(--font-geist), sans-serif",
                      fontStyle: composed.layers.typography.typography.useItalicAccent
                        ? "italic"
                        : "normal",
                    }}
                  >
                    Aa Bb
                  </span>
                  <span
                    className="text-[11px] text-[var(--muted)] truncate max-w-[130px]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {composed.layers.typography.typography.displayFont
                      .split(",")[0]
                      .replace(/'/g, "")}
                  </span>
                </div>
                <div className="text-[13px] font-medium truncate">
                  {composed.layers.typography.inspiredBy[0]?.name} ·{" "}
                  <span className="text-[var(--muted)] font-normal">
                    {composed.layers.typography.typography.h1Tracking}
                  </span>
                </div>
              </div>

              {/* Pillar 3: Spatial Layout */}
              <div className="p-4 rounded-[16px] bg-white border border-[var(--line)] flex flex-col justify-between gap-2">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10.5px] text-[var(--muted)]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {lang === "es" ? "ESTRUCTURA Y NAV" : "SPATIAL LAYOUT"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setLayoutId(cycleFormatOption(layoutId, allFormats))}
                    title="Swap layout source"
                    className="p-1 rounded-full hover:bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-1 rounded-md bg-[var(--panel)] border border-[var(--line)] text-[11.5px] font-medium"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {composed.layers.layout.layout.navStyle}
                  </span>
                  <span
                    className="text-[11.5px] text-[var(--muted)]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {composed.layers.layout.layout.maxWidth}
                  </span>
                </div>
                <div className="text-[13px] font-medium truncate">
                  {composed.layers.layout.inspiredBy[0]?.name} ·{" "}
                  <span className="text-[var(--muted)] font-normal">
                    {composed.layers.layout.name}
                  </span>
                </div>
              </div>

              {/* Pillar 4: Motion Curve */}
              <div className="p-4 rounded-[16px] bg-white border border-[var(--line)] flex flex-col justify-between gap-1">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10.5px] text-[var(--muted)]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {lang === "es" ? "FÍSICA Y MOTION" : "MOTION PHYSICS"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setMotionId(cycleFormatOption(motionId, allFormats))}
                    title="Swap motion physics"
                    className="p-1 rounded-full hover:bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <MotionCurveMini easing={composed.layers.motion.motion.easing} />
                  <span
                    className="text-[10.5px] text-[var(--muted)] text-right leading-tight max-w-[125px]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {composed.layers.motion.motion.feel}
                  </span>
                </div>
                <div className="text-[13px] font-medium truncate">
                  {composed.layers.motion.inspiredBy[0]?.name}
                </div>
              </div>
            </div>

            {/* FULL-WIDTH LIVE VISUAL PREVIEW OF THE USER'S PROJECT */}
            <LiveFormatPreview
              genome={composed}
              content={tailoredContent}
              lang={lang}
            />

            {/* Clean Action Bar Directly Under the Visual Preview */}
            <div className="mt-4 p-3.5 rounded-[16px] bg-white border border-[var(--line)] shadow-[var(--shadow-sm)] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    ["nextjs-tailwind", "Next.js"],
                    ["vite-react", "React / Vite"],
                    ["astro-css", "Astro"],
                    ["vanilla-html", "HTML / CSS"],
                  ] as const
                ).map(([val, label]) => (
                  <label
                    key={val}
                    className="choice-chip px-3 py-1 rounded-full text-[12px] font-medium cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="stack-choice"
                      value={val}
                      checked={stack === val}
                      onChange={() => setStack(val)}
                      className="sr-only"
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={shareStyleLink}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[var(--panel)] hover:bg-[var(--panel-2)] text-[12.5px] font-medium cursor-pointer"
                >
                  {copiedKey === "share" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#118453]" />
                      <span>{lang === "es" ? "Enlace copiado" : "Link copied"}</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{lang === "es" ? "Compartir" : "Share"}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => dialogRef.current?.showModal()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[var(--line-strong)] bg-white hover:bg-[var(--panel)] text-[12.5px] font-medium cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>{lang === "es" ? "Ver DESIGN.md" : "Inspect DESIGN.md"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => copyText("main-spec", composed.masterPrompt)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#141413] text-[#fbfbfa] text-[13px] font-medium hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {copiedKey === "main-spec" ? (
                    <>
                      <Check className="w-4 h-4 text-[#4ade80]" />
                      <span>
                        {lang === "es"
                          ? "¡Copiado! Pégalo en Claude / Cursor"
                          : "Copied! Paste into Claude / Cursor"}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>
                        {lang === "es"
                          ? "Copiar instrucción para tu IA"
                          : "Copy instruction for your AI"}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Matched Real Websites From Live Crawler (Subtle Visual Strip) */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {matchedScrapedSiblings.map((site) => (
                <button
                  key={site.id}
                  type="button"
                  onClick={() => blendDiscoveredSite(site)}
                  className="p-3 rounded-[13px] bg-white/75 hover:bg-white border border-[var(--line)] hover:border-[var(--line-strong)] text-left flex items-center justify-between gap-2 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-5 h-5 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: site.bg }}
                    />
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-medium truncate">
                        {site.hostname.replace(/^www\./, "")}
                      </div>
                      <div
                        className="text-[10.5px] text-[var(--muted)] truncate"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        {site.primaryFont} · {site.craftScore}/100
                      </div>
                    </div>
                  </div>
                  <span
                    className="text-[10.5px] text-[var(--muted)] group-hover:text-[var(--ink)] shrink-0"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    + mix
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 2: VISUAL SHOWCASE GALLERY (Mini-Webpages, Zero Text Clutter!) */}
        <section id="catalog" className="py-16 px-5 border-t border-[var(--line)]">
          <div className="mx-auto max-w-[1120px]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <h2
                  className="text-[clamp(2rem,3.8vw,2.9rem)] leading-[1.06] tracking-[-0.025em] font-normal"
                  style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
                >
                  {lang === "es"
                    ? "Explora formatos y webs escrapeadas en vivo"
                    : "Explore visual formats & live-scraped websites"}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex p-1 rounded-full bg-[var(--panel)] border border-[var(--line)] text-[12px]">
                  <button
                    type="button"
                    onClick={() => setGalleryTab("formats")}
                    className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
                      galleryTab === "formats"
                        ? "bg-white text-[var(--ink)] font-medium shadow-[var(--shadow-sm)]"
                        : "text-[var(--muted)]"
                    }`}
                  >
                    {lang === "es"
                      ? `Arquetipos (${allFormats.length})`
                      : `Archetypes (${allFormats.length})`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGalleryTab("scraped")}
                    className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
                      galleryTab === "scraped"
                        ? "bg-white text-[var(--ink)] font-medium shadow-[var(--shadow-sm)]"
                        : "text-[var(--muted)]"
                    }`}
                  >
                    {lang === "es"
                      ? `Radar en vivo (${discoveredFeed.sites.length})`
                      : `Live Radar (${discoveredFeed.sites.length})`}
                  </button>
                </div>

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === "es" ? "Filtrar..." : "Filter..."}
                  aria-label="Filter gallery"
                  className="h-[34px] px-3.5 rounded-full bg-white border border-[var(--line)] text-[12.5px] w-[150px] focus:outline-none focus:border-[var(--ink)]"
                />

                {(["all", "light", "dark"] as const).map((m) => (
                  <label
                    key={m}
                    className="choice-chip px-3 py-1 rounded-full text-[11.5px] cursor-pointer"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    <input
                      type="radio"
                      name="gallery-mode"
                      value={m}
                      checked={modeFilter === m}
                      onChange={() => setModeFilter(m)}
                      className="sr-only"
                    />
                    <span>{m === "all" ? (lang === "es" ? "Todos" : "All") : m}</span>
                  </label>
                ))}
              </div>
            </div>

            {galleryTab === "formats" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredFormats.map((fmt) => (
                  <article
                    key={fmt.id}
                    className="visual-card p-3 flex flex-col justify-between gap-3 group"
                  >
                    <button
                      type="button"
                      onClick={() => applyFullFormat(fmt.id)}
                      className="text-left w-full cursor-pointer"
                    >
                      <FormatVisualThumb format={fmt} />
                    </button>

                    <div className="px-1.5 pb-1 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-[14.5px] font-semibold tracking-[-0.02em] truncate">
                          {fmt.name}
                        </h3>
                        <p
                          className="text-[11px] text-[var(--muted)] truncate"
                          style={{ fontFamily: "var(--font-mono), monospace" }}
                        >
                          {fmt.inspiredBy.map((s) => s.name).join(" · ")}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => applyFullFormat(fmt.id)}
                        className="shrink-0 px-3 py-1.5 rounded-full bg-[var(--panel)] hover:bg-[#141413] hover:text-white text-[11.5px] font-medium transition-colors cursor-pointer"
                      >
                        {lang === "es" ? "Usar" : "Use"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredScraped.map((site) => {
                  const previewFmt = convertScrapedSiteToFormat(site);
                  return (
                    <article
                      key={site.id}
                      className="visual-card p-3 flex flex-col justify-between gap-3 group"
                    >
                      <button
                        type="button"
                        onClick={() => blendDiscoveredSite(site)}
                        className="text-left w-full cursor-pointer"
                      >
                        <FormatVisualThumb format={previewFmt} />
                      </button>

                      <div className="px-1.5 pb-1 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <a
                              href={site.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[14.5px] font-semibold hover:underline truncate inline-flex items-center gap-1"
                            >
                              <span>{site.hostname.replace(/^www\./, "")}</span>
                              <ArrowUpRight className="w-3.5 h-3.5 opacity-45" />
                            </a>
                            <span
                              className="text-[10.5px] px-1.5 py-0.2 rounded bg-[#ecfdf5] text-[#118453] tabular-nums"
                              style={{ fontFamily: "var(--font-mono), monospace" }}
                            >
                              {site.craftScore}
                            </span>
                          </div>
                          <p
                            className="text-[11px] text-[var(--muted)] truncate"
                            style={{ fontFamily: "var(--font-mono), monospace" }}
                          >
                            {site.primaryFont} · {site.sourceGallery}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => blendDiscoveredSite(site)}
                          className="shrink-0 px-3 py-1.5 rounded-full bg-[var(--panel)] hover:bg-[#141413] hover:text-white text-[11.5px] font-medium transition-colors cursor-pointer"
                        >
                          {lang === "es" ? "Cruzar" : "Blend"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setShowAllGallery((v) => !v)}
                className="px-5 py-2.5 rounded-full bg-white border border-[var(--line-strong)] hover:bg-[var(--panel)] text-[12.5px] font-medium cursor-pointer"
              >
                {showAllGallery
                  ? lang === "es"
                    ? "Mostrar selección compacta"
                    : "Show compact selection"
                  : galleryTab === "formats"
                  ? lang === "es"
                    ? `Ver los ${allFormats.length} formatos visuales`
                    : `Browse all ${allFormats.length} visual formats`
                  : lang === "es"
                  ? `Ver las ${discoveredFeed.sites.length} webs escrapeadas`
                  : `Browse all ${discoveredFeed.sites.length} live-scraped websites`}
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 3: 58 GLOBAL PUBLISHED DESIGN DIRECTORIES MARQUEE (treg.to provider rows style!) */}
        <section className="py-16 border-t border-[var(--line)] overflow-hidden bg-white">
          <div className="mx-auto max-w-[820px] text-center px-5 mb-9">
            <h2
              className="text-[clamp(1.9rem,3.6vw,2.75rem)] leading-[1.08] tracking-[-0.025em] font-normal"
              style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
            >
              {lang === "es"
                ? "Conectado a los 58 directorios mundiales de diseño web."
                : "Grounded across 58 published web design directories."}
            </h2>
            <p className="mt-2 text-[14px] text-[var(--muted)]">
              {lang === "es"
                ? "Nuestro motor open-source forma-xray analiza continuamente las mejores galerías, estudios y librerías del mundo."
                : "Continuously indexed and translated into agent-ready tokens & motion physics via forma-xray."}
            </p>
          </div>

          <div className="space-y-3">
            <div className="marquee-track gap-2.5 px-2">
              {[...directoriesRow1, ...directoriesRow1].map((dir, idx) => (
                <a
                  key={`${dir.name}-${idx}`}
                  href={dir.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#fbfbfa] border border-[var(--line)] hover:border-[var(--line-strong)] text-[12.5px] text-[var(--ink)] whitespace-nowrap transition-colors"
                >
                  <span className="font-medium">{dir.name}</span>
                  <span
                    className="text-[10.5px] text-[var(--muted)]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {dir.category.split(" ")[0]}
                  </span>
                </a>
              ))}
            </div>

            <div
              className="marquee-track gap-2.5 px-2"
              style={{ animationDirection: "reverse", animationDuration: "58s" }}
            >
              {[...directoriesRow2, ...directoriesRow2].map((dir, idx) => (
                <a
                  key={`${dir.name}-${idx}`}
                  href={dir.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#fbfbfa] border border-[var(--line)] hover:border-[var(--line-strong)] text-[12.5px] text-[var(--ink)] whitespace-nowrap transition-colors"
                >
                  <span className="font-medium">{dir.name}</span>
                  <span
                    className="text-[10.5px] text-[var(--muted)]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {dir.category.split(" ")[0]}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CLEAN DARK BOTTOM BAND (treg.to exact cadence) */}
        <section className="bg-[#141413] text-[#fbfbfa] py-16 px-5">
          <div className="mx-auto max-w-[780px] text-center">
            <h2
              className="text-[clamp(2.1rem,4.4vw,3.3rem)] leading-[1.06] font-normal"
              style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
            >
              {lang === "es"
                ? "Conecta tu agente a cada referencia visual que necesita."
                : "Connect your agent to every visual reference it needs."}
            </h2>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#agent-bar"
                className="px-5 py-2.5 rounded-full bg-white text-[#141413] text-[13.5px] font-medium hover:bg-[#eae9e4] transition-colors"
              >
                {lang === "es" ? "Conectar gratis" : "Start free"}
              </a>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-[#fbfbfa] text-[13.5px] font-medium hover:bg-white/10 transition-colors"
              >
                <GitHubIcon className="w-4 h-4" />
                <span>GitHub Repo</span>
              </a>
              <a
                href={GITHUB_XRAY_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-white/20 text-[#fbfbfa] text-[13.5px] font-medium hover:bg-white/10 transition-colors"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                <span>forma-xray</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>

            <div
              className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11.5px] text-[#9a9992]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              <span>100% open source · MIT</span>
              <span>MCP + llms.txt + CLI</span>
              <span>0% AI slop guaranteed</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0e0e0d] text-[#8a8982] py-6 px-5 border-t border-white/10">
        <div
          className="mx-auto max-w-[1120px] flex flex-wrap items-center justify-between gap-4 text-[12px]"
          style={{ fontFamily: "var(--font-mono), monospace" }}
        >
          <span>forma.to · open-source web design router</span>
          <div className="flex items-center gap-5">
            <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" className="hover:text-white">
              Repo
            </a>
            <a href={GITHUB_XRAY_URL} target="_blank" rel="noreferrer" className="hover:text-white">
              forma-xray
            </a>
            <a href="/llms.txt" className="hover:text-white">
              llms.txt
            </a>
            <a href="/api/mcp" className="hover:text-white">
              MCP
            </a>
          </div>
        </div>
      </footer>

      {/* Clean Native <dialog closedby="any"> Modal for Inspecting Raw DESIGN.md / CSS / MCP */}
      <dialog
        ref={dialogRef}
        {...({ closedby: "any" } as Record<string, string>)}
        aria-labelledby="spec-modal-title"
        className="dna-modal"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between gap-4 pb-3 border-b border-[var(--line)]">
            <div>
              <h3 id="spec-modal-title" className="text-[18px] font-semibold">
                {tailoredContent.brandName} — [{composed.mixCode}]
              </h3>
              <p className="text-[12.5px] text-[var(--muted)]">
                {lang === "es"
                  ? "Instrucción completa lista para Claude Code, Cursor, Codex, Lovable o v0"
                  : "Compiled specification ready for Claude Code, Cursor, Codex, Lovable, or v0"}
              </p>
            </div>
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

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div
              className="flex items-center gap-1 bg-[var(--panel)] p-1 rounded-full text-[11.5px]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              {(
                [
                  ["prompt", "DESIGN.md"],
                  ["rules", "CLAUDE.md / .cursorrules"],
                  ["css", "tokens.css"],
                  ["mcp", "MCP / cURL"],
                ] as const
              ).map(([tab, label]) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setModalTab(tab)}
                  className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
                    modalTab === tab
                      ? "bg-[#141413] text-white font-medium"
                      : "text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={downloadDesignMd}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--line-strong)] text-[12px] font-medium cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .md</span>
              </button>
              <button
                type="button"
                onClick={() => copyText("modal", modalCodeContent)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#141413] text-white text-[12px] font-medium cursor-pointer"
              >
                {copiedKey === "modal" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#4ade80]" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <pre
            className="p-4 rounded-[14px] bg-[#141413] text-[#eae9e4] text-[12px] leading-[1.6] whitespace-pre-wrap break-words max-h-[460px] overflow-y-auto"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            <code>{modalCodeContent}</code>
          </pre>
        </div>
      </dialog>
    </div>
  );
}
