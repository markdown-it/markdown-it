import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import markdownit from '../../src/index.ts'

describe('List source maps', function () {
  const md = markdownit()

  function token (tokens, type) {
    return tokens.find(t => t.type === type)
  }

  function tokensOf (src) {
    return md.parse(src, {})
  }

  it('should not include trailing blank lines after a bullet list (#374)', function () {
    const tokens = tokensOf('- aaa\n\n\nbbb\n')

    assert.deepEqual(token(tokens, 'bullet_list_open').map, [0, 1])
    assert.deepEqual(token(tokens, 'list_item_open').map, [0, 1])
    assert.deepEqual(token(tokens, 'paragraph_open').map, [0, 1])
  })

  it('should trim many trailing blank lines from list maps', function () {
    const tokens = tokensOf('- aaa\n\n\n\n\n\n\n\n\nbbb\n')

    assert.deepEqual(token(tokens, 'bullet_list_open').map, [0, 1])
    assert.deepEqual(token(tokens, 'list_item_open').map, [0, 1])
  })

  it('should not include trailing blank lines after an ordered list', function () {
    const tokens = tokensOf('1. aaa\n\n\nbbb\n')

    assert.deepEqual(token(tokens, 'ordered_list_open').map, [0, 1])
    assert.deepEqual(token(tokens, 'list_item_open').map, [0, 1])
  })

  it('should keep maps for tight lists without extra blanks', function () {
    const tokens = tokensOf('- aaa\n- bbb\n')
    const items = tokens.filter(t => t.type === 'list_item_open')

    assert.deepEqual(token(tokens, 'bullet_list_open').map, [0, 2])
    assert.deepEqual(items[0].map, [0, 1])
    assert.deepEqual(items[1].map, [1, 2])
  })

  it('should exclude blanks after the last item of a multi-item list', function () {
    const tokens = tokensOf('- foo\n\n- bar\n\n\nbaz\n')
    const items = tokens.filter(t => t.type === 'list_item_open')

    assert.deepEqual(token(tokens, 'bullet_list_open').map, [0, 3])
    assert.deepEqual(items[0].map, [0, 1])
    assert.deepEqual(items[1].map, [2, 3])
  })

  it('should keep blank lines between paragraphs inside a loose item', function () {
    const tokens = tokensOf('- foo\n\n  bar\n\n\nbaz\n')

    assert.deepEqual(token(tokens, 'bullet_list_open').map, [0, 3])
    assert.deepEqual(token(tokens, 'list_item_open').map, [0, 3])
  })

  it('should not include trailing blanks on nested lists', function () {
    const tokens = tokensOf('- foo\n  - aaa\n\n- bar\n')
    const lists = tokens.filter(t => t.type === 'bullet_list_open')
    const items = tokens.filter(t => t.type === 'list_item_open')

    assert.deepEqual(lists[0].map, [0, 4])
    assert.deepEqual(lists[1].map, [1, 2])
    assert.deepEqual(items[1].map, [1, 2])
  })

  it('should not change rendered HTML', function () {
    // Trailing blanks after a list must not loosen it or change markup.
    assert.strictEqual(
      md.render('- aaa\n\n\nbbb\n'),
      '<ul>\n<li>aaa</li>\n</ul>\n<p>bbb</p>\n'
    )
    assert.strictEqual(
      md.render('- foo\n\n  bar\n'),
      '<ul>\n<li>\n<p>foo</p>\n<p>bar</p>\n</li>\n</ul>\n'
    )
  })
})
