import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://hireyusuf.com",
      lastModified: new Date("2026-06-26"),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
