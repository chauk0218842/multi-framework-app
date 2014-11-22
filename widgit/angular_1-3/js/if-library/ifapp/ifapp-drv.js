/**
 * IF Chat directive
 */
angular.module('ifclientApp')

  .directive('ifFileDrop', function (utilLib) {

    function dropFile (VM, event) {

      VM.$apply (function () {

        var files = event.dataTransfer.files;

        event.preventDefault();
        VM.message = utilLib.createFileList(files);
        VM.filesPackage = files;
      })
    }

    return {

      restrict: 'A',
      link : function (VM, element, attr) {
        element.bind ('drop', function (event) {
          return dropFile (VM, event);
        });
      }
    };
  })

  .directive('ifChat', function ($window, $sce, ifclientLib, ifpackLib) {

    'use strict';

    /**
     * VM Handler
     * @type {{}}
     */
    var vmDataHandler = {};

    /**
     * VM Handler for Client List
     * @param VM
     * @param clients
     */
    vmDataHandler [ifpackLib.const.CLIENT_LIST_TYPE] = function (VM, clients) {
      updateContacts(VM, clients);
    };

    /**
     * VM Handler for Text Message
     * @param VM
     * @param response
     */
    vmDataHandler [ifpackLib.const.TEXT_MESSAGE_TYPE] = function (VM, response) {
      updateResponse(VM, response);
    };

    /**
     * VM Handler for File Type
     * @param VM
     * @param response
     */
    vmDataHandler [ifpackLib.const.FILES_TYPE] = function (VM, response) {
      updateResponse(VM, response);
    };

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
        ifclientLib.listen(event)

        /**
         * Process the data
         */
          .then(function (receivedPackage) {

            return ifpackLib.process(receivedPackage)

            /**
             * pass to the appropriate scope handler
             */
              .then(function (data) {
                vmDataHandler [receivedPackage.type](VM, data);
              });

          })

        /**
         * Error handler
         */
          .then(null, function () {

          });
      });
    }

    /**
     * Update contacts
     * @param VM
     * @param clients
     */
    function updateContacts(VM, clients) {
      VM.contacts = clients;
      VM.recipient = VM.contacts [0];
    }

    /**
     * Update responses
     * @param VM
     * @param response
     */
    function updateResponse(VM, response) {
      VM.response = $sce.trustAsHtml(response + VM.response);
    }

    /**
     * Send message
     * @param VM
     */
    function sendMessage(VM) {

      var recipients = VM.recipient === 'ALL' ? VM.contacts.slice(1, VM.contacts.length) : [VM.recipient];

      if (VM.filesPackage) {
        ifclientLib.sendFiles (recipients, VM.filesPackage, false);
      }
      else {
        ifclientLib.sendMessage(recipients, VM.message, false);
      }

      resetForm(VM);
    }

    /**
     * Reset form
     * @param VM
     */
    function resetForm(VM) {
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
        VM.filesPackage = '';

        VM.sendMessage = function () {
          sendMessage(VM);
        };

        VM.resetForm = function () {
          resetForm(VM);
        };

        angular.element($window).on('message', function (event) {
          onMessageListener(VM, event);
        });

        VM.resetForm(VM);
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
      '<textarea if-file-drop ng-model = "message"></textarea>' +
      '<br/><button ng-click = "sendMessage ()">Send</button> <button ng-click = "resetForm ()">Reset</button>' +
      '</p>'
    };

  }
)
;
