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
    'docs/references.md'
  ],
  alwaysCreateEntryPointModule: false,

  plugin: [
    'typedoc-plugin-missing-exports',

    'typedoc-theme-oxide',
    './support/typedoc-oxide-fixes.mjs'
  ],
  theme: 'oxide',
  customCss: './support/typedoc-custom.css',
  excludeExternals: true,
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
