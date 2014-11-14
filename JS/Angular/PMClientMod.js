/**
 * Angular Component
 */
'use strict';

/**
 * PMClient module
 */
var PMClientMod = angular.module("PMClient", ["PMCLibrary", "DeferHASH"]);

PMClientMod.factory("PMClient", function (PMCLibrary, DeferHASH) {
  return PMClient(PMCLibrary, DeferHASH);
});
