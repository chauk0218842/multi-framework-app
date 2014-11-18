'use strict';

/**
 * Client Library
 * @param _ServerConst
 * @returns {{send: _fnSendRequestToServer, listen: _fnListenToServer}}
 * @constructor
 */
function ClientLibrary(_ServerConst) {

  /**
   * Send a request to server
   * @param __oRequest
   * @private
   */
  function _fnSendRequestToServer(__oRequest) {
    parent.postMessage(__oRequest, _ServerConst.DOMAIN_NAME);
  }

  /**
   * Listen to request responded back from server
   * @param __oRequest
   * @returns {*}
   * @private
   */
  function _fnListenToServer(__oWindowEvent) {
    return __oWindowEvent.data;
  }

  /**
   * Public API
   */
  return {
    send : _fnSendRequestToServer,
    listen: _fnListenToServer
  };
}