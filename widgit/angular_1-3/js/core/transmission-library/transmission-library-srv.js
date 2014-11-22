/**
 * Message Library factory
 */
angular.module('transmissionLibrary')
  .factory('transLib', function (hashLib) {
    'use strict';
    return transmissionLibrary(hashLib.createKey);
  });
