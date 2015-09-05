#!/usr/bin/env node

var path = require('path');
var fs = require('fs');
var main = require('../');

// ---

var argv = require('yargs')
  .array('pattern')
  .alias('p', 'pattern')
  .alias('d', 'dest')
  .alias('f', 'outputFormat')
  .default('dest', 'illustrator.js')
  .check(function patternValidator(argv) {
    if (!argv.pattern.length) {
      throw new Error('Please define at least one pattern for processing.');
    }
    return true;
  })
  .argv
;

// ---

(function genManifest() {
  argv.dest = path.resolve(argv.dest);

  main.illustrate(argv.pattern, argv)
    .then(fs.writeFileSync.bind(fs, argv.dest))
  ;
})();
