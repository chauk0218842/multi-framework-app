'use strict';

/**
 * Client Library
 * @param serverConst
 * @returns {{send: sendMessageToServer, listen: listenToServer}}
 * @constructor
 */
function clientLibrary(serverConst) {

  /**
   * Send a request to server
   * @param request
   */
  function sendMessageToServer(message) {
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
    send : sendMessageToServer,
    listen: listenToServer
  };
}