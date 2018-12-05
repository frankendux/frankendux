import typescript from 'rollup-plugin-typescript2';
import { terser } from "rollup-plugin-terser";

export default {
  input: './src/Store.ts',
  output: {
    file: './dist/Store.js',
    format: 'esm',
    sourcemap: true
  },
  plugins: [
    typescript(),
    terser({
        sourcemap: true
    })
  ]
}
