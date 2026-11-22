"use client";

import React, { useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Loader2, Sparkles } from "lucide-react";
import type { DoctorStudioPreset, WebDoctorDiagnosis } from "@/lib/web-doctor";

interface AuditApiResponse {
  url: string;
  hostname: string;
  title?: string;
  craftScore: number;
  antiSlopGrade: string;
  coreWebVitals?: {
    source: string;
    performanceScore?: number;
    accessibilityScore?: number;
    lcp?: string | null;
    cls?: string | null;
  };
  doctor: WebDoctorDiagnosis;
  tokens: {
    mode: "light" | "dark";
    bg: string;
    ink: string;
    accent: string;
    primaryFont: string;
    primaryEasing: string;
  };
  error?: string;
}

const INITIAL_SAMPLE_AUDIT: AuditApiResponse = {
  url: "https://forma-to.vercel.app/demo/without-forma",
  hostname: "demo-template.app",
  title: "Raw Generic SaaS Landing",
  craftScore: 34,
  antiSlopGrade: "C",
  coreWebVitals: {
    source: "forma-xray + APCA-W3 + GoodUI Baseline",
    performanceScore: 76,
    accessibilityScore: 72,
    lcp: "2.4 s",
    cls: "0.082",
  },
  tokens: {
    mode: "dark",
    bg: "#090d16",
    ink: "#94a3b8",
    accent: "#8b5cf6",
    primaryFont: "Inter",
    primaryEasing: "ease",
  },
  doctor: {
    overallHealthScore: 46,
    grade: "D",
    apca: {
      bodyLcSigned: -46.8,
      bodyLcAbs: 46.8,
      bodyStatus: "Low",
      accentLcAbs: 39.2,
    },
    rosettaFontTwins: [
      {
        commercial: "Klim Söhne / Neue Haas Grotesk",
        foundry: "Klim Type Foundry / Linotype",
        openTwin: "Uncut Sans + Commit Mono",
        pairingId: "pair-uncut-commit",
        openTypeFeatures: '"ss01" 1, "ss02" 1, "tnum" 1',
        cssImport: "https://cdn.jsdelivr.net/npm/@fontsource/uncut-sans@5/600.css",
      },
    ],
    recommendedFontPairing: {
      id: "pair-uncut-commit",
      name: "Uncut Sans + Commit Mono",
      foundry: "UNCUT / Fontsource",
      reasonEn:
        "Replaces generic Inter default with contemporary Uncut Sans + smart-kerned Commit Mono and OpenType stylistic sets.",
      reasonEs:
        "Sustituye la Inter genérica por Uncut Sans + Commit Mono con sets estilísticos OpenType y métricas tabulares.",
      openTypeFeatures: '"ss01" 1, "ss02" 1, "tnum" 1',
      cssImport: "https://cdn.jsdelivr.net/npm/@fontsource/uncut-sans@5/600.css",
    },
    suggestions: [
      {
        id: "apca-body-contrast",
        severity: "critical",
        framework: "APCA-W3 Contrast",
        whatEn:
          "Body text perceptual contrast is Lc -46.8 (#94a3b8 on #090d16), well below the Lc 75 fluent-reading threshold.",
        whatEs:
          "El contraste perceptual APCA del cuerpo es Lc -46.8 (#94a3b8 sobre #090d16), muy por debajo del umbral Lc 75.",
        whyEn:
          "Muted slate text over dark navy passes loose mathematical checks on headings yet causes severe eye strain on OLED screens.",
        whyEs:
          "El texto gris azulado sobre fondo oscuro fatiga la lectura en pantallas OLED aunque parezca aceptable a simple vista.",
        fixEn:
          "Promote primary ink to #f4f4f1 (|Lc| 96) and set secondary copy to oklch(0.76 0.01 90) (|Lc| >= 68).",
        fixEs:
          "Sube la tinta primaria a #f4f4f1 (|Lc| 96) y fija el texto de apoyo en oklch(0.76 0.01 90) (|Lc| >= 68).",
        codePatch: `:root {\n  --bg: #0b0c0e;\n  --ink: #f4f4f1; /* APCA |Lc| 96 */\n  --muted: oklch(0.76 0.01 90); /* APCA |Lc| 69 */\n}`,
      },
      {
        id: "goodui-cta-hierarchy",
        severity: "high",
        framework: "GoodUI & Hick's Law",
        whatEn:
          "Action hierarchy dilution: 4 equal-weight buttons above the fold using vague labels ('Learn More', 'Submit').",
        whatEs:
          "Dilución de conversión: 4 botones con idéntico peso visual en el primer pantallazo y verbos vagos ('Saber más', 'Enviar').",
        whyEn:
          "Hick's Law and GoodUI A/B benchmarks confirm competing primary CTAs increase decision time and drop click-through.",
        whyEs:
          "La Ley de Hick y los experimentos A/B de GoodUI confirman que varios botones compitiendo frenan la decisión en los primeros 5s.",
        fixEn:
          "Keep one high-contrast primary CTA stating concrete value paired with a single quiet ghost link.",
        fixEs:
          "Deja un único CTA primario de alto contraste orientado al resultado junto a un enlace secundario discreto.",
        codePatch: `<div class="cta-row">\n  <button type="submit" class="btn-primary">Deploy cluster free →</button>\n  <a href="#architecture" class="btn-ghost">Inspect live benchmark</a>\n</div>`,
      },
      {
        id: "practical-typography-precision",
        severity: "opportunity",
        framework: "Practical Typography & WCAG 1.4.4",
        whatEn:
          "Missing font-size-adjust: from-font (causes 0.082 CLS on swap), tabular-nums, and 65ch line-length cap.",
        whatEs:
          "Falta font-size-adjust: from-font (provoca CLS 0.082 al cargar fuente), números tabulares y límite de lectura 65ch.",
        whyEn:
          "Metric normalization eliminates webfont layout shift, while <= 2.5x clamp() preserves WCAG 1.4.4 200% browser zoom.",
        whyEs:
          "Normalizar métricas elimina el salto CLS, mientras clamp() <= 2.5x garantiza el zoom accesible del 200%.",
        codePatch: `body {\n  font-size-adjust: from-font;\n  font-feature-settings: "ss01" 1, "tnum" 1;\n}\nh1 { font-size: clamp(2.1rem, 1.35rem + 2.6vw, 4.2rem); text-wrap: balance; }\np { max-width: 65ch; text-wrap: pretty; }`,
        fixEn:
          "Add font-size-adjust: from-font, Utopia-grade <= 2.5x fluid clamp(), and max-width: 65ch on prose.",
        fixEs:
          "Añade font-size-adjust: from-font, escala clamp() <= 2.5x y max-width: 65ch en párrafos.",
      },
      {
        id: "wallace-css-gpu-hygiene",
        severity: "opportunity",
        framework: "Project Wallace & GPU",
        whatEn:
          "Non-composited 'transition: all' rules and missing :focus-visible / prefers-reduced-motion safeguards.",
        whatEs:
          "Uso de 'transition: all' fuera de GPU y ausencia de :focus-visible y prefers-reduced-motion.",
        whyEn:
          "Animating layout properties triggers main-thread paint storms; explicit :focus-visible rings are mandatory for keyboard users.",
        whyEs:
          "Animar propiedades de layout bloquea el hilo principal; :focus-visible es indispensable para navegación por teclado.",
        fixEn:
          "Restrict motion to GPU transform/opacity with snappy out-expo easing and add :focus-visible.",
        fixEs:
          "Restringe transiciones a transform y opacity en GPU con curva out-expo y añade :focus-visible.",
        codePatch: `.card {\n  transition: transform 160ms cubic-bezier(0.22, 1, 0.36, 1), opacity 160ms ease;\n}\n:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }`,
      },
    ],
    recommendedStudioPreset: {
      idea: "Autonomous cloud & AI platform redesigned with dark halftone surface, APCA Lc >= 90 contrast, Uncut Sans + Commit Mono, and single focal CTA",
      surfaceId: "resizes-infra",
      paletteId: "pal-carbon-halftone",
      fontPairingId: "pair-uncut-commit",
      layoutId: "pdepablo-studio",
      motionId: "linear-precision",
    },
    markdownPatch: `# FORMA DOCTOR — Website Upgrade Plan\n- Promote --ink to #f4f4f1 (APCA |Lc| 96)\n- Switch typography to Uncut Sans + Commit Mono ("ss01" 1, "tnum" 1)\n- Consolidate hero CTAs to 1 primary button + 1 ghost link (GoodUI / Hick's Law)\n- Add font-size-adjust: from-font & GPU-only transform/opacity transitions`,
  },
};

const QUICK_AUDIT_TARGETS = [
  {
    labelEn: "AI Slop Sample (34/100)",
    labelEs: "Muestra AI Slop (34/100)",
    url: "https://forma-to.vercel.app/demo/without-forma",
  },
  {
    labelEn: "resiz.es",
    labelEs: "resiz.es",
    url: "https://resiz.es",
  },
  {
    labelEn: "pdepablo.com",
    labelEs: "pdepablo.com",
    url: "https://pdepablo.com",
  },
  {
    labelEn: "treg.to",
    labelEs: "treg.to",
    url: "https://treg.to",
  },
];

export function FormaDoctorPanel({
  lang,
  onApplyPreset,
}: {
  lang: "en" | "es";
  onApplyPreset: (preset: DoctorStudioPreset) => void;
}) {
  const [urlValue, setUrlValue] = useState("https://resiz.es");
  const [hasBlurred, setHasBlurred] = useState(false);
  const [fieldInvalid, setFieldInvalid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [report, setReport] = useState<AuditApiResponse>(INITIAL_SAMPLE_AUDIT);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [liveStatus, setLiveStatus] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const checkUrlValidity = (el: HTMLInputElement | null): boolean => {
    if (!el) return true;
    const val = el.value.trim();
    if (!val) return false;
    try {
      const parsed = new URL(val);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const runLiveAudit = async (targetUrl: string) => {
    const normalized = targetUrl.trim().startsWith("http")
      ? targetUrl.trim()
      : `https://${targetUrl.trim()}`;
    setUrlValue(normalized);
    setFieldInvalid(false);
    setApiError("");
    setLoading(true);
    setLiveStatus(
      lang === "es"
        ? `Auditando ${normalized}...`
        : `Auditing ${normalized}...`
    );

    try {
      const res = await fetch(`/api/audit?url=${encodeURIComponent(normalized)}`);
      const data = (await res.json()) as AuditApiResponse;
      if (!res.ok || data.error || !data.doctor) {
        setApiError(
          data.error ||
            (lang === "es"
              ? "No se pudo analizar esta URL pública."
              : "Could not audit this public URL.")
        );
        setLiveStatus(
          lang === "es" ? "Error al analizar la URL." : "Audit failed for target URL."
        );
      } else {
        setReport(data);
        setLiveStatus(
          lang === "es"
            ? `Diagnóstico completado: ${data.doctor.overallHealthScore} sobre 100 (${data.doctor.grade}).`
            : `Diagnosis complete: ${data.doctor.overallHealthScore} out of 100 (${data.doctor.grade}).`
        );
      }
    } catch {
      setApiError(
        lang === "es"
          ? "Tiempo de espera agotado al conectar con el servidor destino."
          : "Network timeout while inspecting target URL."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setLiveStatus(lang === "es" ? "Parche copiado al portapapeles" : "Copied patch to clipboard");
      setTimeout(() => setCopiedId((prev) => (prev === id ? null : prev)), 1800);
    } catch {
      // ignore clipboard errors
    }
  };

  const doc = report.doctor;

  return (
    <section
      id="doctor"
      aria-labelledby="forma-doctor-heading"
      className="py-16 px-5 border-t border-[var(--line)] bg-[#fbfbfa]"
    >
      <div className="mx-auto max-w-[1120px] space-y-7">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2 max-w-[68ch]">
            <h2
              id="forma-doctor-heading"
              className="text-[clamp(1.9rem,1.25rem+2.4vw,2.75rem)] leading-[1.06] tracking-[-0.025em] font-normal"
              style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
            >
              {lang === "es"
                ? "Diagnóstico y mejoras accionables para cualquier web."
                : "Actionable UX, contrast & typography audit for any live URL."}
            </h2>
          </div>

          {/* Quick 1-click preset pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {QUICK_AUDIT_TARGETS.map((item) => (
              <button
                key={item.url}
                type="button"
                onClick={() => void runLiveAudit(item.url)}
                className="min-h-[2rem] px-3 py-1 rounded-full bg-white border border-[var(--line)] hover:border-[var(--ink)] text-[11.5px] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer transition-colors"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                {lang === "es" ? item.labelEs : item.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Accessible URL Audit Form (MWG forms + validate-input-after-interaction) */}
        <div className="rounded-[20px] p-5 bg-white border border-[var(--line)] shadow-[var(--shadow-sm)] space-y-5">
          <form
            aria-labelledby="forma-doctor-heading"
            action="/api/audit"
            method="GET"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              const valid = checkUrlValidity(inputRef.current);
              setHasBlurred(true);
              setFieldInvalid(!valid);
              if (!valid) {
                inputRef.current?.focus();
                return;
              }
              void runLiveAudit(urlValue);
            }}
            className="space-y-2"
          >
            <div className="flex flex-col gap-1">
              <label
                htmlFor="doctor-url-input"
                className="text-[13px] font-medium text-[var(--ink)]"
              >
                {lang === "es"
                  ? "URL pública a diagnosticar y mejorar"
                  : "Public website URL to diagnose and improve"}{" "}
                <span aria-hidden="true" className="text-[#E06D44]">
                  *
                </span>
              </label>
              {/* Persistent hint ABOVE input so autocomplete popovers never obscure it */}
              <span
                id="doctor-url-hint"
                className="text-[11.5px] text-[var(--muted)]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                {lang === "es"
                  ? "Formato: https://tudominio.com · Evalúa APCA-W3, GoodUI, Ley de Hick, Baymard, Checklist.design, Project Wallace y Piedra Rosetta tipográfica."
                  : "Format: https://yourdomain.com · Audits APCA-W3, GoodUI, Hick's Law, Baymard, Checklist.design, Project Wallace & Rosetta font twins."}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
              <input
                ref={inputRef}
                id="doctor-url-input"
                name="url"
                type="url"
                required
                value={urlValue}
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                enterKeyHint="go"
                aria-invalid={fieldInvalid ? "true" : "false"}
                aria-describedby={
                  fieldInvalid ? "doctor-url-hint doctor-url-error" : "doctor-url-hint"
                }
                onChange={(e) => {
                  setUrlValue(e.target.value);
                  if (hasBlurred) {
                    const ok = checkUrlValidity(e.currentTarget);
                    if (ok) setFieldInvalid(false);
                  }
                }}
                onBlur={(e) => {
                  setHasBlurred(true);
                  const ok = checkUrlValidity(e.currentTarget);
                  setFieldInvalid(!ok);
                }}
                className={`doctor-url-input flex-1 min-h-[3rem] px-4 py-2.5 rounded-[12px] bg-[#fbfbfa] border border-[#767676] text-[1rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141413] ${
                  fieldInvalid ? "user-invalid-fallback" : ""
                }`}
                style={{ fontFamily: "var(--font-mono), monospace" }}
              />

              <button
                type="submit"
                disabled={loading}
                className="min-h-[3rem] px-5 py-2.5 rounded-[12px] bg-[#141413] text-white text-[13.5px] font-medium inline-flex items-center justify-center gap-2 cursor-pointer hover:opacity-92 disabled:opacity-60 shrink-0"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Sparkles className="w-4 h-4 text-[#E06D44]" aria-hidden="true" />
                )}
                <span>
                  {loading
                    ? lang === "es"
                      ? "Analizando..."
                      : "Auditing..."
                    : lang === "es"
                    ? "Diagnosticar web"
                    : "Run Web Doctor"}
                </span>
              </button>
            </div>

            {fieldInvalid && (
              <div
                id="doctor-url-error"
                className="text-[12.5px] text-[#d93025] font-medium pt-1"
              >
                <span role="img" aria-label="Error">
                  ❌
                </span>{" "}
                {lang === "es"
                  ? "Introduce una URL completa que empiece por https:// (por ejemplo, https://resiz.es)."
                  : "Enter a full public URL starting with https:// (for example, https://resiz.es)."}
              </div>
            )}

            {apiError && (
              <div className="text-[12.5px] text-[#b42318] bg-[#fef3f2] border border-[#fecdca] rounded-[10px] px-3.5 py-2 mt-1">
                {apiError}
              </div>
            )}
          </form>

          {/* Single polite live region registered from page load */}
          <div className="sr-only" aria-live="polite">
            {liveStatus}
          </div>

          {/* Scorecard Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-[var(--line)]">
            <div className="rounded-[14px] p-3.5 bg-[#f7f6f2] border border-[var(--line)]">
              <div
                className="text-[10.5px] text-[var(--muted)]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                {lang === "es" ? "SALUD GLOBAL" : "OVERALL HEALTH"}
              </div>
              <div
                className="mt-1 flex items-baseline gap-2 tabular-nums"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                <span className="text-[22px] font-semibold text-[var(--ink)]">
                  {doc.overallHealthScore}/100
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    doc.overallHealthScore >= 80
                      ? "bg-[#ecfdf5] text-[#118453]"
                      : "bg-[#fef2f2] text-[#b42318]"
                  }`}
                >
                  {doc.grade}
                </span>
              </div>
              <div className="text-[11.5px] text-[var(--muted)] truncate mt-0.5">
                {report.hostname}
              </div>
            </div>

            <div className="rounded-[14px] p-3.5 bg-[#f7f6f2] border border-[var(--line)]">
              <div
                className="text-[10.5px] text-[var(--muted)]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                APCA-W3 CONTRAST
              </div>
              <div
                className="mt-1 flex items-baseline gap-2 tabular-nums"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                <span className="text-[22px] font-semibold text-[var(--ink)]">
                  Lc {doc.apca.bodyLcSigned}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    doc.apca.bodyStatus === "AAA"
                      ? "bg-[#ecfdf5] text-[#118453]"
                      : doc.apca.bodyStatus === "AA"
                      ? "bg-[#fffbeb] text-[#b45309]"
                      : "bg-[#fef2f2] text-[#b42318]"
                  }`}
                >
                  {doc.apca.bodyStatus}
                </span>
              </div>
              <div
                className="text-[11px] text-[var(--muted)] truncate mt-0.5"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                {report.tokens.ink} on {report.tokens.bg}
              </div>
            </div>

            <div className="rounded-[14px] p-3.5 bg-[#f7f6f2] border border-[var(--line)]">
              <div
                className="text-[10.5px] text-[var(--muted)]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                {lang === "es" ? "TIPOGRAFÍA DETECTADA" : "DETECTED TYPEFACE"}
              </div>
              <div className="mt-1 text-[15px] font-semibold truncate text-[var(--ink)]">
                {report.tokens.primaryFont}
              </div>
              <div
                className="text-[11px] text-[#E06D44] truncate mt-1"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                → {doc.recommendedFontPairing.name}
              </div>
            </div>

            <div className="rounded-[14px] p-3.5 bg-[#f7f6f2] border border-[var(--line)]">
              <div
                className="text-[10.5px] text-[var(--muted)]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                CRAFT & CWV
              </div>
              <div
                className="mt-1 flex items-baseline gap-2 tabular-nums"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                <span className="text-[22px] font-semibold text-[var(--ink)]">
                  {report.craftScore}/100
                </span>
                {report.coreWebVitals?.cls && (
                  <span className="text-[11.5px] text-[var(--muted)]">
                    CLS {report.coreWebVitals.cls}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[var(--muted)] truncate mt-0.5">
                {doc.suggestions.length}{" "}
                {lang === "es" ? "mejoras detectadas" : "actionable fixes"}
              </div>
            </div>
          </div>

          {/* Rosetta Typography Recommendation Banner */}
          <div className="rounded-[16px] p-4 bg-[#141413] text-[#fbfbfa] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-[66ch]">
              <div
                className="text-[11px] text-[#E06D44]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                {doc.rosettaFontTwins[0]
                  ? `ROSETTA MATCH · ${doc.rosettaFontTwins[0].commercial} → ${doc.recommendedFontPairing.foundry}`
                  : `${doc.recommendedFontPairing.foundry} · OPENTYPE UPGRADE`}
              </div>
              <div className="text-[15px] font-semibold">
                {doc.recommendedFontPairing.name}
                {doc.recommendedFontPairing.openTypeFeatures && (
                  <span
                    className="ml-2 text-[11.5px] font-normal text-white/65"
                    style={{ fontFamily: "var(--font-mono), monospace" }}
                  >
                    ({doc.recommendedFontPairing.openTypeFeatures})
                  </span>
                )}
              </div>
              <p className="text-[12.5px] text-white/75 leading-[1.5]">
                {lang === "es"
                  ? doc.recommendedFontPairing.reasonEs
                  : doc.recommendedFontPairing.reasonEn}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() =>
                  void handleCopy("doctor-md", doc.markdownPatch)
                }
                className="min-h-[2.25rem] px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/18 border border-white/15 text-[12px] font-medium inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copiedId === "doctor-md" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#4ade80]" aria-hidden="true" />
                    <span>{lang === "es" ? "Plan copiado" : "Plan copied"}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>
                      {lang === "es" ? "Copiar informe MD" : "Copy Upgrade MD"}
                    </span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => onApplyPreset(doc.recommendedStudioPreset)}
                className="min-h-[2.25rem] px-4 py-1.5 rounded-full bg-white text-[#141413] hover:bg-[#eae9e4] text-[12px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>
                  {lang === "es"
                    ? "Reconstruir mejorada en Studio"
                    : "Rebuild Upgraded in Studio"}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Non-exclusive Native <details>/<summary> Accordion of What -> Why -> Exact Fix */}
          <div
            aria-label={
              lang === "es"
                ? "Lista de mejoras recomendadas"
                : "Recommended website improvements"
            }
            className="space-y-2.5"
          >
            {doc.suggestions.length === 0 ? (
              <div className="rounded-[14px] p-4 bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-[13px]">
                {lang === "es"
                  ? "✓ Excelente ejecución: APCA, jerarquía de conversión, métricas tipográficas y animaciones GPU superan el listón de referencia."
                  : "✓ High-craft execution: APCA contrast, CTA hierarchy, typographic metrics, and GPU transitions all pass benchmark thresholds."}
              </div>
            ) : (
              doc.suggestions.map((item, idx) => (
                <details
                  key={item.id}
                  open={idx < 2}
                  className="doctor-details rounded-[14px] bg-[#f7f6f2] border border-[var(--line)] overflow-hidden"
                >
                  {/* MWG accordion rule: NEVER place headings inside <summary>; keep marker immediately before label text */}
                  <summary className="doctor-summary px-4 py-3 text-[13.5px] font-medium text-[var(--ink)] hover:bg-[#efeee8] select-none">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10.5px] shrink-0 ${
                        item.severity === "critical"
                          ? "bg-[#fef2f2] text-[#b42318] border border-[#fecdca]"
                          : item.severity === "high"
                          ? "bg-[#fffbeb] text-[#b45309] border border-[#fde68a]"
                          : "bg-white text-[#141413] border border-[var(--line)]"
                      }`}
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      {item.framework}
                    </span>
                    <span className="leading-snug">
                      {lang === "es" ? item.whatEs : item.whatEn}
                    </span>
                  </summary>

                  <div className="px-4 pb-4 pt-2 border-t border-[var(--line)] bg-white space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12.5px] leading-[1.55]">
                      <div className="max-w-[62ch]">
                        <span
                          className="text-[10.5px] text-[var(--muted)] block mb-0.5"
                          style={{ fontFamily: "var(--font-mono), monospace" }}
                        >
                          {lang === "es" ? "POR QUÉ IMPORTA" : "WHY IT MATTERS"}
                        </span>
                        <p className="text-[var(--muted)]">
                          {lang === "es" ? item.whyEs : item.whyEn}
                        </p>
                      </div>
                      <div className="max-w-[62ch]">
                        <span
                          className="text-[10.5px] text-[#118453] block mb-0.5"
                          style={{ fontFamily: "var(--font-mono), monospace" }}
                        >
                          {lang === "es" ? "SOLUCIÓN RECOMENDADA" : "RECOMMENDED FIX"}
                        </span>
                        <p className="text-[var(--ink)] font-medium">
                          {lang === "es" ? item.fixEs : item.fixEn}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[11px] bg-[#141413] text-[#eae9e4] p-3 flex items-start justify-between gap-3">
                      <pre
                        className="text-[11.5px] leading-[1.55] whitespace-pre-wrap break-words overflow-x-auto flex-1"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        <code>{item.codePatch}</code>
                      </pre>
                      <button
                        type="button"
                        onClick={() => void handleCopy(item.id, item.codePatch)}
                        aria-label={`Copy fix for ${item.id}`}
                        className="min-h-[1.875rem] px-2.5 py-1 rounded-full bg-white/12 hover:bg-white/20 text-[11px] text-white inline-flex items-center gap-1 cursor-pointer shrink-0"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        {copiedId === item.id ? (
                          <>
                            <Check className="w-3 h-3 text-[#4ade80]" aria-hidden="true" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" aria-hidden="true" />
                            <span>Fix</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </details>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
