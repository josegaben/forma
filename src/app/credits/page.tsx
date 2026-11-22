"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Check, Copy, Eye, EyeOff, KeyRound, Plus, ShieldCheck } from "lucide-react";
import { FormaLogo } from "@/components/FormaLogo";

interface PricingRow {
  operation: string;
  costUsd: number;
  unit: string;
  note: string;
}

interface LedgerEntry {
  id: string;
  ts: string;
  operation: string;
  target: string;
  mode: string;
  deltaUsd: number;
  balanceAfterUsd: number;
}

interface WalletData {
  apiKey: string;
  createdAt: string;
  balanceUsd: number;
  dailyLimitUsd: number;
  spentTodayUsd: number;
  hasByokGemini: boolean;
  maskedByok?: string;
  ledger: LedgerEntry[];
}

export default function CreditsWalletPage() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [pricing, setPricing] = useState<PricingRow[]>([]);
  const [geminiInput, setGeminiInput] = useState("");
  const [dailyCapInput, setDailyCapInput] = useState("5.00");
  const [showByok, setShowByok] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadWallet = useCallback(async (customKey?: string) => {
    const storedKey =
      customKey ||
      (typeof window !== "undefined" ? localStorage.getItem("forma_api_key") : null) ||
      "";
    const url = storedKey
      ? `/api/credits?key=${encodeURIComponent(storedKey)}`
      : "/api/credits";
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      setWallet(data.wallet);
      setPricing(data.pricing || []);
      setDailyCapInput(Number(data.wallet.dailyLimitUsd).toFixed(2));
      if (typeof window !== "undefined" && data.wallet?.apiKey) {
        localStorage.setItem("forma_api_key", data.wallet.apiKey);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const checkout = params.get("checkout");
      const amt = Number(params.get("amount") || 0);
      const keyParam = params.get("key") || undefined;
      if (checkout === "success" && amt > 0) {
        void fetch("/api/credits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "topup",
            apiKey: keyParam,
            amountUsd: amt,
            forceSandbox: true,
          }),
        }).then(() => {
          setStatusMessage(`Stripe Checkout completed — added $${amt.toFixed(2)} prepaid credit.`);
          window.history.replaceState({}, "", "/credits");
          void loadWallet(keyParam);
        });
        return;
      }
    }
    void loadWallet();
  }, [loadWallet]);

  const handleTopUp = async (amountUsd: number) => {
    if (!wallet) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "topup",
          apiKey: wallet.apiKey,
          amountUsd,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
          return;
        }
        setWallet(data.wallet);
        setStatusMessage(`Added $${amountUsd.toFixed(2)} prepaid credit (0% top-up fee).`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateKey = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "provision" }),
      });
      if (res.ok) {
        const data = await res.json();
        setWallet(data.wallet);
        localStorage.setItem("forma_api_key", data.wallet.apiKey);
        setStatusMessage("Generated new personal API token with $1.00 free starter credit.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveByokAndSafety = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "byok",
          apiKey: wallet.apiKey,
          geminiKey: geminiInput.trim() || undefined,
          dailyLimitUsd: Number(dailyCapInput) || 5,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setWallet(data.wallet);
        setGeminiInput("");
        setStatusMessage(
          data.wallet.hasByokGemini
            ? "Saved BYOK credential & safety cap — Vision scans now run at $0.00."
            : "Updated daily agent safety cap."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const copyToken = async () => {
    if (!wallet) return;
    await navigator.clipboard.writeText(wallet.apiKey).catch(() => {});
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 1800);
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-[#141413]">
      {/* Compact Single-Row Header (< 12% viewport height) */}
      <header className="border-b border-[var(--line)] bg-white/90 backdrop-blur-md sticky top-0 z-20">
        <div className="mx-auto max-w-[1120px] h-[56px] px-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <a href="/" aria-label="Back to forma">
              <FormaLogo size={26} />
            </a>
            <span
              className="text-[12px] px-2.5 py-0.5 rounded-full bg-[var(--panel)] border border-[var(--line)] text-[var(--muted)]"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              /credits · pay-per-call & BYOK
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/metrics"
              className="px-3 py-1.5 rounded-full border border-[var(--line)] text-[12px] text-[var(--muted)] hover:text-[var(--ink)]"
            >
              Metrics
            </a>
            <a
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#141413] text-white text-[12px] font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Studio</span>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-5 py-10 space-y-8">
        <div className="max-w-[700px]">
          <h1
            className="text-[clamp(2rem,3.6vw,2.85rem)] leading-[1.06] tracking-[-0.025em] font-normal"
            style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
          >
            Prepaid Agent Credits & BYOK
          </h1>
          <p className="text-[14.5px] text-[var(--muted)] mt-1.5 leading-relaxed">
            Zero subscriptions and zero seat fees — inspired by <code className="text-[13px]">treg.to</code> and OpenRouter. Every builder gets <strong>$1.00 in free credit</strong> for cloud Playwright + Gemini Vision calls, and <strong>$0.00 unmetered execution</strong> whenever you bring your own API key (BYOK).
          </p>
        </div>

        {statusMessage && (
          <div
            role="status"
            aria-live="polite"
            className="px-4 py-2.5 rounded-[12px] bg-[#118453]/10 border border-[#118453]/25 text-[#118453] text-[13px] font-medium"
          >
            {statusMessage}
          </div>
        )}

        {/* 3 Semantic KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <article className="visual-card p-5">
            <h2
              className="text-[11px] font-normal text-[var(--muted)] uppercase"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              PREPAID CREDIT BALANCE
            </h2>
            <p className="mt-2 flex items-baseline gap-2">
              <span className="text-[36px] font-semibold tabular-nums tracking-tight">
                ${(wallet?.balanceUsd ?? 1).toFixed(2)}
              </span>
              <span
                className="text-[12px] text-[#118453]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                never expires
              </span>
            </p>
            <p className="mt-2 text-[12px] text-[var(--muted)] tabular-nums">
              ≈ {Math.floor((wallet?.balanceUsd ?? 1) / 0.04)} cloud Playwright + Vision section scans
            </p>
          </article>

          <article className="visual-card p-5">
            <h2
              className="text-[11px] font-normal text-[var(--muted)] uppercase"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              BYOK CREDENTIAL STATUS
            </h2>
            <p className="mt-2 text-[22px] font-semibold tracking-tight">
              {wallet?.hasByokGemini ? (
                <span className="text-[#118453]">Active ({wallet.maskedByok})</span>
              ) : (
                <span>Platform Keys (Metered)</span>
              )}
            </p>
            <p className="mt-2 text-[12px] text-[var(--muted)]">
              {wallet?.hasByokGemini
                ? "Your own Gemini key takes priority — 0% fee ($0.00/call)."
                : "Pass X-Gemini-Key or save below to make Vision calls $0.00."}
            </p>
          </article>

          <article className="visual-card p-5">
            <h2
              className="text-[11px] font-normal text-[var(--muted)] uppercase"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              DAILY RUNAWAY AGENT CAP
            </h2>
            <p className="mt-2 flex items-baseline gap-2 tabular-nums">
              <span className="text-[32px] font-semibold tracking-tight">
                ${(wallet?.spentTodayUsd ?? 0).toFixed(2)}
              </span>
              <span
                className="text-[13px] text-[var(--muted)]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                / ${(wallet?.dailyLimitUsd ?? 5).toFixed(2)} today
              </span>
            </p>
            <p className="mt-2 text-[12px] text-[var(--muted)]">
              Automatic circuit-breaker prevents unexpected agent loops.
            </p>
          </article>
        </div>

        {/* 2-Column Token + Instant Top-Up & BYOK Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: API Key + Top-Up Buttons with Explicit Amounts */}
          <section className="lg:col-span-6 rounded-[18px] bg-white border border-[var(--line)] p-6 space-y-5">
            <div>
              <h2
                className="text-[12px] uppercase text-[var(--muted)] mb-2"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                YOUR AGENT GATEWAY TOKEN (X-FORMA-KEY)
              </h2>
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-[12px] bg-[var(--panel)] border border-[var(--line)]">
                <code
                  className="text-[13px] truncate"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  {wallet?.apiKey || "sk-forma-live-starter-100"}
                </code>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={copyToken}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#141413] text-white text-[11.5px] font-medium cursor-pointer"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-[#4ade80]" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? "Copied" : "Copy"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateKey}
                    disabled={submitting}
                    className="px-3 py-1.5 rounded-full border border-[var(--line-strong)] bg-white text-[11.5px] font-medium cursor-pointer"
                  >
                    New key
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--line)]">
              <h3 className="text-[14px] font-semibold">
                Instant Prepaid Top-Up (0% fee · No subscription)
              </h3>
              <p className="text-[12.5px] text-[var(--muted)] mt-0.5 mb-3">
                Pay only when your agent executes cloud Playwright + Multimodal Vision jobs without your own API keys.
              </p>
              <div className="flex flex-wrap gap-2.5">
                {[5, 10, 25].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    disabled={submitting}
                    onClick={() => handleTopUp(amt)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[48px] rounded-full bg-[#141413] text-white text-[13px] font-medium hover:opacity-90 disabled:opacity-50 cursor-pointer tabular-nums"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add ${amt.toFixed(2)} credit</span>
                  </button>
                ))}
              </div>
            </div>

            <pre
              className="p-3.5 rounded-[12px] bg-[#141413] text-[#eae9e4] text-[11.5px] leading-[1.6] overflow-x-auto"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              <code>{`# Cloud Playwright + Vision scan using your prepaid token ($0.04):
curl -X POST https://forma.to/api/sections \\
  -H "X-Forma-Key: ${wallet?.apiKey || "sk-forma-..."}" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://stripe.com"}'`}</code>
            </pre>
          </section>

          {/* Right: Accessible BYOK & Safety Limit Form (Modern Web Guidance: forms) */}
          <section className="lg:col-span-6 rounded-[18px] bg-white border border-[var(--line)] p-6">
            <h2 id="byok-form-heading" className="text-[16px] font-semibold flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#E06D44]" />
              <span>Bring Your Own Key (BYOK) & Safety Cap</span>
            </h2>
            <p className="text-[12.5px] text-[var(--muted)] mt-1 mb-4">
              Register your own <code className="text-[12px]">GEMINI_API_KEY</code> so Vision calls bypass prepaid billing completely (<strong>$0.00/call</strong>).
            </p>

            <form
              method="POST"
              action="/api/credits"
              aria-labelledby="byok-form-heading"
              onSubmit={handleSaveByokAndSafety}
              className="space-y-4"
            >
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="gemini-byok-key" className="text-[13px] font-medium">
                    Gemini API Key (Optional BYOK)
                  </label>
                  <button
                    type="button"
                    aria-pressed={showByok}
                    onClick={() => setShowByok((v) => !v)}
                    className="inline-flex items-center gap-1 text-[11.5px] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                  >
                    {showByok ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showByok ? "Hide key" : "Show key"}</span>
                  </button>
                </div>
                <input
                  id="gemini-byok-key"
                  name="geminiKey"
                  type={showByok ? "text" : "password"}
                  value={geminiInput}
                  onChange={(e) => setGeminiInput(e.target.value)}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-describedby="byok-help"
                  placeholder="AIzaSy..."
                  className="w-full min-h-[48px] px-3.5 py-2.5 rounded-[12px] border border-[#767676]/60 bg-white text-[16px] focus-visible:outline-2 focus-visible:outline-[#141413]"
                />
                <span id="byok-help" className="text-[11.5px] text-[var(--muted)]">
                  Or pass <code className="text-[11px]">X-Gemini-Key</code> per request header without storing anything.
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="daily-cap-usd" className="text-[13px] font-medium">
                  Daily Safety Ceiling (USD)
                </label>
                <input
                  id="daily-cap-usd"
                  name="dailyLimitUsd"
                  type="text"
                  inputMode="decimal"
                  value={dailyCapInput}
                  onChange={(e) => setDailyCapInput(e.target.value)}
                  autoCorrect="off"
                  spellCheck={false}
                  aria-describedby="cap-help"
                  className="w-full min-h-[48px] px-3.5 py-2.5 rounded-[12px] border border-[#767676]/60 bg-white text-[16px] tabular-nums focus-visible:outline-2 focus-visible:outline-[#141413]"
                />
                <span id="cap-help" className="text-[11.5px] text-[var(--muted)]">
                  Default $5.00/day ceiling protects your balance from infinite agent loops.
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[48px] rounded-full bg-[#141413] text-white text-[13.5px] font-medium hover:opacity-90 disabled:opacity-50 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Save BYOK & safety settings</span>
              </button>
            </form>
          </section>
        </div>

        {/* Transparent Per-Call Rate Table */}
        <section className="rounded-[18px] bg-white border border-[var(--line)] p-6">
          <h2
            id="pricing-matrix-heading"
            className="text-[12px] uppercase text-[var(--muted)] mb-3"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            TRANSPARENT PAY-PER-CALL SCHEDULE (0% MARKUP ON BYOK)
          </h2>
          <div
            tabIndex={0}
            role="region"
            aria-labelledby="pricing-matrix-heading"
            className="overflow-auto max-w-full"
          >
            <table className="w-full text-[13px] border-separate border-spacing-0">
              <thead className="sticky top-0 z-10 bg-white">
                <tr
                  className="text-left text-[11px] text-[var(--muted)]"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  <th scope="col" className="pb-2.5 border-b border-[var(--line)] font-normal bg-white">
                    CAPABILITY / ENDPOINT
                  </th>
                  <th scope="col" className="pb-2.5 border-b border-[var(--line)] font-normal bg-white">
                    DETAILS
                  </th>
                  <th scope="col" className="pb-2.5 border-b border-[var(--line)] font-normal text-right bg-white">
                    RATE (USD)
                  </th>
                </tr>
              </thead>
              <tbody>
                {pricing.map((row) => (
                  <tr key={row.operation}>
                    <th
                      scope="row"
                      className="py-3 border-b border-[var(--line)] text-left font-medium sticky left-0 bg-white pr-4"
                    >
                      {row.operation}
                    </th>
                    <td className="py-3 border-b border-[var(--line)] text-[var(--muted)] pr-4">
                      {row.note}
                    </td>
                    <td
                      className="py-3 border-b border-[var(--line)] text-right font-semibold tabular-nums whitespace-nowrap"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      {row.costUsd === 0 ? (
                        <span className="text-[#118453]">$0.00 ({row.unit})</span>
                      ) : (
                        <span>
                          ${row.costUsd.toFixed(2)} / {row.unit}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Wallet Ledger */}
        {wallet?.ledger && wallet.ledger.length > 0 && (
          <section className="rounded-[18px] bg-white border border-[var(--line)] p-6">
            <h2
              className="text-[12px] uppercase text-[var(--muted)] mb-3"
              style={{ fontFamily: "var(--font-mono), monospace" }}
            >
              WALLET LEDGER
            </h2>
            <div className="divide-y divide-[var(--line)] text-[12.5px]">
              {wallet.ledger.map((item) => (
                <div
                  key={item.id}
                  className="py-2.5 flex flex-wrap items-center justify-between gap-2"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-[var(--panel)] text-[10.5px]">
                      {item.mode}
                    </span>
                    <span>{item.operation}</span>
                  </div>
                  <div className="flex items-center gap-4 tabular-nums">
                    <span
                      className={
                        item.deltaUsd >= 0 ? "text-[#118453] font-medium" : "text-[var(--ink)]"
                      }
                    >
                      {item.deltaUsd >= 0
                        ? `+$${item.deltaUsd.toFixed(2)}`
                        : `-$${Math.abs(item.deltaUsd).toFixed(2)}`}
                    </span>
                    <span className="text-[var(--muted)]">
                      bal ${item.balanceAfterUsd.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
