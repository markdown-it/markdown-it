import { createRequire } from 'node:module'

const markdownit = createRequire(import.meta.url)('../../extra/lib/node_modules/markdown-it')

const md = markdownit('commonmark')

export function run (data) {
  return md.render(data)
}
