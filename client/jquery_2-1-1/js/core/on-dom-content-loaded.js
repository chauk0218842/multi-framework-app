/**
 * Document Onload Function
 * @param _$
 */
function onDOMContentLoaded(_$) {

  'use strict';

  var username = "";
  var contacts = "";
  var filesPackage = null;

  /**
   * HASH Library
   * @type {{create: createHASHBucket, createKey: createHASHKey}}
   */

  var hashLib = hashLibrary(window.btoa);

  /**
   * Deferred Library
   * @type {{create: createDefer, when: createWhen, all: createAll}}
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
   * VM Handler
   * @type {{}}
   */
  var vmDataHandler = {};

  /**
   * VM Handler for Client List
   * @param VM
   * @param clients
   */
  vmDataHandler [ifpackLib.const.CLIENT_LIST_TYPE] = updateContacts;

  /**
   * VM Handler for Text Message
   * @param VM
   * @param response
   */
  vmDataHandler [ifpackLib.const.TEXT_MESSAGE_TYPE] = updateResponse;

  /**
   * VM Handler for File Type
   * @param VM
   * @param response
   */
  vmDataHandler [ifpackLib.const.FILES_TYPE] = updateResponse;

  /**
   * Window Message Listener
   * @param event
   */
  function onMessageListener(event) {

    /**
     * Listen for transmissions
     */
    ifclientLib.listen(event)

    /**
     * Process the data
     */
      .then(function (receivedPackage) {

        return ifpackLib.process(receivedPackage)

        /**
         * pass to the appropriate scope handler
         */
          .then(vmDataHandler [receivedPackage.type]);

      })

    /**
     * Error handler
     */
      .then(null, function () {
        debugger;
      });

  }

  /**
   * Update the contact list received from the host
   * Unlike Angular, the updating of a "select" is easier than Angular in which we don't need to do a lot updating
   * So no need for a promise
   * @param clients
   */
  function updateContacts(clients) {

    var $contacts = _$('#contacts');

    contacts = clients;

    $contacts.empty();

    clients = clients.sort();

    for (var n = 0, nLen = clients.length; n < nLen; n++) {
      var contact = clients [n];

      if (contact === username) {
        continue;
      }
      $contacts.append('<option value = "' + contact + '">' + contact + '</option>');
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
    var recipient = $contacts.val();
    var recipients = recipient === 'ALL' ? contacts.slice (0, contacts.length) : [recipient];
    var message = _$('#message').val();

    if (filesPackage) {
      ifclientLib.sendFiles (recipients, filesPackage, false);
    }
    else {
      ifclientLib.sendMessage (recipients, message, false);
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
   * On Drop of a file
   * @param event
   */
  function dropFile(event) {

    var files = event.originalEvent.dataTransfer.files;

    event.preventDefault();

    _$(this).val(utilLib.createFileList(files));

    filesPackage = files;

  }

  username = ifclientLib.getUsername ();

  /**
   * Assign the client name
   */
  _$('#clientName').text(username);

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
