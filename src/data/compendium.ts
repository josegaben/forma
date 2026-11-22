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
    | "keycap-cta"
    | "tool-approval"
    | "voice-wave"
    | "expandable-bento"
    | "popover-form"
    | "token-meter"
    | "floating-toolbar"
    | "text-morph"
    | "card-stack";
  codeSnippet: string;
}

export interface TypographyPairing {
  id: string;
  name: string;
  foundry: "Fontshare" | "Google Variable" | "Open Foundry" | "IBM Open Source";
  vibe: string;
  vibeEs: string;
  displayFont: string;
  displayStack: string;
  bodyFont: string;
  bodyStack: string;
  monoFont: string;
  monoStack: string;
  serifAccentFont?: string;
  useItalicAccent?: boolean;
  h1Scale: string;
  h1Tracking: string;
  sampleHeading: string;
  cssImport: string;
  keywords: string[];
}

export interface CraftAssetItem {
  id: string;
  name: string;
  kind:
    | "Icons"
    | "Shaders & 3D"
    | "Textures"
    | "Motion Lib"
    | "Logos & SVG"
    | "Typography"
    | "Color Science"
    | "Components";
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
    id: "kokonut-tool-approval",
    name: "Agent Tool Approval Card",
    category: "AI Kit",
    isNew: true,
    provider: "Kokonut UI",
    providerUrl: "https://kokonutui.com",
    description: "Human-in-the-loop MCP action gate with parameter diff, cost badge, and tactile Approve/Deny.",
    descriptionEs: "Tarjeta de aprobación humana para llamadas MCP con coste estimado y botones Aprobar/Denegar.",
    cliInstall: "npx shadcn@latest add @kokonutui/ai-state-loading",
    keywords: ["agent", "mcp", "approval", "security", "tool", "claude", "codex", "ai", "agente"],
    previewKind: "tool-approval",
    codeSnippet: `export function ToolApprovalCard({
  tool = "db.migrate_production",
  cost = "$0.02",
  onApprove,
  onDeny,
}: {
  tool?: string;
  cost?: string;
  onApprove?: () => void;
  onDeny?: () => void;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-3.5 shadow-xs space-y-2.5">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="font-medium text-neutral-900">{tool}</span>
        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 tabular-nums">{cost}</span>
      </div>
      <div className="flex items-center justify-end gap-2 pt-1">
        <button type="button" onClick={onDeny} className="px-2.5 py-1 rounded-lg border border-black/10 text-xs text-neutral-600">
          Deny
        </button>
        <button type="button" onClick={onApprove} className="px-3 py-1 rounded-lg bg-neutral-950 text-white text-xs font-medium">
          Approve ↵
        </button>
      </div>
    </div>
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
    id: "kokonut-voice-input",
    name: "Voice Waveform Composer",
    category: "AI Kit",
    isNew: true,
    provider: "Kokonut UI",
    providerUrl: "https://kokonutui.com/docs/components/ai-voice",
    description: "Tactile microphone recorder with GPU scaleY frequency bars and `tabular-nums` elapsed clock.",
    descriptionEs: "Grabador de voz con barras de frecuencia en GPU y cronómetro `tabular-nums` sin saltos.",
    cliInstall: "npx shadcn@latest add @kokonutui/ai-voice",
    keywords: ["voice", "voz", "audio", "dictation", "clinic", "notes", "ai", "assistant", "waveform"],
    previewKind: "voice-wave",
    codeSnippet: `export function VoiceWaveformPill({ seconds = "00:14" }: { seconds?: string }) {
  const bars = [0.35, 0.7, 1, 0.55, 0.85, 0.45, 0.9, 0.6, 0.4, 0.75];
  return (
    <div className="inline-flex items-center gap-3 px-3.5 py-2 rounded-full bg-neutral-950 text-white text-xs">
      <span className="w-2 h-2 rounded-full bg-[#E06D44]" />
      <div className="flex items-center gap-0.5 h-3.5">
        {bars.map((scale, i) => (
          <span
            key={i}
            className="w-0.5 h-full bg-white/90 rounded-full origin-center transition-transform"
            style={{ transform: \`scaleY(\${scale})\` }}
          />
        ))}
      </div>
      <span className="font-mono tabular-nums text-white/75">{seconds}</span>
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
    id: "cult-expandable-bento",
    name: "Expandable Spring Bento Card",
    category: "Display",
    isNew: true,
    provider: "Cult UI",
    providerUrl: "https://www.cult-ui.com/docs/components/expandable",
    description: "Progressive-disclosure bento surface that reveals secondary telemetry specs on click without CLS.",
    descriptionEs: "Tarjeta bento progresiva que despliega métricas técnicas al pulsar sin desplazar el grid.",
    cliInstall: "npx shadcn@latest add @cult-ui/expandable",
    keywords: ["bento", "card", "feature", "saas", "expand", "product", "cult", "grid"],
    previewKind: "expandable-bento",
    codeSnippet: `import { useState } from "react";

export function ExpandableSpecCard({ title, detail }: { title: string; detail: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      className="w-full text-left rounded-2xl border border-black/10 bg-white p-4 transition-colors hover:border-black/25"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{title}</span>
        <span className="font-mono text-xs text-neutral-500">{open ? "−" : "+"}</span>
      </div>
      {open && <p className="mt-2 text-xs text-neutral-600 leading-relaxed">{detail}</p>}
    </button>
  );
}`,
  },
  {
    id: "rare-streaming-response",
    name: "Streaming Response & Status",
    category: "AI Kit",
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
    id: "coss-token-meter",
    name: "Tabular Credit & Token Meter",
    category: "Display",
    isNew: true,
    provider: "COSS UI × Origin UI",
    providerUrl: "https://coss.com/ui",
    description: "High-density segmented usage bar with `tabular-nums` USD remaining and threshold indicator.",
    descriptionEs: "Medidor segmentado de consumo y créditos con cifras `tabular-nums` para SaaS de uso e IA.",
    cliInstall: "npx shadcn@latest add https://coss.com/ui/r/meter.json",
    keywords: ["billing", "credits", "usage", "fintech", "tokens", "meter", "pricing", "cloud", "api"],
    previewKind: "token-meter",
    codeSnippet: `export function UsageMeter({ usedUsd = 1.24, capUsd = 5.0 }: { usedUsd?: number; capUsd?: number }) {
  const pct = Math.min(100, Math.round((usedUsd / capUsd) * 100));
  return (
    <div className="rounded-xl border border-black/10 bg-white p-3.5 space-y-2">
      <div className="flex items-center justify-between text-xs font-mono tabular-nums">
        <span className="text-neutral-500">Daily Spend</span>
        <span className="font-semibold text-neutral-950">\${usedUsd.toFixed(2)} / \${capUsd.toFixed(2)}</span>
      </div>
      <div className="h-1.5 rounded-full bg-neutral-100 overflow-hidden">
        <div
          className="h-full bg-emerald-600 origin-left transition-transform duration-200"
          style={{ transform: \`scaleX(\${pct / 100})\` }}
        />
      </div>
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
    id: "uilabs-floating-toolbar",
    name: "Contextual Selection Toolbar",
    category: "Navigation",
    isNew: true,
    provider: "UILabs (Mariana Castilho)",
    providerUrl: "https://www.uilabs.dev",
    description: "Compact tactile action pill with keyboard hints and subtle divider hairlines for editors & canvases.",
    descriptionEs: "Barra contextual compacta con atajos de teclado para editores, lienzos y herramientas de diseño.",
    cliInstall: "npx shadcn@latest add toolbar",
    keywords: ["toolbar", "editor", "canvas", "studio", "design", "menu", "actions", "ide"],
    previewKind: "floating-toolbar",
    codeSnippet: `export function ContextualToolbar({ onAction }: { onAction?: (id: string) => void }) {
  const actions = [
    { id: "comment", label: "Comment", key: "C" },
    { id: "inspect", label: "Inspect", key: "I" },
    { id: "share", label: "Share", key: "S" },
  ];
  return (
    <div role="toolbar" aria-label="Canvas actions" className="inline-flex items-center gap-1 p-1 rounded-full bg-neutral-950 text-white shadow-lg">
      {actions.map((a) => (
        <button
          key={a.id}
          type="button"
          onClick={() => onAction?.(a.id)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full hover:bg-white/12 text-xs transition-colors"
        >
          <span>{a.label}</span>
          <kbd className="text-[10px] font-mono text-white/55">{a.key}</kbd>
        </button>
      ))}
    </div>
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
      <div className="text-[11px] font-mono text-neutral-500">{label}</div>
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
    id: "cult-popover-form",
    name: "Morphing Inline Feedback Popover",
    category: "Feedback",
    isNew: true,
    provider: "Cult UI",
    providerUrl: "https://www.cult-ui.com/docs/components/popover-form",
    description: "Trigger pill that morphs smoothly into a compact feedback composer without full-screen modal dimmed noise.",
    descriptionEs: "Botón que se transforma en formulario ligero de feedback sin bloquear la pantalla con un modal.",
    cliInstall: "npx shadcn@latest add @cult-ui/popover-form",
    keywords: ["feedback", "popover", "form", "support", "docs", "saas", "input"],
    previewKind: "popover-form",
    codeSnippet: `import { useState } from "react";

export function InlineFeedbackPopover() {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="px-3.5 py-1.5 rounded-full border border-black/12 bg-white text-xs font-medium">
        Feedback
      </button>
    );
  }
  return (
    <form onSubmit={(e) => { e.preventDefault(); setOpen(false); }} className="w-64 rounded-2xl border border-black/12 bg-white p-3 shadow-lg space-y-2">
      <textarea rows={2} placeholder="How can we improve?" className="w-full text-xs resize-none focus:outline-none" />
      <div className="flex justify-end gap-1.5">
        <button type="button" onClick={() => setOpen(false)} className="px-2 py-1 text-xs text-neutral-500">Cancel</button>
        <button type="submit" className="px-2.5 py-1 rounded-full bg-neutral-950 text-white text-xs">Send</button>
      </div>
    </form>
  );
}`,
  },
  {
    id: "rare-morph-toast",
    name: "Stacked Morphing Toast",
    category: "Feedback",
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
    id: "motion-text-morph",
    name: "GPU Staggered Text Morph",
    category: "Feedback",
    isNew: true,
    provider: "Motion Primitives",
    providerUrl: "https://motion-primitives.com/docs/text-morph",
    description: "Character-level state label morphing (`Copy` → `Copied`) using pure `transform` and `opacity`.",
    descriptionEs: "Transición tipográfica estado a estado (`Copy` → `Copied`) usando solo `transform` y `opacity`.",
    cliInstall: "npx motion-primitives@latest add text-morph",
    keywords: ["motion", "text", "button", "copy", "status", "microinteraction", "cta"],
    previewKind: "text-morph",
    codeSnippet: `import { useState } from "react";

export function MorphingActionPill() {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setDone((v) => !v)}
      className="px-4 py-1.5 rounded-full bg-neutral-950 text-white text-xs font-mono transition-transform active:scale-97"
    >
      {done ? "✓ Spec synced" : "Sync DESIGN.md"}
    </button>
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
    <button type="button" onClick={onOpen} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/12 text-xs text-neutral-600">
      <span>Search...</span>
      <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 font-mono text-[10px]">⌘K</kbd>
    </button>
  );
}`,
  },
  {
    id: "skiper-card-stack",
    name: "Scroll-Linked Sticky Card Deck",
    category: "Display",
    isNew: true,
    provider: "Skiper UI",
    providerUrl: "https://skiper-ui.com",
    description: "Layered changelog/case-study cards with stepped `scale(0.96)` depth on scroll without layout thrash.",
    descriptionEs: "Pila de tarjetas con profundidad escalonada en GPU para changelogs, casos de estudio y portafolios.",
    cliInstall: "npx shadcn@latest add @skiper-ui/card-stack",
    keywords: ["portfolio", "changelog", "cards", "stack", "scroll", "showcase", "agency", "kinetic"],
    previewKind: "card-stack",
    codeSnippet: `export function SteppedCardDeck({ items }: { items: { tag: string; title: string }[] }) {
  return (
    <div className="relative space-y-2">
      {items.map((it, idx) => (
        <article
          key={it.title}
          className="rounded-xl border border-black/10 bg-white p-3.5 shadow-xs transition-transform"
          style={{ transform: \`scale(\${1 - idx * 0.03})\` }}
        >
          <span className="text-[10px] font-mono text-neutral-500">{it.tag}</span>
          <h4 className="text-sm font-medium mt-0.5">{it.title}</h4>
        </article>
      ))}
    </div>
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
    foundry: "Google Variable",
    vibe: "Silicon Valley Editorial Router (treg.to / Anthropic grade)",
    vibeEs: "Editorial tecnológico de máxima claridad (estilo treg.to / Anthropic)",
    displayFont: "Newsreader",
    displayStack: "'Newsreader', Georgia, serif",
    bodyFont: "Geist",
    bodyStack: "'Geist', -apple-system, sans-serif",
    monoFont: "DM Mono",
    monoStack: "'DM Mono', ui-monospace, monospace",
    serifAccentFont: "'Newsreader', Georgia, serif",
    useItalicAccent: true,
    h1Scale: "clamp(2.4rem, 1.5rem + 3.4vw, 4.4rem)",
    h1Tracking: "-0.03em",
    sampleHeading: "OpenRouter for web design",
    cssImport: "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Geist:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&display=swap",
    keywords: ["agent", "ai", "editorial", "docs", "clinic", "health", "research", "legal", "treg"],
  },
  {
    id: "pair-geist-instrument",
    name: "Geist + Instrument Serif Italic",
    foundry: "Google Variable",
    vibe: "Dark Infrastructure with Human Accent (resiz.es grade)",
    vibeEs: "Infraestructura seria con guiño editorial en cursiva (estilo resiz.es)",
    displayFont: "Geist + Instrument Serif",
    displayStack: "'Geist', -apple-system, sans-serif",
    bodyFont: "Geist",
    bodyStack: "'Geist', -apple-system, sans-serif",
    monoFont: "JetBrains Mono",
    monoStack: "'JetBrains Mono', ui-monospace, monospace",
    serifAccentFont: "'Instrument Serif', Georgia, serif",
    useItalicAccent: true,
    h1Scale: "clamp(2.3rem, 1.4rem + 3.2vw, 4.2rem)",
    h1Tracking: "-0.035em",
    sampleHeading: "Operate your stack seamlessly",
    cssImport: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400;500&display=swap",
    keywords: ["cloud", "kube", "devops", "infra", "security", "saas", "b2b", "dark", "resizes"],
  },
  {
    id: "pair-cabinet-satoshi",
    name: "Cabinet Grotesk + Satoshi + Geist Mono",
    foundry: "Fontshare",
    vibe: "Contemporary Neo-Grotesque SaaS & Creator Flagship (Indian Type Foundry)",
    vibeEs: "Neo-grotesca contemporánea con carácter propio fuera de Google Fonts",
    displayFont: "Cabinet Grotesk",
    displayStack: "'Cabinet Grotesk', 'Geist', sans-serif",
    bodyFont: "Satoshi",
    bodyStack: "'Satoshi', -apple-system, sans-serif",
    monoFont: "Geist Mono",
    monoStack: "'Geist Mono', ui-monospace, monospace",
    useItalicAccent: false,
    h1Scale: "clamp(2.35rem, 1.45rem + 3.2vw, 4.3rem)",
    h1Tracking: "-0.035em",
    sampleHeading: "Product velocity without visual noise",
    cssImport: "https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@700,800&f[]=satoshi@400,500,700&display=swap",
    keywords: ["saas", "startup", "fontshare", "satoshi", "cabinet", "product", "creator", "modern"],
  },
  {
    id: "pair-clash-generalsans",
    name: "Clash Display + General Sans + JetBrains Mono",
    foundry: "Fontshare",
    vibe: "High-Authority Launch, AI Platform & Fintech Statement",
    vibeEs: "Titulares incisivos de alto impacto con cuerpo limpio y legible",
    displayFont: "Clash Display",
    displayStack: "'Clash Display', 'Space Grotesk', sans-serif",
    bodyFont: "General Sans",
    bodyStack: "'General Sans', -apple-system, sans-serif",
    monoFont: "JetBrains Mono",
    monoStack: "'JetBrains Mono', ui-monospace, monospace",
    useItalicAccent: false,
    h1Scale: "clamp(2.3rem, 1.4rem + 3.2vw, 4.2rem)",
    h1Tracking: "-0.025em",
    sampleHeading: "Instant global settlement rails",
    cssImport: "https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&f[]=general-sans@400,500,600&display=swap",
    keywords: ["fintech", "launch", "ai", "fontshare", "clash", "general sans", "b2b", "payments"],
  },
  {
    id: "pair-zodiak-switzer",
    name: "Zodiak Serif + Switzer + DM Mono",
    foundry: "Fontshare",
    vibe: "High-Contrast Editorial Atelier, Luxury & Architecture",
    vibeEs: "Serifa editorial de alto contraste combinada con rigor neo-suizo",
    displayFont: "Zodiak",
    displayStack: "'Zodiak', Georgia, serif",
    bodyFont: "Switzer",
    bodyStack: "'Switzer', -apple-system, sans-serif",
    monoFont: "DM Mono",
    monoStack: "'DM Mono', ui-monospace, monospace",
    serifAccentFont: "'Zodiak', Georgia, serif",
    useItalicAccent: true,
    h1Scale: "clamp(2.4rem, 1.5rem + 3.3vw, 4.4rem)",
    h1Tracking: "-0.025em",
    sampleHeading: "Spaces built to outlast trends",
    cssImport: "https://api.fontshare.com/v2/css?f[]=zodiak@400,401,600&f[]=switzer@400,500,600&display=swap",
    keywords: ["architecture", "luxury", "atelier", "editorial", "fashion", "fontshare", "swiss"],
  },
  {
    id: "pair-sentient-jakarta",
    name: "Sentient + Plus Jakarta Sans + DM Mono",
    foundry: "Fontshare",
    vibe: "Warm Humanist Clinic, BioTech, Research & Publishing",
    vibeEs: "Serifa humanista serena para clínicas, salud, ciencia y edición",
    displayFont: "Sentient",
    displayStack: "'Sentient', Georgia, serif",
    bodyFont: "Plus Jakarta Sans",
    bodyStack: "'Plus Jakarta Sans', -apple-system, sans-serif",
    monoFont: "DM Mono",
    monoStack: "'DM Mono', ui-monospace, monospace",
    serifAccentFont: "'Sentient', Georgia, serif",
    useItalicAccent: true,
    h1Scale: "clamp(2.3rem, 1.45rem + 3.1vw, 4.1rem)",
    h1Tracking: "-0.02em",
    sampleHeading: "Preventive medicine with human calm",
    cssImport: "https://api.fontshare.com/v2/css?f[]=sentient@400,401,500&f[]=plus-jakarta-sans@400,500,600&display=swap",
    keywords: ["clinic", "clinica", "health", "salud", "biotech", "wellness", "fontshare", "medical"],
  },
  {
    id: "pair-swiss-grotesk",
    name: "Plus Jakarta Sans + Geist Mono",
    foundry: "Google Variable",
    vibe: "Pure Swiss Studio & Product Precision (pdepablo / Linear grade)",
    vibeEs: "Rigor suizo limpio para estudios creativos y producto digital",
    displayFont: "Plus Jakarta Sans",
    displayStack: "'Plus Jakarta Sans', -apple-system, sans-serif",
    bodyFont: "Plus Jakarta Sans",
    bodyStack: "'Plus Jakarta Sans', -apple-system, sans-serif",
    monoFont: "Geist Mono",
    monoStack: "'Geist Mono', ui-monospace, monospace",
    useItalicAccent: false,
    h1Scale: "clamp(2.25rem, 1.4rem + 3.1vw, 4.1rem)",
    h1Tracking: "-0.035em",
    sampleHeading: "Design systems with permanence",
    cssImport: "https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
    keywords: ["studio", "portfolio", "minimal", "fintech", "pay", "bank", "product", "swiss"],
  },
  {
    id: "pair-space-industrial",
    name: "Space Grotesk + Geist + JetBrains Mono",
    foundry: "Google Variable",
    vibe: "Tactile Hardware, Robotics & Edge Inference",
    vibeEs: "Carácter técnico industrial para hardware, robótica, audio y CLI",
    displayFont: "Space Grotesk",
    displayStack: "'Space Grotesk', sans-serif",
    bodyFont: "Geist",
    bodyStack: "'Geist', -apple-system, sans-serif",
    monoFont: "JetBrains Mono",
    monoStack: "'JetBrains Mono', ui-monospace, monospace",
    useItalicAccent: false,
    h1Scale: "clamp(2.2rem, 1.35rem + 3vw, 4rem)",
    h1Tracking: "-0.03em",
    sampleHeading: "Field-ready local inference [01]",
    cssImport: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@500;600;700&display=swap",
    keywords: ["hardware", "robotics", "cli", "rust", "event", "gaming", "audio", "kinetic"],
  },
  {
    id: "pair-fraunces-monograph",
    name: "Fraunces Soft Serif + Geist + DM Mono",
    foundry: "Google Variable",
    vibe: "Warm Cultural Brand, Hospitality & Consumer Craft",
    vibeEs: "Personalidad cálida orgánica para marcas de consumo, cultura y gastronomía",
    displayFont: "Fraunces",
    displayStack: "'Fraunces', Georgia, serif",
    bodyFont: "Geist",
    bodyStack: "'Geist', -apple-system, sans-serif",
    monoFont: "DM Mono",
    monoStack: "'DM Mono', ui-monospace, monospace",
    serifAccentFont: "'Fraunces', Georgia, serif",
    useItalicAccent: true,
    h1Scale: "clamp(2.35rem, 1.45rem + 3.2vw, 4.25rem)",
    h1Tracking: "-0.025em",
    sampleHeading: "Crafted for quiet mornings",
    cssImport: "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400&family=Fraunces:ital,opsz,wght@0,9..144,400;1,9..144,400&family=Geist:wght@400;500&display=swap",
    keywords: ["luxury", "fashion", "culture", "food", "wellness", "consumer", "hotel", "coffee"],
  },
  {
    id: "pair-bricolage-indie",
    name: "Bricolage Grotesque + Geist + Space Mono",
    foundry: "Open Foundry",
    vibe: "Expressive Indie Product & Neo-Brutalist Poster",
    vibeEs: "Expresividad indie distintiva que rompe el molde corporativo",
    displayFont: "Bricolage Grotesque",
    displayStack: "'Bricolage Grotesque', sans-serif",
    bodyFont: "Geist",
    bodyStack: "'Geist', -apple-system, sans-serif",
    monoFont: "Space Mono",
    monoStack: "'Space Mono', ui-monospace, monospace",
    useItalicAccent: false,
    h1Scale: "clamp(2.3rem, 1.4rem + 3.2vw, 4.2rem)",
    h1Tracking: "-0.03em",
    sampleHeading: "Software with sharp opinions",
    cssImport: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Geist:wght@400;500&family=Space+Mono:wght@400;700&display=swap",
    keywords: ["indie", "creator", "podcast", "media", "brutalist", "poster", "bold"],
  },
  {
    id: "pair-syne-dmsans",
    name: "Syne + DM Sans + Space Mono",
    foundry: "Open Foundry",
    vibe: "Avant-Garde Creative Direction, Film & Interactive Studio",
    vibeEs: "Dirección de arte vanguardista para agencias, cine y portafolios interactivos",
    displayFont: "Syne",
    displayStack: "'Syne', sans-serif",
    bodyFont: "DM Sans",
    bodyStack: "'DM Sans', -apple-system, sans-serif",
    monoFont: "Space Mono",
    monoStack: "'Space Mono', ui-monospace, monospace",
    useItalicAccent: false,
    h1Scale: "clamp(2.2rem, 1.35rem + 3vw, 4rem)",
    h1Tracking: "-0.035em",
    sampleHeading: "Radical digital scenography",
    cssImport: "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Space+Mono:wght@400&family=Syne:wght@600;700;800&display=swap",
    keywords: ["agency", "film", "art", "creative", "awwwards", "godly", "festival", "syne"],
  },
  {
    id: "pair-ibm-plex-triad",
    name: "IBM Plex Serif + Plex Sans + Plex Mono",
    foundry: "IBM Open Source",
    vibe: "Sovereign Deep-Tech, Financial Intelligence & Scientific Rigor",
    vibeEs: "Tríada tipográfica de ingeniería para ciencia, finanzas cuantitativas y datos",
    displayFont: "IBM Plex Serif",
    displayStack: "'IBM Plex Serif', Georgia, serif",
    bodyFont: "IBM Plex Sans",
    bodyStack: "'IBM Plex Sans', -apple-system, sans-serif",
    monoFont: "IBM Plex Mono",
    monoStack: "'IBM Plex Mono', ui-monospace, monospace",
    serifAccentFont: "'IBM Plex Serif', Georgia, serif",
    useItalicAccent: true,
    h1Scale: "clamp(2.25rem, 1.4rem + 3vw, 4rem)",
    h1Tracking: "-0.02em",
    sampleHeading: "Deterministic auditability at scale",
    cssImport: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Serif:ital,wght@0,400;0,500;1,400&display=swap",
    keywords: ["science", "quant", "finance", "research", "enterprise", "ibm", "data", "audit"],
  },
  {
    id: "pair-crimson-outfit",
    name: "Crimson Pro + Outfit + JetBrains Mono",
    foundry: "Google Variable",
    vibe: "Long-Form Knowledge Base, Essay, Law & Sovereign Docs",
    vibeEs: "Lectura profunda para ensayo, documentación legal, libros y archivos",
    displayFont: "Crimson Pro",
    displayStack: "'Crimson Pro', Georgia, serif",
    bodyFont: "Outfit",
    bodyStack: "'Outfit', -apple-system, sans-serif",
    monoFont: "JetBrains Mono",
    monoStack: "'JetBrains Mono', ui-monospace, monospace",
    serifAccentFont: "'Crimson Pro', Georgia, serif",
    useItalicAccent: true,
    h1Scale: "clamp(2.4rem, 1.5rem + 3.3vw, 4.3rem)",
    h1Tracking: "-0.02em",
    sampleHeading: "Contracts read in plain language",
    cssImport: "https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400&family=Outfit:wght@400;500;600&display=swap",
    keywords: ["legal", "abogados", "law", "essay", "book", "docs", "manifesto", "writing"],
  },
  {
    id: "pair-playfair-manrope",
    name: "Playfair Display + Manrope + DM Mono",
    foundry: "Google Variable",
    vibe: "Private Wealth, Boutique Real Estate & Executive Advisory",
    vibeEs: "Autoridad patrimonial para banca privada, inmobiliaria prime y consultoría",
    displayFont: "Playfair Display",
    displayStack: "'Playfair Display', Georgia, serif",
    bodyFont: "Manrope",
    bodyStack: "'Manrope', -apple-system, sans-serif",
    monoFont: "DM Mono",
    monoStack: "'DM Mono', ui-monospace, monospace",
    serifAccentFont: "'Playfair Display', Georgia, serif",
    useItalicAccent: true,
    h1Scale: "clamp(2.35rem, 1.45rem + 3.2vw, 4.25rem)",
    h1Tracking: "-0.025em",
    sampleHeading: "Stewardship across generations",
    cssImport: "https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;1,400&display=swap",
    keywords: ["wealth", "real estate", "inmobiliaria", "advisory", "private", "luxury", "capital"],
  },
  {
    id: "pair-archivo-chivo",
    name: "Archivo + Chivo Mono",
    foundry: "Open Foundry",
    vibe: "High-Density Operational Analytics, Logistics & Telemetry",
    vibeEs: "Grotesca técnica de alta densidad para paneles operativos y logística",
    displayFont: "Archivo",
    displayStack: "'Archivo', -apple-system, sans-serif",
    bodyFont: "Archivo",
    bodyStack: "'Archivo', -apple-system, sans-serif",
    monoFont: "Chivo Mono",
    monoStack: "'Chivo Mono', ui-monospace, monospace",
    useItalicAccent: false,
    h1Scale: "clamp(2.2rem, 1.35rem + 3vw, 3.9rem)",
    h1Tracking: "-0.03em",
    sampleHeading: "Real-time fleet telemetry",
    cssImport: "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Chivo+Mono:wght@400;500&display=swap",
    keywords: ["analytics", "logistics", "dashboard", "ops", "table", "telemetry", "fleet"],
  },
  {
    id: "pair-sora-inter-fira",
    name: "Sora + Inter + Fira Code",
    foundry: "Google Variable",
    vibe: "Crisp Geometric Developer SDK, API Docs & AI Copilot",
    vibeEs: "Geometría nítida para SDKs, documentación de APIs y copilotos de código",
    displayFont: "Sora",
    displayStack: "'Sora', -apple-system, sans-serif",
    bodyFont: "Inter",
    bodyStack: "'Inter', -apple-system, sans-serif",
    monoFont: "Fira Code",
    monoStack: "'Fira Code', ui-monospace, monospace",
    useItalicAccent: false,
    h1Scale: "clamp(2.2rem, 1.35rem + 3vw, 4rem)",
    h1Tracking: "-0.035em",
    sampleHeading: "Zero-latency edge primitives",
    cssImport: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@400;500;600&family=Sora:wght@500;600;700&display=swap",
    keywords: ["sdk", "api", "developer", "copilot", "code", "ide", "docs", "sora"],
  },
  {
    id: "pair-cormorant-worksans",
    name: "Cormorant Garamond + Work Sans + Space Mono",
    foundry: "Google Variable",
    vibe: "A1.gallery Monograph, Fragrance, Wine & Curated Objects",
    vibeEs: "Monografía clásica luminosa para moda, vino, diseño industrial y arte",
    displayFont: "Cormorant Garamond",
    displayStack: "'Cormorant Garamond', Georgia, serif",
    bodyFont: "Work Sans",
    bodyStack: "'Work Sans', -apple-system, sans-serif",
    monoFont: "Space Mono",
    monoStack: "'Space Mono', ui-monospace, monospace",
    serifAccentFont: "'Cormorant Garamond', Georgia, serif",
    useItalicAccent: true,
    h1Scale: "clamp(2.5rem, 1.6rem + 3.4vw, 4.6rem)",
    h1Tracking: "-0.02em",
    sampleHeading: "Botanical distillations, batch 04",
    cssImport: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400&family=Space+Mono:wght@400&family=Work+Sans:wght@400;500&display=swap",
    keywords: ["wine", "perfume", "gallery", "monograph", "a1", "art", "objects", "editorial"],
  },
  {
    id: "pair-panchang-ranade",
    name: "Panchang + Ranade + JetBrains Mono",
    foundry: "Fontshare",
    vibe: "Wide-Stance Kinetic Launch, Music, Automotive & Hardware",
    vibeEs: "Display expandida cinética para lanzamientos de hardware, motor y sonido",
    displayFont: "Panchang",
    displayStack: "'Panchang', 'Space Grotesk', sans-serif",
    bodyFont: "Ranade",
    bodyStack: "'Ranade', -apple-system, sans-serif",
    monoFont: "JetBrains Mono",
    monoStack: "'JetBrains Mono', ui-monospace, monospace",
    useItalicAccent: false,
    h1Scale: "clamp(2rem, 1.25rem + 2.8vw, 3.7rem)",
    h1Tracking: "-0.03em",
    sampleHeading: "Acoustic precision engineered",
    cssImport: "https://api.fontshare.com/v2/css?f[]=panchang@600,700&f[]=ranade@400,500&display=swap",
    keywords: ["automotive", "music", "sound", "conference", "kinetic", "fontshare", "wide"],
  },
];

export const CRAFT_TOOLS_AND_ASSETS: CraftAssetItem[] = [
  {
    id: "asset-fontshare",
    name: "Fontshare CDN (Indian Type Foundry)",
    kind: "Typography",
    url: "https://www.fontshare.com",
    installOrUsage: "https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap",
    whyUseIt: "100% free commercial-grade variable fonts (`Satoshi`, `Cabinet Grotesk`, `Clash Display`, `Zodiak`) via fast zero-auth CSS CDN.",
    whyUseItEs: "Tipografías variables profesionales gratuitas (`Satoshi`, `Cabinet Grotesk`, `Clash Display`, `Zodiak`) listas por CDN.",
  },
  {
    id: "asset-harmonizer",
    name: "Evil Martians OKLCH Harmonizer",
    kind: "Color Science",
    url: "https://harmonizer.evilmartians.com",
    installOrUsage: "oklch(L C H) · APCA & WCAG 2.1",
    whyUseIt: "Generates accessible, uniform perceptual `OKLCH` P3 palettes with predictable contrast across all steps.",
    whyUseItEs: "Genera escalas de color `OKLCH` perceptualmente uniformes con contraste APCA/WCAG predecible.",
  },
  {
    id: "asset-coss-ui",
    name: "COSS UI Particles",
    kind: "Components",
    url: "https://coss.com/ui",
    installOrUsage: "npx shadcn@latest add https://coss.com/ui/r/button.json",
    whyUseIt: "Clean composable `shadcn`-compatible UI particles with JSON registry manifests built for AI coding agents.",
    whyUseItEs: "Partículas UI ultra-limpias compatibles con `shadcn` y manifiestos JSON directos para agentes IA.",
  },
  {
    id: "asset-motion-primitives",
    name: "Motion Primitives (Ibelick)",
    kind: "Motion Lib",
    url: "https://motion-primitives.com",
    installOrUsage: "npx motion-primitives@latest add morphing-dialog",
    whyUseIt: "Open-source animated React primitives (`TextMorph`, `MorphingDialog`, `AnimatedBackground`) tuned for 60fps GPU.",
    whyUseItEs: "Primitivas React animadas open-source (`TextMorph`, `MorphingDialog`) afinadas a 60fps en GPU.",
  },
  {
    id: "asset-uilabs",
    name: "UILabs Micro-Interactions",
    kind: "Components",
    url: "https://www.uilabs.dev",
    installOrUsage: "https://www.uilabs.dev",
    whyUseIt: "Mariana Castilho's laboratory of tactile toolbars, dynamic popovers, and spring physics references.",
    whyUseItEs: "Laboratorio de micro-interacciones táctiles, barras contextuales y popovers de alta precisión.",
  },
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
    id: "asset-tabler-icons",
    name: "Tabler Icons (5,800+ Crisp Strokes)",
    kind: "Icons",
    url: "https://tabler.io/icons",
    installOrUsage: "npm i @tabler/icons-react",
    whyUseIt: "5,800+ pixel-consistent `1.5px` stroke SVGs covering deep FinTech, Kubernetes, hardware, and medical concepts.",
    whyUseItEs: "+5.800 iconos SVG de trazo técnico preciso para FinTech, infraestructura, hardware y salud.",
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
