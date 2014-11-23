/**
 * API Attachment Library
 * Used by the api-client-library / api-router-library
 * Every transmission usually has an attachment object and this is API's attachment pre/post processing library
 * TODO this needs major refactoring
 * @param hash - HASH library
 * @param attachment - Attachment library
 * @param formatBytesToUnits - Format Bytes to KB/MB/GB function
 * @param deferred - Deferred library
 * @returns {*}
 */
function apiAttachmentLibrary(hash, attachment, formatBytesToUnits, deferred) {

  'use strict';

  /**
   * Process attachments based on type
   * @type {{}}
   */
  var attachmentProcessor = {};

  /**
   * Process response HTML
   * @type {{}}
   */
  var responseFileHTMLFormatter = {};

  /**
   * Process Client List
   * @param receivedAttachment
   * @returns {*}
   */
  function processClientListAttachment(receivedAttachment) {
    receivedAttachment.list = ["ALL"].concat(receivedAttachment.list);
    return deferred.when(receivedAttachment);
  }

  /**
   * Process Text Message
   * @param receivedAttachment
   * @returns {*}
   */
  function processTextMessageAttachment(receivedAttachment) {
    receivedAttachment.body = ('%CLIENT% > %MESSAGE%<hr/>').replace(/%CLIENT%/g, receivedAttachment.sender).replace(/%MESSAGE%/g, receivedAttachment.body);
    return deferred.when(receivedAttachment);
  }

  /**
   * Response formatter for Image file type
   * @param index
   * @param file
   * @returns {string}
   */
  responseFileHTMLFormatter ["image"] = function (index, fileInfo) {
    return '<br/>' + index + '. <a href = "' + fileInfo.url + '" target = "new">' + fileInfo.file.name + '</a> (' + formatBytesToUnits(fileInfo.file.size) + ')<br/><a href = "' + fileInfo.url + '" target = "new"><img class = "thumbnail" src = ' + fileInfo.url + '></a><br/>';
  };

  /**
   * Response formatter for Text file type
   * @param index
   * @param file
   * @returns {string}
   */
  responseFileHTMLFormatter ["text"] = function (index, fileInfo) {
    return '<br/>' + index + '. <a href = "' + fileInfo.url + '" target = "new">' + fileInfo.file.name + '</a> (' + formatBytesToUnits(fileInfo.file.size) + ')<br/>';
  };

  /**
   * Response formatter for JSON file type
   * @param index
   * @param file
   * @returns {string}
   */
  responseFileHTMLFormatter ["json"] = function (index, fileInfo) {
    return '<br/>' + index + '. <a href = "' + fileInfo.url + '" target = "new">' + fileInfo.file.name + '</a> (' + formatBytesToUnits(fileInfo.file.size) + ')<br/>';
  };

  /**
   * Process Files, this actually returns a Text message, as you will need to show a "response" instead
   * @param receivedAttachment
   * @returns {*}
   */
  function processFilesAttachment(receivedAttachment) {

    /**
     * @type {string}
     */
    var responseHTML = "";

    /**
     * Defer collection used to track all file status
     * @type {Array}
     */
    var deferCollection = [];

    /**
     * Defer HASH since we aren't using promises to read files, as each file completes reading its respective defer is resolved
     */
    var deferHASH = hash.create();

    /**
     * Received files
     * @type {sendAttachment.files|*|FileList|r.files|files}
     */
    var files = receivedAttachment.files;

    /**
     * Total files provided
     * @type {number}
     */
    var fileCount = 0;

    /**
     * Process each file that's been uploaded
     */
    for (var n = 0, nLen = files.length; n < nLen; n++) {

      /**
       * @type {FileReader}
       */
      var fileReader = new FileReader();

      /**
       * Create a defer and store it into a HASH for later resolving
       */
      var defer = deferHASH.set(n, deferred.create());
      deferCollection.push(defer);
      defer.then(function (fileInfo) {
        /**
         * Increment the file count as we process more files
         */
        fileCount++;
        responseHTML += responseFileHTMLFormatter [fileInfo.file.type.replace(/(^application\/)+|(\/.*)/, "")](fileCount, fileInfo);
      });

      /**
       * When a file is completed processing, the respectivce defer needs to be resolved
       */
      fileReader.onloadend = (function (deferKey, file) {
        return function (event) {
          if (event.target.readyState == FileReader.DONE) {
            deferHASH.get(deferKey).resolve({file: file, url: event.target.result});
          }
        };
      })(n, files[n]);

      fileReader.readAsDataURL(files[n]);

    }

    /**
     * Once all the deferred are resolved, provide an organized summary of all the files uploaded
     */
    return deferred.all(deferCollection).then(function () {
      return attachment.create({
        type: attachment.const.TEXT_MESSAGE_TYPE,
        sender: receivedAttachment.sender,
        recipient: receivedAttachment.recipient,
        body: ('%CLIENT% > Sent files...<br />').replace(/%CLIENT%/g, receivedAttachment.sender) + responseHTML + "<hr/>",
        useReceipt: receivedAttachment.receipt
      });
    });
  }

  /**
   * Client list attachment
   * @type {processClientListAttachment}
   */
  attachmentProcessor [attachment.const.CLIENT_LIST_TYPE] = processClientListAttachment;

  /**
   * Text message attachment
   * @type {processTextMessageAttachment}
   */
  attachmentProcessor [attachment.const.TEXT_MESSAGE_TYPE] = processTextMessageAttachment;

  /**
   * Files type attachment
   * @type {processFilesAttachment}
   */
  attachmentProcessor [attachment.const.FILES_TYPE] = processFilesAttachment;

  /**
   * Process Attachment
   * @param receivedAttachment
   * @returns {*}
   */
  function processAttachment(receivedAttachment) {
    return deferred.when(attachmentProcessor [receivedAttachment.type](receivedAttachment));
  }

  /**
   * Append the CORE attachment library into this API
   */
  var publicAPI = attachment;
  publicAPI.process = processAttachment;

  /**
   * Public API
   */
  return publicAPI;
}