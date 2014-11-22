/**
 * Client Library Factory
 */
angular.module('clientLibrary')
  .factory('clientLib', function (serverConst) {
    'use strict';
    return clientLibrary(serverConst);
  });