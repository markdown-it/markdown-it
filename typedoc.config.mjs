import { Converter } from 'typedoc'
import condensedThemePlugin from './support/typedoc_condensed_theme/condensed_theme_plugin.mjs'

// Places CHANGELOG.md in Documents without adding TypeDoc frontmatter to it.
function changelogPlugin (app) {
  app.converter.on(Converter.EVENT_CREATE_DOCUMENT, (_context, document) => {
    if (document.name !== 'CHANGELOG') return

    document.frontmatter.category = 'Documents'
  })
}

export default {
  entryPoints: ['src/index.ts'],

  projectDocuments: [
    'docs/usage.md',
    'docs/syntax_plugins.md',
    'docs/safety.md',
    'docs/architecture.md',
    'docs/development.md',
    'docs/benchmark.md',
    'docs/authors.md',
    'docs/references.md',
    'CHANGELOG.md'
  ],
  alwaysCreateEntryPointModule: false,

  plugin: [
    'typedoc-plugin-missing-exports',
    changelogPlugin,
    condensedThemePlugin
  ],
  theme: 'condensed',
  excludeExternals: true,
  excludeInternal: true,
  placeInternalsInOwningModule: true,

  out: 'apidoc',
  includeVersion: true,
  // `markdownLinkExternal` compares links against `hostedBaseUrl`,
  // and does nothing until that one is set.
  hostedBaseUrl: 'https://markdown-it.github.io/markdown-it/',
  markdownLinkExternal: true,
  sourceLinkExternal: true,
  sourceLinkTemplate: 'https://github.com/markdown-it/markdown-it/blob/{gitRevision:short}/{path}#L{line}',
  navigationLinks: {
    GitHub: 'https://github.com/markdown-it/markdown-it'
  },
  defaultCategory: 'Plugin API',
  categoryOrder: ['Main', 'Documents', 'Plugin API', '*'],
  sort: ['source-order'],
  navigation: {
    includeCategories: true
  }
}
