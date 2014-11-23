/**
 * IFClient App module
 */
angular.module('ifclientLibrary')
  .run(function (ifhcClient) {

    'use strict';

    ifhcClient.connect();
  });