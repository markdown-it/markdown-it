/*global describe, it*/
'use strict';


var fs = require('fs');
var path = require('path');
var assert = require('assert');


function addTests(dir, md) {
  var files = fs.readdirSync(dir);

  files.forEach(function (name) {
    var filePath = path.join(dir, name);
    var stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      describe(name, function () {
        addTests(filePath, md);
      });
      return;
    }

    if (stat.isFile) {
      if (path.extname(filePath) !== '.md') { return; }

      var mustBe = fs.readFileSync(path.join(dir, path.basename(name, '.md') + '.html'), 'utf8');
      var src = fs.readFileSync(filePath, 'utf8');

      it(name, function () {
        assert.strictEqual(mustBe, md.render(src));
      });
    }
  });
}


module.exports.addTests = addTests;