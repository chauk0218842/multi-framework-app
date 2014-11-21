/**
 * IF Chat directive
 */
angular.module('ifclientApp')
  .directive('ifChat', function ($window, $sce, ifclientLib, ifpackLib) {

    'use strict';

    /**
     * Window listener event
     * @param VM
     * @param event
     */
    function onMessageListener(VM, event) {

      VM.$apply(function () {

        /**
         * Listen for transmissions
         */
        ifclientLib.listen(event).then(function (pkg) {


          /**
           * clientLib list was updated
           */
          if (pkg.type == ifpackLib.const.CLIENT_LIST_TYPE) {
            ifpackLib.process(pkg).then(function (clients) {
              updateContacts (VM, clients);
            });
          }

          else if (pkg.type === ifpackLib.const.TEXT_MESSAGE_TYPE) {
            ifpackLib.process(pkg).then(function (response) {
              updateResponse (VM, response);
            });
          }

          else if (pkg.type === ifpackLib.const.FILE_TYPE) {
            ifpackLib.process(pkg).then(function (response) {
              updateResponse (VM, response);
            });
          }

          else {
          }

        });
      });
    }

    /**
     * Update contacts
     * @param VM
     * @param clients
     */
    function updateContacts (VM, clients) {
      VM.contacts = clients;
      VM.recipient = VM.contacts [0];
    }

    /**
     * Update responses
     * @param VM
     * @param response
     */
    function updateResponse (VM, response) {
      VM.response = $sce.trustAsHtml(response + VM.response);
    }

    /**
     * Send message
     * @param VM
     */
    function sendMessage (VM) {
      if (VM.recipient === 'ALL') {
        for (var n in $scope.contacts) {

          if (!VM.contacts.hasOwnProperty(n)) {
            continue;
          }

          var oContact = VM.contacts [n];
          if (oContact === 'ALL') {
            continue;
          }
          ifclientLib.sendMessage(oContact, VM.message, false);
        }
      }
      else {
        ifclientLib.sendMessage(VM.recipient, VM.message, false);
      }
    }

    /**
     * Reset form
     * @param VM
     */
    function resetForm (VM) {
      VM.message = '< Type a message / drag and drop a file into here >';
    }

    return {
      restrict: 'E',
      controller: function ($scope, $window) {
        var VM = $scope;
        VM.username = ifclientLib.getUsername();
        VM.response = '';
        VM.contacts = '';
        VM.recipient = '';
        VM.message = '';

        VM.sendMessage = function () {
          sendMessage (VM);
        };

        VM.resetForm = function () {
          resetForm (VM);
        };

        angular.element($window).on('message', function (event) {
          onMessageListener(VM, event);
        });

        VM.resetForm();
      },

      /**
       * TODO change this to use templateURL
       */
      template: '<h3>{{username}} (Powered by Angular 1.3)</h3>' +
      '<div ng-bind-html = "response" class = "response"></div>' +
      '<p>' +
      'Contacts <select ng-model = "recipient">' +
      '<option ng-repeat = "contact in contacts" value = "{{contact}}">{{contact}}</option></p>' +
      '</select>' +
      '<p>' +
      '<textarea ng-model = "message"></textarea>' +
      '<br/><button ng-click = "sendMessage ()">Send</button> <button ng-click = "resetForm ()">Reset</button>' +
      '</p>'
    };

  });
