import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

const marked = require('../../extra/lib/node_modules/marked')

export function run (data) {
  return marked(data)
}
