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
   * Deferred Library
   * @type {{create: createDefer, when: createWhen, all: createAll}}
   */
  var deferredLib = deferredLibrary(_$);
  var ifhcClient = ifhc.client (deferredLib);

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
  vmDataHandler [ifhc.const.package.CLIENT_LIST_TYPE] = updateContacts;

  /**
   * VM Handler for Text Message
   * @param VM
   * @param response
   */
  vmDataHandler [ifhc.const.package.TEXT_MESSAGE_TYPE] = updateResponse;

  /**
   * VM Handler for File Type
   * @param VM
   * @param response
   */
  vmDataHandler [ifhc.const.package.FILES_TYPE] = updateResponse;

  /**
   * Window Message Listener
   * @param event
   */
  function onMessageListener(event) {

    /**
     * Listen for transmissions
     */
    ifhcClient.listen(event)

    /**
     * pass to the appropriate scope handler
     */
      .then(function (receivedPackage) {
        return vmDataHandler [receivedPackage.type](receivedPackage);
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
   * @param receivedPackage
   */
  function updateContacts(receivedPackage) {

    var $contacts = _$('#contacts');
    var clients = receivedPackage.list;
    contacts = clients;

    $contacts.empty();

    for (var n = 0, nLen = clients.length; n < nLen; n++) {
      var contact = clients [n];
      $contacts.append('<option value = "' + contact + '">' + contact + '</option>');
    }

    $contacts.index(0);

  }

  /**
   * Update the response from the host
   * @param pkg
   */
  function updateResponse(receivedPackage) {
    _$("#response").prepend(receivedPackage.body);
  }

  /**
   * Send Message
   */
  function sendMessage() {

    var $contacts = _$('#contacts');
    var recipient = $contacts.val();
    var recipients = recipient === 'ALL' ? contacts.slice(1) : [recipient];
    var message = _$('#message').val();

    if (filesPackage) {
      ifhcClient.sendFiles(recipients, filesPackage, false);
    }
    else {
      ifhcClient.sendMessage(recipients, message, false);
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

    _$(this).val(ifhc.util.createFileList(files));

    filesPackage = files;

  }

  username = ifhcClient.getUsername();

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
  ifhcClient.connect();

}
