import { NextResponse } from "next/server";
import {
  CURATED_COLOR_PALETTES,
  getContrastRatio,
  hexToOklchString,
} from "@/data/color-palettes";
import {
  CRAFT_TOOLS_AND_ASSETS,
  RARE_COMPONENTS,
  TYPOGRAPHY_PAIRINGS,
} from "@/data/compendium";
import { GLOBAL_UNSLOP_RULES, WEB_FORMATS } from "@/data/formats";
import discoveredFeed from "@/data/discovered-feed.json";
import {
  composeFormatGenome,
  recommendMixFromBrief,
  type TargetStack,
} from "@/lib/composer";
import {
  filterVaultSections,
  getSectionVaultFeed,
  type SectionKind,
} from "@/lib/section-vault";
import { FORMA_CLOUD_PRICING, getOrProvisionWallet } from "@/lib/credits";
import { validatePublicHttpUrl } from "@/lib/ssrf-guard";
import { recordTelemetryEvent } from "@/lib/telemetry";
import { analyzeWebsiteUrl } from "../../../../forma-xray/src/analyzer.mjs";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, Mcp-Session-Id",
};

const MCP_TOOLS = [
  {
    name: "list_web_formats",
    description:
      `List or search all ${WEB_FORMATS.length} curated 5-layer agentic web formats in forma (Surface, Typography, Layout, Components, Motion Physics).`,
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Keyword, sector, or reference site filter." },
        mode: { type: "string", enum: ["light", "dark"] },
      },
    },
  },
  {
    name: "recommend_format_mix",
    description:
      "Analyze a project idea (EN/ES) and recommend the optimal 5-layer combination of web formats (Surface, Typography, Layout, Components, Motion).",
    inputSchema: {
      type: "object",
      properties: {
        brief: { type: "string", description: "Natural-language project brief and aesthetic direction." },
      },
      required: ["brief"],
    },
  },
  {
    name: "compose_design_spec",
    description:
      "Compile 1–5 format IDs plus optional OKLCH paletteId and Fontshare/Google fontPairingId into a complete DESIGN.md agent specification with CSS tokens, 6 HTML/CSS skeletons, motion physics, and unslop-ui rules.",
    inputSchema: {
      type: "object",
      properties: {
        projectName: { type: "string" },
        projectBrief: { type: "string" },
        surfaceId: { type: "string" },
        typographyId: { type: "string" },
        layoutId: { type: "string" },
        componentsId: { type: "string" },
        motionId: { type: "string" },
        paletteId: { type: "string", description: "Optional curated OKLCH palette ID (e.g. pal-stone-terracotta)" },
        fontPairingId: { type: "string", description: "Optional curated typography pairing ID (e.g. pair-cabinet-satoshi)" },
        stack: {
          type: "string",
          enum: ["nextjs-tailwind", "vite-react", "astro-css", "vanilla-html"],
        },
      },
      required: ["projectBrief"],
    },
  },
  {
    name: "xray_live_website",
    description:
      "Scrape and deep-analyze any live public URL using forma-xray to extract its CSS custom properties, typography, cubic-bezier/spring motion curves, keyframes, and Anti-Slop Craft Score into DESIGN.md.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Public URL to analyze (e.g. https://linear.app)" },
      },
      required: ["url"],
    },
  },
  {
    name: "list_discovered_designs",
    description:
      "Query forma's continuously scraped web design & motion radar (ranked by Craft & Anti-Slop Score across top design galleries).",
    inputSchema: {
      type: "object",
      properties: {
        minScore: { type: "number", description: "Minimum craft score (0–100), e.g. 90" },
        mode: { type: "string", enum: ["light", "dark"] },
      },
    },
  },
  {
    name: "list_color_palettes",
    description:
      "List curated 60-30-10 UI color systems (inspired by Radix Colors, Happy Hues, Realtime Colors, Atmos OKLCH & Sanzo Wada) with WCAG contrast ratios and perceptual OKLCH values.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Optional industry, mood, or harmony filter (e.g. 'clinic', 'fintech', 'sanzo', 'dark')." },
      },
    },
  },
  {
    name: "list_ui_components",
    description:
      "Search production-ready interactive React/Tailwind components (Rare UI, Vaul, Sonner, cmdk, Origin UI, 21st.dev) with shadcn CLI install commands and single-file TSX code.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Optional keyword or category ('AI Kit', 'Display', 'Navigation', 'Inputs', 'Feedback')." },
      },
    },
  },
  {
    name: "list_craft_assets",
    description:
      "List curated typography pairings, non-slop icon sets (Phosphor, Radix, Iconoir), WebGL shaders (Paper Shaders, Unicorn Studio, Cobe), and SVG brand logo tools.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "search_section_blueprints",
    description:
      "Query forma's proprietary Playwright + Vision Section Vault (real client-rendered Heros, Navbars, Bento/Features, Pricing Tables & Footers with Clean Semantic DOM Skeletons, getComputedStyle tokens, and Vision recreation prompts).",
    inputSchema: {
      type: "object",
      properties: {
        kind: {
          type: "string",
          enum: ["all", "hero", "navbar", "bento-features", "pricing", "cta-footer"],
          description: "Filter by canonical UI section category.",
        },
        query: {
          type: "string",
          description: "Optional domain, font, or reference site filter (e.g. 'linear', 'pricing', 'agents', 'cal.com').",
        },
        mode: {
          type: "string",
          enum: ["all", "light", "dark"],
        },
      },
    },
  },
  {
    name: "get_structural_skeletons",
    description:
      "Generate 6 deterministic CSS + HTML/TSX structural skeletons (01 Navigation, 02 Hero, 03 Asymmetric 7/5 @container Bento, 04 Tabbed Code/Proof Stage, 05 Tabular 3-Tier Pricing, 06 Colophon Footer) tailored to a project brief and stack.",
    inputSchema: {
      type: "object",
      properties: {
        projectName: { type: "string" },
        projectBrief: { type: "string" },
        layoutId: { type: "string" },
        stack: {
          type: "string",
          enum: ["nextjs-tailwind", "vite-react", "astro-css", "vanilla-html"],
        },
      },
      required: ["projectBrief"],
    },
  },
  {
    name: "check_forma_balance",
    description:
      "Check your forma prepaid credit balance ($1.00 free starter credit, 0% top-up fee), BYOK status, and per-call cloud Playwright + Vision rates (treg.to model).",
    inputSchema: {
      type: "object",
      properties: {
        apiKey: { type: "string", description: "Optional sk-forma-... token" },
      },
    },
  },
  {
    name: "get_unslop_checklist",
    description:
      "Return mandatory subtractive anti-slop UI audit rules (unslop-ui) before shipping UI.",
    inputSchema: { type: "object", properties: {} },
  },
];

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  return NextResponse.json(
    {
      name: "forma-mcp-server",
      version: "1.2.0",
      protocol: "Model Context Protocol (Streamable HTTP JSON-RPC 2.0)",
      endpoint: `${origin}/api/mcp`,
      llmsTxt: `${origin}/llms.txt`,
      openSourceXray: "forma-xray (included in /forma-xray)",
      catalogSize: WEB_FORMATS.length,
      discoveredRadarSize: discoveredFeed.sites.length,
      sectionVaultSize: getSectionVaultFeed().totalSections,
      tools: MCP_TOOLS.map((t) => ({ name: t.name, description: t.description })),
    },
    { headers: CORS_HEADERS }
  );
}

export async function POST(request: Request) {
  const rpc = await request.json().catch(() => null);
  if (!rpc || typeof rpc !== "object") {
    return NextResponse.json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const { id, method, params } = rpc as {
    id?: string | number | null;
    method?: string;
    params?: Record<string, unknown>;
  };

  if (method === "notifications/initialized") {
    return new NextResponse(null, { status: 202, headers: CORS_HEADERS });
  }

  if (method === "initialize") {
    return NextResponse.json(
      {
        jsonrpc: "2.0",
        id: id ?? 1,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: { tools: {} },
          serverInfo: { name: "forma", version: "1.2.0" },
        },
      },
      { headers: CORS_HEADERS }
    );
  }

  if (method === "ping") {
    return NextResponse.json({ jsonrpc: "2.0", id: id ?? 1, result: {} }, { headers: CORS_HEADERS });
  }

  if (method === "tools/list") {
    return NextResponse.json(
      { jsonrpc: "2.0", id: id ?? 1, result: { tools: MCP_TOOLS } },
      { headers: CORS_HEADERS }
    );
  }

  if (method === "tools/call") {
    const toolName = String(params?.name || "");
    const args = (params?.arguments || {}) as Record<string, unknown>;
    void recordTelemetryEvent({
      event: "agent_mcp_call",
      request,
      target: toolName,
    });

    if (toolName === "list_web_formats") {
      const q = String(args.query || "").toLowerCase();
      const mode = args.mode as string | undefined;
      const matches = WEB_FORMATS.filter((f) => {
        if (mode && f.surface.mode !== mode) return false;
        if (!q) return true;
        return [f.id, f.name, f.category, f.tagline, ...f.keywords]
          .join(" ")
          .toLowerCase()
          .includes(q);
      }).map((f) => ({
        id: f.id,
        name: f.name,
        mode: f.surface.mode,
        category: f.category,
        tagline: f.tagline,
        bg: f.surface.bg,
        easing: f.motion.easing,
        inspiredBy: f.inspiredBy.map((s) => s.name),
      }));

      return NextResponse.json(
        { jsonrpc: "2.0", id: id ?? 1, result: { content: [{ type: "text", text: JSON.stringify(matches, null, 2) }] } },
        { headers: CORS_HEADERS }
      );
    }

    if (toolName === "recommend_format_mix") {
      const rec = recommendMixFromBrief(String(args.brief || ""));
      return NextResponse.json(
        { jsonrpc: "2.0", id: id ?? 1, result: { content: [{ type: "text", text: JSON.stringify(rec, null, 2) }] } },
        { headers: CORS_HEADERS }
      );
    }

    if (toolName === "compose_design_spec") {
      const brief = String(args.projectBrief || "");
      const auto = recommendMixFromBrief(brief).selection;
      const genome = composeFormatGenome({
        surfaceId: String(args.surfaceId || auto.surfaceId),
        typographyId: String(args.typographyId || auto.typographyId),
        layoutId: String(args.layoutId || auto.layoutId),
        componentsId: String(args.componentsId || auto.componentsId),
        motionId: String(args.motionId || auto.motionId),
        paletteId: args.paletteId ? String(args.paletteId) : undefined,
        fontPairingId: args.fontPairingId ? String(args.fontPairingId) : undefined,
        projectName: String(args.projectName || "Acme"),
        projectBrief: brief,
        stack: (args.stack as TargetStack) || "nextjs-tailwind",
      });
      return NextResponse.json(
        { jsonrpc: "2.0", id: id ?? 1, result: { content: [{ type: "text", text: genome.masterPrompt }] } },
        { headers: CORS_HEADERS }
      );
    }

    if (toolName === "xray_live_website") {
      const checked = validatePublicHttpUrl(String(args.url || ""));
      if (!checked.ok) {
        return NextResponse.json(
          { jsonrpc: "2.0", id: id ?? 1, error: { code: -32602, message: checked.error } },
          { status: 400, headers: CORS_HEADERS }
        );
      }
      try {
        const xray = await analyzeWebsiteUrl(checked.url.toString(), { timeoutMs: 8500 });
        return NextResponse.json(
          { jsonrpc: "2.0", id: id ?? 1, result: { content: [{ type: "text", text: xray.designMd }] } },
          { headers: CORS_HEADERS }
        );
      } catch (err) {
        return NextResponse.json(
          { jsonrpc: "2.0", id: id ?? 1, error: { code: -32000, message: err instanceof Error ? err.message : "Scrape failed" } },
          { status: 422, headers: CORS_HEADERS }
        );
      }
    }

    if (toolName === "list_discovered_designs") {
      const minScore = Number(args.minScore || 0);
      const mode = args.mode as string | undefined;
      const items = discoveredFeed.sites.filter((s) => {
        if (minScore && s.craftScore < minScore) return false;
        if (mode && s.mode !== mode) return false;
        return true;
      });
      return NextResponse.json(
        { jsonrpc: "2.0", id: id ?? 1, result: { content: [{ type: "text", text: JSON.stringify(items, null, 2) }] } },
        { headers: CORS_HEADERS }
      );
    }

    if (toolName === "list_color_palettes") {
      const q = String(args.query || "").toLowerCase();
      const palettes = CURATED_COLOR_PALETTES.filter((p) => {
        if (!q) return true;
        return [p.id, p.name, p.harmony, p.psychology, ...p.keywords]
          .join(" ")
          .toLowerCase()
          .includes(q);
      }).map((p) => ({
        id: p.id,
        name: p.name,
        mode: p.mode,
        harmony: p.harmony,
        inspiredBy: p.inspiredBy.name,
        psychology: p.psychology,
        contrastText: `${getContrastRatio(p.tokens.bg, p.tokens.ink)}:1`,
        tokens: p.tokens,
        oklch: {
          bg: hexToOklchString(p.tokens.bg),
          ink: hexToOklchString(p.tokens.ink),
          accent: hexToOklchString(p.tokens.accent),
        },
      }));
      return NextResponse.json(
        { jsonrpc: "2.0", id: id ?? 1, result: { content: [{ type: "text", text: JSON.stringify(palettes, null, 2) }] } },
        { headers: CORS_HEADERS }
      );
    }

    if (toolName === "list_ui_components") {
      const q = String(args.query || "").toLowerCase();
      const comps = RARE_COMPONENTS.filter((c) => {
        if (!q) return true;
        return [c.name, c.category, c.provider, c.description, ...c.keywords]
          .join(" ")
          .toLowerCase()
          .includes(q);
      });
      return NextResponse.json(
        { jsonrpc: "2.0", id: id ?? 1, result: { content: [{ type: "text", text: JSON.stringify(comps, null, 2) }] } },
        { headers: CORS_HEADERS }
      );
    }

    if (toolName === "list_craft_assets") {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id: id ?? 1,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  { typographyPairings: TYPOGRAPHY_PAIRINGS, toolsAndAssets: CRAFT_TOOLS_AND_ASSETS },
                  null,
                  2
                ),
              },
            ],
          },
        },
        { headers: CORS_HEADERS }
      );
    }

    if (toolName === "search_section_blueprints") {
      const kind = (args.kind as SectionKind | "all" | undefined) || "all";
      const query = String(args.query || "");
      const mode = (args.mode as "light" | "dark" | "all" | undefined) || "all";
      const sections = filterVaultSections({ kind, query, mode, limit: 10 });
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id: id ?? 1,
          result: { content: [{ type: "text", text: JSON.stringify(sections, null, 2) }] },
        },
        { headers: CORS_HEADERS }
      );
    }

    if (toolName === "get_structural_skeletons") {
      const brief = String(args.projectBrief || "");
      const auto = recommendMixFromBrief(brief).selection;
      const genome = composeFormatGenome({
        surfaceId: auto.surfaceId,
        typographyId: auto.typographyId,
        layoutId: String(args.layoutId || auto.layoutId),
        componentsId: auto.componentsId,
        motionId: auto.motionId,
        projectName: String(args.projectName || "Acme"),
        projectBrief: brief,
        stack: (args.stack as TargetStack) || "nextjs-tailwind",
      });
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id: id ?? 1,
          result: { content: [{ type: "text", text: genome.structuralSkeletonsMd }] },
        },
        { headers: CORS_HEADERS }
      );
    }

    if (toolName === "check_forma_balance") {
      const key =
        (args.apiKey as string | undefined) ||
        request.headers.get("x-forma-key") ||
        undefined;
      const wallet = getOrProvisionWallet(key);
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id: id ?? 1,
          result: {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    apiKey: wallet.apiKey,
                    balanceUsd: wallet.balanceUsd,
                    dailyLimitUsd: wallet.dailyLimitUsd,
                    spentTodayUsd: wallet.spentTodayUsd,
                    hasByokGemini: wallet.hasByokGemini,
                    pricing: FORMA_CLOUD_PRICING,
                  },
                  null,
                  2
                ),
              },
            ],
          },
        },
        { headers: CORS_HEADERS }
      );
    }

    if (toolName === "get_unslop_checklist") {
      return NextResponse.json(
        {
          jsonrpc: "2.0",
          id: id ?? 1,
          result: { content: [{ type: "text", text: GLOBAL_UNSLOP_RULES.map((r, i) => `${i + 1}. ${r}`).join("\n") }] },
        },
        { headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      { jsonrpc: "2.0", id: id ?? 1, error: { code: -32601, message: `Unknown tool: ${toolName}` } },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  return NextResponse.json(
    { jsonrpc: "2.0", id: id ?? null, error: { code: -32601, message: `Method not found: ${method}` } },
    { status: 404, headers: CORS_HEADERS }
  );
}
