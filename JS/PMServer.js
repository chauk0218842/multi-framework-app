'use strict';

var PMServer = (function (_CONSTS, _PMError, _PMData) {

  var _oClientHASH = {};
  var _aClientCollection = [];

  function _fnGetClientsAsCollection() {
    var __aCollection = [];
    for (var sHASH in _oClientHASH) {
      __aCollection.push(_oClientHASH[sHASH]);
    }

    return __aCollection;
  }

  function _fnCreateHASH(__oVal) {
    return window.btoa(__oVal);
  }

  function _fnConnectClient(__oPMData) {
    var sHASH = _fnCreateHASH(__oPMData.sender);
    _oClientHASH [sHASH] = __oPMData.sender;
    _aClientCollection.push(_oClientHASH [sHASH]);
  }

  function _fnDisconnectClient(__oPMData) {
    var sHASH = _fnCreateHASH(__oPMData.sender);
    _oClientHASH [sHASH] = null;
  }

  function _fnPostMessageToClient(__oPMData) {
    var __oIFrame = document.getElementById(__oPMData.recipient);
    if (!__oIFrame) {
      throw PMError("IFrame does not exist");
    }
    __oIFrame.contentWindow.postMessage(_PMData.serialize(__oPMData), _CONSTS.DOMAIN);

  }

  function _fnGetClients(__sExcludeClient) {

    var __aCollection = [];

    for (var sHASH in _oClientHASH) {

      /**
       * Don't include the sender as part of the client list
       */
      if (_oClientHASH[sHASH] === __sExcludeClient) {
        continue;
      }

      __aCollection.push(_oClientHASH[sHASH]);
    }

    return __aCollection;
  }

  function _fnPostMessageToClients(__oPMData) {

    var __aClientCollection = _fnGetClientsAsCollection();
    for (var n = 0, nLen = __aClientCollection.length; n < nLen; n++) {

      var sRecipient = _aClientCollection [n];
      /**
       * Do not send a message back to the original sender when publishing to all clients
       */
      if (sRecipient === __oPMData.sender) {
        continue;
      }

      _fnPostMessageToClient(_PMData.create(__oPMData.request, __oPMData.sender, sRecipient, __oPMData.message, __oPMData.receipt));
    }

  }

  function _fnRoutes(__oPMData) {

    if (__oPMData.request === _CONSTS.REQUEST.GET_CONNECT_CLIENT) {

      _fnConnectClient(__oPMData);
      console.log(("SERVER: Client connected to server '%SENDER%'").replace(/%SENDER%/g, __oPMData.sender));

      _fnRoutes (_PMData.create (_CONSTS.REQUEST.POST_MESSAGE_CLIENT, _CONSTS.RECIPIENT.SERVER, __oPMData.sender, "Connected to server", false));

      /**
       * Update clients with a new client list
       */
      _fnPostMessageToClients(_PMData.create(_CONSTS.REQUEST.GET_CLIENTS, _CONSTS.RECIPIENT.SERVER, _CONSTS.RECIPIENT.ALL, _fnGetClients(), false));

    }

    else if (__oPMData.request === _CONSTS.REQUEST.GET_DISCONNECT_CLIENT) {
      _fnDisconnectClient(__oPMData);
      console.log(("SERVER: Client disconnected from server '%SENDER%'").replace(/%SENDER%/g, __oPMData.sender));

      /**
       * Update clients with a new client list
       */
      _fnPostMessageToClients(_PMData.create(_CONSTS.REQUEST.GET_CLIENTS, _CONSTS.RECIPIENT.SERVER, _CONSTS.RECIPIENT.ALL, _fnGetClients(), false));

    }

    else if (__oPMData.request === _CONSTS.REQUEST.GET_CLIENTS) {
      _fnPostMessageToClient(_PMData.create(_CONSTS.REQUEST.GET_CLIENTS, _CONSTS.RECIPIENT.SERVER, __oPMData.sender, _fnGetClients(__oPMData.sender), false));
      console.log(("SERVER: Responding with list of clients to '%SENDER%'").replace(/%SENDER%/g, __oPMData.sender));
    }

    else if (__oPMData.request === _CONSTS.REQUEST.POST_MESSAGE_CLIENT) {
      _fnPostMessageToClient(__oPMData);
      console.log(("SERVER: Forwarded message from '%SENDER%' to '%RECIPIENT%'").replace(/%SENDER%/g, __oPMData.sender).replace(/%RECIPIENT%/g, __oPMData.recipient));
    }
    else if (__oPMData.request === _CONSTS.REQUEST.POST_MESSAGE_CLIENTS) {
      _fnPostMessageToClients(__oPMData);
      console.log(("SERVER: Forwarded message from '%SENDER%' to all clients").replace(/%SENDER%/g, __oPMData.sender));
    }
  }

  function _fnListen(__oEvent) {
    var __oOrigin = __oEvent.origin;
    var __oPMData = _PMData.deserialize(__oEvent.data);

    _fnRoutes(__oPMData);

  }

  return {
    listen: _fnListen
  };

})(PMConstants, PMError, PMData);

