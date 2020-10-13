import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import { terser } from 'rollup-plugin-terser';

const plugins = [
  nodeResolve({ preferBuiltins: true }),
  commonjs(),
  json({ namedExports: false }),
  nodePolyfills(),
  // Here terser is used only to force ascii output
  terser({
    mangle: false,
    compress: false,
    format: {
      comments: 'all',
      beautify: true,
      ascii_only: true,
      indent_level: 2
    }
  })
];

export default [
  {
    input: 'index.js',
    output: {
      file: 'demo/markdown-it.js',
      format: 'umd',
      name: 'markdownit'
    },
    plugins: plugins
  },
  {
    input: 'support/demo_template/index.js',
    output: {
      file: 'demo/index.js',
      format: 'iife',
      name: 'demo'
    },
    plugins: plugins
  }
];
