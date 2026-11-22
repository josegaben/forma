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
  "Access-Control-Allow-Headers": "Content-Type, X-Forma-Key, Authorization",
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

  const wallet = getOrProvisionWallet(key);
  return NextResponse.json(
    {
      philosophy:
        "Zero subscriptions, 0% top-up fee, $1.00 free starter credit, and $0.00 unmetered BYOK (treg.to model).",
      wallet,
      pricing: FORMA_CLOUD_PRICING,
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const action = String(body.action || "topup");
  const apiKey = body.apiKey ? String(body.apiKey) : undefined;

  if (action === "provision") {
    const wallet = createNewWallet();
    return NextResponse.json({ wallet, pricing: FORMA_CLOUD_PRICING }, { headers: CORS_HEADERS });
  }

  if (action === "byok") {
    const wallet = configureWalletByok(
      apiKey,
      body.geminiKey !== undefined ? String(body.geminiKey) : null,
      body.dailyLimitUsd !== undefined ? Number(body.dailyLimitUsd) : undefined
    );
    return NextResponse.json({ wallet }, { headers: CORS_HEADERS });
  }

  const amountUsd = Number(body.amountUsd || 5);
  const dailyLimitUsd =
    body.dailyLimitUsd !== undefined ? Number(body.dailyLimitUsd) : undefined;
  const wallet = topUpWallet(apiKey, amountUsd, dailyLimitUsd);

  return NextResponse.json({ wallet }, { headers: CORS_HEADERS });
}
