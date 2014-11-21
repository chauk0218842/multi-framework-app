/**
 * Document Onload Function
 * @param _$
 */
function onDOMContentLoaded(_$) {

  'use strict';

  var filesPackage = null;

  /**
   * HASH Library
   * @type {{create: createHASHBucket, createKey: createHASHKey}}
   */
  var hashLib = hashLibrary(window.btoa);

  /**
   * Deferred Library
   * @type {{generate: createDefer, when: (*|jQuery.when|Function|$Q.when|deferredLibrary.when|when)}|{generate: createDefer, when: (*|deferredLibrary.when|jQuery.when|Function|$Q.when|when)}}
   */
  var deferredLib = deferredLibrary(_$);

  /**
   * Transmission Library
   * @type {{create: createNewTransmission}}
   */
  var transLib = transmissionLibrary(hashLib.createKey);

  /**
   * Server Constant
   * @type {{SERVER_NAME: string, DOMAIN_NAME: string}}
   */
  var serverConst = serverConstants;

  /**
   * Client Library
   * @type {{send: sendRequestToServer, listen: listenToServer}}
   */
  var clientLib = clientLibrary(serverConst);

  /**
   * IFURI Constant
   * @type {{CONNECT_CLIENT: string, DISCONNECT_CLIENT: string, REQUEST_CLIENT_LIST: string, SEND_CLIENT_PACKAGE: string}}
   */
  var ifuriConst = ifuriConstants;

  /**
   * Package Constant
   * @type {{}}
   */
  var packConst = packageConstants;

  /**
   * Package Library
   * @type {{create: createNewPackage}}
   */
  var packLib = packageLibrary(packConst);

  /**
   * IFClient Library
   * @type {{listen: listenToHost, connect: connectToHost, disconnect: disconnectFromHost, getUsername: getUsername, getClients: getClientListFromHost, getRequestLog: getRequestLog, getResponseLog: getResponseLog, sendMessageToClient: sendMessageToClient}}
   */
  var ifclientLib = ifclientLibrary(ifuriConst, hashLib, transLib, packLib, clientLib, deferredLib);

  /**
   * Update the contact list received from the host
   * Unlike Angular, the updating of a "select" is easier than Angular in which we don't need to do a lot updating
   * So no need for a promise
   * @param list
   */
  function updateContacts(list) {

    var userName = ifclientLib.getUsername();
    var $contacts = _$('#contacts');
    $contacts.empty();
    $contacts.append('<option value = "ALL">ALL</option>');
    list = list.sort();

    for (var n = 0, nLen = list.length; n < nLen; n++) {
      var recipient = list [n];

      if (recipient === userName) {
        continue;
      }
      $contacts.append('<option value = \"' + recipient + '\">' + recipient + '</option>');
    }

    $contacts.index(0);

  }

  /**
   * Handle message transmission
   * @param trans
   */
  function handleMessage(trans) {
    return ('%CLIENT% > %MESSAGE%<hr/>').replace(/%CLIENT%/g, trans.client).replace(/%MESSAGE%/g, trans.package.body);
  }

  /**
   * Handle files transmission
   * @param trans
   */
  function handleFiles(trans) {
    var responseHTML = "";
    var defers = [];
    var deferHASH = hashLib.create();
    var files = trans.package.files;
    var fileCount = 0;

    /**
     * Handle file transmission
     * @param fileInfo
     */
    function handleFile(fileInfo) {

      var file = fileInfo.file;
      var url = fileInfo.url;

      fileCount++;

      if (file.type.indexOf('image/') === 0) {
        responseHTML += '<br/>' + fileCount + '. <a href = "' + url + '" target = "new">' + file.name + '</a> (' + formatBytesToUnits(file.size) + ')<br/><a href = "' + url + '" target = "new"><img class = "thumbnail" src = ' + url + '></a><br/>';
      }
      else if (file.type.indexOf('text/') === 0) {
        responseHTML += '<br/>' + fileCount + '. <a href = "' + url + '" target = "new">' + file.name + '</a> (' + formatBytesToUnits(file.size) + ')<br/>';
      }
    }

    for (var n = 0, nLen = files.length; n < nLen; n++) {

      var fileReader = new FileReader();
      var defer = deferHASH.set(n, deferredLib.create());
      defers.push(defer);
      defer.then(handleFile);

      fileReader.onloadend = (function (deferKey, file) {
        return function (event) {
          if (event.target.readyState == FileReader.DONE) {
            deferHASH.get(deferKey).resolve({file: file, url: event.target.result});
          }
        }
      })(n, files[n]);

      fileReader.readAsDataURL(files[n]);

    }

    return deferredLib.all(defers).then(function () {
      return ('%CLIENT% > Received files...<br />').replace(/%CLIENT%/g, trans.client) + responseHTML + "<hr/>";
    });

  }

  /**
   * Update the chat box from the received messages
   * @param pkg
   */
  function updateResponses(trans) {

    var responseHTML = "";

    /**
     * Received a text message
     */
    if (trans.package.type === packLib.const.TEXT_MESSAGE_TYPE) {
      responseHTML = handleMessage(trans);
    }

    /**
     * Received files
     */
    else if (trans.package.type === packLib.const.FILE_TYPE) {
      responseHTML = handleFiles(trans);
    }

    /**
     * Don't do anything LOL
     */
    else {

    }

    return deferredLib.when(responseHTML);
  }

  /**
   * Window Message Listener
   * @param event
   */
  function transmissionListener(event) {

    var $response = _$("#response");

    /**
     * Listen for transmission
     */
    ifclientLib.listen(event).then(function (trans) {

      /**
       * clientLib list was updated
       */
      if (trans.uri === ifuriConst.REQUEST_CLIENT_LIST) {

        /**
         * Not as complicated as Angular where you have to respond with a promise, we can get away with this one
         */
        updateContacts(trans.package.list);
      }

      /**
       * Update response
       */
      else if (trans.uri === ifuriConst.CONNECT_CLIENT ||
        trans.uri === ifuriConst.DISCONNECT_CLIENT ||
        trans.uri === ifuriConst.SEND_CLIENT_PACKAGE) {
        updateResponses(trans).then(function (responseHTML) {
          $response.prepend(responseHTML);
        });
      }
    });
  }

  /**
   * Reset form
   */
  function resetForm() {

    filesPackage = null;
    _$("#message").val('< Type a message / drag and drop a file into here >');

  }

  /**
   * Assign the client name
   */
  _$('#clientName').text(ifclientLib.getUsername());

  /**
   * Clear the filesPackage list if the user decides to start typing
   */
  _$("#message").keypress(function () {
    filesPackage = null;
  });

  /**
   * Drag and drop file into message box
   */
  _$('#message').on('drop', function (event) {

    var files = event.originalEvent.dataTransfer.files;

    event.preventDefault();

    _$(this).val(createFileList(files));

    filesPackage = files;

  });

  /**
   * Reset the message box on click
   */
  _$('#message').bind('click', resetForm);

  /**
   * Assign the send event
   */
  _$('#send').bind('click', function () {

    var $contacts = _$('#contacts');
    var contact = $contacts.val();
    var message = _$('#message').val();

    if (contact === 'ALL') {
      var contacts = _$('#contacts>option').map(function () {
        return $(this).val();
      });

      for (var n = 0, nLen = contacts.length; n < nLen; n++) {
        var recipient = contacts [n];
        if (recipient === 'ALL') {
          continue;
        }

        if (filesPackage) {
          ifclientLib.sendFiles(recipient, filesPackage, false);
        }
        else {
          ifclientLib.sendMessage(recipient, message, false);
        }
      }
    }
    else {
      if (filesPackage) {
        ifclientLib.sendFiles(contact, filesPackage, false);
      }
      else {
        ifclientLib.sendMessage(contact, message, false);
      }
    }

    resetForm();
  });

  /**
   * Assign the send event
   */
  _$('#reset').bind('click', resetForm);

  /**
   * Add window listener
   */
  window.addEventListener('message', transmissionListener);

  /**
   * Remove 'message' upon unload
   */
  window.addEventListener('unload', function () {
    window.removeEventListener('message', transmissionListener);
  });

  resetForm();

  /**
   * Connect to the host
   */
  ifclientLib.connect();

}
