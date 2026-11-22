import rawVault from "@/data/section-vault.json";

export type SectionKind =
  | "navbar"
  | "hero"
  | "bento-features"
  | "pricing"
  | "cta-footer";

export interface SectionComputedSpec {
  mode: "light" | "dark";
  bg: string;
  ink: string;
  accent: string;
  borderColor: string;
  width: number;
  height: number;
  layoutMode: "grid" | "flex" | "block";
  gridColumns: string | null;
  gap: string;
  padding: string;
  maxWidth: string;
  radiusSample: string;
  headlineFont: string;
  headlineSize: string;
  headlineTracking: string;
  backdropFilter: string;
  childCardCount: number;
  ctaTexts: string[];
  activeAnimations: {
    name: string;
    duration: number;
    easing: string;
  }[];
}

export interface SectionVisionSpec {
  archetype: string;
  summary: string;
  layoutMechanics: string;
  microDetails: string[];
  agentRecreationPrompt: string;
  visualCraftScore: number;
  analysisEngine: string;
}

export interface VisualSectionItem {
  id: string;
  siteUrl: string;
  pageUrl: string;
  hostname: string;
  siteTitle: string;
  kind: SectionKind;
  capturedAt: string;
  screenshotUrl: string;
  dimensions: { width: number; height: number };
  computedSpec: SectionComputedSpec;
  cleanDom: string;
  vision: SectionVisionSpec;
  tags: string[];
}

export interface SectionVaultFeed {
  lastVisualScanAt: string;
  visionEngine: string;
  totalSections: number;
  countsByKind: Record<string, number>;
  sections: VisualSectionItem[];
}

export const SECTION_KIND_LABELS: Record<
  SectionKind,
  { en: string; es: string; badge: string }
> = {
  hero: { en: "Heros", es: "Heros", badge: "HERO" },
  navbar: { en: "Navbars", es: "Navbars", badge: "NAVBAR" },
  "bento-features": {
    en: "Bento & Features",
    es: "Bento y Features",
    badge: "BENTO",
  },
  pricing: {
    en: "Pricing Tables",
    es: "Tablas de Precios",
    badge: "PRICING",
  },
  "cta-footer": {
    en: "Footers & CTAs",
    es: "Footers y CTAs",
    badge: "FOOTER",
  },
};

export function getSectionVaultFeed(): SectionVaultFeed {
  return rawVault as unknown as SectionVaultFeed;
}

export function getAllVaultSections(): VisualSectionItem[] {
  const feed = getSectionVaultFeed();
  return Array.isArray(feed.sections) ? feed.sections : [];
}

export function filterVaultSections(options: {
  kind?: SectionKind | "all";
  query?: string;
  mode?: "light" | "dark" | "all";
  limit?: number;
}): VisualSectionItem[] {
  const { kind = "all", query = "", mode = "all", limit = 60 } = options;
  const q = query.trim().toLowerCase();

  return getAllVaultSections()
    .filter((sec) => {
      if (kind !== "all" && sec.kind !== kind) return false;
      if (mode !== "all" && sec.computedSpec.mode !== mode) return false;
      if (!q) return true;
      const hay = `${sec.hostname} ${sec.siteTitle} ${sec.kind} ${sec.vision.archetype} ${sec.vision.summary} ${sec.tags.join(" ")} ${sec.computedSpec.headlineFont}`.toLowerCase();
      return q.split(/\s+/).every((tok) => hay.includes(tok));
    })
    .slice(0, limit);
}

/**
 * Recommends a matched set of real-world rendered sections (Hero + Navbar + Bento/Features + Pricing)
 * tailored to the user's project brief and light/dark surface mode.
 */
export function recommendSectionsForIdea(
  idea: string,
  preferredMode?: "light" | "dark"
): VisualSectionItem[] {
  const all = getAllVaultSections();
  if (all.length === 0) return [];

  const q = idea.trim().toLowerCase();
  const tokens = q.split(/[^a-z0-9áéíóúñ]+/i).filter((t) => t.length >= 3);

  const scoreSection = (sec: VisualSectionItem): number => {
    let score = sec.vision.visualCraftScore || 85;
    if (preferredMode && sec.computedSpec.mode === preferredMode) {
      score += 14;
    }
    const hay = `${sec.hostname} ${sec.siteTitle} ${sec.vision.archetype} ${sec.vision.summary} ${sec.tags.join(" ")} ${sec.cleanDom.slice(0, 600)}`.toLowerCase();
    for (const tok of tokens) {
      if (hay.includes(tok)) score += 12;
    }
    if (/agent|mcp|ai|ia|cli|sdk|code|dev/.test(q) && sec.tags.includes("ai-agents")) {
      score += 10;
    }
    if (/fintech|bank|pay|invoice|finance|pricing|saas/.test(q) && sec.tags.includes("fintech-saas")) {
      score += 10;
    }
    if (/doc|knowledge|api|guide/.test(q) && sec.tags.includes("docs")) {
      score += 12;
    }
    if (/schedule|clinic|medical|book|calendar|team/.test(q) && sec.hostname.includes("cal.com")) {
      score += 16;
    }
    return score;
  };

  const targetKinds: SectionKind[] = ["navbar", "hero", "bento-features", "pricing"];
  const picked: VisualSectionItem[] = [];

  for (const k of targetKinds) {
    const best = all
      .filter((s) => s.kind === k)
      .sort((a, b) => scoreSection(b) - scoreSection(a))[0];
    if (best) picked.push(best);
  }

  return picked;
}

export function buildSectionBlueprintsMarkdown(
  sections: VisualSectionItem[]
): string {
  if (!sections || sections.length === 0) return "";

  return `\n---\n\n## 8. Real-World Visual Section Blueprints & Clean DOM Skeletons (Playwright + Vision Vault)\n> Extracted from live client-rendered DOM + computed styles so your AI builds proven spatial architectures instead of generic templates.\n\n${sections
    .map(
      (sec) => `### [${SECTION_KIND_LABELS[sec.kind].badge}] ${sec.vision.archetype} — *(${sec.hostname})*
- **Source Reference:** ${sec.pageUrl} · **Craft Score:** ${sec.vision.visualCraftScore}/100
- **Layout Mechanics:** ${sec.vision.layoutMechanics}
- **Computed Tokens:** \`mode: ${sec.computedSpec.mode}\` · \`bg: ${sec.computedSpec.bg}\` · \`ink: ${sec.computedSpec.ink}\` · \`font: ${sec.computedSpec.headlineFont} (${sec.computedSpec.headlineSize}, tracking ${sec.computedSpec.headlineTracking})\`
- **Tactile Micro-Details:**
${sec.vision.microDetails.map((d) => `  - ${d}`).join("\n")}
- **Agent Recreation Directive:** ${sec.vision.agentRecreationPrompt}

\`\`\`html
<!-- Clean Semantic DOM Blueprint (${sec.hostname} · ${sec.kind}) -->
${sec.cleanDom.split("\n").slice(0, 28).join("\n")}
\`\`\``
    )
    .join("\n\n")}\n`;
}
