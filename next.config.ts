import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.PAGES_BUILD === 'true' && { output: 'export', basePath: '/dataforge' }),
};

export default nextConfig;
