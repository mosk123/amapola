import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite acceder al dev server a través de un túnel ngrok (para probar
  // el redirect de Mercado Pago y, después, el webhook, sobre HTTPS real).
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok-free.dev", "*.ngrok.app", "*.ngrok.io"],
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
