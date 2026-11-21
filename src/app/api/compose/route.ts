import { NextResponse } from "next/server";
import {
  composeFormatGenome,
  recommendMixFromBrief,
  type TargetStack,
} from "@/lib/composer";
import { recommendPaletteForIdea } from "@/lib/synthesizer";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brief = searchParams.get("brief") || searchParams.get("q") || "";
  const project = searchParams.get("project") || "Acme";
  const stack = (searchParams.get("stack") as TargetStack) || "nextjs-tailwind";
  const outputFormat = searchParams.get("format") || "json";

  const mixList = (searchParams.get("mix") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const auto = recommendMixFromBrief(brief).selection;

  const surfaceId = searchParams.get("surface") || mixList[0] || auto.surfaceId;
  const typographyId = searchParams.get("typography") || mixList[1] || mixList[0] || auto.typographyId;
  const layoutId = searchParams.get("layout") || mixList[2] || mixList[0] || auto.layoutId;
  const componentsId = searchParams.get("components") || mixList[3] || mixList[1] || mixList[0] || auto.componentsId;
  const motionId = searchParams.get("motion") || mixList[4] || mixList[0] || auto.motionId;
  const paletteId =
    searchParams.get("palette") ||
    (brief && !searchParams.get("surface") && !mixList[0]
      ? recommendPaletteForIdea(brief).id
      : undefined);

  const genome = composeFormatGenome({
    surfaceId,
    typographyId,
    layoutId,
    componentsId,
    motionId,
    paletteId,
    projectName: project,
    projectBrief: brief || undefined,
    stack,
    enforceUnslop: searchParams.get("unslop") !== "false",
  });

  if (outputFormat === "markdown" || outputFormat === "md") {
    return new NextResponse(genome.masterPrompt, {
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "text/markdown; charset=utf-8",
      },
    });
  }

  return NextResponse.json(genome, { headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const brief = String(body.projectBrief || body.brief || "");
  const auto = recommendMixFromBrief(brief).selection;

  const genome = composeFormatGenome({
    surfaceId: body.surfaceId || auto.surfaceId,
    typographyId: body.typographyId || auto.typographyId,
    layoutId: body.layoutId || auto.layoutId,
    componentsId: body.componentsId || auto.componentsId,
    motionId: body.motionId || auto.motionId,
    projectName: body.projectName || body.project || "Acme",
    projectBrief: brief || undefined,
    stack: body.stack || "nextjs-tailwind",
    enforceUnslop: body.enforceUnslop !== false,
  });

  return NextResponse.json(genome, { headers: CORS_HEADERS });
}
