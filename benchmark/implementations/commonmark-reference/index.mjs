import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

const commonmark = require('../../extra/lib/node_modules/commonmark')

const parser = new commonmark.Parser()
const renderer = new commonmark.HtmlRenderer()

export function run(data) {
  return renderer.render(parser.parse(data))
}
