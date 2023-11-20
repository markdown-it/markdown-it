#!/usr/bin/env node
/*eslint no-console:0*/

// Fixtures generator from commonmark specs. Split spec to working / not working
// examples, or show total stat.

import fs from 'node:fs';
import argparse from 'argparse';
import markdownit from '../index.mjs';


var cli = new argparse.ArgumentParser({
  add_help: true
});

cli.add_argument('type', {
  help: 'type of examples to filter',
  nargs: '?',
  choices: [ 'good', 'bad' ]
});

cli.add_argument('-s', '--spec', {
  help: 'spec file to read',
  default: new URL('../test/fixtures/commonmark/spec.txt', import.meta.url)
});

cli.add_argument('-o', '--output', {
  help: 'output file, stdout if not set',
  default: '-'
});

var options = cli.parse_args();

////////////////////////////////////////////////////////////////////////////////

function normalize(text) {
  return text.replace(/<blockquote>\n<\/blockquote>/g, '<blockquote></blockquote>');
}

////////////////////////////////////////////////////////////////////////////////

function readFile(filename, encoding, callback) {
  if (options.file === '-') {
    // read from stdin

    var chunks = [];

    process.stdin.on('data', function (chunk) {
      chunks.push(chunk);
    });

    process.stdin.on('end', function () {
      return callback(null, Buffer.concat(chunks).toString(encoding));
    });
  } else {
    fs.readFile(filename, encoding, callback);
  }
}


////////////////////////////////////////////////////////////////////////////////

readFile(options.spec, 'utf8', function (error, input) {
  var good = [], bad = [],
      markdown = markdownit('commonmark');

  if (error) {
    if (error.code === 'ENOENT') {
      process.stderr.write('File not found: ' + options.spec);
      process.exit(2);
    }

    process.stderr.write(error.stack || error.message || String(error));
    process.exit(1);
  }

  input = input.replace(/→/g, '\t');

  markdown.parse(input, {})
    .filter(function (token) {
      return token.tag === 'code' &&
              token.info.trim() === 'example';
    })
    .forEach(function (token) {
      var arr  = token.content.split(/^\.\s*?$/m, 2);
      var md   = arr[0];
      var html = arr[1].replace(/^\n/, '');

      var result = {
        md:   md,
        html: html,
        line: token.map[0],
        err:  ''
      };

      try {
        if (markdown.render(md) === normalize(html)) {
          good.push(result);
        } else {
          result.err = markdown.render(md);
          bad.push(result);
        }
      } catch (___) {
        // bad.push(result);
        throw ___;
      }
    });

  var out = [];

  if (!options.type) {
    out.push(`CM spec stat: passed samples - ${good.length}, failed samples - ${bad.length}`);
  } else {
    var data = options.type === 'good' ? good : bad;

    data.forEach(function (sample) {
      out.push(
        '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n' +
        `src line: ${sample.line}\n\n.\n${sample.md}.\n${sample.html}.\n`
      );
      if (sample.err) {
        out.push(`error:\n\n${sample.err}\n`);
      }
    });
  }

  if (options.output !== '-') fs.writeFileSync(options.output, out.join('\n'));
  else console.log(out.join('\n'));

  process.exit(0);
});
