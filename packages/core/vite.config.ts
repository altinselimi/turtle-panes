import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
      fileName: 'index'
    },
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        // This ensures clean output structure
        entryFileNames: 'index.js'
      }
    },
    sourcemap: true // Helpful for debugging
  },
  plugins: [
    dts({
      entryRoot: './src',
      tsconfigPath: './tsconfig.json',
      insertTypesEntry: true,
      copyDtsFiles: true,
      bundledPackages: [],
      include: ['src/**/*'],
      exclude: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
      // Ensure types are bundled into a single .d.ts file
      rollupTypes: true
    })
  ]
});