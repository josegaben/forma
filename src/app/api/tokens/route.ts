import { NextResponse } from "next/server";
import { hexToOklchString } from "@/data/color-palettes";
import { composeFormatGenome, recommendMixFromBrief } from "@/lib/composer";
import { recordTelemetryEvent } from "@/lib/telemetry";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * W3C Design Tokens Community Group (DTCG 2025.10) Export (/api/tokens)
 * Ready for 1-click import into Figma Tokens Studio, Figma Variables, Penpot, and Style Dictionary.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brief = searchParams.get("brief") || "";
  const auto = recommendMixFromBrief(brief).selection;

  const genome = composeFormatGenome({
    surfaceId: searchParams.get("surface") || auto.surfaceId,
    typographyId: searchParams.get("type") || auto.typographyId,
    fontPairingId: searchParams.get("font") || undefined,
    layoutId: searchParams.get("layout") || auto.layoutId,
    componentsId: searchParams.get("comp") || auto.componentsId,
    motionId: searchParams.get("motion") || auto.motionId,
    paletteId: searchParams.get("palette") || undefined,
    projectName: searchParams.get("project") || "FormaDesignSystem",
    projectBrief: brief || undefined,
  });

  void recordTelemetryEvent({
    event: "agent_compose_api",
    request,
    target: "w3c_dtcg_tokens",
    mixCode: genome.mixCode,
  });

  const s = genome.layers.surface.surface;
  const t = genome.layers.typography.typography;
  const l = genome.layers.layout.layout;
  const m = genome.layers.motion.motion;

  const bezierMatch = m.easing.match(
    /cubic-bezier\(\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*\)/i
  );
  const cubicArray = bezierMatch
    ? bezierMatch.slice(1, 5).map(Number)
    : [0.22, 1, 0.36, 1];

  const dtcgPayload = {
    $name: `forma [${genome.mixCode}] — ${genome.projectName}`,
    $description: `Synthesized 5-layer W3C Design Tokens (${s.mode} mode · ${genome.contrastRatioText}:1 WCAG) for Figma Variables, Tokens Studio & Style Dictionary.`,
    color: {
      canvas: {
        bg: { $value: s.bg, $type: "color", $extensions: { oklch: hexToOklchString(s.bg) } },
        surface: {
          $value: s.surface,
          $type: "color",
          $extensions: { oklch: hexToOklchString(s.surface) },
        },
        panel: {
          $value: s.panel,
          $type: "color",
          $extensions: { oklch: hexToOklchString(s.panel) },
        },
        badge: { $value: s.badgeBg, $type: "color" },
      },
      ink: {
        primary: {
          $value: s.ink,
          $type: "color",
          $extensions: { oklch: hexToOklchString(s.ink), wcagOnBg: `${genome.contrastRatioText}:1` },
        },
        muted: { $value: s.muted, $type: "color" },
        border: { $value: s.line, $type: "color" },
      },
      accent: {
        primary: {
          $value: s.accent,
          $type: "color",
          $extensions: {
            oklch: hexToOklchString(s.accent),
            wcagCta: `${genome.contrastRatioCta}:1`,
          },
        },
        onAccent: { $value: s.accentInk, $type: "color" },
      },
    },
    typography: {
      family: {
        display: { $value: t.displayFont, $type: "fontFamily" },
        body: { $value: t.bodyFont, $type: "fontFamily" },
        mono: { $value: t.monoFont, $type: "fontFamily" },
      },
      scale: {
        h1Fluid: { $value: t.h1Scale, $type: "dimension" },
        h1Tracking: { $value: t.h1Tracking, $type: "dimension" },
        bodyLeading: { $value: t.bodyLeading, $type: "number" },
      },
      cssImport: { $value: t.googleFontsImport, $type: "other" },
    },
    spatial: {
      containerMaxWidth: { $value: l.maxWidth, $type: "dimension" },
      radiusCard: { $value: s.radiusCard, $type: "dimension" },
      radiusPill: { $value: s.radiusPill, $type: "dimension" },
    },
    motion: {
      primaryEasing: { $value: cubicArray, $type: "cubicBezier" },
      hoverDuration: { $value: "160ms", $type: "duration" },
    },
  };

  return NextResponse.json(dtcgPayload, { headers: CORS_HEADERS });
}
