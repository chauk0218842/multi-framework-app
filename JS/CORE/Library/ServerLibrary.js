'use strict';

/**
 * Server Object
 * @param _ServerConst
 * @param _HASH
 * @constructor
 */
function ServerLibrary(_ServerConst, _HASH) {

  var _oServerAPI = null;
  var _oClientList = [];
  var _oIFrameHASH = _HASH.generate();

  /**
   * Add a new Client
   * @param __sClientID
   * @returns {Number}
   * @private
   */
  function _fnAddClient(__sClientID) {
    _oClientList.push (__sClientID);
    _oIFrameHASH.set(__sClientID, _oClientList [_oClientList.length - 1]);
  }

  /**
   * Remove client
   * @param __sClientID
   * @private
   */
  function _fnRemoveClient(__sClientID) {
    _oIFrameHASH.set (__sClientID, null);
  }

  /**
   * Get Client list
   * @returns {Array}
   * @private
   */
  function _fnGetClientList() {
    return _oClientList;
  }

  /**
   * Refresh client list
   * @private
   */
  function _fnRefreshClientList() {
  }

  /**
   * Send message to client
   * @param __sClientID
   * @param __oRequest
   * @private
   */
  function _fnProcessRequest(__sClientID, __oRequest) {
    document.getElementById (__sClientID).contentWindow.postMessage(__oRequest, _ServerConst.DOMAIN_NAME);
  }

  /**
   * Public API
   */
  return {
    Const: _ServerConst,
    addClient: _fnAddClient,
    removeClient: _fnRemoveClient,
    getClientList: _fnGetClientList,
    processRequest: _fnProcessRequest
  };
}
