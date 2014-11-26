/**
 * IFClient App module
 */
angular.module('ifclientLibrary')
  .run(function (ifhcClient, $timeout) {

    'use strict';
	//TODO resolve this timing issue bug - not the best solution but will do for now
    $timeout (ifhcClient.connect, 1500);
  });