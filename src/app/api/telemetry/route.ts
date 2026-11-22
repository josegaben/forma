import { NextResponse } from "next/server";
import {
  getTelemetrySummary,
  recordTelemetryEvent,
  type TelemetryEventType,
} from "@/lib/telemetry";

const ALLOWED_CLIENT_EVENTS = new Set<TelemetryEventType>([
  "human_visit",
  "synthesize_idea",
  "copy_spec",
  "copy_bootstrap",
  "share_mix",
  "install_component",
]);

export async function GET(request: Request) {
  const requiredToken = process.env.FORMA_METRICS_TOKEN;
  if (requiredToken) {
    const auth = request.headers.get("authorization") || "";
    const urlToken = new URL(request.url).searchParams.get("token") || "";
    if (auth !== `Bearer ${requiredToken}` && urlToken !== requiredToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const summary = await getTelemetrySummary();
  return NextResponse.json(summary, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const event = String(body.event || "") as TelemetryEventType;

  if (!ALLOWED_CLIENT_EVENTS.has(event)) {
    return NextResponse.json({ error: "Invalid event type" }, { status: 400 });
  }

  await recordTelemetryEvent({
    event,
    request,
    actorOverride: "human",
    target: body.target ? String(body.target).slice(0, 80) : undefined,
    mixCode: body.mixCode ? String(body.mixCode).slice(0, 40) : undefined,
    paletteId: body.paletteId ? String(body.paletteId).slice(0, 50) : undefined,
  });

  return NextResponse.json({ ok: true });
}
