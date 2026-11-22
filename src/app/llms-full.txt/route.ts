import { NextResponse } from "next/server";
import {
  CURATED_COLOR_PALETTES,
  getContrastRatio,
  hexToOklchString,
} from "@/data/color-palettes";
import {
  CRAFT_TOOLS_AND_ASSETS,
  RARE_COMPONENTS,
  TYPOGRAPHY_PAIRINGS,
} from "@/data/compendium";
import { GLOBAL_UNSLOP_RULES, WEB_FORMATS } from "@/data/formats";
import { GLOBAL_DESIGN_DIRECTORIES } from "@/data/world-references";
import { composeFormatGenome } from "@/lib/composer";
import { getSectionVaultFeed } from "@/lib/section-vault";
import { recordTelemetryEvent } from "@/lib/telemetry";

export async function GET(request: Request) {
  void recordTelemetryEvent({
    event: "agent_llms_txt",
    request,
    target: "/llms-full.txt",
  });

  const origin = new URL(request.url).origin;
  const vault = getSectionVaultFeed();
  const sampleGenome = composeFormatGenome({
    surfaceId: "treg-gateway",
    typographyId: "resizes-infra",
    layoutId: "pdepablo-studio",
    componentsId: "twentyfirst-craft",
    motionId: "rauno-craft",
    paletteId: "pal-stone-terracotta",
    fontPairingId: "pair-newsreader-geist",
    projectName: "ReferenceApp",
    projectBrief: "High-craft web application engineered with human restraint.",
  });

  const content = `# forma (${origin}) — Complete Inline Specification (/llms-full.txt)
> OpenRouter for Web Design. Full single-pass context bundle for high-context coding agents (Claude Code, Cursor, Codex, Antigravity, Gemini).
> Compact routing index: ${origin}/llms.txt | Streamable HTTP MCP: ${origin}/api/mcp

---

## 1. Curated 60-30-10 Perceptual OKLCH Color Systems (${CURATED_COLOR_PALETTES.length})
${CURATED_COLOR_PALETTES.map(
  (p) =>
    `### \`${p.id}\` — ${p.name} (${p.mode} · ${p.harmony} · ${getContrastRatio(
      p.tokens.bg,
      p.tokens.ink
    )}:1 WCAG)
- Inspired by: ${p.inspiredBy.name} (${p.inspiredBy.url})
- Psychology: ${p.psychology}
- Tokens: \`--bg: ${p.tokens.bg}\` (${hexToOklchString(p.tokens.bg)}) · \`--surface: ${p.tokens.surface}\` · \`--panel: ${p.tokens.panel}\` · \`--ink: ${p.tokens.ink}\` · \`--muted: ${p.tokens.muted}\` · \`--accent: ${p.tokens.accent}\` (${hexToOklchString(p.tokens.accent)})`
).join("\n\n")}

---

## 2. World-Class Typography Pairings & Foundry CDNs (${TYPOGRAPHY_PAIRINGS.length})
${TYPOGRAPHY_PAIRINGS.map(
  (tp) =>
    `### \`${tp.id}\` — ${tp.name} (${tp.foundry})
- Vibe: ${tp.vibe}${tp.commercialEquivalent ? `\n- Open-Source Twin For: ${tp.commercialEquivalent}` : ""}${tp.openTypeFeatures ? `\n- OpenType Features: \`font-feature-settings: ${tp.openTypeFeatures};\`` : ""}
- Stacks: Display \`${tp.displayStack}\` (\`${tp.h1Scale}\`, tracking \`${tp.h1Tracking}\`) | Body \`${tp.bodyStack}\` | Mono \`${tp.monoStack}\`
- CSS Import: \`@import url('${tp.cssImport}');\``
).join("\n\n")}

---

## 3. Composable 5-Layer Web Formats (${WEB_FORMATS.length})
${WEB_FORMATS.map(
  (f) =>
    `### \`${f.id}\` [${f.shortCode}] — ${f.name} (${f.surface.mode} · ${f.category})
- Tagline: ${f.tagline}
- Replaces Slop: ${f.replacesSlop}
- Surface: bg \`${f.surface.bg}\`, ink \`${f.surface.ink}\`, accent \`${f.surface.accent}\`, radius \`${f.surface.radiusCard}\`
- Layout: max-width \`${f.layout.maxWidth}\`, nav \`${f.layout.navStyle}\`, hero \`${f.layout.heroLayout}\`
- Motion: \`${f.motion.easing}\` (${f.motion.feel}) — ${f.motion.durationScale}`
).join("\n\n")}

---

## 4. Interactive Registry Primitives (${RARE_COMPONENTS.length})
${RARE_COMPONENTS.map(
  (c) =>
    `- **${c.name}** (\`${c.id}\` · ${c.provider}): \`${c.cliInstall}\` — ${c.description}`
).join("\n")}

---

## 5. Craft Shaders, Icons & Color Tools (${CRAFT_TOOLS_AND_ASSETS.length})
${CRAFT_TOOLS_AND_ASSETS.map(
  (a) => `- **${a.name}** (${a.kind} · ${a.url}): \`${a.installOrUsage}\` — ${a.whyUseIt}`
).join("\n")}

---

## 6. Deterministic Structural CSS + HTML/TSX Scaffolds (01 Nav -> 06 Footer)
${sampleGenome.structuralSkeletonsMd}

---

## 7. Top Playwright + Vision Section DOM Blueprints (${vault.totalSections} Total — Query /api/sections for more)
${vault.sections
  .slice(0, 10)
  .map(
    (s) =>
      `### \`${s.id}\` (${s.kind} · ${s.hostname} · ${s.computedSpec.mode})
- Archetype: ${s.vision.archetype}
- Layout: ${s.vision.layoutMechanics}
- Recreation Prompt: ${s.vision.agentRecreationPrompt}
\`\`\`html
${s.cleanDom}
\`\`\``
  )
  .join("\n\n")}

---

## 8. Global Design Directories Indexed (${GLOBAL_DESIGN_DIRECTORIES.length})
${GLOBAL_DESIGN_DIRECTORIES.map((d) => `- [${d.name}](${d.url}) (${d.category})`).join("\n")}

---

## 9. Mandatory Subtractive Anti-Slop Checklist (unslop-ui)
${GLOBAL_UNSLOP_RULES.map((r) => `- [ ] ${r}`).join("\n")}
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
