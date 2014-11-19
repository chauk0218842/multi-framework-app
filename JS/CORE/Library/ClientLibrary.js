'use strict';

/**
 * Client Library
 * @param serverConst
 * @returns {{send: sendRequestToServer, listen: listenToServer}}
 * @constructor
 */
function clientLibrary(serverConst) {

  /**
   * Send a request to server
   * @param request
   */
  function sendRequestToServer(request) {
    parent.postMessage(request, serverConst.DOMAIN_NAME);
  }

  /**
   * Listen to request responded back from server
   * @param request
   * @returns {*}
   */
  function listenToServer(event) {
    return event.data;
  }

  /**
   * Public API
   */
  return {
    send : sendRequestToServer,
    listen: listenToServer
  };
}