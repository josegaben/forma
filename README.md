# forma (`forma.to`)

> **OpenRouter for Web Design.**  
> Connect Claude Code, Cursor, Codex, or Antigravity. Describe your project idea, cross-pollinate the world's sharpest web references into a deterministic 5-layer `DESIGN.md` + CSS/HTML structural scaffold, and ship with **0% AI slop**.

![forma Studio Hero](./public/x-launch-kit/03-forma-hero-live.png)

---

## Why `forma`?

Every web design directory on the internet (`Awwwards`, `Godly`, `Mobbin`, `A1.gallery`, `DeadSimpleSites`, `Landings.dev`, `Rare UI`, `Minimal.gallery`) was built for **human eyes** (screenshots & videos), not for **AI coding agents**.

When you prompt an LLM to build a website without deterministic structural & color constraints, it defaults to generic purple-indigo gradients, `01 //` fake eyebrows, layout-thrashing animations, and 3 identical Lucide icon cards.

![Before & After Blind Benchmark](./public/x-launch-kit/01-blind-ab-poll.png)

**forma** turns taste into a machine-readable protocol inspired by [`treg.to`](https://treg.to) and [`rareui.com`](https://www.rareui.com):

- **230+ Indexed Design Assets**:
  - **24 Composable 5-Layer Formats** (*Surface*, *Typography*, *Layout*, *Primitives*, *Motion Physics*).
  - **42 Client-Rendered Playwright + Vision Section Blueprints** (`navbar`, `hero`, `bento-features`, `pricing`, `cta-footer`) cropped from live sites (`linear.app`, `resend.com`, `cal.com`, `treg.to`, `resiz.es`, `dub.co`, `zed.dev`, `mintlify.com`, `trigger.dev`, `midday.ai`) with **Clean Semantic DOM Skeletons**.
  - **6 Deterministic Structural CSS + HTML/TSX Scaffolds** injected directly into every `DESIGN.md` (`bottom-dock`, `split-product-frame`, `7/5 + 4/8 @container bento`, `tabbed-workflow-stage`, `tabular-3-tier-pricing`, `colophon-footer`) so the LLM never guesses layout geometry.
  - **16 Perceptual 60-30-10 `OKLCH` Color Systems** (Radix Colors, Happy Hues, Sanzo Wada, Atmos) with verified WCAG AA/AAA contrast ratios.
  - **12 Interactive Rare UI / `shadcn` Components** + **85 Global Design Directories** + **60+ Continuously Scraped Live Websites**.
- **Standalone Open-Source Inspector ([`forma-xray` v1.1.0](https://github.com/josegaben/forma-xray))**: Extracts CSS custom properties, `cubic-bezier` / `linear()` spring curves, live WAAPI scroll choreography (`--runtime`), Playwright section DOM skeletons (`--sections`), and Gemini 4 Hydrogen Vision cataloging.
- **Verified Core Web Vitals & GPU Discipline**: `CLS = 0.000`, `LCP = 76ms`, and `100% GPU-composited` (`transform` / `opacity`) animations enforced in CI.

![Core Web Vitals & GPU Benchmark](./public/x-launch-kit/02-cwv-gpu-scorecard.png)

---

## Connect Your Agent in 10 Seconds

### 1. One-Line Prompt (`llms.txt` — Zero Auth)
```text
set up forma - https://forma.to/llms.txt
```

### 2. Streamable HTTP MCP Server (`12 Tools`)
```bash
claude mcp add --transport http forma https://forma.to/api/mcp
```

**Available MCP Tools:**
| Tool | Description |
| :--- | :--- |
| `recommend_format_mix` | Cross-pollinates optimal 5-layer format IDs + 60-30-10 `OKLCH` palette from any natural-language brief (EN/ES). |
| `compose_design_spec` | Compiles a complete `DESIGN.md` including CSS tokens, 6 deterministic CSS/HTML/TSX skeletons, and pinned section DOM trees. |
| `get_structural_skeletons` | Fetches pure architectural CSS Grid, `@container`, and semantic HTML/TSX scaffolds (`01 Nav` → `06 Footer`). |
| `search_section_blueprints` | Queries 42+ real Playwright + Vision section blueprints (`hero`, `navbar`, `pricing`, `bento-features`, `cta-footer`). |
| `xray_live_website` | Live-scrapes any public URL to extract CSS custom properties, fonts, `cubic-bezier` curves, and Anti-Slop Craft Score. |
| `list_color_palettes` | Queries 16 curated 60-30-10 `OKLCH` palettes with verified WCAG contrast ratios. |
| `list_ui_components` | Searches interactive Rare UI / Vaul / `cmdk` / `shadcn` primitives with CLI install commands. |
| `list_web_formats` / `list_discovered_designs` / `list_craft_assets` | Explores curated formats, continuously crawled gallery leaders, typography pairings, and shaders. |
| `check_forma_balance` / `get_unslop_checklist` | Inspects prepaid credit balance / BYOK status and mandatory `unslop-ui` subtractive rules. |

### 3. CLI & Multimodal Section Scanner (`forma-xray`)
```bash
# Fast zero-install DESIGN.md extraction (< 1s):
npx forma-xray https://resiz.es --out DESIGN.md

# Deep Playwright section crops + Clean Semantic DOM + Gemini 4 Vision:
GEMINI_API_KEY=... npx forma-xray https://cal.com --sections --out sections.json
```

---

## Open Protocol + Prepaid Credits & BYOK (`treg.to` Model)

- **$0.00 Open Protocol Forever**: `/llms.txt`, `/skill.md`, `/api/compose`, 24 formats, 6 structural skeletons, 16 `OKLCH` palettes, and all pre-indexed Section Vault blueprints are **100% free**.
- **$0.00 Unmetered BYOK**: Pass your own `X-Gemini-Key` header (or run `forma-xray` locally) with **0% platform fee**.
- **Prepaid Cloud Credits (`/credits`)**: Zero subscriptions and zero seat fees. New accounts start with **$1.00 free credit** and a **$5.00/day runaway-agent safety cap** for on-demand cloud Playwright + Gemini Vision rendering (`$0.04/scan`).

---

## Key Platform Routes

- `/` — Visual Cross-Format Studio, Live Preview, Before/After A/B Benchmark, `⌘K` Command Explorer (`109` items), and `#section-vault`.
- `/demo/without-forma` vs. `/demo/with-forma` — Live side-by-side benchmark on an identical 17-word prompt (`forma-ab-demo.mp4`).
- `/metrics` — Real-time Agent Pulls vs. Human Visits, Copy-to-Share K-factor, and Top Retaining Mixes telemetry dashboard (supports Upstash / Vercel KV via `KV_REST_API_URL` + `KV_REST_API_TOKEN`).
- `/credits` — Prepaid agent wallet, `sk-forma-...` token generator, `$5/$10/$25` top-up, and BYOK key manager.

---

## Run Locally

```bash
npm install
npm run dev -- -p 3030
```

```bash
npm run crawl          # Fast multi-gallery CSS & motion crawler
npm run crawl:visual   # Headless Playwright + Gemini Vision section blueprint crawler
npm run cwv:audit      # Chromium CLS = 0.000 & GPU-compositor verification
```

## License

MIT © [josegaben](https://github.com/josegaben)
