import type { NextConfig } from "next";

const config: NextConfig = {
  agentRules: false,
  async headers() {
    return process.env.NODE_ENV === "production"
      ? [
          {
            source: "/fonts/:path*",
            headers: [{ key: "Cache-Control", value: "public, max-age=3600" }],
          },
        ]
      : [];
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      {
        source: "/videos/playlist/:slug.html",
        destination: "/videos/playlist/:slug",
        permanent: true,
      },
      { source: "/:path*/index.html", destination: "/:path*", permanent: true },
    ];
  },
};
export default config;
