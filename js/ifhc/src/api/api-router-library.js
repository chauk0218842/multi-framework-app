/**
 * API Router Library
 * @param transmission
 * @param server
 * @param packg
 * @param routeConst
 * @param routerExt
 * @returns {{const: *, process: processTransmission}}
 */
function apiRouterLibrary(transmission, server, packg, routeConst, routerExt) {

  'use strict';

  /**
   * Add a client
   * @param trans
   */
  function addClient(trans) {

    var pkg = packg.create({
      type: packg.const.TEXT_MESSAGE_TYPE,
      sender: server.const.SERVER_NAME,
      recipient: trans.client,
      body: 'Connected to host',
      useReceipt: false
    });

    server.addClient(trans.client);
    server.send(trans.client, transmission.createResponse(trans, pkg));
  }

  /**
   * Remove Client
   * @param trans
   */
  function removeClient(trans) {

    var pkg = packg.create({
      type: packg.const.TEXT_MESSAGE_TYPE,
      sender: server.const.SERVER_NAME,
      recipient: trans.client,
      body: 'Disconnected from host',
      useReceipt: false
    });

    server.removeClient(trans.client);
    server.send(trans.client, transmission.createResponse(trans, pkg));
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

      var pkg = packg.create({
        type: packg.const.CLIENT_LIST_TYPE,
        list: createClientList (sClient)
      });

      server.send(sClient, transmission.create(routeConst.REQUEST_CLIENT_LIST, sClient, pkg));
    }
  }

  /**
   * Send a client the list of connect clients
   * @param trans
   */
  function getClientList(trans) {

    var pkg = packg.create({
      type: packg.const.CLIENT_LIST_TYPE,
      list: createClientList (trans.client)
    });

    /**
     * Respond back to the client that made the request
     */
    server.send(trans.client, transmission.createResponse(trans, pkg));
  }

  /**
   * Forward a client a package
   * @param trans
   */
  function sendClientPackage(trans) {

    /**
     * Extract the recipient from the parameters
     */
    server.send(trans.package.recipient, transmission.createResponse(trans, trans.package));
  }

  /**
   * Bad route
   * @param trans
   */
  function badRoute(trans) {

    var pkg = packg.create({
      type: packg.const.TEXT_MESSAGE_TYPE,
      sender: server.const.SERVER_NAME,
      recipient: trans.client,
      body: 'you 404\'ed!!',
      useReceipt: false
    });

    server.send(trans.client, transmission.createResponse(trans, pkg));
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
    if (trans.uri === routeConst.CONNECT_CLIENT) {
      addClient(trans);
      updateClientsClientList();
    }

    /**
     * Disconnect a client
     */
    else if (trans.uri === routeConst.DISCONNECT_CLIENT) {
      removeClient(trans);
      updateClientsClientList();
    }

    /**
     * Get client list
     */
    else if (trans.uri === routeConst.REQUEST_CLIENT_LIST) {
      getClientList(trans);
    }

    /**
     * Send a transmission to client
     */
    else if (trans.uri === routeConst.SEND_CLIENT_PACKAGE) {
      sendClientPackage(trans);
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