'use strict';

/**
 * Deferred Library Factory
 */
angular.module('deferredLibrary')
  .factory('deferredLib', function ($q) {
    'use strict';
    return deferredLibrary($q);
  });
