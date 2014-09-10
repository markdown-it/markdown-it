#!/usr/bin/env node
/*eslint no-console:0*/

'use strict';


var fs = require('fs');
var argparse = require('argparse');

var Remarkable = require('..');

////////////////////////////////////////////////////////////////////////////////

var cli = new argparse.ArgumentParser({
  prog: 'remarkable',
  version: require('../package.json').version,
  addHelp: true
});

cli.addArgument([ 'file' ], {
  help: 'File to read',
  nargs: '?',
  defaultValue: '-'
});

cli.addArgument([ '-t', '--trace' ], {
  help:   'Show stack trace on error',
  action: 'storeTrue'
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

readFile(options.file, 'utf8', function (error, input) {
  var output, md;

  if (error) {
    if (error.code === 'ENOENT') {
      console.error('File not found: ' + options.file);
      process.exit(2);
    }

    console.error(
      options.trace && error.stack ||
      error.message ||
      String(error));

    process.exit(1);
  }

  md = new Remarkable();

  try {
    output = md.render(input);

  } catch (error) {
    console.error(
      options.trace && error.stack ||
      error.message ||
      String(error));

    process.exit(1);
  }

  process.stdout.write(output);

  process.exit(0);
});
