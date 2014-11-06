/*global describe, it*/
'use strict';


var assert     = require('assert');
var Remarkable = require('../');


describe('Utils', function () {

  it('utils.fromCodePoint', function () {
    var fromCodePoint = require('../lib/common/utils').fromCodePoint;

    assert.strictEqual(fromCodePoint(0x20), ' ');
    assert.strictEqual(fromCodePoint(0x1F601), '😁');
  });

  it('utils.isValidEntityCode', function () {
    var isValidEntityCode = require('../lib/common/utils').isValidEntityCode;

    assert.strictEqual(isValidEntityCode(0x20), true);
    assert.strictEqual(isValidEntityCode(0xD800), false);
    assert.strictEqual(isValidEntityCode(0xFDD0), false);
    assert.strictEqual(isValidEntityCode(0x1FFFF), false);
    assert.strictEqual(isValidEntityCode(0x1FFFE), false);
    assert.strictEqual(isValidEntityCode(0x00), false);
    assert.strictEqual(isValidEntityCode(0x0B), false);
    assert.strictEqual(isValidEntityCode(0x0E), false);
    assert.strictEqual(isValidEntityCode(0x7F), false);
  });

  it('utils.assign', function () {
    var assign = require('../lib/common/utils').assign;

    assert.deepEqual(assign({ a: 1 }, null, { b: 2 }), { a: 1, b: 2 });
    assert.throws(function () {
      assign({}, 123);
    });
  });

});


describe('API', function () {

  it('Constructor', function () {
    assert.throws(function () {
      var md = new Remarkable('bad preset');
      md.render('123');
    });
  });

  it('Plugin', function () {
    var succeeded = false;

    function plugin(self, opts) { if (opts === 'bar') { succeeded = true; } }

    var md = new Remarkable();

    md.use(plugin, 'foo');
    assert.strictEqual(succeeded, false);
    md.use(plugin, 'bar');
    assert.strictEqual(succeeded, true);
  });

});


describe('Misc', function () {

  it('Should correctly parse strings without tailing \\n', function () {
    var md = new Remarkable();

    assert.strictEqual(md.render('123'), '<p>123</p>\n');
    assert.strictEqual(md.render('123\n'), '<p>123</p>\n');
  });

});


describe('Links validation', function () {

  it('Override validator, disable everything', function () {
    var md = new Remarkable({ linkify: true });

    md.inline.validateLink = function () { return false; };

    assert.strictEqual(md.render('foo@example.com'), '<p>foo@example.com</p>\n');
    assert.strictEqual(md.render('http://example.com'), '<p>http://example.com</p>\n');
    assert.strictEqual(md.render('<foo@example.com>'), '<p>&lt;foo@example.com&gt;</p>\n');
    assert.strictEqual(md.render('<http://example.com>'), '<p>&lt;http://example.com&gt;</p>\n');
    assert.strictEqual(md.render('[test](http://example.com)'), '<p>[test](http://example.com)</p>\n');
  });

});
