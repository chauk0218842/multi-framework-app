'use strict';
/**
 * IFClient Library factory
 */
angular.module('ifclientLibrary')
  .factory('ifclientLib', function (ifuriConst, hashLib, messageLib, clientLib, deferredLib) {
    return ifclientLibrary(ifuriConst, hashLib, messageLib, clientLib, deferredLib);
  });