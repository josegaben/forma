import { NextResponse } from "next/server";
import { WEB_FORMATS, REFERENCE_SOURCES } from "@/data/formats";
import discoveredFeed from "@/data/discovered-feed.json";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;

  const content = `# forma (${origin})
> OpenRouter for agentic web formats. 5-layer composable Design DNA (Surface, Typography, Layout, Primitives, Motion Physics), live URL X-Ray scraping (\`forma-xray\`), and \`unslop-ui\` guardrails.

Catalog: ${WEB_FORMATS.length} composable formats · ${REFERENCE_SOURCES.length} reference canons · ${discoveredFeed.sites.length} continuously scraped live websites.

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

---

## 2. Connect via MCP (${origin}/api/mcp)

\`\`\`sh
claude mcp add --transport http forma ${origin}/api/mcp
\`\`\`

MCP Tools:
- \`list_web_formats\` — Search ${WEB_FORMATS.length} curated 5-layer formats.
- \`recommend_format_mix\` — Auto-select Surface + Typography + Layout + Components + Motion for a brief.
- \`compose_design_spec\` — Compile a complete \`DESIGN.md\`.
- \`xray_live_website\` — Scrape & extract tokens + animation curves from any live URL.
- \`list_discovered_designs\` — Browse continuously scraped sites ranked by Anti-Slop Craft Score.
- \`get_unslop_checklist\` — Mandatory subtractive UI audit rules.

---

## 3. Available Curated Format IDs (${WEB_FORMATS.length})
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
