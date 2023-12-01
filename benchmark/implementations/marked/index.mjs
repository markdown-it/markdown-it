import { createRequire } from 'node:module'

const marked = createRequire(import.meta.url)('../../extra/lib/node_modules/marked')

export function run (data) {
  return marked(data)
}
