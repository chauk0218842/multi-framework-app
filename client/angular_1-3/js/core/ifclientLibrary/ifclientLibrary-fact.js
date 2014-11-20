'use strict';
/**
 * IFClient Library factory
 */
angular.module('ifclientLibrary')
  .factory('ifclientLib', function (ifuriConst, hashLib, transLib, packLib, clientLib, deferredLib) {
    return ifclientLibrary(ifuriConst, hashLib, transLib, packLib, clientLib, deferredLib);
  });