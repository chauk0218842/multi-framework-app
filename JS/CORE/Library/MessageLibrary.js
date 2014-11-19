'use strict';

/**
 * TODO need to implement receipts - upon receiving a message with a receipt,
 * the client needs to respond back to the sender that they have received the message
 * Message Library
 * @param createHASHKey
 * @param encoder
 * @param decoder
 * @returns {{create: createNewMessage, decode: decodeMessage}}
 */
function messageLibrary(createHASHKey, encoder, decoder) {

  /**
   * Message ID prefix
   * @type {string}
   */
  var keyPrefix = "A";

  /**
   * Message ID counter
   * @type {number}
   */
  var keyCounter = 0;

  /**
   * Create a Message template object
   * @param messageID
   * @param senderID
   * @param recipientID
   * @param contents
   * @param useReceipt
   * @returns {{id: *, client: *, host: *, urn: *, contents: *, receipt: *}}
   */
  function createMessage(messageID, senderID, recipientID, contents, useReceipt) {
    var message = {
      id: messageID,
      sender: senderID,
      recipient: recipientID,
      contents: contents,
      receipt: useReceipt
    };

    /**
     * Respond to Message
     * @param senderID
     * @param responseContents
     * @returns {{id: *, client: *, host: *, urn: *, contents: *, receipt: *}}
     */
    function respondToMessage(senderID, responseContents, useReceipt) {
      return createMessage(messageID, senderID, senderID, responseContents, useReceipt);
    }

    /**
     * Encode Message
     * @returns {*}
     */
    function encodeMessage () {
      return encoder (message);
    }

    message.respond = respondToMessage;
    message.encode = encodeMessage;

    return message;
  }
  
  /**
   * Decode a request
   * @param message
   * @returns {*}
   */
  function decodeMessage(message) {
    message = typeof message === "string" ? decoder(message) : message;
    return message ? createMessage(message.id, message.sender, message.recipient, message.contents, message.receipt) : createMessage.call(null);
  }

  /**
   * Generate a Message
   * @param senderID
   * @param recipientID
   * @param contents
   * @param useReceipt
   * @returns {{id: (string|*), host: (XML|string|void|*), urn: (XML|string|void|*), contents: *, receipt: *}}
   */
  function createNewMessage(senderID, recipientID, contents, useReceipt) {
    return createMessage(createHASHKey(keyPrefix + (keyCounter++)), senderID, recipientID, contents, useReceipt);
  }

  /**
   * Public API
   */
  return {
    create: createNewMessage,
    decode: decodeMessage
  };
}