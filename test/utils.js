/*global describe, it*/
'use strict';


var fs = require('fs');
var path = require('path');
var assert = require('assert');


function addTests(dir, md, skip) {
  var files = fs.readdirSync(dir);
  var fixtures = {};

  files.forEach(function (name) {
    var filePath = path.join(dir, name);
    var stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      describe(name, function () {
        addTests(filePath, md, skip);
      });
      return;
    }

    if (stat.isFile()) {
      fixtures[name] = fs.readFileSync(path.join(dir, name), 'utf8');
    }
  });

  Object.keys(fixtures).forEach(function (name) {
    var src, right,
        ext = path.extname(name),
        base = path.basename(name, ext);

    if ([ '.md', '.markdown' ].indexOf(ext) !== -1) {
      src = fixtures[name];
      right = fixtures[base + '.html'];

      // if no .html pair found - that's doc file, skip it
      if (!right) { return; }

      if (!skip) {
        it(base, function () {
          assert.strictEqual(md.render(src), right);
        });
      } else {
        it.skip(base, function () {
          assert.strictEqual(md.render(src), right);
        });
      }
    }
  });
}


module.exports.addTests = addTests;
