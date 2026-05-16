import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverActions: {
    bodySizeLimit: "100mb",
  },
  middlewareClientMaxBodySize: 104857600, // 100MB
  experimental: {
    middlewareClientMaxBodySize: 104857600,
  }
};





export default nextConfig;
