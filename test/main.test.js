
import path from 'path'
import sinon from './sinon'
import * as main from '../src'

describe('index', function () {

  describe('#illustrate', function () {
    it('should run', function () {
      var parseAndValidateOptions;
      var globby;
      var generateManifest;

      main.__set__('parseAndValidateOptions', parseAndValidateOptions = this.sinon.stub());
      main.__set__('globby', globby = this.sinon.stub());
      main.__set__('generateManifest', generateManifest = this.sinon.stub());

      var options = {};
      var patterns = [path.resolve(__dirname, 'fixtures', '**', 'examples', '*.js')];
      // return main.illustrate(patterns, options)
      //   .then(function (items) {
      //     items.should.have.length(3);
      //   })
      //   .catch(function (error) {
      //     throw error;
      //   })
      // ;
    })
  })
})

// var path = require('path');

// var tap = require('tap');
// var sinon = require('sinon');
// var rewire = require('rewire');
// var main = rewire('../src');

// // ---

// tap.test('#illustrate', function (t) {
//   var parseAndValidateOptions;
//   var globby;
//   var generateManifest;

//   main.__set__('parseAndValidateOptions', parseAndValidateOptions = sinon.stub());
//   main.__set__('globby', globby = sinon.mock(main.__get__('globby')));
//   main.__set__('generateManifest', generateManifest = sinon.stub());

//   var options = {};
//   var patterns = [path.resolve(__dirname, 'fixtures', '**', 'examples', '*.js')];
//   var promise = main.illustrate(patterns, options)
//     .then(function (items) {
//       assert.equal(items.length, 3, 'should illustrate 3 examples');
//     })
//     .catch(function (error) {
//       throw error;
//     })
//     .then(t.end)
//   ;
// });
