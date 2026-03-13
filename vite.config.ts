import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        // bootstrap package uses deprecated sass functions, unable to fix manually
        silenceDeprecations: ["if-function", "color-functions", "global-builtin", "import"],
      },
    },
  },
});
