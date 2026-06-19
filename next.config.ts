import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  outputFileTracingRoot: __dirname,
  assetPrefix: "./",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
