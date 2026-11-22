---
name: forma
description: OpenRouter for Web Design. Synthesizes 5-layer DESIGN.md specifications — 60-30-10 perceptual OKLCH palettes, Fontshare & Google variable typography pairings, 6 deterministic CSS/HTML/TSX structural skeletons, Playwright + Vision Clean DOM section blueprints, and unslop-ui guardrails — before building any frontend UI.
---

# forma (`forma.to`) — Agentic Web Design Router Skill

Activate `forma` **before** scaffolding or redesigning any landing page, SaaS marketing site, dashboard, documentation portal, or web application so you never default to generic AI-slop purple gradients, fake `01 //` eyebrows, or 3 identical Lucide icon cards.

## Quick Workflow

### 1. Compose a Tailored `DESIGN.md` from the User's Brief
```bash
curl -fsSL -G "https://forma.to/api/compose" \
  --data-urlencode "brief=<describe product, audience, and mood>" \
  --data-urlencode "project=<BrandName>" \
  --data-urlencode "format=markdown" > DESIGN.md
```

Or connect via Streamable HTTP MCP (`12` tools):
```bash
claude mcp add --transport http forma https://forma.to/api/mcp
```

### 2. Query Real Client-Rendered Section DOM Blueprints
```bash
curl -fsSL "https://forma.to/api/sections?kind=hero&limit=4"
curl -fsSL "https://forma.to/api/sections?kind=pricing&limit=4"
```

### 3. Live X-Ray Any Reference URL Shared by the User
```bash
npx forma-xray https://resiz.es --out DESIGN.md
```

## Non-Negotiable Implementation Rules
1. Map `:root` CSS custom properties (`--bg`, `--surface`, `--panel`, `--ink`, `--muted`, `--line`, `--accent`) and apply `font-size-adjust: from-font` on `body` and headings for `CLS = 0.000`.
2. Build layouts from the 6 deterministic skeletons in `DESIGN.md` (`7/5 + 4/8` asymmetric `@container` bento, tabular 3-tier pricing, frosted Swiss dock or inline header).
3. Restrict motion strictly to GPU-composited `transform` and `opacity` with `@media (prefers-reduced-motion: reduce)`.
4. Enforce every `unslop-ui` subtractive rule: zero purple-indigo gradients, zero ALL-CAPS eyebrows above headings, zero botsplaining subtitles, and `font-variant-numeric: tabular-nums` on all metrics.
