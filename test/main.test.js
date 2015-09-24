
import path from 'path'
import sinon from './sinon'
import * as main from '../src'

describe('index', function () {

  describe('#illustrate', function () {
    let parseAndValidateOptions;
    let globby;
    let illustrateOne;
    let generateManifest;
    let aggregate;
    let options;
    let patterns;
    let paths;
    let illustrations;
    let result;

    beforeEach(function () {
      main.__set__('parseAndValidateOptions', parseAndValidateOptions = this.sinon.stub());
      main.__set__('globby', globby = this.sinon.stub());
      main.__set__('generateManifest', generateManifest = this.sinon.stub());
      main.__set__('aggregate', aggregate = this.sinon.stub());
      main.__set__('illustrateOne', illustrateOne = this.sinon.stub());
    });

    afterEach(function () {
      main.__ResetDependency__('parseAndValidateOptions');
      main.__ResetDependency__('globby');
      main.__ResetDependency__('generateManifest');
      main.__ResetDependency__('aggregate');
      main.__ResetDependency__('illustrateOne');
    })

    describe('with default options', function () {
      beforeEach(function () {
        options = {};
        patterns = ['foo'];
        paths = ['fux', 'fuux', 'fuuux'];
        illustrations = paths.map((p, i) => {
          return {
            name: `${p}-name-${i}`,
            path: `${p}-path-${i}`,
            source: `${p}-source-${i}`
          };
        });
        result = illustrations.map(() => ({}));

        globby.resolves(paths);
        parseAndValidateOptions.returns(options);
        illustrations.forEach((i, index) => illustrateOne.onCall(index).returns(i));
        aggregate.resolves(result);

        return this.result = main.illustrate(patterns, options);
      });

      it('should have parsed and validated options', function () {
        return parseAndValidateOptions.should.have.been.calledWith(options);
      });

      it('should have example glob patterns', function () {
        return globby.should.have.been.calledWith(patterns);
      });

      it('should not generate manifest', function () {
        return generateManifest.should.notCalled;
      });

      it('should have called illustrateOne for each path covered by glob pattern', function () {
        return paths.forEach((p, i) => illustrateOne.getCall(i).should.have.been.calledWith(p, options));
      });

      it('should aggregate illustrations', function () {
        return aggregate.should.have.been.calledWith(illustrations);
      });

      it('should resolves with aggregated results', function () {
        return this.result.should.become(result)
      });
    });

    describe('with outputFormat set to `manifest`', function () {
      beforeEach(function () {
        options = {outputFormat: 'manifest'};
        patterns = ['foo'];
        paths = ['fux', 'fuux', 'fuuux'];
        illustrations = paths.map((p, i) => {
          return {
            name: `${p}-name-${i}`,
            path: `${p}-path-${i}`,
            source: `${p}-source-${i}`
          };
        });
        result = illustrations.map(() => ({}));

        globby.resolves(paths);
        parseAndValidateOptions.returns(options);
        illustrations.forEach((i, index) => illustrateOne.onCall(index).returns(i));
        generateManifest.resolves(result);
        aggregate.resolves(result);

        return this.result = main.illustrate(patterns, options);
      });

      it('should have parsed and validated options', function () {
        return parseAndValidateOptions.should.have.been.calledWith(options);
      });

      it('should have example glob patterns', function () {
        return globby.should.have.been.calledWith(patterns);
      });

      it('should have generated manifest', function () {
        return generateManifest.should.have.been.calledWith(options, result);
      });

      it('should have called illustrateOne for each path covered by glob pattern', function () {
        return paths.forEach((p, i) => illustrateOne.getCall(i).should.have.been.calledWith(p, options));
      });

      it('should aggregate illustrations', function () {
        return aggregate.should.have.been.calledWith(illustrations);
      });

      it('should resolves with aggregated results', function () {
        return this.result.should.become(result)
      });
    });
  });

  describe('#illustrateOne', function () {
    let Illustrator;
    let illustrator;
    let processExample;
    let component;
    let processComponent;
    let run;
    let file;
    let options;
    let result;

    beforeEach(function () {
      main.__set__('Illustrator', Illustrator = this.sinon.stub());
      processExample = this.sinon.stub();
      processComponent = this.sinon.stub();
      run = this.sinon.stub();

      Illustrator.returns(illustrator = {
        processExample,
        processComponent,
        run
      });
    });

    afterEach(function () {
      main.__ResetDependency__('Illustrator');
    });

    describe('when `component` is specified in example', function () {
      beforeEach(function () {
        file = 'foo';
        options = {};
        illustrator.component = 'bar';

        processExample.resolves();
        processComponent.resolves();
        run.resolves(result = {});

        return this.result = main.illustrateOne(file, options);
      });

      it('should create an Illustrator instance', function () {
        return Illustrator.should.have.been.calledWith(options);
      });

      it('should have called illustrator.processExample', function () {
        return processExample.should.have.been.calledWith(file);
      });

      it('should have called illustrator.processComponent', function () {
        return processComponent.should.have.been.calledWith(illustrator.component);
      });

      it('should have called illustrator.run', function () {
        return run.should.have.been.calledOnce;
      });

      it('should resolves', function () {
        return this.result.should.become(result);
      });
    });

    describe('when `component` is not specified in example', function () {
      beforeEach(function () {
        file = 'foo';
        options = {};

        processExample.resolves();
        run.resolves(result = {});

        return this.result = main.illustrateOne(file, options);
      });

      it('should create an Illustrator instance', function () {
        return Illustrator.should.have.been.calledWith(options);
      });

      it('should have called illustrator.processExample', function () {
        return processExample.should.have.been.calledWith(file);
      });

      it('should not call illustrator.processComponent', function () {
        return processComponent.should.have.not.been.called;
      });

      it('should have called illustrator.run', function () {
        return run.should.have.been.calledOnce;
      });

      it('should resolves', function () {
        return this.result.should.become(result);
      });
    });
  });

  describe('#parseAndValidateOptions', function () {
    var pathResolve;
    var options;

    beforeEach(function () {
      main.__set__('path', {resolve: pathResolve = this.sinon.stub()});
    });
  });
});
