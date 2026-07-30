import { readFile, rm, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { rolldown } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'
import ts from 'typescript'
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
      entry: 'src/index.ts',
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
      entry: 'src/index.ts',
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
      entry: 'src/index.ts',
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
      entry: 'src/index.ts',
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

// ESM types, bundled into a single .d.mts
const dtsBundle = await rolldown({
  input: 'src/index.ts',
  external: Object.keys(pkg.dependencies),
  checks: { pluginTimings: false },
  plugins: dts({
    emitDtsOnly: true,
    generator: 'tsc'
  })
})

try {
  await dtsBundle.write({
    dir: 'dist',
    format: 'es',
    codeSplitting: false,
    entryFileNames: chunk => chunk.name.endsWith('.d')
      ? 'markdown-it.d.mts'
      : 'types-empty.js'
  })
} finally {
  await dtsBundle.close()
}

// CJS types: a wrapper with `export =`, to match `module.exports = MarkdownIt`.
// Named exports are not allowed next to `export =`, so exported types are moved
// into a namespace with the same name, merged into the exported value.
const dtsSource = ts.createSourceFile(
  'markdown-it.d.mts',
  await readFile('dist/markdown-it.d.mts', 'utf8'),
  ts.ScriptTarget.Latest,
  true
)

const typeParams = new Map()

for (const node of dtsSource.statements) {
  if (ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) {
    typeParams.set(node.name.text, node.typeParameters ?? [])
  }
}

const specifiers = dtsSource.statements
  .filter(node => ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause))
  .flatMap(node => [...node.exportClause.elements])

const members = []
let hasDefault = false

for (const spec of specifiers) {
  const exported = spec.name.text
  const local = (spec.propertyName ?? spec.name).text

  if (exported === 'default') {
    hasDefault = true
    continue
  }

  if (!spec.isTypeOnly) {
    throw new Error(`Value export "${exported}" can not be re-exposed in CJS declarations`)
  }

  // Generic types must be re-declared with their parameters
  const params = typeParams.get(local) ?? []
  const declared = params.length ? `<${params.map(p => p.getText()).join(', ')}>` : ''
  const used = params.length ? `<${params.map(p => p.name.text).join(', ')}>` : ''

  members.push(`  type ${exported}${declared} = import('./markdown-it.mjs').${exported}${used}`)
}

if (!hasDefault) throw new Error('No default export found in generated declarations')

await writeFile('dist/markdown-it.d.cts', [
  'declare namespace MarkdownIt {',
  ...members,
  '}',
  "declare const MarkdownIt: typeof import('./markdown-it.mjs').default",
  'export = MarkdownIt',
  ''
].join('\n'))
