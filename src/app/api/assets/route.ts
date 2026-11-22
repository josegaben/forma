import { NextResponse } from "next/server";
import { recordTelemetryEvent } from "@/lib/telemetry";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

interface CacheEntry {
  expiresAt: number;
  payload: unknown;
}

const memoryCache = new Map<string, CacheEntry>();
const TTL_MS = 1000 * 60 * 15; // 15 min cache

function getCached<T>(key: string): T | null {
  const hit = memoryCache.get(key);
  if (hit && hit.expiresAt > Date.now()) return hit.payload as T;
  return null;
}

function setCached(key: string, payload: unknown) {
  if (memoryCache.size > 200) {
    const firstKey = memoryCache.keys().next().value;
    if (firstKey) memoryCache.delete(firstKey);
  }
  memoryCache.set(key, { expiresAt: Date.now() + TTL_MS, payload });
}

interface RawSvglItem {
  id: number;
  title: string;
  category: string | string[];
  route: string | { light: string; dark: string };
  wordmark?: string | { light: string; dark: string };
  url?: string;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * Connected Live Vector Gateway (/api/assets)
 * - kind=logos : Live SVGL official tech brand logos (https://api.svgl.app)
 * - kind=icons : Live Iconify vectors across Phosphor (ph), Tabler (tabler), Iconoir (iconoir), Radix (radix-icons)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kind = (searchParams.get("kind") || "logos").toLowerCase();
  const query = (searchParams.get("q") || "vercel").trim();
  const limit = Math.min(24, Math.max(1, Number(searchParams.get("limit") || 12)));
  const includeInlineSvg = searchParams.get("inline") === "true";

  void recordTelemetryEvent({
    event: "agent_discover_api",
    request,
    target: `assets:${kind}:${query.slice(0, 24)}`,
  });

  if (kind === "logos") {
    const cacheKey = `svgl:${query.toLowerCase()}:${limit}:${includeInlineSvg}`;
    const cached = getCached<unknown>(cacheKey);
    if (cached) {
      return NextResponse.json(cached, { headers: CORS_HEADERS });
    }

    try {
      const upstreamUrl = query
        ? `https://api.svgl.app?search=${encodeURIComponent(query)}`
        : "https://api.svgl.app";
      const res = await fetch(upstreamUrl, {
        headers: {
          Accept: "application/json",
          "User-Agent": "forma-to/1.2 (+https://forma.to)",
        },
        signal: AbortSignal.timeout(4500),
      }).catch(() => null);

      if (res && res.ok) {
        const raw = (await res.json()) as RawSvglItem[];
        const items = (Array.isArray(raw) ? raw : []).slice(0, limit);

        const logos = await Promise.all(
          items.map(async (item) => {
            const lightUrl =
              typeof item.route === "string" ? item.route : item.route?.light || "";
            const darkUrl =
              typeof item.route === "string" ? item.route : item.route?.dark || lightUrl;

            let svgMarkup: string | undefined;
            if (includeInlineSvg && lightUrl.startsWith("https://")) {
              try {
                const svgRes = await fetch(lightUrl, { signal: AbortSignal.timeout(3000) });
                if (svgRes.ok) svgMarkup = await svgRes.text();
              } catch {
                svgMarkup = undefined;
              }
            }

            return {
              id: item.id,
              title: item.title,
              categories: Array.isArray(item.category) ? item.category : [item.category],
              svgLightUrl: lightUrl,
              svgDarkUrl: darkUrl,
              brandSite: item.url || "",
              ...(svgMarkup ? { svg: svgMarkup } : {}),
            };
          })
        );

        const payload = {
          provider: "SVGL (https://svgl.app)",
          query,
          count: logos.length,
          logos,
        };
        setCached(cacheKey, payload);
        return NextResponse.json(payload, { headers: CORS_HEADERS });
      }

      // Cloud-resilient fallback when SVGL WAF blocks datacenter IPs: Iconify `logos` + `simple-icons` (3,500+ official brand marks)
      const fallbackUrl = `https://api.iconify.design/search?query=${encodeURIComponent(
        query || "vercel"
      )}&prefixes=logos,simple-icons,devicon&limit=${limit}`;
      const fbRes = await fetch(fallbackUrl, { signal: AbortSignal.timeout(5000) });
      const fbData = fbRes.ok ? ((await fbRes.json()) as { icons?: string[] }) : { icons: [] };
      const fbIds = (fbData.icons || []).slice(0, limit);

      const logos = await Promise.all(
        fbIds.map(async (fullId, idx) => {
          const [prefix, name] = fullId.split(":");
          const svgUrl = `https://api.iconify.design/${prefix}/${name}.svg?height=32`;
          let svgMarkup: string | undefined;
          if (includeInlineSvg) {
            try {
              const sr = await fetch(svgUrl, { signal: AbortSignal.timeout(3000) });
              if (sr.ok) svgMarkup = await sr.text();
            } catch {
              svgMarkup = undefined;
            }
          }
          const prettyTitle = name
            .replace(/-icon$/i, "")
            .split("-")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
          return {
            id: 10000 + idx,
            title: `${prettyTitle}${prefix === "simple-icons" ? " (Mono)" : ""}`,
            categories: [prefix],
            svgLightUrl: svgUrl,
            svgDarkUrl: svgUrl,
            brandSite: "",
            ...(svgMarkup ? { svg: svgMarkup } : {}),
          };
        })
      );

      const payload = {
        provider: "SVGL × Iconify Brand Logos (Cloud Resilient)",
        query,
        count: logos.length,
        logos,
      };
      setCached(cacheKey, payload);
      return NextResponse.json(payload, { headers: CORS_HEADERS });
    } catch (err) {
      return NextResponse.json(
        {
          error: err instanceof Error ? err.message : "SVGL lookup failed",
          logos: [],
        },
        { status: 502, headers: CORS_HEADERS }
      );
    }
  }

  // kind === "icons" -> Live Iconify search + raw SVG retrieval across curated non-slop sets
  const allowedSets = "ph,tabler,iconoir,radix-icons";
  const requestedSet = searchParams.get("set")?.trim();
  const prefixes =
    requestedSet && ["ph", "tabler", "iconoir", "radix-icons"].includes(requestedSet)
      ? requestedSet
      : allowedSets;

  const cacheKey = `iconify:${query.toLowerCase()}:${prefixes}:${limit}`;
  const cached = getCached<unknown>(cacheKey);
  if (cached) {
    return NextResponse.json(cached, { headers: CORS_HEADERS });
  }

  try {
    const searchUrl = `https://api.iconify.design/search?query=${encodeURIComponent(
      query || "sparkle"
    )}&prefixes=${encodeURIComponent(prefixes)}&limit=${limit}`;

    const searchRes = await fetch(searchUrl, { signal: AbortSignal.timeout(6000) });
    if (!searchRes.ok) {
      return NextResponse.json(
        { error: `Iconify upstream returned HTTP ${searchRes.status}`, icons: [] },
        { status: 502, headers: CORS_HEADERS }
      );
    }

    const searchData = (await searchRes.json()) as { icons?: string[] };
    const iconIds = (searchData.icons || []).slice(0, limit);

    const icons = await Promise.all(
      iconIds.map(async (fullId) => {
        const [prefix, name] = fullId.split(":");
        const svgUrl = `https://api.iconify.design/${prefix}/${name}.svg?height=24`;
        let svg = "";
        try {
          const r = await fetch(svgUrl, { signal: AbortSignal.timeout(3500) });
          if (r.ok) svg = await r.text();
        } catch {
          svg = "";
        }
        return {
          id: fullId,
          pack: prefix,
          name,
          svgUrl,
          svg,
        };
      })
    );

    const payload = {
      provider: "Iconify (Phosphor · Tabler · Iconoir · Radix)",
      query,
      count: icons.length,
      icons,
    };
    setCached(cacheKey, payload);
    return NextResponse.json(payload, { headers: CORS_HEADERS });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Iconify lookup failed",
        icons: [],
      },
      { status: 502, headers: CORS_HEADERS }
    );
  }
}
