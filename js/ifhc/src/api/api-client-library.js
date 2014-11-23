/**
 * API Client Library
 * Used to allow IFrame Clients to connect to the Host
 * @param hash
 * @param client
 * @param transmission
 * @param routeConst
 * @param attachment
 * @param deferred
 * @returns {{listen: receiveTransmissionFromHost, connect: connectToHost, disconnect: disconnectFromHost, getUsername: getUsername, getClients: getClientListFromHost, getRequestLog: getRequestLog, getResponseLog: getResponseLog, sendMessage: sendMessageToClients, sendFiles: sendFilesToClients}}
 */
function apiClientLibrary(hash, client, transmission, routeConst, attachment, deferred) {

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
   * Cookie cutter for text message sent from the client
   * @param parameters
   * @returns {*}
   */
  function clientAttachmentResponse(parameters) {
    parameters.sender = clientID;
    return attachment.create(parameters);
  }

  /**
   * Receive transmission from Host
   * Returns a deferred object
   * @param event
   */
  function receiveTransmissionFromHost(event) {

    /**
     * Received transmission
     * @type {*}
     */
    var receivedTransmission = client.listen(event);

    /**
     * Find the Defer object that should be resolved
     */
    var defer = deferHASH.get(receivedTransmission.id);

    /**
     * Keep track of all transmissions received
     */
    responseList.push(receivedTransmission);

    /**
     * Handle specific requests that require receipts when transmission is made
     * When a client sends a transmission they have the option to enable "receipts" which the recipient upon receiving a transmission
     * must respond with a response message to the sender.
     * TODO implement receipts for client-to-client messaging
     */
    if (defer) {
      defer.resolve(receivedTransmission);
    }

    console.log(('%CLIENT% > Received a response from host: %RESPONSE%').replace(/%CLIENT%/g, clientID).replace(/%RESPONSE%/g, event.data.toString()));

    return deferred.when(attachment.process(receivedTransmission.attachment));

  }

  /**
   * Send a message to Host
   * Returns a deferred object
   * @param receivedTransmission
   * @returns {*}
   */
  function sendTransmissionToHost(receivedTransmission) {

    /**
     * Create a Defer object that should be resolved later on when the listener receives a response
     */
    var defer = deferHASH.set(receivedTransmission.id, deferred.create());
    requestList.push(receivedTransmission);
    client.send(receivedTransmission);
    console.log(('%CLIENT% > Sent a request to host: "%URI%"').replace(/%CLIENT%/g, clientID).replace(/%URI%/g, receivedTransmission.uri));

    return defer;
  }

  /**
   * Create a transmission and send it to the host
   * TODO make this into a real curried function
   * @param route
   * @param attachment
   * @returns {*}
   */
  function createTransmissionAndSendToHost(route, attachment) {
    return sendTransmissionToHost(transmission.create(route, clientID, attachment))
      .then(function (responseTransmission) {
        return responseTransmission.attachment;
      }
    );
  }

  /**
   * Connect to Host
   * Returns a deferred object
   * @returns {*}
   */
  function connectToHost() {
    return createTransmissionAndSendToHost(routeConst.CONNECT_CLIENT, null);
  }

  /**
   * Disconnect from Host
   * Returns a deferred object
   * @returns {*}
   */
  function disconnectFromHost() {
    return createTransmissionAndSendToHost(routeConst.DISCONNECT_CLIENT, null);
  }

  /**
   * Get Username
   * @returns {XML|string|void|*}
   */
  function getUsername() {
    return clientID;
  }

  /**
   * Get Clients from Host
   * Returns a deferred object
   * @returns {*}
   */
  function getClientListFromHost() {
    return createTransmissionAndSendToHost(routeConst.REQUEST_CLIENT_LIST, null);
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
   * Send attachment to clients
   * @param clients
   * @param sendAttachment
   * @returns {Array}
   */
  function sendAttachmentToClients(clients, sendAttachment) {

    /**
     * Collection of defers that will be returned
     * @type {Array}
     */
    var deferList = [];
    for (var n = 0, nLen = clients.length; n < nLen; n++) {

      /**
       * Update the attachment's recipient
       * TODO - need to create a attachment.updateReceipient function...
       */
      sendAttachment.recipient = clients [n];

      /**
       * TODO when implementing use receipt, we need to figure out how to capture the responses and post process them
       */
      deferList.push(createTransmissionAndSendToHost(routeConst.SEND_CLIENT_ATTACHMENT, sendAttachment));

    }

    return deferList;
  }

  /**
   * Send text message to client
   * TODO need to implement use receipts, make note that you are dealing with an array of defers...
   * TODO make use currying and curry with sendAttachmentToClients
   * @param clients
   * @param body
   * @param useReceipt
   * @returns {*}
   */
  function sendMessageToClients(clients, body, useReceipt) {

    /**
     * TODO recipient is null... not sure if thats a good idea
     */
    var sendAttachment = clientAttachmentResponse({
      type: attachment.const.TEXT_MESSAGE_TYPE,
      recipient: null,
      body: body,
      receipt: useReceipt
    });

    return sendAttachmentToClients(clients, sendAttachment);
  }

  /**
   * Send files to a client
   * TODO need to implement use receipts, make note that you are dealing with an array of defers...
   * TODO make use currying and curry with sendAttachmentToClients
   * @param recipients
   * @param files
   * @param useReceipt
   * @returns {*}
   */
  function sendFilesToClients(recipients, files, useReceipt) {

    /**
     * TODO recipient is null... not sure if thats a good idea
     */
    var sendAttachment = clientAttachmentResponse({
      type: attachment.const.FILES_TYPE,
      recipient: null,
      files: files,
      receipt: useReceipt
    });

    return sendAttachmentToClients(recipients, sendAttachment);
  }

  /**
   * Public API
   */
  return {
    listen: receiveTransmissionFromHost,
    connect: connectToHost,
    disconnect: disconnectFromHost,
    getUsername: getUsername,
    getClients: getClientListFromHost,
    getRequestLog: getRequestLog,
    getResponseLog: getResponseLog,
    sendMessage: sendMessageToClients,
    sendFiles: sendFilesToClients
  };
}