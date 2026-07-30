import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Strict allowlist: only known, trusted image sources. Never use hostname: '*'.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary-hosted project/cert/hackathon images
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // GitHub profile/repo owner avatars
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // Placeholder/stock imagery during development
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com", // YouTube video thumbnails (SR Builds section)
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
