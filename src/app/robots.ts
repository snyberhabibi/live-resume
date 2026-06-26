import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://hireyusuf.com/sitemap.xml",
    host: "https://hireyusuf.com",
  };
}
