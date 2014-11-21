/**
 * IFClient App module
 */
angular.module('ifclientApp', ['ifclientLibrary', 'ifuriConstants', 'utilityLibrary', 'deferredLibrary', 'packageLibrary', 'hashLibrary']);
angular.module('ifclientApp').controller('ifclientCtrl', function ($window, $scope, ifclientLib, ifuriConst, formatBytesToUnits, createFileList, deferredLib, packLib, hashLib) {

  'use strict';

  var VM = $scope;
  VM.username = ifclientLib.getUsername();
  VM.response = '';

  /**
   * Update the contact list received from the host
   * TODO put this as a service
   * @param list
   */
  function updateContacts(list) {
    list = list.sort();
    var contacts = ['ALL'];
    for (var n = 0, nLen = list.length; n < nLen; n++) {
      if (list [n] === ifclientLib.getUsername()) {
        continue;
      }
      contacts.push(list [n]);
    }

    return deferredLib.when(contacts);
  }

  /**
   * Handle message transmission
   * TODO put this as a service
   * @param trans
   */
  function handleMessage(trans) {
    return ('%CLIENT% > %MESSAGE%<hr/>').replace(/%CLIENT%/g, trans.client).replace(/%MESSAGE%/g, trans.package.body);
  }

  /**
   * Handle files transmission
   * TODO put this as a service
   * @param trans
   */
  function handleFiles(trans) {
    var responseHTML = "";
    var defers = [];
    var deferHASH = hashLib.create();
    var files = trans.package.files;
    var fileCount = 0;

    /**
     * Handle file transmission
     * @param fileInfo
     */
    function handleFile(fileInfo) {

      var file = fileInfo.file;
      var url = fileInfo.url;

      fileCount++;

      if (file.type.indexOf('image/') === 0) {
        responseHTML += '<br/>' + fileCount + '. <a href = "' + url + '" target = "new">' + file.name + '</a> (' + formatBytesToUnits(file.size) + ')<br/><a href = "' + url + '" target = "new"><img class = "thumbnail" src = ' + url + '></a><br/>';
      }
      else if (file.type.indexOf('text/') === 0) {
        responseHTML += '<br/>' + fileCount + '. <a href = "' + url + '" target = "new">' + file.name + '</a> (' + formatBytesToUnits(file.size) + ')<br/>';
      }
    }

    for (var n = 0, nLen = files.length; n < nLen; n++) {

      var fileReader = new FileReader();
      var defer = deferHASH.set(n, deferredLib.create());
      defers.push(defer);
      defer.then(handleFile);

      fileReader.onloadend = (function (deferKey, file) {
        return function (event) {
          if (event.target.readyState == FileReader.DONE) {
            deferHASH.get(deferKey).resolve({file: file, url: event.target.result});
          }
        }
      })(n, files[n]);

      fileReader.readAsDataURL(files[n]);

    }

    return deferredLib.all(defers).then(function () {
      return ('%CLIENT% > Received files...<br />').replace(/%CLIENT%/g, trans.client) + responseHTML + "<hr/>";
    });
  }

  /**
   * Update the chat box from the received messages
   * * TODO put this as a service
   * @param trans
   */
  function updateResponses(trans) {

    var responseHTML;

    /**
     * Received a text message
     */
    if (trans.package.type === packLib.const.TEXT_MESSAGE_TYPE) {
      responseHTML = handleMessage(trans);
    }

    /**
     * Received files
     */
    else if (trans.package.type === packLib.const.FILE_TYPE) {
      responseHTML = handleFiles(trans);
    }

    /**
     * Don't do anything LOL
     */
    else {

    }

    return deferredLib.when(responseHTML);
  }

  function transmissionListener(event) {

    VM.$apply(function () {

      /**
       * Listen for transmissions
       */
      ifclientLib.listen(event).then(function (trans) {

        /**
         * clientLib list was updated
         */
        if (trans.uri === ifuriConst.REQUEST_CLIENT_LIST) {
          updateContacts(trans.package.list).then(function (contacts) {
            VM.contacts = contacts;
            VM.recipient = VM.contacts [0];
          });
        }

        /**
         * Update response
         */
        else if (trans.uri === ifuriConst.CONNECT_CLIENT ||
          trans.uri === ifuriConst.DISCONNECT_CLIENT ||
          trans.uri === ifuriConst.SEND_CLIENT_PACKAGE) {
          updateResponses(trans).then(function (response) {
            VM.response = response;
          });
        }

        ///**
        // * Handling text messages
        // */
        //else if (trans.uri === iuriConst.SEND_CLIENT_PACKAGE &&
        //  trans.package.type === packLib.TEXT_MESSAGE_TYPE) {
        //
        //}
        //
        ///**
        // * Handling files
        // */
        //else if (trans.uri === ifuriConst.SEND_CLIENT_PACKAGE &&
        //  trans.package.type === packLib.FILE_TYPE) {
        //
        //}

      });
    });
  }

  angular.element($window).on('message', transmissionListener);

});
angular.module('ifclientApp').directive('pmcResponse', function () {

  'use strict';

  return {
    restrict: 'E',
    //TODO convert this into a DIV
    template: '<textarea ng-model = "response" class = "response"></textarea>'
  };
});
angular.module('ifclientApp').directive('pmcContacts', function () {

  'use strict';

  return {
    restrict: 'E',
    controller: function ($scope) {

      var VM = $scope;
      VM.contacts = '';
      VM.recipient = '';

    },
    template: 'Contacts ' + '<select ng-model = "recipient"><option ng-repeat="contact in contacts" value="{{contact}}">{{contact}}</option></select>'
  };
});
angular.module('ifclientApp').directive('pmcMessage', function (ifclientLib) {

  'use strict';

  return {
    restrict: 'E',
    controller: function ($scope) {

      var VM = $scope;
      VM.message = '';
      VM.sendMessage = function () {
        
        if ($scope.recipient === 'ALL') {
          for (var n in $scope.contacts) {

            if (!$scope.contacts.hasOwnProperty(n)) {
              continue;
            }

            var oContact = $scope.contacts [n];
            if (oContact === 'ALL') {
              continue;
            }
            ifclientLib.sendMessage(oContact, $scope.message, false);
          }
        }
        else {
          ifclientLib.sendMessage($scope.recipient, $scope.message, false);
        }
      };

      VM.resetForm = function () {
        VM.message = '< Type a message / drag and drop a file into here >';
      }

      VM.resetForm ();
    },
    template: 'Message' +
      '<br/><textarea ng-model = "message" class = "message"></textarea>' +
      '<button ng-click = "sendMessage ()">Send</button> <button ng-click = "resetForm ()">Reset</button>'
  };
});
angular.module('ifclientApp').run(function (ifclientLib) {

  'use strict';

  ifclientLib.connect();
});