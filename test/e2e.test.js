import fs from 'fs';
import path from 'path'
import sinon from './sinon'
import * as main from '../src'

describe('E2E', function () {
  let root;
  let examplePath;
  let componentPath;

  describe('Base case', function () {
    beforeEach(function () {
      root = './test/fixtures/BaseCase';
      examplePath = path.resolve(`${root}/examples/BaseCaseExample.js`);
      componentPath = path.resolve(`${root}/BaseCase`);

      return this.result = main.illustrate(`${root}/examples/*.js`);
    });

    it('should generate illustration for component', function () {
      return this.result.then(r => {
        let illustration = r[0];

        // attributes
        illustration.name.should.equal('BaseCase');
        illustration.path.should.equal(componentPath);
        illustration.source.should.equal(fs.readFileSync(`${componentPath}.js`, {encoding: 'utf-8'}));
        illustration.description.should.equal('Some description from BaseCase\n\n@name {String} a name tag');

        // props
        illustration.should.have.property('props');
        illustration.props.should.have.property('string');
        illustration.props.string.should.have.deep.property('type.name', 'string');
        illustration.props.string.should.have.property('description', 'Property string\'s description');
        illustration.props.should.have.property('required')
          .that.have.property('required', true)
        ;
        illustration.props.should.have.property('instanceOf')
          .that.have.deep.property('type.value', 'MyPropType')
        ;
        illustration.props.should.have.property('customProp')
          .that.have.deep.property('type.raw')
          .that.match(/function\s*\(props,\s*propName,\s*componentName\)\s*\{/)
        ;
      });
    });

    it('should generate illustration for example', function () {
      return this.result.then(r => {
        let illustrations = r[0].examples;

        illustrations.should.have.length(1);

        let illustration = illustrations[0];

        illustration.name.should.equal('BaseCaseExample');
        illustration.path.should.equal(examplePath);
        illustration.requirePath.should.equal(`${root}/examples/BaseCaseExample.js`)
        illustration.description.should.equal('<p>BaseCaseExample<br />description</p>');
        illustration.source.should.equal(fs.readFileSync(examplePath, {encoding: 'utf-8'}));
        illustration.renderSource.should.equal('render() {\n    let foo = <div>whatever</div>;\n    return <BaseCase></BaseCase>;\n}');
      });
    });
  });

  describe('Output commonjs', function () {
    beforeEach(function () {
      root = './test/fixtures/BaseCase';
      examplePath = path.resolve(`${root}/examples/BaseCaseExample.js`);
      componentPath = path.resolve(`${root}/BaseCase`);

      return this.result = main.illustrate(`${root}/examples/*.js`, {outputFormat: 'commonjs'});
    });

    it('should wrap generated content in wrapped format', function () {
      return this.result.then(r => {
        r.should.be.a('string');
        r.should.match(/^module\.exports = \[/);
        r.should.match(new RegExp('"renderer":require\\("' + `${root}/examples/BaseCaseExample.js`.replace(/\.|\//g, '\\$&') + '"\\)'))
      });
    });
  });

  describe('Output es6', function () {
    beforeEach(function () {
      root = './test/fixtures/BaseCase';
      examplePath = path.resolve(`${root}/examples/BaseCaseExample.js`);
      componentPath = path.resolve(`${root}/BaseCase`);

      return this.result = main.illustrate(`${root}/examples/*.js`, {outputFormat: 'es6'});
    });

    it('should wrap generated content in wrapped format', function () {
      return this.result.then(r => {
        r.should.be.a('string');
        r.should.match(/^export default \[/);
        r.should.match(new RegExp('"renderer":require\\("' + `${root}/examples/BaseCaseExample.js`.replace(/\.|\//g, '\\$&') + '"\\)'))
      });
    });
  });

  describe('Output string', function () {
    beforeEach(function () {
      root = './test/fixtures/BaseCase';
      examplePath = path.resolve(`${root}/examples/BaseCaseExample.js`);
      componentPath = path.resolve(`${root}/BaseCase`);

      return this.result = main.illustrate(`${root}/examples/*.js`, {outputFormat: 'string'});
    });

    it('should wrap generated content in wrapped format', function () {
      return this.result.then(r => {
        r.should.be.a('string');
        r.should.match(/^\[.*\]$/);
      });
    });
  });
});
