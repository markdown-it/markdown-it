import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import MarkdownIt from '../../index.mjs'

describe('list source maps', () => {
  it('should not include trailing blank lines in list item maps', () => {
    const md = new MarkdownIt()
    const tokens = md.parse('- aaa\n\nbbb\n', {})

    const listOpen = tokens.find(t => t.type === 'bullet_list_open')
    const itemOpen = tokens.find(t => t.type === 'list_item_open')
    const aaaParagraph = tokens.find(t => t.type === 'paragraph_open')

    assert.deepEqual(listOpen.map, [0, 1])
    assert.deepEqual(itemOpen.map, [0, 1])
    assert.deepEqual(aaaParagraph.map, [0, 1])
  })

  it('should trim multiple trailing blank lines from list maps', () => {
    const md = new MarkdownIt()
    const tokens = md.parse('- aaa\n\n\n\n\n\n\n\n\nbbb\n', {})

    const listOpen = tokens.find(t => t.type === 'bullet_list_open')
    const itemOpen = tokens.find(t => t.type === 'list_item_open')

    assert.deepEqual(listOpen.map, [0, 1])
    assert.deepEqual(itemOpen.map, [0, 1])
  })
})
