import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';

export default {
  input: 'index.js',
  output: {
    file: 'dist/markdown-it.mjs',
    format: 'esm'
  },
  plugins: [
    json(),
    nodeResolve({
      preferBuiltins: false
    }),
    commonjs()
  ]
};
