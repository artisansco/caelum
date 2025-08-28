import { sveltekit } from "@sveltejs/kit/vite";
import { extractorSvelte } from "@unocss/core";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    UnoCSS({
      extractors: [extractorSvelte],
    }),
    sveltekit(),
  ],
});
