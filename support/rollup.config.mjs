import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import { babel } from '@rollup/plugin-babel'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)))

const config_umd_full = {
  input: 'index.mjs',
  output: [
    {
      file: `dist/${pkg.name}.js`,
      format: 'umd',
      name: 'markdownit',
      plugins: [
        // Here terser is used only to force ascii output
        terser({
          mangle: false,
          compress: false,
          format: { comments: 'all', beautify: true, ascii_only: true, indent_level: 2 }
        })
      ]
    },
    {
      file: `dist/${pkg.name}.min.js`,
      format: 'umd',
      name: 'markdownit',
      plugins: [
        terser({
          format: { ascii_only: true }
        })
      ]
    }
  ],
  plugins: [
    resolve(),
    babel({ babelHelpers: 'bundled' }),
    {
      banner () {
        return `/*! ${pkg.name} ${pkg.version} https://github.com/${pkg.repository} @license ${pkg.license} */`
      }
    }
  ]
}

const config_cjs_no_deps = {
  input: 'index.mjs',
  output: {
    file: 'dist/index.cjs.js',
    format: 'cjs'
  },
  external: Object.keys(pkg.dependencies),
  plugins: [
    resolve(),
    babel({ babelHelpers: 'bundled' })
  ]
}

let config = [
  config_umd_full,
  config_cjs_no_deps
]

if (process.env.CJS_ONLY) config = [config_cjs_no_deps]

export default config
