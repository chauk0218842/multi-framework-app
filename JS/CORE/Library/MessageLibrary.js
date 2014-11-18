'use strict';

/**
 * TODO need to implement receipts - upon receiving a message with a receipt,
 * the client needs to respond back to the sender that they have received the message
 * Message Library
 * @param _fnHASHKeyGenerator
 * @param _fnEncoder
 * @param _fnDecoder
 * @returns {{generate: _fnGenerateMessage, decode: _fnDecodeMessage}}
 * @constructor
 */
function MessageLibrary(_fnHASHKeyGenerator, _fnEncoder, _fnDecoder) {

  var _sKeyPrefix = "A";
  var _nKey = 0;

  /**
   * Create a Message template object
   * @param __sID
   * @param __sSenderID
   * @param __sRecipient
   * @param __oContents
   * @param __bReceipt
   * @returns {{id: *, client: *, host: *, urn: *, contents: *, receipt: *}}
   * @private
   */
  function _fnCreateMessageObject(__sID, __sSenderID, __sRecipient, __oContents, __bReceipt) {
    var __oMessage = {
      id: __sID,
      sender: __sSenderID,
      recipient: __sRecipient,
      contents: __oContents,
      receipt: __bReceipt
    };

    function __fnRespondToMessage(___sSenderID, ___oResponseContents) {
      return _fnCreateMessageObject(__sID, ___sSenderID, __sSenderID, ___oResponseContents);
    }

    function __fnEncodeMessage() {
      return _fnEncodeMessage(__oMessage);
    }

    __oMessage.respond = __fnRespondToMessage;
    __oMessage.encode = __fnEncodeMessage;

    return __oMessage;
  }

  /**
   * Encode a Request
   * @param __oMessage
   * @returns {*}
   * @private
   */
  function _fnEncodeMessage(__oMessage) {
    return _fnEncoder(__oMessage);
  }

  /**
   * Decode a request
   * @param __oMessage
   * @returns {*}
   * @private
   */
  function _fnDecodeMessage(__oMessage) {
    __oMessage = typeof __oMessage === "string" ? _fnDecoder(__oMessage) : __oMessage;
    return __oMessage ? _fnCreateMessageObject(__oMessage.id, __oMessage.sender, __oMessage.recipient, __oMessage.contents) : _fnCreateMessageObject();
  }

  /**
   * Generate a Message
   * @param __sSenderID
   * @param __sRecipient
   * @param __oContents
   * @param __bReceipt
   * @returns {{id: (string|*), host: (XML|string|void|*), urn: (XML|string|void|*), contents: *, receipt: *}}
   * @private
   */
  function _fnGenerateMessage(__sSenderID, __sRecipient, __oContents, __bReceipt) {
    var __sID = _fnHASHKeyGenerator(_sKeyPrefix + (_nKey++));
    return _fnCreateMessageObject(__sID, __sSenderID, __sRecipient, __oContents, __bReceipt);
  }

  /**
   * Public API
   */
  return {
    generate: _fnGenerateMessage,
    decode: _fnDecodeMessage
  };
}