
import path from 'path'
import sinon from './sinon'
import Illustrator, {__RewireAPI__} from '../src/illustrator'

describe('illustrator', function () {
  let options;

  describe('#constructor', function () {
    beforeEach(function () {
      this.result = new Illustrator(options = {foo: true});
    });

    it('should have utlized options', function () {
      this.result.options.should.equal(options);
    });

    it('should have initiated store', function () {
      this.result.store.should.be.deep.equal({});
    });
  });

  describe('#record', function () {
    let key;
    let value;

    beforeEach(function () {
      options = {};
      key = 'key';
      value = 'value';

      this.illustrator = new Illustrator(options);
      this.result = this.illustrator.record(key)(value);
    });

    it('should have recorded the record', function () {
      this.illustrator.store[key].should.be.equal(value);
    });

    it('should return recorded value', function () {
      this.result.should.be.equal(value);
    });
  });

  describe('#processExample', function () {
    let record;
    let relativePath;
    let fsReadFileSync;
    let parseExampleDoc;
    let file;
    let fileContent;
    let docContent;

    beforeEach(function () {
      file = 'foo';
      fileContent = 'fooContent';
      docContent = 'docContent';

      __RewireAPI__.__set__('fs', {readFileSync: fsReadFileSync = this.sinon.stub().returns(fileContent)});

      this.illustrator = new Illustrator(options = {});

      this.sinon.spy(this.illustrator, 'record');
      this.sinon.stub(this.illustrator, 'relativePath').returns(file);
      this.sinon.stub(this.illustrator, 'parseExampleDoc').returns(docContent);

      return this.illustrator.processExample(file);
    });

    afterEach(function () {
      __RewireAPI__.__ResetDependency__('fs');
    });

    it('should record `examplePath`', function () {
      this.illustrator.record.should.have.been.calledWith('examplePath');
      this.illustrator.store['examplePath'].should.be.equal(file);
    });

    it('should convert `file` to relativePath', function () {
      return this.illustrator.relativePath.should.have.been.calledWith(file);
    });

    it('shound record `exampleRequirePath`', function () {
      this.illustrator.record.should.have.been.calledWith('exampleRequirePath');
      this.illustrator.store['exampleRequirePath'].should.be.equal(file);
    });

    it('should try to read the content of `file`', function () {
      fsReadFileSync.should.have.been.calledWith(file, {encoding: 'utf-8'});
    });

    it('should record `exampleSource`', function () {
      this.illustrator.record.should.have.been.calledWith('exampleSource');
      this.illustrator.store['exampleSource'].should.be.equal(fileContent);
    });

    it('should parse example doc', function () {
      this.illustrator.parseExampleDoc.should.have.been.calledWith(fileContent);
    });

    it('should record `exampleDoc`', function () {
      this.illustrator.record.should.have.been.calledWith('exampleDoc');
      this.illustrator.store['exampleDoc'].should.be.equal(docContent);
    });
  });

  describe('#processComponent', function () {
    let record;
    let toRelativeJsPath;
    let fsReadFileSync;
    let parseComponentDoc;
    let file;
    let examplePath;
    let fileContent;
    let docContent;

    beforeEach(function () {
      file = 'foo';
      fileContent = 'fooContent';
      docContent = 'docContent';

      __RewireAPI__.__set__('fs', {readFileSync: fsReadFileSync = this.sinon.stub().returns(fileContent)});
      __RewireAPI__.__set__('toRelativeJsPath', toRelativeJsPath = this.sinon.stub().returns(file));

      this.illustrator = new Illustrator(options = {});
      this.illustrator.store = {examplePath: examplePath = 'fakeExamplePath'};

      this.sinon.spy(this.illustrator, 'record');
      this.sinon.stub(this.illustrator, 'parseComponentDoc').returns(docContent);

      return this.illustrator.processComponent(file);
    });

    afterEach(function () {
      __RewireAPI__.__ResetDependency__('fs');
      __RewireAPI__.__ResetDependency__('toRelativeJsPath');
    });

    it('should record `componentPath`', function () {
      this.illustrator.record.should.have.been.calledWith('componentPath');
      this.illustrator.store['componentPath'].should.be.equal(file);
    });

    it('should convert `file` to relativePath', function () {
      return toRelativeJsPath.should.have.been.calledWith(this.illustrator.store.examplePath, file);
    });

    it('should try to read the content of `file`', function () {
      fsReadFileSync.should.have.been.calledWith(file, {encoding: 'utf-8'});
    });

    it('should record `componentSource`', function () {
      this.illustrator.record.should.have.been.calledWith('componentSource');
      this.illustrator.store['componentSource'].should.be.equal(fileContent);
    });

    it('should parse component doc', function () {
      this.illustrator.parseComponentDoc.should.have.been.calledWith(fileContent);
    });

    it('should record `componentDoc`', function () {
      this.illustrator.record.should.have.been.calledWith('componentDoc');
      this.illustrator.store['componentDoc'].should.be.equal(docContent);
    });
  });

  describe('#parseExampleDoc', function () {
    let doxParseComments;
    let code;
    let comments;
    let options;

    beforeEach(function () {
      __RewireAPI__.__set__('dox', {parseComments: doxParseComments = this.sinon.stub().returns(comments = [{foo: 'foo'}])});

      this.illustrator = new Illustrator(options = {});

      return this.result = this.illustrator.parseExampleDoc(code = 'bar');
    });

    afterEach(function () {
      __RewireAPI__.__ResetDependency__('dox');
    });

    it('should have called dox.parseComments', function () {
      doxParseComments.should.have.been.calledWith(code);
    });

    it('should return the first comment', function () {
      this.result.should.be.deep.equal(comments[0]);
    });
  });

  describe('#parseComponentDoc', function () {
    let parseReactDoc;
    let options;
    let code;
    let componentDoc;

    beforeEach(function () {
      __RewireAPI__.__set__('parseReactDoc', parseReactDoc = this.sinon.stub().returns(componentDoc = 'foo'));

      this.illustrator = new Illustrator(options = {});

      return this.result = this.illustrator.parseComponentDoc(code = 'bar');
    });

    afterEach(function () {
      __RewireAPI__.__ResetDependency__('parseReactDoc');
    });

    it('should call react-docgen.parse', function () {
      return parseReactDoc.should.have.been.calledWith(code);
    });

    it('should return react component doc', function () {
      return this.result.should.be.deep.equal(componentDoc);
    });
  });

  describe('#relativePath', function () {
    let pathMock;
    let options;
    let paths;
    let destPath;
    let rootPath;
    let resultPath;

    beforeEach(function () {
      paths = ['foo', 'bar'];

      pathMock = this.sinon.mock(__RewireAPI__.__get__('path'));

      paths.forEach(p => pathMock.expects('resolve').withExactArgs(p).once().returns(`${p}${p}`));
    });

    describe('when options.dest is not defined', function () {
      beforeEach(function () {
        pathMock.expects('resolve')
          .withExactArgs('.')
          .once()
          .returns(rootPath = './root')
        ;

        pathMock.expects('relative')
          .once()
          .withExactArgs(rootPath, ...paths.map(p => `${p}${p}`))
          .returns(resultPath = './fux')
        ;

        this.illustrator = new Illustrator(options = {});
        return this.result = this.illustrator.relativePath(...paths);
      });

      it('should return normalized relative path', function () {
        this.result.should.be.equal(resultPath);
      });
    });

    describe('when options.dest is set', function () {
      beforeEach(function () {
        options = {dest: destPath = 'baz'};

        pathMock.expects('resolve')
          .withExactArgs(destPath)
          .once()
          .returns(`${destPath}${destPath}`)
        ;

        pathMock.expects('dirname')
          .once()
          .withExactArgs(destPath)
          .returns(`${destPath}${destPath}`)
        ;

        pathMock.expects('relative')
          .once()
          .withExactArgs(`${destPath}${destPath}`, ...paths.map(p => `${p}${p}`))
          .returns(resultPath = './fux')
        ;

        this.illustrator = new Illustrator(options);
        return this.result = this.illustrator.relativePath(...paths);
      });

      it('should return normalized relative path', function () {
        this.result.should.be.equal(resultPath);
      });
    });

    describe('when relative path is a sibling', function () {
      beforeEach(function () {
        pathMock.expects('resolve')
          .withExactArgs('.')
          .once()
          .returns(rootPath = './root')
        ;

        pathMock.expects('relative')
          .once()
          .withExactArgs(rootPath, ...paths.map(p => `${p}${p}`))
          .returns(resultPath = 'fux')
        ;

        this.illustrator = new Illustrator(options = {});
        return this.result = this.illustrator.relativePath(...paths);
      });

      it('should return normalized relative path', function () {
        this.result.should.be.equal(`./${resultPath}`);
      });
    });
  });

  // run() {
  //   let component = this.store.componentPath ? Object.assign({
  //     name: path.basename(this.store.componentPath, path.extname(this.store.componentPath)),
  //     path: path.resolve(this.store.componentPath),
  //     source: this.store.componentSource
  //   }, this.store.componentDoc) : null;

  //   walk(this.store.exampleSource, {
  //     MethodDefinition: (node) => node.key.name === 'render' && this.record('exampleRender')(recast.print(node).code)
  //   });

  //   let example = {
  //     name: this.getCommentTag('name').string,
  //     path: path.resolve(this.store.examplePath),
  //     requirePath: this.store.exampleRequirePath,
  //     description: this.store.exampleDoc.description.full,
  //     source: this.store.exampleSource,
  //     renderSource: this.store.exampleRender
  //   };

  //   return {
  //     component,
  //     example
  //   };
  // }
  describe('#run', function () {
    let componentPath;
    let componentSource;
    let exampleRender;
    let examplePath;
    let exampleRequirePath;
    let exampleDoc;
    let exampleSource;
  });

});
