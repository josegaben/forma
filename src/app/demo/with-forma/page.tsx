import React from "react";

/**
 * EXPERIMENTAL B (Spanish): Upgraded A1.gallery × Sanzo Wada #142 × P de Pablo Flagship
 * Exact same 17-word prompt WITH forma DESIGN.md:
 * - Palette: Sanzo Wada #142 (Shōwa Silk #f5f1e8 + Roasted Walnut #1f1b18 + Persimmon #c4492b, 15.2:1 AAA)
 * - Typography: Newsreader Editorial Serif + Geist + DM Mono (tabular-nums, font-size-adjust: from-font)
 * - Layout: 1120px 12-column asymmetric split hero with studio photography + 7/5 harvest & subscription bento + frosted dock
 */
export default function WithFormaDemoPage() {
  const harvests = [
    {
      lot: "LOTE 04",
      origin: "Finca El Puente · Huila, Colombia",
      process: "Lavado · 1.950 m",
      notes: "Ciruela roja, panela cruda y cacao 85%",
      sca: "88.5",
      price: "14,50 €",
    },
    {
      lot: "LOTE 05",
      origin: "Worka Sakaro · Gedeb, Etiopía",
      process: "Natural · 2.150 m",
      notes: "Bergamota, jazmín blanco y melocotón",
      sca: "89.0",
      price: "16,00 €",
    },
    {
      lot: "LOTE 06",
      origin: "Los Pirineos · Usulután, El Salvador",
      process: "Honey · 1.480 m",
      notes: "Avellana tostada, flor de azahar y mandarina",
      sca: "87.8",
      price: "14,00 €",
    },
  ];

  return (
    <div
      className="min-h-screen pb-28"
      style={{
        backgroundColor: "#f5f1e8",
        color: "#1f1b18",
        fontFamily: "var(--font-geist), sans-serif",
      }}
    >
      {/* Architectural Masthead */}
      <header
        className="mx-auto max-w-[1120px] px-6 py-5 flex items-center justify-between border-b"
        style={{ borderColor: "rgba(31, 27, 24, 0.12)" }}
      >
        <div className="flex items-baseline gap-3">
          <span
            className="text-[24px] tracking-[-0.02em]"
            style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
          >
            Kanso
          </span>
          <span
            className="text-[11px] tracking-wide"
            style={{ color: "#6d645b", fontFamily: "var(--font-mono), monospace" }}
          >
            Tostadores · Chamberí, Madrid
          </span>
        </div>

        <div
          className="hidden sm:flex items-center gap-6 text-[12px] tabular-nums"
          style={{ color: "#6d645b", fontFamily: "var(--font-mono), monospace" }}
        >
          <span>Cosecha Nov 2026</span>
          <span>C/ Trafalgar 14</span>
          <span
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: "#e7dfd0", color: "#1f1b18" }}
          >
            Próximo tueste: Mar 07:00
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-[1120px] px-6 pt-10 sm:pt-14 space-y-14">
        {/* 12-Column Asymmetric Split Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h1
              className="text-[clamp(2.4rem,1.5rem+3.2vw,4.15rem)] leading-[1.03] tracking-[-0.03em] font-normal"
              style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
            >
              Café de origen único tostado cada martes en{" "}
              <span className="italic" style={{ color: "#c4492b" }}>
                pequeños lotes.
              </span>
            </h1>

            <p
              className="text-[16px] leading-[1.65] max-w-[52ch]"
              style={{ color: "#5e554d" }}
            >
              Seleccionamos tres micro-lotes por estación junto a productores de Huila, Gedeb y Usulután. Tostamos en tambor de hierro fundido Loring S15 y enviamos el mismo día para que repose en tu casa.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#suscripcion"
                className="px-6 py-3 rounded-full text-[13.5px] font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#c4492b", color: "#fbf9f4" }}
              >
                Suscribirme al tueste del martes · 24 € →
              </a>
              <a
                href="#cosecha"
                className="px-5 py-3 rounded-full text-[13px] font-medium border"
                style={{
                  borderColor: "rgba(31, 27, 24, 0.18)",
                  backgroundColor: "#fbf9f4",
                }}
              >
                Ver los 3 orígenes
              </a>
            </div>

            {/* Crisp Tabular Craft Proof */}
            <div
              className="pt-6 border-t grid grid-cols-3 gap-4 tabular-nums"
              style={{ borderColor: "rgba(31, 27, 24, 0.12)" }}
            >
              <div>
                <div
                  className="text-[22px] font-normal"
                  style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
                >
                  88.5 pts
                </div>
                <div
                  className="text-[11px]"
                  style={{ color: "#6d645b", fontFamily: "var(--font-mono), monospace" }}
                >
                  Nota media SCA
                </div>
              </div>
              <div>
                <div
                  className="text-[22px] font-normal"
                  style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
                >
                  204.5 °C
                </div>
                <div
                  className="text-[11px]"
                  style={{ color: "#6d645b", fontFamily: "var(--font-mono), monospace" }}
                >
                  Primer crack · 08:42
                </div>
              </div>
              <div>
                <div
                  className="text-[22px] font-normal"
                  style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
                >
                  &lt; 24 h
                </div>
                <div
                  className="text-[11px]"
                  style={{ color: "#6d645b", fontFamily: "var(--font-mono), monospace" }}
                >
                  Del tambor a casa
                </div>
              </div>
            </div>
          </div>

          {/* Right 6-Col Editorial Studio Frame + Roast Telemetry */}
          <div className="lg:col-span-6">
            <div
              className="rounded-[20px] p-2.5 border shadow-sm"
              style={{
                backgroundColor: "#fbf9f4",
                borderColor: "rgba(31, 27, 24, 0.12)",
              }}
            >
              <div className="relative rounded-[14px] overflow-hidden aspect-[16/10] bg-[#e7dfd0]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/showcase/kanso-editorial.jpg"
                  alt="Bolsa de café Kanso Madrid Lote 04 junto a cerámica artesanal sobre piedra travertino"
                  width={1280}
                  height={714}
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute bottom-3 inset-x-3 rounded-[12px] px-3.5 py-2.5 flex items-center justify-between gap-4 border"
                  style={{
                    backgroundColor: "rgba(251, 249, 244, 0.90)",
                    backdropFilter: "blur(12px)",
                    borderColor: "rgba(31, 27, 24, 0.12)",
                  }}
                >
                  <div>
                    <div
                      className="text-[10px]"
                      style={{ color: "#c4492b", fontFamily: "var(--font-mono), monospace" }}
                    >
                      LOTE 04 · FINCA EL PUENTE (1.950 M)
                    </div>
                    <div className="text-[13px] font-medium">
                      Ciruela roja · Panela · Cacao puro
                    </div>
                  </div>
                  <svg
                    width="96"
                    height="28"
                    viewBox="0 0 96 28"
                    fill="none"
                    aria-hidden="true"
                    className="shrink-0"
                  >
                    <path
                      d="M2 24C18 23 28 19 42 12C56 5 72 4 94 6"
                      stroke="#c4492b"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="74" cy="5.5" r="3" fill="#1f1b18" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Asymmetric 7/5 Harvest Ledger + Subscription Bento */}
        <section
          id="cosecha"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
        >
          {/* 7-Col Origin Ledger */}
          <div
            className="lg:col-span-7 rounded-[18px] p-6 sm:p-7 border flex flex-col justify-between"
            style={{
              backgroundColor: "#fbf9f4",
              borderColor: "rgba(31, 27, 24, 0.11)",
            }}
          >
            <div>
              <div
                className="flex items-center justify-between pb-3 border-b text-[11px] tabular-nums"
                style={{
                  borderColor: "rgba(31, 27, 24, 0.14)",
                  color: "#6d645b",
                  fontFamily: "var(--font-mono), monospace",
                }}
              >
                <span>Carta de cosecha actual · 3 fincas</span>
                <span>Tueste ligero-medio</span>
              </div>

              <div
                className="divide-y"
                style={{ borderColor: "rgba(31, 27, 24, 0.10)" }}
              >
                {harvests.map((item) => (
                  <article
                    key={item.lot}
                    className="py-4 grid grid-cols-12 gap-3 items-baseline"
                  >
                    <div
                      className="col-span-2 text-[11px] font-medium tabular-nums"
                      style={{ color: "#c4492b", fontFamily: "var(--font-mono), monospace" }}
                    >
                      {item.lot}
                    </div>
                    <div className="col-span-6">
                      <h2 className="text-[15.5px] font-medium">{item.origin}</h2>
                      <p className="text-[13px] mt-0.5" style={{ color: "#6d645b" }}>
                        {item.notes}
                      </p>
                    </div>
                    <div
                      className="col-span-2 text-[11.5px] tabular-nums"
                      style={{ color: "#6d645b", fontFamily: "var(--font-mono), monospace" }}
                    >
                      SCA {item.sca}
                    </div>
                    <div
                      className="col-span-2 text-right text-[13px] font-medium tabular-nums"
                      style={{ fontFamily: "var(--font-mono), monospace" }}
                    >
                      {item.price}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div
              className="pt-4 border-t flex items-center justify-between text-[11.5px]"
              style={{
                borderColor: "rgba(31, 27, 24, 0.10)",
                color: "#6d645b",
                fontFamily: "var(--font-mono), monospace",
              }}
            >
              <span>Trazabilidad directa en finca · Cosecha 2026</span>
              <span>Bolsas de 250 g con válvula</span>
            </div>
          </div>

          {/* 5-Col Dark Roasted Walnut Subscription Card */}
          <div
            id="suscripcion"
            className="lg:col-span-5 rounded-[18px] p-6 sm:p-7 flex flex-col justify-between gap-6"
            style={{ backgroundColor: "#1f1b18", color: "#fbf9f4" }}
          >
            <div className="space-y-3">
              <span
                className="inline-block px-2.5 py-1 rounded-full text-[10.5px]"
                style={{
                  backgroundColor: "rgba(251, 249, 244, 0.12)",
                  color: "#e7dfd0",
                  fontFamily: "var(--font-mono), monospace",
                }}
              >
                Suscripción mensual · Sin permanencia
              </span>
              <h3
                className="text-[28px] leading-[1.08] font-normal"
                style={{ fontFamily: "var(--font-editorial), Georgia, serif" }}
              >
                Dos bolsas de origen distinto cada primer martes.
              </h3>
              <p className="text-[13.5px] leading-relaxed" style={{ color: "#b8afa4" }}>
                2 × 250 g recién tostados con ficha de receta para V60, Aeropress y espresso. Pausa o salta un mes en un clic.
              </p>

              <div
                className="pt-2 flex flex-wrap gap-1.5 text-[11px]"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                <span className="px-2.5 py-1 rounded-full bg-white/15 text-white">
                  Grano entero
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/6 text-[#b8afa4]">
                  Filtro V60
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/6 text-[#b8afa4]">
                  Espresso
                </span>
              </div>
            </div>

            <div
              className="pt-5 border-t flex items-end justify-between gap-4"
              style={{ borderColor: "rgba(251, 249, 244, 0.12)" }}
            >
              <div>
                <div className="text-[30px] font-semibold tabular-nums leading-none">
                  24 €
                </div>
                <div
                  className="text-[11px] mt-1"
                  style={{ color: "#b8afa4", fontFamily: "var(--font-mono), monospace" }}
                >
                  envío 24h incluido
                </div>
              </div>
              <button
                type="button"
                className="px-5 py-3 rounded-full text-[13px] font-medium cursor-pointer"
                style={{ backgroundColor: "#c4492b", color: "#fbf9f4" }}
              >
                Empezar suscripción →
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* P de Pablo Frosted Swiss Bottom Dock */}
      <nav
        aria-label="Kanso navigation"
        className="fixed bottom-5 inset-x-0 mx-auto w-fit px-4 py-2 rounded-full border flex items-center gap-5 text-[12px] shadow-sm"
        style={{
          backgroundColor: "rgba(251, 249, 244, 0.88)",
          borderColor: "rgba(31, 27, 24, 0.12)",
          backdropFilter: "blur(14px)",
        }}
      >
        <a href="#cosecha" className="font-medium">
          Cosecha (3)
        </a>
        <span style={{ color: "#6d645b" }}>Tostadero</span>
        <a href="#suscripcion" style={{ color: "#6d645b" }}>
          Suscripción
        </a>
        <span
          className="px-3 py-1 rounded-full text-[11px] font-medium tabular-nums"
          style={{
            backgroundColor: "#1f1b18",
            color: "#fbf9f4",
            fontFamily: "var(--font-mono), monospace",
          }}
        >
          24 € / mes
        </span>
      </nav>
    </div>
  );
}
