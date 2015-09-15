import path from 'path';

import globby from 'globby';
import Illustrator from './illustrator';
import {generateManifest, aggregate} from './util';

// ---

export function illustrate(patterns, options) {
  options = parseAndValidateOptions(options);

  let components = globby(patterns, options)
    .then(paths => Promise.all(paths.map(path => illustrateOne(path, options))))
    .then(aggregate)
  ;

  if (options.outputFormat === 'manifest') {
    components = components
      .then((illustrations) => generateManifest(options, illustrations))
    ;
  }

  return components;
}

export function illustrateOne(file, options) {
  let illustrator = new Illustrator(options);

  return Promise.resolve(file)
    .then(() => illustrator.processExample(file))
    .then(() => illustrator.component)
    .then(componentPath => componentPath ? illustrator.processComponent(componentPath) : null)
    .then(() => illustrator.run())
    .catch(error => console.error(error, error.stack))
  ;
}

// ---

function parseAndValidateOptions(options = {}) {
  options = Object.assign({
    root: path.resolve('.')
  }, options);

  if (options.dest) {
    options.dest = path.resolve(options.dest);
  }

  return options;
}
