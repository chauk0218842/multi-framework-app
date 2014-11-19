'use strict';

/**
 * IFrame Client Library
 * @param uriConst
 * @param hashLib
 * @param requestLib
 * @param messageLib
 * @param clientLib
 * @param deferredLib
 * @returns {{listen: listenToHost, connect: connectToHost, disconnect: disconnectFromHost, getUsername: getUsername, getClients: getClientListFromHost, getRequestLog: getRequestLog, getResponseLog: getResponseLog, sendMessageToClient: _fnSendMessageToClient}}
 * @constructor
 */
function ifclientLibrary(uriConst, hashLib, requestLib, messageLib, clientLib, deferredLib) {

  /**
   * Extract the IFrame ID from teh param string
   * @type {string}
   */
  var param = location.toString().replace(/^[^\?]+\?/g, "");
  var paramList = param.split("&");

  /**
   * Extracted IFrame ID from the URI parameters
   * @type {XML|string|void|*}
   */
  var clientID = paramList [0].replace(/^id=/g, "");

  /**
   * Defer HASH used to track all the promises that need to be resolved
   * @type {{reject: Deferred.reject, resolve: Deferred.resolve, promise: (*|Deferred._fnGenerateDefer.promise|fnDeferCreate_JQuery.promise|Deferred.fnGenerateDefer.promise|jQuery.promise|promise.promise), then: _fnThen}|{reject: (*|fnDeferCreate_JQuery.reject|Deferred.fnGenerateDefer.reject|DeferredLibrary._fnGenerateDeferred.reject|jQuery.Deferred.reject|Deferred.reject), resolve: (*|fnDeferCreate_JQuery.resolve|Deferred.fnGenerateDefer.resolve|DeferredLibrary._fnGenerateDeferred.resolve|jQuery.Deferred.resolve|Deferred.resolve), promise: (*|fnDeferCreate_JQuery.promise|Deferred.fnGenerateDefer.promise|DeferredLibrary._fnGenerateDeferred.promise|jQuery.promise|promise.promise), then: (*|fnDeferCreate_JQuery.then|Deferred.fnGenerateDefer.then|DeferredLibrary._fnGenerateDeferred.then|promise.then|Promise.then)}|{set: setInBucket, remove: removeFromBucket}|{id: (string|*), host: (XML|string|void|*), urn: (XML|string|void|*), contents: *, receipt: *}|*}
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

    var defer;

    /**
     * The event data needs to be decoded back into a Request object
     * @type {*}
     */
    var request = requestLib.decode(clientLib.listen(event));

    /**
     * TODO need to make this conversion a bit more elegant, either create a new object type Response which is essentially a Request object..
     * Or rename Request to be more of a two-way binded variable name
     * @type {*}
     */
    request.contents = messageLib.decode(request.contents);

    defer = deferHASH.get(request.id);

    responseList.push(request);

    /**
     * Handle specific requests
     */
    if (defer) {
      defer.resolve(request);
    }

    console.log(("%CLIENT% > Received a response from host:\n%RESPONSE%\n").replace(/%CLIENT%/g, clientID).replace(/%RESPONSE%/g, event.data.toString()));

    return deferredLib.when(request);
  }

  /**
   * Send a message to Host
   * @param request
   * @returns {*}
   */
  function sendRequestToHost(request) {
    var defer = deferHASH.set(request.id, deferredLib.create());
    requestList.push(request);
    clientLib.send(request.encode());

    console.log(("%CLIENT% > Sent a request to host:\n%REQUEST%\n").replace(/%CLIENT%/g, clientID).replace(/%REQUEST%/g, request.encode()));

    return defer;
  }

  /**
   * Connect to Host
   * @returns {*}
   */
  function connectToHost() {
    return sendRequestToHost(requestLib.create(clientID, uriConst.CONNECT_CLIENT, null, false))
      .then(function (request) {
        return request.contents.contents;
      });
  }

  /**
   * Disconnect from Host
   * @returns {*}
   */
  function disconnectFromHost() {
    return sendRequestToHost(requestLib.create(clientID, uriConst.DISCONNECT_CLIENT, null, false))
      .then(function (request) {
        return request.contents.contents;
      });
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
   * @returns {*}
   */
  function getClientListFromHost() {
    return sendRequestToHost(requestLib.create(clientID, uriConst.REQUEST_CLIENT_LIST, null, false))
      .then(function (request) {
        return request.contents.contents;
      });
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
   * Send message to client
   * @param recipientID
   * @param contents
   * @param useReceipt
   * @returns {*}
   */
  function _fnSendMessageToClient(recipientID, contents, useReceipt) {
    return sendRequestToHost(requestLib.create(clientID, uriConst.SEND_CLIENT_MESSAGE, messageLib.create(clientID, recipientID, contents), useReceipt))
      .then(function (request) {
        return request.contents;
      });
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
    sendMessageToClient: _fnSendMessageToClient
  };
}
