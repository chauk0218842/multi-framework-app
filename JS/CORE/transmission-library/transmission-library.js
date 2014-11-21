/**
 * Transmission Library
 * @param createHASHKey
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
   * @param uri
   * @param clientID
   * @param pkg
   * @returns {{id: *, client: *, host: *, urn: *, parameters: *, receipt: *}}
   */
  function createTransmission(transID, uri, clientID, pkg) {
    return {
      id: transID,
      uri: uri,
      client: clientID,
      package: pkg
    };
  }

  /**
   * Create Response - this is for the server to respond back to incoming transmissions from clients,
   * OR when receipts are enabled during a client-to-host-to-client communication - the receiving client will have to "respond" back to
   * their incoming transmission
   * @param transmission
   * @param pkg
   * @returns {{id: *, client: *, host: *, urn: *, parameters: *, receipt: *}}
   */
  function createResponseTransmission(transmission, pkg) {
    return createTransmission(transmission.id, transmission.uri, transmission.client, pkg);
  }

  /**
   * Generate a Request
   * @param uri
   * @param clientID
   * @param pkg
   * @returns {{id: (string|*), host: (XML|string|void|*), urn: (XML|string|void|*), parameters: *, receipt: *}}
   */
  function createNewTransmission(uri, clientID, pkg) {
    return createTransmission(String (createHASHKey(keyPrefix + (keyCounter++))), uri, clientID, pkg);
  }

  /**
   * Public API
   */
  return {
    create: createNewTransmission,
    createResponse: createResponseTransmission
  };
}