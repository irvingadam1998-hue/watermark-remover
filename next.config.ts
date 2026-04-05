import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,

  experimental: {
    // Tree-shake ffmpeg imports to reduce bundle size
    optimizePackageImports: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy",   value: "same-origin"   },
          { key: "Cross-Origin-Embedder-Policy",  value: "require-corp"  },
          // Cache static FFmpeg WASM files aggressively
          { key: "Vary", value: "Accept-Encoding" },
        ],
      },
      {
        source: "/ffmpeg/:file*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
