import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { createHtmlPlugin } from "vite-plugin-html";

const htmlConfig = {
  minify: false,
  entry: "demo-components/react/main.tsx",
  template: "/index.react.html",
  inject: {
    data: {
      title: "TurtlePanes - React",
      injectScript: `<script type="module" src="./main.tsx"></script>`,
    },
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), createHtmlPlugin(htmlConfig)]
});
