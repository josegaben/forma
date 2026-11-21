import { NextResponse } from "next/server";
import { REFERENCE_SOURCES, WEB_FORMATS } from "@/data/formats";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  const category = (searchParams.get("category") || "").trim().toLowerCase();
  const mode = (searchParams.get("mode") || "").trim().toLowerCase();
  const source = (searchParams.get("source") || "").trim().toLowerCase();

  const filtered = WEB_FORMATS.filter((fmt) => {
    if (category && category !== "all" && fmt.category.toLowerCase() !== category) {
      return false;
    }
    if (mode && (mode === "light" || mode === "dark") && fmt.surface.mode !== mode) {
      return false;
    }
    if (
      source &&
      !fmt.inspiredBy.some(
        (s) =>
          s.name.toLowerCase().includes(source) ||
          s.url.toLowerCase().includes(source)
      )
    ) {
      return false;
    }
    if (!q) return true;

    const haystack = [
      fmt.id,
      fmt.name,
      fmt.category,
      fmt.tagline,
      fmt.taglineEs,
      ...fmt.keywords,
      ...fmt.bestFor,
      ...fmt.inspiredBy.map((s) => s.name),
    ]
      .join(" ")
      .toLowerCase();

    return q.split(/\s+/).every((term) => haystack.includes(term));
  });

  return NextResponse.json(
    {
      count: filtered.length,
      totalCatalog: WEB_FORMATS.length,
      formats: filtered,
      references: REFERENCE_SOURCES,
    },
    {
      headers: { "Access-Control-Allow-Origin": "*" },
    }
  );
}
