'use strict';

function PMRouter (_CONSTS, _PMError, _PMData) {

  function _fnRouter(__fnConnectClient, __fnDisconnectClient, __fnPostMessageToClient, __fnPostMessageToClients, __oPMData) {

    if (__oPMData.request === _CONSTS.REQUEST.GET_CONNECT_CLIENT) {

      __fnConnectClient(__oPMData);
      console.log(("SERVER: Client connected to server '%SENDER%'").replace(/%SENDER%/g, __oPMData.sender));

      _fnRouter (_PMData.convert (__oPMData.id, _CONSTS.REQUEST.POST_MESSAGE_CLIENT, _CONSTS.RECIPIENT.SERVER, __oPMData.sender, "Connected to server", false));

    }

    else if (__oPMData.request === _CONSTS.REQUEST.GET_DISCONNECT_CLIENT) {
      __fnDisconnectClient(__oPMData);
      console.log(("SERVER: Client disconnected from server '%SENDER%'").replace(/%SENDER%/g, __oPMData.sender));
    }

    else if (__oPMData.request === _CONSTS.REQUEST.GET_CLIENTS) {
      __fnPostMessageToClient(_PMData.convert (__oPMData.id, _CONSTS.REQUEST.GET_CLIENTS, _CONSTS.RECIPIENT.SERVER, __oPMData.sender, _fnGetClients(__oPMData.sender), false));
      console.log(("SERVER: Responding with list of clients to '%SENDER%'").replace(/%SENDER%/g, __oPMData.sender));
    }

    else if (__oPMData.request === _CONSTS.REQUEST.POST_MESSAGE_CLIENT) {
      __fnPostMessageToClient(__oPMData);
      console.log(("SERVER: Forwarded message from '%SENDER%' to '%RECIPIENT%'").replace(/%SENDER%/g, __oPMData.sender).replace(/%RECIPIENT%/g, __oPMData.recipient));
    }
    else if (__oPMData.request === _CONSTS.REQUEST.POST_MESSAGE_CLIENTS) {
      __fnPostMessageToClients(__oPMData);
      console.log(("SERVER: Forwarded message from '%SENDER%' to all clients").replace(/%SENDER%/g, __oPMData.sender));
    }
  }

  return _fnRouter;

}