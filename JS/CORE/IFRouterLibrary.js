'use strict';

/**
 * IFRouter Library
 * @param uriConst
 * @param requestLib
 * @param messageLib
 * @param serverLib
 * @param routerExt
 * @returns {{process: _fnProcessRequest}}
 * @constructor
 */
function ifrouterLibrary(uriConst, requestLib, messageLib, serverLib, routerExt) {

  /**
   * Update client with new client lists
   */
  function updateClientsClientList () {
    var clientList = serverLib.getClientList();
    for (var n = 0, nLen = clientList.length; n < nLen; n++) {
      var sClient = clientList [n];
      serverLib.processRequest(sClient, requestLib.create (sClient, uriConst.REQUEST_CLIENT_LIST, messageLib.create (serverLib.const.SERVER_NAME, sClient, clientList), false).encode ());
    }
  }

  /**
   * Process an encoded request
   * @param encodedRequest
   * @returns {*}
   */
  function _fnProcessRequest(encodedRequest) {

    /**
     * Convert the encoded request into a Request object
     * @type {*}
     */
    var decodedRequest = requestLib.decode(encodedRequest);

    /**
     * Convert the encoded content into a Message object
     * @type {*}
     */
    var message = messageLib.decode (decodedRequest.contents);

    /**
     * Connect a client
     */
    if (decodedRequest.uri === uriConst.CONNECT_CLIENT) {
      serverLib.addClient(decodedRequest.client);
      serverLib.processRequest(decodedRequest.client, decodedRequest.respond (messageLib.create (serverLib.const.SERVER_NAME, decodedRequest.client, "connected to host")).encode ());
      updateClientsClientList ();
    }

    /**
     * Disconnect a client
     */
    else if (decodedRequest.uri === uriConst.DISCONNECT_CLIENT) {
      serverLib.removeClient(decodedRequest.client);
      serverLib.processRequest(decodedRequest.client, decodedRequest.respond (messageLib.create (serverLib.const.SERVER_NAME, decodedRequest.client, "disconnected from host")).encode ());
    }

    /**
     * Get client list
     */
    else if (decodedRequest.uri === uriConst.REQUEST_CLIENT_LIST) {
      serverLib.processRequest(decodedRequest.client, decodedRequest.respond (messageLib.create (serverLib.const.SERVER_NAME, decodedRequest.client, serverLib.getClientList())).encode ());
    }

    /**
     * Send a messageLib to client
     */
    else if (decodedRequest.uri === uriConst.SEND_CLIENT_MESSAGE) {
      serverLib.processRequest(message.recipient, encodedRequest);
    }

    /**
     * Custom server extension routine that needs to be executed
     */
    else if (routerExt) {
      var oResp = routerExt.call(null, uriConst, requestLib, messageLib, serverLib, encodedRequest);
      serverLib.processRequest(oResp.client, oResp.request);
    }

    /**
     * Something equivalent to a 404 (lol)
     */
    else {
      serverLib.processRequest(decodedRequest.client, decodedRequest.respond(messageLib.create(serverLib.const.SERVER_NAME, decodedRequest.client, "you 404'ed!!")).encode());
    }
  }

  /**
   * Public API
   */
  return {
    process: _fnProcessRequest
  };

}