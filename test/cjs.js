'use strict'

const assert = require('assert')
const md = require('../')()

describe('CJS', () => {
  it('require', () => {
    assert.strictEqual(md.render('abc'), '<p>abc</p>\n')
  })
})
