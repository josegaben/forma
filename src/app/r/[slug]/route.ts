import { NextResponse } from "next/server";
import { hexToOklchString } from "@/data/color-palettes";
import { WEB_FORMATS } from "@/data/formats";
import { composeFormatGenome, recommendMixFromBrief } from "@/lib/composer";
import { recommendPaletteForIdea } from "@/lib/synthesizer";
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
 * Official shadcn/ui Custom Registry Endpoint (/r/[slug])
 * Usage:
 *   npx shadcn@latest add "https://forma.to/r/forma-kit?surface=resizes-infra&palette=pal-carbon-halftone&font=pair-cabinet-satoshi"
 *   npx shadcn@latest add "https://forma.to/r/treg-gateway.json"
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const cleanSlug = slug.replace(/\.json$/i, "");
  const { searchParams } = new URL(request.url);

  const brief = searchParams.get("brief") || "";
  const project = searchParams.get("project") || "FormaApp";
  const matchedFormat = WEB_FORMATS.find((f) => f.id === cleanSlug);
  const auto = recommendMixFromBrief(brief).selection;

  const surfaceId =
    searchParams.get("surface") || (matchedFormat ? matchedFormat.id : auto.surfaceId);
  const typographyId =
    searchParams.get("type") ||
    searchParams.get("typography") ||
    (matchedFormat ? matchedFormat.id : auto.typographyId);
  const layoutId =
    searchParams.get("layout") || (matchedFormat ? matchedFormat.id : auto.layoutId);
  const componentsId =
    searchParams.get("comp") || (matchedFormat ? matchedFormat.id : auto.componentsId);
  const motionId =
    searchParams.get("motion") || (matchedFormat ? matchedFormat.id : auto.motionId);
  const paletteId =
    searchParams.get("palette") ||
    (brief && !matchedFormat ? recommendPaletteForIdea(brief).id : undefined);
  const fontPairingId = searchParams.get("font") || undefined;

  const genome = composeFormatGenome({
    surfaceId,
    typographyId,
    fontPairingId,
    layoutId,
    componentsId,
    motionId,
    paletteId,
    projectName: project,
    projectBrief: brief || undefined,
    stack: "nextjs-tailwind",
  });

  void recordTelemetryEvent({
    event: "install_component",
    request,
    target: `shadcn-registry:${cleanSlug}`,
    mixCode: genome.mixCode,
    paletteId,
  });

  const s = genome.layers.surface.surface;
  const t = genome.layers.typography.typography;
  const heroBlock = genome.structuralSkeletons.find((b) => b.id === "hero");
  const bentoBlock = genome.structuralSkeletons.find((b) => b.id === "bento");

  const registryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: `forma-${genome.mixCode.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    type: "registry:block",
    title: `forma [${genome.mixCode}] — ${genome.title}`,
    description: `5-layer zero-slop web design system (${s.bg} → ${s.accent}, ${genome.contrastRatioText}:1 WCAG) synthesized by forma.to.`,
    dependencies: ["@phosphor-icons/react"],
    cssVars: {
      theme: {
        "font-display": t.displayFont,
        "font-sans": t.bodyFont,
        "font-mono": t.monoFont,
      },
      light: {
        background: hexToOklchString(s.mode === "light" ? s.bg : "#f6f5f1"),
        foreground: hexToOklchString(s.mode === "light" ? s.ink : "#141413"),
        card: hexToOklchString(s.mode === "light" ? s.surface : "#ffffff"),
        primary: hexToOklchString(s.accent),
        "primary-foreground": hexToOklchString(s.accentInk),
        muted: hexToOklchString(s.mode === "light" ? s.panel : "#eeede7"),
        radius: s.radiusCard,
      },
      dark: {
        background: hexToOklchString(s.mode === "dark" ? s.bg : "#101010"),
        foreground: hexToOklchString(s.mode === "dark" ? s.ink : "#f5f7f5"),
        card: hexToOklchString(s.mode === "dark" ? s.surface : "#181818"),
        primary: hexToOklchString(s.accent),
        "primary-foreground": hexToOklchString(s.accentInk),
        muted: hexToOklchString(s.mode === "dark" ? s.panel : "#202020"),
        radius: s.radiusCard,
      },
    },
    files: [
      {
        path: "DESIGN.md",
        type: "registry:file",
        target: "~/DESIGN.md",
        content: genome.masterPrompt,
      },
      {
        path: "components/forma/forma-tokens.css",
        type: "registry:style",
        content: `${genome.cssTokens}\n\n${heroBlock?.cssLayout || ""}\n\n${
          bentoBlock?.cssLayout || ""
        }\n`,
      },
      {
        path: "components/forma/forma-scaffold.tsx",
        type: "registry:component",
        content: `import React from "react";\nimport "./forma-tokens.css";\n\nexport function FormaLandingScaffold() {\n  return (\n    <>\n${
          heroBlock?.code || ""
        }\n\n${bentoBlock?.code || ""}\n    </>\n  );\n}\n`,
      },
    ],
  };

  return NextResponse.json(registryItem, { headers: CORS_HEADERS });
}
