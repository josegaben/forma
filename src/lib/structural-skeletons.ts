import type { HeroLayout, NavStyle, WebFormat } from "@/data/formats";
import type { TargetStack } from "@/lib/composer";

export interface StructuralSkeletonBlock {
  id: "nav" | "hero" | "bento" | "proof" | "pricing" | "footer";
  step: string;
  title: string;
  titleEs: string;
  variant: string;
  whyNotSlop: string;
  cssLayout: string;
  code: string;
}

interface BuildSkeletonsInput {
  projectName: string;
  projectBrief: string;
  stack: TargetStack;
  surface: WebFormat["surface"];
  typography: WebFormat["typography"];
  layout: WebFormat["layout"];
  motion: WebFormat["motion"];
}

function attrName(stack: TargetStack): "className" | "class" {
  return stack === "nextjs-tailwind" || stack === "vite-react" ? "className" : "class";
}

function buildNavSkeleton(
  navStyle: NavStyle,
  projectName: string,
  cls: "className" | "class",
  maxWidth: string
): StructuralSkeletonBlock {
  if (navStyle === "bottom-dock") {
    return {
      id: "nav",
      step: "01",
      title: "Swiss Floating Bottom Dock + Minimal Top Brand",
      titleEs: "Dock Suizo Flotante Inferior + Marca Superior Limpia",
      variant: "bottom-dock",
      whyNotSlop:
        "Replaces bloated 8-link SaaS headers with an airy top wordmark and a tactile bottom pill dock (< 56px height).",
      cssLayout: `.forma-top-brand {
  max-inline-size: ${maxWidth};
  margin-inline: auto;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.forma-bottom-dock {
  position: fixed;
  inset-block-end: 1.25rem;
  inset-inline: 0;
  margin-inline: auto;
  inline-size: fit-content;
  max-inline-size: calc(100dvw - 2rem);
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem;
  border-radius: var(--radius-pill);
  background: color-mix(in oklch, var(--surface) 86%, transparent);
  backdrop-filter: blur(14px);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-card);
}
.forma-bottom-dock a[aria-current="page"] {
  background: var(--ink);
  color: var(--bg);
}`,
      code: `<header ${cls}="forma-top-brand">
  <a href="/" ${cls}="forma-wordmark">${projectName}</a>
  <span ${cls}="forma-status-mono">v2.4 · ONLINE</span>
</header>

<nav ${cls}="forma-bottom-dock" aria-label="Primary">
  <a href="#work" aria-current="page" ${cls}="dock-item">Overview</a>
  <a href="#architecture" ${cls}="dock-item">Architecture</a>
  <a href="#pricing" ${cls}="dock-item">Pricing</a>
  <a href="#start" ${cls}="dock-cta">Start free</a>
</nav>`,
    };
  }

  if (navStyle === "floating-pill") {
    return {
      id: "nav",
      step: "01",
      title: "Translucent Floating Pill Navigation",
      titleEs: "Cápsula de Navegación Flotante Translúcida",
      variant: "floating-pill",
      whyNotSlop:
        "Keeps persistent navigation compact (< 8% viewport height) with native popover mobile fallback and zero stacked banners.",
      cssLayout: `.forma-pill-header {
  position: sticky;
  inset-block-start: 0.875rem;
  z-index: 30;
  padding-inline: 1rem;
}
.forma-pill-inner {
  max-inline-size: 48rem;
  block-size: 3.25rem;
  margin-inline: auto;
  padding-inline: 1rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-radius: var(--radius-pill);
  background: color-mix(in oklch, var(--surface) 84%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--line);
}
.forma-nav-links {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}
.forma-nav-links a[aria-current="page"] {
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 0.35rem;
}`,
      code: `<header ${cls}="forma-pill-header">
  <div ${cls}="forma-pill-inner">
    <a href="/" ${cls}="forma-brand">${projectName}</a>
    <nav aria-label="Primary" ${cls}="forma-nav-links">
      <a href="#product" aria-current="page">Product</a>
      <a href="#docs">Docs</a>
      <a href="#pricing">Pricing</a>
    </nav>
    <a href="#get-started" ${cls}="forma-cta-pill">Get started</a>
  </div>
</header>`,
    };
  }

  if (navStyle === "rail-header") {
    return {
      id: "nav",
      step: "01",
      title: "Architectural 1px Crosshair Rail Header",
      titleEs: "Cabecera Estructural con Retícula 1px",
      variant: "rail-header",
      whyNotSlop:
        "Uses visible 1px architectural cell dividers (Vercel / Teenage Engineering grade) instead of generic floating drop-shadows.",
      cssLayout: `.forma-rail-header {
  position: sticky;
  inset-block-start: 0;
  z-index: 30;
  background: var(--bg);
  border-block-end: 1px solid var(--line);
}
.forma-rail-grid {
  max-inline-size: ${maxWidth};
  block-size: 3.5rem;
  margin-inline: auto;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  align-items: stretch;
  border-inline: 1px solid var(--line);
}
.forma-rail-cell {
  display: flex;
  align-items: center;
  padding-inline: 1.25rem;
  border-inline-end: 1px solid var(--line);
}`,
      code: `<header ${cls}="forma-rail-header">
  <div ${cls}="forma-rail-grid">
    <a href="/" ${cls}="forma-rail-cell forma-brand">${projectName}</a>
    <nav aria-label="Primary" ${cls}="forma-rail-cell forma-rail-links">
      <a href="#platform" aria-current="page">Platform</a>
      <a href="#benchmarks">Benchmarks</a>
      <a href="#pricing">Pricing</a>
    </nav>
    <span ${cls}="forma-rail-cell forma-mono-meta">99.99% SLA</span>
    <a href="#deploy" ${cls}="forma-rail-cta">Deploy →</a>
  </div>
</header>`,
    };
  }

  return {
    id: "nav",
    step: "01",
    title: "Compact Single-Row Editorial Bar (56px)",
    titleEs: "Barra Editorial Compacta de Una Sola Fila (56px)",
    variant: "minimal-inline",
    whyNotSlop:
      "Single 56px sticky bar with semantic <nav aria-label=\"Primary\">, aria-current=\"page\", and native popover mobile disclosure.",
    cssLayout: `.forma-site-header {
  position: sticky;
  inset-block-start: 0;
  z-index: 30;
  block-size: 3.5rem;
  background: color-mix(in oklch, var(--bg) 90%, transparent);
  backdrop-filter: blur(10px);
  border-block-end: 1px solid var(--line);
}
.forma-header-inner {
  max-inline-size: ${maxWidth};
  block-size: 100%;
  margin-inline: auto;
  padding-inline: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}
.forma-header-inner > * {
  flex-shrink: 0;
  white-space: nowrap;
}`,
    code: `<header ${cls}="forma-site-header">
  <div ${cls}="forma-header-inner">
    <a href="/" ${cls}="forma-brand">${projectName}</a>
    <nav aria-label="Primary" ${cls}="forma-inline-nav">
      <a href="#features" aria-current="page">Features</a>
      <a href="#customers">Customers</a>
      <a href="#pricing">Pricing</a>
      <a href="/docs">Docs</a>
    </nav>
    <div ${cls}="forma-header-actions">
      <a href="/login" ${cls}="forma-link-muted">Sign in</a>
      <a href="#start" ${cls}="forma-btn-primary">Start building</a>
    </div>
  </div>
</header>`,
  };
}

function buildHeroSkeleton(
  heroLayout: HeroLayout,
  input: BuildSkeletonsInput,
  cls: "className" | "class"
): StructuralSkeletonBlock {
  const { projectName, layout, typography } = input;
  const italicTag = typography.useItalicAccent
    ? `<em ${cls}="forma-serif-italic">without</em>`
    : "without";

  if (heroLayout === "split-product-frame" || heroLayout === "swiss-statement-grid") {
    return {
      id: "hero",
      step: "02",
      title: "Asymmetric 5/7 Split Hero + Hardware-Framed Stage",
      titleEs: "Hero Asimétrico 5/7 + Escenario de Producto Enmarcado",
      variant: heroLayout,
      whyNotSlop:
        "Eliminates generic centered SaaS gradient blobs in favor of a disciplined 5fr/7fr editorial split and an intrinsic aspect-ratio product stage (zero CLS).",
      cssLayout: `.forma-hero-split {
  max-inline-size: ${layout.maxWidth};
  margin-inline: auto;
  padding: clamp(3.5rem, 7vw, 6.5rem) 1.25rem;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: clamp(2rem, 4vw, 3.5rem);
  align-items: center;
}
.forma-hero-copy {
  grid-column: span 12;
}
.forma-hero-stage {
  grid-column: span 12;
  aspect-ratio: 16 / 10;
  border-radius: var(--radius-card);
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-card);
  overflow: hidden;
}
@media (min-width: 60rem) {
  .forma-hero-copy { grid-column: span 5; }
  .forma-hero-stage { grid-column: span 7; }
}
.forma-hero-h1 {
  font-family: var(--font-display);
  font-size: var(--h1-size);
  letter-spacing: var(--h1-tracking);
  line-height: 1.04;
  text-wrap: balance;
}`,
      code: `<section ${cls}="forma-hero-split hero-canvas">
  <div ${cls}="forma-hero-copy">
    <p ${cls}="forma-eyebrow-mono">${projectName.toUpperCase()} · PRODUCTION RELEASE</p>
    <h1 ${cls}="forma-hero-h1">
      Ship critical workflows ${italicTag} operational drag.
    </h1>
    <p ${cls}="forma-hero-lead">
      Deterministic infrastructure and real-time visibility engineered for modern product teams.
    </p>
    <div ${cls}="forma-cta-row">
      <a href="#start" ${cls}="forma-btn-primary">Start free trial</a>
      <a href="#docs" ${cls}="forma-btn-secondary">Read architecture →</a>
    </div>
  </div>

  <figure ${cls}="forma-hero-stage" aria-label="${projectName} live interface preview">
    <div ${cls}="forma-window-bar">
      <span ${cls}="forma-mono-path">${projectName.toLowerCase()} / live-telemetry</span>
      <span ${cls}="forma-badge-ok tabular-nums">14ms p99</span>
    </div>
    <div ${cls}="forma-stage-grid">
      <!-- Mount real interactive product state or live data preview here -->
    </div>
  </figure>
</section>`,
    };
  }

  if (heroLayout === "single-column-manifesto") {
    return {
      id: "hero",
      step: "02",
      title: "680px Editorial Reading Rail & Live Specimen",
      titleEs: "Columna Editorial de 680px y Espécimen Interactivo",
      variant: "single-column-manifesto",
      whyNotSlop:
        "Trades marketing noise for high-trust editorial clarity (65ch measure, zero decorative stock illustrations).",
      cssLayout: `.forma-manifesto-hero {
  max-inline-size: 44rem;
  margin-inline: auto;
  padding: clamp(4rem, 9vw, 7.5rem) 1.25rem 3.5rem;
}
.forma-manifesto-h1 {
  font-family: var(--font-display);
  font-size: var(--h1-size);
  letter-spacing: var(--h1-tracking);
  line-height: 1.06;
  text-wrap: balance;
}
.forma-manifesto-prose {
  margin-block-start: 1.5rem;
  max-inline-size: 62ch;
  color: var(--muted);
  font-size: 1.0625rem;
}`,
      code: `<section ${cls}="forma-manifesto-hero">
  <h1 ${cls}="forma-manifesto-h1">
    Software that respects your attention ${italicTag} clutter.
  </h1>
  <p ${cls}="forma-manifesto-prose">
    ${projectName} strips away bloated dashboards and replaces them with a single keyboard-first surface built for speed.
  </p>
  <div ${cls}="forma-cta-row">
    <a href="#start" ${cls}="forma-btn-primary">Try ${projectName}</a>
    <a href="#changelog" ${cls}="forma-link-muted">Changelog · v2.4</a>
  </div>
</section>`,
    };
  }

  return {
    id: "hero",
    step: "02",
    title: "Editorial Display Hero + Interactive Command / Telemetry Stage",
    titleEs: "Hero Editorial + Barra Interactiva de Comando / Producto",
    variant: heroLayout,
    whyNotSlop:
      "Anchors the viewport with a tight display headline, a single copyable CLI/command artifact, and an aspect-locked live preview frame.",
    cssLayout: `.forma-hero-centered {
  max-inline-size: ${layout.maxWidth};
  margin-inline: auto;
  padding: clamp(3.5rem, 8vw, 6.25rem) 1.25rem 3rem;
  text-align: center;
}
.forma-hero-title {
  max-inline-size: 18ch;
  margin-inline: auto;
  font-family: var(--font-display);
  font-size: var(--h1-size);
  letter-spacing: var(--h1-tracking);
  line-height: 1.04;
  text-wrap: balance;
}
.forma-command-pill {
  max-inline-size: 38rem;
  margin: 2rem auto 0;
  padding: 0.5rem 0.5rem 0.5rem 1.125rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border-radius: var(--radius-pill);
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-card);
}
.forma-hero-preview-frame {
  margin-block-start: 2.75rem;
  border-radius: var(--radius-card);
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 1.25rem;
  text-align: left;
}`,
    code: `<section ${cls}="forma-hero-centered hero-canvas">
  <span ${cls}="forma-status-pill tabular-nums">${projectName} · 99.98% Uptime</span>
  <h1 ${cls}="forma-hero-title">
    Precision infrastructure ${italicTag} the complexity.
  </h1>
  <p ${cls}="forma-hero-subtitle">
    Connect your stack in seconds and ship production-grade workflows from day one.
  </p>

  <div ${cls}="forma-command-pill">
    <code ${cls}="forma-mono-cmd">npx ${projectName.toLowerCase().replace(/[^a-z0-9]/g, "-")}@latest init</code>
    <button type="button" ${cls}="forma-btn-primary">Copy CLI</button>
  </div>

  <div ${cls}="forma-hero-preview-frame">
    <!-- Mount real interactive product preview or live telemetry artifact -->
  </div>
</section>`,
  };
}

export function buildStructuralSkeletons(
  input: BuildSkeletonsInput
): StructuralSkeletonBlock[] {
  const cls = attrName(input.stack);
  const { projectName, layout } = input;

  const navBlock = buildNavSkeleton(
    layout.navStyle,
    projectName,
    cls,
    layout.maxWidth
  );
  const heroBlock = buildHeroSkeleton(layout.heroLayout, input, cls);

  const bentoBlock: StructuralSkeletonBlock = {
    id: "bento",
    step: "03",
    title: "Asymmetric 12-Column @container Bento Architecture (7/5 + 4/8)",
    titleEs: "Arquitectura Bento Asimétrica de 12 Columnas con @container (7/5 + 4/8)",
    variant: "asymmetric-7-5-bento",
    whyNotSlop:
      "Hard-bans the #1 AI slop tell (3 identical 33% cards with Lucide icons in colored circles) by enforcing asymmetric 7/5 and 4/8 spans with semantic <article> roots.",
    cssLayout: `.forma-bento-section {
  max-inline-size: ${layout.maxWidth};
  margin-inline: auto;
  padding: 4.5rem 1.25rem;
}
.forma-bento-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1.25rem;
}
article.forma-bento-card {
  container-type: inline-size;
  grid-column: span 12;
  padding: 1.75rem;
  border-radius: var(--radius-card);
  background: var(--surface);
  border: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.25rem;
}
@media (min-width: 56rem) {
  article.forma-bento-card[data-span="7"] { grid-column: span 7; }
  article.forma-bento-card[data-span="5"] { grid-column: span 5; }
  article.forma-bento-card[data-span="4"] { grid-column: span 4; }
  article.forma-bento-card[data-span="8"] { grid-column: span 8; }
}`,
    code: `<section id="features" ${cls}="forma-bento-section">
  <header ${cls}="forma-section-header">
    <h2 ${cls}="forma-h2">Built for deterministic execution</h2>
    <p ${cls}="forma-muted">Every surface is structured around real telemetry, not decorative filler.</p>
  </header>

  <div ${cls}="forma-bento-grid">
    <article ${cls}="forma-bento-card" data-span="7">
      <header>
        <span ${cls}="forma-kicker-mono">REAL-TIME ENGINE</span>
        <h3>Sub-50ms state synchronization across regions</h3>
      </header>
      <div ${cls}="forma-live-widget tabular-nums">
        <!-- Interactive chart, log stream, or live state diff -->
      </div>
    </article>

    <article ${cls}="forma-bento-card" data-span="5">
      <header>
        <span ${cls}="forma-kicker-mono">AUDITABLE BY DEFAULT</span>
        <h3>Zero-trust permissions & cryptographic logs</h3>
      </header>
      <p ${cls}="forma-muted">Every mutation is versioned and replayable from the CLI or dashboard.</p>
    </article>

    <article ${cls}="forma-bento-card" data-span="4">
      <header>
        <span ${cls}="forma-kicker-mono">LATENCY</span>
        <p ${cls}="forma-stat-kpi tabular-nums">12.4ms</p>
      </header>
      <p ${cls}="forma-muted">Global edge routing with automatic failover.</p>
    </article>

    <article ${cls}="forma-bento-card" data-span="8">
      <header>
        <span ${cls}="forma-kicker-mono">WORKFLOW AUTOMATION</span>
        <h3>Composable pipelines via SDK, Webhook, or MCP</h3>
      </header>
      <pre ${cls}="forma-code-well"><code>curl -fsSL https://api.${projectName.toLowerCase()}.dev/v1/runs</code></pre>
    </article>
  </div>
</section>`,
  };

  const proofBlock: StructuralSkeletonBlock = {
    id: "proof",
    step: "04",
    title: "Accessible Single-Row Tabbed Workflow & Code Stage",
    titleEs: "Escenario Interactivo con Pestañas de Una Fila y Código en Vivo",
    variant: "tabbed-workflow-stage",
    whyNotSlop:
      "Uses a single-row scrollable tablist with a ::after border underline (WCAG 1.4.1 & forced-colors safe) paired with a dark syntax/telemetry panel.",
    cssLayout: `.forma-proof-section {
  max-inline-size: ${layout.maxWidth};
  margin-inline: auto;
  padding: 4rem 1.25rem;
}
.forma-tablist {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  border-block-end: 1px solid var(--line);
}
.forma-tab {
  position: relative;
  flex: none;
  padding-block: 0.75rem;
  color: var(--muted);
  background: none;
  border: 0;
  cursor: pointer;
}
.forma-tab[aria-selected="true"] {
  color: var(--ink);
}
.forma-tab[aria-selected="true"]::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  border-block-end: 2px solid var(--accent);
}
.forma-proof-panel {
  margin-block-start: 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  border-radius: var(--radius-card);
  background: var(--panel);
  border: 1px solid var(--line);
}
@media (min-width: 56rem) {
  .forma-proof-panel { grid-template-columns: 5fr 7fr; }
}`,
    code: `<section ${cls}="forma-proof-section">
  <div role="tablist" aria-label="${projectName} integration modes" ${cls}="forma-tablist">
    <button type="button" role="tab" id="tab-sdk" aria-selected="true" ${cls}="forma-tab">TypeScript SDK</button>
    <button type="button" role="tab" id="tab-cli" aria-selected="false" ${cls}="forma-tab">CLI & CI</button>
    <button type="button" role="tab" id="tab-webhooks" aria-selected="false" ${cls}="forma-tab">Event Webhooks</button>
  </div>

  <div role="tabpanel" aria-labelledby="tab-sdk" ${cls}="forma-proof-panel">
    <div>
      <h3>Drop-in typed client in 4 lines</h3>
      <p ${cls}="forma-muted">End-to-end type inference with automatic retries and idempotency keys.</p>
    </div>
    <pre ${cls}="forma-code-block"><code>import { Client } from "@${projectName.toLowerCase()}/sdk";
const client = new Client();
await client.deployments.create({ region: "eu-west-1" });</code></pre>
  </div>
</section>`,
  };

  const pricingBlock: StructuralSkeletonBlock = {
    id: "pricing",
    step: "05",
    title: "3-Tier Tabular Pricing Matrix with Inverted Focal Tier",
    titleEs: "Matriz de Precios de 3 Niveles con `tabular-nums` y Plan Destacado Invertido",
    variant: "tabular-3-tier-pricing",
    whyNotSlop:
      "Replaces glowing neon 'MOST POPULAR' ribbons with high-contrast surface inversion (`data-featured=\"true\"`) and aligned `tabular-nums` figures.",
    cssLayout: `.forma-pricing-section {
  max-inline-size: ${layout.maxWidth};
  margin-inline: auto;
  padding: 4.5rem 1.25rem;
}
.forma-pricing-grid {
  margin-block-start: 2.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 18rem), 1fr));
  gap: 1.25rem;
  align-items: stretch;
}
article.forma-tier-card {
  padding: 2rem;
  border-radius: var(--radius-card);
  background: var(--surface);
  border: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
}
article.forma-tier-card[data-featured="true"] {
  background: var(--ink);
  color: var(--bg);
  border-color: var(--ink);
}
.forma-tier-price {
  font-family: var(--font-display);
  font-size: 2.5rem;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}`,
    code: `<section id="pricing" ${cls}="forma-pricing-section">
  <header ${cls}="forma-section-header">
    <h2 ${cls}="forma-h2">Predictable, transparent pricing</h2>
    <p ${cls}="forma-muted">Start free in development; scale linearly with production usage.</p>
  </header>

  <div ${cls}="forma-pricing-grid">
    <article ${cls}="forma-tier-card">
      <div>
        <h3>Starter</h3>
        <p ${cls}="forma-tier-price tabular-nums">$0<span>/mo</span></p>
        <p ${cls}="forma-muted">For solo builders and prototypes.</p>
      </div>
      <ul ${cls}="forma-tier-list">
        <li>Up to 10,000 events / month</li>
        <li>Community support</li>
      </ul>
      <a href="#signup" ${cls}="forma-btn-secondary">Start for free</a>
    </article>

    <article ${cls}="forma-tier-card" data-featured="true">
      <div>
        <h3>Pro</h3>
        <p ${cls}="forma-tier-price tabular-nums">$29<span>/mo</span></p>
        <p>For fast-moving production teams.</p>
      </div>
      <ul ${cls}="forma-tier-list">
        <li>1,000,000 events included</li>
        <li>99.99% SLA & SSO</li>
      </ul>
      <a href="#pro" ${cls}="forma-btn-inverted">Upgrade to Pro</a>
    </article>

    <article ${cls}="forma-tier-card">
      <div>
        <h3>Enterprise</h3>
        <p ${cls}="forma-tier-price">Custom</p>
        <p ${cls}="forma-muted">Dedicated clusters & custom compliance.</p>
      </div>
      <ul ${cls}="forma-tier-list">
        <li>Dedicated VPC / BYOC</li>
        <li>24/7 engineering Slack channel</li>
      </ul>
      <a href="#contact" ${cls}="forma-btn-secondary">Talk to engineering</a>
    </article>
  </div>
</section>`,
  };

  const footerBlock: StructuralSkeletonBlock = {
    id: "footer",
    step: "06",
    title: "Architectural Conversion Band + 4-Column Colophon Footer",
    titleEs: "Banda de Conversión + Footer Editorial de 4 Columnas",
    variant: "colophon-sitemap-footer",
    whyNotSlop:
      "Closes the page with a restrained typographic CTA band and a clean 2fr/1fr/1fr/1fr semantic <footer> with live status telemetry.",
    cssLayout: `.forma-site-footer {
  border-block-start: 1px solid var(--line);
  background: var(--panel);
  padding: 4rem 1.25rem 2.5rem;
}
.forma-footer-grid {
  max-inline-size: ${layout.maxWidth};
  margin-inline: auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}
@media (min-width: 48rem) {
  .forma-footer-grid {
    grid-template-columns: 2fr repeat(3, 1fr);
  }
}`,
    code: `<footer ${cls}="forma-site-footer">
  <div ${cls}="forma-footer-grid">
    <div>
      <strong ${cls}="forma-brand">${projectName}</strong>
      <p ${cls}="forma-muted">Engineered with precision and restraint.</p>
      <p ${cls}="forma-status-mono tabular-nums">● All systems operational</p>
    </div>
    <nav aria-label="Product">
      <h4>Product</h4>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="/changelog">Changelog</a></li>
      </ul>
    </nav>
    <nav aria-label="Developers">
      <h4>Developers</h4>
      <ul>
        <li><a href="/docs">Documentation</a></li>
        <li><a href="/api">API Reference</a></li>
        <li><a href="/status">Status</a></li>
      </ul>
    </nav>
    <nav aria-label="Company">
      <h4>Company</h4>
      <ul>
        <li><a href="/about">About</a></li>
        <li><a href="/privacy">Privacy</a></li>
      </ul>
    </nav>
  </div>
</footer>`,
  };

  return [navBlock, heroBlock, bentoBlock, proofBlock, pricingBlock, footerBlock];
}

export function renderStructuralSkeletonsMarkdown(
  skeletons: StructuralSkeletonBlock[],
  stack: TargetStack
): string {
  const codeLang =
    stack === "nextjs-tailwind" || stack === "vite-react" ? "tsx" : "html";

  return `## 4B. Deterministic Structural CSS & HTML/JSX Skeletons (MANDATORY SCAFFOLD)
> **CRITICAL DIRECTIVE FOR THE CODING AGENT:** Do **NOT** improvise generic SaaS section wrappers, centered gradient blobs, or 3-equal-column icon grids. Use the **6 concrete CSS + ${codeLang.toUpperCase()} structural skeletons** below as your literal DOM & CSS Grid scaffold, replacing only domain copy and mounting interactive logic inside the designated slots.

${skeletons
  .map(
    (sk) => `### Skeleton ${sk.step} — ${sk.title} (\`${sk.variant}\`)
- **Anti-Slop Guarantee:** ${sk.whyNotSlop}

\`\`\`css
${sk.cssLayout}
\`\`\`

\`\`\`${codeLang}
${sk.code}
\`\`\``
  )
  .join("\n\n")}
`;
}
