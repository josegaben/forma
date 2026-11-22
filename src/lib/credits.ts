import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

export interface CreditLedgerEntry {
  id: string;
  ts: string;
  operation: string;
  target: string;
  mode: "free-protocol" | "byok-unmetered" | "prepaid-credit" | "topup" | "starter-grant";
  deltaUsd: number;
  balanceAfterUsd: number;
}

export interface CreditWallet {
  apiKey: string;
  createdAt: string;
  balanceUsd: number;
  dailyLimitUsd: number;
  spentTodayUsd: number;
  spentDayKey: string;
  hasByokGemini: boolean;
  maskedByok?: string;
  ledger: CreditLedgerEntry[];
}

interface CreditsStore {
  wallets: Record<string, CreditWallet>;
}

export const FORMA_CLOUD_PRICING = [
  {
    operation: "Open Protocol (/llms.txt, /api/compose, 24 formats, 6 skeletons, 42 vault sections)",
    costUsd: 0,
    unit: "unlimited",
    note: "Always free & open-source",
  },
  {
    operation: "BYOK Mode (X-Gemini-Key header or local npx forma-xray)",
    costUsd: 0,
    unit: "unmetered",
    note: "0% platform fee when using your own key",
  },
  {
    operation: "scan_live_sections (Cloud Headless Playwright + Gemini 4 Vision DOM Vault)",
    costUsd: 0.04,
    unit: "per live URL",
    note: "Renders JS hydration, crops 5 sections & extracts Clean DOM",
  },
  {
    operation: "visual_anti_slop_qa (Cloud Playwright CWV + Contrast + Slop Audit)",
    costUsd: 0.05,
    unit: "per deployment",
    note: "Pixel-level audit against DESIGN.md before shipping",
  },
  {
    operation: "generate_brand_kit (Swiss SVG Logo + Retina OG Card + OKLCH Tokens)",
    costUsd: 0.08,
    unit: "per brand pack",
    note: " Complete visual identity assets in one agent call",
  },
] as const;

const DEFAULT_DEMO_KEY = "sk-forma-live-starter-100";
let memoryCreditsStore: CreditsStore | null = null;

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getCreditsFilePath(): string {
  if (process.env.VERCEL) return "/tmp/forma-credits.json";
  return resolve(process.cwd(), ".forma-credits.json");
}

function createStarterWallet(apiKey: string): CreditWallet {
  const now = new Date().toISOString();
  return {
    apiKey,
    createdAt: now,
    balanceUsd: 1.0,
    dailyLimitUsd: 5.0,
    spentTodayUsd: 0,
    spentDayKey: todayKey(),
    hasByokGemini: false,
    ledger: [
      {
        id: "grant-welcome",
        ts: now,
        operation: "Welcome Starter Credit ($1.00 free — no subscription)",
        target: "account",
        mode: "starter-grant",
        deltaUsd: 1.0,
        balanceAfterUsd: 1.0,
      },
    ],
  };
}

function loadStore(): CreditsStore {
  const path = getCreditsFilePath();
  if (existsSync(path)) {
    try {
      const parsed = JSON.parse(readFileSync(path, "utf8")) as CreditsStore;
      if (parsed && parsed.wallets) {
        memoryCreditsStore = parsed;
        return parsed;
      }
    } catch {
      // fall through
    }
  }
  if (!memoryCreditsStore) {
    memoryCreditsStore = {
      wallets: {
        [DEFAULT_DEMO_KEY]: createStarterWallet(DEFAULT_DEMO_KEY),
      },
    };
  }
  return memoryCreditsStore;
}

function saveStore(store: CreditsStore) {
  memoryCreditsStore = store;
  try {
    writeFileSync(getCreditsFilePath(), JSON.stringify(store, null, 2), "utf8");
  } catch {
    // read-only FS fallback keeps memoryCreditsStore
  }
}

async function readWalletFromKv(key: string): Promise<CreditWallet | null> {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!kvUrl || !kvToken) return null;

  try {
    const res = await fetch(`${kvUrl.replace(/\/$/, "")}/get/${encodeURIComponent(`forma:wallet:${key}`)}`, {
      headers: { Authorization: `Bearer ${kvToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(2000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { result?: string | null };
    if (!data?.result) return null;
    return JSON.parse(data.result) as CreditWallet;
  } catch {
    return null;
  }
}

async function writeWalletToKv(wallet: CreditWallet): Promise<void> {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!kvUrl || !kvToken) return;

  try {
    await fetch(`${kvUrl.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${kvToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([["SET", `forma:wallet:${wallet.apiKey}`, JSON.stringify(wallet)]]),
      signal: AbortSignal.timeout(2000),
    });
  } catch {
    // Non-blocking fallback
  }
}

export async function getOrProvisionWallet(apiKey?: string | null): Promise<CreditWallet> {
  const key = (apiKey || "").trim() || DEFAULT_DEMO_KEY;
  const kvExisting = await readWalletFromKv(key);
  if (kvExisting) {
    if (kvExisting.spentDayKey !== todayKey()) {
      kvExisting.spentDayKey = todayKey();
      kvExisting.spentTodayUsd = 0;
      await writeWalletToKv(kvExisting);
    }
    return kvExisting;
  }

  const store = loadStore();
  if (!store.wallets[key]) {
    store.wallets[key] = createStarterWallet(key);
    saveStore(store);
  }
  const wallet = store.wallets[key];
  if (wallet.spentDayKey !== todayKey()) {
    wallet.spentDayKey = todayKey();
    wallet.spentTodayUsd = 0;
  }
  await writeWalletToKv(wallet);
  return wallet;
}

export async function createNewWallet(): Promise<CreditWallet> {
  const store = loadStore();
  const newKey = `sk-forma-${randomBytes(8).toString("hex")}`;
  const wallet = createStarterWallet(newKey);
  store.wallets[newKey] = wallet;
  saveStore(store);
  await writeWalletToKv(wallet);
  return wallet;
}

export async function topUpWallet(
  apiKey: string | undefined,
  amountUsd: number,
  dailyLimitUsd?: number
): Promise<CreditWallet> {
  const store = loadStore();
  const wallet = await getOrProvisionWallet(apiKey);
  const cleanAmount = Math.max(0, Math.min(500, Number(amountUsd) || 0));

  if (cleanAmount > 0) {
    wallet.balanceUsd = Number((wallet.balanceUsd + cleanAmount).toFixed(2));
    wallet.ledger.unshift({
      id: `${Date.now().toString(36)}-topup`,
      ts: new Date().toISOString(),
      operation: `Prepaid Credit Top-Up (+$${cleanAmount.toFixed(2)}, 0% fee)`,
      target: "wallet",
      mode: "topup",
      deltaUsd: cleanAmount,
      balanceAfterUsd: wallet.balanceUsd,
    });
    wallet.ledger = wallet.ledger.slice(0, 30);
  }

  if (dailyLimitUsd !== undefined && dailyLimitUsd >= 0.5) {
    wallet.dailyLimitUsd = Number(dailyLimitUsd.toFixed(2));
  }

  store.wallets[wallet.apiKey] = wallet;
  saveStore(store);
  await writeWalletToKv(wallet);
  return wallet;
}

export async function configureWalletByok(
  apiKey: string | undefined,
  geminiKey: string | null,
  dailyLimitUsd?: number
): Promise<CreditWallet> {
  const store = loadStore();
  const wallet = await getOrProvisionWallet(apiKey);
  const trimmed = (geminiKey || "").trim();

  if (trimmed.length >= 8) {
    wallet.hasByokGemini = true;
    wallet.maskedByok = `${trimmed.slice(0, 4)}••••${trimmed.slice(-4)}`;
  } else if (geminiKey === "") {
    wallet.hasByokGemini = false;
    wallet.maskedByok = undefined;
  }

  if (dailyLimitUsd !== undefined && dailyLimitUsd >= 0.5) {
    wallet.dailyLimitUsd = Number(dailyLimitUsd.toFixed(2));
  }

  store.wallets[wallet.apiKey] = wallet;
  saveStore(store);
  await writeWalletToKv(wallet);
  return wallet;
}

export async function meterCloudCall(input: {
  request?: Request;
  operation: string;
  target: string;
  costUsd: number;
}): Promise<{
  allowed: boolean;
  error?: string;
  billingMode: "byok-unmetered" | "prepaid-credit";
  chargedUsd: number;
  wallet: CreditWallet;
  headers: Record<string, string>;
}> {
  const store = loadStore();
  const headerKey =
    input.request?.headers.get("x-forma-key") ||
    input.request?.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    DEFAULT_DEMO_KEY;
  const headerByok = input.request?.headers.get("x-gemini-key")?.trim();
  const maxCostHeader = input.request?.headers.get("x-forma-max-cost");

  const wallet = await getOrProvisionWallet(headerKey);
  const isByok = Boolean(headerByok || wallet.hasByokGemini);

  if (isByok) {
    wallet.ledger.unshift({
      id: `${Date.now().toString(36)}-byok`,
      ts: new Date().toISOString(),
      operation: input.operation,
      target: input.target,
      mode: "byok-unmetered",
      deltaUsd: 0,
      balanceAfterUsd: wallet.balanceUsd,
    });
    wallet.ledger = wallet.ledger.slice(0, 30);
    store.wallets[wallet.apiKey] = wallet;
    saveStore(store);
    await writeWalletToKv(wallet);

    return {
      allowed: true,
      billingMode: "byok-unmetered",
      chargedUsd: 0,
      wallet,
      headers: {
        "X-Forma-Billing": "byok-unmetered",
        "X-Forma-Cost-Usd": "0.00",
        "X-Forma-Balance-Usd": wallet.balanceUsd.toFixed(2),
        "X-Forma-Daily-Cap-Usd": wallet.dailyLimitUsd.toFixed(2),
      },
    };
  }

  if (maxCostHeader && Number(maxCostHeader) < input.costUsd) {
    return {
      allowed: false,
      error: `Call cost ($${input.costUsd.toFixed(2)}) exceeds X-Forma-Max-Cost ($${Number(
        maxCostHeader
      ).toFixed(2)}).`,
      billingMode: "prepaid-credit",
      chargedUsd: 0,
      wallet,
      headers: {
        "X-Forma-Billing": "blocked-max-cost",
        "X-Forma-Balance-Usd": wallet.balanceUsd.toFixed(2),
      },
    };
  }

  if (wallet.spentTodayUsd + input.costUsd > wallet.dailyLimitUsd) {
    return {
      allowed: false,
      error: `Daily safety cap ($${wallet.dailyLimitUsd.toFixed(
        2
      )}/day) reached to protect against runaway agents. Raise cap or pass X-Gemini-Key (BYOK).`,
      billingMode: "prepaid-credit",
      chargedUsd: 0,
      wallet,
      headers: {
        "X-Forma-Billing": "blocked-daily-cap",
        "X-Forma-Balance-Usd": wallet.balanceUsd.toFixed(2),
      },
    };
  }

  if (wallet.balanceUsd < input.costUsd) {
    return {
      allowed: false,
      error: `Insufficient prepaid credit ($${wallet.balanceUsd.toFixed(
        2
      )} remaining, needs $${input.costUsd.toFixed(
        2
      )}). Top up at /credits or supply X-Gemini-Key for $0 BYOK execution.`,
      billingMode: "prepaid-credit",
      chargedUsd: 0,
      wallet,
      headers: {
        "X-Forma-Billing": "insufficient-credit",
        "X-Forma-Balance-Usd": wallet.balanceUsd.toFixed(2),
      },
    };
  }

  wallet.balanceUsd = Number((wallet.balanceUsd - input.costUsd).toFixed(2));
  wallet.spentTodayUsd = Number((wallet.spentTodayUsd + input.costUsd).toFixed(2));
  wallet.ledger.unshift({
    id: `${Date.now().toString(36)}-call`,
    ts: new Date().toISOString(),
    operation: input.operation,
    target: input.target,
    mode: "prepaid-credit",
    deltaUsd: -input.costUsd,
    balanceAfterUsd: wallet.balanceUsd,
  });
  wallet.ledger = wallet.ledger.slice(0, 30);
  store.wallets[wallet.apiKey] = wallet;
  saveStore(store);
  await writeWalletToKv(wallet);

  return {
    allowed: true,
    billingMode: "prepaid-credit",
    chargedUsd: input.costUsd,
    wallet,
    headers: {
      "X-Forma-Billing": "prepaid-credit",
      "X-Forma-Cost-Usd": input.costUsd.toFixed(2),
      "X-Forma-Balance-Usd": wallet.balanceUsd.toFixed(2),
      "X-Forma-Daily-Cap-Usd": wallet.dailyLimitUsd.toFixed(2),
    },
  };
}
