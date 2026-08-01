import type { NextConfig } from "next";

const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/gallery", destination: "/projects", permanent: true },
      { source: "/services/mowing", destination: "/services/lawn-mowing", permanent: true },
      { source: "/services/design-installations", destination: "/services/landscape-care", permanent: true },
      { source: "/services/fertilization-chemicals", destination: "/services/lawn-mowing", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-and-conditions", destination: "/terms", permanent: true },
    ];
  },
  async headers() {
    const robotsValue = allowIndexing ? "index, follow" : "noindex, nofollow";
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: robotsValue },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
