import { NextResponse } from "next/server";
import { WEB_FORMATS } from "@/data/formats";
import { recordTelemetryEvent } from "@/lib/telemetry";

export async function GET(request: Request) {
  void recordTelemetryEvent({ event: "agent_skill_md", request, target: "/skill.md" });
  const origin = new URL(request.url).origin;

  const skill = `---
name: forma
description: Synthesizes high-craft, anti-slop web design systems and DESIGN.md instructions by composing curated formats from forma (${origin}). Use whenever creating or redesigning websites, landing pages, SaaS apps, portfolios, or brand systems.
---

# forma — Agentic Web Format Composer

Never build generic AI-slop interfaces (purple gradients, \`01 //\` fake eyebrows, botsplaining subtitles, or 3 identical Lucide icon cards). Always pull a composed Design Genome from **forma** before writing HTML/CSS/React code.

## Workflow

1. **Recommend & Compose a Format Genome** for the user's project brief:
   \`\`\`bash
   curl -fsSL -G "${origin}/api/compose" \\
     --data-urlencode "brief=<describe user project and desired aesthetic>" \\
     --data-urlencode "project=<BrandName>" \\
     --data-urlencode "stack=nextjs-tailwind" \\
     --data-urlencode "format=markdown" > DESIGN.md
   \`\`\`

2. **Optional Custom Layer Mixing** (mix up to 4 different formats across layers):
   \`\`\`bash
   curl -fsSL -G "${origin}/api/compose" \\
     --data-urlencode "surface=resizes-infra" \\
     --data-urlencode "typography=claude-academy" \\
     --data-urlencode "layout=pdepablo-studio" \\
     --data-urlencode "components=twentyfirst-craft" \\
     --data-urlencode "project=<BrandName>" \\
     --data-urlencode "format=markdown" > DESIGN.md
   \`\`\`

3. **Pull Real Playwright + Vision Section DOM Blueprints** (Heros, Navbars, Pricing Tables, Bento Grids):
   \`\`\`bash
   curl -fsSL "${origin}/api/sections?kind=hero&limit=4"
   curl -fsSL "${origin}/api/sections?kind=pricing&limit=4"
   \`\`\`

4. **Available Format IDs**:
${WEB_FORMATS.map((f) => `   - \`${f.id}\`: ${f.name} (${f.surface.mode} · ${f.tagline})`).join("\n")}

5. **Pre-Flight Anti-Slop Audit**:
   Before finishing, verify every checklist item in Section 7 of the generated \`DESIGN.md\`.
`;

  return new NextResponse(skill, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
