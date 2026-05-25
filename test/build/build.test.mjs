import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const md = require('../../')()

describe('CJS', () => {
  it('require', () => {
    assert.strictEqual(md.render('abc'), '<p>abc</p>\n')
  })

  it('export Token class', () => {
    const MarkdownIt = require('../../dist/index.cjs.js')

    assert.ok(MarkdownIt.Token)
    assert.strictEqual(typeof MarkdownIt.Token, 'function')
    assert.ok(new MarkdownIt.Token('test', '', 0) instanceof MarkdownIt.Token)
  })
})

describe('UMD', () => {
  it('export Token class for script tag bundle', () => {
    const umd = require('../../dist/markdown-it.js')
    const MarkdownIt = umd.default || umd

    assert.ok(MarkdownIt.Token)
    assert.strictEqual(typeof MarkdownIt.Token, 'function')
    assert.ok(new MarkdownIt.Token('test', '', 0) instanceof MarkdownIt.Token)
  })
})
