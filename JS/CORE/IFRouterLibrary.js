'use strict';

/**
 * IFRoute Library
 * @param _URIConst
 * @param _Request
 * @param _Message
 * @param _Server
 * @param _fnProcessRequestExtension
 * @returns {{process: _fnProcessRequest}}
 * @constructor
 */
function IFRouterLibrary(_URIConst, _Request, _Message, _Server, _fnProcessRequestExtension) {

  /**
   * Update client with new client lists
   * @private
   */
  function _fnUpdateClientsClientList () {
    var __oClientList = _Server.getClientList();
    for (var n = 0, nLen = __oClientList.length; n < nLen; n++) {
      var sClient = __oClientList [n];
      _Server.processRequest(sClient, _Request.generate (sClient, _URIConst.REQUEST_CLIENT_LIST, _Message.generate (_Server.Const.SERVER_NAME, sClient, __oClientList), false).encode ());
    }
  }

  /**
   * Process an encoded request
   * @param __oEncRequest
   * @returns {*}
   * @private
   */
  function _fnProcessRequest(__oEncRequest) {

    /**
     * Convert the encoded request into a Request object
     * @type {*}
     * @private
     */
    var __oDecRequest = _Request.decode(__oEncRequest);

    /**
     * Convert the encoded content into a Message object
     * @type {*}
     * @private
     */
    var __oMessage = _Message.decode (__oDecRequest.contents);

    /**
     * Connect a client
     */
    if (__oDecRequest.uri === _URIConst.CONNECT_CLIENT) {
      _Server.addClient(__oDecRequest.client);
      _Server.processRequest(__oDecRequest.client, __oDecRequest.respond (_Message.generate (_Server.Const.SERVER_NAME, __oDecRequest.client, "connected to host")).encode ());
      _fnUpdateClientsClientList ();
    }

    /**
     * Disconnect a client
     */
    else if (__oDecRequest.uri === _URIConst.DISCONNECT_CLIENT) {
      _Server.removeClient(__oDecRequest.client);
      _Server.processRequest(__oDecRequest.client, __oDecRequest.respond (_Message.generate (_Server.Const.SERVER_NAME, __oDecRequest.client, "disconnected from host")).encode ());
    }

    /**
     * Get client list
     */
    else if (__oDecRequest.uri === _URIConst.REQUEST_CLIENT_LIST) {
      _Server.processRequest(__oDecRequest.client, __oDecRequest.respond (_Message.generate (_Server.Const.SERVER_NAME, __oDecRequest.client, _Server.getClientList())).encode ());
    }

    /**
     * Send a _Message to client
     */
    else if (__oDecRequest.uri === _URIConst.SEND_CLIENT_MESSAGE) {
      _Server.processRequest(__oMessage.recipient, __oEncRequest);
    }

    /**
     * Custom server extension routine that needs to be executed
     */
    else if (_fnProcessRequestExtension) {
      var oResp = _fnProcessRequestExtension.call(null, _URIConst, _Request, _Message, _Server, __oEncRequest);
      _Server.processRequest(oResp.client, oResp.request);
    }

    /**
     * Something equivalent to a 404 (lol)
     */
    else {
      _Server.processRequest(__oDecRequest.client, __oDecRequest.respond(_Message.generate(_Server.Const.SERVER_NAME, __oDecRequest.client, "you 404'ed!!")).encode());
    }
  }

  /**
   * Public API
   */
  return {
    process: _fnProcessRequest
  };

}