import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import filesize from 'rollup-plugin-filesize';

const config = [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'es',
      sourcemap: true,
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['**/*.test.ts', '**/*.spec.ts'],
        declaration: false, // Prevent TS from generating .d.ts files
        declarationDir: null,
      }),
      terser({
        format: {
          comments: false,
        },
        compress: {
          dead_code: true,
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log'],
        },
      }),
      filesize({
        showMinifiedSize: true,
        showGzippedSize: true,
        showBrotliSize: true,
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [
      dts({
        respectExternal: true,
        compilerOptions: {
          preserveSymlinks: false,
        },
      }),
    ],
  },
];

export default config;
