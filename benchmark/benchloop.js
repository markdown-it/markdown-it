
'use strict';

/* IMPORT */

var fs = require ('fs'),
    path = require ('path'),
    benchmark = require ('benchloop'),
    mit = require ('..');

/* HELPERS */

var SAMPLES_PATH = path.join (__dirname, 'samples');
var md = mit ('commonmark');

/* BENCHMARK */

benchmark.defaultOptions = Object.assign (benchmark.defaultOptions, {
  iterations: 50,
  log: 'compact'
});

fs.readdirSync (SAMPLES_PATH).forEach (function (sample) {

  var samplePath = path.join (SAMPLES_PATH, sample),
      content = fs.readFileSync (samplePath, 'utf-8');

  benchmark ({
    name: sample,
    fn: function () {
      md.render (content);
    }
  });

});

benchmark.summary ();
