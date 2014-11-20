'use strict';

/**
 * IFrame Client Library
 * @param uriConst
 * @param hashLib
 * @param messageLib
 * @param clientLib
 * @param deferredLib
 * @returns {{listen: listenToHost, connect: connectToHost, disconnect: disconnectFromHost, getUsername: getUsername, getClients: getClientListFromHost, getRequestLog: getRequestLog, getResponseLog: getResponseLog, sendMessageToClient: sendMessageToClient}}
 * @constructor
 */
function ifclientLibrary(uriConst, hashLib, messageLib, clientLib, deferredLib) {

  /**
   * Extract the IFrame ID from teh param string
   * @type {string}
   */
  var param = location.toString().replace(/^[^\?]+\?/g, '');
  var paramList = param.split('&');

  /**
   * Extracted IFrame ID from the URI parameters
   * @type {XML|string|void|*}
   */
  var clientID = paramList [0].replace(/^id=/g, '');

  /**
   * Defer HASH used to track all the promises that need to be resolved
   */
  var deferHASH = hashLib.create();

  /**
   * A collection of all Client requests
   * @type {Array}
   */
  var requestList = [];

  /**
   * A collection of all Host responses
   * @type {Array}
   */
  var responseList = [];

  /**
   * Listen to Host
   * @param event
   */
  function listenToHost(event) {

    /**
     * @type {*}
     */
    var message = clientLib.listen (event);

    /**
     * Find the Defer object that should be resolved
     */
    var defer = deferHASH.get(message.id);

    responseList.push(message);

    /**
     * Handle specific requests
     */
    if (defer) {
      defer.resolve(message);
    }

    console.log(('%CLIENT% > Received a response from host: %RESPONSE%').replace(/%CLIENT%/g, clientID).replace(/%RESPONSE%/g, event.data.toString()));

    return deferredLib.when(message);
  }

  /**
   * Send a message to Host
   * @param message
   * @returns {*}
   */
  function sendMessageToHost(message) {

    /**
     * Create a Defer object that should be resolved later on when the listener receives a response
     */
    var defer = deferHASH.set(message.id, deferredLib.create());
    requestList.push(message);

    clientLib.send(message);
    console.log(('%CLIENT% > Sent a request to host: "%URI%"').replace(/%CLIENT%/g, clientID).replace(/%URI%/g, message.uri));

    return defer;
  }

  /**
   * Connect to Host
   * @returns {*}
   */
  function connectToHost() {
    return sendMessageToHost(messageLib.create(uriConst.CONNECT_CLIENT, clientID, null))
      .then(function (message) {
        return message.parameters.body;
      });
  }

  /**
   * Disconnect from Host
   * @returns {*}
   */
  function disconnectFromHost() {
    return sendMessageToHost(messageLib.create(uriConst.DISCONNECT_CLIENT, clientID, null))
      .then(function (message) {
        return message.parameters.body;
      });
  }

  /**
   * Get Clients from Host
   * @returns {*}
   */
  function getClientListFromHost() {
    return sendMessageToHost(messageLib.create(uriConst.REQUEST_CLIENT_LIST, clientID, null))
      .then(function (message) {
        return message.parameters.contacts;
      });
  }

  /**
   * Send message to client
   * @param recipientID
   * @param contents
   * @param useReceipt
   * @returns {*}
   */
  function sendMessageToClient(recipientID, text, useReceipt) {

    var parameters = {
      type: "text",
      sender: clientID,
      recipient: recipientID,
      body: text,
      receipt: useReceipt
    };

    return sendMessageToHost(messageLib.create(uriConst.SEND_CLIENT_MESSAGE, clientID, parameters))
  }

  /**
   * Get Username
   * @returns {XML|string|void|*}
   */
  function getUsername() {
    return clientID;
  }

  /**
   * Get all client-to-host requests
   * @returns {Array}
   */
  function getRequestLog() {
    return requestList;
  }

  /**
   * Get all host-to-client responses
   * @returns {Array}
   */
  function getResponseLog() {
    return responseList;
  }

  /**
   * Public API
   */
  return {
    listen: listenToHost,
    connect: connectToHost,
    disconnect: disconnectFromHost,
    getUsername: getUsername,
    getClients: getClientListFromHost,
    getRequestLog: getRequestLog,
    getResponseLog: getResponseLog,
    sendMessageToClient: sendMessageToClient
  };
}
