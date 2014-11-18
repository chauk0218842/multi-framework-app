'use strict';

/**
 * IFrame Client
 * @param _URIConst
 * @param _HASH
 * @param _Request
 * @param _Client
 * @param _Deferred
 * @returns {{listen: _fnListenToHost, connect: _fnConnectToHost, disconnect: _fnDisconnectFromHost, getUsername: _fnGetUsername, getClients: _fnGetClientListFromHost, getMessages: _fnGetMessages, sendMessageToClient: _fnSendMessageToClient}}
 * @constructor
 */
function IFClientLibrary(_URIConst, _HASH, _Request, _Message, _Client, _Deferred) {

  var _sParams = location.toString().replace(/^[^\?]+\?/g, "");
  var _aParams = _sParams.split("&");
  var _sClientID = _aParams [0].replace(/^id=/g, "");
  var _oDeferredHASH = _HASH.generate();
  var _oRequestLog = [];
  var _oResponseLog = [];

  /**
   * Listen to Host
   * @param __oWindowEvent
   * @private
   */
  function _fnListenToHost(__oWindowEvent) {

    var __oDefer = null;

    /**
     * The event data needs to be decoded back into a Request object
     * @type {*}
     * @private
     */
    var __oRequest = _Request.decode(_Client.listen(__oWindowEvent));

    /**
     * TODO need to make this conversion a bit more elegant, either create a new object type Response which is essentially a Request object..
     * Or rename Request to be more of a two-way binded variable name
     * @type {*}
     */
    __oRequest.contents = _Message.decode(__oRequest.contents);

    __oDefer = _oDeferredHASH.get(__oRequest.id);

    _oResponseLog.push(__oRequest);

    /**
     * Handle specific requests
     */
    if (__oDefer) {
      __oDefer.resolve(__oRequest);
    }

    console.log (("%CLIENT% > Received a response from host:\n%RESPONSE%\n").replace (/%CLIENT%/g, _sClientID).replace (/%RESPONSE%/g, __oWindowEvent.data.toString ()));

    return _Deferred.when(__oRequest);
  }

  /**
   * Send a message to Host
   * @param __oRequest
   * @returns {*}
   * @private
   */
  function _fnSendRequestToHost(__oRequest) {
    var __oDeferred = _oDeferredHASH.set(__oRequest.id, _Deferred.generate());
    _oRequestLog.push(__oRequest);
    _Client.send(__oRequest.encode());

    console.log (("%CLIENT% > Sent a request to host:\n%REQUEST%\n").replace (/%CLIENT%/g, _sClientID).replace (/%REQUEST%/g, __oRequest.encode ()));

    return __oDeferred;
  }

  /**
   * Connect to Host
   * @returns {*}
   * @private
   */
  function _fnConnectToHost() {
    return _fnSendRequestToHost(_Request.generate(_sClientID, _URIConst.CONNECT_CLIENT, null, false))
      .then(function (__oRequest) {
        return __oRequest.contents.contents;
      });
  }

  /**
   * Disconnect from Host
   * @returns {*}
   * @private
   */
  function _fnDisconnectFromHost() {
    return _fnSendRequestToHost(_Request.generate(_sClientID, _URIConst.DISCONNECT_CLIENT, null, false))
      .then(function (__oRequest) {
        return __oRequest.contents.contents;
      });
  }

  /**
   * Get Username
   * @returns {XML|string|void|*}
   * @private
   */
  function _fnGetUsername() {
    return _sClientID;
  }

  /**
   * Get Clients from Host
   * @returns {*}
   * @private
   */
  function _fnGetClientListFromHost() {
    return _fnSendRequestToHost(_Request.generate(_sClientID, _URIConst.REQUEST_CLIENT_LIST, null, false))
      .then(function (__oRequest) {
        return __oRequest.contents.contents;
      });
  }

  /**
   * Get all client-to-host requests
   * @returns {Array}
   * @private
   */
  function _fnGetRequestLog() {
    return _oRequestLog;
  }

  /**
   * Get all host-to-client responses
   * @returns {Array}
   * @private
   */
  function _fnGetResponseLog() {
    return _oResponseLog;
  }

  /**
   * Send message to Client
   * @param __oMessage
   * @param __bReceipt
   * @returns {*}
   * @private
   */
  function _fnSendMessageToClient(__sRecipient, __oContents, __bReceipt) {
    return _fnSendRequestToHost(_Request.generate(_sClientID, _URIConst.SEND_CLIENT_MESSAGE, _Message.generate(_sClientID, __sRecipient, __oContents), __bReceipt))
      .then(function (__oRequest) {
        return __oRequest.contents;
      });
  }

  /**
   * Public API
   */
  return {
    listen: _fnListenToHost,
    connect: _fnConnectToHost,
    disconnect: _fnDisconnectFromHost,
    getUsername: _fnGetUsername,
    getClients: _fnGetClientListFromHost,
    getRequestLog: _fnGetRequestLog,
    getResponseLog: _fnGetResponseLog,
    sendMessageToClient: _fnSendMessageToClient
  };

}
