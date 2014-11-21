/**
 * IFClient Library factory
 */
angular.module('ifclientLibrary')
  .factory('ifclientLib', function (ifuriConst, hashLib, transLib, packLib, clientLib, deferredLib) {
    'use strict';
    return ifclientLibrary(ifuriConst, hashLib, transLib, packLib, clientLib, deferredLib);
  });