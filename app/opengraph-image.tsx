import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "TestiWall – Collect & Embed Testimonials Without the Friction";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 70%, #064e3b 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "white",
            marginBottom: 16,
          }}
        >
          TestiWall
        </div>
        <div
          style={{
            fontSize: 32,
            color: "#a0a0a0",
            marginBottom: 32,
          }}
        >
          Collect & embed testimonials without the friction
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            fontSize: 20,
            color: "#10b981",
          }}
        >
          <span>✓ Set up in minutes</span>
          <span>✓ One line embed</span>
          <span>✓ SEO optimized</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
