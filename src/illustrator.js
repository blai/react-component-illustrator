'use strict';

import dox from 'dox';
import {parse as parseRectDoc} from 'react-docgen';

// ---

export default class Illustrator {
  constructor() {
    this.store = {};
  }

  // ---

  record(key) {
    return (value) => {
      return this.store[key] = value;
    };
  }

  parseExampleComments(code) {
    return dox.parseComments(code)[0];
  }

  parseReactDoc(code) {
    return parseRectDoc(code);
  }

  run() {
    return {
      comment:        this.store.comment,
      componentPath:  this.componentPath,
      documentation:  this.store.documentation,
      exampleContent: this.store.exampleContent,
      examplePath:    this.store.examplePath,
      sourceContent:  this.store.sourceContent
    };
  }

  get component() {
    if (this.componentPath) {
      return this.componentPath;
    }

    if (!this.store.comment) {
      return null;
    }

    return this.getCommentTag('component').string;
  }

  getCommentTag(name) {
    return this.store.comment.tags.find(tag => tag.type === name) || {};
  }
}
