import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: 'index'
    },
    outDir: 'dist',
    minify: 'esbuild',
    cssMinify: 'esbuild',
    rollupOptions: {
      external: ['vue', '@turtle-panes/core'],
      output: {
        preserveModules: false,
        assetFileNames: 'index.[ext]',
        entryFileNames: 'index.js',
        globals: {
          vue: 'Vue'
        }
      }
    },
    cssCodeSplit: false
  },
  plugins: [
    vue(),
    dts({
      entryRoot: './src',
      tsconfigPath: './tsconfig.json',
      rollupTypes: true
    })
  ]
});