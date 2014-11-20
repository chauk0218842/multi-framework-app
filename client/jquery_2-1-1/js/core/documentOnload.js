'use strict';

/**
 * Document Onload Function
 * @param _$
 */
function documentOnload(_$) {

  /**
   * HASH Library
   * @type {{create: createHASHBucket, createKey: createHASHKey}}
   */
  var hashLib = hashLibrary(window.atob);

  /**
   * Deferred Library
   * @type {{generate: createDefer, when: (*|jQuery.when|Function|$Q.when|deferredLibrary.when|when)}|{generate: createDefer, when: (*|deferredLibrary.when|jQuery.when|Function|$Q.when|when)}}
   */
  var deferredLib = deferredLibrary(_$);

  /**
   * Message Library
   * @type {{create: createNewMessage, decode: decodeMessage}}
   */
  var messageLib = messageLibrary(hashLib.createKey);

  /**
   * Server Constant
   * @type {{SERVER_NAME: string, DOMAIN_NAME: string}}
   */
  var serverConst = serverConstants;

  /**
   * Client Library
   * @type {{send: sendRequestToServer, listen: listenToServer}}
   */
  var clientLib = clientLibrary(serverConst);

  /**
   * IFURI Constant
   * @type {{CONNECT_CLIENT: string, DISCONNECT_CLIENT: string, REQUEST_CLIENT_LIST: string, SEND_CLIENT_MESSAGE: string}}
   */
  var ifuriConst = ifuriConstants;

  /**
   * IFClient Library
   * @type {{listen: listenToHost, connect: connectToHost, disconnect: disconnectFromHost, getUsername: getUsername, getClients: getClientListFromHost, getRequestLog: getRequestLog, getResponseLog: getResponseLog, sendMessageToClient: _fnSendMessageToClient}}
   */
  var ifClientLib = ifclientLibrary(ifuriConst, hashLib, messageLib, clientLib, deferredLib);

  /**
   * Window Message Listener
   * @param event
   */
  function messageListener (event) {

    /**
     * Listen for messages
     */
    ifClientLib.listen(event).then(function (message) {

      var $response = _$('#response');
      var $contacts = _$('#contacts');

      /**
       * Update response
       */
      if (message.uri === ifuriConst.CONNECT_CLIENT ||
        message.uri === ifuriConst.DISCONNECT_CLIENT ||
        message.uri === ifuriConst.SEND_CLIENT_MESSAGE) {
        $response.val(('%CLIENT% > %MESSAGE%\n--\n').replace(/%CLIENT%/g, message.client).replace(/%MESSAGE%/g, message.parameters.body) + $response.val());
      }

      /**
       * clientLib list was updated
       */
      else if (message.uri === ifuriConst.REQUEST_CLIENT_LIST) {

        $contacts.empty();

        var contacts = message.parameters.contacts.sort();
        $contacts.append('<option value = "ALL">ALL</option>');

        var userName = ifClientLib.getUsername();
        for (var n in contacts) {
          if (contacts [n] === userName) {
            continue;
          }
          $contacts.append('<option value = \"' + contacts [n] + '\">' + contacts [n] + '</option>');
        }

        $contacts.index(0);
      }

    });

  }

  /**
   * Add window listener
   */
  window.addEventListener('message', messageListener);

  /**
   * Remove 'message' upon unload
   */
  window.addEventListener('unload', function () {
    window.removeEventListener('message', messageListener);
  });

  /**
   * Assign the client name
   */
  _$('#clientName').text(ifClientLib.getUsername());

  /**
   * Assign the send event
   */
  _$('#send').bind('click', function () {

    var $contacts = _$('#contacts');
    var message = _$('#message').val();

    if ($contacts.val() === 'ALL') {
      var oContacts = _$('#contacts>option').map(function () {
        return $(this).val();
      });
      for (var n = 0, nLen = oContacts.length; n < nLen; n++) {
        var oContact = oContacts [n];
        if (oContact === 'ALL') {
          continue;
        }
        ifClientLib.sendMessageToClient(oContact, message, false);
      }
    }
    else {
      ifClientLib.sendMessageToClient($contacts.val(), message, false);
    }

  });

  /**
   * Connect to the host
   */
  ifClientLib.connect();
}
