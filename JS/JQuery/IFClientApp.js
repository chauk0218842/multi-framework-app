/**
 * JQuery Component
 */
'use strict';

function fnDocumentOnLoad (_$) {
  /**
   * HASH object
   * @type {{generate: _fnGenerateBucket, generateKey: _fnGenerateKey}}
   * @private
   */
  var HASH = HASHLibrary(window.atob);

  /**
   * Deferred object
   */
  var Deferred = DeferredLibrary(_$);

  /**
   * Message object
   * @type {{generate: _fnGenerateMessage}}
   * @private
   */
  var Message = MessageLibrary(HASH.generateKey, JSON.stringify, JSON.parse);

  /**
   * Request object
   * @type {{generate: _fnGenerateRequest}}
   * @private
   */
  var Request = RequestLibrary(HASH.generateKey, JSON.stringify, JSON.parse);

  /**
   * Server Constants object
   * @type {ServerConstants|*}
   * @private
   */
  var ServerConst = ServerConstants;

  /**
   * Client library object
   * @type {{send: _fnSendRequestToServer, listen: _fnListenToServer}}
   * @private
   */
  var Client = ClientLibrary(ServerConst);

  /**
   * IFURI Constants object
   * @type {{CONNECTClient: string, DISCONNECTClient: string, REQUESTClient_LIST: string, SENDClientMessage: string}}
   * @private
   */
  var IFURIConst = IFURIConstants;

  /**
   * IFClient object
   * @type {{listen: _fnListenToHost, connect: _fnConnectToHost, disconnect: _fnDisconnectFromHost, getUsername: _fnGetUsername, getClients: _fnGetClientListFromHost, getMessages: _fnGetMessages, sendMessageToClient: _fnSendMessageToClient}}
   * @private
   */
  var IFClient = IFClientLibrary(IFURIConst, HASH, Request, Message, Client, Deferred);

  /**
   * Add on message window listener
   */
  window.addEventListener("message", function (__oEvent) {

    /**
     * Listen for messages
     */
    IFClient.listen(__oEvent).then(function (__oRequest) {

      var ___o$Response = _$("#response");
      var ___o$Contacts = _$("#contacts");

      /**
       * Update response
       */
      if (__oRequest.uri === IFURIConst.CONNECT_CLIENT ||
        __oRequest.uri === IFURIConst.DISCONNECT_CLIENT ||
        __oRequest.uri === IFURIConst.SEND_CLIENT_MESSAGE) {
        ___o$Response.val (("%SENDER% > %MESSAGE%\n--\n").replace(/%SENDER%/g, __oRequest.contents.sender).replace(/%MESSAGE%/g, __oRequest.contents.contents) + ___o$Response.val ());
      }

      /**
       * Client list was updated
       */
      else if (__oRequest.uri === IFURIConst.REQUEST_CLIENT_LIST) {

        ___o$Contacts.empty();

        var __oContacts = __oRequest.contents.contents.sort();
        ___o$Contacts.append('<option value = "ALL">ALL</option>');

        for (var n in __oContacts) {
          if (__oContacts [n] === IFClient.getUsername()) {
            continue;
          }
          ___o$Contacts.append("<option value = \"" + __oContacts [n] + "\">" + __oContacts [n] + "</option>");
        }

        ___o$Contacts.index(0);
      }

    });

  });

  /**
   * Remove "message" upon unload
   */
  window.addEventListener("unload", function () {
    window.removeEventListener("message");
  });

  /**
   * Assign the client name
   */
  _$("#clientName").text(IFClient.getUsername());

  /**
   * Assign the send event
   */
  _$("#send").bind("click", function () {

    var __o$Contacts = _$("#contacts");
    var __sMessage = _$("#message").val();

    if (__o$Contacts.val () === "ALL") {
      var oContacts = _$("#contacts>option").map(function() { return $(this).val(); });
      for (var n = 0, nLen = oContacts.length; n < nLen; n++) {
        var oContact = oContacts [n];
        if (oContact === "ALL") {
          continue;
        }
        IFClient.sendMessageToClient(oContact, __sMessage, false);
      }
    }
    else {
      IFClient.sendMessageToClient(__o$Contacts.val (), __sMessage, false);
    }

  });

  /**
   * Connect to the host
   */
  IFClient.connect();
}

/**
 * Upon document ready
 */
$(document).ready (function () {
  fnDocumentOnLoad ($);
});