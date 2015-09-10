'use strict';

import fs from 'fs';
import path from 'path';
import dox from 'dox';
import {parse as parseRectDoc} from 'react-docgen';

// ---

export default class Illustrator {
  constructor(options) {
    this.options = options;
    this.store = {};
  }

  // ---

  record(key) {
    return value => this.store[key] = value;
  }

  processExample(file) {
    return Promise.resolve(file)
      .then(this.record('examplePath'))
      .then(() => this.relativePath(file))
      .then(this.record('exampleRequirePath'))
      .then(() => fs.readFileSync(file, {encoding: 'utf-8'}))
      .then(this.record('exampleSource'))
      .then(this.parseExampleDoc)
      .then(this.record('exampleDoc'))
    ;
  }

  processComponent(file) {
    return Promise.resolve(file)
      .then(this.record('componentPath'))
      .then(() => {
        let componentPath = path.resolve(this.store.examplePath, file);
        if (!/\.js$/.test(componentPath)) {
          componentPath += '.js';
        }
        return componentPath;
      })
      .then(path => fs.readFileSync(path, {encoding: 'utf-8'}))
      .then(this.record('componentSource'))
      .then(this.parseComponentDoc)
      .then(this.record('componentDoc'))
    ;
  }

  parseExampleDoc(code) {
    return dox.parseComments(code)[0];
  }

  parseComponentDoc(code) {
    return parseRectDoc(code);
  }

  relativePath() {
    let paths = Array.from(arguments, p => path.resolve(p));
    paths.unshift(path.dirname(this.options.dest || path.resolve('.')));

    let relative = path.relative.apply(path, paths);

    if (relative[0] !== '.') {
      relative = `.${path.sep}${relative}`;
    }

    return relative;
  }

  run() {
    return {
      componentDoc:       this.store.componentDoc,
      componentPath:      this.store.componentPath,
      componentSource:    this.store.componentSource,
      exampleDoc:         this.store.exampleDoc,
      examplePath:        this.store.examplePath,
      exampleRequirePath: this.store.exampleRequirePath,
      exampleSource:      this.store.exampleSource
    };
  }

  get component() {
    if (this.store.componentPath) {
      return this.store.componentPath;
    }

    if (!this.store.exampleDoc) {
      return null;
    }

    var component = this.getCommentTag('component').string;
    return component ? path.resolve(this.store.examplePath, component) : null;
  }

  getCommentTag(name) {
    return this.store.exampleDoc.tags.find(tag => tag.type === name) || {};
  }
}
