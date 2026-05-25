import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import markdownit from '../../index.mjs'

describe('reference labels', function () {
  it('stores normalized label on reference link and image tokens (#938)', function () {
    const md = markdownit()
    const src = '[a]: ijk\n\n[a]\n\n![a]'
    const tokens = md.parse(src, {})

    const linkOpen = tokens[1].children.find((token) => token.type === 'link_open')
    const image = tokens[4].children.find((token) => token.type === 'image')

    assert.deepEqual(linkOpen.meta, { label: 'A' })
    assert.deepEqual(image.meta, { label: 'A' })
  })

  it('does not store label on inline links and images', function () {
    const md = markdownit()
    const linkTokens = md.parse('[a](xyz)', {})
    const imageTokens = md.parse('![a](xyz)', {})

    assert.strictEqual(linkTokens[1].children[0].meta, null)
    assert.strictEqual(imageTokens[1].children[0].meta, null)
  })
})
