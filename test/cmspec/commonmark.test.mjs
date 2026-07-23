import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import markdownit from '../../src/index.ts'

function normalize (text) {
  return text.replace(/<blockquote>\n<\/blockquote>/g, '<blockquote></blockquote>')
}

function loadSpecExamples (path, md) {
  const input = readFileSync(path, 'utf8').replace(/→/g, '\t')
  const examples = []

  md.parse(input, {})
    .filter(function (token) {
      return token.tag === 'code' && token.info.trim() === 'example'
    })
    .forEach(function (token) {
      const arr = token.content.split(/^\.\s*?$/m, 2)

      examples.push({
        md: arr[0],
        html: arr[1].replace(/^\n/, ''),
        line: token.map[0]
      })
    })

  return examples
}

function generate (path, md) {
  describe('spec.txt', function () {
    loadSpecExamples(path, md).forEach(function (fixture) {
      it(`line ${fixture.line}`, function () {
        assert.strictEqual(md.render(fixture.md), normalize(fixture.html))
      })
    })
  })
}

describe('CommonMark', function () {
  const md = markdownit('commonmark')

  generate(new URL('../fixtures/commonmark/spec.txt', import.meta.url), md)
})
