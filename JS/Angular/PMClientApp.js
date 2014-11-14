/**
 * Angular Component
 */
'use strict';

/**
 * PMClientApp
 */
var PMClientApp = angular.module("PMClientApp", ["PMClient"]);

PMClientApp.controller("PMClientCtrl", function ($window, $scope, PMClient) {

  var _VM = $scope;
  _VM.clientName = PMClient.getClientName();
  _VM.response = "";

  angular.element($window).on("message", function (__oEvent) {

    _VM.$apply(function () {

      /**
       * Listen for messages
       */
      PMClient.receive(__oEvent);

      /**
       * Update response
       */
      var ___oMessages = PMClient.getMessages();
      _VM.response = (___oMessages.length ? ___oMessages [___oMessages.length - 1] + "\n--\n" : "") + _VM.response;
    });

  });

  angular.element($window).on("unload", function () {
    $window.removeEventListener("message");
  })

  PMClient.connect();

});

PMClientApp.directive("pmcResponse", function () {
  return {
    restrict: "E",
    template: '<textarea ng-model = "response" class = "response"></textarea>'
  };
});

PMClientApp.directive("pmcContacts", function (PMClient) {
  return {
    restrict: "E",
    controller: function ($scope) {

      var _VM = $scope;
      _VM.contacts = "";
      _VM.recipient = "";

      PMClient.getContacts().then(function (_oContacts) {
        _VM.contacts = _oContacts;
        _VM.recipient = _VM.contacts [0];
      })

      _VM.refreshContacts = function () {
        PMClient.getContacts().then(function (_oContacts) {
          _VM.contacts = _oContacts;
        });
      };

    },
    template: "Contacts " +
    '<select ng-model = "recipient"><option ng-repeat="contact in contacts" value="{{contact}}">{{contact}}</option></select>' + ' ' +
    '<button ng-click = "refreshContacts()">Refresh</button>'
  };
});

PMClientApp.directive("pmcMessage", function (PMClient) {
  return {
    restrict: "E",
    controller: function ($scope) {

      var _VM = $scope;
      _VM.message = "Your message here...";
      _VM.sendMessage = function () {
        PMClient.send($scope.recipient, $scope.message)
      };

    },
    template: 'Message' +
    '<br/><textarea ng-model = "message" class = "message">Your message here</textarea>' +
    '<button ng-click = "sendMessage ()">Send</button>'
  };
});