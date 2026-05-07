import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/research/musings", destination: "/research/notes", permanent: true }];
  },
};

export default nextConfig;
