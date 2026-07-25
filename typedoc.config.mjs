export default {
  entryPoints: ['src/index.ts'],

  projectDocuments: [
    'docs/architecture.md',
    'docs/development.md'
  ],
  alwaysCreateEntryPointModule: false,

  plugin: [
    'typedoc-plugin-missing-exports',

    'typedoc-theme-oxide',
    './support/typedoc-oxide-fixes.mjs'
  ],
  theme: 'oxide',
  excludeExternals: true,
  placeInternalsInOwningModule: true,

  out: 'apidoc',
  includeVersion: true,
  markdownLinkExternal: true,
  sourceLinkExternal: true,
  sourceLinkTemplate: 'https://github.com/markdown-it/markdown-it/blob/{gitRevision:short}/{path}#L{line}',
  navigationLinks: {
    GitHub: 'https://github.com/markdown-it/markdown-it'
  },
  defaultCategory: 'Plugin API',
  categoryOrder: ['Main', 'Plugin API', 'Documents', '*'],
  sort: ['source-order'],
  navigation: {
    includeCategories: true
  }
}
