'use strict';

/**
 * Request Library
 * @param createHASHKey
 * @param encoder
 * @param decoder
 * @returns {{create: createNewRequest, decode: decodeRequest}}
 */
function requestLibrary(createHASHKey, encoder, decoder) {

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
   * Create a Request template object
   * @param requestID
   * @param clientID
   * @param uri
   * @param contents
   * @param useReceipt
   * @returns {{id: *, client: *, host: *, urn: *, contents: *, receipt: *}}
   */
  function createRequest(requestID, clientID, uri, contents, useReceipt) {
    var request = {
      id: requestID,
      client: clientID,
      uri: uri,
      contents: contents,
      receipt: useReceipt
    };

    /**
     * Respond to request
     * @param responseContents
     * @returns {{id: *, client: *, host: *, urn: *, contents: *, receipt: *}}
     */
    function respondToRequest(responseContents) {
      return createRequest(requestID, clientID, uri, responseContents, false);
    }

    /**
     * Encode request
     * @returns {*}
     */
    function encodeRequest() {
      return encoder(request);
    }

    request.respond = respondToRequest;
    request.encode = encodeRequest;

    return request;
  }

  /**
   * Decode a request
   * @param request
   * @returns {*}
   * @private
   */
  function decodeRequest(request) {
    request = typeof request === "string" ? decoder(request) : request;
    return request ? createRequest(request.id, request.client, request.uri, request.contents, request.receipt) : createRequest.call (null);
  }

  /**
   * Generate a Request
   * @param clientID
   * @param uri
   * @param contents
   * @param useReceipt
   * @returns {{id: (string|*), host: (XML|string|void|*), urn: (XML|string|void|*), contents: *, receipt: *}}
   * @private
   */
  function createNewRequest(clientID, uri, contents, useReceipt) {
    return createRequest(createHASHKey(keyPrefix + (keyCounter++)), clientID, uri, contents, useReceipt);
  }

  /**
   * Public API
   */
  return {
    create: createNewRequest,
    decode: decodeRequest
  };
}