/**
 * API Router Library
 * Used by the api-host-library to process incoming transmission request as a route, and responds back to request with a server response
 * TODO -  may want to consider including a promise library that is dependent on the version of the JS Framework used...
 * @param transmission - Transmission library
 * @param server - Server library
 * @param attachment - Attachment library
 * @param routeConst - Route constant
 * @param routerExt - Custom Router Extension TODO - need to implement this feature
 * @returns {{const: *, process: processTransmission}}
 */
function apiRouterLibrary(transmission, server, attachment, routeConst, routerExt) {

  'use strict';

  /**
   * Transmission Processor
   * @type {{}}
   */
  var transmissionProcessor = {};

  /**
   * Cookie cutter for text message sent from the server
   * @param parameters
   * @returns {*}
   */
  function serverAttachmentResponse(parameters) {
    parameters.sender = server.const.SERVER_NAME;
    return attachment.create(parameters);
  }

  /**
   * Connect a client
   * @param receivedTransmission
   */
  function connectClient(receivedTransmission) {

    var sendAttachment = serverAttachmentResponse({
      type: attachment.const.TEXT_MESSAGE_TYPE,
      recipient: receivedTransmission.client,
      body: ('Connected to %SERVER%').replace(/%SERVER%/g, server.const.SERVER_NAME),
      receipt: false
    });

    server.connectClient(receivedTransmission.client);
    server.send(receivedTransmission.client, transmission.createResponse(receivedTransmission, sendAttachment));
  }

  /**
   * Disconnect a client
   * @param receivedTransmission
   */
  function disconnectClient(receivedTransmission) {

    var sendAttachment = serverAttachmentResponse({
      type: attachment.const.TEXT_MESSAGE_TYPE,
      recipient: receivedTransmission.client,
      body: ('Disconnected from %SERVER%').replace(/%SERVER%/g, server.const.SERVER_NAME),
      receipt: false
    });

    server.disconnectClient(receivedTransmission.client);
    server.send(receivedTransmission.client, transmission.createResponse(receivedTransmission, sendAttachment));
  }

  /**
   * Create a client list that excludes the request client
   * @param clientID
   */
  function createClientList(clientID) {
    var list = server.getConnectedClients();
    var newList = [];
    for (var n = 0, nLen = list.length; n < nLen; n++) {
      if (list [n] === clientID) {
        continue;
      }
      newList.push(list [n]);
    }

    return newList;
  }

  /**
   * Calls server api to message clients with a refreshed connected client list
   * (Occurs whenever a new client joins the network)
   */
  function updateClientsClientList() {

    var clientList = server.getConnectedClients();

    /**
     * Respond back to the client that made the request
     */
    for (var n = 0, nLen = clientList.length; n < nLen; n++) {
      var clientID = clientList [n];

      /**
       * Create a client list attachment
       */
      var sendAttachment = serverAttachmentResponse({
        type: attachment.const.CLIENT_LIST_TYPE,
        recipient: clientID,
        list: createClientList(clientID),
        receipt: false
      });

      /**
       * Respond back to client with a transmission response
       */
      server.send(clientID, transmission.create(routeConst.REQUEST_CLIENT_LIST, clientID, sendAttachment));
    }
  }

  /**
   * Calls server api to respond back to client's request for a refreshed connected client list
   * @param receivedTransmission
   */
  function getClientList(receivedTransmission) {

    /**
     * Create a client list attachment
     */
    var sendAttachment = serverAttachmentResponse({
      type: attachment.const.CLIENT_LIST_TYPE,
      recipient: receivedTransmission.client,
      list: createClientList(receivedTransmission.client),
      receipt: false
    });

    /**
     * Respond back to the client that made the request
     */
    server.send(receivedTransmission.client, transmission.createResponse(receivedTransmission, sendAttachment));
  }

  /**
   * Forward a client a Attachment
   * @param receivedTransmission
   */
  function sendClientAttachment(receivedTransmission) {

    /**
     * Extract the recipient from the parameters
     */
    server.send(receivedTransmission.attachment.recipient, transmission.createResponse(receivedTransmission, receivedTransmission.attachment));
  }

  /**
   * A bad route / invalid URI
   * @param receivedTransmission
   */
  function handleInvalidRequest(receivedTransmission) {

    var sendAttachment = serverAttachmentResponse({
      type: attachment.const.TEXT_MESSAGE_TYPE,
      recipient: receivedTransmission.client,
      body: 'You 404\'ed!!',
      receipt: false
    });

    server.send(receivedTransmission.client, transmission.createResponse(receivedTransmission, sendAttachment));
  }

  /**
   * Connect a client
   */
  transmissionProcessor [routeConst.CONNECT_CLIENT] = function transmissionProcessorConnectClient(receivedTransmission) {
    connectClient(receivedTransmission);
    updateClientsClientList();
  };

  /**
   * Disconnect a client
   */
  transmissionProcessor [routeConst.DISCONNECT_CLIENT] = function transmissionProcessorDisconnectClient(receivedTransmission) {
    disconnectClient(receivedTransmission);
    updateClientsClientList();
  };

  /**
   * Get client list
   */
  transmissionProcessor [routeConst.REQUEST_CLIENT_LIST] = function transmissionProcessorRequestClientList(receivedTransmission) {
    getClientList(receivedTransmission);
  };

  /**
   * Send a transmission to client
   */
  transmissionProcessor [routeConst.SEND_CLIENT_ATTACHMENT] = function transmissionProcessorSendClientAttachment(receivedTransmission) {
    sendClientAttachment(receivedTransmission);
  };

  /**
   * Something equivalent to a 404 (lol)
   */
  transmissionProcessor [routeConst.INVALID_REQUEST] = handleInvalidRequest;

  /**
   * Process an encoded trans
   * @param receivedTransmission
   * @returns {*}
   */
  function processTransmission(receivedTransmission) {

    /**
     * Handle the request
     */
    if (transmissionProcessor [receivedTransmission.uri]) {
      return transmissionProcessor [receivedTransmission.uri](receivedTransmission);
    }

    /**
     * Custom server extension routine that needs to be executed
     * TODO we need to test this
     */
    else if (routerExt) {
      //var oResp = routerExt.call(null, routeConst, transmission, transmission, server, trans);
      //return server.send(oResp.client, oResp.trans);
    }

    /**
     * Something equivalent to a 404 (lol)
     */
    return transmissionProcessor [routeConst.INVALID_REQUEST](receivedTransmission);
  }

  /**
   * Public API
   */
  return {
    const: routeConst,
    process: processTransmission
  };
}