'use strict';

/**
 * Client Library Factory
 */
angular.module('clientLibrary')
  .factory('clientLib', function (serverConst) {
    return clientLibrary(serverConst);
  });