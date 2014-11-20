'use strict';

/**
 * Message Library factory
 */
angular.module('transmissionLibrary')
  .factory('transLib', function (hashLib) {
    return transmissionLibrary(hashLib.createKey);
  });
