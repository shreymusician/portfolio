import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} -- ${siteConfig.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#F8FAFC",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 32, color: "#2563EB", fontWeight: 600 }}>
          {siteConfig.title}
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 72,
            color: "#0F172A",
            fontWeight: 700,
          }}
        >
          {siteConfig.name}
        </div>
        <div style={{ marginTop: 24, fontSize: 28, color: "#475569" }}>
          {siteConfig.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
