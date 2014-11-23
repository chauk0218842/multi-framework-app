/**
 * Client Library
 * This is the base client library, responsible for sending "messages" to the host/server window
 * @param serverConst - Server constant
 * @returns {{send: sendMessageToHost, listen: listenToServer}}
 * @constructor
 */
function clientLibrary(serverConst) {

  'use strict';

  /**
   * Send a request to server
   * @param message
   */
  function sendMessageToHost(message) {
    parent.postMessage(message, serverConst.DOMAIN_NAME);
  }

  /**
   * Listen to request responded back from Server
   * @param event
   * @returns {*}
   */
  function listenToServer(event) {
    return event.data;
  }

  /**
   * Public API
   */
  return {
    send : sendMessageToHost,
    listen: listenToServer
  };
}