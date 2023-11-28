import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)))

export default {
  input: 'index.mjs',
  output: [
    {
      file: 'dist/markdown-it.js',
      format: 'umd',
      name: 'markdownit',
      plugins: [
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
      ]
    },
    {
      file: 'dist/markdown-it.min.js',
      format: 'umd',
      name: 'markdownit',
      plugins: [
        terser({
          format: {
            ascii_only: true
          }
        })
      ]
    }
  ],
  plugins: [
    nodeResolve({ preferBuiltins: true }),
    commonjs(),
    {
      banner () {
        return `/*! ${pkg.name} ${pkg.version} https://github.com/${pkg.repository} @license ${pkg.license} */`
      }
    }
  ]
}
