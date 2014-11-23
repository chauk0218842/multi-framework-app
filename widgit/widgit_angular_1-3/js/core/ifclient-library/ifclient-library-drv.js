angular.module('ifclientLibrary')

  /**
   * File Drop directive
   */
  .directive('ifFileDrop', function (ifhc) {

    'use strict';

    function dropFile (VM, event) {

      VM.$apply (function () {

        var files = event.dataTransfer.files;

        event.preventDefault();
        VM.message = ifhc.util.createFileList(files);
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

  /**
   * Chat directive
   */
  .directive('ifChat', function ($window, $sce, ifhc, ifhcClient) {

    'use strict';

    /**
     * VM Handler
     * @type {{}}
     */
    var vmDataHandler = {};

    /**
     * VM Handler for Client List
     * @param VM
     * @param receivedPackage
     */
    vmDataHandler [ifhc.const.package.CLIENT_LIST_TYPE] = function (VM, receivedPackage) {
      updateContacts(VM, receivedPackage);
    };

    /**
     * VM Handler for Text Message
     * @param VM
     * @param receivedPackage
     */
    vmDataHandler [ifhc.const.package.TEXT_MESSAGE_TYPE] = function (VM, receivedPackage) {
      updateResponse(VM, receivedPackage);
    };

    /**
     * VM Handler for File Type
     * @param VM
     * @param receivedPackage
     */
    vmDataHandler [ifhc.const.package.FILES_TYPE] = function (VM, receivedPackage) {
      updateResponse(VM, receivedPackage);
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
        ifhcClient.listen(event)

        /**
         * pass to the appropriate scope handler
         */
          .then(function (receivedPackage) {
            return vmDataHandler [receivedPackage.type](VM, receivedPackage);
          })

        /**
         * Error handler
         */
          .then(null, function () {
            debugger;
          });
      });
    }

    /**
     * Update contacts
     * @param VM
     * @param receivedPackage
     */
    function updateContacts(VM, receivedPackage) {
      VM.contacts = receivedPackage.list;
      VM.recipient = VM.contacts [0];
    }

    /**
     * Update responses
     * @param VM
     * @param receivedPackage
     */
    function updateResponse(VM, receivedPackage) {
      VM.response = $sce.trustAsHtml(receivedPackage.body + VM.response);
    }

    /**
     * Send message
     * @param VM
     */
    function sendMessage(VM) {

      var recipients = VM.recipient === 'ALL' ? VM.contacts.slice(1, VM.contacts.length) : [VM.recipient];

      if (VM.filesPackage) {
        ifhcClient.sendFiles (recipients, VM.filesPackage, false);
      }
      else {
        ifhcClient.sendMessage(recipients, VM.message, false);
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
        VM.username = ifhcClient.getUsername();
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

  });
