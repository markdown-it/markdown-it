import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import pkg from '../package.json';
import { terser } from 'rollup-plugin-terser';

const unminifiedPlugins = [
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

const minifiedPlugins = [
  terser({
    format: {
      ascii_only: true,
    }
  })
];

export default {
  input: 'index.js',
  output: [
    {
      file: 'dist/markdown-it.js',
      format: 'umd',
      name: 'markdownit',
      plugins: unminifiedPlugins,
    },
    {
      file: 'dist/markdown-it.min.js',
      format: 'umd',
      name: 'markdownit',
      plugins: minifiedPlugins,
    },
    {
      file: 'dist/esm/markdown-it.mjs',
      format: 'es',
      name: 'markdownit',
      plugins: unminifiedPlugins,
    },
    {
      file: 'dist/esm/markdown-it.min.mjs',
      format: 'es',
      name: 'markdownit',
      plugins: minifiedPlugins,
    }
  ],
  plugins: [
    nodeResolve({ preferBuiltins: true }),
    commonjs(),
    json({ namedExports: false }),
    nodePolyfills(),
    {
      banner() {
        return `/*! ${pkg.name} ${pkg.version} https://github.com/${pkg.repository} @license ${pkg.license} */`;
      }
    }
  ]
};
