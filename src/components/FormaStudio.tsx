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
import { ConnectedServicesHub } from "@/components/ConnectedServicesHub";
import { FormaDoctorPanel } from "@/components/FormaDoctorPanel";
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
import { SectionVaultShowcase } from "@/components/SectionVaultShowcase";
import { getSectionVaultFeed } from "@/lib/section-vault";

const GITHUB_REPO_URL = "https://github.com/josegaben/forma";
const GITHUB_XRAY_URL = "https://github.com/josegaben/forma-xray";

const HERO_ROLES = [
  { en: "a Swiss brand studio", es: "un estudio de marca suizo" },
  { en: "a design engineer", es: "un design engineer" },
  { en: "a motion director", es: "un director de motion" },
  { en: "a SaaS UI architect", es: "un arquitecto UI SaaS" },
];

const HERO_JOBS = [
  {
    taskEn: "Synthesize a 5-layer brand & UI system",
    taskEs: "Sintetizar un sistema de marca y UI en 5 capas",
    refs: "treg.to × resiz.es × pdepablo",
    legacyEn: "$6,000 agency",
    legacyEs: "Agencia 6.000 €",
    formaRate: "$0.00 · /api/compose",
    href: "#studio",
  },
  {
    taskEn: "Extract real Hero, Navbar & Pricing Clean DOM",
    taskEs: "Extraer Clean DOM real de Heros, Navbars y Precios",
    refs: "linear.app · cal.com · resend.com",
    legacyEn: "$15/mo Mobbin",
    legacyEs: "15 $/mes Mobbin",
    formaRate: "$0.04 · Playwright + Vision",
    href: "#section-vault",
  },
  {
    taskEn: "60-30-10 perceptual OKLCH color harmony",
    taskEs: "Armonía perceptual OKLCH 60-30-10 verificada",
    refs: "Sanzo Wada · Harmonizer · Radix",
    legacyEn: "Manual contrast math",
    legacyEs: "Cálculo manual",
    formaRate: `$0.00 · ${CURATED_COLOR_PALETTES.length} WCAG sets`,
    href: "#catalog",
  },
  {
    taskEn: "Install tactile React & spring primitives",
    taskEs: "Instalar primitivas táctiles React y física spring",
    refs: "Rare UI · Kokonut · COSS · Vaul",
    legacyEn: "$149 UI kit",
    legacyEs: "UI kit 149 $",
    formaRate: `$0.00 · ${RARE_COMPONENTS.length} CLI items`,
    href: "#catalog",
  },
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
  const [origin, setOrigin] = useState("https://forma.zaxworld.com");
  const [roleIdx, setRoleIdx] = useState(0);

  // Command Explorer (⌘K) state
  const [explorerOpen, setExplorerOpen] = useState(false);

  // Agent bootstrap bar state
  const [agentTab, setAgentTab] = useState<"llms" | "mcp" | "shadcn" | "cli">("llms");
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
  const [fontPairingId, setFontPairingId] = useState<string | undefined>(undefined);
  const [layoutId, setLayoutId] = useState("pdepablo-studio");
  const [componentsId, setComponentsId] = useState("twentyfirst-craft");
  const [motionId, setMotionId] = useState("rauno-craft");
  const [stack, setStack] = useState<TargetStack>("nextjs-tailwind");
  const [pinnedSectionIds, setPinnedSectionIds] = useState<string[]>([]);
  const [pinnedComponentIds, setPinnedComponentIds] = useState<string[]>([]);

  const togglePinSection = (sectionId: string) => {
    setPinnedSectionIds((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const togglePinComponent = (compId: string) => {
    setPinnedComponentIds((prev) =>
      prev.includes(compId) ? prev.filter((id) => id !== compId) : [...prev, compId]
    );
  };

  // Compendium Gallery state
  const [galleryTab, setGalleryTab] = useState<
    "components" | "formats" | "palettes" | "assets" | "scraped" | "directories"
  >("components");
  const [dirCategoryFilter, setDirCategoryFilter] = useState<string>("all");
  const [modeFilter, setModeFilter] = useState<"all" | "light" | "dark">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllGallery, setShowAllGallery] = useState(false);

  // Modals: DESIGN.md Spec Modal & Component Code Modal
  const [modalTab, setModalTab] = useState<
    "prompt" | "skeletons" | "rules" | "css" | "figma" | "mcp"
  >("prompt");
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
      if (params.get("font")) setFontPairingId(params.get("font")!);
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
        fontPairingId,
        layoutId,
        componentsId,
        motionId,
        paletteId,
        projectName: tailoredContent.brandName,
        projectBrief: ideaInput,
        stack,
        enforceUnslop: true,
        customFormats,
        pinnedSectionIds,
        pinnedComponentIds,
      }),
    [
      surfaceId,
      typographyId,
      fontPairingId,
      layoutId,
      componentsId,
      motionId,
      paletteId,
      tailoredContent.brandName,
      ideaInput,
      stack,
      customFormats,
      pinnedSectionIds,
      pinnedComponentIds,
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
    setFontPairingId(undefined);
    setLayoutId(rec.selection.layoutId);
    setComponentsId(rec.selection.componentsId);
    setMotionId(rec.selection.motionId);
    const wordCount = raw.trim().split(/\s+/).filter(Boolean).length;
    sendBeaconEvent("synthesize_idea", {
      mixCode: nextGenome.mixCode,
      paletteId: bestPal.id,
      target: `brief:${wordCount}w`,
    });
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
  };

  const applyFontPairing = (pairingId: string) => {
    setFontPairingId(pairingId);
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
  };

  const cycleFontPairing = () => {
    const idx = TYPOGRAPHY_PAIRINGS.findIndex((fp) => fp.id === fontPairingId);
    const next = TYPOGRAPHY_PAIRINGS[(idx + 1) % TYPOGRAPHY_PAIRINGS.length];
    setFontPairingId(next.id);
  };

  const blendDiscoveredSite = (site: DiscoveredSite) => {
    const fmt = convertScrapedSiteToFormat(site);
    setCustomFormats((prev) => [fmt, ...prev.filter((f) => f.id !== fmt.id)]);
    setSurfaceId(fmt.id);
    setPaletteId(undefined);
    setTypographyId(fmt.id);
    setFontPairingId(undefined);
    setMotionId(fmt.id);
    document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
  };

  const applyFullFormat = (id: string) => {
    setSurfaceId(id);
    setPaletteId(undefined);
    setTypographyId(id);
    setFontPairingId(undefined);
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
    if (fontPairingId) url.searchParams.set("font", fontPairingId);
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

  const filteredTypographyPairings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return TYPOGRAPHY_PAIRINGS;
    return TYPOGRAPHY_PAIRINGS.filter((tp) =>
      `${tp.name} ${tp.foundry} ${tp.vibe} ${tp.vibeEs} ${tp.keywords.join(" ")}`
        .toLowerCase()
        .includes(q)
    );
  }, [searchQuery]);

  const filteredCraftAssets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return CRAFT_TOOLS_AND_ASSETS;
    return CRAFT_TOOLS_AND_ASSETS.filter((a) =>
      `${a.name} ${a.kind} ${a.whyUseIt} ${a.whyUseItEs}`
        .toLowerCase()
        .includes(q)
    );
  }, [searchQuery]);

  const filteredDirectories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = GLOBAL_DESIGN_DIRECTORIES.filter((d) => {
      if (dirCategoryFilter !== "all" && d.category !== dirCategoryFilter) return false;
      if (!q) return true;
      return `${d.name} ${d.category} ${d.url}`.toLowerCase().includes(q);
    });
    return showAllGallery ? list : list.slice(0, 18);
  }, [dirCategoryFilter, searchQuery, showAllGallery]);

  const sectionVaultCount = getSectionVaultFeed().totalSections;

  const currentMixQuery = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set("surface", surfaceId);
    if (paletteId) qs.set("palette", paletteId);
    if (fontPairingId) qs.set("font", fontPairingId);
    qs.set("layout", layoutId);
    qs.set("motion", motionId);
    return qs.toString();
  }, [surfaceId, paletteId, fontPairingId, layoutId, motionId]);

  const shadcnAddCommand = `npx shadcn@latest add "${origin}/r/forma-kit?${currentMixQuery}"`;

  const cursorMcpDeepLink = useMemo(() => {
    const rawJson = JSON.stringify({ url: `${origin}/api/mcp` });
    const b64 =
      typeof window !== "undefined"
        ? window.btoa(rawJson)
        : Buffer.from(rawJson, "utf8").toString("base64");
    return `cursor://anysphere.cursor-deeplink/mcp/install?name=forma&config=${encodeURIComponent(
      b64
    )}`;
  }, [origin]);

  const v0LaunchHref = useMemo(() => {
    const conciseSpec = `Build ${tailoredContent.brandName} (${ideaInput.slice(
      0,
      140
    )}) strictly following forma [${composed.mixCode}]: bg ${
      composed.layers.surface.surface.bg
    }, ink ${composed.layers.surface.surface.ink}, accent ${
      composed.layers.surface.surface.accent
    }, font ${composed.layers.typography.typography.displayFont}, ${
      composed.layers.layout.layout.navStyle
    } nav, 7/5 asymmetric @container bento, and zero AI-slop purple gradients.`;
    return `https://v0.dev/chat/api/open?prompt=${encodeURIComponent(conciseSpec)}`;
  }, [tailoredContent.brandName, ideaInput, composed]);

  const figmaW3cJson = useMemo(() => {
    const s = composed.layers.surface.surface;
    const t = composed.layers.typography.typography;
    return JSON.stringify(
      {
        $name: `forma [${composed.mixCode}] — ${tailoredContent.brandName}`,
        $schema: "https://tr.designtokens.org/format/",
        color: {
          bg: { $value: s.bg, $type: "color" },
          surface: { $value: s.surface, $type: "color" },
          panel: { $value: s.panel, $type: "color" },
          ink: { $value: s.ink, $type: "color" },
          muted: { $value: s.muted, $type: "color" },
          accent: { $value: s.accent, $type: "color" },
          accentInk: { $value: s.accentInk, $type: "color" },
        },
        typography: {
          display: { $value: t.displayFont, $type: "fontFamily" },
          body: { $value: t.bodyFont, $type: "fontFamily" },
          mono: { $value: t.monoFont, $type: "fontFamily" },
          h1Scale: { $value: t.h1Scale, $type: "dimension" },
        },
        radius: {
          card: { $value: s.radiusCard, $type: "dimension" },
          pill: { $value: s.radiusPill, $type: "dimension" },
        },
      },
      null,
      2
    );
  }, [composed, tailoredContent.brandName]);

  const agentCommands: Record<typeof agentTab, string> = {
    llms: `set up forma - ${origin}/llms.txt`,
    mcp: `claude mcp add --transport http forma ${origin}/api/mcp`,
    shadcn: shadcnAddCommand,
    cli: `npx forma-xray balance && npx forma-xray https://resiz.es --out DESIGN.md`,
  };

  const totalAssetsCount =
    WEB_FORMATS.length +
    RARE_COMPONENTS.length +
    CURATED_COLOR_PALETTES.length +
    TYPOGRAPHY_PAIRINGS.length +
    CRAFT_TOOLS_AND_ASSETS.length +
    discoveredFeed.sites.length +
    getSectionVaultFeed().totalSections +
    GLOBAL_DESIGN_DIRECTORIES.length;

  const halfDir = Math.ceil(GLOBAL_DESIGN_DIRECTORIES.length / 2);
  const directoriesRow1 = GLOBAL_DESIGN_DIRECTORIES.slice(0, halfDir);
  const directoriesRow2 = GLOBAL_DESIGN_DIRECTORIES.slice(halfDir);

  const modalCodeContent =
    modalTab === "prompt"
      ? composed.masterPrompt
      : modalTab === "skeletons"
      ? composed.structuralSkeletonsMd
      : modalTab === "rules"
      ? composed.cursorClaudeRules
      : modalTab === "css"
      ? composed.cssTokens
      : modalTab === "figma"
      ? figmaW3cJson
      : `# 1. Connect forma MCP server (15 tools) in Claude Code / Cursor:\nclaude mcp add --transport http forma ${origin}/api/mcp\n\n# 2. 1-Command shadcn Registry Install (writes DESIGN.md + tokens.css + TSX scaffold):\n${shadcnAddCommand}\n\n# 3. Export W3C Design Tokens JSON (Figma Variables / Tokens Studio):\ncurl -fsSL "${origin}/api/tokens?${currentMixQuery}" > tokens.dtcg.json`;

  return (
    <div className="min-h-screen flex flex-col editorial-dot-canvas">
      {/* AIRY STATIC TOP BAR (sec-treg-to-navbar — no sticky border noise; bottom dock handles persistent nav) */}
      <header>
        <nav
          aria-label="Primary"
          className="mx-auto max-w-[1120px] px-6 py-4 flex items-center justify-between gap-3"
        >
          <a href="#" aria-label="forma home">
            <FormaLogo size={27} />
          </a>

          <div className="flex items-center gap-3.5 sm:gap-5 text-[13.5px] text-[var(--muted)] whitespace-nowrap">
            {/* Rare UI style ⌘K Command Trigger */}
            <button
              type="button"
              onClick={() => setExplorerOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-[var(--line)] hover:border-[var(--line-strong)] text-[12px] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {lang === "es" ? "Buscar..." : "Search..."}
              </span>
              <kbd
                className="px-1.5 py-0.2 rounded bg-[var(--panel)] text-[10px] text-[var(--ink)]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                ⌘K
              </kbd>
            </button>

            <a
              href="#catalog"
              className="hidden sm:inline hover:text-[var(--ink)] transition-colors"
            >
              {lang === "es" ? "Catálogo" : "Catalog"}
            </a>

            <a
              href="/credits"
              className="hidden sm:inline hover:text-[var(--ink)] transition-colors"
            >
              {lang === "es" ? "Precios" : "Pricing"}
            </a>

            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[var(--ink)] font-medium hover:opacity-75 transition-opacity"
            >
              <GitHubIcon className="w-4 h-4" />
              <span>Repo</span>
            </a>

            <button
              type="button"
              onClick={() => setLang((l) => (l === "en" ? "es" : "en"))}
              className="px-2.5 py-1 rounded-full bg-white/80 border border-[var(--line)] hover:border-[var(--line-strong)] text-[11px] text-[var(--ink)] cursor-pointer"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              {lang === "en" ? "EN · ES" : "ES · EN"}
            </button>

            <a
              href="/credits"
              className="hidden md:inline-flex px-3.5 py-1.5 rounded-full bg-[#141413] text-[#fbfbfa] text-[12.5px] font-medium hover:opacity-90 transition-opacity"
            >
              {lang === "es" ? "Empezar gratis" : "Start free"}
            </a>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* HERO — Pure [TRG+RSZ+PDP] Self-Synthesized Opening Fold */}
        <section className="pt-4 sm:pt-5 pb-14 px-5">
          <div className="mx-auto max-w-[1080px]">
            <div className="max-w-[820px] mx-auto text-center">
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[var(--line)] text-[12px] tracking-wide text-[var(--muted)] hover:text-[var(--ink)] hover:border-[var(--line-strong)] transition-colors mb-6 tabular-nums"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                <span>
                  {totalAssetsCount}+ {lang === "es" ? "recursos web" : "design assets"} ·{" "}
                  {GLOBAL_DESIGN_DIRECTORIES.length}{" "}
                  {lang === "es" ? "directorios" : "directories"} · open source ↗
                </span>
              </a>

              <h1
                className="text-[clamp(2.75rem,5.6vw,4.65rem)] leading-[1.02] tracking-[-0.03em] font-normal text-[#141413]"
                style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
              >
                {lang === "es" ? (
                  <>
                    OpenRouter para <span className="italic">diseño web</span>
                  </>
                ) : (
                  <>
                    OpenRouter for <span className="italic">web design</span>
                  </>
                )}
              </h1>

              <p
                className="mt-5 text-[clamp(1.25rem,2.3vw,1.75rem)] text-[var(--muted)] font-normal flex flex-wrap items-center justify-center gap-x-2.5 gap-y-2"
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

              {/* 3-Node Routing Flow extracted from sec-treg-to-hero Clean DOM */}
              <div
                className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-[12px] max-w-[680px] mx-auto py-3 px-5 rounded-[16px] bg-white/80 border border-[var(--line)]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                <div className="text-left sm:text-center">
                  <div className="text-[#8a8880] text-[10.5px]">input</div>
                  <div className="text-[#141413] font-medium mt-0.5">
                    {lang === "es" ? "tu idea de proyecto" : "your project idea"}
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-[#E06D44] font-medium">
                  <span>───</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#141413] text-white text-[11px]">
                    forma
                  </span>
                  <span>──▶</span>
                </div>
                <div className="text-left sm:text-center">
                  <div className="text-[#141413] font-medium">DESIGN.md + Clean DOM</div>
                  <div className="text-[#118453] text-[10.5px] mt-0.5">
                    {lang === "es" ? "0% AI slop · protocolo $0" : "0% AI slop · $0 protocol"}
                  </div>
                </div>
              </div>

              {/* GIVE THIS TO YOUR AGENT — Floating Dark Bar */}
              <div
                id="agent-bar"
                className="mt-5 mx-auto max-w-[590px] rounded-[16px] bg-[#141413] text-[#fbfbfa] p-3.5 shadow-[var(--shadow-lg)] text-left"
              >
                <div className="flex items-center justify-between gap-2 mb-2 px-1">
                  <span className="text-[11.5px] text-[#a6a59e]">
                    {lang === "es"
                      ? "Dale esto a tu agente"
                      : "Give this to your agent"}
                  </span>
                  <div
                    className="flex items-center gap-1 text-[10.5px]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {(
                      [
                        ["llms", "llms.txt"],
                        ["mcp", "MCP"],
                        ["shadcn", "shadcn"],
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

                <div className="flex items-center justify-between gap-2 bg-[#0a0a09] border border-white/10 rounded-[11px] px-3.5 py-2.5">
                  <code
                    className="text-[12px] text-[#ededeb] overflow-x-auto whitespace-nowrap"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    <span className="text-[#706f69] select-none">$ </span>
                    {agentCommands[agentTab]}
                  </code>
                  <div className="shrink-0 flex items-center gap-1.5">
                    {agentTab === "mcp" && (
                      <a
                        href={cursorMcpDeepLink}
                        className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-white/20 text-[#ededeb] hover:bg-white/10 text-[11px] font-medium"
                      >
                        <span>+ Cursor</span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        sendBeaconEvent("copy_bootstrap", { target: agentTab });
                        copyText("hero", agentCommands[agentTab]);
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-[#141413] text-[11.5px] font-medium hover:bg-[#eae9e4] cursor-pointer"
                    >
                      {copiedKey === "hero" ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#118453]" />
                          <span>{lang === "es" ? "Copiado" : "Copied"}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{lang === "es" ? "Copiar" : "Copy"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* SINGLE PILL IDEA INPUT BAR (Native IME-safe <form>) */}
              <div className="mt-4 mx-auto max-w-[590px]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void handleSynthesize();
                  }}
                  className="p-1.5 rounded-full bg-white border border-[var(--line-strong)] shadow-[var(--shadow-sm)] flex items-center gap-2"
                >
                  <label htmlFor="hero-idea-input" className="sr-only">
                    {lang === "es"
                      ? "Describe tu idea de proyecto o pega una URL"
                      : "Describe your project idea or paste a URL"}
                  </label>
                  <input
                    id="hero-idea-input"
                    type="text"
                    value={ideaInput}
                    onChange={(e) => setIdeaInput(e.target.value)}
                    placeholder={
                      lang === "es"
                        ? "O escribe tu idea de proyecto (o URL) para ver el preview..."
                        : "Or type your project idea (or URL) to synthesize a live preview..."
                    }
                    className="flex-1 min-w-0 px-4 py-2 text-[13.5px] text-[var(--ink)] bg-transparent focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={scrapingUrl}
                    className="min-h-[2.25rem] px-4 py-2 rounded-full bg-[#141413] text-[#fbfbfa] text-[12.5px] font-medium inline-flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer shrink-0 disabled:opacity-60"
                  >
                    {scrapingUrl ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>{lang === "es" ? "Analizando..." : "Analyzing..."}</span>
                      </>
                    ) : (
                      <span>{lang === "es" ? "Sintetizar →" : "Synthesize →"}</span>
                    )}
                  </button>
                </form>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
                  {QUICK_IDEAS.map((item) => (
                    <button
                      key={item.labelEn}
                      type="button"
                      onClick={() => handleSynthesize(item.idea)}
                      className="px-3 py-1 rounded-full bg-white/75 hover:bg-white border border-[var(--line)] hover:border-[var(--line-strong)] text-[11px] text-[var(--muted)] hover:text-[var(--ink)] transition-colors cursor-pointer"
                    >
                      {lang === "es" ? item.labelEs : item.labelEn}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 4-Column treg.to Strikethrough Legacy Replacement Grid */}
            <div className="mt-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {HERO_JOBS.map((job) => (
                <a key={job.taskEn} href={job.href} className="block">
                  <article className="visual-card p-4 h-full flex flex-col justify-between gap-4">
                    <div>
                      <h2 className="text-[14.5px] font-medium leading-snug">
                        {lang === "es" ? job.taskEs : job.taskEn}
                      </h2>
                      <p
                        className="mt-2 text-[11px] text-[#767672]"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        {job.refs}
                      </p>
                    </div>
                    <div
                      className="pt-3 border-t border-[var(--line)] flex items-center justify-between text-[11px] tabular-nums gap-2"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      <span className="line-through text-[var(--muted-2)]">
                        {lang === "es" ? job.legacyEs : job.legacyEn}
                      </span>
                      <span className="text-[#118453] font-medium">{job.formaRate}</span>
                    </div>
                  </article>
                </a>
              ))}
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

            <div className="mb-3 flex items-center justify-end">
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
                    onClick={cycleFontPairing}
                    title="Cycle 18 curated foundry pairings"
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
                        composed.layers.typography.typography.displayFont ||
                        "var(--font-editorial), Georgia, serif",
                      fontSizeAdjust: "from-font",
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
                  {composed.activeFontPairing
                    ? `${composed.activeFontPairing.foundry} · ${composed.activeFontPairing.displayFont}`
                    : `${composed.layers.typography.inspiredBy[0]?.name} · ${composed.layers.typography.typography.h1Tracking}`}
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
                  onClick={() => {
                    setModalTab("skeletons");
                    dialogRef.current?.showModal();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[var(--line-strong)] bg-white hover:bg-[var(--panel)] text-[12.5px] font-medium cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>
                    {lang === "es" ? "6 Esqueletos HTML/CSS" : "6 HTML/CSS Skeletons"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sendBeaconEvent("install_component", {
                      target: `shadcn-kit:${composed.mixCode}`,
                      mixCode: composed.mixCode,
                    });
                    copyText("shadcn-kit", shadcnAddCommand);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[var(--line-strong)] bg-white hover:bg-[var(--panel)] text-[12.5px] font-medium cursor-pointer"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  {copiedKey === "shadcn-kit" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#118453]" />
                      <span>shadcn CLI</span>
                    </>
                  ) : (
                    <span>npx shadcn add</span>
                  )}
                </button>

                <a
                  href={v0LaunchHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full border border-[var(--line-strong)] bg-white hover:bg-[var(--panel)] text-[12.5px] font-medium"
                >
                  <span>v0</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setModalTab("prompt");
                    dialogRef.current?.showModal();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[var(--line-strong)] bg-white hover:bg-[var(--panel)] text-[12.5px] font-medium cursor-pointer"
                >
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
          </div>
        </section>

        {/* BEFORE VS AFTER VIDEO & INTERACTIVE BENCHMARK */}
        <BeforeAfterShowcase
          lang={lang}
          onApplyPreset={(preset) => {
            setIdeaInput(preset.idea);
            setSurfaceId(preset.surfaceId);
            setPaletteId(preset.paletteId);
            setFontPairingId(preset.fontPairingId);
            setLayoutId(preset.layoutId);
            setMotionId(preset.motionId);
            document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* FORMA DOCTOR: LIVE URL UX, APCA CONTRAST, ROSETTA FONT & CSS AUDITOR */}
        <FormaDoctorPanel
          lang={lang}
          onApplyPreset={(preset) => {
            setIdeaInput(preset.idea);
            setSurfaceId(preset.surfaceId);
            setPaletteId(preset.paletteId);
            setFontPairingId(preset.fontPairingId);
            setLayoutId(preset.layoutId);
            setMotionId(preset.motionId);
            document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
          }}
        />

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
                    className="min-h-[2.125rem] py-1 px-3.5 rounded-full bg-white border border-[var(--line)] text-[12.5px] w-[155px] focus:outline-none focus:border-[var(--ink)]"
                  />

                  {galleryTab !== "components" &&
                    galleryTab !== "assets" &&
                    galleryTab !== "directories" && (
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
                    {
                      id: "directories",
                      labelEn: "Directories",
                      labelEs: "Directorios",
                      count: GLOBAL_DESIGN_DIRECTORIES.length,
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

            {/* TAB 4: TYPOGRAPHY PAIRINGS, LIVE SVGL/ICONIFY HUB, SHADERS & ICON PACKS */}
            {galleryTab === "assets" && (
              <div className="space-y-8">
                <ConnectedServicesHub lang={lang} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredTypographyPairings.map((pair) => {
                    const isApplied = fontPairingId === pair.id;
                    return (
                      <article
                        key={pair.id}
                        className="rounded-[20px] p-2 bg-[#f2f1ed] border border-[var(--line)] hover:border-[var(--line-strong)] transition-colors flex flex-col justify-between"
                      >
                        <link rel="stylesheet" href={pair.cssImport} />
                        {pair.secondaryCssImport && (
                          <link rel="stylesheet" href={pair.secondaryCssImport} />
                        )}
                        {pair.fontFaceCss && <style>{pair.fontFaceCss}</style>}
                        <div className="rounded-[14px] bg-white border border-[var(--line)] p-4 min-h-[9.5rem] flex flex-col justify-between gap-2">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className="text-[10px] text-[#E06D44] truncate"
                              style={{ fontFamily: "var(--font-mono), monospace" }}
                            >
                              {pair.foundry} · {pair.monoFont}
                            </span>
                            <span
                              className="text-[10px] text-[var(--muted)] shrink-0"
                              style={{ fontFamily: "var(--font-mono), monospace" }}
                            >
                              {pair.h1Tracking}
                            </span>
                          </div>
                          <div
                            className="text-[1.375rem] leading-[1.12] tracking-[-0.025em]"
                            style={{
                              fontFamily: pair.displayStack,
                              fontSizeAdjust: "from-font",
                              fontFeatureSettings: pair.openTypeFeatures,
                            }}
                          >
                            {pair.sampleHeading}
                          </div>
                          {pair.commercialEquivalent && (
                            <div
                              className="text-[10px] text-[#118453] truncate"
                              style={{ fontFamily: "var(--font-mono), monospace" }}
                            >
                              {lang === "es" ? "Gemelo libre de: " : "Open twin for: "}
                              {pair.commercialEquivalent}
                            </div>
                          )}
                          <div className="text-[11px] text-[var(--muted)] truncate">
                            {lang === "es" ? pair.vibeEs : pair.vibe}
                          </div>
                        </div>
                        <div className="px-2 pt-2.5 pb-1 flex items-center justify-between gap-2">
                          <span className="text-[12.5px] font-semibold truncate">{pair.name}</span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => applyFontPairing(pair.id)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-medium cursor-pointer transition-colors ${
                                isApplied
                                  ? "bg-[#118453] text-white"
                                  : "bg-[#141413] text-white hover:opacity-90"
                              }`}
                            >
                              {isApplied
                                ? lang === "es"
                                  ? "✓ Activa"
                                  : "✓ Active"
                                : lang === "es"
                                ? "Probar"
                                : "Apply"}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                copyText(pair.id, `@import url('${pair.cssImport}');`)
                              }
                              className="px-2.5 py-1 rounded-full bg-white border border-[var(--line)] text-[11px] font-medium cursor-pointer"
                              style={{ fontFamily: "var(--font-mono), monospace" }}
                            >
                              {copiedKey === pair.id ? "✓ @import" : "CSS"}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCraftAssets.map((asset) => (
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

            {/* TAB 6: 118 GLOBAL DESIGN DIRECTORIES WITH 1-CLICK LIVE X-RAY */}
            {galleryTab === "directories" && (
              <div className="space-y-5">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 whitespace-nowrap">
                  {[
                    "all",
                    "Curated Galleries",
                    "Typography & Brand",
                    "UX Critique, CRO & Type Eng",
                    "Components & Motion",
                    "Color Science & Palettes",
                    "Agent & OSS Specs",
                    "SaaS & Landings",
                    "Product & Flows",
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setDirCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-full text-[11.5px] cursor-pointer transition-colors ${
                        dirCategoryFilter === cat
                          ? "bg-[#141413] text-white font-medium"
                          : "bg-white border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)]"
                      }`}
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      {cat === "all" ? (lang === "es" ? "Todos" : "All") : cat}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {filteredDirectories.map((dir) => (
                    <article
                      key={dir.name}
                      className="visual-card p-3.5 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <a
                          href={dir.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[14px] font-semibold hover:underline inline-flex items-center gap-1 truncate"
                        >
                          <span>{dir.name}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 opacity-45 shrink-0" />
                        </a>
                        <p
                          className="text-[11px] text-[var(--muted)] truncate mt-0.5"
                          style={{ fontFamily: "var(--font-mono), monospace" }}
                        >
                          {dir.category}
                        </p>
                      </div>

                      {!dir.url.includes("github.com") && (
                        <button
                          type="button"
                          onClick={() => handleSynthesize(dir.url)}
                          className="shrink-0 px-3 py-1.5 rounded-full bg-[var(--panel)] hover:bg-[#141413] hover:text-white text-[11px] font-medium transition-colors cursor-pointer"
                          style={{ fontFamily: "var(--font-mono), monospace" }}
                        >
                          X-Ray →
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            )}

            {(galleryTab === "formats" ||
              galleryTab === "palettes" ||
              galleryTab === "scraped" ||
              galleryTab === "directories") && (
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
                    : galleryTab === "directories"
                    ? lang === "es"
                      ? `Ver los ${GLOBAL_DESIGN_DIRECTORIES.length} directorios`
                      : `Browse all ${GLOBAL_DESIGN_DIRECTORIES.length} directories`
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

        {/* PLAYWRIGHT + VISION PROPRIETARY SECTION VAULT */}
        <SectionVaultShowcase
          lang={lang}
          pinnedSectionIds={pinnedSectionIds}
          onTogglePinSection={togglePinSection}
        />

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

      <footer className="bg-[#0e0e0d] text-[#8a8982] pt-6 pb-20 px-5 border-t border-white/10">
        <div
          className="mx-auto max-w-[1120px] flex flex-wrap items-center justify-between gap-4 text-[12px]"
          style={{ fontFamily: "var(--font-mono), monospace" }}
        >
          <span>forma.to · open-source web design router</span>
          <div className="flex items-center gap-5">
            <a href="/credits" className="hover:text-white">
              Credits ($1 free)
            </a>
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
            <a href="/llms-full.txt" className="hover:text-white">
              llms-full.txt
            </a>
            <a href="/api/mcp" className="hover:text-white">
              MCP
            </a>
          </div>
        </div>
      </footer>

      {/* P de Pablo Frosted Swiss Bottom Dock (Single compact persistent bar < 44px) */}
      <nav
        aria-label="Quick navigation"
        className="fixed bottom-4 inset-x-0 mx-auto w-fit max-w-[calc(100dvw-1.5rem)] z-30 px-2.5 py-1.5 rounded-full bg-white/88 backdrop-blur-md border border-black/10 shadow-[var(--shadow-md)] flex items-center gap-1 text-[12px] overflow-x-auto whitespace-nowrap"
      >
        <a
          href="#studio"
          className="px-3 py-1 rounded-full hover:bg-black/5 font-medium text-[#141413]"
        >
          {lang === "es" ? "Studio" : "Interactive Studio"}
        </a>
        <a
          href="#section-vault"
          className="px-3 py-1 rounded-full text-[#6e6d68] hover:text-[#141413] tabular-nums"
        >
          {lang === "es"
            ? `${sectionVaultCount} Secciones DOM`
            : `${sectionVaultCount} DOM Sections`}
        </a>
        <a
          href="#proof"
          className="px-3 py-1 rounded-full text-[#6e6d68] hover:text-[#141413]"
        >
          {lang === "es" ? "Antes / Después" : "Before / After"}
        </a>
        <a
          href="#doctor"
          className="px-3 py-1 rounded-full text-[#6e6d68] hover:text-[#141413]"
        >
          Doctor
        </a>
        <button
          type="button"
          onClick={() => setExplorerOpen(true)}
          className="px-2.5 py-1 rounded-full text-[#6e6d68] hover:text-[#141413] cursor-pointer"
          style={{ fontFamily: "var(--font-mono), monospace" }}
        >
          ⌘K
        </button>
        <a
          href="/credits"
          className="px-3 py-1 rounded-full bg-[#141413] text-white font-medium tabular-nums"
          style={{ fontFamily: "var(--font-mono), monospace" }}
        >
          $1.00 free
        </a>
      </nav>

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
                  ["skeletons", "6 Skeletons"],
                  ["rules", "CLAUDE.md"],
                  ["css", "tokens.css"],
                  ["figma", "Figma W3C (.json)"],
                  ["mcp", "MCP & shadcn"],
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

            {/* CLI Install Row + Pin to DESIGN.md */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-[12px] bg-[var(--panel)] border border-[var(--line)]">
              <code
                className="text-[12px] text-[var(--ink)] truncate"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                $ {activeComponentModal.cliInstall}
              </code>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => togglePinComponent(activeComponentModal.id)}
                  className={`px-3 py-1 rounded-full text-[11.5px] font-medium cursor-pointer transition-colors ${
                    pinnedComponentIds.includes(activeComponentModal.id)
                      ? "bg-[#118453] text-white"
                      : "bg-white border border-[var(--line-strong)] text-[var(--ink)]"
                  }`}
                >
                  {pinnedComponentIds.includes(activeComponentModal.id)
                    ? "✓ Pinned to DESIGN.md"
                    : "+ Pin to DESIGN.md"}
                </button>
                <button
                  type="button"
                  onClick={() => copyText("comp-cli", activeComponentModal.cliInstall)}
                  className="px-3 py-1 rounded-full bg-[#141413] text-white text-[11.5px] font-medium cursor-pointer"
                >
                  {copiedKey === "comp-cli" ? "✓ Copied" : "Copy CLI"}
                </button>
              </div>
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
        onPinSection={togglePinSection}
        onSelectFontPairing={applyFontPairing}
        onXrayUrl={(u) => handleSynthesize(u)}
      />
    </div>
  );
}
