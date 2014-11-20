/**
 * Package Library
 * @param packConst
 * @returns {{const: (packConst|*), create: createNewPackage}}
 */
function packageLibrary(packConst) {

  'use strict';

  /**
   * Create client list package
   * @param clients
   */
  function createClientListPackage(clients) {
    var pkg = createPackage(packConst.CLIENT_LIST);
    pkg.list = clients;

    return pkg;
  }

  /**
   * Create a text message package
   * @param sender
   * @param recipient
   * @param body
   * @param useReceipt
   * @returns {*}
   */
  function createTextMessagePackage(senderID, recipientID, body, useReceipt) {
    var pkg = createPackage(packConst.TEXT_MESSAGE_TYPE);
    pkg.sender = senderID;
    pkg.recipient = recipientID;
    pkg.body = body;
    pkg.useReceipt = useReceipt;

    return pkg;
  }

  /**
   * Create a files package
   * @param blob
   * @returns {*}
   */
  function createFilePackage(senderID, recipientID, files, useReceipt) {
    var pkg = createPackage(packConst.FILE_TYPE);
    pkg.sender = senderID;
    pkg.recipient = recipientID;
    pkg.files = files;
    pkg.useReceipt = useReceipt;

    return pkg;
  }

  /**
   * Create a Package
   * @param type
   * @returns {{type: *}}
   */
  function createPackage(type) {
    return {
      type: type || packConst.GENERIC_TYPE
    };
  }

  /**
   * Create a New Package
   * @param params
   * @returns {*}
   */
  function createNewPackage(params) {

    var pkg;

    if (params.type === packConst.CLIENT_LIST) {
      pkg = createClientListPackage(params.list);
    }

    else if (params.type === packConst.TEXT_MESSAGE_TYPE) {
      pkg = createTextMessagePackage(params.sender, params.recipient, params.body, params.useReceipt);
    }

    else if (params.type === packConst.FILE_TYPE) {
      pkg = createFilePackage(params.sender, params.recipient, params.files, params.useReceipt);
    }

    else {
      pkg = createPackage(null);
    }

    return pkg;
  }

  /**
   * Public API
   */
  return {
    const: packConst,
    create: createNewPackage
  };
}