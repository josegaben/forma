"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { FormaLogo } from "@/components/FormaLogo";

interface TelemetryResponse {
  storageBackend: string;
  startedAt: string;
  kpis: {
    totalAgentPulls: number;
    totalHumanVisits: number;
    agentShareOfTrafficPct: number;
    totalSyntheses: number;
    totalCopies: number;
    totalShares: number;
    componentInstalls: number;
    copyRatePct: number;
    shareToCopyRatioPct: number;
  };
  endpointBreakdown: {
    llmsTxt: number;
    skillMd: number;
    mcpCalls: number;
    composeApi: number;
    scrapeApi: number;
    discoverApi: number;
  };
  agentClients: Record<string, number>;
  mcpTools: Record<string, number>;
  rankedMixes: {
    mixCode: string;
    views: number;
    copies: number;
    shares: number;
    retentionScore: number;
  }[];
  rankedPalettes: { paletteId: string; count: number }[];
  rankedComponents: { componentId: string; installs: number }[];
  recentEvents: {
    id: string;
    ts: string;
    actor: "agent" | "human";
    client: string;
    event: string;
    target?: string;
    mixCode?: string;
    paletteId?: string;
  }[];
}

export default function MetricsDashboardPage() {
  const [data, setData] = useState<TelemetryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const loadMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/telemetry", { cache: "no-store" });
      if (res.ok) {
        setData(await res.json());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMetrics();
    const timer = setInterval(loadMetrics, 8000);
    return () => clearInterval(timer);
  }, [loadMetrics]);

  const k = data?.kpis;

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-[#141413]">
      {/* Compact Header */}
      <header className="border-b border-[var(--line)] bg-white/90 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto max-w-[1140px] h-[56px] px-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a href="/" aria-label="Back to forma">
              <FormaLogo size={26} />
            </a>
            <span
              className="text-[12px] px-2.5 py-0.5 rounded-full bg-[var(--panel)] border border-[var(--line)] text-[var(--muted)]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              /metrics · {data?.storageBackend || "loading"}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--line)] text-[12px] text-[var(--muted)] hover:text-[var(--ink)]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Studio</span>
            </a>
            <button
              type="button"
              onClick={loadMetrics}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#141413] text-white text-[12px] font-medium cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1140px] px-5 py-10 space-y-8">
        <div>
          <h1
            className="text-[clamp(2rem,3.6vw,2.8rem)] leading-[1.06] tracking-[-0.025em] font-normal"
            style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
          >
            Product & Agent Telemetry
          </h1>
          <p className="text-[14px] text-[var(--muted)] mt-1">
            Real-time measurement of AI agent pulls (`/llms.txt`, `/api/mcp`, `/api/compose`), Copy-to-Share conversion, and highest-retaining format mixes.
          </p>
        </div>

        {/* 4 Primary KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <article className="visual-card p-5">
            <h2
              className="text-[11px] font-normal text-[var(--muted)] uppercase"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              AGENT PULLS VS HUMAN VISITS
            </h2>
            <p className="mt-2 flex items-baseline gap-2.5">
              <span className="text-[32px] font-semibold tabular-nums tracking-tight">
                {k?.totalAgentPulls ?? 0}
              </span>
              <span
                className="text-[13px] text-[var(--muted)] tabular-nums"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                vs {k?.totalHumanVisits ?? 0} humans
              </span>
            </p>
            <p
              className="mt-2 text-[11.5px] text-[#118453] tabular-nums"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              {k?.agentShareOfTrafficPct ?? 0}% agent traffic share
            </p>
          </article>

          <article className="visual-card p-5">
            <h2
              className="text-[11px] font-normal text-[var(--muted)] uppercase"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              AI INSTRUCTION COPIES
            </h2>
            <p className="mt-2 flex items-baseline gap-2.5">
              <span className="text-[32px] font-semibold tabular-nums tracking-tight">
                {k?.totalCopies ?? 0}
              </span>
              <span
                className="text-[13px] text-[var(--muted)] tabular-nums"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                ({k?.copyRatePct ?? 0}% conv)
              </span>
            </p>
            <p className="mt-2 text-[11.5px] text-[var(--muted)] tabular-nums">
              DESIGN.md + llms.txt bootstrap copies
            </p>
          </article>

          <article className="visual-card p-5">
            <h2
              className="text-[11px] font-normal text-[var(--muted)] uppercase"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              SHARE-TO-COPY RATIO
            </h2>
            <p className="mt-2 flex items-baseline gap-2.5">
              <span className="text-[32px] font-semibold tabular-nums tracking-tight">
                {k?.shareToCopyRatioPct ?? 0}%
              </span>
              <span
                className="text-[13px] text-[var(--muted)] tabular-nums"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                ({k?.totalShares ?? 0} shared)
              </span>
            </p>
            <p className="mt-2 text-[11.5px] text-[var(--muted)]">
              Viral K-factor signal from custom mix URLs
            </p>
          </article>

          <article className="visual-card p-5">
            <h2
              className="text-[11px] font-normal text-[var(--muted)] uppercase"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              SYNTHESES & CLI INSTALLS
            </h2>
            <p className="mt-2 flex items-baseline gap-2.5">
              <span className="text-[32px] font-semibold tabular-nums tracking-tight">
                {(k?.totalSyntheses ?? 0) + (k?.componentInstalls ?? 0)}
              </span>
            </p>
            <p
              className="mt-2 text-[11.5px] text-[var(--muted)] tabular-nums"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              {k?.totalSyntheses ?? 0} briefs · {k?.componentInstalls ?? 0} shadcn installs
            </p>
          </article>
        </div>

        {/* 2-Column Breakdown: Agent Routes/Clients vs Most Copied Mixes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Agent Endpoints & Clients */}
          <section className="lg:col-span-5 rounded-[18px] bg-white border border-[var(--line)] p-5 space-y-5">
            <div>
              <h2
                className="text-[12px] uppercase text-[var(--muted)] mb-3"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                AGENT ENDPOINT PULLS (/API/*)
              </h2>
              <div className="divide-y divide-[var(--line)] text-[13px]">
                {[
                  ["/llms.txt (Bootstrap)", data?.endpointBreakdown.llmsTxt ?? 0],
                  ["/api/mcp (JSON-RPC Tools)", data?.endpointBreakdown.mcpCalls ?? 0],
                  ["/api/compose (DESIGN.md)", data?.endpointBreakdown.composeApi ?? 0],
                  ["/skill.md (Skill Install)", data?.endpointBreakdown.skillMd ?? 0],
                  ["/api/scrape (Live X-Ray)", data?.endpointBreakdown.scrapeApi ?? 0],
                  ["/api/discover (Radar Feed)", data?.endpointBreakdown.discoverApi ?? 0],
                ].map(([label, val]) => (
                  <div key={String(label)} className="py-2.5 flex items-center justify-between">
                    <span style={{ fontFamily: "var(--font-mono), monospace" }}>{label}</span>
                    <span className="font-semibold tabular-nums">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[var(--line)]">
              <h3
                className="text-[12px] uppercase text-[var(--muted)] mb-2.5"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                DETECTED CLIENTS & AGENTS
              </h3>
              <div className="space-y-1.5 text-[12.5px]">
                {Object.entries(data?.agentClients || {}).map(([client, count]) => (
                  <div key={client} className="flex items-center justify-between">
                    <span className="text-[var(--muted)]">{client}</span>
                    <span
                      className="font-medium tabular-nums"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Right: Top Retaining Mixes & Palettes */}
          <section className="lg:col-span-7 rounded-[18px] bg-white border border-[var(--line)] p-5 space-y-5">
            <div>
              <h2
                id="mix-rankings-heading"
                className="text-[12px] uppercase text-[var(--muted)] mb-3"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                TOP CROSS-REFERENCED MIXES BY COPIES & RETENTION
              </h2>
              {data?.rankedMixes && data.rankedMixes.length > 0 ? (
                <div
                  tabIndex={0}
                  role="region"
                  aria-labelledby="mix-rankings-heading"
                  className="overflow-auto max-w-full max-h-[360px]"
                >
                  <table className="w-full text-[13px] border-separate border-spacing-0">
                    <thead className="sticky top-0 z-10 bg-white">
                      <tr
                        className="text-left text-[11px] text-[var(--muted)]"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        <th scope="col" className="pb-2 border-b border-[var(--line)] font-normal bg-white">
                          MIX GENOME
                        </th>
                        <th scope="col" className="pb-2 border-b border-[var(--line)] font-normal text-right bg-white">
                          VIEWS
                        </th>
                        <th scope="col" className="pb-2 border-b border-[var(--line)] font-normal text-right bg-white">
                          COPIES
                        </th>
                        <th scope="col" className="pb-2 border-b border-[var(--line)] font-normal text-right bg-white">
                          SHARES
                        </th>
                        <th scope="col" className="pb-2 border-b border-[var(--line)] font-normal text-right bg-white">
                          SCORE
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.rankedMixes.map((row) => (
                        <tr key={row.mixCode}>
                          <th
                            scope="row"
                            className="py-2.5 border-b border-[var(--line)] text-left font-medium text-[#E06D44] sticky left-0 bg-white whitespace-nowrap pr-3"
                            style={{ fontFamily: "var(--font-mono), monospace" }}
                          >
                            [{row.mixCode}]
                          </th>
                          <td className="py-2.5 border-b border-[var(--line)] text-right tabular-nums text-[var(--muted)] pl-3">
                            {row.views}
                          </td>
                          <td className="py-2.5 border-b border-[var(--line)] text-right tabular-nums font-semibold pl-3">
                            {row.copies}
                          </td>
                          <td className="py-2.5 border-b border-[var(--line)] text-right tabular-nums text-[var(--muted)] pl-3">
                            {row.shares}
                          </td>
                          <td className="py-2.5 border-b border-[var(--line)] text-right tabular-nums font-medium text-[#118453] pl-3">
                            {row.retentionScore}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[13px] text-[var(--muted)] py-4">
                  No mix interactions recorded yet. Synthesize or copy a style in the Studio to populate live rankings.
                </p>
              )}
            </div>

            {data?.rankedPalettes && data.rankedPalettes.length > 0 && (
              <div className="pt-3 border-t border-[var(--line)]">
                <h3
                  className="text-[12px] uppercase text-[var(--muted)] mb-2.5"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  MOST SELECTED 60-30-10 OKLCH PALETTES
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.rankedPalettes.map((p) => (
                    <span
                      key={p.paletteId}
                      className="px-3 py-1 rounded-full bg-[var(--panel)] border border-[var(--line)] text-[11.5px] tabular-nums"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      {p.paletteId} · <strong>{p.count}</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Live Event Stream */}
        <section className="rounded-[18px] bg-white border border-[var(--line)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h2
              className="text-[12px] uppercase text-[var(--muted)]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              RECENT LIVE TELEMETRY STREAM (ANONYMIZED · ZERO PII)
            </h2>
            <span
              className="text-[11px] text-[var(--muted)]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              Optional Vercel KV: set KV_REST_API_URL + KV_REST_API_TOKEN
            </span>
          </div>

          <div className="divide-y divide-[var(--line)] max-h-[300px] overflow-y-auto text-[12.5px]">
            {(data?.recentEvents || []).map((ev) => (
              <div
                key={ev.id}
                className="py-2 flex flex-wrap items-center justify-between gap-2"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      ev.actor === "agent"
                        ? "bg-[#141413] text-white"
                        : "bg-[var(--panel)] text-[var(--ink)]"
                    }`}
                  >
                    {ev.actor.toUpperCase()}
                  </span>
                  <span className="font-medium">{ev.event}</span>
                  {ev.mixCode && <span className="text-[#E06D44]">[{ev.mixCode}]</span>}
                  {ev.target && <span className="text-[var(--muted)]">({ev.target})</span>}
                </div>
                <div className="flex items-center gap-4 text-[var(--muted)] tabular-nums text-[11.5px]">
                  <span>{ev.client}</span>
                  <time>{new Date(ev.ts).toLocaleTimeString([], { hour12: false })}</time>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
