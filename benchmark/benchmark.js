#!/usr/bin/env node
/*eslint no-console:0*/

'use strict';

let path      = require('path');
let fs        = require('fs');
let util      = require('util');
let Benchmark = require('benchmark');
let ansi      = require('ansi');
let cursor    = ansi(process.stdout);

let IMPLS_DIRECTORY = path.join(__dirname, 'implementations');
let IMPLS_PATHS = {};
let IMPLS = [];


fs.readdirSync(IMPLS_DIRECTORY).sort().forEach(function (name) {
  let file = path.join(IMPLS_DIRECTORY, name);
  let code = require(file);

  IMPLS_PATHS[name] = file;
  IMPLS.push({
    name: name,
    code: code
  });
});


let SAMPLES_DIRECTORY = path.join(__dirname, 'samples');
let SAMPLES = [];

fs.readdirSync(SAMPLES_DIRECTORY).sort().forEach(function (sample) {
  let filepath = path.join(SAMPLES_DIRECTORY, sample),
      extname  = path.extname(filepath),
      basename = path.basename(filepath, extname);

  let content = {};

  content.string = fs.readFileSync(filepath, 'utf8');

  let title    = util.format('(%d bytes)', content.string.length);

  function onComplete() {
    cursor.write('\n');
  }


  let suite = new Benchmark.Suite(title, {

    onStart: function onStart() {
      console.log('\nSample: %s %s', sample, title);
    },

    onComplete: onComplete

  });


  IMPLS.forEach(function (impl) {
    suite.add(impl.name, {

      onCycle: function onCycle(event) {
        cursor.horizontalAbsolute();
        cursor.eraseLine();
        cursor.write(' > ' + event.target);
      },

      onComplete: onComplete,

      fn: function () {
        impl.code.run(content.string);
        return;
      }
    });
  });


  SAMPLES.push({
    name: basename,
    title: title,
    content: content,
    suite: suite
  });
});


function select(patterns) {
  let result = [];

  if (!(patterns instanceof Array)) {
    patterns = [ patterns ];
  }

  function checkName(name) {
    return patterns.length === 0 || patterns.some(function (regexp) {
      return regexp.test(name);
    });
  }

  SAMPLES.forEach(function (sample) {
    if (checkName(sample.name)) {
      result.push(sample);
    }
  });

  return result;
}


function run(files) {
  let selected = select(files);

  if (selected.length > 0) {
    console.log('Selected samples: (%d of %d)', selected.length, SAMPLES.length);
    selected.forEach(function (sample) {
      console.log(' > %s', sample.name);
    });
  } else {
    console.log('There isn\'t any sample matches any of these patterns: %s', util.inspect(files));
  }

  selected.forEach(function (sample) {
    sample.suite.run();
  });
}

module.exports.IMPLS_DIRECTORY   = IMPLS_DIRECTORY;
module.exports.IMPLS_PATHS       = IMPLS_PATHS;
module.exports.IMPLS             = IMPLS;
module.exports.SAMPLES_DIRECTORY = SAMPLES_DIRECTORY;
module.exports.SAMPLES           = SAMPLES;
module.exports.select            = select;
module.exports.run               = run;

run(process.argv.slice(2).map(function (source) {
  return new RegExp(source, 'i');
}));
