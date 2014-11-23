/**
 * HASH Library
 * Basic HASH library object - useful for tracking objects
 * @param encodeToBase64 - Encode to base64 function
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
   * @param value
   * @returns {*}
   */
  function createHASHKey (value) {
    return encodeToBase64(value);
  }

  /**
   * Public API
   */
  return {
    create: createHASHBucket,
    createKey: createHASHKey
  };
}