/**
 * Attachment Library
 * This is the base attachment library, responsible for creating attachment objects
 * @param attachmentConst attachmentConstant
 * @returns {{const: (attachmentConst|*), create: createNewAttachment}}
 */
function attachmentLibrary(attachmentConst) {

  'use strict';

  /**
   * Attachment Creator
   * @type {{}}
   */
  var attachmentCreator = {};

  /**
   * Create client list package
   * @param params
   */
  function createClientListAttachment(params) {
    var attachment = createAttachment(params);
    attachment.list = params.list;
    return attachment;
  }

  /**
   * Create a text message package
   * @param params
   * @returns {{type: *}}
   */
  function createTextMessageAttachment(params) {
    var attachment = createAttachment(params);
    attachment.body = params.body;
    return attachment;
  }

  /**
   * Create a files package
   * @param params
   * @returns {{type: *}}
   */
  function createFileAttachment(params) {
    var attachment = createAttachment(params);
    attachment.files = params.files;
    return attachment;
  }

  /**
   * Create a Attachment
   * @param params
   * @returns {{type: *}}
   */
  function createAttachment(params) {
    return {
      type: params.type || attachmentConst.GENERIC_TYPE,
      sender: params.sender,
      recipient : params.recipient,
      receipt: params.receipt
    };
  }

  /**
   * Client List type
   * @type {createClientListAttachment}
   */
  attachmentCreator [attachmentConst.CLIENT_LIST_TYPE] = createClientListAttachment;

  /**
   * Text Message type
   * @type {createTextMessageAttachment}
   */
  attachmentCreator [attachmentConst.TEXT_MESSAGE_TYPE] = createTextMessageAttachment;

  /**
   * Files type
   * @type {createFileAttachment}
   */
  attachmentCreator [attachmentConst.FILES_TYPE] = createFileAttachment;

  /**
   * Create a New Attachment
   * @param params
   * @returns {*}
   */
  function createNewAttachment(params) {
    return attachmentCreator [params.type] ? attachmentCreator [params.type] (params) : createAttachment(null);
  }

  /**
   * Public API
   */
  return {
    const: attachmentConst,
    create: createNewAttachment
  };
}