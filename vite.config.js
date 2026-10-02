import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: { standard: "index.html", studio: "studio.html" },
    },
  },
});
