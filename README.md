# forma (`forma.to`)

> **OpenRouter for Web Design.**  
> Connect Claude Code, Cursor, or Codex. Describe your project idea, cross-pollinate the world's sharpest web references into a custom 5-layer brand system, and ship with 0% AI slop.

---

## Why `forma`?

Every web design directory on the internet (`Awwwards`, `Godly`, `Mobbin`, `A1.gallery`, `DeadSimpleSites`, `Landings.dev`, `Minimal.gallery`, `SiteInspire`) was built for **human eyes** (screenshots & videos), not for **AI coding agents**.

When you ask an AI agent to build a website without deterministic design DNA, it defaults to generic purple gradients, `01 //` fake eyebrows, and 3 identical icon cards.

**forma** solves this with an agent-native protocol inspired by [`treg.to`](https://treg.to):
- **144+ Indexed Design References** across **58 global design directories**, **62+ continuously scraped live sites**, and **24 composable archetypes**.
- **Cross-Reference Synthesis**: Describe your startup idea and automatically cross **Palette & Surface** (e.g. `resiz.es`) + **Typography** (e.g. `claude.ai`) + **Spatial Layout** (e.g. `pdepablo.com`) + **Motion Physics** (e.g. `emilkowal.ski` / `linear.app`) into one cohesive `DESIGN.md`.
- **Powered by [`forma-xray`](./forma-xray)**: Includes our standalone open-source deep web design & animation physics extractor (`forma-xray`), featuring `cubic-bezier` / `linear()` spring classification, `@keyframes` & scroll choreography analysis, and an **Anti-Slop Craft Scorer (`0–100`)** grounded in [`unslop-ui`](https://github.com/felipebasurto/unslop-ui).
- **Continuous Gallery Crawler**: Scheduled GitHub Action ([`.github/workflows/continuous-discovery.yml`](./.github/workflows/continuous-discovery.yml)) continuously scans published design galleries every 6 hours.

---

## Connect Your Agent

### 1. One-Line Prompt (`llms.txt`)
```text
set up forma - https://forma.to/llms.txt
```

### 2. Streamable HTTP MCP Server
```bash
claude mcp add --transport http forma https://forma.to/api/mcp
```

### 3. Live Website & Motion X-Ray CLI (`forma-xray`)
```bash
node ./forma-xray/bin/cli.mjs https://resiz.es --out DESIGN.md
```

---

## Run Locally

```bash
npm install
npm run dev
```

Run a manual multi-gallery scraping pass (or start the continuous daemon):
```bash
npm run crawl
npm run crawl:daemon
```

## License

MIT — [josegaben](https://github.com/josegaben)
