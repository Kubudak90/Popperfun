import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@popper/sdk"],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    if (Array.isArray(config.externals)) {
      config.externals.push("pino-pretty", "lokijs", "encoding");
    }
    return config;
  },
};

export default nextConfig;
