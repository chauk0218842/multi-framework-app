'use strict';

/**
 * Server Library
 * @param serverConst
 * @param hash
 * @returns {{Const: *, addClient: addClient, removeClient: removeClient, getClientList: getclientList, processRequest: processRequest}}
 * @constructor
 */
function serverLibrary(serverConst, hashLib) {

  /**
   * List of connected clients
   * @type {Array}
   */
  var clientList = [];

  /**
   * List of IFrames stored in a HASH
   * @type {{reject: Deferred.reject, resolve: Deferred.resolve, promise: (*|deferredLibrary.createDefer.promise|jQuery.promise|promise.promise|Deferred._fnGenerateDefer.promise|fnDeferCreate_JQuery.promise), then: then}|{reject: (*|deferredLibrary.createDefer.reject|jQuery.Deferred.reject|Deferred.reject|Function|$Q.reject), resolve: (*|deferredLibrary.createDefer.resolve|jQuery.Deferred.resolve|Deferred.resolve|fnDeferCreate_JQuery.resolve|Deferred.fnGenerateDefer.resolve), promise: (*|deferredLibrary.createDefer.promise|jQuery.promise|promise.promise|Deferred._fnGenerateDefer.promise|fnDeferCreate_JQuery.promise), then: (*|deferredLibrary.createDefer.then|promise.then|Promise.then|then|fnDeferCreate_JQuery.then)}|{set: setInBucket, remove: removeFromBucket}|{id: (string|*), host: (XML|string|void|*), urn: (XML|string|void|*), contents: *, receipt: *}|void|*}
   */
  var iframeHASH = hashLib.create();

  /**
   * Add a new Client
   * @param clientID
   * @returns {Number}
   * @private
   */
  function addClient(clientID) {
    clientList.push (clientID);
    iframeHASH.set(clientID, clientList [clientList.length - 1]);
  }

  /**
   * Remove client
   * @param clientID
   * @private
   */
  function removeClient(clientID) {
    iframeHASH.remove (clientID);
  }

  /**
   * Get Client list
   * @returns {Array}
   * @private
   */
  function getclientList() {
    return clientList;
  }

  /**
   * Refresh client list
   * @private
   */
  function refreshclientList() {
  }

  /**
   * Send message to client
   * @param clientID
   * @param request
   * @private
   */
  function processRequest(clientID, request) {
    document.getElementById (clientID).contentWindow.postMessage(request, serverConst.DOMAIN_NAME);
  }

  /**
   * Public API
   */
  return {
    const: serverConst,
    addClient: addClient,
    removeClient: removeClient,
    getClientList: getclientList,
    processRequest: processRequest
  };
}
