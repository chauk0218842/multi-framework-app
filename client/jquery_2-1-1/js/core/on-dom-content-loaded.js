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
   * Utility Library
   * @type {{formatBytesToUnits: formatBytesToUnits, createFileList: createFileList}}
   */
  var utilLib = utilityLibrary();

  /**
   * IFClient Library
   * @type {{listen: listenToHost, connect: connectToHost, disconnect: disconnectFromHost, getUsername: getUsername, getClients: getClientListFromHost, getRequestLog: getRequestLog, getResponseLog: getResponseLog, sendMessageToClient: sendMessageToClient}}
   */
  var ifclientLib = ifclientLibrary(ifuriConst, hashLib, transLib, packLib, clientLib, deferredLib);

  /**
   * IFPackage Library
   * @type {*}
   */
  var ifpackLib = ifpackageLibrary(ifclientLib, hashLib, deferredLib, packLib, utilLib.formatBytesToUnits);

  /**
   * Window Message Listener
   * @param event
   */
  function onMessageListener(event) {

    /**
     * Listen for transmissions
     */
    ifclientLib.listen(event).then(function (pkg) {

      /**
       * clientLib list was updated
       */
      if (pkg.type == ifpackLib.const.CLIENT_LIST_TYPE) {
        ifpackLib.process(pkg).then(updateContacts);
      }

      else if (pkg.type === ifpackLib.const.TEXT_MESSAGE_TYPE) {
        ifpackLib.process(pkg).then(updateResponse);
      }

      else if (pkg.type === ifpackLib.const.FILE_TYPE) {
        ifpackLib.process(pkg).then(updateResponse);
      }

      else {
      }

    });

  }

  /**
   * Update the contact list received from the host
   * Unlike Angular, the updating of a "select" is easier than Angular in which we don't need to do a lot updating
   * So no need for a promise
   * @param clients
   */
  function updateContacts(clients) {

    var userName = ifclientLib.getUsername();
    var $contacts = _$('#contacts');
    $contacts.empty();

    clients = clients.sort();

    for (var n = 0, nLen = clients.length; n < nLen; n++) {
      var contact = clients [n];

      if (contact === userName) {
        continue;
      }
      $contacts.append('<option value = \"' + contact + '\">' + contact + '</option>');
    }

    $contacts.index(0);

  }

  /**
   * Update the response from the host
   * @param text
   */
  function updateResponse(text) {
    _$("#response").prepend(text);
  }

  /**
   * Send Message
   */
  function sendMessage() {

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
   * On Drop of a file
   * @param event
   */
  function dropFile(event) {

    var files = event.originalEvent.dataTransfer.files;

    event.preventDefault();

    _$(this).val(utilLib.createFileList(files));

    filesPackage = files;

  }

  /**
   * Drag and drop file into message box
   */
  _$('#message').on('drop', dropFile);

  /**
   * Reset the message box on click
   */
  _$('#message').bind('click', resetForm);

  /**
   * Assign the send event
   */
  _$('#send').bind('click', sendMessage);

  /**
   * Assign the send event
   */
  _$('#reset').bind('click', resetForm);

  /**
   * Add window listener
   */
  window.addEventListener('message', onMessageListener);

  resetForm();

  /**
   * Connect to the host
   */
  ifclientLib.connect();

}
