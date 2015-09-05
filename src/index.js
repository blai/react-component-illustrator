import fs from 'fs';
import path from 'path';
import globby from 'globby';
import Illustrator from './illustrator';
import {generateManifest, relativePath} from './util';

export function illustrate(patterns, options) {
  options = parseAndValidateOptions(options);

  let components = globby(patterns, options)
    .then(paths => Promise.all(paths.map(path => illustrateOne(path, options))))
  ;

  if (options.outputFormat === 'manifest') {
    components = components.then(generateManifest);
  }

  return components;
}

export function illustrateOne(file, options) {
  let illustrator = new Illustrator();

  return Promise.resolve(relativePath(options.dest, file))
    .then(illustrator.record('examplePath'))
    .then(path => fs.readFileSync(path, {encoding: 'utf-8'}))
    .then(illustrator.record('exampleContent'))
    .then(illustrator.parseExampleComments)
    .then(illustrator.record('comment'))
    .then(() => illustrator.component)
    .then(illustrator.record('componentPath'))
    .then(file => {
      let componentPath = path.resolve(illustrator.store.examplePath, file);
      if (!/\.js$/.test(componentPath)) {
        componentPath += '.js';
      }
      return componentPath;
    })
    .then(path => fs.readFileSync(path, {encoding: 'utf-8'}))
    .then(illustrator.record('sourceContent'))
    .then(illustrator.parseReactDoc)
    .then(illustrator.record('documentation'))
    .then(() => illustrator.run())
    .catch(error => console.log('error', error))
  ;
}

function processExample(file) {
  return fs.readSync(file);
}

function parseAndValidateOptions(options = {}) {
  return Object.assign(options, {});
}
