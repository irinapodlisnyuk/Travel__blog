import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["import"],
        additionalData: `@use "@/assets/styles/global/_variables.scss" as *;
         @use "@/assets/styles/global/_mixins.scss" as *;
         @use "@/assets/styles/global/_btn.scss" as *;`,
      },
    },
  },
  plugins: [react()],
  build: {
    cssMinify: "esbuild", 
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; 
          }
        },
      },
    },
  },
  base: "/Travel__blog/",
  server: {
    proxy: {
      "/api": {
        target: "https://travelblog.skillbox.cc",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    css: true,
  },
});
