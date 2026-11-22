import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

export type TelemetryEventType =
  | "human_visit"
  | "synthesize_idea"
  | "copy_spec"
  | "copy_bootstrap"
  | "share_mix"
  | "install_component"
  | "agent_llms_txt"
  | "agent_skill_md"
  | "agent_mcp_call"
  | "agent_compose_api"
  | "agent_scrape_api"
  | "agent_discover_api";

export interface TelemetryEventRecord {
  id: string;
  ts: string;
  actor: "agent" | "human";
  client: string;
  event: TelemetryEventType;
  target?: string;
  mixCode?: string;
  paletteId?: string;
}

export interface TelemetryStoreData {
  startedAt: string;
  counters: Record<TelemetryEventType, number>;
  agentClients: Record<string, number>;
  mcpTools: Record<string, number>;
  topMixes: Record<string, { views: number; copies: number; shares: number }>;
  topPalettes: Record<string, number>;
  topComponents: Record<string, number>;
  recentEvents: TelemetryEventRecord[];
}

const DEFAULT_COUNTERS: Record<TelemetryEventType, number> = {
  human_visit: 0,
  synthesize_idea: 0,
  copy_spec: 0,
  copy_bootstrap: 0,
  share_mix: 0,
  install_component: 0,
  agent_llms_txt: 0,
  agent_skill_md: 0,
  agent_mcp_call: 0,
  agent_compose_api: 0,
  agent_scrape_api: 0,
  agent_discover_api: 0,
};

function getLocalStorePath(): string {
  // On Vercel serverless, /tmp is writable; locally use .forma-telemetry.json in project root
  if (process.env.VERCEL) {
    return "/tmp/forma-telemetry.json";
  }
  return resolve(process.cwd(), ".forma-telemetry.json");
}

function createEmptyStore(): TelemetryStoreData {
  return {
    startedAt: new Date().toISOString(),
    counters: { ...DEFAULT_COUNTERS },
    agentClients: {},
    mcpTools: {},
    topMixes: {},
    topPalettes: {},
    topComponents: {},
    recentEvents: [],
  };
}

let memoryFallback: TelemetryStoreData | null = null;

function readLocalStore(): TelemetryStoreData {
  const filePath = getLocalStorePath();
  if (existsSync(filePath)) {
    try {
      const parsed = JSON.parse(readFileSync(filePath, "utf8")) as TelemetryStoreData;
      return {
        ...createEmptyStore(),
        ...parsed,
        counters: { ...DEFAULT_COUNTERS, ...(parsed.counters || {}) },
      };
    } catch {
      // fall through
    }
  }
  if (!memoryFallback) memoryFallback = createEmptyStore();
  return memoryFallback;
}

function writeLocalStore(data: TelemetryStoreData) {
  memoryFallback = data;
  try {
    writeFileSync(getLocalStorePath(), JSON.stringify(data, null, 2), "utf8");
  } catch {
    // Read-only FS fallback stays in memoryFallback
  }
}

export function classifyClientFromHeaders(
  request?: Request,
  explicitClient?: string
): { actor: "agent" | "human"; client: string } {
  if (explicitClient) {
    return { actor: "agent", client: explicitClient };
  }
  const ua = (request?.headers.get("user-agent") || "").toLowerCase();

  if (!ua) return { actor: "agent", client: "Headless Agent" };
  if (ua.includes("claude") || ua.includes("anthropic")) {
    return { actor: "agent", client: "Claude Code / Anthropic" };
  }
  if (ua.includes("cursor")) {
    return { actor: "agent", client: "Cursor Agent" };
  }
  if (ua.includes("codex") || ua.includes("openai") || ua.includes("chatgpt")) {
    return { actor: "agent", client: "Codex / OpenAI" };
  }
  if (ua.includes("antigravity") || ua.includes("gemini")) {
    return { actor: "agent", client: "Antigravity / Gemini" };
  }
  if (ua.includes("curl/") || ua.includes("wget")) {
    return { actor: "agent", client: "CLI (cURL)" };
  }
  if (ua.includes("node") || ua.includes("undici") || ua.includes("python") || ua.includes("go-http")) {
    return { actor: "agent", client: "SDK / Programmatic Agent" };
  }
  if (ua.includes("mozilla/") && (ua.includes("chrome") || ua.includes("safari") || ua.includes("firefox"))) {
    return { actor: "human", client: "Web Browser" };
  }
  return { actor: "agent", client: "External Agent" };
}

async function pushToVercelKvIfConfigured(record: TelemetryEventRecord) {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!kvUrl || !kvToken) return;

  const pipeline: (string | number)[][] = [
    ["HINCRBY", "forma:counters", record.event, 1],
    ["HINCRBY", "forma:clients", record.client, 1],
    ["LPUSH", "forma:recent", JSON.stringify(record)],
    ["LTRIM", "forma:recent", 0, 39],
  ];

  if (record.mixCode) {
    const field =
      record.event === "copy_spec"
        ? `${record.mixCode}:copies`
        : record.event === "share_mix"
        ? `${record.mixCode}:shares`
        : `${record.mixCode}:views`;
    pipeline.push(["HINCRBY", "forma:mixes", field, 1]);
  }
  if (record.paletteId) {
    pipeline.push(["HINCRBY", "forma:palettes", record.paletteId, 1]);
  }
  if (record.event === "install_component" && record.target) {
    pipeline.push(["HINCRBY", "forma:components", record.target, 1]);
  }
  if (record.event === "agent_mcp_call" && record.target) {
    pipeline.push(["HINCRBY", "forma:mcp_tools", record.target, 1]);
  }

  try {
    await fetch(`${kvUrl.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${kvToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pipeline),
      signal: AbortSignal.timeout(1500),
    });
  } catch {
    // Non-blocking telemetry
  }
}

export async function recordTelemetryEvent(params: {
  event: TelemetryEventType;
  request?: Request;
  actorOverride?: "agent" | "human";
  clientOverride?: string;
  target?: string;
  mixCode?: string;
  paletteId?: string;
}) {
  const detected = classifyClientFromHeaders(params.request, params.clientOverride);
  const isAgentEndpoint = params.event.startsWith("agent_");
  const actor = params.actorOverride ?? (isAgentEndpoint ? "agent" : detected.actor);
  const client =
    isAgentEndpoint && detected.client === "Web Browser"
      ? "Browser Inspector / Dev"
      : detected.client;

  const record: TelemetryEventRecord = {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    ts: new Date().toISOString(),
    actor,
    client,
    event: params.event,
    target: params.target,
    mixCode: params.mixCode,
    paletteId: params.paletteId,
  };

  // 1. Structured JSON log for Vercel Runtime Logs / Log Drains
  console.info(JSON.stringify({ _forma_metric: record }));

  // 2. Local / container persistence
  const store = readLocalStore();
  store.counters[params.event] = (store.counters[params.event] || 0) + 1;
  store.agentClients[client] = (store.agentClients[client] || 0) + 1;

  if (params.event === "agent_mcp_call" && params.target) {
    store.mcpTools[params.target] = (store.mcpTools[params.target] || 0) + 1;
  }

  if (params.mixCode) {
    const cur = store.topMixes[params.mixCode] || { views: 0, copies: 0, shares: 0 };
    if (params.event === "copy_spec") cur.copies += 1;
    else if (params.event === "share_mix") cur.shares += 1;
    else cur.views += 1;
    store.topMixes[params.mixCode] = cur;
  }

  if (params.paletteId) {
    store.topPalettes[params.paletteId] = (store.topPalettes[params.paletteId] || 0) + 1;
  }

  if (params.event === "install_component" && params.target) {
    store.topComponents[params.target] = (store.topComponents[params.target] || 0) + 1;
  }

  store.recentEvents = [record, ...store.recentEvents].slice(0, 35);
  writeLocalStore(store);

  // 3. Optional Cloud KV / Upstash Redis sync
  await pushToVercelKvIfConfigured(record);
}

export async function getTelemetrySummary() {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  const storageBackend = kvUrl && kvToken ? "vercel-kv-redis" : "local-persistent-json";

  const store = readLocalStore();
  const c = store.counters;

  const totalAgentPulls =
    c.agent_llms_txt +
    c.agent_skill_md +
    c.agent_mcp_call +
    c.agent_compose_api +
    c.agent_scrape_api +
    c.agent_discover_api;

  const totalHumanVisits = Math.max(c.human_visit, 0);
  const totalCopies = c.copy_spec + c.copy_bootstrap;
  const totalShares = c.share_mix;
  const totalSyntheses = c.synthesize_idea;

  const copyRatePct =
    totalHumanVisits > 0
      ? Math.min(100, Math.round((totalCopies / totalHumanVisits) * 1000) / 10)
      : totalCopies > 0
      ? 100
      : 0;

  const shareToCopyRatioPct =
    totalCopies > 0 ? Math.round((totalShares / totalCopies) * 1000) / 10 : 0;

  const rankedMixes = Object.entries(store.topMixes)
    .map(([mixCode, stats]) => ({
      mixCode,
      ...stats,
      retentionScore: stats.copies * 3 + stats.shares * 4 + stats.views,
    }))
    .sort((a, b) => b.copies - a.copies || b.retentionScore - a.retentionScore)
    .slice(0, 10);

  const rankedPalettes = Object.entries(store.topPalettes)
    .map(([paletteId, count]) => ({ paletteId, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const rankedComponents = Object.entries(store.topComponents)
    .map(([componentId, installs]) => ({ componentId, installs }))
    .sort((a, b) => b.installs - a.installs)
    .slice(0, 8);

  return {
    storageBackend,
    startedAt: store.startedAt,
    kpis: {
      totalAgentPulls,
      totalHumanVisits,
      agentShareOfTrafficPct:
        totalAgentPulls + totalHumanVisits > 0
          ? Math.round((totalAgentPulls / (totalAgentPulls + totalHumanVisits)) * 1000) / 10
          : 0,
      totalSyntheses,
      totalCopies,
      totalShares,
      componentInstalls: c.install_component,
      copyRatePct,
      shareToCopyRatioPct,
    },
    endpointBreakdown: {
      llmsTxt: c.agent_llms_txt,
      skillMd: c.agent_skill_md,
      mcpCalls: c.agent_mcp_call,
      composeApi: c.agent_compose_api,
      scrapeApi: c.agent_scrape_api,
      discoverApi: c.agent_discover_api,
    },
    agentClients: store.agentClients,
    mcpTools: store.mcpTools,
    rankedMixes,
    rankedPalettes,
    rankedComponents,
    recentEvents: store.recentEvents,
  };
}
