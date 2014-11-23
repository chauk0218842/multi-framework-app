/**
 * Transmission Library
 * @param createHASHKey - Create HASH key function
 * @returns {{create: createNewTransmission}}
 */
function transmissionLibrary(createHASHKey) {

  'use strict';

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
   * @param transID
   * @param uri - TODO change URI to request or something else
   * @param clientID
   * @param attachment
   * @returns {{id: *, client: *, host: *, urn: *, parameters: *, receipt: *}}
   */
  function createTransmission(transID, uri, clientID, attachment) {
    return {
      id: transID,
      uri: uri,
      client: clientID,
      attachment: attachment
    };
  }

  /**
   * Create Response - this is for the server to respond back to incoming transmissions from clients,
   * OR when receipts are enabled during a client-to-host-to-client communication - the receiving client will have to "respond" back to
   * their incoming trans
   * @param trans
   * @param attachment
   * @returns {{id: *, client: *, host: *, urn: *, parameters: *, receipt: *}}
   */
  function createResponseTransmission(trans, attachment) {
    return createTransmission(trans.id, trans.uri, trans.client, attachment);
  }

  /**
   * Generate a Request
   * @param uri
   * @param clientID
   * @param attachment
   * @returns {{id: (string|*), host: (XML|string|void|*), urn: (XML|string|void|*), parameters: *, receipt: *}}
   */
  function createNewTransmission(uri, clientID, attachment) {
    return createTransmission(String (createHASHKey(keyPrefix + (keyCounter++))), uri, clientID, attachment);
  }

  /**
   * Public API
   */
  return {
    create: createNewTransmission,
    createResponse: createResponseTransmission
  };
}