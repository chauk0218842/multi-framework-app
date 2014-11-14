'use strict';

var PMData = (function () {

  var _sMessageID = 0;

  function _fnConvertData (__sID, __sRequest, __sSenderID, __sRecipientID, __oMessage, __bReceipt) {
    return {
      id : __sID,
      request: __sRequest,
      sender: __sSenderID,
      recipient: __sRecipientID,
      message: __oMessage,
      receipt: __bReceipt,
    };
  }

  function _fnCreateData (__sRequest, __sSenderID, __sRecipientID, __oMessage, __bReceipt) {
    return _fnConvertData (_sMessageID++, __sRequest, __sSenderID, __sRecipientID, __oMessage, __bReceipt);
  }

  function _fnSerializeData(__oData) {
    return JSON.stringify(__oData);
  }

  function _fnDeserializeData(__oData) {
    var __oJSON = null;
    try {
      __oJSON = JSON.parse(__oData);
    }
    catch (oError) {
      debugger;
    }
    return _fnConvertData (__oJSON.id, __oJSON.request, __oJSON.sender, __oJSON.recipient, __oJSON.message, __oJSON.messageID, __oJSON.receipt);
  }

  return {
    create: _fnCreateData,
    convert : _fnConvertData,
    serialize: _fnSerializeData,
    deserialize: _fnDeserializeData
  }
})();