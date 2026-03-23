import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Top-level properties go here
  allowedDevOrigins: [
    "*.ngrok-free.app",
    "*.ngrok-free.dev",
    "*.ngrok.io",
    // "192.168.0.101:3000",
    "localhost:3000",
    "127.0.0.1:3000",          
  ],

  // Proxy all /api calls to your backend → solves most cookie/CORS/401 problems
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
        // Or more flexible:
        // destination: `${process.env.BACKEND_URL || "http://192.168.0.101:5000"}/api/:path*`,
      },
    ];
  },

  // Only real experimental features here
  experimental: {
    // Example (add only if you actually use them):
    // optimizePackageImports: ["lodash", "date-fns"],
    // serverActions: { bodySizeLimit: "2mb" },
    // ...
  },

  // Optional but often useful
  reactStrictMode: true,
  poweredByHeader: false,
};

const withSerwist = withSerwistInit({
  swSrc: path.join(process.cwd(), "src", "app", "sw.ts"),
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

export default withSerwist(nextConfig);