'use strict';

/**
 * HASH Library factory
 */
angular.module('hashLibrary')
  .factory('hashLib', function ($window) {
    return hashLibrary($window.btoa);
  });