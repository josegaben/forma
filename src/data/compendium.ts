export interface RareComponentItem {
  id: string;
  name: string;
  category: "AI Kit" | "Display" | "Navigation" | "Inputs" | "Feedback";
  isNew?: boolean;
  provider: string;
  providerUrl: string;
  description: string;
  descriptionEs: string;
  cliInstall: string;
  keywords: string[];
  previewKind:
    | "fluid-orb"
    | "prompt-box"
    | "streaming-text"
    | "folder-3d"
    | "rail-toc"
    | "gooey-nav"
    | "animated-counter"
    | "spring-drawer"
    | "morph-toast"
    | "command-menu"
    | "duration-scrub"
    | "keycap-cta";
  codeSnippet: string;
}

export interface TypographyPairing {
  id: string;
  name: string;
  vibe: string;
  vibeEs: string;
  displayFont: string;
  bodyFont: string;
  monoFont: string;
  sampleHeading: string;
  cssImport: string;
  keywords: string[];
}

export interface CraftAssetItem {
  id: string;
  name: string;
  kind: "Icons" | "Shaders & 3D" | "Textures" | "Motion Lib" | "Logos & SVG";
  url: string;
  installOrUsage: string;
  whyUseIt: string;
  whyUseItEs: string;
}

export const RARE_COMPONENTS: RareComponentItem[] = [
  {
    id: "rare-prompt-box",
    name: "AI Prompt Box",
    category: "AI Kit",
    isNew: true,
    provider: "Rare UI",
    providerUrl: "https://www.rareui.com/components/promptbox",
    description: "Multi-modal composer with inline model selector pill, attachment chip, and tactile submit key.",
    descriptionEs: "Caja de prompt multimodal con selector de modelo integrado, chips de contexto y envío táctil.",
    cliInstall: "npx shadcn@latest add @rare-ui/prompt-box",
    keywords: ["ai", "agent", "chat", "copilot", "assistant", "llm", "prompt", "search", "agente", "ia"],
    previewKind: "prompt-box",
    codeSnippet: `export function AiPromptBox({ onSubmit }: { onSubmit?: (q: string) => void }) {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSubmit?.("Synthesize"); }}
      className="rounded-2xl border border-black/10 bg-white p-2.5 shadow-sm focus-within:border-black/30 transition-colors"
    >
      <textarea
        rows={2}
        placeholder="Ask your agent anything..."
        className="w-full resize-none bg-transparent px-2 py-1 text-sm focus:outline-none"
      />
      <div className="flex items-center justify-between pt-2 border-t border-black/5">
        <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-[11px] font-mono">Claude 4 · Fast</span>
        <button type="submit" className="px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-medium">
          Send ↑
        </button>
      </div>
    </form>
  );
}`,
  },
  {
    id: "rare-fluid-orb",
    name: "Fluid Orb",
    category: "AI Kit",
    isNew: true,
    provider: "Rare UI",
    providerUrl: "https://www.rareui.com/components/fluidorb",
    description: "Organic voice & ambient AI presence orb with smooth GPU state transitions and color swatches.",
    descriptionEs: "Orbe fluido orgánico para agentes de voz e IA ambiental con transiciones suaves en GPU.",
    cliInstall: "npx shadcn@latest add @rare-ui/fluid-orb",
    keywords: ["voice", "voz", "audio", "clinic", "clinica", "receptionist", "assistant", "orb", "ai"],
    previewKind: "fluid-orb",
    codeSnippet: `export function FluidVoiceOrb({ color = "#E06D44" }: { color?: string }) {
  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <div
        className="absolute inset-0 rounded-full blur-md opacity-45 motion-safe:animate-pulse"
        style={{ background: \`radial-gradient(circle at 35% 35%, #fff, \${color})\` }}
      />
      <div
        className="relative w-12 h-12 rounded-full shadow-inner border border-white/30"
        style={{ background: \`radial-gradient(circle at 30% 30%, #ffffff 0%, \${color} 68%, #141413 100%)\` }}
      />
    </div>
  );
}`,
  },
  {
    id: "rare-folder-3d",
    name: "3D Fan Folder",
    category: "Display",
    provider: "Rare UI",
    providerUrl: "https://www.rareui.com/components/foldercomponent",
    description: "Tactile document folder whose inner sheets fan out on hover with 3D perspective tilt.",
    descriptionEs: "Carpeta interactiva cuyas hojas internas se despliegan en abanico al pasar el cursor.",
    cliInstall: "npx shadcn@latest add @rare-ui/folder-component",
    keywords: ["docs", "files", "vault", "workspace", "portfolio", "studio", "knowledge", "archivos", "estudio"],
    previewKind: "folder-3d",
    codeSnippet: `export function TactileFolder({ label = "Brand Kit" }: { label?: string }) {
  return (
    <div className="group relative w-28 h-22 cursor-pointer select-none">
      <div className="absolute inset-x-2 top-1 h-14 rounded-lg bg-white border border-black/15 shadow-xs transition-transform duration-200 group-hover:-translate-y-3 group-hover:-rotate-6" />
      <div className="absolute inset-x-2 top-1.5 h-14 rounded-lg bg-neutral-50 border border-black/15 shadow-xs transition-transform duration-200 group-hover:-translate-y-4 group-hover:rotate-6" />
      <div className="absolute inset-x-0 bottom-0 h-14 rounded-xl bg-neutral-900 text-white p-2.5 flex items-end text-[11px] font-medium shadow-md">
        {label}
      </div>
    </div>
  );
}`,
  },
  {
    id: "rare-streaming-response",
    name: "Streaming Response & Status",
    category: "AI Kit",
    isNew: true,
    provider: "Rare UI",
    providerUrl: "https://www.rareui.com/components/streamingresponse",
    description: "Token-by-token cadence renderer with inline reasoning disclosure and zero layout jump.",
    descriptionEs: "Renderizador de respuesta en streaming con estado de razonamiento colapsable sin saltos CLS.",
    cliInstall: "npx shadcn@latest add @rare-ui/streaming-response",
    keywords: ["ai", "streaming", "llm", "reasoning", "search", "chat", "copilot", "docs"],
    previewKind: "streaming-text",
    codeSnippet: `export function InlineAiStatus({ step = "Synthesizing tokens..." }: { step?: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-black/8 text-xs font-mono text-neutral-700">
      <span className="w-1.5 h-1.5 rounded-full bg-[#E06D44] motion-safe:animate-ping" />
      <span>{step}</span>
    </div>
  );
}`,
  },
  {
    id: "rare-rail-toc",
    name: "Rail Table of Contents",
    category: "Navigation",
    provider: "Rare UI",
    providerUrl: "https://www.rareui.com/components/railtoc",
    description: "Minimalist architectural ruler TOC indicator tracking reading progress along section headings.",
    descriptionEs: "Índice lateral tipo regla arquitectónica que marca el progreso exacto de lectura.",
    cliInstall: "npx shadcn@latest add @rare-ui/rail-toc",
    keywords: ["docs", "documentation", "blog", "essay", "academy", "article", "manifesto", "lectura"],
    previewKind: "rail-toc",
    codeSnippet: `export function RailToc({ items, active = 0 }: { items: string[]; active?: number }) {
  return (
    <nav aria-label="Sections" className="border-l border-black/12 pl-3 space-y-2 text-xs">
      {items.map((item, idx) => (
        <div key={item} className={idx === active ? "font-semibold text-neutral-950" : "text-neutral-400"}>
          {item}
        </div>
      ))}
    </nav>
  );
}`,
  },
  {
    id: "rare-gooey-nav",
    name: "Sliding Pill Navigation",
    category: "Navigation",
    provider: "Rare UI × Motion Primitives",
    providerUrl: "https://www.rareui.com/components/gooeynav",
    description: "Floating segmented pill bar with spring-driven shared-layout active backdrop.",
    descriptionEs: "Barra flotante en píldora con indicador activo fluido mediante física spring.",
    cliInstall: "npx shadcn@latest add @rare-ui/gooey-nav",
    keywords: ["nav", "navbar", "dock", "tabs", "header", "portfolio", "saas", "studio"],
    previewKind: "gooey-nav",
    codeSnippet: `export function SegmentedPillNav({ tabs, active, onChange }: { tabs: string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div className="inline-flex p-1 rounded-full bg-neutral-100 border border-black/8">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={\`px-3 py-1 rounded-full text-xs font-medium transition-all \${active === tab ? "bg-neutral-900 text-white shadow-xs" : "text-neutral-600"}\`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}`,
  },
  {
    id: "rare-animated-counter",
    name: "Tabular Metric Ticker",
    category: "Display",
    provider: "Rare UI × 21st.dev",
    providerUrl: "https://www.rareui.com/components/animatedcounter",
    description: "Zero-jitter `tabular-nums` rolling digit counter for FinTech ledgers, latencies, and pricing.",
    descriptionEs: "Contador numérico con `tabular-nums` sin temblor horizontal para FinTech, precios y latencias.",
    cliInstall: "npx shadcn@latest add @rare-ui/animated-counter",
    keywords: ["fintech", "finance", "pay", "metrics", "analytics", "dashboard", "pricing", "billing", "kpi"],
    previewKind: "animated-counter",
    codeSnippet: `export function MetricStat({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="p-3.5 rounded-xl bg-white border border-black/8">
      <div className="text-[11px] font-mono text-neutral-500 uppercase">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-xl font-semibold tabular-nums tracking-tight">{value}</span>
        {delta && <span className="text-[11px] font-mono text-emerald-700">{delta}</span>}
      </div>
    </div>
  );
}`,
  },
  {
    id: "vaul-spring-drawer",
    name: "iOS Physics Sheet Drawer",
    category: "Feedback",
    provider: "Vaul (Emil Kowalski)",
    providerUrl: "https://vaul.emilkowal.ski",
    description: "Gesture-driven bottom/side drawer using `cubic-bezier(0.32, 0.72, 0, 1)` deceleration.",
    descriptionEs: "Drawer táctil con física de hoja nativa iOS y cierre por gesto o clic exterior.",
    cliInstall: "npm install vaul",
    keywords: ["mobile", "drawer", "modal", "sheet", "onboarding", "settings", "app", "clinic", "booking"],
    previewKind: "spring-drawer",
    codeSnippet: `// Powered by vaul — cubic-bezier(0.32, 0.72, 0, 1)
import { Drawer } from "vaul";

export function QuickSheet({ trigger, children }: { trigger: string; children: React.ReactNode }) {
  return (
    <Drawer.Root>
      <Drawer.Trigger className="px-3.5 py-1.5 rounded-full bg-neutral-900 text-white text-xs">{trigger}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 rounded-t-2xl bg-white p-6">{children}</Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}`,
  },
  {
    id: "rare-morph-toast",
    name: "Stacked Morphing Toast",
    category: "Feedback",
    isNew: true,
    provider: "Rare UI × Sonner",
    providerUrl: "https://www.rareui.com/components/toast",
    description: "Non-blocking stacked notification cards that fan out smoothly on pointer hover.",
    descriptionEs: "Notificaciones apiladas no intrusivas que se expanden suavemente al acercar el cursor.",
    cliInstall: "npx shadcn@latest add @rare-ui/toast",
    keywords: ["toast", "notification", "feedback", "alert", "saas", "app", "devops", "deploy"],
    previewKind: "morph-toast",
    codeSnippet: `// Zero-interruption toast confirmation
export function DeployToast({ message = "Deployed to edge in 420ms" }: { message?: string }) {
  return (
    <div role="status" className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-neutral-950 text-white text-xs shadow-lg">
      <span className="w-2 h-2 rounded-full bg-emerald-400" />
      <span className="font-mono">{message}</span>
    </div>
  );
}`,
  },
  {
    id: "cmdk-palette",
    name: "Split-Preview Command Menu (⌘K)",
    category: "Navigation",
    provider: "cmdk × Rare UI",
    providerUrl: "https://cmdk.paco.me",
    description: "Instant keyboard-first command palette with live right-hand visual preview pane.",
    descriptionEs: "Paleta de comandos `⌘K` instantánea con panel derecho de previsualización en vivo.",
    cliInstall: "npx shadcn@latest add command",
    keywords: ["command", "search", "keyboard", "ide", "developer", "linear", "raycast", "bento", "docs"],
    previewKind: "command-menu",
    codeSnippet: `// Triggered via ⌘K / Ctrl+K using native <dialog closedby="any">
export function CommandTrigger({ onOpen }: { onOpen: () => void }) {
  return (
    <button onClick={onOpen} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/12 text-xs text-neutral-600">
      <span>Search...</span>
      <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 font-mono text-[10px]">⌘K</kbd>
    </button>
  );
}`,
  },
  {
    id: "rare-duration-picker",
    name: "Precision Wheel / Duration Scrubber",
    category: "Inputs",
    provider: "Rare UI",
    providerUrl: "https://www.rareui.com/components/durationpicker",
    description: "Tactile ruler/detent scrubber input for scheduling, audio/video timelines, and SLAs.",
    descriptionEs: "Selector táctil con muescas de precisión para reservas, horarios, audio y umbrales.",
    cliInstall: "npx shadcn@latest add @rare-ui/duration-picker",
    keywords: ["schedule", "calendar", "booking", "citas", "clinic", "audio", "video", "time", "input"],
    previewKind: "duration-scrub",
    codeSnippet: `export function DetentScrubber({ value = 30 }: { value?: number }) {
  return (
    <div className="p-3 rounded-xl bg-neutral-100 flex items-center justify-between gap-3">
      <span className="text-xs font-mono font-medium tabular-nums">{value} min</span>
      <div className="flex items-end gap-1 h-4">
        {[40, 65, 100, 65, 40, 85, 50, 40].map((h, i) => (
          <span key={i} className="w-0.5 bg-neutral-900 rounded-full" style={{ height: \`\${h}%\`, opacity: h === 100 ? 1 : 0.3 }} />
        ))}
      </div>
    </div>
  );
}`,
  },
  {
    id: "tactile-keycap-cta",
    name: "Mechanical Keycap Button",
    category: "Inputs",
    provider: "Origin UI × Industrial",
    providerUrl: "https://originui.com",
    description: "Physical 2px beveled keycap button with crisp `60ms` `:active` depression travel.",
    descriptionEs: "Botón mecánico biselado con recorrido físico de `2px` al pulsar.",
    cliInstall: "npx shadcn@latest add button",
    keywords: ["hardware", "cli", "rust", "industrial", "developer", "gaming", "audio", "teenage"],
    previewKind: "keycap-cta",
    codeSnippet: `export function KeycapButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="px-4 py-2 rounded-md bg-[#ff4d00] text-white text-xs font-mono font-medium border border-neutral-900 shadow-[0_2px_0_#141413] active:translate-y-[2px] active:shadow-none transition-all duration-75"
    >
      {children}
    </button>
  );
}`,
  },
];

export const TYPOGRAPHY_PAIRINGS: TypographyPairing[] = [
  {
    id: "pair-newsreader-geist",
    name: "Newsreader + Geist + DM Mono",
    vibe: "Silicon Valley Editorial Router (treg.to / Anthropic grade)",
    vibeEs: "Editorial tecnológico de máxima claridad (estilo treg.to / Anthropic)",
    displayFont: "Newsreader",
    bodyFont: "Geist",
    monoFont: "DM Mono",
    sampleHeading: "OpenRouter for web design",
    cssImport: "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Geist:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&display=swap",
    keywords: ["agent", "ai", "editorial", "docs", "clinic", "health", "research", "legal"],
  },
  {
    id: "pair-geist-instrument",
    name: "Geist + Instrument Serif Italic",
    vibe: "Dark Infrastructure with Human Accent (resiz.es grade)",
    vibeEs: "Infraestructura seria con guiño editorial en cursiva (estilo resiz.es)",
    displayFont: "Geist + Instrument Serif",
    bodyFont: "Geist",
    monoFont: "JetBrains Mono",
    sampleHeading: "Operate your stack seamlessly",
    cssImport: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400;500&display=swap",
    keywords: ["cloud", "kube", "devops", "infra", "security", "saas", "b2b", "dark"],
  },
  {
    id: "pair-swiss-grotesk",
    name: "Plus Jakarta / Suisse + Geist Mono",
    vibe: "Pure Swiss Studio & Product Precision (pdepablo / Linear grade)",
    vibeEs: "Rigor suizo limpio para estudios creativos y producto digital",
    displayFont: "Plus Jakarta Sans",
    bodyFont: "Inter / Geist",
    monoFont: "Geist Mono",
    sampleHeading: "Design systems with permanence",
    cssImport: "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@500;600;700&display=swap",
    keywords: ["studio", "portfolio", "minimal", "fintech", "pay", "bank", "product"],
  },
  {
    id: "pair-space-industrial",
    name: "Space Grotesk + JetBrains Mono",
    vibe: "Tactile Hardware, Robotics & Kinetic Events",
    vibeEs: " Carácter técnico industrial para hardware, robótica, audio y eventos",
    displayFont: "Space Grotesk",
    bodyFont: "Geist",
    monoFont: "JetBrains Mono",
    sampleHeading: "Field-ready local inference [01]",
    cssImport: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;600;700&display=swap",
    keywords: ["hardware", "robotics", "cli", "rust", "event", "gaming", "audio", "kinetic"],
  },
  {
    id: "pair-fraunces-monograph",
    name: "Fraunces Soft Serif + Geist",
    vibe: "Warm Cultural Brand, Hospitality & Consumer Craft",
    vibeEs: "Personalidad cálida orgánica para marcas de consumo, cultura y lujo",
    displayFont: "Fraunces",
    bodyFont: "Geist",
    monoFont: "DM Mono",
    sampleHeading: "Crafted for quiet mornings",
    cssImport: "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400&family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&family=Geist:wght@400;500&display=swap",
    keywords: ["luxury", "fashion", "culture", "food", "wellness", "consumer", "hotel"],
  },
  {
    id: "pair-bricolage-indie",
    name: "Bricolage Grotesque + Space Mono",
    vibe: "Expressive Indie Product & Neo-Brutalist Poster",
    vibeEs: "Expresividad indie distintiva que rompe el molde corporativo",
    displayFont: "Bricolage Grotesque",
    bodyFont: "Geist",
    monoFont: "Space Mono",
    sampleHeading: "Software with sharp opinions",
    cssImport: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700&family=Geist:wght@400;500&family=Space+Mono:wght@400;700&display=swap",
    keywords: ["indie", "creator", "podcast", "media", "brutalist", "poster", "bold"],
  },
];

export const CRAFT_TOOLS_AND_ASSETS: CraftAssetItem[] = [
  {
    id: "asset-phosphor",
    name: "Phosphor Icons",
    kind: "Icons",
    url: "https://phosphoricons.com",
    installOrUsage: "npm i @phosphor-icons/react",
    whyUseIt: "6 consistent weights (`light`, `regular`, `duotone`) that break away from default Lucide AI-slop.",
    whyUseItEs: "6 grosores (`light`, `duotone`) que evitan el aspecto genérico de iconos de IA.",
  },
  {
    id: "asset-radix-icons",
    name: "Radix UI Icons",
    kind: "Icons",
    url: "https://www.radix-ui.com/icons",
    installOrUsage: "npm i @radix-ui/react-icons",
    whyUseIt: "Crisp 15×15px pixel-aligned icons engineered specifically for dense product toolbars & tables.",
    whyUseItEs: "Iconos de 15×15px alineados al píxel para barras de herramientas y tablas densas.",
  },
  {
    id: "asset-svgl",
    name: "SVGL (Tech Brand Logos)",
    kind: "Logos & SVG",
    url: "https://svgl.app",
    installOrUsage: "npx svgl-cli / https://svgl.app/api",
    whyUseIt: "Clean official light/dark SVG logos for 400+ tech brands, models, and clouds via API/MCP.",
    whyUseItEs: "Logos SVG oficiales en versión clara/oscura de +400 marcas tech listos por API.",
  },
  {
    id: "asset-paper-shaders",
    name: "Paper Design Shaders",
    kind: "Shaders & 3D",
    url: "https://shaders.paper.design",
    installOrUsage: "npm i @paper-design/shaders-react",
    whyUseIt: "Zero-bloat 60fps WebGL mesh, dithering, halftone, and liquid metal shaders for React.",
    whyUseItEs: "Shaders WebGL ligeros a 60fps (dithering, halftone, metal líquido) listos para React.",
  },
  {
    id: "asset-unicorn-studio",
    name: "Unicorn Studio",
    kind: "Shaders & 3D",
    url: "https://www.unicorn.studio",
    installOrUsage: "Embed SDK / WebGL Scene JSON",
    whyUseIt: "Interactive WebGL lighting, raycasting & glass scenes frequently featured on Godly & Awwwards.",
    whyUseItEs: "Escenas WebGL interactivas de iluminación y refracción habituales en Awwwards y Godly.",
  },
  {
    id: "asset-cobe",
    name: "Cobe (5kB WebGL Globe)",
    kind: "Shaders & 3D",
    url: "https://cobe.vercel.app",
    installOrUsage: "npm i cobe",
    whyUseIt: "Vercel's ultra-lightweight 5kB dotted WebGL globe for edge/cloud latency visualizations.",
    whyUseItEs: "Globo WebGL punteado de solo 5kB creado por Vercel para mapas de infraestructura.",
  },
  {
    id: "asset-rive",
    name: "Rive State Machines",
    kind: "Motion Lib",
    url: "https://rive.app",
    installOrUsage: "npm i @rive-app/react-canvas",
    whyUseIt: "Interactive vector state machines that react to cursor position, clicks, and form states at 120fps.",
    whyUseItEs: "Máquinas de estado vectoriales a 120fps que reaccionan al cursor y estados del formulario.",
  },
  {
    id: "asset-iconoir",
    name: "Iconoir",
    kind: "Icons",
    url: "https://iconoir.com",
    installOrUsage: "npm i iconoir-react",
    whyUseIt: "Refined editorial stroke geometry ideal for luxury, European studios, and minimalist apps.",
    whyUseItEs: "Trazo fino editorial ideal para estudios de diseño, arquitectura y marcas minimalistas.",
  },
  {
    id: "asset-shadergradient",
    name: "ShaderGradient",
    kind: "Shaders & 3D",
    url: "https://www.shadergradient.co",
    installOrUsage: "npm i shadergradient",
    whyUseIt: "Customizable 3D organic grain gradients exported directly as React / Framer components.",
    whyUseItEs: "Superficies orgánicas 3D con grano exportables directamente como componente React.",
  },
];
