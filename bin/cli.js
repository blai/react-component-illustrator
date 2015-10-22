#!/usr/bin/env node

var main = require('../lib');

// ---

var argv = require('yargs')
  .array('pattern')
  .alias('p', 'pattern')
  .alias('d', 'dest')
  .alias('f', 'outputFormat')
  .alias('v', 'verbose')
  .default('f', 'commonjs')
  .check(function patternValidator(argv) {
    if (!argv.pattern.length) {
      throw new Error('Please define at least one pattern for processing.');
    }
    return true;
  })
  .argv
;

// ---

main.illustrate(argv.pattern, argv)
  .catch(function (error) {
    console.error(error, error.stack);
  })
;
