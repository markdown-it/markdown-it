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

    if (['.md', '.markdown'].indexOf(ext) !== -1) {
      right = fixtures[base + '.html'];
      src = fixtures[name];

      if (!skip) {
        it(base, function () {
          assert.strictEqual(right, md.render(src));
        });
      } else {
        it.skip(base, function () {
          assert.strictEqual(right, md.render(src));
        });
      }
    }
  });
}


module.exports.addTests = addTests;