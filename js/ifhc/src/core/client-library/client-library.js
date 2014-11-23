/**
 * Client Library
 * @param serverConst - Server constant
 * @returns {{send: sendTransmissionToHost, listen: listenToServer}}
 * @constructor
 */
function clientLibrary(serverConst) {

  'use strict';

  /**
   * Send a request to server
   * @param transmission
   */
  function sendTransmissionToHost(transmission) {
    parent.postMessage(transmission, serverConst.DOMAIN_NAME);
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
    send : sendTransmissionToHost,
    listen: listenToServer
  };
}