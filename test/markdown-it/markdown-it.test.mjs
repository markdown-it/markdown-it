import { fileURLToPath } from 'node:url'
import { describe } from 'node:test'
import { generateTests } from '../helpers.mjs'
import markdownit from '../../src/index.ts'

const fixtures = [
  'commonmark_extras.txt',
  'fatal.txt',
  'linkify.txt',
  'normalize.txt',
  'proto.txt',
  'smartquotes.txt',
  'strikethrough.txt',
  'tables.txt',
  'typographer.txt',
  'xss.txt'
]

describe('markdown-it', function () {
  const md = markdownit({
    html: true,
    langPrefix: '',
    typographer: true,
    linkify: true
  })

  fixtures.forEach(name => {
    generateTests(fileURLToPath(new URL(`../fixtures/markdown-it/${name}`, import.meta.url)), md)
  })
})
