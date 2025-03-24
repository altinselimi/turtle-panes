import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: {
        'index': './src/index.ts',
        'state/context': './src/state/context.ts',
        'state/contextHelpers': './src/state/contextHelpers.ts',
        'helpers/interactionHelpers': './src/helpers/interactionHelpers.ts',
        'helpers/useLogs': './src/helpers/useLogs.ts',
        'constants': './src/constants/index.ts',
        'types': './src/types/index.ts'
      },
      formats: ['es']
    },
    minify: 'esbuild',
    rollupOptions: {
      output: {
        preserveModules: true,
        entryFileNames: '[name].js'
      }
    }
  },
  plugins: [
    dts({
      entryRoot: './src',
      tsconfigPath: './tsconfig.json',
      insertTypesEntry: true,
      copyDtsFiles: true,
      bundledPackages: [],
      include: ['src/**/*'],
      exclude: ['src/**/*.spec.ts', 'src/**/*.test.ts']
    })
  ]
});