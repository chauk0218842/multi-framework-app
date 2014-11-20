'use strict';

/**
 * Package Library
 * @param createHASHKey
 * @returns {{create: createNewMessage}}
 */
function messageLibrary(createHASHKey) {

  /**
   * Request ID prefix
   * @type {string}
   */
  var keyPrefix = "A";

  /**
   * Request ID counter
   * @type {number}
   */
  var keyCounter = 0;

  /**
   * Create a Message
   * @param messageID
   * @param uri
   * @param clientID
   * @param parameters
   * @returns {{id: *, client: *, host: *, urn: *, parameters: *, receipt: *}}
   */
  function createMessage(messageID, uri, clientID, parameters) {
    return {
      id: messageID,
      uri: uri,
      client: clientID,
      parameters: parameters
    };
  }

  /**
   * Create Response
   * @param message
   * @param parameters
   * @returns {{id: *, client: *, host: *, urn: *, parameters: *, receipt: *}}
   */
  function createResponse(message, parameters) {
    return createMessage(message.id, message.uri, message.client, parameters);
  }

  /**
   * Generate a Request
   * @param uri
   * @param clientID
   * @param parameters
   * @returns {{id: (string|*), host: (XML|string|void|*), urn: (XML|string|void|*), parameters: *, receipt: *}}
   */
  function createNewMessage(uri, clientID, parameters) {
    return createMessage(createHASHKey(keyPrefix + (keyCounter++)), uri, clientID, parameters);
  }

  /**
   * Public API
   */
  return {
    create: createNewMessage,
    createResponse: createResponse
  };
}