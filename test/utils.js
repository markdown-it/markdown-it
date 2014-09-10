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

function addSpecTests(fPath, markdown, skip) {
  var input,
      stat = fs.statSync(fPath);

  if (stat.isFile()) {
    input = fs.readFileSync(fPath, 'utf8');

    input = input.replace(/→/g, '\t');

    describe(fPath, function () {
      input.replace(/^\.\n([\s\S]*?)^\.\n([\s\S]*?)^\.$/gm, function(__, md, html, offset, orig) {
        var line = orig.slice(0, offset).split(/\r?\n/g).length;

        if (!skip) {
          it('line ' + line, function () {
            assert.strictEqual(html, markdown.render(md));
          });
        } else {
          it.skip('line ' + line, function () {
            assert.strictEqual(html, markdown.render(md));
          });
        }
      });
    });

    return;
  }

  if (stat.isDirectory()) {
    fs.readdirSync(fPath).forEach(function (name) {
      addSpecTests(path.join(fPath, name), markdown, skip);
    });
  }
}


module.exports.addTests = addTests;
module.exports.addSpecTests = addSpecTests;
