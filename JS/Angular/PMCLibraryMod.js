/**
 * Angular Component
 */
'use strict';

/**
 * PMCLibrary module
 */
var PMCLibraryMod = angular.module ("PMCLibrary", ["PMConstants", "PMError", "PMData"]);

PMCLibraryMod.factory ("PMCLibrary", function (PMConstants, PMError, PMData) {
  return PMCLibrary (PMConstants, PMError, PMData);
});