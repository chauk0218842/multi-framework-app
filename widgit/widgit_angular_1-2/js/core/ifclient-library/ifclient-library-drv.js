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
        VM.filesAttachment = files;
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
     * @param receivedAttachment
     */
    vmDataHandler [ifhc.const.attachment.CLIENT_LIST_TYPE] = function (VM, receivedAttachment) {
      updateContacts(VM, receivedAttachment);
    };

    /**
     * VM Handler for Text Message
     * @param VM
     * @param receivedAttachment
     */
    vmDataHandler [ifhc.const.attachment.TEXT_MESSAGE_TYPE] = function (VM, receivedAttachment) {
      updateResponse(VM, receivedAttachment);
    };

    /**
     * VM Handler for File Type
     * @param VM
     * @param receivedAttachment
     */
    vmDataHandler [ifhc.const.attachment.FILES_TYPE] = function (VM, receivedAttachment) {
      updateResponse(VM, receivedAttachment);
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
          .then(function (receivedAttachment) {
            return vmDataHandler [receivedAttachment.type](VM, receivedAttachment);
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
     * @param receivedAttachment
     */
    function updateContacts(VM, receivedAttachment) {
      VM.contacts = receivedAttachment.list;
      VM.recipient = VM.contacts [0];
    }

    /**
     * Update responses
     * @param VM
     * @param receivedAttachment
     */
    function updateResponse(VM, receivedAttachment) {
      VM.response = $sce.trustAsHtml(receivedAttachment.body + VM.response);
    }

    /**
     * Send message
     * @param VM
     */
    function sendMessage(VM) {

      var recipients = VM.recipient === 'ALL' ? VM.contacts.slice(1, VM.contacts.length) : [VM.recipient];

      if (VM.filesAttachment) {
        ifhcClient.sendFiles (recipients, VM.filesAttachment, false);
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
        VM.filesAttachment = '';

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
      template: '<h3>{{username}} (Powered by Angular 1.2)</h3>' +
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
