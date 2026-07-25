import neostandard from 'neostandard'

export default [
  ...neostandard({
    env: ['browser', 'node'],
    ignores: [
      'apidoc/**',
      'benchmark/extra/**',
      'demo/**',
      'dist/**'
    ]
  }),

  {
    rules: {
      camelcase: 'off'
    }
  }
]
