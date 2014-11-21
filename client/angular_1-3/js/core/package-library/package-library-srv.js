/**
 * Package Library factory
 */
angular.module('packageLibrary')
  .factory('packConst', function () {
    'use strict';
    return packageConstants;
  })
  .factory('packLib', function (packConst) {
    'use strict';
    return packageLibrary (packConst);
  });