import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,gif}"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
      },
      includeAssets: [], // Remove old assets from cache
      manifest: {
        name: "Abhushan Kala Kendra - Premium Jewelry Store",
        short_name: "Abhushan",
        description:
          "Shop exquisite handcrafted gold, silver & diamond jewellery at Abhushan Kala Kendra. Premium wedding collections, custom designs & hallmarked ornaments.",
        theme_color: "#f59e0b",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait-primary",
        categories: ["shopping", "lifestyle", "jewelry"],
        icons: [
          {
            src: "https://res.cloudinary.com/dvjzleula/image/upload/v1760197264/faavicon_logo_kp_ntlobf.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "https://res.cloudinary.com/dvjzleula/image/upload/v1760197264/faavicon_logo_kp_ntlobf.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "https://res.cloudinary.com/dvjzleula/image/upload/v1760197264/faavicon_logo_kp_ntlobf.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          {
            name: "Shop Jewelry",
            short_name: "Shop",
            description: "Browse our jewelry collection",
            url: "/store",
            icons: [
              {
                src: "https://res.cloudinary.com/dvjzleula/image/upload/v1760197264/faavicon_logo_kp_ntlobf.png",
                sizes: "192x192",
              },
            ],
          },
          {
            name: "My Cart",
            short_name: "Cart",
            description: "View shopping cart",
            url: "/cart",
            icons: [
              {
                src: "https://res.cloudinary.com/dvjzleula/image/upload/v1760197264/faavicon_logo_kp_ntlobf.png",
                sizes: "192x192",
              },
            ],
          },
          {
            name: "My Profile",
            short_name: "Profile",
            description: "View your profile",
            url: "/profile",
            icons: [
              {
                src: "https://res.cloudinary.com/dvjzleula/image/upload/v1760197264/faavicon_logo_kp_ntlobf.png",
                sizes: "192x192",
              },
            ],
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://apiabhushankalakendra.vercel.app/",
        changeOrigin: true,
      },
    },
  },
});
