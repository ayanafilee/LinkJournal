import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Increases the allowed file size for Server Actions. 
      // Set this to '10mb' or higher depending on your needs.
      bodySizeLimit: '10mb', 
    },
  },
};

export default nextConfig;