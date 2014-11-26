angular.module('deferredLibrary')
  /**
   * Deferred Library Factory
   */
  .factory('deferred', function ($q) {
    'use strict';
    return deferredLibrary($q);
  });