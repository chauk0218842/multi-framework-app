/**
 * Package Library
 * @param packgConst packageConstant
 * @returns {{const: (packgConst|*), create: createNewPackage}}
 */
function packageLibrary(packgConst) {

  'use strict';

  /**
   * Create client list package
   * @param params
   */
  function createClientListPackage(params) {
    var packg = createPackage(params);
    packg.list = params.list;
    return packg;
  }

  /**
   * Create a text message package
   * @param params
   * @returns {{type: *}}
   */
  function createTextMessagePackage(params) {
    var packg = createPackage(params);
    packg.body = params.body;
    return packg;
  }

  /**
   * Create a files package
   * @param params
   * @returns {{type: *}}
   */
  function createFilePackage(params) {
    var packg = createPackage(params);
    packg.files = params.files;
    return packg;
  }

  /**
   * Create a Package
   * @param params
   * @returns {{type: *}}
   */
  function createPackage(params) {
    return {
      type: params.type || packgConst.GENERIC_TYPE,
      sender: params.sender,
      recipient : params.recipient,
      receipt: params.receipt
    };
  }

  /**
   * Create a New Package
   * @param params
   * @returns {*}
   */
  function createNewPackage(params) {
    var packageHandler = {};
    packageHandler [packgConst.CLIENT_LIST_TYPE] = createClientListPackage;
    packageHandler [packgConst.TEXT_MESSAGE_TYPE] = createTextMessagePackage;
    packageHandler [packgConst.FILES_TYPE] = createFilePackage;
    return packageHandler [params.type] ? packageHandler [params.type] (params) : createPackage(null);
  }

  /**
   * Public API
   */
  return {
    const: packgConst,
    create: createNewPackage
  };
}