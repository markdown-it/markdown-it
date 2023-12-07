import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'

const plugins = [
  nodeResolve({ preferBuiltins: true }),
  commonjs(),
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

export default [
  {
    input: 'index.mjs',
    output: {
      file: 'demo/markdown-it.js',
      format: 'umd',
      name: 'markdownit'
    },
    plugins
  },
  {
    input: 'support/demo_template/index.mjs',
    output: {
      file: 'demo/index.js',
      format: 'iife',
      name: 'demo'
    },
    plugins
  }
]
