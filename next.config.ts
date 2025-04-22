import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
      {
        protocol: process.env.PUBLIC_API_BASE_URL?.substring(
          0,
          process.env.PUBLIC_API_BASE_URL?.indexOf("://")
        ) as "https" | "http" | undefined,
        hostname:
          process.env.PUBLIC_API_BASE_URL?.substring(
            process.env.PUBLIC_API_BASE_URL?.indexOf("://")
          ) ?? "",
      },
    ],
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    PUBLIC_API_BASE_URL: process.env.PUBLIC_API_BASE_URL,
  },
};

console.log(nextConfig.images?.remotePatterns);

export default nextConfig;
