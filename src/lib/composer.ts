import {
  CURATED_COLOR_PALETTES,
  getContrastRatio,
  hexToOklchString,
  type CuratedColorPalette,
} from "@/data/color-palettes";
import { CRAFT_TOOLS_AND_ASSETS, RARE_COMPONENTS } from "@/data/compendium";
import {
  GLOBAL_UNSLOP_RULES,
  WEB_FORMATS,
  type WebFormat,
} from "@/data/formats";

export type TargetStack =
  | "nextjs-tailwind"
  | "vite-react"
  | "astro-css"
  | "vanilla-html";

export interface MixSelection {
  surfaceId: string;
  typographyId: string;
  layoutId: string;
  componentsId: string;
  motionId?: string;
  paletteId?: string;
  projectName?: string;
  projectBrief?: string;
  stack?: TargetStack;
  enforceUnslop?: boolean;
  customFormats?: WebFormat[];
}

export interface RecommendationResult {
  query: string;
  selection: {
    surfaceId: string;
    typographyId: string;
    layoutId: string;
    componentsId: string;
    motionId: string;
  };
  matchedFormats: {
    id: string;
    name: string;
    score: number;
    matchedSignals: string[];
  }[];
  rationale: string;
  rationaleEs: string;
}

export interface ComposedGenome {
  mixCode: string;
  title: string;
  projectName: string;
  projectBrief: string;
  stack: TargetStack;
  activePalette?: CuratedColorPalette;
  contrastRatioText: number;
  contrastRatioCta: number;
  layers: {
    surface: WebFormat;
    typography: WebFormat;
    layout: WebFormat;
    components: WebFormat;
    motion: WebFormat;
  };
  uniqueSources: { name: string; url: string; extractedTrait: string }[];
  cssTokens: string;
  masterPrompt: string;
  cursorClaudeRules: string;
}

const SYNONYM_SIGNALS: Record<string, string[]> = {
  "treg-gateway": ["treg", "mcp", "agent", "agente", "agentes", "cli", "gateway", "openrouter", "registry", "llms.txt", "herramientas", "stone"],
  "resizes-infra": ["resiz", "resizes", "infra", "infraestructura", "devops", "kubernetes", "k8s", "cloud", "nube", "security", "observability", "finops", "halftone"],
  "pdepablo-studio": ["pdepablo", "pablo", "portfolio", "portafolio", "studio", "estudio", "agency", "agencia", "branding", "marca", "dock", "swiss", "suizo"],
  "dead-simple": ["deadsimple", "deadsimplesites", "simple", "sencillo", "minimal", "minimalista", "brutalist", "fast", "rapido", "text", "essay", "manifesto", "notes", "notas"],
  "unslop-editorial": ["unslop", "slop", "dashboard", "panel", "analytics", "analitica", "metrics", "table", "tabla", "data", "datos", "admin", "limpio"],
  "claude-academy": ["claude", "anthropic", "skilljar", "fde", "academy", "academia", "course", "curso", "education", "learning", "legal", "research", "warm", "calido", "ivory"],
  "twentyfirst-craft": ["21st", "bento", "components", "componentes", "shadcn", "raycast", "command", "teclado", "vibe", "ide", "zinc"],
  "landings-saas": ["landings", "landing", "saas", "conversion", "b2b", "sales", "ventas", "startup", "pricing", "crm", "attio"],
  "a1-monograph": ["a1", "luxury", "lujo", "fashion", "moda", "architecture", "arquitectura", "magazine", "monograph", "wellness"],
  "mobbin-flows": ["mobbin", "onboarding", "flow", "flujo", "wizard", "checkout", "webapp", "workspace", "settings"],
  "awwwards-kinetic": ["awwwards", "kinetic", "cinetico", "scroll", "event", "evento", "conference", "video", "music", "launch"],
  "hardware-teenage": ["teenage", "hardware", "robotics", "robotica", "audio", "synth", "iot", "industrial", "mechanical", "orange", "local", "edge"],
  "linear-precision": ["linear", "fey", "issues", "roadmap", "obsidian", "velocity", "product management"],
  "stripe-editorial-mesh": ["stripe", "dub", "fintech", "payments", "pagos", "billing", "checkout", "bank", "finanzas", "revenue"],
  "vercel-geist-grid": ["vercel", "nextjs", "zed", "compiler", "serverless", "crosshair", "monochrome"],
  "rauno-craft": ["rauno", "emil", "kowalski", "physics", "spring", "drawer", "microinteractions", "invisible", "tactile"],
  "godly-immersive": ["godly", "cosmos", "gallery", "galeria", "visual", "generative", "media", "spatial"],
  "curated-brutalist": ["curated", "httpster", "poster", "cobalt", "indie", "podcast", "culture"],
  "resend-obsidian": ["resend", "clerk", "oled", "pitch black", "email", "auth", "webhooks", "sdk"],
  "midday-calm-fintech": ["midday", "cal", "nordic", "accounting", "invoicing", "facturacion", "operaciones", "founder"],
  "mintlify-knowledge": ["mintlify", "supabase", "docs", "documentacion", "openapi", "api reference", "knowledge"],
  "refero-product-led": ["refero", "playground", "sandbox", "generator", "plg", "interactive tool"],
  "darkmode-oled": ["darkmodedesign", "oled", "night", "high contrast"],
  "motion-primitives-lab": ["motion-primitives", "magicui", "morph", "stagger", "shared layout", "animaciones"],
};

export function getFormatById(id: string, customFormats: WebFormat[] = []): WebFormat {
  const pool = [...customFormats, ...WEB_FORMATS];
  return pool.find((f) => f.id === id) ?? WEB_FORMATS[0];
}

export function recommendMixFromBrief(rawQuery: string): RecommendationResult {
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    return {
      query: "",
      selection: {
        surfaceId: "treg-gateway",
        typographyId: "resizes-infra",
        layoutId: "treg-gateway",
        componentsId: "twentyfirst-craft",
        motionId: "rauno-craft",
      },
      matchedFormats: [
        { id: "treg-gateway", name: "Stone Agent Gateway", score: 95, matchedSignals: ["agentic baseline"] },
        { id: "resizes-infra", name: "Dark Halftone Infrastructure", score: 90, matchedSignals: ["serif accent"] },
        { id: "rauno-craft", name: "Invisible Interface & Tactile Lab", score: 88, matchedSignals: ["spring physics"] },
      ],
      rationale:
        "Default 5-layer blend: Warm Stone surface (treg.to) + Italic Serif typography (resiz.es) + Agent Bootstrap layout + 21st.dev primitives + Rauno/Emil spring physics.",
      rationaleEs:
        "Combinación base en 5 capas: Superficie piedra (treg.to) + serif itálica (resiz.es) + layout para agentes + primitivas 21st.dev + física spring de Emil/Rauno.",
    };
  }

  const scored = WEB_FORMATS.map((fmt) => {
    let score = 10;
    const matchedSignals: string[] = [];
    const signals = [...fmt.keywords, ...(SYNONYM_SIGNALS[fmt.id] ?? [])];

    for (const sig of signals) {
      const s = sig.toLowerCase();
      if (query.includes(s)) {
        score += s.length >= 6 ? 26 : 16;
        if (!matchedSignals.includes(s)) matchedSignals.push(s);
      }
    }

    const wantsDark = /\b(dark|oscuro|oscura|negro|night|black|oled|halftone|obsidian)\b/.test(query);
    const wantsLight = /\b(light|claro|clara|blanco|white|warm|calido|paper|stone|nordic)\b/.test(query);

    if (wantsDark && fmt.surface.mode === "dark") {
      score += 20;
      matchedSignals.push("dark-mode");
    }
    if (wantsLight && fmt.surface.mode === "light") {
      score += 18;
      matchedSignals.push("light-mode");
    }

    return { format: fmt, score, matchedSignals };
  }).sort((a, b) => b.score - a.score);

  const top1 = scored[0].format;
  const top2 = scored[1]?.score > 18 ? scored[1].format : top1;
  const top3 = scored[2]?.score > 18 ? scored[2].format : top2;

  const surfaceId = top1.id;

  const typeCandidate = scored.find(
    (s) =>
      s.score > 22 &&
      ["resizes-infra", "claude-academy", "a1-monograph", "pdepablo-studio", "vercel-geist-grid", "curated-brutalist"].includes(
        s.format.id
      )
  );
  const typographyId = typeCandidate ? typeCandidate.format.id : top2.id;

  const layoutCandidate = scored.find(
    (s) =>
      s.score > 22 &&
      [
        "treg-gateway", "pdepablo-studio", "landings-saas", "mobbin-flows",
        "dead-simple", "stripe-editorial-mesh", "mintlify-knowledge", "refero-product-led",
      ].includes(s.format.id)
  );
  const layoutId = layoutCandidate ? layoutCandidate.format.id : top1.id;

  const compCandidate = scored.find(
    (s) =>
      s.score > 18 &&
      [
        "twentyfirst-craft", "treg-gateway", "unslop-editorial", "resend-obsidian",
        "linear-precision", "hardware-teenage", "pdepablo-studio",
      ].includes(s.format.id) &&
      s.format.id !== surfaceId
  );
  const componentsId = compCandidate ? compCandidate.format.id : top3.id;

  const motionCandidate = scored.find(
    (s) =>
      s.score > 20 &&
      ["rauno-craft", "motion-primitives-lab", "awwwards-kinetic", "linear-precision", "dead-simple", "pdepablo-studio"].includes(
        s.format.id
      )
  );
  const motionId = motionCandidate ? motionCandidate.format.id : "rauno-craft";

  const uniqueNames = Array.from(
    new Set([
      getFormatById(surfaceId).name,
      getFormatById(layoutId).name,
      getFormatById(motionId).name,
    ])
  );

  return {
    query: rawQuery,
    selection: { surfaceId, typographyId, layoutId, componentsId, motionId },
    matchedFormats: scored.slice(0, 5).map((s) => ({
      id: s.format.id,
      name: s.format.name,
      score: Math.min(99, s.score),
      matchedSignals: s.matchedSignals.slice(0, 5),
    })),
    rationale: `Synthesized 5-layer genome (${uniqueNames.join(" × ")}) — pairing ${getFormatById(surfaceId).surface.bg} surface tokens with ${getFormatById(motionId).motion.feel} motion physics and unslop-ui guardrails.`,
    rationaleEs: `Genoma sintetizado en 5 capas (${uniqueNames.join(" × ")}): une superficie ${getFormatById(surfaceId).surface.bg} con física de animación (${getFormatById(motionId).motion.feel}) y guardrails unslop-ui.`,
  };
}

function buildTextureCss(texture: WebFormat["surface"]["texture"], line: string, mode: "light" | "dark"): string {
  switch (texture) {
    case "halftone-map":
      return `background-image: radial-gradient(${mode === "dark" ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)"} 1px, transparent 1px);\n  background-size: 14px 14px;`;
    case "stone-dots":
      return `background-image: radial-gradient(${mode === "dark" ? "rgba(255,255,255,0.09)" : "rgba(26,26,26,0.08)"} 1px, transparent 1px);\n  background-size: 18px 18px;`;
    case "architect-grid":
      return `background-image: linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px);\n  background-size: 64px 64px;`;
    case "anodized-grid":
      return `background-image: linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px);\n  background-size: 32px 32px;`;
    default:
      return `/* Clean unadorned surface — zero background pattern noise */`;
  }
}

export function composeFormatGenome(input: MixSelection): ComposedGenome {
  const custom = input.customFormats ?? [];
  const rawSurfaceFmt = getFormatById(input.surfaceId, custom);
  const matchedPalette = input.paletteId
    ? CURATED_COLOR_PALETTES.find((p) => p.id === input.paletteId)
    : undefined;

  // Merge curated color science palette tokens onto surface layer when selected
  const surfaceFmt: WebFormat = matchedPalette
    ? {
        ...rawSurfaceFmt,
        surface: {
          ...rawSurfaceFmt.surface,
          mode: matchedPalette.mode,
          ...matchedPalette.tokens,
        },
      }
    : rawSurfaceFmt;

  const typeFmt = getFormatById(input.typographyId, custom);
  const layoutFmt = getFormatById(input.layoutId, custom);
  const compFmt = getFormatById(input.componentsId, custom);
  const motionFmt = getFormatById(input.motionId || input.surfaceId, custom);

  const projectName = input.projectName?.trim() || "Acme";
  const projectBrief =
    input.projectBrief?.trim() ||
    "Modern high-craft software product designed with human taste and agentic precision.";
  const stack: TargetStack = input.stack || "nextjs-tailwind";
  const enforceUnslop = input.enforceUnslop !== false;

  const uniqueFormats = Array.from(
    new Map(
      [surfaceFmt, typeFmt, layoutFmt, compFmt, motionFmt].map((f) => [f.id, f])
    ).values()
  );

  const mixCode = uniqueFormats.map((f) => f.shortCode.split("-")[0]).join("+");
  const title =
    uniqueFormats.length === 1
      ? surfaceFmt.name
      : `${surfaceFmt.name.split(" ")[0]} × ${layoutFmt.name.split(" ")[0]}${
          uniqueFormats.length > 2 ? ` (+${uniqueFormats.length - 2})` : ""
        }`;

  const uniqueSourcesMap = new Map<string, { name: string; url: string; extractedTrait: string }>();
  for (const f of uniqueFormats) {
    for (const src of f.inspiredBy) {
      uniqueSourcesMap.set(src.name, src);
    }
  }
  if (matchedPalette) {
    uniqueSourcesMap.set(matchedPalette.inspiredBy.name, {
      name: matchedPalette.inspiredBy.name,
      url: matchedPalette.inspiredBy.url,
      extractedTrait: `${matchedPalette.name} (${matchedPalette.harmony})`,
    });
  }
  if (enforceUnslop) {
    uniqueSourcesMap.set("unslop-ui", {
      name: "unslop-ui",
      url: "https://github.com/felipebasurto/unslop-ui",
      extractedTrait: "Subtractive anti-slop UI guardrails",
    });
  }
  const uniqueSources = Array.from(uniqueSourcesMap.values());

  const s = surfaceFmt.surface;
  const t = typeFmt.typography;
  const l = layoutFmt.layout;
  const m = motionFmt.motion;

  const contrastRatioText = getContrastRatio(s.bg, s.ink);
  const contrastRatioCta = getContrastRatio(s.accent, s.accentInk);
  const bgOklch = hexToOklchString(s.bg);
  const inkOklch = hexToOklchString(s.ink);
  const accentOklch = hexToOklchString(s.accent);

  const paletteLabel = matchedPalette
    ? `${matchedPalette.name} (${matchedPalette.harmony} · ${matchedPalette.inspiredBy.name})`
    : surfaceFmt.name;

  const cssTokens = `/* Generated by forma.to — 5-Layer Composed Genome [${mixCode}] for ${projectName} */
@import url('${t.googleFontsImport}');

:root {
  /* Layer 01: Color Science & 60-30-10 Role System (${paletteLabel}) */
  /* Verified Contrast: Body ${contrastRatioText}:1 · Primary CTA ${contrastRatioCta}:1 */
  --bg: ${s.bg};               /* 60% Canvas — ${bgOklch} */
  --surface: ${s.surface};     /* Elevated Cards */
  --panel: ${s.panel};         /* Secondary Wells */
  --ink: ${s.ink};             /* 30% Primary Ink — ${inkOklch} */
  --muted: ${s.muted};         /* Supporting Copy */
  --line: ${s.line};           /* Hairline Borders */
  --accent: ${s.accent};       /* 10% Focal CTA — ${accentOklch} */
  --accent-ink: ${s.accentInk};
  --badge-bg: ${s.badgeBg};
  --radius-card: ${s.radiusCard};
  --radius-pill: ${s.radiusPill};
  --shadow-card: ${s.shadow};

  /* Layer 02: Typography (${typeFmt.name}) */
  --font-display: ${t.displayFont};
  --font-sans: ${t.bodyFont};
  --font-mono: ${t.monoFont};${
    t.serifAccentFont ? `\n  --font-serif-accent: ${t.serifAccentFont};` : ""
  }
  --h1-size: ${t.h1Scale};
  --h1-tracking: ${t.h1Tracking};
  --body-leading: ${t.bodyLeading};

  /* Layer 03: Spatial Rail (${layoutFmt.name}) */
  --container-max: ${l.maxWidth};

  /* Layer 05: Motion Physics (${motionFmt.name}) */
  --ease-out-craft: ${m.easing};
}

body {
  background-color: var(--bg);
  color: var(--ink);
  font-family: var(--font-sans);
  line-height: var(--body-leading);
  -webkit-font-smoothing: antialiased;
}

.hero-canvas {
  ${buildTextureCss(s.texture, s.line, s.mode)}
}

.interactive-el {
  transition: transform 160ms var(--ease-out-craft), opacity 160ms var(--ease-out-craft), border-color 160ms ease;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}`;

  const stackDirective: Record<TargetStack, string> = {
    "nextjs-tailwind":
      "Next.js (App Router, TypeScript) + Tailwind CSS v4 (`@theme` mapped to CSS custom properties above). Server Components by default; client islands for interactive primitives.",
    "vite-react":
      "Vite + React 19 + TypeScript + CSS variables / Tailwind CSS. Zero-CLS layout.",
    "astro-css":
      "Astro 5 + Scoped Modern Vanilla CSS (`@container`, native `<dialog>`, CSS Grid `subgrid`). Near-zero JS.",
    "vanilla-html":
      "Semantic HTML5 + Modern Baseline CSS (Custom Properties, CSS Grid, Container Queries, native `<dialog closedby=\"any\">`).",
  };

  const guardrailsCombined = Array.from(
    new Set([
      ...(enforceUnslop ? GLOBAL_UNSLOP_RULES : []),
      ...surfaceFmt.guardrails.slice(-1),
      ...layoutFmt.guardrails.slice(-1),
      ...motionFmt.motion.rules,
    ])
  );

  const primitivesCombined = [
    ...compFmt.components.primitives,
    ...layoutFmt.components.primitives.filter(
      (p) => !compFmt.components.primitives.some((cp) => cp.name === p.name)
    ),
  ].slice(0, 5);

  const masterPrompt = `# DESIGN.md — 5-Layer Agentic Web Format Specification [${mixCode}]
> Synthesized via **forma.to** for **${projectName}**
> Reference DNA: ${uniqueSources.map((src) => `${src.name} (${src.url})`).join(" · ")}

## 1. Project Context & Mission
- **Brand / Product Name:** ${projectName}
- **Product Brief:** ${projectBrief}
- **Target Tech Stack:** ${stackDirective[stack]}
- **5-Layer Composition:**
  1. **Surface & Palette:** *${surfaceFmt.name}* (\`${s.mode}\` · \`${s.bg}\`)
  2. **Typography & Scale:** *${typeFmt.name}* (\`${t.displayFont}\`)
  3. **Layout & Navigation:** *${layoutFmt.name}* (\`${l.navStyle}\` · \`${l.maxWidth}\`)
  4. **UI Primitives:** *${compFmt.name}*
  5. **Motion & Animation Physics:** *${motionFmt.name}* (\`${m.easing}\` — ${m.feel})

---

## 2. Exact Design Tokens (CSS Custom Properties)
\`\`\`css
${cssTokens}
\`\`\`

### Surface & 60-30-10 Color Harmony Rules (Happy Hues / Radix / OKLCH)
- **60% Neutral Canvas (\`--bg\` / \`--surface\`):** Keep 60%+ of viewport area in calm neutral surfaces (\`${s.bg}\` / \`${bgOklch}\`).
- **30% Typographic Ink & Hairlines (\`--ink\` / \`--line\`):** Verified WCAG contrast **${contrastRatioText}:1** (\`${s.ink}\` on \`${s.bg}\`).
- **10% Focal Chromatic Accent (\`--accent\`):** Reserve \`${s.accent}\` (\`${accentOklch}\`, CTA contrast **${contrastRatioCta}:1**) strictly for primary CTAs, active indicators, and key focal states — NEVER flood large section backgrounds with accent color.${
    matchedPalette ? `\n- **Color Psychology:** ${matchedPalette.psychology}` : ""
  }
${s.rules.map((r) => `- ${r}`).join("\n")}

---

## 3. Typography & Hierarchy (${typeFmt.name})
- **Display Font:** \`${t.displayFont}\` | Size: \`${t.h1Scale}\` | Tracking: \`${t.h1Tracking}\`
- **Body Font:** \`${t.bodyFont}\` | Line-height: \`${t.bodyLeading}\`
- **Monospace Font:** \`${t.monoFont}\`${
    t.useItalicAccent && t.serifAccentFont
      ? `\n- **Editorial Serif Accent:** Highlight **one** pivotal word in Hero H1 using \`${t.serifAccentFont}\` italic.`
      : ""
  }
${t.rules.map((r) => `- ${r}`).join("\n")}

---

## 4. Layout, Navigation & Section Blueprint (${layoutFmt.name})
- **Max Container Width:** \`${l.maxWidth}\` | **Navigation:** \`${l.navStyle}\`
- **Grid Pattern:** ${l.gridSpec}

### Top-to-Bottom Page Sequence
${l.sectionBlueprint.map((step, idx) => `${idx + 1}. ${step}`).join("\n")}

---

## 5. Interactive UI Primitives & Registry Components (${compFmt.name} + Rare UI)
- **Signature Above-the-Fold Artifact:** ${compFmt.components.heroArtifact}
${primitivesCombined.map((p) => `- **${p.name}** *(${p.sourcePattern})*: ${p.spec}`).join("\n")}

### Recommended Installable Components & Assets (shadcn CLI / npm)
${RARE_COMPONENTS.filter((rc) =>
  rc.keywords.some((k) => projectBrief.toLowerCase().includes(k))
)
  .slice(0, 3)
  .concat(RARE_COMPONENTS.slice(0, 2))
  .filter((v, i, arr) => arr.findIndex((x) => x.id === v.id) === i)
  .slice(0, 3)
  .map((rc) => `- **${rc.name}** (${rc.provider}): \`${rc.cliInstall}\` — ${rc.description}`)
  .join("\n")}
- **Icons & Visual Assets:** Prefer \`${CRAFT_TOOLS_AND_ASSETS[0].installOrUsage}\` (${CRAFT_TOOLS_AND_ASSETS[0].name}) and \`${CRAFT_TOOLS_AND_ASSETS[2].name}\` (${CRAFT_TOOLS_AND_ASSETS[2].url}) over generic default icon circles.

---

## 6. Motion Physics & Animation Choreography (${motionFmt.name})
- **Primary Easing Curve:** \`${m.easing}\` (${m.feel})
- **Duration Scale:** ${m.durationScale}
- **Choreography:** ${m.choreography}
- **Recommended Engine:** ${m.engine}
${m.rules.map((r) => `- ${r}`).join("\n")}

---

## 7. Brand Copy Voice & Mandatory Anti-Slop Guardrails (unslop-ui)
- **Copy Formula:** ${layoutFmt.copyVoice.formula}
- **CTA Phrasing:** ${surfaceFmt.copyVoice.ctaStyle}
${guardrailsCombined.map((g) => `- [ ] ${g}`).join("\n")}
`;

  const cursorClaudeRules = `# UI, Motion & Anti-Slop Rules (${projectName} — forma.to/${mixCode})

1. **Tokens:** Use \`--bg: ${s.bg}\`, \`--surface: ${s.surface}\`, \`--panel: ${s.panel}\`, \`--ink: ${s.ink}\`, \`--muted: ${s.muted}\`, \`--line: ${s.line}\`, \`--accent: ${s.accent}\`.
2. **Typography:** Display ${t.displayFont} (\`${t.h1Tracking}\`); body ${t.bodyFont}; numbers/CLI in ${t.monoFont} with \`tabular-nums\`.
3. **Layout:** Max width \`${l.maxWidth}\`, \`${l.navStyle}\` navigation, card radius \`${s.radiusCard}\`.
4. **Motion Physics:** Use \`${m.easing}\` (${m.durationScale}) strictly on \`transform\` and \`opacity\`, honoring \`prefers-reduced-motion\`.
5. **Zero AI Slop:**
${GLOBAL_UNSLOP_RULES.slice(0, 6).map((r) => `   - ${r}`).join("\n")}
`;

  return {
    mixCode,
    title,
    projectName,
    projectBrief,
    stack,
    activePalette: matchedPalette,
    contrastRatioText,
    contrastRatioCta,
    layers: {
      surface: surfaceFmt,
      typography: typeFmt,
      layout: layoutFmt,
      components: compFmt,
      motion: motionFmt,
    },
    uniqueSources,
    cssTokens,
    masterPrompt,
    cursorClaudeRules,
  };
}
