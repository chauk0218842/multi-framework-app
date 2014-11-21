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
   * Format bytes to appropriate units
   * @param bytes
   * @returns {*}
   */
  function formatBytesToUnits(bytes) {
    if (bytes >= 1000000000) {
      bytes = (bytes / 1000000000).toFixed(2) + ' GB';
    }
    else if (bytes >= 1000000) {
      bytes = (bytes / 1000000).toFixed(2) + ' MB';
    }
    else if (bytes >= 1000) {
      bytes = (bytes / 1000).toFixed(2) + ' KB';
    }
    else if (bytes > 1) {
      bytes = bytes + ' bytes';
    }
    else if (bytes == 1) {
      bytes = bytes + ' byte';
    }
    else {
      bytes = '0 byte';
    }
    return bytes;
  }

  /**
   * Create a file list
   * @param files
   * @returns {Array}
   */
  function createFileList(files) {

    var fileList = ""

    for (var n = 0, file; file = files[n]; n++) {
      fileList += (n + 1) + '. ' + file.name + ' (' + formatBytesToUnits(file.size) + ')\n';
    }

    return fileList;
  }

  /**
   * Window Message Listener
   * @param event
   */
  function transmissionListener(event) {

    /**
     * Listen for transmission
     */
    ifclientLib.listen(event).then(function (trans) {

      /**
       * Update response
       */
      if (trans.uri === ifuriConst.CONNECT_CLIENT ||
        trans.uri === ifuriConst.DISCONNECT_CLIENT ||
        trans.uri === ifuriConst.SEND_CLIENT_PACKAGE) {
        updateResponses(trans);
      }

      /**
       * clientLib list was updated
       */
      else if (trans.uri === ifuriConst.REQUEST_CLIENT_LIST) {
        updateContacts(trans.package.list);
      }

    });

  }

  /**
   * Update the contact list received from the host
   * @param list
   */
  function updateContacts(list) {

    var userName = ifclientLib.getUsername();
    var $contacts = _$('#contacts');
    $contacts.empty();
    $contacts.append('<option value = "ALL">ALL</option>');

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
   * Update the chat box from the received messages
   * @param pkg
   */
  function updateResponses(trans) {

    /**
     * Handle message transmission
     * @param trans
     */
    function handleMessage (trans) {
      _$('#response').prepend(('%CLIENT% > %MESSAGE%<br />--<br />').replace(/%CLIENT%/g, trans.client).replace(/%MESSAGE%/g, trans.package.body));
    }

    /**
     * Handle files transmission
     * @param trans
     */
    function handleFiles (trans) {
      var $response = _$('#response');
      var responseHTML = "";
      var defers = [];
      var deferHASH = hashLib.create();
      var files = trans.package.files;
      var fileCount = 0;

      /**
       * Handle file transmission
       * @param file
       * @param url
       */
      function handleFile (file, url) {

        fileCount++;

        if (file.type.indexOf('image/') === 0) {
          responseHTML += '<br/>' + fileCount + '. <a href = "' + url + '" target = "new">' + file.name + '</a> (' + formatBytesToUnits(file.size) + ')<br/><a href = "' + url + '" target = "new"><img class = "thumbnail" src = ' + url + '></a><br/>';
        }
        else if (file.type === 'text/html') {
          responseHTML += '<br/>' + fileCount + '. <a href = "' + url + '" target = "new">' + file.name + '</a> (' + formatBytesToUnits(file.size) + ')<br/>';
        }

        return;
      }

      for (var n = 0, nLen = files.length; n < nLen; n++) {

        var fileReader = new FileReader();
        var defer = deferHASH.set(n, deferredLib.create());
        defers.push(defer);
        defer.then(handleFile);

        fileReader.onloadend = (function (deferKey, file) {
          return function (event) {
            if (event.target.readyState == FileReader.DONE) {
              deferHASH.get(deferKey).resolve(file, event.target.result);
            }
          }
        })(n, files[n]);

        fileReader.readAsDataURL(files[n]);

      }

      deferredLib.when(defers).then(function () {
        $response.prepend(('%CLIENT% > Received files...<br />').replace(/%CLIENT%/g, trans.client) + responseHTML + "--<br/>>");
      });

    }
    /**
     * Received a text message
     */
    if (trans.package.type === packLib.const.TEXT_MESSAGE_TYPE) {
      handleMessage (trans);
    }

    /**
     * Received files
     */
    else if (trans.package.type === packLib.const.FILE_TYPE) {
      handleFiles (trans);
    }

    /**
     * Don't do anything LOL
     */
    else {

    }

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
      ifclientLib.sendMessage($contacts.val(), message, false);
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

  /**
   * Connect to the host
   */
  ifclientLib.connect();
}
