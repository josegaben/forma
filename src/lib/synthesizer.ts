import discoveredFeed from "@/data/discovered-feed.json";
import { WEB_FORMATS, type WebFormat } from "@/data/formats";
import { recommendMixFromBrief } from "@/lib/composer";
import type { DiscoveredSite } from "@/lib/scraper";

export interface TailoredPreviewContent {
  brandName: string;
  domainSlug: string;
  badge: string;
  headlineStart: string;
  headlineAccent: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  metric1Label: string;
  metric1Value: string;
  metric1Sub: string;
  metric2Label: string;
  metric2Value: string;
  metric2Sub: string;
}

export function generateTailoredPreviewContent(
  idea: string,
  lang: "en" | "es",
  explicitName?: string
): TailoredPreviewContent {
  const q = idea.trim().toLowerCase();

  // Extract explicit name if user wrote "X: ..." or "llamado X" / "called X"
  const calledMatch =
    idea.match(/(?:called|named|llamad[oa]|marca)\s+([A-Z][a-zA-Z0-9_-]{2,16})/i) ||
    idea.match(/^([A-Z][a-zA-Z0-9]{2,14})\s*[:—-]\s+/);

  if (/(clinic|health|salud|medic|dental|doctor|patient|pacient|terapia|wellness)/i.test(q)) {
    const brand = explicitName || calledMatch?.[1] || " ClaraHealth";
    return {
      brandName: brand.trim(),
      domainSlug: `${brand.trim().toLowerCase()}.care`,
      badge: lang === "es" ? "HIPAA · VOZ Y CITAS 24/7" : "HIPAA · 24/7 PATIENT CARE",
      headlineStart: lang === "es" ? "Atención clínica que se siente" : "Patient care that feels",
      headlineAccent: lang === "es" ? "humana y serena." : "calm and human.",
      subtitle:
        idea.trim() ||
        (lang === "es"
          ? "Recepción inteligente, triaje y agenda médica sin esperas telefónicas."
          : "Intelligent patient intake, triage, and scheduling with zero hold times."),
      primaryCta: lang === "es" ? "Probar en consulta ↗" : "Book clinic demo ↗",
      secondaryCta: lang === "es" ? "Escuchar llamada" : "Hear voice sample",
      metric1Label: lang === "es" ? "TIEMPO DE RESPUESTA" : "PICKUP LATENCY",
      metric1Value: "0.6 s",
      metric1Sub: lang === "es" ? "Atención inmediata 24/7" : "Zero missed calls",
      metric2Label: lang === "es" ? "CITAS CONFIRMADAS" : "BOOKING RATE",
      metric2Value: "98.4%",
      metric2Sub: lang === "es" ? "Sincronizado con agenda" : "Direct EHR sync",
    };
  }

  if (/(fintech|pay|pago|bank|banca|crypto|billing|factura|treasury|tesoreria|finance|inversion|payout)/i.test(q)) {
    const brand = explicitName || calledMatch?.[1] || "Meridian";
    return {
      brandName: brand.trim(),
      domainSlug: `${brand.trim().toLowerCase()}.fi`,
      badge: "SOC2 TYPE II · T+0 SETTLEMENT",
      headlineStart: lang === "es" ? "Tesorería programable con" : "Programmable treasury with",
      headlineAccent: lang === "es" ? "precisión contable." : "instant clarity.",
      subtitle:
        idea.trim() ||
        (lang === "es"
          ? "Conciliación en tiempo real, pagos globales y control de caja sin hojas de cálculo."
          : "Real-time reconciliation, global payouts, and cashflow visibility in one ledger."),
      primaryCta: lang === "es" ? "Abrir cuenta →" : "Open account →",
      secondaryCta: lang === "es" ? "Ver API" : "API Reference",
      metric1Label: lang === "es" ? "LIQUIDACIÓN" : "SETTLEMENT",
      metric1Value: "120 ms",
      metric1Sub: "SEPA · SWIFT · ACH",
      metric2Label: lang === "es" ? "COMISIÓN OCULTA" : "FX MARKUP",
      metric2Value: "0.00%",
      metric2Sub: lang === "es" ? "Tipo interbancario real" : "Pure interbank rate",
    };
  }

  if (/(studio|estudio|portfolio|portafolio|agency|agencia|design|diseno|arquitectura|architecture|fashion|moda|luxury|lujo|creative)/i.test(q)) {
    const brand = explicitName || calledMatch?.[1] || "Atelier Norte";
    return {
      brandName: brand.trim(),
      domainSlug: `${brand.trim().toLowerCase().replace(/\s+/g, "")}.studio`,
      badge: lang === "es" ? "EDICIÓN 2026 · MADRID / ZÜRICH" : "EDITION 2026 · BRAND & PRODUCT",
      headlineStart: lang === "es" ? "Diseñamos sistemas que dan" : "Shaping products with",
      headlineAccent: lang === "es" ? "claridad duradera." : "quiet permanence.",
      subtitle:
        idea.trim() ||
        (lang === "es"
          ? "Dirección creativa, identidad y producto digital para compañías que cuidan cada detalle."
          : "Brand architecture, digital product, and motion systems built as one cohesive language."),
      primaryCta: lang === "es" ? "Iniciar proyecto" : "Start a conversation",
      secondaryCta: lang === "es" ? "Obra seleccionada" : "Selected work",
      metric1Label: lang === "es" ? "DISPONIBILIDAD" : "AVAILABILITY",
      metric1Value: lang === "es" ? "1 plaza Q4" : "1 spot Q4",
      metric1Sub: lang === "es" ? "Sprints dedicados" : "Dedicated partner sprint",
      metric2Label: lang === "es" ? "LANZAMIENTOS" : "SHIPPED",
      metric2Value: "42",
      metric2Sub: "YC · Seed → Series C",
    };
  }

  if (/(kube|k8s|devops|cloud|infra|server|database|sql|rust|cli|sdk|api|security|seguridad|agent|agente|finops)/i.test(q)) {
    const brand = explicitName || calledMatch?.[1] || "Vektor";
    return {
      brandName: brand.trim(),
      domainSlug: `${brand.trim().toLowerCase()}.dev`,
      badge: "OPEN SOURCE · SUB-10MS COLD START",
      headlineStart: lang === "es" ? "Opera tu infraestructura con" : "Operate your stack with",
      headlineAccent: lang === "es" ? "control absoluto." : "zero blindspots.",
      subtitle:
        idea.trim() ||
        (lang === "es"
          ? "Despliegues deterministas, trazabilidad completa y políticas seguras para equipos de ingeniería."
          : "Deterministic deploys, instant rollback traces, and policy gates built for production."),
      primaryCta: lang === "es" ? "Desplegar gratis ↗" : "Start deploying ↗",
      secondaryCta: "$ npx vektor init",
      metric1Label: "LATENCY P99",
      metric1Value: "8.4 ms",
      metric1Sub: "Global edge mesh",
      metric2Label: "UPTIME SLA",
      metric2Value: "99.99%",
      metric2Sub: "Zero-downtime rollouts",
    };
  }

  const fallbackBrand = explicitName || calledMatch?.[1] || "FormaApp";
  return {
    brandName: fallbackBrand.trim(),
    domainSlug: `${fallbackBrand.trim().toLowerCase().replace(/\s+/g, "")}.com`,
    badge: lang === "es" ? "DISEÑO A MEDIDA · 0% AI SLOP" : "TAILORED SYSTEM · 0% AI SLOP",
    headlineStart: lang === "es" ? "Software diseñado con" : "Software crafted with",
    headlineAccent: lang === "es" ? "identidad propia." : "unmistakable taste.",
    subtitle:
      idea.trim() ||
      (lang === "es"
        ? "Escribe arriba la idea de tu proyecto y cruzaremos las mejores referencias web del mundo en vivo."
        : "Describe your project above to cross-pollinate the world's sharpest web references into one system."),
    primaryCta: lang === "es" ? "Empezar ahora ↗" : "Get started ↗",
    secondaryCta: lang === "es" ? "Ver demostración" : "Live preview",
    metric1Label: lang === "es" ? "RENDIMIENTO" : "CORE WEB VITALS",
    metric1Value: "100 / 100",
    metric1Sub: "60fps GPU transitions",
    metric2Label: "ANTI-SLOP",
    metric2Value: "0 clichés",
    metric2Sub: "unslop-ui verified",
  };
}

export function findMatchingScrapedSites(
  idea: string,
  targetMode: "light" | "dark",
  limit = 6
): DiscoveredSite[] {
  const q = idea.toLowerCase();
  const sites = discoveredFeed.sites as DiscoveredSite[];

  return [...sites]
    .map((site) => {
      let score = site.craftScore;
      if (site.mode === targetMode) score += 12;
      const hay = `${site.hostname} ${site.title} ${site.description} ${site.sourceGallery} ${site.primaryFont}`.toLowerCase();
      for (const word of q.split(/\s+/).filter((w) => w.length > 3)) {
        if (hay.includes(word)) score += 20;
      }
      return { site, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.site);
}

export function cycleFormatOption(
  currentId: string,
  pool: WebFormat[] = WEB_FORMATS
): string {
  const idx = pool.findIndex((f) => f.id === currentId);
  return pool[(idx + 1) % pool.length].id;
}

export { recommendMixFromBrief };
