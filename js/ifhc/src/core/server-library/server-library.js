/**
 * Server Library
 * @param serverConst - Server constant
 * @param hashLib - HASH library
 * @returns {{const: *, addClient: addClient, removeClient: removeClient, getClientList: getClientList, send: sendTransmission}}
 */
function serverLibrary(serverConst, hashLib) {

  'use strict';

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
    return clientList.sort ();
  }

  /**
   * Send transmission to client
   * @param clientID
   * @param trans
   */
  function sendTransmission(clientID, trans) {
    document.getElementById (clientID).contentWindow.postMessage(trans, serverConst.DOMAIN_NAME);
  }

  /**
   * Public API
   */
  return {
    const: serverConst,
    addClient: addClient,
    removeClient: removeClient,
    getClientList: getClientList,
    send: sendTransmission
  };
}