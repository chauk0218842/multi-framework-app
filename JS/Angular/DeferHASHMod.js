/**
 * Angular Component
 */
'use strict';

/**
 * PMConstants module
 */
var DeferHASHMod = angular.module("DeferHASH", []);

DeferHASHMod.factory("DeferHASH", function ($q) {
  return DeferHASH(fnDeferCreate_Angular($q));
})