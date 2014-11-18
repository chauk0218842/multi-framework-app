'use strict';

/**
 * HASH object
 * @param _fnBase64Encoder
 * @returns {{generate: _fnGenerateBucket, generateKey: _fnGenerateKey}}
 * @constructor
 */
function HASHLibrary (_fnBase64Encoder) {

  /**
   * Generate Bucket
   * @returns {{set: _fnSet, remove: _fnRemove}}
   * @private
   */
  function _fnGenerateBucket() {

    /**
     * HASH bucket
     * @type {{}}
     * @private
     */
    var _oBucket = {};

    /**
     * Get a value based on key
     * @param _sKey
     * @returns {*}
     * @private
     */
    function _fnGet (_sKey) {
      return _oBucket [_sKey];
    }

    /**
     * Set value in HASH with given key
     * @param _sKey
     * @param _oVal
     * @private
     */
    function _fnSet(_sKey, _oVal) {

      if (!(typeof _sKey === "string" || typeof _sKey === "number")) {
        throw new Error(0, "invalid key type");
      }
      _oBucket [_sKey] = _oVal;

      return _oBucket [_sKey];
    }

    /**
     * Delete a value with given key
     * @param _sKey
     * @private
     */
    function _fnRemove(_sKey) {
      delete _oBucket [_sKey];
    }

    /**
     * Public API
     */
    return {
      get : _fnGet,
      set: _fnSet,
      remove: _fnRemove
    };
  }

  /**
   * Generate a HASH key
   * @returns {string}
   * @private
   */
  function _fnGenerateKey (__sValue) {
    return _fnBase64Encoder(__sValue);
  }

  /**
   * Public API
   */
  return {
    generate: _fnGenerateBucket,
    generateKey: _fnGenerateKey
  };
}