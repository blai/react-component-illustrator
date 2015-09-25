'use strict';

import fs from 'fs';
import path from 'path';
import dox from 'dox';
import recast from 'recast';
import walk from 'acorn-jsx-walk';
import {simple as walkNode} from 'acorn-jsx-walk/lib/walk';
import {parse as parseReactDoc} from 'react-docgen';
import {find, toRelativeJsPath} from './util';

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
      .then(this.parseExampleDoc.bind(this))
      .then(this.record('exampleDoc'))
    ;
  }

  processComponent(file) {
    return Promise.resolve(file)
      .then(this.record('componentPath'))
      .then(file => toRelativeJsPath(this.store.examplePath, file))
      .then(file => fs.readFileSync(file, {encoding: 'utf-8'}))
      .then(this.record('componentSource'))
      .then(this.parseComponentDoc)
      .then(this.record('componentDoc'))
    ;
  }

  parseExampleDoc(code) {
    return dox.parseComments(code, this.options.doxOptions)[0];
  }

  parseComponentDoc(code) {
    return parseReactDoc(code);
  }

  relativePath() {
    let paths = Array.from(arguments, p => path.resolve(p));
    paths.unshift(this.options.dest ? path.dirname(this.options.dest) : path.resolve('.'));

    let relative = path.relative(...paths);

    if (relative[0] !== '.') {
      relative = `.${path.sep}${relative}`;
    }

    return relative;
  }

  run() {
    let component = this.store.componentPath ? Object.assign({
      name: path.basename(this.store.componentPath, path.extname(this.store.componentPath)),
      path: path.resolve(this.store.componentPath),
      source: this.store.componentSource
    }, this.store.componentDoc) : null;

    walk(this.store.exampleSource, {
      MethodDefinition: (node) => node.key.name === 'render' && this.record('exampleRender')(recast.print(node).code)
    });

    let example = {
      name: this.getCommentTag('name').string,
      path: path.resolve(this.store.examplePath),
      requirePath: this.store.exampleRequirePath,
      description: this.store.exampleDoc.description.full,
      source: this.store.exampleSource,
      renderSource: this.store.exampleRender
    };

    return {
      component,
      example
    };
  }

  get component() {
    if (this.store.componentPath) {
      return this.store.componentPath;
    }

    if (!this.store.exampleDoc) {
      return null;
    }

    let component = this.getCommentTag('component').string;
    return component ? path.resolve(this.store.examplePath, component) : null;
  }

  getCommentTag(name) {
    let results = this.store.exampleDoc.tags.filter(tag => tag.type === name);
    return results.length ? results[0] : {};
  }
}
