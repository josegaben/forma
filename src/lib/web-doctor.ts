import { hexToOklchString } from "@/data/color-palettes";
import { TYPOGRAPHY_PAIRINGS } from "@/data/compendium";

export interface RosettaFontTwin {
  commercial: string;
  foundry: string;
  openTwin: string;
  pairingId: string;
  openTypeFeatures: string;
  cssImport: string;
}

export interface DoctorSuggestion {
  id: string;
  severity: "critical" | "high" | "opportunity";
  framework:
    | "APCA-W3 Contrast"
    | "GoodUI & Hick's Law"
    | "Practical Typography & WCAG 1.4.4"
    | "Baymard & Form UX"
    | "Checklist.design"
    | "Project Wallace & GPU"
    | "Refactoring UI";
  whatEn: string;
  whatEs: string;
  whyEn: string;
  whyEs: string;
  fixEn: string;
  fixEs: string;
  codePatch: string;
}

export interface DoctorStudioPreset {
  idea: string;
  surfaceId: string;
  paletteId: string;
  fontPairingId: string;
  layoutId: string;
  motionId: string;
}

export interface WebDoctorDiagnosis {
  overallHealthScore: number;
  grade: "A+" | "A" | "B" | "C" | "D";
  apca: {
    bodyLcSigned: number;
    bodyLcAbs: number;
    bodyStatus: "AAA" | "AA" | "Low";
    accentLcAbs: number;
  };
  rosettaFontTwins: RosettaFontTwin[];
  recommendedFontPairing: {
    id: string;
    name: string;
    foundry: string;
    reasonEn: string;
    reasonEs: string;
    openTypeFeatures?: string;
    cssImport: string;
  };
  suggestions: DoctorSuggestion[];
  recommendedStudioPreset: DoctorStudioPreset;
  markdownPatch: string;
}

interface XrayLikeReport {
  url: string;
  hostname: string;
  title: string;
  description: string;
  craftScore: number;
  antiSlopAudit: {
    score: number;
    grade: string;
    strengths: string[];
    warnings: string[];
  };
  apcaContrast?: {
    bodyLc?: { signed: number; abs: number; polarity: string };
    accentOnBgLc?: { signed: number; abs: number; polarity: string };
  };
  domSignals?: {
    h1Count: number;
    primaryH1: string;
    ctaCount: number;
    vagueCtaLabels: string[];
    inputCount: number;
    labelCount: number;
    hasOgImage: boolean;
    hasMainLandmark: boolean;
    hasNavLandmark: boolean;
    hasFooterLandmark: boolean;
    hasLangAttr: boolean;
  };
  cssHygiene?: {
    importantCount: number;
    uniqueHexCount: number;
    cssVariableCount: number;
    hasFocusVisible: boolean;
    hasLayoutThrashTransition: boolean;
    unsafeZoomClamps: { expression: string; ratio: number }[];
  };
  layers: {
    surface: {
      mode: string;
      bg: string;
      ink: string;
      accent: string;
      oklchCount: number;
    };
    typography: {
      primaryFont: string;
      detectedFontFaces: string[];
      openTypeFeatures?: string[];
      fluidClamps: string[];
      rosettaMatches?: RosettaFontTwin[];
    };
    layout: {
      maxWidths: string[];
      modernPlatform: {
        containerQueries: boolean;
        subgrid: boolean;
        nativeDialog: boolean;
        popoverApi: boolean;
        tabularNums: boolean;
        backdropBlur: boolean;
        fontSizeAdjust?: boolean;
        textWrapBalance?: boolean;
        userInvalidValidation?: boolean;
      };
    };
    motion: {
      primaryEasing: string;
      honorsReducedMotion: boolean;
    };
  };
}

interface CoreWebVitalsLike {
  performanceScore?: number;
  accessibilityScore?: number;
  lcp?: string | null;
  cls?: string | null;
}

export function generateWebDoctorDiagnosis(
  xray: XrayLikeReport,
  cwv?: CoreWebVitalsLike | null
): WebDoctorDiagnosis {
  const suggestions: DoctorSuggestion[] = [];
  const mode: "light" | "dark" = xray.layers.surface.mode === "dark" ? "dark" : "light";
  const bgHex = xray.layers.surface.bg;
  const inkHex = xray.layers.surface.ink;
  const accentHex = xray.layers.surface.accent;

  const bodyLcSigned = xray.apcaContrast?.bodyLc?.signed ?? (mode === "dark" ? -88 : 92);
  const bodyLcAbs = xray.apcaContrast?.bodyLc?.abs ?? Math.abs(bodyLcSigned);
  const accentLcAbs = xray.apcaContrast?.accentOnBgLc?.abs ?? 58;

  const bodyStatus: "AAA" | "AA" | "Low" =
    bodyLcAbs >= 75 ? "AAA" : bodyLcAbs >= 60 ? "AA" : "Low";

  // 1. APCA Perceptual Contrast Check
  if (bodyLcAbs < 72) {
    const fixedInk = mode === "dark" ? "#f4f4f1" : "#141413";
    const fixedMuted = mode === "dark" ? "oklch(0.76 0.01 90)" : "oklch(0.42 0.01 85)";
    suggestions.push({
      id: "apca-body-contrast",
      severity: bodyLcAbs < 55 ? "critical" : "high",
      framework: "APCA-W3 Contrast",
      whatEn: `Body text perceptual contrast is Lc ${bodyLcSigned} (${inkHex} on ${bgHex}), below the Lc 75 fluent-reading threshold.`,
      whatEs: `El contraste perceptual APCA del texto base es Lc ${bodyLcSigned} (${inkHex} sobre ${bgHex}), inferior al umbral Lc 75 de lectura fluida.`,
      whyEn:
        "Legacy WCAG 2.1 4.5:1 math often misjudges thin modern fonts and dark surfaces; APCA models real human spatial-frequency legibility.",
      whyEs:
        "El ratio clásico WCAG 2.1 suele dar falsos aprobados en modo oscuro o pesos finos; APCA mide la legibilidad humana real según polaridad.",
      fixEn: `Promote primary ink to ${fixedInk} (${hexToOklchString(fixedInk)}) and cap supporting copy at ${fixedMuted} (|Lc| >= 65).`,
      fixEs: `Sube la tinta principal a ${fixedInk} (${hexToOklchString(fixedInk)}) y ajusta el texto secundario a ${fixedMuted} (|Lc| >= 65).`,
      codePatch: `:root {\n  --bg: ${bgHex};\n  --ink: ${fixedInk}; /* APCA |Lc| >= 90 */\n  --muted: ${fixedMuted}; /* APCA |Lc| >= 65 */\n}`,
    });
  }

  // 2. Anti-Slop Visual Warnings (Refactoring UI)
  if (xray.antiSlopAudit.warnings.length > 0) {
    const safeBg = mode === "dark" ? "#0b0c0e" : "#f4f4f1";
    const safeAccent = mode === "dark" ? "#e06d44" : "#141413";
    suggestions.push({
      id: "refactoring-anti-slop",
      severity: "critical",
      framework: "Refactoring UI",
      whatEn: `Detected generic AI-template signals: ${xray.antiSlopAudit.warnings.join(", ")}.`,
      whatEs: `Se han detectado patrones de plantilla genérica IA: ${xray.antiSlopAudit.warnings.join(", ")}.`,
      whyEn:
        "Neon purple-pink glows, numbered 01 // eyebrows, and generic buzzwords trigger immediate template fatigue and erode brand trust.",
      whyEs:
        "Los brillos púrpura-rosa, cejas falsas '01 //' y frases hechas destruyen la autoridad de marca en los primeros 3 segundos.",
      fixEn:
        "Enforce a 60-30-10 neutral surface palette, 1px subtle hairlines, and reserve chromatic accent strictly for the primary focal CTA.",
      fixEs:
        "Aplica la regla 60-30-10 con lienzo neutro, bordes sutiles de 1px y reserva el acento cromático únicamente para el CTA principal.",
      codePatch: `:root {\n  --bg: ${safeBg}; /* 60% calm canvas */\n  --line: ${
        mode === "dark" ? "rgba(255,255,255,0.09)" : "rgba(20,20,19,0.09)"
      }; /* 1px hairline */\n  --accent: ${safeAccent}; /* 10% single focal action */\n}`,
    });
  }

  // 3. Hero Clarity, Hick's Law & GoodUI CTA Audit
  const dom = xray.domSignals;
  if (dom) {
    if (dom.h1Count === 0 || dom.h1Count > 1) {
      suggestions.push({
        id: "hero-h1-clarity",
        severity: "high",
        framework: "GoodUI & Hick's Law",
        whatEn:
          dom.h1Count === 0
            ? "Missing semantic <h1> headline above the fold (fails the 5-Second Clarity Test)."
            : `Found ${dom.h1Count} competing <h1> elements diluting visual hierarchy.`,
        whatEs:
          dom.h1Count === 0
            ? "Falta un titular semántico <h1> en el primer pantallazo (falla el Test de los 5 Segundos)."
            : `Se han detectado ${dom.h1Count} etiquetas <h1> compitiendo por la jerarquía principal.`,
        whyEn:
          "Visitors decide within 5 seconds whether the product matches their intent; a single high-contrast <h1> anchors scanning.",
        whyEs:
          "El usuario decide en 5 segundos si entiende qué haces; un único <h1> nítido reduce la carga cognitiva al instante.",
        fixEn:
          "Keep exactly one <h1> stating the concrete outcome in <= 10 words, demoting section titles to <h2>.",
        fixEs:
          "Deja un único <h1> orientado al resultado concreto en <= 10 palabras y pasa el resto de bloques a <h2>.",
        codePatch: `<h1 style="font-size: clamp(2.25rem, 1.4rem + 2.8vw, 4.1rem); text-wrap: balance; line-height: 1.06;">\n  Concrete product outcome in plain language\n</h1>`,
      });
    }

    if (dom.vagueCtaLabels.length > 0 || dom.ctaCount > 18) {
      const badList =
        dom.vagueCtaLabels.length > 0
          ? ` ("${dom.vagueCtaLabels.join('", "')}")`
          : ` (${dom.ctaCount} interactive links/buttons)`;
      suggestions.push({
        id: "goodui-cta-hierarchy",
        severity: "high",
        framework: "GoodUI & Hick's Law",
        whatEn: `Action hierarchy dilution${badList}: vague microcopy or too many equal-weight actions.`,
        whatEs: `Dilución de llamada a la acción${badList}: verbos genéricos o exceso de botones con el mismo peso.`,
        whyEn:
          "Hick's Law & GoodUI A/B benchmarks show decision latency spikes when multiple CTAs compete or use non-benefit verbs like 'Submit' / 'Learn More'.",
        whyEs:
          "La Ley de Hick y los tests A/B de GoodUI demuestran que verbos vagos ('Enviar', 'Saber más') o varios botones primarios hunden la conversión.",
        fixEn:
          "Pair one solid high-contrast primary CTA (verb + concrete value) with at most one quiet ghost secondary link per viewport.",
        fixEs:
          "Usa un único botón primario sólido (verbo + beneficio concreto) acompañado como máximo de un enlace secundario discreto.",
        codePatch: `<div class="cta-row" style="display: inline-flex; gap: 0.75rem; align-items: center;">\n  <button type="submit" class="btn-primary">Start free audit →</button>\n  <a href="#proof" class="btn-ghost">Inspect live demo</a>\n</div>`,
      });
    }

    // 4. Baymard & Form UX
    if (dom.inputCount > 0 && dom.labelCount < dom.inputCount) {
      suggestions.push({
        id: "baymard-form-labels",
        severity: "high",
        framework: "Baymard & Form UX",
        whatEn: `Found ${dom.inputCount} form inputs but only ${dom.labelCount} explicit <label> elements.`,
        whatEs: `Hay ${dom.inputCount} campos de formulario pero solo ${dom.labelCount} etiquetas <label> explícitas.`,
        whyEn:
          "Relying on placeholder text alone hurts Baymard form completion rates, disappears on focus, and breaks screen-reader navigation.",
        whyEs:
          "Usar solo 'placeholder' borra el contexto al escribir, dispara errores en móvil y rompe la accesibilidad según Baymard.",
        fixEn:
          "Pair every input with a visible <label for='...'> above the field and defer validation styling with CSS :user-invalid.",
        fixEs:
          "Asocia cada campo con un <label for='...'> visible encima y aplica errores solo tras interactuar mediante :user-invalid.",
        codePatch: `<label for="work-email">Work email</label>\n<input id="work-email" name="email" type="email" autocomplete="email" required />\n<style>\n  input:user-invalid { border-color: #d93025; }\n</style>`,
      });
    }

    // 5. Checklist.design Completeness (Landmarks & OG Preview)
    if (!dom.hasOgImage || !dom.hasMainLandmark || !dom.hasLangAttr) {
      const missing: string[] = [];
      if (!dom.hasOgImage) missing.push("og:image social card");
      if (!dom.hasMainLandmark) missing.push("<main> landmark");
      if (!dom.hasLangAttr) missing.push("<html lang>");
      suggestions.push({
        id: "checklist-completeness",
        severity: "opportunity",
        framework: "Checklist.design",
        whatEn: `Missing baseline page completeness elements: ${missing.join(", ")}.`,
        whatEs: `Faltan piezas clave de completitud anatómica: ${missing.join(", ")}.`,
        whyEn:
          "Checklist.design standards require social graph previews for link trust in Slack/X and <main>/<html lang> for assistive tech.",
        whyEs:
          "Sin og:image los enlaces compartidos pierden clicabilidad y sin <main> o lang se degrada la indexación y lectura asistida.",
        fixEn: "Add explicit OpenGraph image metadata, <html lang>, and wrap primary content in <main id='main'>.",
        fixEs: "Añade metadatos og:image de 1200×630, atributo lang en <html> y envuelve el contenido principal en <main>.",
        codePatch: `<meta property="og:image" content="https://${xray.hostname}/og.png" />\n<meta name="twitter:card" content="summary_large_image" />`,
      });
    }
  }

  // 6. Practical Typography, OpenType, Zero-CLS & WCAG 1.4.4 Reflow
  const mod = xray.layers.layout.modernPlatform;
  const unsafeClamps = xray.cssHygiene?.unsafeZoomClamps || [];
  if (
    unsafeClamps.length > 0 ||
    !mod.tabularNums ||
    !mod.fontSizeAdjust ||
    (xray.layers.typography.openTypeFeatures || []).length === 0
  ) {
    const unsafeNote =
      unsafeClamps.length > 0
        ? `Unsafe fluid scale ${unsafeClamps[0].expression} (${unsafeClamps[0].ratio}x > 2.5x WCAG 1.4.4 limit)`
        : "Missing zero-CLS font-size-adjust, tabular-nums, or OpenType stylistic features";
    const unsafeNoteEs =
      unsafeClamps.length > 0
        ? `Escala fluida insegura ${unsafeClamps[0].expression} (${unsafeClamps[0].ratio}x supera el máximo 2.5x de WCAG 1.4.4)`
        : "Faltan font-size-adjust anti-CLS, números tabulares o rasgos OpenType";

    suggestions.push({
      id: "practical-typography-precision",
      severity: unsafeClamps.length > 0 ? "high" : "opportunity",
      framework: "Practical Typography & WCAG 1.4.4",
      whatEn: `${unsafeNote} on ${xray.layers.typography.primaryFont}.`,
      whatEs: `${unsafeNoteEs} sobre la familia ${xray.layers.typography.primaryFont}.`,
      whyEn:
        "Capping clamp() max <= 2.5x min preserves 200% browser zoom; font-size-adjust: from-font prevents font-swap CLS; tabular-nums aligns metrics.",
      whyEs:
        "Mantener clamp() <= 2.5x permite el zoom 200% accesible; font-size-adjust evita saltos CLS y tabular-nums alinea cifras y precios.",
      fixEn:
        "Apply Utopia-grade fluid clamp(), 65ch prose measure, font-size-adjust: from-font, and OpenType stylistic sets.",
      fixEs:
        "Aplica clamp() armónico (<= 2.5x), ancho de lectura de 65ch, font-size-adjust: from-font y rasgos OpenType.",
      codePatch: `body {\n  font-size-adjust: from-font;\n  font-feature-settings: "ss01" 1, "cv02" 1;\n}\nh1 {\n  font-size: clamp(2.1rem, 1.35rem + 2.6vw, 4.2rem); /* 2.0x <= 2.5x */\n  text-wrap: balance;\n}\np { max-width: 65ch; text-wrap: pretty; }\n.metric, td { font-variant-numeric: tabular-nums; }`,
    });
  }

  // 7. Project Wallace CSS Hygiene & GPU Compositor Audit
  const css = xray.cssHygiene;
  if (
    css &&
    (css.importantCount > 8 ||
      css.hasLayoutThrashTransition ||
      !css.hasFocusVisible ||
      !xray.layers.motion.honorsReducedMotion ||
      (cwv?.cls && parseFloat(cwv.cls) > 0.05))
  ) {
    const issuesEn: string[] = [];
    const issuesEs: string[] = [];
    if (css.importantCount > 8) {
      issuesEn.push(`${css.importantCount} !important overrides`);
      issuesEs.push(`${css.importantCount} reglas !important`);
    }
    if (css.hasLayoutThrashTransition) {
      issuesEn.push("non-GPU 'transition: all' / layout keyframes");
      issuesEs.push("animaciones fuera de GPU ('transition: all' / layout)");
    }
    if (!css.hasFocusVisible) {
      issuesEn.push("missing :focus-visible ring");
      issuesEs.push("sin anillo :focus-visible de teclado");
    }
    if (!xray.layers.motion.honorsReducedMotion) {
      issuesEn.push("missing prefers-reduced-motion guard");
      issuesEs.push("sin @media (prefers-reduced-motion)");
    }

    suggestions.push({
      id: "wallace-css-gpu-hygiene",
      severity: css.hasLayoutThrashTransition ? "high" : "opportunity",
      framework: "Project Wallace & GPU",
      whatEn: `Stylesheet & compositor debt: ${issuesEn.join(", ") || "CLS instability"}.`,
      whatEs: `Deuda técnica en CSS y compositor: ${issuesEs.join(", ") || "inestabilidad CLS"}.`,
      whyEn:
        "Animating layout properties or transition: all triggers main-thread paint storms; missing :focus-visible and reduced-motion breaks accessibility.",
      whyEs:
        "Usar 'transition: all' recalcula el layout en cada fotograma; omitir :focus-visible y reduced-motion penaliza teclado y salud visual.",
      fixEn:
        "Restrict transitions strictly to transform and opacity with snappy out-expo easing, add :focus-visible, and honor prefers-reduced-motion.",
      fixEs:
        "Limita las transiciones a transform y opacity en GPU, añade :focus-visible nítido y respeta prefers-reduced-motion.",
      codePatch: `.interactive {\n  transition: transform 160ms cubic-bezier(0.22, 1, 0.36, 1), opacity 160ms ease;\n}\n:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 3px;\n}\n@media (prefers-reduced-motion: reduce) {\n  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }\n}`,
    });
  }

  // Rosetta Font Twin Resolution
  const rosettaFontTwins: RosettaFontTwin[] = xray.layers.typography.rosettaMatches || [];
  const primaryLower = xray.layers.typography.primaryFont.toLowerCase();
  const isOverusedDefault = /\b(inter|roboto|arial|open sans|poppins|montserrat|lato|helvetica|system-ui|sans-serif)\b/i.test(
    primaryLower
  );

  const matchedPairingFromRosetta = rosettaFontTwins[0]
    ? TYPOGRAPHY_PAIRINGS.find((p) => p.id === rosettaFontTwins[0].pairingId)
    : undefined;

  const fallbackPairingId =
    mode === "dark"
      ? "pair-uncut-commit"
      : /shop|coffee|studio|gallery|fashion|brand|wine|hotel/i.test(`${xray.title} ${xray.description}`)
      ? "pair-boska-generalsans"
      : "pair-newsreader-geist";

  const selectedPairing =
    matchedPairingFromRosetta ||
    TYPOGRAPHY_PAIRINGS.find((p) => p.id === fallbackPairingId) ||
    TYPOGRAPHY_PAIRINGS[0];

  const recommendedFontPairing = {
    id: selectedPairing.id,
    name: selectedPairing.name,
    foundry: selectedPairing.foundry,
    reasonEn: rosettaFontTwins[0]
      ? `Detected commercial ${rosettaFontTwins[0].commercial} → legal 1:1 open-source twin with matching optical proportions.`
      : isOverusedDefault
      ? `Replaces overused ${xray.layers.typography.primaryFont} with high-character ${selectedPairing.foundry} typography.`
      : `Complements ${xray.hostname}'s ${mode} aesthetic with zero-license-friction variable & OpenType metrics.`,
    reasonEs: rosettaFontTwins[0]
      ? `Detectada la fuente comercial ${rosettaFontTwins[0].commercial} → gemelo libre legal 1:1 con proporciones ópticas equivalentes.`
      : isOverusedDefault
      ? `Sustituye la fuente genérica ${xray.layers.typography.primaryFont} por una tríada ${selectedPairing.foundry} con personalidad propia.`
      : `Potencia la estética ${mode === "dark" ? "oscura" : "clara"} de ${xray.hostname} con métricas variables y rasgos OpenType libres.`,
    openTypeFeatures: selectedPairing.openTypeFeatures,
    cssImport: selectedPairing.cssImport,
  };

  // Compute Overall Health Score combining Craft, APCA, DOM UX & CWV
  let penalty = 0;
  for (const s of suggestions) {
    penalty += s.severity === "critical" ? 14 : s.severity === "high" ? 8 : 4;
  }
  const cwvPerf = cwv?.performanceScore ?? xray.craftScore;
  const rawComposite = Math.round(xray.craftScore * 0.65 + cwvPerf * 0.35 - penalty * 0.35);
  const overallHealthScore = Math.max(18, Math.min(99, rawComposite));
  const grade: WebDoctorDiagnosis["grade"] =
    overallHealthScore >= 90
      ? "A+"
      : overallHealthScore >= 80
      ? "A"
      : overallHealthScore >= 68
      ? "B"
      : overallHealthScore >= 52
      ? "C"
      : "D";

  const recommendedStudioPreset: DoctorStudioPreset =
    mode === "dark"
      ? {
          idea: `High-craft redesign of ${xray.hostname} (${xray.title}) — dark halftone precision, APCA Lc >= 90 contrast, single focal CTA, and tabular telemetry`,
          surfaceId: "resizes-infra",
          paletteId: "pal-carbon-halftone",
          fontPairingId: selectedPairing.id,
          layoutId: "pdepablo-studio",
          motionId: "linear-precision",
        }
      : {
          idea: `High-craft redesign of ${xray.hostname} (${xray.title}) — warm editorial stone surface, APCA Lc >= 90 contrast, clear 5-second H1, and asymmetric bento`,
          surfaceId: "treg-gateway",
          paletteId: "pal-stone-terracotta",
          fontPairingId: selectedPairing.id,
          layoutId: "treg-gateway",
          motionId: "rauno-craft",
        };

  const markdownPatch = `# FORMA DOCTOR — Website Upgrade Plan (${xray.hostname})
> Audited URL: ${xray.url}
> Overall Health Score: **${overallHealthScore}/100 (${grade})** · Craft Score: **${xray.craftScore}/100** · Perceptual Contrast: **APCA Lc ${bodyLcSigned} (${bodyStatus})**

## Recommended Typography Upgrade (${recommendedFontPairing.foundry})
- **Triad:** **${recommendedFontPairing.name}** (\`${recommendedFontPairing.id}\`)
- **Rationale:** ${recommendedFontPairing.reasonEn}
- **Stylesheet:** \`${recommendedFontPairing.cssImport}\`${
    recommendedFontPairing.openTypeFeatures
      ? `\n- **OpenType Features:** \`font-feature-settings: ${recommendedFontPairing.openTypeFeatures};\``
      : ""
  }

## Actionable Improvements (What → Why → Exact Fix)
${
  suggestions.length === 0
    ? "- No critical regressions detected. Keep enforcing `font-size-adjust: from-font`, `tabular-nums`, and GPU-only transitions."
    : suggestions
        .map(
          (s, i) => `### ${i + 1}. [${s.severity.toUpperCase()} · ${s.framework}] ${s.whatEn}
- **Why it matters:** ${s.whyEn}
- **How to fix:** ${s.fixEn}
\`\`\`css
${s.codePatch}
\`\`\``
        )
        .join("\n\n")
}
`;

  return {
    overallHealthScore,
    grade,
    apca: {
      bodyLcSigned,
      bodyLcAbs,
      bodyStatus,
      accentLcAbs,
    },
    rosettaFontTwins,
    recommendedFontPairing,
    suggestions,
    recommendedStudioPreset,
    markdownPatch,
  };
}
