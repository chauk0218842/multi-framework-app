'use strict';

/**
 * IFClient App module
 */
angular.module("ifclientApp", ["ifclientLibrary", "ifuriConstants"]);
angular.module("ifclientApp").controller("ifclientCtrl", function ($window, $scope, ifclientLib, ifuriConst) {

  var _VM = $scope;
  _VM.username = ifclientLib.getUsername();
  _VM.response = "";

  angular.element($window).on("message", function (event) {

    _VM.$apply(function () {

      /**
       * Listen for messages
       */
      ifclientLib.listen(event).then(function (message) {

        /**
         * Update response
         */
        if (message.uri === ifuriConst.CONNECT_CLIENT ||
          message.uri === ifuriConst.DISCONNECT_CLIENT ||
          message.uri === ifuriConst.SEND_CLIENT_MESSAGE) {
          _VM.response = ("%CLIENT% > %MESSAGE%\n--\n").replace(/%CLIENT%/g, message.client).replace(/%MESSAGE%/g, message.parameters.body) + _VM.response;
        }

        /**
         * clientLib list was updated
         */
        else if (message.uri === ifuriConst.REQUEST_CLIENT_LIST) {

          var __oContacts = message.parameters.contacts.sort();
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
angular.module("ifclientApp").directive("pmcResponse", function () {
  return {
    restrict: "E",
    template: '<textarea ng-model = "response" class = "response"></textarea>'
  };
});
angular.module("ifclientApp").directive("pmcContacts", function () {
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
angular.module("ifclientApp").directive("pmcMessage", function (ifclientLib) {
  return {
    restrict: "E",
    controller: function ($scope) {

      var _VM = $scope;
      _VM.message = "Your message here...";
      _VM.sendMessage = function () {

        if ($scope.recipient === "ALL") {
          for (var n in $scope.contacts) {

            if (!$scope.contacts.hasOwnProperty(n)) {
              continue;
            }

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
angular.module("ifclientApp").run(function (ifclientLib) {
  ifclientLib.connect();
});