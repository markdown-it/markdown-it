/*global describe, it*/
'use strict';


var assert     = require('assert');
var Remarkable = require('../');


describe('Misc', function () {

  it('Should correctly parse strings without tailing \\n', function () {
    var md = new Remarkable();

    assert.strictEqual(md.render('123'), '<p>123</p>\n');
    assert.strictEqual(md.render('123\n'), '<p>123</p>\n');
  });
});
