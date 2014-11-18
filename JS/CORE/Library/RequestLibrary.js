/**
 * Request Library
 * @param _fnHASHKeyGenerator
 * @returns {{generate: _fnGenerateRequest}}
 * @constructor
 */
function RequestLibrary(_fnHASHKeyGenerator, _fnEncoder, _fnDecoder) {

  var _sKeyPrefix = "A";
  var _nKey = 0;

  /**
   * Create a Request template object
   * @param __sID
   * @param __sClientID
   * @param __sURI
   * @param __oContents
   * @param __bReceipt
   * @returns {{id: *, client: *, host: *, urn: *, contents: *, receipt: *}}
   * @private
   */
  function _fnCreateRequestObject(__sID, __sClientID, __sURI, __oContents, __bReceipt) {
    var __oRequest = {
      id: __sID,
      client: __sClientID,
      uri: __sURI,
      contents: __oContents,
      receipt: __bReceipt
    }

    function __fnRespondToRequest(___oResponseContents) {
      return _fnCreateRequestObject(__sID, __sClientID, __sURI, ___oResponseContents, false);
    }

    function __fnEncodeRequest() {
      return _fnEncodeRequest(__oRequest);
    }

    __oRequest.respond = __fnRespondToRequest;
    __oRequest.encode = __fnEncodeRequest;

    return __oRequest;
  }

  /**
   * Encode a Request
   * @param __oRequest
   * @returns {*}
   * @private
   */
  function _fnEncodeRequest(__oRequest) {
    return _fnEncoder(__oRequest);
  }

  /**
   * Decode a request
   * @param __oRequest
   * @returns {*}
   * @private
   */
  function _fnDecodeRequest(__oRequest) {
    __oRequest = typeof __oRequest === "string" ? _fnDecoder(__oRequest) : __oRequest;
    return _fnCreateRequestObject(__oRequest.id, __oRequest.client, __oRequest.uri, __oRequest.contents, __oRequest.receipt);
  }

  /**
   * Generate a Request
   * @param __sClientID
   * @param __sURI
   * @param __oContents
   * @param __bReceipt
   * @returns {{id: (string|*), host: (XML|string|void|*), urn: (XML|string|void|*), contents: *, receipt: *}}
   * @private
   */
  function _fnGenerateRequest(__sClientID, __sURI, __oContents, __bReceipt) {
    var __sID = _fnHASHKeyGenerator(_sKeyPrefix + (_nKey++));
    return _fnCreateRequestObject(__sID, __sClientID, __sURI, __oContents, __bReceipt);
  }

  /**
   * Public API
   */
  return {
    generate: _fnGenerateRequest,
    decode: _fnDecodeRequest
  };
}