'use strict';

var PMClient = (function (_CONSTS, _PMError, _PMData) {

  var _sParams = location.toString().replace(/^[^\?]+\?/g, "");
  var _aParams = _sParams.split("&");
  var _sClientID = _aParams [0].replace(/^id=/g, "");
  var _bIsConnectedToServer = false;

  function _fnGetClientID () {
    return _sClientID;
  }

  function _fnPostMessageToServer (__oPMData) {
    parent.postMessage(_PMData.serialize(__oPMData), _CONSTS.DOMAIN);
  }

  function _fnConnectToServer () {
    _fnPostMessageToServer(_PMData.create (_CONSTS.REQUEST.GET_CONNECT_CLIENT, _fnGetClientID (), _CONSTS.RECIPIENT.SERVER, null, false));
    _bIsConnectedToServer = true;
  }

  function _fnDisconnectFromServer () {
    _fnPostMessageToServer(_PMData.create (_CONSTS.REQUEST.GET_DISCONNECT_CLIENT, _fnGetClientID (), _CONSTS.RECIPIENT.SERVER, null, false));
    _bIsConnectedToServer = false;
  }

  function _fnListenToServer (__oEvent) {

    if (!_bIsConnectedToServer) {
      throw _PMError ("Not connected to server");
    }

    var __oOrigin = __oEvent.origin;
    var __oPMData = _PMData.deserialize(__oEvent.data);

    return __oPMData;

  }

  function _fnSendMessageToServer (__sRequest, __sRecipientID, __oMessage, __bReceipt) {
    if (!_bIsConnectedToServer) {
      throw _PMError ("Not connected to server")
    }
    _fnPostMessageToServer(_PMData.create (__sRequest, _fnGetClientID (), __sRecipientID, __oMessage, __bReceipt));
  }

  return {
    getClientID : _fnGetClientID,
    connect : _fnConnectToServer,
    disconnect : _fnDisconnectFromServer,
    listen : _fnListenToServer,
    send : _fnSendMessageToServer
  };

}) (PMConstants, PMError, PMData);

