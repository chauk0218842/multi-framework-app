'use strict';

/**
 * Package Library factory
 */
angular.module('packageLibrary')
  .factory('packConst', function () {
    return packageConstants;
  })
  .factory('packLib', function (packConst) {
    return packageLibrary (packConst);
  });