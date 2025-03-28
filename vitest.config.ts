import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests.ts",
    coverage: {
      include: ['src/**/*.ts']
    }
  },
});
