import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  // Stare adresy z poprzedniej strony (WordPress) — wciąż zaindeksowane w Google, ale dziś
  // kończą 404. Przekierowania 301 zamiast tego przekazują ruch/crawl budget na aktualne strony.
  async redirects() {
    return [
      { source: "/stymulacja-nerwu-blednego", destination: "/the-science", permanent: true },
      { source: "/artykuly", destination: "/blog", permanent: true },
      { source: "/nauka", destination: "/the-science", permanent: true },
      { source: "/produkt/elektrody-samoprzylepne", destination: "/shop", permanent: true },
    ];
  },
};

export default nextConfig;
