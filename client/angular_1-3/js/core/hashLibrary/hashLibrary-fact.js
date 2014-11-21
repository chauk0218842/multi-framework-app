/**
 * HASH Library factory
 */
angular.module('hashLibrary')
  .factory('hashLib', function ($window) {
    'use strict';
    return hashLibrary($window.btoa);
  });