/**
 * IFClient App module
 */

angular.module('ifclientApp').run(function (ifclientLib) {

  'use strict';

  ifclientLib.connect();
});