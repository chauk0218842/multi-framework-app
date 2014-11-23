/**
 * API Client Library
 * @param hash - HASH library
 * @param client - Client library
 * @param transmission - Transmission library
 * @param routeConst - Route constant
 * @param packg - Package library
 * @param deferred - Deferred library
 * @returns {{listen: listenToHost, connect: connectToHost, disconnect: disconnectFromHost, getUsername: getUsername, getClients: getClientListFromHost, getRequestLog: getRequestLog, getResponseLog: getResponseLog, sendFiles: sendFilesToClient, sendMessage: sendMessage}}
 */
function apiClientLibrary (hash, client, transmission, routeConst, packg, deferred) {

  'use strict';

  /**
   * Extract the IFrame ID from teh param string
   * @type {string}
   */
  var param = location.toString().replace(/^[^\?]+\?/g, '');

  /**
   * @type {Array}
   */
  var paramList = param.split('&');

  /**
   * Extracted IFrame ID from the URI parameters
   * @type {XML|string|void|*}
   */
  var clientID = paramList [0].replace(/^id=/g, '');

  /**
   * Defer HASH used to track all the promises that need to be resolved
   */
  var deferHASH = hash.create();

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
   * Returns a deferred object
   * @param event
   */
  function listenToHost(event) {

    /**
     * @type {*}
     */
    var trans = client.listen(event);

    /**
     * Find the Defer object that should be resolved
     */
    var defer = deferHASH.get(trans.id);

    /**
     * Keep track of all transmissions received
     */
    responseList.push(trans);

    /**
     * Handle specific requests that require receipts when transmission is made
     * When a client sends a transmission they have the option to enable "receipts" which the recipient upon receiving a transmission
     * must respond with a response message to the sender.
     * TODO implement receipts for client-to-client messaging
     */
    if (defer) {
      defer.resolve(trans);
    }

    console.log(('%CLIENT% > Received a response from host: %RESPONSE%').replace(/%CLIENT%/g, clientID).replace(/%RESPONSE%/g, event.data.toString()));

    return deferred.when (packg.process (trans.package));

  }

  /**
   * Send a message to Host
   * Returns a deferred object
   * @param trans
   * @returns {*}
   */
  function sendTransmissionToHost(trans) {

    /**
     * Create a Defer object that should be resolved later on when the listener receives a response
     */
    var defer = deferHASH.set(trans.id, deferred.create());
    requestList.push(trans);
    client.send(trans);
    console.log(('%CLIENT% > Sent a request to host: "%URI%"').replace(/%CLIENT%/g, clientID).replace(/%URI%/g, trans.uri));

    return defer;
  }

  /**
   * Connect to Host
   * Returns a deferred object
   * @returns {*}
   */
  function connectToHost() {
    return sendTransmissionToHost(transmission.create(routeConst.CONNECT_CLIENT, clientID, null))
      .then(function (transmission) {
        return transmission.package;
      });
  }

  /**
   * Disconnect from Host
   * Returns a deferred object
   * @returns {*}
   */
  function disconnectFromHost() {
    return sendTransmissionToHost(transmission.create(routeConst.DISCONNECT_CLIENT, clientID, null))
      .then(function (transmission) {
        return transmission.package;
      });
  }

  /**
   * Get Clients from Host
   * Returns a deferred object
   * @returns {*}
   */
  function getClientListFromHost() {
    return sendTransmissionToHost(transmission.create(routeConst.REQUEST_CLIENT_LIST, clientID, null))
      .then(function (transmission) {
        return transmission.package;
      });
  }

  /**
   * Send text message to client
   * TODO need to implement use receipts, make note that you are dealing with an array of defers...
   * @param recipients
   * @param body
   * @param useReceipt
   * @returns {*}
   */
  function sendMessage(recipients, body, useReceipt) {

    /**
     * Collection of defers that will be returned
     * @type {Array}
     */
    var defers = [];
    for (var n = 0, nLen = recipients.length; n < nLen; n++) {

      var pkg = packg.create({
        type: packg.const.TEXT_MESSAGE_TYPE,
        sender: clientID,
        recipient: recipients [n],
        body: body,
        receipt: useReceipt
      });

      defers.push(sendTransmissionToHost(transmission.create(routeConst.SEND_CLIENT_PACKAGE, clientID, pkg)));

    }

    return defers;
  }

  /**
   * Send files to a client
   * Returns a deferred object
   * @param recipients
   * @param files
   * @param useReceipt
   * @returns {*}
   */
  function sendFilesToClient(recipients, files, useReceipt) {

    /**
     * @type {Array}
     */
    var defers = [];
    for (var n = 0, nLen = recipients.length; n < nLen; n++) {

      var pkg = packg.create({
        type: packg.const.FILES_TYPE,
        sender: clientID,
        recipient: recipients [n],
        files: files,
        receipt: useReceipt
      });

      defers.push(sendTransmissionToHost(transmission.create(routeConst.SEND_CLIENT_PACKAGE, clientID, pkg)));
    }

    return defers;
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
    sendFiles: sendFilesToClient,
    sendMessage: sendMessage
  };
}