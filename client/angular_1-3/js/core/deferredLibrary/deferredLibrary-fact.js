'use strict';

/**
 * Deferred Library Factory
 */
angular.module('deferredLibrary')
  .factory('deferredLib', function ($q) {
    return deferredLibrary($q);
  });
