// vite.config.ts 파일
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/",
  build: {
    target: "esnext",
    minify: "terser",
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: ["@headlessui/react", "@heroicons/react"],
        },
      },
    },
  },
  server: {
    host: true,
    port: 3001,
    strictPort: true,
    hmr: {
      overlay: false,
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});
