import { NextResponse } from "next/server";
import {
  configureWalletByok,
  createNewWallet,
  FORMA_CLOUD_PRICING,
  getOrProvisionWallet,
  topUpWallet,
} from "@/lib/credits";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, X-Forma-Key, X-Gemini-Key, X-Forma-Max-Cost, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key =
    searchParams.get("key") ||
    request.headers.get("x-forma-key") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  const wallet = await getOrProvisionWallet(key);
  return NextResponse.json(
    {
      philosophy:
        "Zero subscriptions, 0% top-up fee, $1.00 free starter credit, and $0.00 unmetered BYOK (treg.to model).",
      stripeLiveEnabled: Boolean(process.env.STRIPE_SECRET_KEY),
      storageBackend:
        process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
          ? "vercel-kv-redis"
          : "local-persistent-json",
      wallet,
      pricing: FORMA_CLOUD_PRICING,
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const action = String(body.action || "topup");
  const apiKey =
    (body.apiKey ? String(body.apiKey) : undefined) ||
    request.headers.get("x-forma-key") ||
    undefined;

  if (action === "provision") {
    const wallet = await createNewWallet();
    return NextResponse.json(
      { wallet, pricing: FORMA_CLOUD_PRICING },
      { headers: CORS_HEADERS }
    );
  }

  if (action === "byok") {
    const wallet = await configureWalletByok(
      apiKey,
      body.geminiKey !== undefined ? String(body.geminiKey) : null,
      body.dailyLimitUsd !== undefined ? Number(body.dailyLimitUsd) : undefined
    );
    return NextResponse.json({ wallet }, { headers: CORS_HEADERS });
  }

  const amountUsd = Math.max(1, Math.min(500, Number(body.amountUsd || 5)));
  const dailyLimitUsd =
    body.dailyLimitUsd !== undefined ? Number(body.dailyLimitUsd) : undefined;
  const wallet = await getOrProvisionWallet(apiKey);

  // If STRIPE_SECRET_KEY is configured in Vercel production, create a real 0%-fee Stripe Checkout Session
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (stripeSecret && !body.forceSandbox) {
    const origin = new URL(request.url).origin;
    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set(
      "success_url",
      `${origin}/credits?checkout=success&amount=${amountUsd}&key=${encodeURIComponent(
        wallet.apiKey
      )}`
    );
    params.set("cancel_url", `${origin}/credits?checkout=cancelled`);
    params.set("line_items[0][price_data][currency]", "usd");
    params.set(
      "line_items[0][price_data][product_data][name]",
      `forma.to Prepaid Agent Credit ($${amountUsd.toFixed(2)} · 0% fee)`
    );
    params.set(
      "line_items[0][price_data][unit_amount]",
      String(Math.round(amountUsd * 100))
    );
    params.set("line_items[0][quantity]", "1");
    params.set("metadata[forma_api_key]", wallet.apiKey);

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (stripeRes.ok) {
      const session = await stripeRes.json();
      return NextResponse.json(
        { checkoutUrl: session.url, wallet },
        { headers: CORS_HEADERS }
      );
    }
  }

  const updated = await topUpWallet(wallet.apiKey, amountUsd, dailyLimitUsd);
  return NextResponse.json({ wallet: updated }, { headers: CORS_HEADERS });
}
