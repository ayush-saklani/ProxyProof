import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@mui/material', '@mui/x-date-pickers', '@mui/system'],
};

export default nextConfig;
