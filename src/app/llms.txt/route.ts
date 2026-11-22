import { NextResponse } from "next/server";
import { CURATED_COLOR_PALETTES, getContrastRatio } from "@/data/color-palettes";
import { RARE_COMPONENTS, TYPOGRAPHY_PAIRINGS } from "@/data/compendium";
import { WEB_FORMATS } from "@/data/formats";
import { GLOBAL_DESIGN_DIRECTORIES } from "@/data/world-references";
import discoveredFeed from "@/data/discovered-feed.json";
import { getSectionVaultFeed } from "@/lib/section-vault";
import { recordTelemetryEvent } from "@/lib/telemetry";

export async function GET(request: Request) {
  void recordTelemetryEvent({ event: "agent_llms_txt", request, target: "/llms.txt" });
  const origin = new URL(request.url).origin;
  const vault = getSectionVaultFeed();

  const content = `# forma (${origin})
> OpenRouter for Web Design. 5-layer composable Design DNA (60-30-10 OKLCH Color Science, Fontshare & Google Typography, Layout Skeletons, Interactive Primitives, Motion Physics), live URL X-Ray scraping (\`forma-xray\`), Playwright + Vision Section Blueprints, and \`unslop-ui\` guardrails.

Catalog: ${WEB_FORMATS.length} composable formats · ${vault.totalSections} Playwright + Vision section blueprints · ${CURATED_COLOR_PALETTES.length} WCAG/OKLCH color systems · ${TYPOGRAPHY_PAIRINGS.length} foundry typography pairings · ${RARE_COMPONENTS.length} interactive components · ${GLOBAL_DESIGN_DIRECTORIES.length} design directories · ${discoveredFeed.sites.length} live-scraped websites.

Full single-file inline specification (all tokens, font @imports, and 6 HTML/CSS skeletons): ${origin}/llms-full.txt

---

## 1. Fastest Agent Workflows (Zero Auth Required)

### A. Compose a 5-Layer DESIGN.md from a Project Brief:
\`\`\`sh
curl -fsSL -G "${origin}/api/compose" \\
  --data-urlencode "brief=dark kubernetes platform like resiz.es with swiss dock and spring physics" \\
  --data-urlencode "project=Acme" \\
  --data-urlencode "format=markdown" > DESIGN.md
\`\`\`

### B. Live X-Ray Any Public URL (Extract CSS Tokens, Fonts & Animations):
\`\`\`sh
curl -fsSL -G "${origin}/api/scrape" --data-urlencode "url=https://linear.app"
\`\`\`

### C. Query the Continuous Discovery Radar (Live Scraped Top Designs):
\`\`\`sh
curl -fsSL "${origin}/api/discover?minScore=90"
\`\`\`

### D. Query Real Playwright + Vision Section Blueprints & Clean DOM Skeletons:
\`\`\`sh
curl -fsSL "${origin}/api/sections?kind=pricing&limit=6"
curl -fsSL "${origin}/api/sections?kind=hero&mode=dark"
\`\`\`

### E. 1-Command shadcn Registry Block + Figma W3C Design Tokens + Live SVGL/Iconify Vectors:
\`\`\`sh
# Install complete 5-layer DESIGN.md + OKLCH cssVars + TSX scaffold via shadcn CLI:
npx shadcn@latest add "${origin}/r/forma-kit?surface=resizes-infra&palette=pal-carbon-halftone&font=pair-cabinet-satoshi"

# Export W3C Design Tokens (DTCG JSON for Figma Variables / Tokens Studio):
curl -fsSL "${origin}/api/tokens?surface=treg-gateway&palette=pal-stone-terracotta" > tokens.dtcg.json

# Fetch official SVGL brand logos or curated Phosphor/Tabler/Iconoir raw <svg> vectors:
curl -fsSL "${origin}/api/assets?kind=logos&q=stripe&inline=true"
curl -fsSL "${origin}/api/assets?kind=icons&q=terminal&set=ph"

# Unified forma-xray Craft + Google PageSpeed Insights v5 CWV Audit:
curl -fsSL "${origin}/api/audit?url=https://resiz.es"
\`\`\`

### E. Prepaid Cloud Credits & $0.00 BYOK Gateway (treg.to Model):
- All catalog & \`/api/compose\` routes are **$0.00 (free-protocol)**.
- Cloud Playwright + Vision execution (\`POST /api/sections\`, \`POST /api/cloud\`) starts with **$1.00 free credit** (\`X-Forma-Key\`), supports \`X-Forma-Max-Cost\` safety caps, and runs at **$0.00 unmetered** whenever you pass \`X-Gemini-Key\`:
\`\`\`sh
npx forma-xray balance --endpoint ${origin}
npx forma-xray topup 5 --endpoint ${origin}

# Cloud Brand Kit ($0.08 or $0.00 with X-Gemini-Key):
curl -fsSL -X POST "${origin}/api/cloud" \\
  -H "X-Forma-Key: sk-forma-live-starter-100" \\
  -H "Content-Type: application/json" \\
  -d '{"tool":"generate_brand_kit","projectName":"Vektor","projectBrief":"Dark Kubernetes FinOps platform"}'
\`\`\`

---

## 2. Connect via MCP (${origin}/api/mcp)

\`\`\`sh
claude mcp add --transport http forma ${origin}/api/mcp
\`\`\`

MCP Tools:
- \`list_web_formats\` — Search ${WEB_FORMATS.length} curated 5-layer formats.
- \`recommend_format_mix\` — Auto-select Surface + Typography + Layout + Components + Motion for a brief.
- \`compose_design_spec\` — Compile a complete \`DESIGN.md\` with 6 deterministic CSS + HTML/TSX structural skeletons.
- \`get_structural_skeletons\` — Fetch pure architectural CSS Grid, \`@container\`, and semantic DOM scaffolds (\`01 Nav\` through \`06 Footer\`) so the LLM never guesses layout geometry.
- \`xray_live_website\` — Scrape & extract tokens + animation curves from any live URL.
- \`list_discovered_designs\` — Browse continuously scraped sites ranked by Anti-Slop Craft Score.
- \`search_section_blueprints\` — Query ${vault.totalSections} Playwright + Vision section crops (\`hero\`, \`navbar\`, \`bento-features\`, \`pricing\`, \`cta-footer\`) with Clean Semantic DOM trees & recreation prompts.
- \`list_color_palettes\` — Query ${CURATED_COLOR_PALETTES.length} curated 60-30-10 UI color systems (Radix Colors, Sanzo Wada, Happy Hues, Realtime Colors, Atmos OKLCH) with verified WCAG contrast ratios.
- \`suggest_website_improvements\` — Run Forma Doctor on any live URL (APCA-W3 perceptual contrast, Rosetta commercial-to-open-source font twins, GoodUI/Hick's Law CTA conversion, Baymard form UX, Project Wallace CSS/GPU patches).
- \`get_unslop_checklist\` — Mandatory subtractive UI audit rules.

---

## 3. Curated 60-30-10 Color Palette IDs (${CURATED_COLOR_PALETTES.length})
${CURATED_COLOR_PALETTES.map(
  (p) =>
    `- \`${p.id}\` (${p.mode} · ${p.harmony} · ${getContrastRatio(p.tokens.bg, p.tokens.ink)}:1 WCAG): ${p.name} — ${p.psychology}`
).join("\n")}

---

## 4. Curated Foundry Typography Pairing IDs (${TYPOGRAPHY_PAIRINGS.length})
Pass \`--data-urlencode "font=<id>"\` to \`/api/compose\` or \`fontPairingId\` to MCP \`compose_design_spec\`:
${TYPOGRAPHY_PAIRINGS.map(
  (tp) => `- \`${tp.id}\` (${tp.foundry}): ${tp.name} — ${tp.vibe}`
).join("\n")}

---

## 5. Available Curated Format IDs (${WEB_FORMATS.length})
${WEB_FORMATS.map(
  (f) => `- \`${f.id}\` (${f.surface.mode} · ${f.category} · motion: \`${f.motion.easing}\`): ${f.name} — ${f.tagline}`
).join("\n")}
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
