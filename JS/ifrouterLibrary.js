'use strict';

/**
 * IFRouter Library
 * @param uriConst
 * @param messageLib
 * @param messageLib
 * @param serverLib
 * @param routerExt
 * @returns {{process: processMessage}}
 * @constructor
 */
function ifrouterLibrary(uriConst, messageLib, serverLib, routerExt) {

  /**
   * Add a client
   * @param message
   */
  function addClient(message) {

    var parameters = {
      type: "text",
      sender: serverLib.const.SERVER_NAME,
      recipient: message.client,
      body: 'connected to host',
      receipt: false
    };

    serverLib.addClient(message.client);
    serverLib.sendMessage(message.client, messageLib.createResponse(message, parameters));
  }

  /**
   * Remove Client
   * @param message
   */
  function removeClient(message) {

    var parameters = {
      type: "text",
      sender: serverLib.const.SERVER_NAME,
      recipient: message.client,
      body: 'disconnected from host',
      receipt: false
    };

    serverLib.removeClient(message.client);
    serverLib.sendMessage(message.client, messageLib.createResponse(message, parameters));
  }

  /**
   * Update client with new client lists
   */
  function updateClientsClientList() {

    var clientList = serverLib.getClientList();

    /**
     * Respond back to the client that made the request
     */
    var parameters = {
      type: "contacts",
      contacts: clientList
    };

    for (var n = 0, nLen = clientList.length; n < nLen; n++) {
      var sClient = clientList [n];
      serverLib.sendMessage(sClient, messageLib.create(uriConst.REQUEST_CLIENT_LIST, sClient, parameters));
    }
  }

  /**
   * Send a client the list of connect clients
   * @param message
   */
  function getClientList(message) {

    /**
     * Respond back to the client that made the request
     */
    var parameters = {
      type: "contacts",
      contacts: serverLib.getClientList()
    };

    serverLib.sendMessage(message.client, messageLib.createResponse(message, parameters));
  }

  /**
   * Send a client a message
   * @param message
   */
  function sendClientMessage(message) {

    /**
     * Extract the recipient from the parameters
     */
    serverLib.sendMessage(message.parameters.recipient, messageLib.createResponse(message, message.parameters));
  }

  /**
   * Bad route
   * @param message
   */
  function badRoute(message) {
    serverLib.sendMessage(message.client, messageLib.createResponse(message, "you 404'ed!!"));
  }

  /**
   * Process an encoded message
   * @param message
   * @returns {*}
   */
  function processMessage(message) {

    /**
     * Connect a client
     */
    if (message.uri === uriConst.CONNECT_CLIENT) {
      addClient(message);
      updateClientsClientList();
    }

    /**
     * Disconnect a client
     */
    else if (message.uri === uriConst.DISCONNECT_CLIENT) {
      removeClient(message);
      updateClientsClientList();
    }

    /**
     * Get client list
     */
    else if (message.uri === uriConst.REQUEST_CLIENT_LIST) {
      getClientList(message);
    }

    /**
     * Send a messageLib to client
     */
    else if (message.uri === uriConst.SEND_CLIENT_MESSAGE) {
      sendClientMessage(message);
    }

    /**
     * Custom server extension routine that needs to be executed
     * TODO we need to test this
     */
    else if (routerExt) {
      //var oResp = routerExt.call(null, uriConst, messageLib, messageLib, serverLib, message);
      //serverLib.sendMessage(oResp.client, oResp.message);
    }

    /**
     * Something equivalent to a 404 (lol)
     */
    else {
      badRoute(message);
    }
  }

  /**
   * Public API
   */
  return {
    process: processMessage
  };

}