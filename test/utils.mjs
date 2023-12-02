import { assert } from 'chai'
import * as utils from '../lib/common/utils.mjs'

describe('Utils', function () {
  it('fromCodePoint', function () {
    const fromCodePoint = utils.fromCodePoint

    assert.strictEqual(fromCodePoint(0x20), ' ')
    assert.strictEqual(fromCodePoint(0x1F601), '😁')
  })

  it('isValidEntityCode', function () {
    const isValidEntityCode = utils.isValidEntityCode

    assert.strictEqual(isValidEntityCode(0x20), true)
    assert.strictEqual(isValidEntityCode(0xD800), false)
    assert.strictEqual(isValidEntityCode(0xFDD0), false)
    assert.strictEqual(isValidEntityCode(0x1FFFF), false)
    assert.strictEqual(isValidEntityCode(0x1FFFE), false)
    assert.strictEqual(isValidEntityCode(0x00), false)
    assert.strictEqual(isValidEntityCode(0x0B), false)
    assert.strictEqual(isValidEntityCode(0x0E), false)
    assert.strictEqual(isValidEntityCode(0x7F), false)
  })

  /* it('replaceEntities', function () {
    var replaceEntities = utils.replaceEntities;

    assert.strictEqual(replaceEntities('&amp;'), '&');
    assert.strictEqual(replaceEntities('&#32;'), ' ');
    assert.strictEqual(replaceEntities('&#x20;'), ' ');
    assert.strictEqual(replaceEntities('&amp;&amp;'), '&&');

    assert.strictEqual(replaceEntities('&am;'), '&am;');
    assert.strictEqual(replaceEntities('&#00;'), '&#00;');
  }); */

  it('assign', function () {
    const assign = utils.assign

    assert.deepEqual(assign({ a: 1 }, null, { b: 2 }), { a: 1, b: 2 })
    assert.throws(function () {
      assign({}, 123)
    })
  })

  it('escapeRE', function () {
    const escapeRE = utils.escapeRE

    assert.strictEqual(escapeRE(' .?*+^$[]\\(){}|-'), ' \\.\\?\\*\\+\\^\\$\\[\\]\\\\\\(\\)\\{\\}\\|\\-')
  })

  it('isWhiteSpace', function () {
    const isWhiteSpace = utils.isWhiteSpace

    assert.strictEqual(isWhiteSpace(0x2000), true)
    assert.strictEqual(isWhiteSpace(0x09), true)

    assert.strictEqual(isWhiteSpace(0x30), false)
  })

  it('isMdAsciiPunct', function () {
    const isMdAsciiPunct = utils.isMdAsciiPunct

    assert.strictEqual(isMdAsciiPunct(0x30), false)

    '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'.split('').forEach(function (ch) {
      assert.strictEqual(isMdAsciiPunct(ch.charCodeAt(0)), true)
    })
  })

  it('unescapeMd', function () {
    const unescapeMd = utils.unescapeMd

    assert.strictEqual(unescapeMd('\\foo'), '\\foo')
    assert.strictEqual(unescapeMd('foo'), 'foo')

    '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'.split('').forEach(function (ch) {
      assert.strictEqual(unescapeMd('\\' + ch), ch)
    })
  })
})
