import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/utils";

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = getBaseUrl();

  return {
    name: "TestiWall",
    short_name: "TestiWall",
    description: "Collect, moderate, and embed testimonials in minutes.",
    start_url: baseUrl,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#059669",
    icons: [
      {
        src: `${baseUrl}/icon`,
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${baseUrl}/apple-icon`,
        sizes: "180x180",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["business", "productivity"],
  };
}
