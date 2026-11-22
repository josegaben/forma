export interface CuratedColorPalette {
  id: string;
  name: string;
  nameEs: string;
  mode: "light" | "dark";
  harmony:
    | "Tinted Neutral"
    | "Radix 12-Step"
    | "Sanzo Wada Dyad"
    | "Editorial Warm"
    | "Perceptual OKLCH"
    | "OLED High-Contrast";
  inspiredBy: { name: string; url: string };
  psychology: string;
  psychologyEs: string;
  keywords: string[];
  tokens: {
    bg: string;
    surface: string;
    panel: string;
    ink: string;
    muted: string;
    line: string;
    accent: string;
    accentInk: string;
    badgeBg: string;
  };
}

/** Compute exact WCAG 2.1 contrast ratio between two 6-digit hex colors */
export function getContrastRatio(hex1: string, hex2: string): number {
  const lum = (hex: string) => {
    const clean = hex.replace("#", "");
    const full =
      clean.length === 3
        ? clean
            .split("")
            .map((c) => c + c)
            .join("")
        : clean.slice(0, 6);
    const rgb = [
      parseInt(full.slice(0, 2), 16) / 255,
      parseInt(full.slice(2, 4), 16) / 255,
      parseInt(full.slice(4, 6), 16) / 255,
    ].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  };
  const l1 = lum(hex1);
  const l2 = lum(hex2);
  const brightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return Math.round(((brightest + 0.05) / (darkest + 0.05)) * 10) / 10;
}

/** Approximate CSS oklch(L C H) string from hex for Tailwind v4 / modern CSS specs */
export function hexToOklchString(hex: string): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean.slice(0, 6);
  const r = (parseInt(full.slice(0, 2), 16) || 0) / 255;
  const g = (parseInt(full.slice(2, 4), 16) || 0) / 255;
  const b = (parseInt(full.slice(4, 6), 16) || 0) / 255;

  const lin = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const lr = lin(r);
  const lg = lin(g);
  const lb = lin(b);

  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  const C = Math.sqrt(A * A + B * B);
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;

  return `oklch(${(L * 100).toFixed(1)}% ${C.toFixed(3)} ${C < 0.004 ? 0 : Math.round(H)})`;
}

export const CURATED_COLOR_PALETTES: CuratedColorPalette[] = [
  {
    id: "pal-stone-terracotta",
    name: "Warm Stone & Terracotta",
    nameEs: "Piedra Cálida y Terracota",
    mode: "light",
    harmony: "Editorial Warm",
    inspiredBy: { name: "treg.to × Happy Hues", url: "https://www.happyhues.co" },
    psychology: "Editorial warmth and immediate human approachability for AI & developer products.",
    psychologyEs: "Calidez editorial y cercanía humana inmediata para herramientas de IA y desarrolladores.",
    keywords: ["agent", "agente", "ai", "ia", "claude", "editorial", "warm", "calido", "docs", "academy", "education"],
    tokens: {
      bg: "#f6f5f1",
      surface: "#ffffff",
      panel: "#eeede7",
      ink: "#161615",
      muted: "#6e6d68",
      line: "rgba(22, 22, 21, 0.09)",
      accent: "#d9653b",
      accentInk: "#ffffff",
      badgeBg: "#eae7df",
    },
  },
  {
    id: "pal-radix-sage",
    name: "Botanical Clinical Sage",
    nameEs: "Salvia Clínica Botánica",
    mode: "light",
    harmony: "Radix 12-Step",
    inspiredBy: { name: "Radix Colors (Sage)", url: "https://www.radix-ui.com/colors" },
    psychology: "Low-cortisol herbal neutrals engineered for healthcare, clinics, therapy & wellness.",
    psychologyEs: "Neutros herbales de bajo estrés visual diseñados para salud, clínicas, medicina y bienestar.",
    keywords: ["clinic", "clinica", "health", "salud", "medic", "dental", "doctor", "patient", "wellness", "terapia", "bio"],
    tokens: {
      bg: "#f6f8f6",
      surface: "#ffffff",
      panel: "#ebf0ec",
      ink: "#111c18",
      muted: "#54645e",
      line: "rgba(17, 28, 24, 0.09)",
      accent: "#1f6f54",
      accentInk: "#ffffff",
      badgeBg: "#e3ece6",
    },
  },
  {
    id: "pal-maritime-ledger",
    name: "Sovereign Maritime Slate",
    nameEs: "Pizarra Marítima Institucional",
    mode: "light",
    harmony: "Perceptual OKLCH",
    inspiredBy: { name: "Atmos.style × Stripe", url: "https://atmos.style" },
    psychology: "High-trust institutional navy-slate with crisp cool-ivory paper for FinTech & treasury.",
    psychologyEs: "Azul marino pizarra de máxima solvencia sobre marfil frío para banca, pagos y tesorería.",
    keywords: ["fintech", "bank", "banca", "pay", "pago", "treasury", "tesoreria", "billing", "factura", "legal", "insurance"],
    tokens: {
      bg: "#f6f9fc",
      surface: "#ffffff",
      panel: "#edf2f7",
      ink: "#0a2540",
      muted: "#475b70",
      line: "rgba(10, 37, 64, 0.09)",
      accent: "#0a2540",
      accentInk: "#ffffff",
      badgeBg: "#e3ebf3",
    },
  },
  {
    id: "pal-carbon-halftone",
    name: "Obsidian Carbon & Pure Chalk",
    nameEs: "Carbón Obsidiana y Tiza",
    mode: "dark",
    harmony: "OLED High-Contrast",
    inspiredBy: { name: "DarkModeDesign × Resiz.es", url: "https://www.darkmodedesign.com" },
    psychology: "Zero-glare stepped dark luminance (#101010 → #181818) for cloud, K8s & security.",
    psychologyEs: "Luminancia oscura escalonada sin brillos neón para infraestructura cloud, DevOps y seguridad.",
    keywords: ["kube", "k8s", "devops", "cloud", "infra", "security", "seguridad", "dark", "oscuro", "server", "terminal"],
    tokens: {
      bg: "#101010",
      surface: "#181818",
      panel: "#202020",
      ink: "#f5f7f5",
      muted: "#9ca09d",
      line: "rgba(245, 247, 245, 0.10)",
      accent: "#ffffff",
      accentInk: "#101010",
      badgeBg: "#252525",
    },
  },
  {
    id: "pal-swiss-alabaster",
    name: "Swiss Gallery Alabaster",
    nameEs: "Alabastro Suizo de Galería",
    mode: "light",
    harmony: "Tinted Neutral",
    inspiredBy: { name: "Realtime Colors × P de Pablo", url: "https://www.realtimecolors.com" },
    psychology: "Pure museum whitespace letting product photography, typography, and geometry breathe.",
    psychologyEs: "Blanco puro de galería que cede todo el protagonismo a la tipografía y al producto.",
    keywords: ["studio", "estudio", "portfolio", "portafolio", "swiss", "suizo", "minimal", "design", "agency", "arquitectura"],
    tokens: {
      bg: "#ffffff",
      surface: "#f8f8f7",
      panel: "#f1f1ef",
      ink: "#0a0a0a",
      muted: "#6b6b68",
      line: "rgba(10, 10, 10, 0.08)",
      accent: "#0a0a0a",
      accentInk: "#ffffff",
      badgeBg: "#f1f1ef",
    },
  },
  {
    id: "pal-sanzo-persimmon",
    name: "Sanzo Wada — Shōwa Silk & Persimmon",
    nameEs: "Sanzo Wada — Seda y Caqui Japonés",
    mode: "light",
    harmony: "Sanzo Wada Dyad",
    inspiredBy: { name: "Sanzo Wada Dictionary (#142)", url: "https://wada-sanzo-colors.com" },
    psychology: "Organic 1930s Japanese print harmony — unmistakable cultural sophistication, zero tech cliché.",
    psychologyEs: "Armonía orgánica japonesa de los años 30: personalidad cultural única lejos del molde SaaS.",
    keywords: ["culture", "cultura", "luxury", "lujo", "fashion", "moda", "food", "gastronomia", "editorial", "magazine", "art", "arte"],
    tokens: {
      bg: "#f5f1e8",
      surface: "#fbf9f4",
      panel: "#ebe4d6",
      ink: "#1f1b18",
      muted: "#6d645b",
      line: "rgba(31, 27, 24, 0.11)",
      accent: "#c4492b",
      accentInk: "#fbf9f4",
      badgeBg: "#e7dfd0",
    },
  },
  {
    id: "pal-sanzo-indigo",
    name: "Sanzo Wada — Raw Linen & Aizome Indigo",
    nameEs: "Sanzo Wada — Lino Crudo e Índigo Aizome",
    mode: "light",
    harmony: "Sanzo Wada Dyad",
    inspiredBy: { name: "Sanzo Wada Dictionary (#089)", url: "https://wada-sanzo-colors.com" },
    psychology: "Deep natural dye indigo over unbleached linen for research labs, publishing & craft brands.",
    psychologyEs: "Índigo natural profundo sobre lino sin blanquear para laboratorios, ensayo y marcas de autor.",
    keywords: ["research", "investigacion", "book", "libro", "writer", "notes", "notas", "craft", "japan", "ciencia", "science"],
    tokens: {
      bg: "#f4f2ec",
      surface: "#faf9f5",
      panel: "#e8e5dc",
      ink: "#16202a",
      muted: "#5b6570",
      line: "rgba(22, 32, 42, 0.10)",
      accent: "#1d3b58",
      accentInk: "#faf9f5",
      badgeBg: "#e3dfd4",
    },
  },
  {
    id: "pal-rams-industrial",
    name: "Dieter Rams Anodized & Signal Orange",
    nameEs: "Aluminio Braun y Naranja Señal",
    mode: "light",
    harmony: "Tinted Neutral",
    inspiredBy: { name: "Huemint × Teenage Eng.", url: "https://huemint.com" },
    psychology: "Tactile machined aluminum grey with a single mechanical #ff4d00 actuator key.",
    psychologyEs: "Chasis de aluminio anodizado con un único acento mecánico #ff4d00 de precisión industrial.",
    keywords: ["hardware", "robotics", "robotica", "audio", "music", "iot", "industrial", "cli", "rust", "edge", "local"],
    tokens: {
      bg: "#e8e6e1",
      surface: "#f3f1ec",
      panel: "#dcd9d2",
      ink: "#141413",
      muted: "#5c5a55",
      line: "rgba(20, 20, 19, 0.14)",
      accent: "#ff4d00",
      accentInk: "#ffffff",
      badgeBg: "#dad7cf",
    },
  },
  {
    id: "pal-radix-jade-dark",
    name: "Obsidian Forest & Phosphor Jade",
    nameEs: "Bosque Obsidiana y Jade Fósforo",
    mode: "dark",
    harmony: "Radix 12-Step",
    inspiredBy: { name: "Radix Colors (Jade Dark)", url: "https://www.radix-ui.com/colors" },
    psychology: "Deep pine-tinted dark mode with crisp emerald verification cues for databases & APIs.",
    psychologyEs: "Modo oscuro tintado en pino profundo con acento esmeralda técnico para bases de datos y APIs.",
    keywords: ["database", "postgres", "sql", "supabase", "neon", "api", "data", "datos", "energy", "energia", "climate", "clima"],
    tokens: {
      bg: "#0b110e",
      surface: "#121b17",
      panel: "#192520",
      ink: "#ecf5f0",
      muted: "#8da398",
      line: "rgba(236, 245, 240, 0.09)",
      accent: "#27b07d",
      accentInk: "#07130e",
      badgeBg: "#1c2b24",
    },
  },
  {
    id: "pal-oklch-cobalt",
    name: "Perceptual OKLCH Crisp Cobalt",
    nameEs: "Cobalto Perceptual OKLCH",
    mode: "light",
    harmony: "Perceptual OKLCH",
    inspiredBy: { name: "OKLCH.fyi × UI Colors", url: "https://oklch.fyi" },
    psychology: "Zero-purple pure international cobalt calibrated in OKLCH for high-converting B2B SaaS.",
    psychologyEs: "Cobalto puro internacional calibrado en OKLCH (sin deriva morada) para SaaS B2B de alta conversión.",
    keywords: ["saas", "b2b", "crm", "sales", "ventas", "productivity", "workflow", "team", "enterprise", "analytics"],
    tokens: {
      bg: "#fbfcfd",
      surface: "#ffffff",
      panel: "#f1f4f9",
      ink: "#0f172a",
      muted: "#526077",
      line: "rgba(15, 23, 42, 0.09)",
      accent: "#1d4ed8",
      accentInk: "#ffffff",
      badgeBg: "#e6ecf7",
    },
  },
  {
    id: "pal-kinetic-chartreuse",
    name: "Velvet Asphalt & Acid Chartreuse",
    nameEs: "Asfalto Terciopelo y Chartreuse Ácido",
    mode: "dark",
    harmony: "OLED High-Contrast",
    inspiredBy: { name: "2Colors × Godly", url: "https://2colors.colorion.co" },
    psychology: "High-adrenaline event, gaming, fitness & launch kinetic energy with 14:1 CTA legibility.",
    psychologyEs: "Energía cinética de alto impacto para lanzamientos, vídeo, música, deporte y conferencias.",
    keywords: ["event", "evento", "launch", "gaming", "sport", "deporte", "fitness", "video", "creator", "conference"],
    tokens: {
      bg: "#0c0c0b",
      surface: "#151513",
      panel: "#1e1e1b",
      ink: "#f5f4ef",
      muted: "#9a988f",
      line: "rgba(245, 244, 239, 0.11)",
      accent: "#e4ff3f",
      accentInk: "#0c0c0b",
      badgeBg: "#252520",
    },
  },
  {
    id: "pal-nordic-sand",
    name: "Nordic Cashflow Sand",
    nameEs: "Arena Nórdica Operativa",
    mode: "light",
    harmony: "Tinted Neutral",
    inspiredBy: { name: "Coolors × Midday", url: "https://coolors.co" },
    psychology: "Calm Scandinavian matte limestone reducing cognitive fatigue in daily accounting & ops.",
    psychologyEs: "Piedra caliza escandinava mate que elimina la fatiga visual en herramientas de uso diario.",
    keywords: ["accounting", "contabilidad", "ops", "operaciones", "founder", "calm", "calendar", "agenda", "hr", "rrhh", "payroll", "nomina"],
    tokens: {
      bg: "#f8f8f6",
      surface: "#ffffff",
      panel: "#f0f0ec",
      ink: "#121211",
      muted: "#6e6d68",
      line: "rgba(18, 18, 17, 0.08)",
      accent: "#121211",
      accentInk: "#ffffff",
      badgeBg: "#eaeae5",
    },
  },
  {
    id: "pal-espresso-gold",
    name: "Roastery Espresso & Warm Brass",
    nameEs: "Espresso Tostado y Latón Cálido",
    mode: "dark",
    harmony: "Editorial Warm",
    inspiredBy: { name: "Happy Hues × Atmos", url: "https://www.happyhues.co" },
    psychology: "Rich organic dark walnut & brushed brass for hospitality, private wealth, legal & luxury.",
    psychologyEs: "Nogal oscuro orgánico y latón cepillado para patrimonio privado, hostelería, legal y marcas premium.",
    keywords: ["wealth", "patrimonio", "hotel", "hospitality", "real estate", "inmobiliaria", "wine", "coffee", "private", "luxury", "abogados"],
    tokens: {
      bg: "#12100e",
      surface: "#1b1815",
      panel: "#24201c",
      ink: "#f5f0e8",
      muted: "#a39a8e",
      line: "rgba(245, 240, 232, 0.10)",
      accent: "#d4a359",
      accentInk: "#12100e",
      badgeBg: "#2a2520",
    },
  },
  {
    id: "pal-zinc-specular",
    name: "Precision Zinc & Titanium",
    nameEs: "Zinc de Precisión y Titanio",
    mode: "dark",
    harmony: "Radix 12-Step",
    inspiredBy: { name: "Radix Colors (Slate Dark)", url: "https://www.radix-ui.com/colors" },
    psychology: "Machined desktop-grade zinc neutrality built for IDEs, AI editors, and command palettes.",
    psychologyEs: "Neutralidad de zinc mecanizado ideal para editores de código, copilotos y apps de escritorio.",
    keywords: ["ide", "editor", "code", "codigo", "cursor", "linear", "desktop", "mac", "productivity", "shortcut"],
    tokens: {
      bg: "#09090b",
      surface: "#121215",
      panel: "#1a1a1f",
      ink: "#fafafa",
      muted: "#9e9ea8",
      line: "rgba(255, 255, 255, 0.08)",
      accent: "#fafafa",
      accentInk: "#09090b",
      badgeBg: "#25252b",
    },
  },
  {
    id: "pal-newsprint-crimson",
    name: "Financial Broadsheet Salmon & Ink",
    nameEs: "Papel Salmón Editorial y Tinta",
    mode: "light",
    harmony: "Editorial Warm",
    inspiredBy: { name: "ColorLisa × FT Editorial", url: "https://www.happyhues.co" },
    psychology: "Iconic financial-journalism warm newsprint with authoritative serif contrast.",
    psychologyEs: "Papel prensa financiero clásico de altísima autoridad intelectual para medios, datos y análisis.",
    keywords: ["news", "media", "medios", "newsletter", "journal", "economia", "economy", "market", "mercado", "intelligence", "report"],
    tokens: {
      bg: "#fbf3eb",
      surface: "#fffaf5",
      panel: "#f2e6da",
      ink: "#1c1917",
      muted: "#696059",
      line: "rgba(28, 25, 23, 0.11)",
      accent: "#991b1b",
      accentInk: "#fffaf5",
      badgeBg: "#efe1d3",
    },
  },
  {
    id: "pal-arctic-teal",
    name: "Cleanroom Glacier & Deep Teal",
    nameEs: "Glaciar Limpio y Verde Azulado",
    mode: "light",
    harmony: "Perceptual OKLCH",
    inspiredBy: { name: "Adobe Leonardo × OKLCH", url: "https://leonardocolor.io" },
    psychology: "Crisp scientific precision calibrated for biotech, clean-tech, solar & analytics.",
    psychologyEs: "Claridad científica calibrada perceptualmente para biotecnología, energía solar, clima y analítica.",
    keywords: ["biotech", "solar", "clean", "science", "analytics", "analitica", "iot", "sensor", "logistics", "logistica"],
    tokens: {
      bg: "#f5f8f8",
      surface: "#ffffff",
      panel: "#e9f0f0",
      ink: "#0f1f22",
      muted: "#51666a",
      line: "rgba(15, 31, 34, 0.09)",
      accent: "#0f766e",
      accentInk: "#ffffff",
      badgeBg: "#e0ecec",
    },
  },
  {
    id: "pal-harmonizer-emerald",
    name: "Evil Martians Harmonizer Emerald",
    nameEs: "Esmeralda Perceptual Harmonizer OKLCH",
    mode: "light",
    harmony: "Perceptual OKLCH",
    inspiredBy: { name: "Evil Martians Harmonizer", url: "https://harmonizer.evilmartians.com" },
    psychology: "APCA-verified perceptual emerald over cool porcelain for developer tools, CI/CD & verification.",
    psychologyEs: "Esmeralda perceptual verificado con APCA sobre porcelana fría para CI/CD, testing y developer tools.",
    keywords: ["ci", "testing", "verification", "status", "harmonizer", "oklch", "developer", "open source"],
    tokens: {
      bg: "#f7f9f8",
      surface: "#ffffff",
      panel: "#edf2ef",
      ink: "#101b16",
      muted: "#52635b",
      line: "rgba(16, 27, 22, 0.09)",
      accent: "#0d7a52",
      accentInk: "#ffffff",
      badgeBg: "#e1ece6",
    },
  },
  {
    id: "pal-anthropic-parchment",
    name: "Research Parchment & Burnt Sienna",
    nameEs: "Pergamino de Investigación y Siena Tostado",
    mode: "light",
    harmony: "Editorial Warm",
    inspiredBy: { name: "Anthropic × Skilljar", url: "https://anthropic.skilljar.com" },
    psychology: "Literary ivory parchment eliminating cold screen glare for AI safety, education, and knowledge products.",
    psychologyEs: "Pergamino literario cálido sin fatiga de pantalla para IA, educación, academias y ensayo.",
    keywords: ["claude", "anthropic", "course", "academy", "learning", "research", "safety", "ai", "book"],
    tokens: {
      bg: "#faf8f4",
      surface: "#ffffff",
      panel: "#f0ece2",
      ink: "#191816",
      muted: "#6b665e",
      line: "rgba(25, 24, 22, 0.09)",
      accent: "#c95a38",
      accentInk: "#ffffff",
      badgeBg: "#ebe5d8",
    },
  },
  {
    id: "pal-vercel-monochrome",
    name: "Geist Pure Monochrome OLED",
    nameEs: "Monocromo Puro Geist OLED",
    mode: "dark",
    harmony: "OLED High-Contrast",
    inspiredBy: { name: "Vercel Geist System", url: "https://vercel.com/geist" },
    psychology: "Absolute #000000 canvas with surgical 1px hairline borders and 21:1 optical contrast.",
    psychologyEs: "Lienzo #000000 absoluto con rejilla quirúrgica de 1px y contraste máximo para compiladores y cloud.",
    keywords: ["vercel", "nextjs", "edge", "compiler", "monochrome", "oled", "black", "deploy"],
    tokens: {
      bg: "#000000",
      surface: "#0a0a0a",
      panel: "#141414",
      ink: "#ededed",
      muted: "#888888",
      line: "rgba(255, 255, 255, 0.12)",
      accent: "#ffffff",
      accentInk: "#000000",
      badgeBg: "#1a1a1a",
    },
  },
  {
    id: "pal-linear-graphite",
    name: "Sub-Pixel Graphite & Perceptual Sapphire",
    nameEs: "Grafito Sub-Píxel y Zafiro Perceptual",
    mode: "dark",
    harmony: "Perceptual OKLCH",
    inspiredBy: { name: "Linear LCH System", url: "https://linear.app" },
    psychology: "Cool graphite elevation layers with a crisp zero-purple sapphire action cue for high-velocity product teams.",
    psychologyEs: "Capas de grafito frío con acento zafiro perceptual sin deriva morada para software de producto.",
    keywords: ["linear", "roadmap", "issues", "project", "velocity", "graphite", "dark", "saas"],
    tokens: {
      bg: "#08090a",
      surface: "#111315",
      panel: "#191c1f",
      ink: "#f7f8f8",
      muted: "#8a8f98",
      line: "rgba(255, 255, 255, 0.08)",
      accent: "#2563eb",
      accentInk: "#ffffff",
      badgeBg: "#1e2329",
    },
  },
  {
    id: "pal-apple-titanium",
    name: "Natural Titanium & System Cobalt",
    nameEs: "Titanio Natural y Azul Sistema",
    mode: "light",
    harmony: "Tinted Neutral",
    inspiredBy: { name: "Apple HIG Materials", url: "https://developer.apple.com/design" },
    psychology: "Hardware-grade neutral silver-stone paired with accessible system blue for universal clarity.",
    psychologyEs: "Plata piedra de grado hardware con azul sistema de máxima legibilidad para apps de consumo y Mac.",
    keywords: ["mac", "ios", "consumer", "app", "titanium", "hardware", "clean", "universal"],
    tokens: {
      bg: "#f5f5f7",
      surface: "#ffffff",
      panel: "#e8e8ed",
      ink: "#1d1d1f",
      muted: "#6e6e73",
      line: "rgba(29, 29, 31, 0.09)",
      accent: "#0066cc",
      accentInk: "#ffffff",
      badgeBg: "#e5e5ea",
    },
  },
  {
    id: "pal-coss-alabaster",
    name: "COSS Particle Chalk & Charcoal",
    nameEs: "Tiza Limpia y Carbón COSS",
    mode: "light",
    harmony: "Tinted Neutral",
    inspiredBy: { name: "COSS UI × Origin UI", url: "https://coss.com/ui" },
    psychology: "Ultra-restrained border-driven component canvas where data density and typography lead.",
    psychologyEs: "Lienzo minimalista guiado por bordes sutiles donde mandan los datos y la tipografía.",
    keywords: ["shadcn", "components", "coss", "origin", "forms", "settings", "minimal", "admin"],
    tokens: {
      bg: "#fafafa",
      surface: "#ffffff",
      panel: "#f4f4f5",
      ink: "#09090b",
      muted: "#71717a",
      line: "rgba(9, 9, 11, 0.08)",
      accent: "#18181b",
      accentInk: "#fafafa",
      badgeBg: "#f4f4f5",
    },
  },
  {
    id: "pal-velvet-bordeaux",
    name: "Atelier Cream & Deep Bordeaux",
    nameEs: "Crema de Atelier y Burdeos Profundo",
    mode: "light",
    harmony: "Sanzo Wada Dyad",
    inspiredBy: { name: "Refs.Gallery × Sanzo Wada", url: "https://refs.gallery" },
    psychology: "Tactile cotton paper paired with vintage burgundy ink for gastronomy, architecture & boutique studios.",
    psychologyEs: "Papel algodón táctil con tinta burdeos clásica para gastronomía, arquitectura, vino y estudios.",
    keywords: ["wine", "vino", "restaurant", "restaurante", "atelier", "architecture", "boutique", "fashion"],
    tokens: {
      bg: "#f7f4ef",
      surface: "#fcfbf8",
      panel: "#ede7dd",
      ink: "#1e1618",
      muted: "#6c5d60",
      line: "rgba(30, 22, 24, 0.10)",
      accent: "#7a1c2e",
      accentInk: "#fcfbf8",
      badgeBg: "#e8e0d4",
    },
  },
  {
    id: "pal-field-ochre",
    name: "Industrial Field Ochre & Matte Slate",
    nameEs: "Ocre Industrial de Campo y Pizarra Mate",
    mode: "light",
    harmony: "Editorial Warm",
    inspiredBy: { name: "Teenage Field × Work Louder", url: "https://teenage.engineering" },
    psychology: "Utilitarian field-instrument sand & high-contrast slate with warm amber hardware cues.",
    psychologyEs: "Arena técnica de instrumento de campo y pizarra mate para energía, construcción, clima e industria.",
    keywords: ["industrial", "construction", "arquitectura", "energy", "field", "climate", "hardware", "supply"],
    tokens: {
      bg: "#f1efe9",
      surface: "#faf9f5",
      panel: "#e5e2d9",
      ink: "#181918",
      muted: "#5f615d",
      line: "rgba(24, 25, 24, 0.12)",
      accent: "#b45309",
      accentInk: "#ffffff",
      badgeBg: "#e0ddd2",
    },
  },
];
