'use strict';

/**
 * Message Library factory
 */
angular.module('messageLibrary')
  .factory('messageLib', function (hashLib) {
    return messageLibrary(hashLib.createKey);
  });
