'use strict';


/***************************************************************************
 * Unit Test Setup Library
 ***************************************************************************/
var chai = require ("chai");
chai.config.includeStack = true;
global.expect = chai.expect
global.AssertionError = chai.AssertionError;
global.assert = chai.assert;

/***************************************************************************
 * Unit Test Code
 ***************************************************************************/
describe('HASH', function () {
  var HASH;

  before (function () {
    Base64 = require ("./Base64");
    HASH = require ("./HASH");
  });

  it('expect an object', function (done) {
    expect(HASH).to.be.a('object');
    done();
  });

  it('expect to have a "create" function', function (done) {
    expect (HASH.create).to.be.a('function');
    done ();
  });

  it('expect to have a "generateKey" function', function (done) {
    expect (HASH.generateKey).to.be.a('function');
    done ();
  });

  describe ('HASH.create', function () {

    var oHASH;

    before (function () {
      oHASH = HASH.create ();
    });

    it('expect an object', function (done) {
      expect(oHASH).to.be.a('object');
      done();
    });

    it('expect to have a "set" function', function (done) {
      expect (oHASH.set).to.be.a('function');
      done ();
    });

    it('expect a "remove" function', function (done) {
      expect(oHASH.remove).to.be.a('function');
      done ();
    })

  });

  describe ('HASH.generateKey', function () {

    var fnFunc;

    before (function (){
      fnFunc = HASH.generateKey;
    });

    it('expect a function', function(done){
      expect(fnFunc).to.be.a('function');
      done();
    });

    it('expect a string return value upon execution', function (done){
      expecct(fnFunc()).to.be.a('string');
    })

  });


  after (function () {});
});
