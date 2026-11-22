"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowLeftRight, ArrowUpRight, Download, Play, SlidersHorizontal } from "lucide-react";

export interface ShowcasePresetMix {
  idea: string;
  surfaceId: string;
  paletteId: string;
  fontPairingId: string;
  layoutId: string;
  motionId: string;
}

type CaseId = "cloud" | "coffee" | "fintech";

interface CaseMeta {
  id: CaseId;
  badgeEn: string;
  badgeEs: string;
  promptEn: string;
  promptEs: string;
  beforeScore: string;
  afterScore: string;
  dnaLabel: string;
  diffsEn: [string, string][];
  diffsEs: [string, string][];
  studioPreset: ShowcasePresetMix;
}

const CASES: CaseMeta[] = [
  {
    id: "cloud",
    badgeEn: "01 · AI & Cloud Infra",
    badgeEs: "01 · Cloud e IA",
    promptEn:
      '"Build a landing page for Vektor, an autonomous Kubernetes & GPU FinOps platform with cluster telemetry."',
    promptEs:
      '"Crea la web de Vektor, una plataforma autónoma de Kubernetes y GPU FinOps con telemetría en tiempo real."',
    beforeScore: "29/100 · AI Slop",
    afterScore: "99/100 A+ · resiz.es × Linear",
    dnaLabel: "RSZ + LNR + PDP · Geist + Instrument Serif",
    diffsEn: [
      ["Surface", "Neon #9333ea glow → #0b0c0e halftone + 1px hairlines"],
      ["Typography", "Generic Inter Bold → Geist + Instrument Serif italic"],
      ["Hero Artifact", "3 emoji cards → Live 48-node H100 GPU topology console"],
      ["Metrics", "Fake 99.999% hype → DM Mono tabular-nums (-$42,190/mo)"],
    ],
    diffsEs: [
      ["Superficie", "Brillo morado IA → Carbón #0b0c0e halftone + líneas 1px"],
      ["Tipografía", "Inter pesada → Geist + Instrument Serif en cursiva"],
      ["Artefacto Hero", "3 tarjetas con emojis → Consola real de 48 nodos GPU H100"],
      ["Métricas", "Humo promocional → DM Mono tabular-nums (-42.190 $/mes)"],
    ],
    studioPreset: {
      idea: "Autonomous Kubernetes & H100 GPU FinOps platform with real-time cluster telemetry like resiz.es and Linear",
      surfaceId: "resizes-infra",
      paletteId: "pal-carbon-halftone",
      fontPairingId: "pair-geist-instrument",
      layoutId: "pdepablo-studio",
      motionId: "linear-precision",
    },
  },
  {
    id: "coffee",
    badgeEn: "02 · Editorial Brand & Commerce",
    badgeEs: "02 · Marca Editorial y E-Commerce",
    promptEn:
      '"Build a one-page website for Kanso, a specialty micro-lot coffee roaster in Madrid with monthly subscriptions."',
    promptEs:
      '"Haz una web de una página para Kanso, un tostador de café de especialidad en Madrid con suscripción mensual."',
    beforeScore: "34/100 · AI Slop",
    afterScore: "98/100 A+ · Sanzo Wada × A1.gallery",
    dnaLabel: "SNZ #142 + A1 + PDP · Newsreader + DM Mono",
    diffsEn: [
      ["Palette", "Dark purple SaaS template → Sanzo Wada Shōwa Silk (#f5f1e8) & Persimmon"],
      ["Art Direction", "☕ emoji circle → Sunlit travertine studio still-life + roast curve"],
      ["Pricing", "Absurd $99 Enterprise tier → Honest €24/mo roasted-walnut subscription"],
      ["Information", "Generic buzzwords → 3 farm lots with SCA scores & altitude"],
    ],
    diffsEs: [
      ["Paleta", "Plantilla SaaS morada → Seda Shōwa (#f5f1e8) y Caqui Sanzo Wada"],
      ["Dirección de Arte", "Emoji ☕ en círculo → Fotografía editorial en travertino + curva tueste"],
      ["Suscripción", "Absurdo plan Enterprise 99€ → Suscripción honesta de 24 €/mes"],
      ["Contenido", "Frases vacías de IA → 3 fincas trazables con altitud y nota SCA"],
    ],
    studioPreset: {
      idea: "Specialty single-origin coffee roaster in Madrid with tactile editorial photography and monthly subscription",
      surfaceId: "a1-monograph",
      paletteId: "pal-sanzo-persimmon",
      fontPairingId: "pair-newsreader-geist",
      layoutId: "pdepablo-studio",
      motionId: "rauno-craft",
    },
  },
  {
    id: "fintech",
    badgeEn: "03 · B2B Fintech & Treasury",
    badgeEs: "03 · Fintech y Tesorería B2B",
    promptEn:
      '"Design a B2B global treasury, multi-currency accounts and instant payouts homepage for finance teams."',
    promptEs:
      '"Diseña la portada de Meridian, tesorería global B2B, cuentas multidivisa y pagos instantáneos."',
    beforeScore: "31/100 · AI Slop",
    afterScore: "98/100 A+ · Stripe × Midday × Fontshare",
    dnaLabel: "STR + MID + FNT · Clash Display + Satoshi",
    diffsEn: [
      ["Surface", "Cyan-magenta crypto look → Sovereign Maritime Slate (#f6f9fc / #0a2540)"],
      ["Typography", "Default sans → Fontshare Clash Display + Satoshi + DM Mono"],
      ["Proof Stage", "Vague promises → Multi-currency ledger ($2.84M USD · +4.85% T-Bill)"],
      ["Trust", "Cartoon rocket CTA → Audited settlement timeline (0.8s FedNow / SEPA)"],
    ],
    diffsEs: [
      ["Superficie", "Degradado neón cripto → Pizarra Marítima Institucional (#f6f9fc / #0a2540)"],
      ["Tipografía", "Sans por defecto → Fontshare Clash Display + Satoshi + DM Mono"],
      ["Prueba Visual", "Promesas vagas → Libro mayor multidivisa (2,84 M$ · +4,85 % Letras)"],
      ["Confianza", "Botón con cohete 🚀 → Liquidación auditada en 0,8s (SEPA / FedNow)"],
    ],
    studioPreset: {
      idea: "Sovereign B2B global treasury, multi-currency accounts and instant SEPA/FedNow payouts like Stripe and Midday",
      surfaceId: "stripe-editorial-mesh",
      paletteId: "pal-maritime-ledger",
      fontPairingId: "pair-clash-generalsans",
      layoutId: "landings-saas",
      motionId: "rauno-craft",
    },
  },
];

function BeforeSlopCanvas({ activeCase, lang }: { activeCase: CaseId; lang: "en" | "es" }) {
  if (activeCase === "cloud") {
    return (
      <div className="w-full h-full bg-[#030712] text-white font-sans overflow-hidden relative select-none">
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[560px] h-[280px] rounded-full blur-3xl opacity-45 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)" }}
        />
        <div className="relative px-7 py-3.5 border-b border-white/10 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-[16px]">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-sm">
              🤖
            </span>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              VektorAI.cloud
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-xs text-slate-300">
            <span>Features</span>
            <span>Solutions</span>
            <span>Pricing</span>
            <span className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-bold text-white shadow-lg shadow-purple-500/40">
              {lang === "es" ? "¡Prueba Gratis! 🚀" : "Start Free Trial! 🚀"}
            </span>
          </div>
        </div>

        <div className="relative px-6 pt-10 pb-7 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200 text-[10.5px] uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span>● LIVE · 01 // NEXT-GEN AI CLOUD REVOLUTION</span>
          </div>
          <h3 className="text-[28px] sm:text-[36px] font-extrabold max-w-[640px] mx-auto leading-[1.12]">
            {lang === "es" ? (
              <>
                Potencia tu nube y lleva tu infraestructura al{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  siguiente nivel
                </span>
              </>
            ) : (
              <>
                Supercharge your cloud workflow with{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Unleashed AI Magic
                </span>
              </>
            )}
          </h3>
          <p className="mt-3 text-[13.5px] text-slate-400 max-w-[540px] mx-auto">
            {lang === "es"
              ? "Revolucionamos la forma en que gestionas servidores mediante sinergias inteligentes diseñadas para escalar tu éxito sin fricciones."
              : "Experience a seamless, game-changing ecosystem built to revolutionize your DevOps journey effortlessly."}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <span className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-xs font-bold shadow-lg shadow-purple-600/40">
              {lang === "es" ? "Desplegar IA ✨" : "Get Started Now ✨"}
            </span>
            <span className="px-5 py-2.5 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-300">
              {lang === "es" ? "Saber Más" : "Watch Demo"}
            </span>
          </div>
        </div>

        <div className="px-7 pt-2">
          <div className="text-center text-[10px] font-bold tracking-widest text-purple-400 uppercase mb-3">
            02 // AMAZING FEATURES FOR YOU
          </div>
          <div className="grid grid-cols-3 gap-3.5">
            {[
              ["⚡", "01 // SPEED", "Blazing Fast AI", "Unlock 10x faster cloud synergy in one click."],
              ["🚀", "02 // SCALE", "Infinite Scaling", "Seamlessly scale to the moon without limits."],
              ["💎", "03 // MAGIC", "Smart Insights", "AI-powered dashboards that boost productivity."],
            ].map(([ic, step, title, desc]) => (
              <div
                key={title}
                className="p-4 rounded-2xl bg-slate-900/95 border border-purple-500/30 shadow-lg"
              >
                <div className="w-9 h-9 rounded-full bg-purple-500/25 flex items-center justify-center text-lg mb-2.5">
                  {ic}
                </div>
                <div className="text-[9.5px] font-bold text-purple-400">{step}</div>
                <div className="text-[14px] font-bold mt-0.5">{title}</div>
                <p className="text-[11.5px] text-slate-400 mt-1 leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeCase === "coffee") {
    return (
      <div className="w-full h-full bg-slate-950 text-white font-sans overflow-hidden relative select-none">
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-[520px] h-[250px] rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ background: "linear-gradient(90deg, #7c3aed, #ec4899)" }}
        />
        <div className="relative px-7 py-3.5 border-b border-white/10 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-[16px]">
            <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-sm">
              ☕
            </span>
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              KansoCoffee
            </span>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-xs font-bold">
            {lang === "es" ? "¡Empieza Gratis! 🚀" : "Get Started Free! 🚀"}
          </span>
        </div>

        <div className="relative px-6 pt-9 pb-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 border border-purple-400/35 text-purple-300 text-[10.5px] uppercase tracking-widest mb-3.5">
            <span>● LIVE · 01 // THE FUTURE OF COFFEE</span>
          </div>
          <h3 className="text-[28px] sm:text-[35px] font-extrabold max-w-[620px] mx-auto leading-[1.12]">
            {lang === "es" ? (
              <>
                Potencia tu mañana y lleva tu café al{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  siguiente nivel
                </span>
              </>
            ) : (
              <>
                Supercharge your mornings and take coffee to the{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  next level
                </span>
              </>
            )}
          </h3>
          <p className="mt-2.5 text-[13px] text-slate-400 max-w-[520px] mx-auto">
            {lang === "es"
              ? "Revolucionamos la experiencia del café mediante una suscripción inteligente y sin fricciones."
              : "Revolutionizing the way you drink specialty coffee with a frictionless morning workflow."}
          </p>
        </div>

        <div className="px-7 pt-2 grid grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">Starter Bean</div>
            <div className="text-2xl font-extrabold my-1.5">$19/mo</div>
            <div className="text-[11px] text-slate-400 mb-3">Basic morning energy</div>
            <div className="py-1.5 rounded-lg bg-slate-800 text-center text-xs font-semibold">
              Choose Starter
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-b from-purple-900/60 to-slate-900 border-2 border-purple-500 relative">
            <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full bg-purple-500 text-[9px] font-bold">
              MOST POPULAR 🔥
            </span>
            <div className="text-xs text-purple-300">Pro Roaster AI</div>
            <div className="text-2xl font-extrabold my-1.5">$39/mo</div>
            <div className="text-[11px] text-slate-300 mb-3">10x caffeine workflow</div>
            <div className="py-1.5 rounded-lg bg-purple-600 text-center text-xs font-bold">
              Subscribe Pro ✨
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="text-xs text-slate-400">Enterprise Cup</div>
            <div className="text-2xl font-extrabold my-1.5">$99/mo</div>
            <div className="text-[11px] text-slate-400 mb-3">Custom bean SLA</div>
            <div className="py-1.5 rounded-lg bg-slate-800 text-center text-xs font-semibold">
              Contact Sales
            </div>
          </div>
        </div>
      </div>
    );
  }

  // fintech slop
  return (
    <div className="w-full h-full bg-[#040816] text-white font-sans overflow-hidden relative select-none">
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[560px] h-[260px] rounded-full blur-3xl opacity-45 pointer-events-none"
        style={{ background: "linear-gradient(90deg, #06b6d4, #8b5cf6, #ec4899)" }}
      />
      <div className="relative px-7 py-3.5 border-b border-white/10 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2 font-extrabold text-[16px]">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-400 to-fuchsia-500 flex items-center justify-center text-sm">
            💸
          </span>
          <span className="bg-gradient-to-r from-cyan-300 to-fuchsia-400 bg-clip-text text-transparent">
            MeridianPay AI
          </span>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-xs font-bold">
          Open Free Account 🚀
        </span>
      </div>

      <div className="relative px-6 pt-10 pb-7 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/35 text-cyan-200 text-[10.5px] uppercase tracking-widest mb-4">
          <span>● LIVE · 01 // REDEFINING THE FUTURE OF MONEY</span>
        </div>
        <h3 className="text-[28px] sm:text-[35px] font-extrabold max-w-[620px] mx-auto leading-[1.12]">
          Unleash seamless global finance at{" "}
          <span className="bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            warp speed
          </span>
        </h3>
        <p className="mt-3 text-[13.5px] text-slate-400 max-w-[520px] mx-auto">
          Empower your finance team with revolutionary next-gen banking synergies and frictionless AI transfers.
        </p>
      </div>

      <div className="px-7 grid grid-cols-3 gap-3.5">
        {[
          ["🌍", "01 // GLOBAL", "Borderless Magic", "Send money anywhere with amazing speed."],
          ["🤖", "02 // SMART", "AI Yield Booster", "Supercharge idle cash automatically."],
          ["🛡️", "03 // SECURE", "Military Grade", "100% secure next-level encryption."],
        ].map(([ic, st, ti, de]) => (
          <div
            key={ti}
            className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/25 shadow-lg"
          >
            <div className="w-9 h-9 rounded-full bg-cyan-500/20 flex items-center justify-center text-lg mb-2">
              {ic}
            </div>
            <div className="text-[9.5px] font-bold text-cyan-300">{st}</div>
            <div className="text-[14px] font-bold mt-0.5">{ti}</div>
            <p className="text-[11.5px] text-slate-400 mt-1">{de}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AfterFormaCanvas({ activeCase, lang }: { activeCase: CaseId; lang: "en" | "es" }) {
  if (activeCase === "cloud") {
    const nodes = [
      1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1,
      1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1,
      1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1,
    ];
    return (
      <div
        className="w-full h-full text-[#f4f5f6] overflow-hidden relative select-none"
        style={{
          backgroundColor: "#0b0c0e",
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.11) 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      >
        {/* Minimal Hairline Header */}
        <div
          className="px-7 py-3.5 border-b flex items-center justify-between text-[12px]"
          style={{
            borderColor: "rgba(255,255,255,0.09)",
            backgroundColor: "rgba(11,12,14,0.86)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-[3px] bg-white inline-block" />
            <span className="font-semibold tracking-tight text-[14px]">vektor</span>
            <span
              className="text-[10.5px] px-2 py-0.5 rounded bg-white/8 text-[#9ca3af]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              v2.4 · eBPF
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-5 text-[#9ca3af]">
            <span>Topology</span>
            <span>GPU Rightsizing</span>
            <span>Docs</span>
            <span className="px-3 py-1 rounded-full bg-white text-[#0b0c0e] font-medium text-[11.5px]">
              {lang === "es" ? "Conectar clúster" : "Connect cluster"}
            </span>
          </div>
        </div>

        {/* 12-Col Split Infrastructure Hero + Live Telemetry Console */}
        <div className="px-7 pt-7 grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 md:col-span-6 space-y-4">
            <div
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-[10.5px] text-[#a1a1aa] tabular-nums"
              style={{
                borderColor: "rgba(255,255,255,0.12)",
                backgroundColor: "#121418",
                fontFamily: "var(--font-mono), monospace",
              }}
            >
              <span>ZERO-AGENT EBPF · AWS · GCP · BARE METAL</span>
            </div>

            <h3 className="text-[28px] sm:text-[34px] leading-[1.04] tracking-[-0.035em] font-medium">
              {lang === "es" ? (
                <>
                  Elimina el gasto ocioso en GPU y Kubernetes{" "}
                  <span
                    className="italic font-normal text-[#e4e4e7]"
                    style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
                  >
                    sin tocar código.
                  </span>
                </>
              ) : (
                <>
                  Reclaim idle H100 &amp; Kubernetes spend{" "}
                  <span
                    className="italic font-normal text-[#e4e4e7]"
                    style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
                  >
                    automatically.
                  </span>
                </>
              )}
            </h3>

            <p className="text-[13px] leading-[1.6] text-[#9ca3af] max-w-[46ch]">
              {lang === "es"
                ? "Rebalanceo sub-segundo de cargas de inferencia hacia instancias Spot y consolidación de nodos con cero tiempo de inactividad."
                : "Sub-second pod bin-packing, MIG slice rightsizing, and zero-downtime Spot fallback across multi-region clusters."}
            </p>

            {/* Dark CLI Pill */}
            <div
              className="rounded-[10px] px-3.5 py-2.5 border flex items-center justify-between text-[11.5px]"
              style={{
                backgroundColor: "#111317",
                borderColor: "rgba(255,255,255,0.12)",
                fontFamily: "var(--font-mono), monospace",
              }}
            >
              <span className="text-[#e4e4e7] truncate">
                <span className="text-[#6b7280]">$ </span>helm install vektor oci://ghcr.io/vektor/agent
              </span>
              <span className="px-2.5 py-0.5 rounded bg-white text-[#0b0c0e] text-[10.5px] font-medium shrink-0">
                Copy
              </span>
            </div>
          </div>

          {/* Right 6-Col Live Cluster FinOps Console */}
          <div className="col-span-12 md:col-span-6">
            <div
              className="rounded-[14px] p-4 border space-y-3.5"
              style={{
                backgroundColor: "#121418",
                borderColor: "rgba(255,255,255,0.11)",
              }}
            >
              <div
                className="flex items-center justify-between text-[10.5px] pb-2.5 border-b tabular-nums"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  fontFamily: "var(--font-mono), monospace",
                }}
              >
                <span className="text-[#9ca3af]">prod-eu-west · 36× H100 SXM</span>
                <span className="text-[#34d399]">● 94.2% packed</span>
              </div>

              <div className="grid grid-cols-2 gap-3 tabular-nums">
                <div className="p-3 rounded-[10px] bg-[#0b0c0e] border border-white/8">
                  <div
                    className="text-[10px] text-[#9ca3af]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    MONTHLY RECLAIMED
                  </div>
                  <div className="text-[21px] font-semibold tracking-tight text-white mt-0.5">
                    -$42,190
                  </div>
                  <div
                    className="text-[10px] text-[#34d399] mt-0.5"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    ↓ 38.4% compute bill
                  </div>
                </div>
                <div className="p-3 rounded-[10px] bg-[#0b0c0e] border border-white/8 flex flex-col justify-between">
                  <div
                    className="text-[10px] text-[#9ca3af]"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    36-NODE TOPOLOGY
                  </div>
                  <div className="grid grid-cols-12 gap-1 pt-1.5">
                    {nodes.map((st, idx) => (
                      <span
                        key={idx}
                        className="h-2.5 rounded-[2px]"
                        style={{
                          backgroundColor:
                            st === 1 ? "#10b981" : "rgba(255,255,255,0.22)",
                        }}
                      />
                    ))}
                  </div>
                  <div
                    className="text-[9.5px] text-[#9ca3af] pt-1"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    18ms p99 eviction · 0 OOM
                  </div>
                </div>
              </div>

              {/* Crisp Spend Reduction SVG Curve */}
              <div className="p-3 rounded-[10px] bg-[#0b0c0e] border border-white/8">
                <div
                  className="flex justify-between text-[10px] text-[#9ca3af] mb-1.5 tabular-nums"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  <span>$/hr burn before vs. after Vektor</span>
                  <span className="text-white">$114.20 → $68.40/hr</span>
                </div>
                <svg viewBox="0 0 320 46" className="w-full h-11" fill="none">
                  <path
                    d="M0 10 L95 11 L115 28 L210 31 L320 34"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  <path
                    d="M0 10 L320 9"
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <circle cx="115" cy="28" r="3" fill="#ffffff" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom 7/5 Asymmetric Ledger Strip */}
        <div className="px-7 pt-5 grid grid-cols-12 gap-4">
          <div
            className="col-span-7 rounded-[12px] px-4 py-3 border flex items-center justify-between text-[11px] tabular-nums"
            style={{
              backgroundColor: "#121418",
              borderColor: "rgba(255,255,255,0.09)",
              fontFamily: "var(--font-mono), monospace",
            }}
          >
            <span className="text-[#9ca3af]">policy: spot-fallback-h100</span>
            <span className="text-[#34d399]">✓ 14 idle replicas Hibernated</span>
          </div>
          <div
            className="col-span-5 rounded-[12px] px-4 py-3 border flex items-center justify-between text-[11px] tabular-nums"
            style={{
              backgroundColor: "#121418",
              borderColor: "rgba(255,255,255,0.09)",
              fontFamily: "var(--font-mono), monospace",
            }}
          >
            <span className="text-[#9ca3af]">SOC2 Type II · Read-only IAM</span>
            <span className="text-white">$0.00 first $10k saved</span>
          </div>
        </div>
      </div>
    );
  }

  if (activeCase === "coffee") {
    return (
      <div
        className="w-full h-full text-[#1f1b18] overflow-hidden relative select-none"
        style={{ backgroundColor: "#f5f1e8" }}
      >
        <div
          className="px-7 py-3.5 border-b flex items-center justify-between"
          style={{ borderColor: "rgba(31,27,24,0.12)" }}
        >
          <div className="flex items-baseline gap-2.5">
            <span
              className="text-[20px]"
              style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
            >
              Kanso
            </span>
            <span
              className="text-[10.5px] text-[#6d645b]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              Chamberí · Madrid
            </span>
          </div>
          <div
            className="flex items-center gap-4 text-[11px] text-[#6d645b] tabular-nums"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            <span className="hidden sm:inline">C/ Trafalgar 14</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#e7dfd0] text-[#1f1b18]">
              {lang === "es" ? "Tueste: Mar 07:00" : "Roast: Tue 07:00"}
            </span>
          </div>
        </div>

        <div className="px-7 pt-6 grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 md:col-span-6 space-y-3.5">
            <h3
              className="text-[27px] sm:text-[33px] leading-[1.05] tracking-[-0.028em] font-normal"
              style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
            >
              {lang === "es" ? (
                <>
                  Café de origen único tostado cada martes en{" "}
                  <span className="italic text-[#c4492b]">pequeños lotes.</span>
                </>
              ) : (
                <>
                  Single-origin coffee roasted every Tuesday in{" "}
                  <span className="italic text-[#c4492b]">small batches.</span>
                </>
              )}
            </h3>
            <p className="text-[13px] leading-[1.6] text-[#5e554d]">
              {lang === "es"
                ? "Tres fincas trazables por estación en Huila, Gedeb y Usulután. Tostado en tambor Loring S15 y enviado en menos de 24 horas."
                : "Three farm-direct micro-lots per season across Huila, Gedeb, and Usulután. Roasted on cast-iron drums and shipped within 24h."}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="px-4 py-2 rounded-full bg-[#c4492b] text-[#fbf9f4] text-[12px] font-medium">
                {lang === "es"
                  ? "Recibir tueste del martes · 24 € →"
                  : "Join Tuesday's roast · €24 →"}
              </span>
              <span
                className="text-[11.5px] text-[#6d645b] tabular-nums"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                2 × 250 g · SCA 88.5
              </span>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div
              className="rounded-[16px] p-2 border bg-[#fbf9f4]"
              style={{ borderColor: "rgba(31,27,24,0.12)" }}
            >
              <div className="relative rounded-[11px] overflow-hidden h-[196px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/showcase/kanso-editorial.jpg"
                  alt="Kanso Madrid Lot 04 specialty coffee pouch on travertine stone"
                  width={640}
                  height={360}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute bottom-2 inset-x-2 rounded-[9px] px-3 py-1.5 flex items-center justify-between text-[11px]"
                  style={{
                    backgroundColor: "rgba(251,249,244,0.92)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span className="font-medium">Finca El Puente · 1,950 m</span>
                  <span
                    className="text-[#c4492b] tabular-nums"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    204.5 °C
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Fine-Ruled Origin Ledger + Walnut Subscription */}
        <div className="px-7 pt-5 grid grid-cols-12 gap-4 items-stretch">
          <div
            className="col-span-7 rounded-[14px] px-4 py-3 border bg-[#fbf9f4] divide-y text-[12px]"
            style={{ borderColor: "rgba(31,27,24,0.11)" }}
          >
            {[
              ["LOT 04", "Huila, Colombia", "Red plum & cacao", "88.5"],
              ["LOT 05", "Gedeb, Ethiopia", "Bergamot & white peach", "89.0"],
            ].map(([lot, orig, note, sca]) => (
              <div key={lot} className="py-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="text-[10.5px] text-[#c4492b] shrink-0"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {lot}
                  </span>
                  <span className="font-medium truncate">{orig}</span>
                  <span className="text-[#6d645b] text-[11.5px] hidden sm:inline truncate">
                    · {note}
                  </span>
                </div>
                <span
                  className="text-[11px] text-[#6d645b] tabular-nums shrink-0"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  SCA {sca}
                </span>
              </div>
            ))}
          </div>

          <div className="col-span-5 rounded-[14px] px-4 py-3 bg-[#1f1b18] text-[#fbf9f4] flex items-center justify-between gap-2">
            <div>
              <div
                className="text-[10px] text-[#e7dfd0]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                {lang === "es" ? "SUSCRIPCIÓN MENSUAL" : "MONTHLY BOX"}
              </div>
              <div
                className="text-[16px]"
                style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
              >
                2 × 250 g · V60 / Espresso
              </div>
            </div>
            <div className="text-right tabular-nums">
              <div className="text-[20px] font-semibold">€24</div>
              <div
                className="text-[9.5px] text-[#b8afa4]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                free 24h ship
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Case 03: Sovereign B2B Fintech & Treasury (Stripe × Midday × Fontshare)
  return (
    <div
      className="w-full h-full text-[#0a2540] overflow-hidden relative select-none"
      style={{ backgroundColor: "#f6f9fc" }}
    >
      <div
        className="px-7 py-3.5 border-b bg-white/90 flex items-center justify-between"
        style={{ borderColor: "rgba(10,37,64,0.09)" }}
      >
        <div className="flex items-center gap-2.5">
          <span className="w-4 h-4 rounded-[4px] bg-[#0a2540] inline-block" />
          <span className="font-semibold tracking-tight text-[15px]">Meridian</span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full bg-[#e3ebf3] text-[#0a2540]"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            FDIC / Safeguarding
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-5 text-[12px] text-[#475b70]">
          <span>Treasury</span>
          <span>Global Payouts</span>
          <span>API</span>
          <span className="px-3.5 py-1 rounded-full bg-[#0a2540] text-white text-[11.5px] font-medium">
            {lang === "es" ? "Abrir cuenta" : "Open treasury"}
          </span>
        </div>
      </div>

      <div className="px-7 pt-7 grid grid-cols-12 gap-6 items-center">
        <div className="col-span-12 md:col-span-6 space-y-3.5">
          <div
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#e3ebf3] text-[10.5px] text-[#0a2540] tabular-nums"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            <span>4.85% SOVEREIGN T-BILL YIELD · 38 CURRENCIES</span>
          </div>
          <h3 className="text-[27px] sm:text-[33px] leading-[1.05] tracking-[-0.03em] font-semibold">
            {lang === "es"
              ? "Tesorería global programable y liquidación en 0,8 segundos."
              : "Programmable multi-currency treasury settled in 0.8 seconds."}
          </h3>
          <p className="text-[13px] leading-[1.6] text-[#475b70]">
            {lang === "es"
              ? "Cuentas IBAN y FedNow dedicadas, barrido automático hacia Letras del Tesoro y conciliación contable determinista."
              : "Dedicated local IBAN & FedNow rails, automated overnight T-Bill sweeps, and deterministic ERP reconciliation."}
          </p>
          <div className="flex items-center gap-2.5 pt-1">
            <span className="px-4 py-2 rounded-full bg-[#0a2540] text-white text-[12px] font-medium">
              {lang === "es" ? "Explorar demo en vivo →" : "Explore live ledger →"}
            </span>
            <span className="px-3.5 py-2 rounded-full bg-white border border-black/10 text-[12px] font-medium">
              API Docs
            </span>
          </div>
        </div>

        {/* Right 6-Col Multi-Currency Ledger Stage */}
        <div className="col-span-12 md:col-span-6">
          <div
            className="rounded-[16px] p-4 bg-white border shadow-xs space-y-3 tabular-nums"
            style={{ borderColor: "rgba(10,37,64,0.10)" }}
          >
            <div className="flex items-baseline justify-between border-b pb-2.5" style={{ borderColor: "rgba(10,37,64,0.08)" }}>
              <div>
                <div
                  className="text-[10px] text-[#475b70]"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  CONSOLIDATED LIQUIDITY
                </div>
                <div className="text-[24px] font-semibold tracking-tight">
                  $4,444,162.40
                </div>
              </div>
              <span
                className="px-2 py-0.5 rounded bg-[#ecfdf5] text-[#0d7a52] text-[11px] font-medium"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                +$17,910/mo yield
              </span>
            </div>

            <div
              className="space-y-1.5 text-[11.5px]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              {[
                ["USD · Treasury Sweep (4.85%)", "$2,840,912.40"],
                ["EUR · Frankfurt DE-IBAN", "€1,190,400.00"],
                ["GBP · London Faster Payments", "£412,850.00"],
              ].map(([acct, bal]) => (
                <div
                  key={acct}
                  className="px-3 py-2 rounded-[9px] bg-[#f6f9fc] flex items-center justify-between"
                >
                  <span className="text-[#475b70] truncate">{acct}</span>
                  <span className="font-semibold text-[#0a2540]">{bal}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Settlement Audit Bar */}
      <div className="px-7 pt-5">
        <div
          className="rounded-[12px] px-4 py-2.5 bg-white border flex items-center justify-between text-[11px] tabular-nums"
          style={{
            borderColor: "rgba(10,37,64,0.09)",
            fontFamily: "var(--font-mono), monospace",
          }}
        >
          <span className="text-[#475b70]">SEPA Instant → Acme GmbH (€48,200.00)</span>
          <span className="text-[#0d7a52] font-medium">✓ Settled in 740ms · 0.00% FX markup</span>
        </div>
      </div>
    </div>
  );
}

export function BeforeAfterShowcase({
  lang,
  onApplyPreset,
}: {
  lang: "en" | "es";
  onApplyPreset?: (preset: ShowcasePresetMix) => void;
}) {
  const [activeCaseId, setActiveCaseId] = useState<CaseId>("cloud");
  const [viewMode, setViewMode] = useState<"slider" | "video">("slider");
  const [splitPct, setSplitPct] = useState(48);
  const [isDragging, setIsDragging] = useState(false);
  const [liveDragAnnouncement, setLiveDragAnnouncement] = useState("");

  const stageRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);
  const sliderRef = useRef<HTMLInputElement | null>(null);

  const activeCase = CASES.find((c) => c.id === activeCaseId) || CASES[0];
  const videoSrc = lang === "en" ? "/forma-ab-demo-en.mp4" : "/forma-ab-demo.mp4";
  const videoDownloadName =
    lang === "en" ? "forma-before-after-en.mp4" : "forma-before-after-es.mp4";
  const fullDemoAfterHref = lang === "en" ? "/demo/en/with-forma" : "/demo/with-forma";
  const fullDemoBeforeHref =
    lang === "en" ? "/demo/en/without-forma" : "/demo/without-forma";

  const clampSplit = (raw: number) => Math.max(6, Math.min(94, Math.round(raw)));

  // Sync custom CSS properties on range slider for WebKit/Blink track fill (modern-web-guidance `slider`)
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    el.style.setProperty("--attr-min", el.min || "6");
    el.style.setProperty("--attr-max", el.max || "94");
    el.style.setProperty("--control-value", String(splitPct));
  }, [splitPct, viewMode]);

  const updateSplitFromClientX = (clientX: number) => {
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    if (rect.width <= 0) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplitPct(clampSplit(pct));
  };

  const announceSplitPosition = (nextPct: number) => {
    const desc =
      nextPct <= 20
        ? "mostly showing With forma design"
        : nextPct >= 80
        ? "mostly showing Without forma baseline"
        : "centered comparison";
    setLiveDragAnnouncement(`Comparison curtain moved: ${desc}`);
    setTimeout(() => setLiveDragAnnouncement(""), 1000);
  };

  return (
    <section
      id="proof"
      className="py-16 px-5 border-t border-[var(--line)] bg-[#f6f5f2]"
    >
      <div className="mx-auto max-w-[1120px] space-y-6">
        {/* Header + Case Switcher + View Mode */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-3">
            <h2
              className="text-[clamp(1.95rem,1.25rem+2.5vw,2.85rem)] leading-[1.06] tracking-[-0.025em] font-normal"
              style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
            >
              {lang === "es"
                ? "Mismo modelo de IA. Mismo prompt. Otro universo visual."
                : "Same AI model. Same prompt. Worlds apart."}
            </h2>

            {/* 3 Flagship Case Selector Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {CASES.map((c) => {
                const selected = c.id === activeCaseId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setActiveCaseId(c.id);
                      setViewMode("slider");
                    }}
                    className={`min-h-[2.125rem] px-3.5 py-1.5 rounded-full text-[12px] font-medium cursor-pointer transition-colors ${
                      selected
                        ? "bg-[#141413] text-white shadow-xs"
                        : "bg-white border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {lang === "es" ? c.badgeEs : c.badgeEn}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="inline-flex p-1 rounded-full bg-white border border-[var(--line)] text-[12px]">
              <button
                type="button"
                onClick={() => setViewMode("slider")}
                className={`min-h-[2rem] px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                  viewMode === "slider"
                    ? "bg-[#141413] text-white font-medium"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>{lang === "es" ? "Cortina interactiva" : "Interactive Curtain"}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("video")}
                className={`min-h-[2rem] px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                  viewMode === "video"
                    ? "bg-[#141413] text-white font-medium"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                <Play className="w-3 h-3" />
                <span>{lang === "es" ? "Vídeo 1080p" : "1080p Video"}</span>
              </button>
            </div>

            <a
              href={videoSrc}
              download={videoDownloadName}
              className="min-h-[2.25rem] inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[var(--line-strong)] hover:bg-[var(--panel)] text-[12px] font-medium"
            >
              <Download className="w-3.5 h-3.5" />
              <span>MP4</span>
            </a>
          </div>
        </div>

        {/* Visibly hidden polite live region registered on page load for drag accessibility */}
        <div className="sr-only" aria-live="polite">
          {liveDragAnnouncement}
        </div>

        {/* Double-Bezel Stage */}
        <div className="rounded-[22px] p-2.5 bg-white border border-[var(--line)] shadow-[var(--shadow-md)] space-y-3">
          {viewMode === "slider" ? (
            <>
              <div
                ref={stageRef}
                className="relative h-[470px] sm:h-[495px] rounded-[16px] overflow-hidden border border-[var(--line)]"
              >
                {/* BASE LAYER (Right / Full): WITH FORMA */}
                <div className="absolute inset-0">
                  <AfterFormaCanvas activeCase={activeCase.id} lang={lang} />
                </div>

                {/* CLIPPED TOP LAYER (Left): WITHOUT FORMA (100% GPU clip-path — zero layout thrash!) */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ clipPath: `inset(0 ${100 - splitPct}% 0 0)` }}
                >
                  <BeforeSlopCanvas activeCase={activeCase.id} lang={lang} />
                </div>

                {/* Vertical Divider Line + Dedicated Accessible Drag Handle Button */}
                <div
                  className="absolute inset-y-0 z-20 pointer-events-none"
                  style={{ left: `${splitPct}%`, transform: "translateX(-50%)" }}
                >
                  <div className="w-[2.5px] h-full bg-[#E06D44] shadow-[0_0_12px_rgba(224,109,68,0.55)] mx-auto" />
                  <button
                    ref={handleRef}
                    type="button"
                    aria-label={
                      lang === "es"
                        ? "Control de cortina antes y después. Usa las flechas izquierda y derecha para mover."
                        : "Before and after comparison handle. Use left and right arrow keys to move."
                    }
                    onPointerDown={(e) => {
                      if (e.button !== 0) return;
                      e.currentTarget.setPointerCapture(e.pointerId);
                      setIsDragging(true);
                    }}
                    onPointerMove={(e) => {
                      if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
                      updateSplitFromClientX(e.clientX);
                    }}
                    onLostPointerCapture={() => {
                      setIsDragging(false);
                      announceSplitPosition(splitPct);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowLeft") {
                        e.preventDefault();
                        const next = clampSplit(splitPct - 6);
                        setSplitPct(next);
                        announceSplitPosition(next);
                      } else if (e.key === "ArrowRight") {
                        e.preventDefault();
                        const next = clampSplit(splitPct + 6);
                        setSplitPct(next);
                        announceSplitPosition(next);
                      }
                    }}
                    className={`split-drag-handle pointer-events-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-[#141413] border-2 border-[#E06D44] shadow-lg flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141413] ${
                      isDragging ? "dragging scale-105" : ""
                    }`}
                  >
                    <ArrowLeftRight className="w-4 h-4 text-[#E06D44]" aria-hidden="true" />
                  </button>
                </div>

                {/* Top Corner Score Pills */}
                <span
                  className="absolute bottom-3.5 left-3.5 z-10 px-3 py-1 rounded-full bg-slate-950/90 text-red-300 text-[11px] border border-red-500/30 tabular-nums"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  {lang === "es" ? "SIN FORMA · " : "RAW AI · "}
                  {activeCase.beforeScore}
                </span>
                <span
                  className="absolute bottom-3.5 right-3.5 z-10 px-3 py-1 rounded-full bg-[#141413]/92 text-[#4ade80] text-[11px] border border-white/12 tabular-nums"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  {lang === "es" ? "CON FORMA · " : "WITH FORMA · "}
                  {activeCase.afterScore}
                </span>
              </div>

              {/* Single-Pointer Quick Presets + Accessible Labeled Native Range Slider */}
              <div className="px-3 py-1.5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-1.5">
                  {[
                    [88, lang === "es" ? "Ver Sin forma" : "Show Raw AI"],
                    [48, "50 / 50"],
                    [8, lang === "es" ? "Ver Con forma" : "Show With forma"],
                  ].map(([val, lbl]) => (
                    <button
                      key={String(lbl)}
                      type="button"
                      onClick={() => {
                        setSplitPct(Number(val));
                        announceSplitPosition(Number(val));
                      }}
                      className="min-h-[1.75rem] px-2.5 py-0.5 rounded-full bg-[#f4f4f1] hover:bg-[#e7e6e0] text-[11px] text-[var(--ink)] cursor-pointer"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>

                <div className="flex-1 min-w-[200px] flex items-center gap-3">
                  <label
                    htmlFor="forma-ab-range"
                    className="text-[11px] text-[var(--muted)] shrink-0"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    {lang === "es" ? "Comparar:" : "Compare:"}
                  </label>
                  <input
                    ref={sliderRef}
                    id="forma-ab-range"
                    type="range"
                    min={6}
                    max={94}
                    step={1}
                    value={splitPct}
                    aria-valuetext={`${100 - splitPct}% With forma revealed`}
                    onChange={(e) => setSplitPct(Number(e.target.value))}
                    className="forma-split-slider flex-1"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-[16px] overflow-hidden bg-[#fbfbfa] border border-[var(--line)] aspect-video">
              <video
                key={videoSrc}
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
                controls
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Prompt & 4-Pillar Anatomical Diff Strip */}
          <div className="rounded-[16px] p-4 bg-[#f7f6f2] border border-[var(--line)] space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--line)]">
              <div className="text-[12.5px]">
                <span
                  className="text-[10.5px] text-[var(--muted)] mr-2"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  PROMPT:
                </span>
                <span className="italic text-[var(--ink)]">
                  {lang === "es" ? activeCase.promptEs : activeCase.promptEn}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {activeCase.id === "coffee" && (
                  <>
                    <a
                      href={fullDemoBeforeHref}
                      target="_blank"
                      rel="noreferrer"
                      className="min-h-[1.875rem] px-3 py-1 rounded-full bg-white border border-[var(--line)] text-[11px] text-[var(--muted)] hover:text-[var(--ink)] inline-flex items-center gap-1"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      <span>{lang === "es" ? "Antes" : "Raw"}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                    <a
                      href={fullDemoAfterHref}
                      target="_blank"
                      rel="noreferrer"
                      className="min-h-[1.875rem] px-3 py-1 rounded-full bg-white border border-[var(--line-strong)] text-[11px] font-medium text-[#118453] inline-flex items-center gap-1"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      <span>{lang === "es" ? "Demo completa" : "Full Demo"}</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  </>
                )}
                {onApplyPreset && (
                  <button
                    type="button"
                    onClick={() => onApplyPreset(activeCase.studioPreset)}
                    className="min-h-[1.875rem] px-3.5 py-1 rounded-full bg-[#141413] text-white text-[11.5px] font-medium cursor-pointer hover:opacity-90"
                  >
                    {lang === "es"
                      ? "Cargar este ADN en el Studio ↑"
                      : "Load this DNA in Studio ↑"}
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(lang === "es" ? activeCase.diffsEs : activeCase.diffsEn).map(
                ([layer, change]) => (
                  <div
                    key={layer}
                    className="rounded-[11px] p-2.5 bg-white border border-[var(--line)]"
                  >
                    <div
                      className="text-[10px] text-[#E06D44] font-medium"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      {layer}
                    </div>
                    <div className="text-[11.5px] text-[var(--ink)] mt-0.5 leading-snug">
                      {change}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
