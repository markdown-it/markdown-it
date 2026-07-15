import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import Token from '../../src/token.mjs'

describe('Token', function () {
  it('attr', function () {
    const t = new Token('test_token', 'tok', 1)

    assert.strictEqual(t.attrs, null)
    assert.equal(t.attrIndex('foo'), -1)

    t.attrPush(['foo', 'bar'])
    t.attrPush(['baz', 'bad'])

    assert.equal(t.attrIndex('foo'), 0)
    assert.equal(t.attrIndex('baz'), 1)
    assert.equal(t.attrIndex('none'), -1)
  })
})
