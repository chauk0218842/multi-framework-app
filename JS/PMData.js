'use strict';

var PMData = (function () {

  function _fnCreate(__sRequest, __sSenderID, __sRecipientID, __oMessage, __bReceipt) {
    return {
      request: __sRequest,
      sender: __sSenderID,
      recipient: __sRecipientID,
      message: __oMessage,
      receipt: __bReceipt
    };
  }

  function _fnSerializeData(__oData) {
    return JSON.stringify(__oData);
  }

  function _fnDeserializeData(__oData) {
    var __oJSON = JSON.parse(__oData);
    return _fnCreate(__oJSON.request, __oJSON.sender, __oJSON.recipient, __oJSON.message, __oJSON.receipt);
  }

  return {
    create: _fnCreate,
    serialize: _fnSerializeData,
    deserialize: _fnDeserializeData
  }
})();