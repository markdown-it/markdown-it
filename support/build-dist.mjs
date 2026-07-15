import { rm } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { build } from 'vite'

const require = createRequire(import.meta.url)
const pkg = require('../package.json')

const banner = `/*! ${pkg.name} ${pkg.version} https://github.com/${pkg.repository} @license ${pkg.license} */`
const external = Object.keys(pkg.dependencies ?? {})

const common = {
  configFile: false,
  logLevel: 'info',
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: true,
    target: 'es2015'
  }
}

await rm('dist', { recursive: true, force: true })

await build({
  ...common,
  build: {
    ...common.build,
    minify: 'terser',
    terserOptions: {
      mangle: false,
      compress: false,
      format: {
        ascii_only: true,
        beautify: true,
        comments: 'all',
        indent_level: 2
      }
    },
    lib: {
      entry: 'src/index.mjs',
      name: 'markdownit',
      formats: ['umd'],
      fileName: () => 'markdown-it.js'
    },
    rollupOptions: {
      external: [],
      output: {
        banner
      }
    }
  }
})

await build({
  ...common,
  build: {
    ...common.build,
    minify: 'terser',
    terserOptions: {
      format: {
        ascii_only: true
      }
    },
    lib: {
      entry: 'src/index.mjs',
      name: 'markdownit',
      formats: ['umd'],
      fileName: () => 'markdown-it.min.js'
    },
    rollupOptions: {
      external: [],
      output: {
        banner
      }
    }
  }
})

await build({
  ...common,
  build: {
    ...common.build,
    minify: false,
    lib: {
      entry: 'src/index.mjs',
      formats: ['cjs'],
      fileName: () => 'index.cjs.js'
    },
    rollupOptions: {
      external,
      output: {
        exports: 'default'
      }
    }
  }
})
