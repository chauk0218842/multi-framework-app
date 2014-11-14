function PMCLibrary (_PMCClient, _DeferHASH) {

  function _fnConvertPMDataToString (__oPMData) {
    return ("%SENDER% (%REQUEST%) > %MESSAGE%")
      .replace(/%SENDER%/g, __oPMData.sender)
      .replace (/%REQUEST%/g, __oPMData.request)
      .replace(/%MESSAGE%/g, __oPMData.message);
  }

  var _oMessages = [];

  function _fnConnect () {
    var __sMessageID = _PMCClient.connect ();
    return _DeferHASH.set (__sMessageID).then (function (__oPMData) {
      return __oPMData.message;
    });
  }

  function _fnReceive (__oEvent) {

    var __oPMData = _PMCClient.listen(__oEvent);

    /**
     * Response made from this client only
     */
    if (_DeferHASH.get (__oPMData.id)) {
      _DeferHASH.get (__oPMData.id).resolve (__oPMData);
    }

    _oMessages.push (_fnConvertPMDataToString (__oPMData));

  }

  function _fnGetContacts () {

    var __sMessageID = _PMCClient.send(PMConstants.REQUEST.GET_CLIENTS, PMConstants.RECIPIENT.SERVER, null, false);
    return _DeferHASH.set (__sMessageID).then (function (__oPMData) {
      return __oPMData.message;
    });
  }

  function _fnGetMessages () {
    return _oMessages;
  }

  function _fnSendMessage (__sRecipient, __oMessage) {
    var __sMessageID = _PMCClient.send(__sRecipient === PMConstants.RECIPIENT.ALL ? PMConstants.REQUEST.POST_MESSAGE_CLIENTS : PMConstants.REQUEST.POST_MESSAGE_CLIENT, __sRecipient, __oMessage, false);
    return _DeferHASH.set (__sMessageID).then (function (__oPMData) {
      return __oPMData.message;
    });
  }

  return {

    connect : _fnConnect,

    receive : _fnReceive,

    getClientName: _PMCClient.getClientID,

    getContacts : _fnGetContacts,

    getMessages : _fnGetMessages,

    status : _PMCClient.status,

    send : _fnSendMessage

  };

}

    