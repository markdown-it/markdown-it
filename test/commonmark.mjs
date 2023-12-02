import { fileURLToPath } from 'node:url'
import { relative } from 'node:path'
import { load } from 'markdown-it-testgen'
import markdownit from '../index.mjs'
import { assert } from 'chai'

function normalize (text) {
  return text.replace(/<blockquote>\n<\/blockquote>/g, '<blockquote></blockquote>')
}

function generate (path, md) {
  load(path, function (data) {
    data.meta = data.meta || {}

    const desc = data.meta.desc || relative(path, data.file);

    (data.meta.skip ? describe.skip : describe)(desc, function () {
      data.fixtures.forEach(function (fixture) {
        it(fixture.header ? fixture.header : 'line ' + (fixture.first.range[0] - 1), function () {
          assert.strictEqual(md.render(fixture.first.text), normalize(fixture.second.text))
        })
      })
    })
  })
}

describe('CommonMark', function () {
  const md = markdownit('commonmark')

  generate(fileURLToPath(new URL('fixtures/commonmark/good.txt', import.meta.url)), md)
})
