import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "EinfachAmt – Behördenbriefe in 30 Sekunden verstehen";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a84ff",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "80px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              background: "rgba(255,255,255,0.2)",
              borderRadius: 18,
              width: 60,
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 34,
              fontWeight: 900,
            }}
          >
            E
          </div>
          <span
            style={{ color: "white", fontSize: 34, fontWeight: 800 }}
          >
            EinfachAmt
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            color: "white",
            fontSize: 68,
            fontWeight: 900,
            lineHeight: 1.07,
            marginTop: 52,
            maxWidth: 1000,
          }}
        >
          Behördenbriefe verstehen in 30 Sekunden.
        </div>

        {/* Steps */}
        <div
          style={{
            color: "rgba(255,255,255,0.88)",
            fontSize: 30,
            marginTop: 30,
            display: "flex",
            gap: 32,
          }}
        >
          <span>📷 Foto machen</span>
          <span style={{ opacity: 0.5 }}>→</span>
          <span>📋 Erklärung lesen</span>
          <span style={{ opacity: 0.5 }}>→</span>
          <span>✉️ Antworten</span>
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: 52,
            background: "white",
            borderRadius: 999,
            padding: "18px 44px",
            color: "#0a84ff",
            fontSize: 28,
            fontWeight: 800,
            display: "inline-flex",
            alignSelf: "flex-start",
          }}
        >
          Kostenlos testen →
        </div>

        {/* Domain bottom right */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            color: "rgba(255,255,255,0.5)",
            fontSize: 24,
            fontWeight: 600,
          }}
        >
          einfachamt.com
        </div>
      </div>
    ),
    { ...size },
  );
}
