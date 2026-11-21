import { GLOBAL_UNSLOP_RULES, type WebFormat } from "@/data/formats";

export interface DiscoveredSite {
  id: string;
  url: string;
  hostname: string;
  title: string;
  description: string;
  sourceGallery: string;
  scrapedAt: string;
  craftScore: number;
  grade: string;
  strengths: string[];
  mode: "light" | "dark";
  bg: string;
  ink: string;
  accent: string;
  palette: string[];
  primaryFont: string;
  primaryEasing: string;
  bezierCurves: { curve: string; count: number; feel: string }[];
  keyframes: string[];
  motionEngines: string[];
  honorsReducedMotion: boolean;
}

export function cleanFontName(raw: string): string {
  const cleaned = raw
    .replace(/^__([a-zA-Z0-9]+).*$/, "$1")
    .replace(/var\(--[^)]*mono[^)]*\)/i, "Monospace")
    .replace(/var\(--[^)]*\)/i, "Geist Sans")
    .replace(/\s*Placeholder$/i, "")
    .trim();
  return cleaned || "Geist";
}

export function convertScrapedSiteToFormat(site: DiscoveredSite): WebFormat {
  const cleanHost = site.hostname.replace(/^www\./, "");
  const displayFontClean = cleanFontName(site.primaryFont);
  const codePrefix = cleanHost
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 3)
    .toUpperCase()
    .padEnd(3, "X");

  const isDark = site.mode === "dark";
  const surfaceHex = isDark ? "#151518" : "#ffffff";
  const panelHex = isDark ? "#1d1d21" : "#f2f2ef";
  const mutedHex = isDark ? "#9898a0" : "#686862";
  const lineRgba = isDark ? "rgba(255,255,255,0.10)" : "rgba(20,20,18,0.10)";

  const feel =
    site.bezierCurves[0]?.feel ||
    (site.motionEngines.length > 0 ? site.motionEngines[0] : "Snappy CSS precision");

  return {
    id: site.id,
    name: cleanHost,
    shortCode: `${codePrefix}-LIVE`,
    category: "Design Engineering",
    tagline: `Live-scraped genome (${site.craftScore}/100 ${site.grade}) · ${displayFontClean} · ${feel}.`,
    taglineEs: `Genoma extraído en vivo (${site.craftScore}/100 ${site.grade}) · ${displayFontClean} · ${feel}.`,
    replacesSlop: "Unverified guesswork tokens",
    inspiredBy: [
      {
        name: cleanHost,
        url: site.url,
        extractedTrait: `Live X-Ray via ${site.sourceGallery} (Score ${site.craftScore}/100)`,
      },
    ],
    keywords: [cleanHost, site.sourceGallery, site.mode, site.primaryFont.toLowerCase()],
    bestFor: ["Live Reference Remixing", "Custom Brand Extraction"],
    surface: {
      mode: site.mode,
      bg: site.bg,
      surface: surfaceHex,
      panel: panelHex,
      ink: site.ink,
      muted: mutedHex,
      line: lineRgba,
      accent: site.accent,
      accentInk: isDark ? "#0a0a0b" : "#ffffff",
      badgeBg: panelHex,
      texture: isDark ? "specular-zinc" : "stone-dots",
      radiusCard: "14px",
      radiusPill: "9999px",
      shadow: isDark
        ? "inset 0 1px 0 rgba(255,255,255,0.08), 0 16px 36px rgba(0,0,0,0.5)"
        : "0 1px 3px rgba(0,0,0,0.04), 0 10px 24px rgba(0,0,0,0.05)",
      rules: [
        `Extracted live palette from ${cleanHost}: primary surface \`${site.bg}\`, ink \`${site.ink}\`, accent \`${site.accent}\`.`,
        ...(site.palette.length > 0
          ? [`Supporting tokens observed in stylesheet: ${site.palette.join(", ")}.`]
          : []),
      ],
    },
    typography: {
      displayFont: `'${displayFontClean}', 'Geist', sans-serif`,
      bodyFont: `'Geist', -apple-system, sans-serif`,
      monoFont: `'DM Mono', 'JetBrains Mono', monospace`,
      googleFontsImport:
        "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Geist:wght@400;500;600;700&display=swap",
      h1Scale: "clamp(2.4rem, 5vw, 4.2rem)",
      h1Tracking: "-0.036em",
      bodyLeading: "1.55",
      useItalicAccent: /serif|italic|redaction/i.test(site.primaryFont),
      useMonoMetrics: true,
      rules: [
        `Primary typeface detected on ${cleanHost}: \`${site.primaryFont}\`.`,
        "Pair with tabular monospace numerals for technical metadata.",
      ],
    },
    layout: {
      maxWidth: "1180px",
      navStyle: "floating-pill",
      heroLayout: "split-product-frame",
      gridSpec: `Extracted ${cleanHost} container hierarchy -> Above-the-fold artifact + modular proof grid.`,
      sectionBlueprint: [
        `Compact persistent top bar styled in ${site.mode} palette (\`${site.bg}\`).`,
        "High-clarity hero statement paired with primary interactive product stage.",
        "Modular 2–3 column proof grid with hairline borders.",
        "Direct self-serve CTA band.",
      ],
      rules: ["Keep persistent chrome under 10% viewport height."],
    },
    components: {
      heroArtifact: `Interactive ${cleanHost}-inspired product showcase card`,
      primitives: [
        {
          name: `${cleanHost} Surface Card`,
          sourcePattern: `forma-xray Live Extraction`,
          spec: `<article> using \`${surfaceHex}\` fill, \`1px solid ${lineRgba}\`, and \`${site.primaryEasing}\` hover physics.`,
        },
      ],
    },
    motion: {
      easing: site.primaryEasing,
      feel,
      durationScale: "160ms interactive · 260ms reveal",
      choreography:
        site.keyframes.length > 0
          ? `Observed CSS @keyframes (${site.keyframes.join(", ")}) paired with \`${site.primaryEasing}\` transitions.`
          : `Restrained GPU transitions using \`${site.primaryEasing}\`.`,
      engine:
        site.motionEngines.length > 0
          ? site.motionEngines.join(" + ")
          : "Pure CSS GPU Transitions",
      rules: [
        "Restrict transitions strictly to `transform` and `opacity`.",
        "Always honor `@media (prefers-reduced-motion: reduce)`.",
      ],
    },
    guardrails: [...GLOBAL_UNSLOP_RULES],
    copyVoice: {
      formula: site.description || `Clear, high-craft positioning inspired by ${cleanHost}.`,
      ctaStyle: "'Get started →', 'Explore'",
      rules: ["Maintain concise, factual copy with zero AI buzzwords."],
    },
  };
}
