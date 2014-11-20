'use strict';

/**
 * Server Library
 * @param serverConst
 * @param hashLib
 * @returns {{const: *, addClient: addClient, removeClient: removeClient, getClientList: getClientList, processMessage: processMessage}}
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
   */
  function addClient(clientID) {
    clientList.push (clientID);
    iframeHASH.set(clientID, clientList [clientList.length - 1]);
  }

  /**
   * Remove client
   * @param clientID
   */
  function removeClient(clientID) {
    iframeHASH.remove (clientID);
  }

  /**
   * Get Client list
   * @returns {Array}
   */
  function getClientList() {
    return clientList;
  }

  /**
   * Send message to client
   * @param clientID
   * @param message
   */
  function sendMessage(clientID, message) {
    document.getElementById (clientID).contentWindow.postMessage(message, serverConst.DOMAIN_NAME);
  }

  /**
   * Public API
   */
  return {
    const: serverConst,
    addClient: addClient,
    removeClient: removeClient,
    getClientList: getClientList,
    sendMessage: sendMessage
  };
}
