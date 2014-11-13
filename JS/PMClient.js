'use strict';

var PMClient = (function (_CONSTS, _PMError, _PMData) {

  var _sParams = location.toString().replace(/^[^\?]+\?/g, "");
  var _aParams = _sParams.split("&");
  var _sClientID = _aParams [0].replace(/^id=/g, "");
  var _bIsConnectedToServer = false;
  var _nMessageID = 0;


  function _fnGetClientID () {
    return _sClientID;
  }

  function _fnPostMessageToServer (__oPMData) {
    parent.postMessage(_PMData.serialize(__oPMData), _CONSTS.DOMAIN);
  }

  function _fnConnectToServer () {
    var __oPMData = _PMData.create (_CONSTS.REQUEST.GET_CONNECT_CLIENT, _fnGetClientID (), _CONSTS.RECIPIENT.SERVER, null, false);
    _fnPostMessageToServer(__oPMData);
    _bIsConnectedToServer = true;

    return __oPMData.id;
  }

  function _fnDisconnectFromServer () {
    var __oPMData = _PMData.create (_CONSTS.REQUEST.GET_DISCONNECT_CLIENT, _fnGetClientID (), _CONSTS.RECIPIENT.SERVER, null, false);
    _fnPostMessageToServer(__oPMData);
    _bIsConnectedToServer = false;

    return __oPMData.id;
  }

  function _fnConnectionStatus () {
    return _bIsConnectedToServer ? _CONSTS.STATUS.CONNECTED_TO_SERVER : _CONSTS.STATUS.DISCONNECTED_FROM_SERVER;
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
      throw _PMError ("Not connected to server");
    }

    var __oPMData = _PMData.create (__sRequest, _fnGetClientID (), __sRecipientID, __oMessage, __bReceipt)
    _fnPostMessageToServer(__oPMData);

    return __oPMData.id;
  }

  return {
    getClientID : _fnGetClientID,
    connect : _fnConnectToServer,
    disconnect : _fnDisconnectFromServer,
    status : _fnConnectionStatus,
    listen : _fnListenToServer,
    send : _fnSendMessageToServer
  };

}) (PMConstants, PMError, PMData);

