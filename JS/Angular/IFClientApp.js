/**
 * Angular Component
 */
'use strict';

/**
 * HASHLibrary module
 * @type {module}
 */
var HASHMod = angular.module("HASHLibrary", []);
HASHMod.factory("HASH", function () {
  return HASHLibrary(window.atob);
});

/**
 * DeferredLibrary module
 * @type {module}
 */
var DeferredMod = angular.module("DeferredLibrary", []);
DeferredMod.factory("Deferred", function ($q) {
  return DeferredLibrary($q);
});

/**
 * MessageLibrary module
 * @type {module}
 */
var MessageMod = angular.module("MessageLibrary", ["HASHLibrary"]);
MessageMod.factory("Message", function (HASH) {
  return MessageLibrary(HASH.generateKey, angular.toJson, angular.fromJson);
});

/**
 * RequestLibrary module
 * @type {module}
 */
var RequestMod = angular.module("RequestLibrary", ["HASHLibrary"]);
RequestMod.factory("Request", function (HASH) {
  return RequestLibrary(HASH.generateKey, angular.toJson, angular.fromJson);
});

/**
 * ServerConstLibrary module
 * @type {module}
 */
var ServerConstMod = angular.module("ServerConstLibrary", []);
ServerConstMod.factory("ServerConst", function () {
  return ServerConstants;
});

/**
 * ClientLibrary module
 * @type {module}
 */
var ClientMod = angular.module("ClientLibrary", ["ServerConstLibrary"])
ClientMod.factory("Client", function (ServerConst) {
  return ClientLibrary(ServerConst);
});

/**
 * IFURIConstants module
 * @type {module}
 */
var IFURIConstMod = angular.module("IFURIConstants", []);
IFURIConstMod.factory("IFURIConst", function () {
  return IFURIConstants;
});

/**
 * IFClientLibrary module
 * @type {module}
 */
var IFClientMod = angular.module("IFClientLibrary", ["IFURIConstants", "HASHLibrary", "RequestLibrary", "MessageLibrary", "ClientLibrary", "DeferredLibrary"]);
IFClientMod.factory("IFClient", function (IFURIConst, HASH, Request, Message, Client, Deferred) {
  return IFClientLibrary(IFURIConst, HASH, Request, Message, Client, Deferred);
});


/**
 * IFClientApp module
 */
var IFClientApp = angular.module("IFClientApp", ["IFClientLibrary", "IFURIConstants"]);

IFClientApp.controller("IFClientCtrl", function ($window, $scope, IFClient, IFURIConst) {

  var _VM = $scope;
  _VM.username = IFClient.getUsername();
  _VM.response = "";

  angular.element($window).on("message", function (__oEvent) {

    _VM.$apply(function () {

      /**
       * Listen for messages
       */
      IFClient.listen(__oEvent).then(function (__oRequest) {

        /**
         * Update response
         */
        if (__oRequest.uri === IFURIConst.CONNECT_CLIENT ||
          __oRequest.uri === IFURIConst.DISCONNECT_CLIENT ||
          __oRequest.uri === IFURIConst.SEND_CLIENT_MESSAGE) {
          _VM.response = ("%SENDER% > %MESSAGE%\n--\n").replace(/%SENDER%/g, __oRequest.contents.sender).replace(/%MESSAGE%/g, __oRequest.contents.contents) + _VM.response;
        }

        /**
         * Client list was updated
         */
        else if (__oRequest.uri === IFURIConst.REQUEST_CLIENT_LIST) {

          var __oContacts = __oRequest.contents.contents.sort();
          var __oNewContacts = ["ALL"];
          for (var n = 0, nLen = __oContacts.length; n < nLen; n++) {
            if (__oContacts [n] === IFClient.getUsername()) {
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

IFClientApp.directive("pmcResponse", function () {
  return {
    restrict: "E",
    template: '<textarea ng-model = "response" class = "response"></textarea>'
  };
});

IFClientApp.directive("pmcContacts", function (IFClient) {
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

IFClientApp.directive("pmcMessage", function (IFClient) {
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
            IFClient.sendMessageToClient(oContact, $scope.message, false);
          }
        }
        else {
          IFClient.sendMessageToClient($scope.recipient, $scope.message, false);
        }
      };

    },
    template: 'Message' +
    '<br/><textarea ng-model = "message" class = "message">Your message here</textarea>' +
    '<button ng-click = "sendMessage ()">Send</button>'
  };
});

IFClientApp.run(function (IFClient) {
  IFClient.connect();
});