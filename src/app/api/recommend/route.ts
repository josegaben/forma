import { NextResponse } from "next/server";
import { recommendMixFromBrief } from "@/lib/composer";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || searchParams.get("brief") || "";
  const result = recommendMixFromBrief(q);
  return NextResponse.json(result, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const q = body.brief || body.query || body.q || "";
  const result = recommendMixFromBrief(String(q));
  return NextResponse.json(result, {
    headers: { "Access-Control-Allow-Origin": "*" },
  });
}
