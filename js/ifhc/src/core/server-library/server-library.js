/**
 * Server Library
 * Base server library, responsible for listening to messages from client IFrames
 * @param serverConst - Server constant
 * @param hash - HASH library
 * @returns {{const: *, connectClient: connectClient, disconnectClient: disconnectClient, getConnectedClients: getConnectedClients, send: sendMessageToClient}}
 */
function serverLibrary(serverConst, hash) {

  'use strict';

  /**
   * List of connected clients
   * @type {Array}
   */
  var clientsCollection = [];

  /**
   * List of IFrames stored in a HASH
   */
  var iframeHASH = hash.create();

  /**
   * Add a new Client
   * @param clientID
   * @returns {Number}
   */
  function connectClient(clientID) {
    clientsCollection.push (clientID);
    iframeHASH.set(clientID, clientsCollection [clientsCollection.length - 1]);
  }

  /**
   * Remove client
   * @param clientID
   */
  function disconnectClient(clientID) {
    /**
     * TODO need to remove clients from the clientsCollection when they disconnect
     */
    iframeHASH.remove (clientID);
  }

  /**
   * Get Client list
   * @returns {Array}
   */
  function getConnectedClients() {
    return clientsCollection.sort ();
  }

  /**
   * Send message to client IFrame
   * @param clientID
   * @param message
   */
  function sendMessageToClient(clientID, message) {
    document.getElementById (clientID).contentWindow.postMessage(message, serverConst.DOMAIN_NAME);
  }

  /**
   * Public API
   */
  return {
    const: serverConst,
    connectClient: connectClient,
    disconnectClient: disconnectClient,
    getConnectedClients: getConnectedClients,
    send: sendMessageToClient
  };
}