#!/usr/bin/env node
/*eslint no-console:0*/

'use strict';


var fs = require('fs');
var argparse = require('argparse');


////////////////////////////////////////////////////////////////////////////////

var cli = new argparse.ArgumentParser({
  prog: 'markdown-it.js',
  version: require('../package.json').version,
  addHelp: true
});

cli.addArgument([ 'file' ], {
  help: 'File to read',
  nargs: '?',
  defaultValue: '-'
});

var options = cli.parseArgs();


function readFile(filename, encoding, callback) {
  if (options.file === '-') {
    // read from stdin

    var chunks = [];

    process.stdin.on('data', function(chunk) {
      chunks.push(chunk);
    });

    process.stdin.on('end', function() {
      return callback(null, Buffer.concat(chunks).toString(encoding));
    });
  } else {
    fs.readFile(filename, encoding, callback);
  }
}


////////////////////////////////////////////////////////////////////////////////

readFile(options.file, 'utf8', function (err, input) {
  var output, md;

  if (err) {
    if (err.code === 'ENOENT') {
      console.error('File not found: ' + options.file);
      process.exit(2);
    }

    console.error(err.stack || err.message || String(err));

    process.exit(1);
  }

  md = require('..')({
    html: true,
    xhtmlOut: true,
    typographer: true,
    linkify: true
  });

  try {
    output = md.render(input);

  } catch (e) {
    console.error(e.stack || e.message || String(e));

    process.exit(1);
  }

  process.stdout.write(output);

  process.exit(0);
});
