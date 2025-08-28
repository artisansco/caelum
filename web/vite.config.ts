import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { extractorSvelte } from "@unocss/core";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    UnoCSS({ extractors: [extractorSvelte] }),
    sveltekit()
  ]
});
