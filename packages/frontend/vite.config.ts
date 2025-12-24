import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import devtools from "solid-devtools/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [devtools(), solidPlugin(), tsconfigPaths(), tailwindcss()],
  server: {
    port: 3001,
  },
  build: {
    target: "esnext",
  },
  clearScreen: false,
});
