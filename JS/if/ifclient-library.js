/**
 * IFrame Client Library
 * @param uriConst
 * @param hashLib
 * @param transLib
 * @param packLib
 * @param clientLib
 * @param deferredLib
 * @returns {{listen: listenToHost, connect: connectToHost, disconnect: disconnectFromHost, getUsername: getUsername, getClients: getClientListFromHost, getRequestLog: getRequestLog, getResponseLog: getResponseLog, sendMessageToClient: sendMessageToClient}}
 * @constructor
 */
function ifclientLibrary(uriConst, hashLib, transLib, packLib, clientLib, deferredLib) {

  'use strict';

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
    var trans = clientLib.listen (event);

    /**
     * Find the Defer object that should be resolved
     */
    var defer = deferHASH.get(trans.id);

    responseList.push(trans);

    /**
     * Handle specific requests
     */
    if (defer) {
      defer.resolve(trans);
    }

    console.log(('%CLIENT% > Received a response from host: %RESPONSE%').replace(/%CLIENT%/g, clientID).replace(/%RESPONSE%/g, event.data.toString()));

    return deferredLib.when(trans.package);
  }

  /**
   * Send a message to Host
   * @param message
   * @returns {*}
   */
  function sendTransmissionToHost(trans) {

    /**
     * Create a Defer object that should be resolved later on when the listener receives a response
     */
    var defer = deferHASH.set(trans.id, deferredLib.create());
    requestList.push(trans);
    clientLib.send(trans);
    console.log(('%CLIENT% > Sent a request to host: "%URI%"').replace(/%CLIENT%/g, clientID).replace(/%URI%/g, trans.uri));

    return defer;
  }

  /**
   * Connect to Host
   * @returns {*}
   */
  function connectToHost() {
    return sendTransmissionToHost(transLib.create(uriConst.CONNECT_CLIENT, clientID, null))
      .then(function (transmission) {
        return transmission.package;
      });
  }

  /**
   * Disconnect from Host
   * @returns {*}
   */
  function disconnectFromHost() {
    return sendTransmissionToHost(transLib.create(uriConst.DISCONNECT_CLIENT, clientID, null))
      .then(function (transmission) {
        return transmission.package;
      });
  }

  /**
   * Get Clients from Host
   * @returns {*}
   */
  function getClientListFromHost() {
    return sendTransmissionToHost(transLib.create(uriConst.REQUEST_CLIENT_LIST, clientID, null))
      .then(function (transmission) {
        return transmission.package;
      });
  }

  /**
   * Send text message to client
   * @param recipientID
   * @param body
   * @param useReceipt
   * @returns {*}
   */
  function sendMessage(recipientID, body, useReceipt) {

    var pkg = packLib.create ({
      type: packLib.const.TEXT_MESSAGE_TYPE,
      sender: clientID,
      recipient: recipientID,
      body: body,
      useReceipt: useReceipt
    });

    return sendTransmissionToHost(transLib.create(uriConst.SEND_CLIENT_PACKAGE, clientID, pkg))
  }

  /**
   * Send files to a client
   * @param recipientID
   * @param files
   * @param useReceipt
   * @returns {*}
   */
  function sendFilesToClient(recipientID, files, useReceipt) {

    var pkg = packLib.create ({
      type: packLib.const.FILE_TYPE,
      sender: clientID,
      recipient: recipientID,
      files: files,
      useReceipt: useReceipt
    });

    return sendTransmissionToHost(transLib.create(uriConst.SEND_CLIENT_PACKAGE, clientID, pkg))
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
