import { rm } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { build } from 'vite'

const require = createRequire(import.meta.url)
const pkg = require('../package.json')

const banner = `/*! ${pkg.name} ${pkg.version} https://github.com/${pkg.repository} @license ${pkg.license} */`

const common = {
  configFile: false,
  logLevel: 'info',
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: true
  }
}

await rm('dist', { recursive: true, force: true })

await build({
  ...common,
  build: {
    ...common.build,
    target: 'es2015',
    minify: false,
    lib: {
      entry: 'src/index.mjs',
      formats: ['cjs'],
      fileName: () => 'markdown-it.cjs.js'
    },
    rolldownOptions: {
      // Bundle entities into CJS because newer versions no longer provide CJS exports.
      external: Object.keys(pkg.dependencies).filter(name => name !== 'entities'),
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
    target: 'es2018',
    minify: false,
    lib: {
      entry: 'src/index.mjs',
      formats: ['es'],
      fileName: () => 'markdown-it.mjs'
    },
    rolldownOptions: {
      external: Object.keys(pkg.dependencies),
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
    target: 'es2015',
    outDir: 'dist/browser',
    minify: true,
    lib: {
      entry: 'src/index.mjs',
      name: 'markdownit',
      formats: ['umd'],
      fileName: () => 'markdown-it.umd.min.js'
    },
    rolldownOptions: {
      external: [],
      output: {
        banner,
        name: 'markdownit'
      }
    }
  }
})

await build({
  ...common,
  build: {
    ...common.build,
    target: 'es2018',
    outDir: 'dist/browser',
    minify: true,
    lib: {
      entry: 'src/index.mjs',
      formats: ['es'],
      fileName: () => 'markdown-it.esm.min.mjs'
    },
    rolldownOptions: {
      external: [],
      output: {
        banner
      }
    }
  }
})
