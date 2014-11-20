/**
 * IFClient App module
 */
angular.module("ifclientApp", ["ifclientLibrary", "ifuriConstants"]);
angular.module("ifclientApp").controller("ifclientCtrl", function ($window, $scope, ifclientLib, ifuriConst) {

  'use strict';

  var _VM = $scope;
  _VM.username = ifclientLib.getUsername();
  _VM.response = "";

  function transmissionListener (event) {

    _VM.$apply(function () {

      /**
       * Listen for transmissions
       */
      ifclientLib.listen(event).then(function (trans) {

        /**
         * Update response
         */
        if (trans.uri === ifuriConst.CONNECT_CLIENT ||
          trans.uri === ifuriConst.DISCONNECT_CLIENT ||
          trans.uri === ifuriConst.SEND_CLIENT_PACKAGE) {

          _VM.response = ("%CLIENT% > %MESSAGE%\n--\n").replace(/%CLIENT%/g, trans.client).replace(/%MESSAGE%/g, trans.package.body) + _VM.response;
        }

        /**
         * clientLib list was updated
         */
        else if (trans.uri === ifuriConst.REQUEST_CLIENT_LIST) {

          var __oContacts = trans.package.list.sort();
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

  }

  function transmissionUnlistener () {
    $window.removeEventListener("trans");
  }

  angular.element($window).on("message", transmissionListener);

});
angular.module("ifclientApp").directive("pmcResponse", function () {

  'use strict';

  return {
    restrict: "E",
    template: '<textarea ng-model = "response" class = "response"></textarea>'
  };
});
angular.module("ifclientApp").directive("pmcContacts", function () {

  'use strict';

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

  'use strict';

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
            ifclientLib.sendTextMessageToClient(oContact, $scope.message, false);
          }
        }
        else {
          ifclientLib.sendTextMessageToClient($scope.recipient, $scope.message, false);
        }
      };

    },
    template: 'Message' +
    '<br/><textarea ng-model = "message" class = "message">Your message here</textarea>' +
    '<button ng-click = "sendMessage ()">Send</button>'
  };
});
angular.module("ifclientApp").run(function (ifclientLib) {

  'use strict';

  ifclientLib.connect();
});