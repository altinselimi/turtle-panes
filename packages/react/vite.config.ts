import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react';

export default defineConfig({
  build: {
    lib: {
      entry: './src/Panes.tsx',
      formats: ['es'],
      fileName: 'index'
    },
    outDir: 'dist',
    minify: 'esbuild',
    cssMinify: 'esbuild',
    rollupOptions: {
      external: ['react', 'react-dom', '@turtle-panes/core'],
      output: {
        preserveModules: false,
        assetFileNames: 'index.[ext]', // This will output CSS as index.css
        entryFileNames: 'index.js'
      }
    },
    cssCodeSplit: false // Bundle all CSS into a single file
  },
  plugins: [
    react(),
    dts({
      entryRoot: './src',
      tsconfigPath: './tsconfig.json',
      rollupTypes: true
    })
  ]
});