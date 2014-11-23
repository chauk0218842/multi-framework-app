/**
 * API Router Library
 * @param transmission - Transmission library
 * @param server - Server library
 * @param packg - Package library
 * @param routeConst - Route constant
 * @param routerExt - Custom Router Extension TODO - need to implement this feature
 * @returns {{const: *, process: processTransmission}}
 */
function apiRouterLibrary(transmission, server, packg, routeConst, routerExt) {

  'use strict';

  /**
   * Add a client
   * @param receivedTrans
   */
  function addClient(receivedTrans) {

    var sendPackage = packg.create({
      type: packg.const.TEXT_MESSAGE_TYPE,
      sender: server.const.SERVER_NAME,
      recipient: receivedTrans.client,
      body: 'Connected to host',
      useReceipt: false
    });

    server.addClient(receivedTrans.client);
    server.send(receivedTrans.client, transmission.createResponse(receivedTrans, sendPackage));
  }

  /**
   * Remove Client
   * @param receivedTrans
   */
  function removeClient(receivedTrans) {

    var sendPackage = packg.create({
      type: packg.const.TEXT_MESSAGE_TYPE,
      sender: server.const.SERVER_NAME,
      recipient: receivedTrans.client,
      body: 'Disconnected from host',
      useReceipt: false
    });

    server.removeClient(receivedTrans.client);
    server.send(receivedTrans.client, transmission.createResponse(receivedTrans, sendPackage));
  }

  /**
   * Create a client list that excludes the client hiimself
   * @param client
   */
  function createClientList (client) {
    var list = server.getClientList();
    var newList = [];
    for (var n = 0, nLen = list.length; n < nLen; n++) {
      if (list [n] === client) {
        continue;
      }
      newList.push (list [n]);
    }

    return newList;
  }

  /**
   * Update client with new client lists
   */
  function updateClientsClientList() {

    var clientList = server.getClientList();
    /**
     * Respond back to the client that made the request
     */
    for (var n = 0, nLen = clientList.length; n < nLen; n++) {
      var sClient = clientList [n];

      var sendPackage = packg.create({
        type: packg.const.CLIENT_LIST_TYPE,
        list: createClientList (sClient)
      });

      server.send(sClient, transmission.create(routeConst.REQUEST_CLIENT_LIST, sClient, sendPackage));
    }
  }

  /**
   * Send a client the list of connect clients
   * @param receivedTrans
   */
  function getClientList(receivedTrans) {

    var sendPackage = packg.create({
      type: packg.const.CLIENT_LIST_TYPE,
      list: createClientList (receivedTrans.client)
    });

    /**
     * Respond back to the client that made the request
     */
    server.send(receivedTrans.client, transmission.createResponse(receivedTrans, sendPackage));
  }

  /**
   * Forward a client a package
   * @param receivedTrans
   */
  function sendClientPackage(receivedTrans) {

    /**
     * Extract the recipient from the parameters
     */
    server.send(receivedTrans.package.recipient, transmission.createResponse(receivedTrans, receivedTrans.package));
  }

  /**
   * Bad route
   * @param receivedTrans
   */
  function badRoute(receivedTrans) {

    var sendPackage = packg.create({
      type: packg.const.TEXT_MESSAGE_TYPE,
      sender: server.const.SERVER_NAME,
      recipient: receivedTrans.client,
      body: 'you 404\'ed!!',
      useReceipt: false
    });

    server.send(receivedTrans.client, transmission.createResponse(receivedTrans, sendPackage));
  }

  /**
   * Process an encoded trans
   * @param receivedTrans
   * @returns {*}
   */
  function processTransmission(receivedTrans) {

    /**
     * Connect a client
     */
    if (receivedTrans.uri === routeConst.CONNECT_CLIENT) {
      addClient(receivedTrans);
      updateClientsClientList();
    }

    /**
     * Disconnect a client
     */
    else if (receivedTrans.uri === routeConst.DISCONNECT_CLIENT) {
      removeClient(receivedTrans);
      updateClientsClientList();
    }

    /**
     * Get client list
     */
    else if (receivedTrans.uri === routeConst.REQUEST_CLIENT_LIST) {
      getClientList(receivedTrans);
    }

    /**
     * Send a transmission to client
     */
    else if (receivedTrans.uri === routeConst.SEND_CLIENT_PACKAGE) {
      sendClientPackage(receivedTrans);
    }

    /**
     * Custom server extension routine that needs to be executed
     * TODO we need to test this
     */
    else if (routerExt) {
      //var oResp = routerExt.call(null, routeConst, transmission, transmission, server, trans);
      //server.send(oResp.client, oResp.trans);
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
    const: routeConst,
    process: processTransmission
  };
}