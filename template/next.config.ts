import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [`https://${process.env.NGROK_DOMAIN}`, `${process.env.BETTER_AUTH_URL}`]
};

export default nextConfig;
