/**
 * Document Onload Function
 * @param _$
 */
function onDOMContentLoaded(_$) {

  'use strict';

  var username = "";
  var contacts = "";
  var filesAttachment = null;

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
  vmDataHandler [ifhc.const.attachment.CLIENT_LIST_TYPE] = updateContacts;

  /**
   * VM Handler for Text Message
   * @param VM
   * @param response
   */
  vmDataHandler [ifhc.const.attachment.TEXT_MESSAGE_TYPE] = updateResponse;

  /**
   * VM Handler for File Type
   * @param VM
   * @param response
   */
  vmDataHandler [ifhc.const.attachment.FILES_TYPE] = updateResponse;

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
      .then(function (receivedAttachment) {
        return vmDataHandler [receivedAttachment.type](receivedAttachment);
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
   * @param receivedAttachment
   */
  function updateContacts(receivedAttachment) {

    var $contacts = _$('#contacts');
    var clients = receivedAttachment.list;
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
  function updateResponse(receivedAttachment) {

    // If this is the initial connection message display
    // then display the whale image
    receivedAttachment.body = receivedAttachment.body === '<p>Window > Connected to Window</p>' ? '<img src="/img/sad-whale.jpg">' : receivedAttachment.body;

    _$("#response").html(receivedAttachment.body);
    var counter = parseInt(_$("#response-counter").html()) + 1;
    _$("#response-counter").html(counter++);
  }

  /**
   * Send Message
   */
  function sendMessage() {

    var $contacts = _$('#contacts');
    var recipient = $contacts.val();
    var recipients = recipient === 'ALL' ? contacts.slice(1) : [recipient];
    var message = _$('#message').val();

    if (filesAttachment) {
      ifhcClient.sendFiles(recipients, filesAttachment, false);
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

    filesAttachment = null;
    _$("#message").val('Type a message / drag and drop a file into here');

  }


  /**
   * On Drop of a file
   * @param event
   */
  function dropFile(event) {

    var files = event.originalEvent.dataTransfer.files;

    event.preventDefault();

    _$(this).val(ifhc.util.createFileList(files));

    filesAttachment = files;

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
   //TODO resolve this timing issue bug - not the best solution but will do for now
  setTimeout (ifhcClient.connect, 1500);

}
