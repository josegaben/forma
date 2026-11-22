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
  Search,
  Share2,
  Sparkles,
  X,
} from "lucide-react";
import {
  CURATED_COLOR_PALETTES,
  type CuratedColorPalette,
} from "@/data/color-palettes";
import {
  CRAFT_TOOLS_AND_ASSETS,
  RARE_COMPONENTS,
  TYPOGRAPHY_PAIRINGS,
  type RareComponentItem,
} from "@/data/compendium";
import { WEB_FORMATS, type WebFormat } from "@/data/formats";
import { GLOBAL_DESIGN_DIRECTORIES } from "@/data/world-references";
import discoveredFeed from "@/data/discovered-feed.json";
import { composeFormatGenome, type TargetStack } from "@/lib/composer";
import {
  cleanFontName,
  convertScrapedSiteToFormat,
  type DiscoveredSite,
} from "@/lib/scraper";
import {
  cycleFormatOption,
  cyclePaletteOption,
  findMatchingScrapedSites,
  generateTailoredPreviewContent,
  recommendComponentsForIdea,
  recommendMixFromBrief,
  recommendPaletteForIdea,
} from "@/lib/synthesizer";
import { BeforeAfterShowcase } from "@/components/BeforeAfterShowcase";
import { CommandExplorerModal } from "@/components/CommandExplorerModal";
import {
  AgentBadgeRow,
  FormaLogo,
  GitHubIcon,
} from "@/components/FormaLogo";
import {
  FormatVisualThumb,
  MotionCurveMini,
  PaletteVisualThumb,
} from "@/components/FormatVisualThumb";
import { InteractiveComponentCard } from "@/components/InteractiveComponentCard";
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

  // Command Explorer (⌘K) state
  const [explorerOpen, setExplorerOpen] = useState(false);

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
  const [paletteId, setPaletteId] = useState<string | undefined>("pal-carbon-halftone");
  const [typographyId, setTypographyId] = useState("resizes-infra");
  const [layoutId, setLayoutId] = useState("pdepablo-studio");
  const [componentsId, setComponentsId] = useState("twentyfirst-craft");
  const [motionId, setMotionId] = useState("rauno-craft");
  const [stack, setStack] = useState<TargetStack>("nextjs-tailwind");

  // Compendium Gallery state
  const [galleryTab, setGalleryTab] = useState<
    "components" | "formats" | "palettes" | "assets" | "scraped"
  >("components");
  const [modeFilter, setModeFilter] = useState<"all" | "light" | "dark">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllGallery, setShowAllGallery] = useState(false);

  // Modals: DESIGN.md Spec Modal & Component Code Modal
  const [modalTab, setModalTab] = useState<"prompt" | "rules" | "css" | "mcp">("prompt");
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const [activeComponentModal, setActiveComponentModal] =
    useState<RareComponentItem | null>(null);
  const compDialogRef = useRef<HTMLDialogElement | null>(null);

  const allFormats = useMemo(
    () => [...customFormats, ...WEB_FORMATS],
    [customFormats]
  );

  const sendBeaconEvent = (
    event:
      | "human_visit"
      | "synthesize_idea"
      | "copy_spec"
      | "copy_bootstrap"
      | "share_mix"
      | "install_component",
    extra?: { target?: string; mixCode?: string; paletteId?: string }
  ) => {
    void fetch("/api/telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, ...extra }),
    }).catch(() => {});
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
      sendBeaconEvent("human_visit", { mixCode: "RSZ+PDP+21D+RNO", paletteId: "pal-carbon-halftone" });
      const params = new URLSearchParams(window.location.search);
      if (params.get("surface")) setSurfaceId(params.get("surface")!);
      if (params.get("palette")) setPaletteId(params.get("palette")!);
      if (params.get("type")) setTypographyId(params.get("type")!);
      if (params.get("layout")) setLayoutId(params.get("layout")!);
      if (params.get("comp")) setComponentsId(params.get("comp")!);
      if (params.get("motion")) setMotionId(params.get("motion")!);
      if (params.get("idea")) setIdeaInput(params.get("idea")!);
      const qLang = params.get("lang");
      if (qLang === "en" || qLang === "es") setLang(qLang);
    }
  }, []);

  // Global ⌘K / Ctrl+K shortcut for Command Explorer
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setExplorerOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setRoleIdx((i) => (i + 1) % HERO_ROLES.length);
    }, 3400);
    return () => clearInterval(id);
  }, []);

  // Modern Web Guidance: Safari fallback for <dialog closedby="any">
  useEffect(() => {
    const attachFallback = (dialog: HTMLDialogElement | null) => {
      if (!dialog || "closedBy" in HTMLDialogElement.prototype) return () => {};
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
    };

    const c1 = attachFallback(dialogRef.current);
    const c2 = attachFallback(compDialogRef.current);
    return () => {
      c1();
      c2();
    };
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
        paletteId,
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
      paletteId,
      tailoredContent.brandName,
      ideaInput,
      stack,
      customFormats,
    ]
  );

  const matchedComponents = useMemo(
    () => recommendComponentsForIdea(ideaInput, 2),
    [ideaInput]
  );

  const matchedScrapedSiblings = useMemo(
    () =>
      findMatchingScrapedSites(
        ideaInput,
        composed.layers.surface.surface.mode,
        2
      ),
    [ideaInput, composed.layers.surface.surface.mode]
  );

  const openComponentModal = (item: RareComponentItem) => {
    setActiveComponentModal(item);
    requestAnimationFrame(() => compDialogRef.current?.showModal());
  };

  const handleSynthesize = async (overrideIdea?: string) => {
    const raw = (overrideIdea ?? ideaInput).trim();
    if (overrideIdea !== undefined) setIdeaInput(overrideIdea);
    setScrapeNotice("");

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
          setPaletteId(undefined);
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
        // fallback
      }
      setScrapingUrl(false);
    }

    const rec = recommendMixFromBrief(raw);
    const bestPal = recommendPaletteForIdea(raw);
    const nextGenome = composeFormatGenome({
      ...rec.selection,
      paletteId: bestPal.id,
      customFormats,
    });
    setSurfaceId(rec.selection.surfaceId);
    setPaletteId(bestPal.id);
    setTypographyId(rec.selection.typographyId);
    setLayoutId(rec.selection.layoutId);
    setComponentsId(rec.selection.componentsId);
    setMotionId(rec.selection.motionId);
    sendBeaconEvent("synthesize_idea", {
      mixCode: nextGenome.mixCode,
      paletteId: bestPal.id,
      target: raw.slice(0, 60),
    });
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
  };

  const blendDiscoveredSite = (site: DiscoveredSite) => {
    const fmt = convertScrapedSiteToFormat(site);
    setCustomFormats((prev) => [fmt, ...prev.filter((f) => f.id !== fmt.id)]);
    setSurfaceId(fmt.id);
    setPaletteId(undefined);
    setTypographyId(fmt.id);
    setMotionId(fmt.id);
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
  };

  const applyFullFormat = (id: string) => {
    setSurfaceId(id);
    setPaletteId(undefined);
    setTypographyId(id);
    setLayoutId(id);
    setComponentsId(id);
    setMotionId(id);
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
  };

  const applyCuratedPalette = (pal: CuratedColorPalette) => {
    setPaletteId(pal.id);
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
  };

  const shareStyleLink = () => {
    const url = new URL(origin);
    url.searchParams.set("surface", surfaceId);
    if (paletteId) url.searchParams.set("palette", paletteId);
    url.searchParams.set("type", typographyId);
    url.searchParams.set("layout", layoutId);
    url.searchParams.set("comp", componentsId);
    url.searchParams.set("motion", motionId);
    url.searchParams.set("idea", ideaInput.slice(0, 140));
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", url.toString());
    }
    sendBeaconEvent("share_mix", { mixCode: composed.mixCode, paletteId });
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

  const filteredComponents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return RARE_COMPONENTS.filter((c) => {
      if (!q) return true;
      return `${c.name} ${c.category} ${c.provider} ${c.description} ${c.keywords.join(" ")}`
        .toLowerCase()
        .includes(q);
    });
  }, [searchQuery]);

  const filteredFormats = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = allFormats.filter((f) => {
      if (modeFilter !== "all" && f.surface.mode !== modeFilter) return false;
      if (!q) return true;
      return `${f.name} ${f.category} ${f.tagline} ${f.keywords.join(" ")} ${f.inspiredBy
        .map((s) => s.name)
        .join(" ")}`
        .toLowerCase()
        .includes(q);
    });
    return showAllGallery ? list : list.slice(0, 9);
  }, [allFormats, modeFilter, searchQuery, showAllGallery]);

  const filteredPalettes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = CURATED_COLOR_PALETTES.filter((p) => {
      if (modeFilter !== "all" && p.mode !== modeFilter) return false;
      if (!q) return true;
      return `${p.name} ${p.nameEs} ${p.harmony} ${p.psychology} ${p.inspiredBy.name}`
        .toLowerCase()
        .includes(q);
    });
    return showAllGallery ? list : list.slice(0, 9);
  }, [modeFilter, searchQuery, showAllGallery]);

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

  const totalAssetsCount =
    WEB_FORMATS.length +
    RARE_COMPONENTS.length +
    CURATED_COLOR_PALETTES.length +
    TYPOGRAPHY_PAIRINGS.length +
    CRAFT_TOOLS_AND_ASSETS.length +
    discoveredFeed.sites.length +
    GLOBAL_DESIGN_DIRECTORIES.length;

  const halfDir = Math.ceil(GLOBAL_DESIGN_DIRECTORIES.length / 2);
  const directoriesRow1 = GLOBAL_DESIGN_DIRECTORIES.slice(0, halfDir);
  const directoriesRow2 = GLOBAL_DESIGN_DIRECTORIES.slice(halfDir);

  const modalCodeContent =
    modalTab === "prompt"
      ? composed.masterPrompt
      : modalTab === "rules"
      ? composed.cursorClaudeRules
      : modalTab === "css"
      ? composed.cssTokens
      : `# 1. Connect forma MCP server in Claude Code / Cursor:\nclaude mcp add --transport http forma ${origin}/api/mcp\n\n# 2. Optional Rare UI shadcn registry in components.json:\n{\n  "registries": {\n    "@rare-ui": "https://raw.githubusercontent.com/swamimalode07/rare-ui/main/public/r/{name}.json"\n  }\n}`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* MINIMAL AIRY TOP BAR (treg.to + Rare UI ⌘K Search + Repo) */}
      <header className="sticky top-0 z-30 bg-[#fbfbfa]/88 backdrop-blur-md border-b border-[var(--line)]">
        <nav
          aria-label="Primary"
          className="mx-auto max-w-[1160px] h-[56px] px-5 flex items-center justify-between gap-3"
        >
          <a href="#" aria-label="forma home">
            <FormaLogo size={28} />
          </a>

          <div className="flex items-center gap-3.5 sm:gap-5 text-[13.5px] text-[var(--muted)] whitespace-nowrap">
            {/* Rare UI style ⌘K Command Trigger */}
            <button
              type="button"
              onClick={() => setExplorerOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[var(--line)] hover:border-[var(--line-strong)] text-[12px] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {lang === "es" ? "Buscar todo..." : "Search all..."}
              </span>
              <kbd
                className="px-1.5 py-0.2 rounded bg-[var(--panel)] text-[10px] text-[var(--ink)]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                ⌘K
              </kbd>
            </button>

            <a
              href="#proof"
              className="hidden md:inline hover:text-[var(--ink)] transition-colors"
            >
              {lang === "es" ? "Antes / Después" : "Before / After"}
            </a>

            <a
              href="#catalog"
              className="hidden md:inline hover:text-[var(--ink)] transition-colors"
            >
              {lang === "es" ? "Compendio" : "Compendium"}
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
              className="hidden sm:inline-flex px-3.5 py-1.5 rounded-full bg-[#141413] text-[#fbfbfa] text-[12.5px] font-medium hover:opacity-90 transition-opacity"
            >
              {lang === "es" ? "Conectar agente" : "Connect agent"}
            </a>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* HERO — Airy Editorial Clarity */}
        <section className="editorial-dot-canvas pt-16 sm:pt-20 pb-16 px-5">
          <div className="mx-auto max-w-[880px] text-center">
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[var(--line)] text-[12px] tracking-wide text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--line-strong)] transition-colors mb-8"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              <span>
                {totalAssetsCount}+ {lang === "es" ? "recursos web" : "design assets"} ·{" "}
                {GLOBAL_DESIGN_DIRECTORIES.length}{" "}
                {lang === "es" ? "directorios" : "directories"} · open source ↗
              </span>
            </a>

            <h1
              className="text-[clamp(2.5rem,5.2vw,4.55rem)] leading-[1.03] tracking-[-0.03em] font-normal text-[#141413]"
              style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
            >
              {lang === "es"
                ? "OpenRouter para diseño web"
                : "OpenRouter for web design"}
            </h1>

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

            {/* SINGLE EFFORTLESS IDEA INPUT BAR */}
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
                      ? "Describe tu idea de proyecto (o pega cualquier URL para cruzarla)..."
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

            {/* GIVE THIS TO YOUR AGENT — Compact Dark Bar */}
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
                  onClick={() => {
                    sendBeaconEvent("copy_bootstrap", { target: agentTab });
                    copyText("hero", agentCommands[agentTab]);
                  }}
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

        {/* SECTION 1: VISUAL CROSSED STYLE & COMPONENT STACK STUDIO */}
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
                  setPaletteId(cyclePaletteOption(paletteId || "pal-stone-terracotta"));
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

            {/* 4 Visual Crossed Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              {/* Pillar 1: 60-30-10 Palette */}
              <div className="p-4 rounded-[16px] bg-white border border-[var(--line)] flex flex-col justify-between gap-2.5">
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10.5px] text-[var(--muted)]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    60-30-10 PALETTE · OKLCH
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPaletteId(cyclePaletteOption(paletteId || "pal-stone-terracotta"))
                    }
                    title="Cycle curated color palette"
                    className="p-1 rounded-full hover:bg-[var(--panel)] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="h-5 w-full rounded-full overflow-hidden flex border border-black/15">
                    <span
                      className="h-full w-[52%]"
                      style={{ backgroundColor: composed.layers.surface.surface.bg }}
                    />
                    <span
                      className="h-full w-[16%]"
                      style={{ backgroundColor: composed.layers.surface.surface.panel }}
                    />
                    <span
                      className="h-full w-[18%]"
                      style={{ backgroundColor: composed.layers.surface.surface.ink }}
                    />
                    <span
                      className="h-full w-[14%]"
                      style={{ backgroundColor: composed.layers.surface.surface.accent }}
                    />
                  </div>
                  <div
                    className="flex items-center justify-between text-[10.5px] text-[var(--muted)] tabular-nums"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    <span>
                      {composed.layers.surface.surface.bg} → {composed.layers.surface.surface.accent}
                    </span>
                    <span className="text-[#118453] font-medium">
                      {composed.contrastRatioText}:1 {composed.contrastRatioText >= 7 ? "AAA" : "AA"}
                    </span>
                  </div>
                </div>

                <div className="text-[13px] font-medium truncate">
                  {composed.activePalette
                    ? `${lang === "es" ? composed.activePalette.nameEs : composed.activePalette.name}`
                    : `${composed.layers.surface.inspiredBy[0]?.name} · ${composed.layers.surface.name}`}
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

            {/* FULL-WIDTH LIVE VISUAL PREVIEW */}
            <LiveFormatPreview
              genome={composed}
              content={tailoredContent}
              lang={lang}
            />

            {/* Clean Action Bar */}
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
                  onClick={() => {
                    sendBeaconEvent("copy_spec", {
                      mixCode: composed.mixCode,
                      paletteId,
                    });
                    copyText("main-spec", composed.masterPrompt);
                  }}
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

            {/* Matched Components (Rare UI / shadcn) + Matched Live Websites Strip */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {matchedComponents.map((comp) => (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => openComponentModal(comp)}
                  className="p-3 rounded-[13px] bg-white hover:bg-[var(--panel)] border border-[var(--line)] hover:border-[var(--line-strong)] text-left flex items-center justify-between gap-2 transition-all cursor-pointer group"
                >
                  <div className="min-w-0">
                    <div className="text-[12.5px] font-medium truncate flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#E06D44] shrink-0" />
                      <span className="truncate">{comp.name}</span>
                    </div>
                    <div
                      className="text-[10.5px] text-[var(--muted)] truncate mt-0.5"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      {comp.cliInstall}
                    </div>
                  </div>
                  <span
                    className="text-[10.5px] text-[#E06D44] font-medium shrink-0"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    &lt;/&gt;
                  </span>
                </button>
              ))}

              {matchedScrapedSiblings.map((site) => (
                <button
                  key={site.id}
                  type="button"
                  onClick={() => blendDiscoveredSite(site)}
                  className="p-3 rounded-[13px] bg-white/80 hover:bg-white border border-[var(--line)] hover:border-[var(--line-strong)] text-left flex items-center justify-between gap-2 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-4 h-4 rounded-full border border-black/15 shrink-0"
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
                        {cleanFontName(site.primaryFont)} · {site.craftScore}/100
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

        {/* BEFORE VS AFTER VIDEO & INTERACTIVE BENCHMARK */}
        <BeforeAfterShowcase lang={lang} />

        {/* SECTION 2: THE COMPLETE WEB CRAFT COMPENDIUM (Components · Formats · Palettes · Fonts & Assets · Live Radar) */}
        <section id="catalog" className="py-16 px-5 border-t border-[var(--line)]">
          <div className="mx-auto max-w-[1120px]">
            <div className="flex flex-col gap-5 mb-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h2
                    className="text-[clamp(1.95rem,3.6vw,2.75rem)] leading-[1.06] tracking-[-0.025em] font-normal"
                    style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
                  >
                    {lang === "es"
                      ? "Todo lo necesario para diseñar una web de calidad"
                      : "Everything needed to craft a standout website"}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === "es" ? "Filtrar..." : "Filter..."}
                    aria-label="Filter compendium"
                    className="h-[34px] px-3.5 rounded-full bg-white border border-[var(--line)] text-[12.5px] w-[155px] focus:outline-none focus:border-[var(--ink)]"
                  />

                  {galleryTab !== "components" && galleryTab !== "assets" && (
                    <div className="inline-flex items-center gap-1">
                      {(["all", "light", "dark"] as const).map((m) => (
                        <label
                          key={m}
                          className="choice-chip px-2.5 py-1 rounded-full text-[11px] cursor-pointer"
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
                  )}
                </div>
              </div>

              {/* Clean Single-Row Compendium Tabs with Rare UI Bracketed Counts */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 whitespace-nowrap">
                {(
                  [
                    {
                      id: "components",
                      labelEn: "Rare Components",
                      labelEs: "Componentes",
                      count: RARE_COMPONENTS.length,
                    },
                    {
                      id: "formats",
                      labelEn: "Web Formats",
                      labelEs: "Formatos Web",
                      count: allFormats.length,
                    },
                    {
                      id: "palettes",
                      labelEn: "Color Palettes",
                      labelEs: "Paletas OKLCH",
                      count: CURATED_COLOR_PALETTES.length,
                    },
                    {
                      id: "assets",
                      labelEn: "Fonts, Shaders & Icons",
                      labelEs: "Fuentes, Shaders e Iconos",
                      count: TYPOGRAPHY_PAIRINGS.length + CRAFT_TOOLS_AND_ASSETS.length,
                    },
                    {
                      id: "scraped",
                      labelEn: "Live Scraped Webs",
                      labelEs: "Webs Escrapeadas",
                      count: discoveredFeed.sites.length,
                    },
                  ] as const
                ).map((t) => {
                  const active = galleryTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setGalleryTab(t.id)}
                      className={`px-4 py-2 rounded-full text-[12.5px] font-medium cursor-pointer transition-all inline-flex items-center gap-1.5 ${
                        active
                          ? "bg-[#141413] text-[#fbfbfa] shadow-[var(--shadow-sm)]"
                          : "bg-white border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--line-strong)]"
                      }`}
                    >
                      <span>{lang === "es" ? t.labelEs : t.labelEn}</span>
                      <span
                        className={`text-[11px] ${
                          active ? "text-[#E06D44]" : "opacity-65"
                        }`}
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        [{t.count}]
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TAB 1: INTERACTIVE RARE COMPONENTS (Double-Bezel Stage Cards) */}
            {galleryTab === "components" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredComponents.map((item) => (
                  <InteractiveComponentCard
                    key={item.id}
                    item={item}
                    lang={lang}
                    onInspectCode={openComponentModal}
                  />
                ))}
              </div>
            )}

            {/* TAB 2: VISUAL WEB FORMATS */}
            {galleryTab === "formats" && (
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
            )}

            {/* TAB 3: 60-30-10 COLOR PALETTES */}
            {galleryTab === "palettes" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredPalettes.map((pal) => (
                  <article
                    key={pal.id}
                    className="visual-card p-3 flex flex-col justify-between gap-3 group"
                  >
                    <button
                      type="button"
                      onClick={() => applyCuratedPalette(pal)}
                      className="text-left w-full cursor-pointer"
                    >
                      <PaletteVisualThumb palette={pal} lang={lang} />
                    </button>

                    <div className="px-1.5 pb-1 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="text-[14px] font-semibold tracking-[-0.02em] truncate">
                          {lang === "es" ? pal.nameEs : pal.name}
                        </h3>
                        <p className="text-[11.5px] text-[var(--muted)] truncate">
                          {lang === "es" ? pal.psychologyEs : pal.psychology}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => applyCuratedPalette(pal)}
                        className="shrink-0 px-3 py-1.5 rounded-full bg-[var(--panel)] hover:bg-[#141413] hover:text-white text-[11.5px] font-medium transition-colors cursor-pointer"
                      >
                        {lang === "es" ? "Aplicar" : "Apply"}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* TAB 4: TYPOGRAPHY PAIRINGS, SHADERS & ICON PACKS */}
            {galleryTab === "assets" && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {TYPOGRAPHY_PAIRINGS.map((pair) => (
                    <article
                      key={pair.id}
                      className="rounded-[20px] p-2 bg-[#f2f1ed] border border-[var(--line)] flex flex-col justify-between"
                    >
                      <div className="rounded-[14px] bg-white border border-[var(--line)] p-4 h-[142px] flex flex-col justify-between">
                        <span
                          className="text-[10px] text-[#E06D44]"
                          style={{ fontFamily: "var(--font-mono), monospace" }}
                        >
                          {pair.displayFont} + {pair.monoFont}
                        </span>
                        <div
                          className="text-[22px] leading-[1.1] tracking-[-0.025em]"
                          style={{
                            fontFamily: pair.displayFont.includes("Serif") || pair.displayFont.includes("Newsreader") || pair.displayFont.includes("Fraunces")
                              ? "var(--font-editorial), Georgia, serif"
                              : "var(--font-geist), sans-serif",
                          }}
                        >
                          {pair.sampleHeading}
                        </div>
                        <div className="text-[11px] text-[var(--muted)] truncate">
                          {lang === "es" ? pair.vibeEs : pair.vibe}
                        </div>
                      </div>
                      <div className="px-2.5 pt-2.5 pb-1 flex items-center justify-between gap-2">
                        <span className="text-[13px] font-semibold truncate">{pair.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            copyText(pair.id, `@import url('${pair.cssImport}');`)
                          }
                          className="px-3 py-1 rounded-full bg-white border border-[var(--line)] text-[11px] font-medium cursor-pointer"
                          style={{ fontFamily: "var(--font-mono), monospace" }}
                        >
                          {copiedKey === pair.id ? "✓ @import" : "Copy CSS"}
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CRAFT_TOOLS_AND_ASSETS.map((asset) => (
                    <article
                      key={asset.id}
                      className="visual-card p-4 flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="px-2 py-0.5 rounded-full bg-[var(--panel)] text-[10px] text-[#E06D44] font-medium"
                            style={{ fontFamily: "var(--font-mono), monospace" }}
                          >
                            {asset.kind}
                          </span>
                          <a
                            href={asset.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[var(--muted)] hover:text-[var(--ink)]"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <h3 className="text-[15px] font-semibold">{asset.name}</h3>
                        <p className="text-[12.5px] text-[var(--muted)] mt-1 leading-relaxed">
                          {lang === "es" ? asset.whyUseItEs : asset.whyUseIt}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyText(asset.id, asset.installOrUsage)}
                        className="w-full px-3 py-1.5 rounded-[9px] bg-[var(--panel)] hover:bg-[#141413] hover:text-white text-[11px] text-left truncate transition-colors cursor-pointer"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        {copiedKey === asset.id
                          ? "✓ Copied!"
                          : `$ ${asset.installOrUsage}`}
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: LIVE SCRAPED WEBSITES */}
            {galleryTab === "scraped" && (
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
                            {cleanFontName(site.primaryFont)} · {site.sourceGallery}
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

            {(galleryTab === "formats" ||
              galleryTab === "palettes" ||
              galleryTab === "scraped") && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => setShowAllGallery((v) => !v)}
                  className="px-5 py-2.5 rounded-full bg-white border border-[var(--line-strong)] hover:bg-[var(--panel)] text-[12.5px] font-medium cursor-pointer"
                >
                  {showAllGallery
                    ? lang === "es"
                      ? "Mostrar vista compacta"
                      : "Show compact selection"
                    : galleryTab === "formats"
                    ? lang === "es"
                      ? `Ver los ${allFormats.length} formatos visuales`
                      : `Browse all ${allFormats.length} visual formats`
                    : galleryTab === "palettes"
                    ? lang === "es"
                      ? `Ver las ${CURATED_COLOR_PALETTES.length} paletas maestras`
                      : `Browse all ${CURATED_COLOR_PALETTES.length} color systems`
                    : lang === "es"
                    ? `Ver las ${discoveredFeed.sites.length} webs escrapeadas`
                    : `Browse all ${discoveredFeed.sites.length} live-scraped websites`}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3: 85 GLOBAL DESIGN DIRECTORIES MARQUEE */}
        <section className="py-16 border-t border-[var(--line)] overflow-hidden bg-white">
          <div className="mx-auto max-w-[820px] text-center px-5 mb-9">
            <h2
              className="text-[clamp(1.9rem,3.6vw,2.75rem)] leading-[1.08] tracking-[-0.025em] font-normal"
              style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
            >
              {lang === "es"
                ? `Conectado a ${GLOBAL_DESIGN_DIRECTORIES.length} directorios, librerías y archivos de diseño.`
                : `Unified across ${GLOBAL_DESIGN_DIRECTORIES.length} design directories, component kits & archives.`}
            </h2>
            <p className="mt-2 text-[14px] text-[var(--muted)]">
              {lang === "es"
                ? "Desde Rare UI, 21st.dev y Vaul hasta Sanzo Wada, Radix Colors, Awwwards, Godly, P de Pablo y Resiz.es."
                : "Spanning Rare UI, 21st.dev, Vaul, Sanzo Wada, Radix Colors, Awwwards, Godly, P de Pablo & Resiz.es."}
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

        {/* DARK CTA BAND */}
        <section className="bg-[#141413] text-[#fbfbfa] py-16 px-5">
          <div className="mx-auto max-w-[780px] text-center">
            <h2
              className="text-[clamp(2.1rem,4.4vw,3.3rem)] leading-[1.06] font-normal"
              style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
            >
              {lang === "es"
                ? "Todo lo que tu agente necesita para diseñar con buen gusto."
                : "Every format, palette, and rare component your agent needs."}
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
            <a href="/metrics" className="hover:text-white">
              Metrics
            </a>
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

      {/* 1. Native <dialog closedby="any"> Modal for Compiled DESIGN.md */}
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
                  ? "Especificación completa lista para Claude Code, Cursor, Codex, Lovable o v0"
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
                  ["mcp", "MCP & Registries"],
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
            className="p-4 rounded-[14px] bg-[#141413] text-[#eae9e4] text-[12px] leading-[1.6] whitespace-pre-wrap break-words max-h-[450px] overflow-y-auto"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            <code>{modalCodeContent}</code>
          </pre>
        </div>
      </dialog>

      {/* 2. Native <dialog closedby="any"> Modal for Single-File Rare Component Code & shadcn CLI */}
      <dialog
        ref={compDialogRef}
        {...({ closedby: "any" } as Record<string, string>)}
        aria-labelledby="comp-modal-title"
        className="dna-modal max-w-[740px]"
      >
        {activeComponentModal && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-[var(--line)]">
              <div>
                <div
                  className="text-[11px] text-[#E06D44] font-medium"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  {activeComponentModal.category} · {activeComponentModal.provider}
                </div>
                <h3 id="comp-modal-title" className="text-[19px] font-semibold">
                  {activeComponentModal.name}
                </h3>
                <p className="text-[12.5px] text-[var(--muted)]">
                  {lang === "es"
                    ? activeComponentModal.descriptionEs
                    : activeComponentModal.description}
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

            {/* CLI Install Row */}
            <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-[12px] bg-[var(--panel)] border border-[var(--line)]">
              <code
                className="text-[12px] text-[var(--ink)] truncate"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                $ {activeComponentModal.cliInstall}
              </code>
              <button
                type="button"
                onClick={() => copyText("comp-cli", activeComponentModal.cliInstall)}
                className="shrink-0 px-3 py-1 rounded-full bg-[#141413] text-white text-[11.5px] font-medium cursor-pointer"
              >
                {copiedKey === "comp-cli" ? "✓ Copied" : "Copy CLI"}
              </button>
            </div>

            {/* Self-Contained TSX Source Code */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="text-[11px] text-[var(--muted)]"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  SELF-CONTAINED TSX PRIMITIVE (RESPECTS PREFERS-REDUCED-MOTION)
                </span>
                <button
                  type="button"
                  onClick={() => copyText("comp-code", activeComponentModal.codeSnippet)}
                  className="text-[11.5px] font-medium underline cursor-pointer"
                >
                  {copiedKey === "comp-code" ? "✓ Code copied" : "Copy TSX"}
                </button>
              </div>
              <pre
                className="p-4 rounded-[14px] bg-[#141413] text-[#eae9e4] text-[12px] leading-[1.6] whitespace-pre-wrap break-words max-h-[320px] overflow-y-auto"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                <code>{activeComponentModal.codeSnippet}</code>
              </pre>
            </div>
          </div>
        )}
      </dialog>

      {/* 3. Global ⌘K Split-Preview Command Explorer */}
      <CommandExplorerModal
        open={explorerOpen}
        onClose={() => setExplorerOpen(false)}
        lang={lang}
        onSelectFormat={applyFullFormat}
        onSelectPalette={applyCuratedPalette}
        onInspectComponent={openComponentModal}
      />
    </div>
  );
}
