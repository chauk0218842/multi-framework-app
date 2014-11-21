/**
 * HASH Library
 * @param encodeToBase64
 * @returns {{create: createHASHBucket, createKey: createHASHKey}}
 */
function hashLibrary (encodeToBase64) {

  'use strict';

  /**
   * Generate Bucket
   * @returns {{set: setInBucket, remove: removeFromBucket}}
   */
  function createHASHBucket() {

    /**
     * HASH bucket
     * @type {{}}
     */
    var bucket = {};

    /**
     * Get a value based on key
     * @param key
     * @returns {*}
     */
    function getFromBucket (key) {
      return bucket [key];
    }

    /**
     * Set value in HASH with given key
     * @param key
     * @param value
     */
    function setInBucket(key, value) {

      if (!(typeof key === "string" || typeof key === "number")) {
        throw new Error(0, "invalid key type");
      }
      bucket [key] = value;

      return bucket [key];
    }

    /**
     * Delete a value with given key
     * @param key
     */
    function removeFromBucket(key) {
      bucket [key] = null;
    }

    /**
     * Public API
     */
    return {
      get : getFromBucket,
      set: setInBucket,
      remove: removeFromBucket
    };
  }

  /**
   * Generate a HASH key
   * @returns {string}
   */
  function createHASHKey (__sValue) {
    return encodeToBase64(__sValue);
  }

  /**
   * Public API
   */
  return {
    create: createHASHBucket,
    createKey: createHASHKey
  };
}