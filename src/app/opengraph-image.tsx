import { ImageResponse } from "next/og";

export const alt = "forma — OpenRouter for Web Design";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#fbfbfa",
          color: "#141413",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Row: Geometric Logo + Metrics Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#141413",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "10px",
                gap: "4px",
              }}
            >
              <div style={{ width: "26px", height: "7px", backgroundColor: "#faf9f6", borderRadius: "2px" }} />
              <div style={{ display: "flex", gap: "4px" }}>
                <div style={{ width: "7px", height: "14px", backgroundColor: "#faf9f6", borderRadius: "2px" }} />
                <div style={{ width: "14px", height: "7px", backgroundColor: "#e06d44", borderRadius: "2px" }} />
              </div>
            </div>
            <span style={{ fontSize: "30px", fontWeight: 700, letterSpacing: "-0.04em" }}>
              forma.to
            </span>
          </div>

          <div
            style={{
              padding: "10px 22px",
              borderRadius: "999px",
              backgroundColor: "#ffffff",
              border: "1px solid rgba(20,20,19,0.12)",
              fontSize: "18px",
              color: "#6e6d68",
            }}
          >
            CLS = 0.000 · 100% GPU Motion · 0% AI Slop
          </div>
        </div>

        {/* Center Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize: "78px",
              fontWeight: 400,
              letterSpacing: "-0.035em",
              lineHeight: 1.02,
              fontFamily: "Georgia, serif",
            }}
          >
            OpenRouter for web design
          </div>
          <div style={{ fontSize: "28px", color: "#6e6d68", maxWidth: "900px" }}>
            Connect Claude, Cursor or Codex to 190+ curated formats, OKLCH palettes, and Rare UI components.
          </div>
        </div>

        {/* Bottom Agent Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#141413",
            color: "#fbfbfa",
            padding: "20px 28px",
            borderRadius: "18px",
            fontSize: "22px",
          }}
        >
          <span style={{ fontFamily: "monospace" }}>
            $ set up forma - https://forma-to.vercel.app/llms.txt
          </span>
          <span
            style={{
              backgroundColor: "#ffffff",
              color: "#141413",
              padding: "8px 22px",
              borderRadius: "999px",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            open source · MIT
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
