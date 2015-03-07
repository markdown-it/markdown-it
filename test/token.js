'use strict';

var assert = require('chai').assert;
var Token  = require('../lib/token');


describe('Token', function () {

  it('attr', function () {
    var t = new Token('test_token', 'tok', 1);

    assert.strictEqual(t.attrs, null);
    assert.equal(t.attrIndex('foo'), -1);

    t.attrPush([ 'foo', 'bar' ]);
    t.attrPush([ 'baz', 'bad' ]);

    assert.equal(t.attrIndex('foo'), 0);
    assert.equal(t.attrIndex('baz'), 1);
    assert.equal(t.attrIndex('none'), -1);
  });

});
