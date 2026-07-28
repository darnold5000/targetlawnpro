import type { MetadataRoute } from "next";
import { allowIndexing, siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/login", "/api", "/access-disabled"],
    },
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
