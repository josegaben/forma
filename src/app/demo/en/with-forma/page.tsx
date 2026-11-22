import React from "react";

/**
 * EXPERIMENTAL B (English): Exact same prompt WITH forma DESIGN.md:
 * - Palette: Sanzo Wada #142 (Shōwa Silk #f5f1e8 + Roasted Ink #1f1b18 + Persimmon #c4492b, 15.2:1 AAA)
 * - Typography: Newsreader Editorial Serif + Geist + DM Mono (tabular-nums)
 * - Layout: DeadSimpleSites × P de Pablo restraint (860px column, 1px origin ledger, frosted dock)
 * - Guardrails: unslop-ui (0 purple gradients, 0 fake eyebrows, 0 botsplaining, honest single subscription)
 */
export default function WithFormaEnglishDemoPage() {
  const harvests = [
    {
      lot: "LOT 04",
      origin: "Finca El Puente · Huila, Colombia",
      process: "Washed · 1,950 m",
      notes: "Red plum, raw panela & dark cacao",
      weight: "250 g",
    },
    {
      lot: "LOT 05",
      origin: "Worka Sakaro · Gedeb, Ethiopia",
      process: "Natural · 2,150 m",
      notes: "Bergamot, jasmine & white peach",
      weight: "250 g",
    },
    {
      lot: "LOT 06",
      origin: "Los Pirineos · Usulután, El Salvador",
      process: "Honey · 1,480 m",
      notes: "Roasted hazelnut, orange blossom & mandarin",
      weight: "250 g",
    },
  ];

  return (
    <div
      className="min-h-screen pb-24"
      style={{
        backgroundColor: "#f5f1e8",
        color: "#1f1b18",
        fontFamily: "var(--font-geist), sans-serif",
      }}
    >
      {/* Minimal Inline Header */}
      <header
        className="mx-auto max-w-[860px] px-6 py-7 flex items-center justify-between border-b"
        style={{ borderColor: "rgba(31, 27, 24, 0.11)" }}
      >
        <div className="flex items-baseline gap-3">
          <span
            className="text-[21px] tracking-tight"
            style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
          >
            Kanso
          </span>
          <span
            className="text-[11px] uppercase tracking-wider"
            style={{ color: "#6d645b", fontFamily: "var(--font-mono), monospace" }}
          >
            Roasters · Madrid
          </span>
        </div>

        <div
          className="flex items-center gap-6 text-[12.5px]"
          style={{ color: "#6d645b", fontFamily: "var(--font-mono), monospace" }}
        >
          <span>Current harvest</span>
          <span>C/ Trafalgar 14</span>
          <span style={{ color: "#1f1b18" }}>Tue–Sun 08:30</span>
        </div>
      </header>

      {/* Editorial Hero — Calm, sensory, zero fluff */}
      <main className="mx-auto max-w-[860px] px-6 pt-14">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] mb-6"
          style={{
            backgroundColor: "#e7dfd0",
            color: "#1f1b18",
            fontFamily: "var(--font-mono), monospace",
          }}
        >
          <span>NEXT ROAST: TUESDAY 07:00 · SHIPS WITHIN 24H</span>
        </div>

        <h1
          className="text-[clamp(2.5rem,5vw,3.85rem)] leading-[1.04] tracking-[-0.028em] font-normal max-w-[720px]"
          style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
        >
          Seasonal single-origin coffee roasted every Tuesday in{" "}
          <span className="italic">small batches.</span>
        </h1>

        <p
          className="mt-5 text-[16px] leading-[1.65] max-w-[58ch]"
          style={{ color: "#6d645b" }}
        >
          We partner directly with three small farms each season. Every batch is roasted on cast-iron drums in Chamberí and dispatched the same afternoon so it arrives at peak degassing rest.
        </p>

        {/* Fine-Ruled Origin Ledger (DeadSimpleSites × A1 Monograph craft) */}
        <section className="mt-14">
          <div
            className="flex items-center justify-between pb-3 border-b text-[11px] uppercase tracking-wider"
            style={{
              borderColor: "rgba(31, 27, 24, 0.16)",
              color: "#6d645b",
              fontFamily: "var(--font-mono), monospace",
            }}
          >
            <span>November Harvest</span>
            <span className="tabular-nums">SCA 87.5 — 89.0 pts</span>
          </div>

          <div
            className="divide-y border-b"
            style={{
              borderColor: "rgba(31, 27, 24, 0.11)",
            }}
          >
            {harvests.map((item) => (
              <article
                key={item.lot}
                className="py-5 grid grid-cols-12 gap-4 items-baseline"
                style={{ borderColor: "rgba(31, 27, 24, 0.11)" }}
              >
                <div
                  className="col-span-2 text-[11.5px] tabular-nums"
                  style={{ color: "#c4492b", fontFamily: "var(--font-mono), monospace" }}
                >
                  {item.lot}
                </div>
                <div className="col-span-5">
                  <h2 className="text-[16px] font-medium">{item.origin}</h2>
                  <p className="text-[13.5px] mt-0.5" style={{ color: "#6d645b" }}>
                    {item.notes}
                  </p>
                </div>
                <div
                  className="col-span-3 text-[12px] tabular-nums"
                  style={{ color: "#6d645b", fontFamily: "var(--font-mono), monospace" }}
                >
                  {item.process}
                </div>
                <div
                  className="col-span-2 text-right text-[12.5px] tabular-nums font-medium"
                  style={{ fontFamily: "var(--font-mono), monospace" }}
                >
                  {item.weight}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Honest Single Subscription Card (60-30-10 Sanzo Wada Persimmon CTA) */}
        <section
          className="mt-12 p-7 rounded-[14px] border flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          style={{
            backgroundColor: "#fbf9f4",
            borderColor: "rgba(31, 27, 24, 0.11)",
          }}
        >
          <div className="space-y-1.5">
            <div
              className="text-[11px] uppercase tracking-wider"
              style={{ color: "#6d645b", fontFamily: "var(--font-mono), monospace" }}
            >
              MONTHLY SUBSCRIPTION · CANCEL ANYTIME
            </div>
            <h3
              className="text-[24px] leading-snug"
              style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
            >
              Two distinct single-origin bags every month
            </h3>
            <p className="text-[13.5px]" style={{ color: "#6d645b" }}>
              2 × 250 g whole bean or ground for filter / espresso. Pause or skip in one click.
            </p>
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <div className="text-right">
              <div className="text-[26px] font-semibold tabular-nums leading-none">
                €24
              </div>
              <div
                className="text-[11px] mt-1"
                style={{ color: "#6d645b", fontFamily: "var(--font-mono), monospace" }}
              >
                shipping included
              </div>
            </div>
            <button
              type="button"
              className="px-5 py-3 rounded-full text-[13.5px] font-medium"
              style={{ backgroundColor: "#c4492b", color: "#fbf9f4" }}
            >
              Receive Tuesday&apos;s roast →
            </button>
          </div>
        </section>
      </main>

      {/* P de Pablo Frosted Bottom Dock */}
      <div
        className="fixed bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full border flex items-center gap-5 text-[12px]"
        style={{
          backgroundColor: "rgba(251, 249, 244, 0.86)",
          borderColor: "rgba(31, 27, 24, 0.12)",
          backdropFilter: "blur(14px)",
        }}
      >
        <span>Harvest</span>
        <span style={{ color: "#6d645b" }}>Roastery</span>
        <span style={{ color: "#6d645b" }}>Subscription</span>
        <span
          className="px-3 py-1 rounded-full text-[11px] font-medium tabular-nums"
          style={{ backgroundColor: "#1f1b18", color: "#fbf9f4" }}
        >
          €24 / mo
        </span>
      </div>
    </div>
  );
}
