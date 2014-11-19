/**
 * Angular Component
 */
'use strict';

/**
 * Hash Library module
 * @type {module}
 */
var hashLibMod = angular.module("hashLibrary", []);
hashLibMod.factory("hashLib", function () {
  return hashLibrary(window.atob);
});

/**
 * Deferred Library module
 * @type {module}
 */
var deferredLibMod = angular.module("deferredLibrary", []);
deferredLibMod.factory("deferredLib", function ($q) {
  return deferredLibrary($q);
});

/**
 * Message Library module
 * @type {module}
 */
var messageLibMod = angular.module("messageLibrary", ["hashLibrary"]);
messageLibMod.factory("messageLib", function (hashLib) {
  return messageLibrary(hashLib.createKey, angular.toJson, angular.fromJson);
});

/**
 * Request Library module
 * @type {module}
 */
var requestLibMod = angular.module("requestLibrary", ["hashLibrary"]);
requestLibMod.factory("requestLib", function (hashLib) {
  return requestLibrary(hashLib.createKey, angular.toJson, angular.fromJson);
});

/**
 * Sever Constants module
 * @type {module}
 */
var serverConstMod = angular.module("serverConst", []);
serverConstMod.factory("serverConst", function () {
  return serverConstants;
});

/**
 * Client Library module
 * @type {module}
 */
var clientLibMod = angular.module("ClientLibrary", ["serverConst"])
clientLibMod.factory("clientLib", function (serverConst) {
  return clientLibrary(serverConst);
});

/**
 * IFURI Constants module
 * @type {module}
 */
var ifuriConstMod = angular.module("ifuriConstants", []);
ifuriConstMod.factory("ifuriConst", function () {
  return ifuriConstants;
});

/**
 * IFClient Library module
 * @type {module}
 */
var ifclientLibMod = angular.module("ifclientLibrary", ["ifuriConstants", "hashLibrary", "requestLibrary", "messageLibrary", "ClientLibrary", "deferredLibrary"]);
ifclientLibMod.factory("ifclientLib", function (ifuriConst, hashLib, requestLib, messageLib, clientLib, deferredLib) {
  return ifclientLibrary(ifuriConst, hashLib, requestLib, messageLib, clientLib, deferredLib);
});


/**
 * IFClient App module
 */
var ifclientApp = angular.module("ifclientApp", ["ifclientLibrary", "ifuriConstants"]);

ifclientApp.controller("ifclientCtrl", function ($window, $scope, ifclientLib, ifuriConst) {

  var _VM = $scope;
  _VM.username = ifclientLib.getUsername();
  _VM.response = "";

  angular.element($window).on("message", function (__oEvent) {

    _VM.$apply(function () {

      /**
       * Listen for messages
       */
      ifclientLib.listen(__oEvent).then(function (__oRequest) {

        /**
         * Update response
         */
        if (__oRequest.uri === ifuriConst.CONNECT_CLIENT ||
          __oRequest.uri === ifuriConst.DISCONNECT_CLIENT ||
          __oRequest.uri === ifuriConst.SEND_CLIENT_MESSAGE) {
          _VM.response = ("%SENDER% > %MESSAGE%\n--\n").replace(/%SENDER%/g, __oRequest.contents.sender).replace(/%MESSAGE%/g, __oRequest.contents.contents) + _VM.response;
        }

        /**
         * clientLib list was updated
         */
        else if (__oRequest.uri === ifuriConst.REQUEST_CLIENT_LIST) {

          var __oContacts = __oRequest.contents.contents.sort();
          var __oNewContacts = ["ALL"];
          for (var n = 0, nLen = __oContacts.length; n < nLen; n++) {
            if (__oContacts [n] === ifclientLib.getUsername()) {
              continue;
            }
            __oNewContacts.push(__oContacts [n]);
          }

          _VM.contacts = __oNewContacts;
          _VM.recipient = _VM.contacts [0];
        }

      });
    });

  });

  angular.element($window).on("unload", function () {
    $window.removeEventListener("message");
  })

});

ifclientApp.directive("pmcResponse", function () {
  return {
    restrict: "E",
    template: '<textarea ng-model = "response" class = "response"></textarea>'
  };
});

ifclientApp.directive("pmcContacts", function (ifclientLib) {
  return {
    restrict: "E",
    controller: function ($scope) {

      var _VM = $scope;
      _VM.contacts = "";
      _VM.recipient = "";

    },
    template: "Contacts " + '<select ng-model = "recipient"><option ng-repeat="contact in contacts" value="{{contact}}">{{contact}}</option></select>'
  };
});

ifclientApp.directive("pmcMessage", function (ifclientLib) {
  return {
    restrict: "E",
    controller: function ($scope) {

      var _VM = $scope;
      _VM.message = "Your message here...";
      _VM.sendMessage = function () {

        if ($scope.recipient === "ALL") {
          for (var n in $scope.contacts) {
            var oContact = $scope.contacts [n];
            if (oContact === "ALL") {
              continue;
            }
            ifclientLib.sendMessageToClient(oContact, $scope.message, false);
          }
        }
        else {
          ifclientLib.sendMessageToClient($scope.recipient, $scope.message, false);
        }
      };

    },
    template: 'messageLib' +
    '<br/><textarea ng-model = "message" class = "message">Your message here</textarea>' +
    '<button ng-click = "sendMessage ()">Send</button>'
  };
});

ifclientApp.run(function (ifclientLib) {
  ifclientLib.connect();
});