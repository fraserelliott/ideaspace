import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base: "./",
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve("src"),
        "@contexts": path.resolve("src/contexts"),
        "@components": path.resolve("src/components"),
        "@util": path.resolve("src/util"),
        "@styles": path.resolve("src/styles"),
        "@pages": path.resolve("src/pages"),
        "@assets": path.resolve("src/assets"),
      },
    },
  };
});
