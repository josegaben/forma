# AGENTS.md — `forma` Engineering & Design System Contract

Read [DESIGN.md](./DESIGN.md) and [SKILL.md](./SKILL.md) before modifying UI components, routes, or crawlers.

## Core Commands
- `npm run dev -- -p 3030` — Local Next.js 15 Studio + MCP + API server
- `npm run lint` — ESLint & TypeScript verification
- `npm run build` — Production Next.js verification across all routes
- `npm run cwv:audit` — Headless Chromium `CLS <= 0.01` & `100% GPU` compositor audit
- `npm run crawl:visual` — Playwright + Gemini 4 Hydrogen Vision section scanner (`src/data/section-vault.json`)
- `cd forma-xray && npm test` — Standalone `forma-xray` v1.2.0 unit & MCP stdio suite

## Architectural Guardrails
1. **Aesthetic Restraint (`[TRG+RSZ+PDP]`)**: Warm `#f4f4f1` stone canvas, `Newsreader` editorial display + `Geist` UI + `DM Mono` metrics (`tabular-nums`), zero AI-slop purple gradients, zero ALL-CAPS marketing eyebrows, zero botsplaining subtitles.
2. **Browser Support & Modern CSS**: Use Baseline modern web platform features (`<dialog closedby="any">`, `@container`, `font-size-adjust: from-font`, `text-wrap: balance` on unboxed headings, `color-mix(in oklab, ...)`). Keep `clamp()` max font-size `<= 2.5x` min font-size for WCAG 1.4.4 200% zoom reflow.
3. **Security & Privacy**: Every server endpoint accepting external URLs (`/api/scrape`, `/api/sections`, `/api/cloud`, `/api/mcp`) must validate targets through `validatePublicHttpUrl` in `src/lib/ssrf-guard.ts` and never mutate global `process.env` with per-request BYOK headers.
