'use strict';

/**
 * Server Library
 * @param serverConst
 * @param hashLib
 * @returns {{const: *, addClient: addClient, removeClient: removeClient, getClientList: getclientList, processRequest: processRequest}}
 */
function serverLibrary(serverConst, hashLib) {

  /**
   * List of connected clients
   * @type {Array}
   */
  var clientList = [];

  /**
   * List of IFrames stored in a HASH
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
