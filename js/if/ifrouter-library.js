/**
 * IFRouter Library
 * @param uriConst
 * @param transLib
 * @param packLib
 * @param serverLib
 * @param routerExt
 * @returns {{process: processMessage}}
 * @constructor
 */
function ifrouterLibrary(uriConst, transLib, packLib, serverLib, routerExt) {

  'use strict';

  /**
   * Add a client
   * @param message
   */
  function addClient(trans) {

    var pkg = packLib.create({
      type: packLib.const.TEXT_MESSAGE_TYPE,
      sender: serverLib.const.SERVER_NAME,
      recipient: trans.client,
      body: 'Connected to host',
      useReceipt: false
    });

    serverLib.addClient(trans.client);
    serverLib.send(trans.client, transLib.createResponse(trans, pkg));
  }

  /**
   * Remove Client
   * @param trans
   */
  function removeClient(trans) {

    var pkg = packLib.create({
      type: packLib.const.TEXT_MESSAGE_TYPE,
      sender: serverLib.const.SERVER_NAME,
      recipient: trans.client,
      body: 'Disconnected from host',
      useReceipt: false
    });

    serverLib.removeClient(trans.client);
    serverLib.send(trans.client, transLib.createResponse(trans, pkg));
  }

  /**
   * Update client with new client lists
   */
  function updateClientsClientList() {

    var clientList = serverLib.getClientList();
    var pkg = packLib.create({type: packLib.const.CLIENT_LIST_TYPE, list: clientList});

    /**
     * Respond back to the client that made the request
     */
    for (var n = 0, nLen = clientList.length; n < nLen; n++) {
      var sClient = clientList [n];
      serverLib.send(sClient, transLib.create(uriConst.REQUEST_CLIENT_LIST, sClient, pkg));
    }
  }

  /**
   * Send a client the list of connect clients
   * @param trans
   */
  function getClientList(trans) {

    var pkg = packLib.create({type: packLib.const.CLIENT_LIST_TYPE, list: serverLib.getClientList()});

    /**
     * Respond back to the client that made the request
     */
    serverLib.send(trans.client, transLib.createResponse(trans, pkg));
  }

  /**
   * Forward a client a package
   * @param trans
   */
  function sendClientPackage(trans) {

    /**
     * Extract the recipient from the parameters
     */
    serverLib.send(trans.package.recipient, transLib.createResponse(trans, trans.package));
  }

  /**
   * Bad route
   * @param trans
   */
  function badRoute(trans) {

    var pkg = packLib.create({
      type: packLib.const.TEXT_MESSAGE_TYPE,
      sender: serverLib.const.SERVER_NAME,
      recipient: trans.client,
      body: 'you 404\'ed!!',
      useReceipt: false
    });

    serverLib.send(trans.client, transLib.createResponse(trans, pkg));
  }

  /**
   * Process an encoded trans
   * @param trans
   * @returns {*}
   */
  function processTransmission(trans) {

    /**
     * Connect a client
     */
    if (trans.uri === uriConst.CONNECT_CLIENT) {
      addClient(trans);
      updateClientsClientList();
    }

    /**
     * Disconnect a client
     */
    else if (trans.uri === uriConst.DISCONNECT_CLIENT) {
      removeClient(trans);
      updateClientsClientList();
    }

    /**
     * Get client list
     */
    else if (trans.uri === uriConst.REQUEST_CLIENT_LIST) {
      getClientList(trans);
    }

    /**
     * Send a transLib to client
     */
    else if (trans.uri === uriConst.SEND_CLIENT_PACKAGE) {
      sendClientPackage(trans);
    }

    /**
     * Custom server extension routine that needs to be executed
     * TODO we need to test this
     */
    else if (routerExt) {
      //var oResp = routerExt.call(null, uriConst, transLib, transLib, serverLib, trans);
      //serverLib.send(oResp.client, oResp.trans);
    }

    /**
     * Something equivalent to a 404 (lol)
     */
    else {
      badRoute(trans);
    }
  }

  /**
   * Public API
   */
  return {
    process: processTransmission
  };

}