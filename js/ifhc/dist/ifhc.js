/**
 * @description
 * ifhc Library
 * The library that allows different Single Page Applications (SPAs) to be able to reside in harmony on a single browser window via
 * I--F--R--A--M--E--S!!!.
 */
var ifhc = (function (window) {

  'use strict';

  /**
   * TODO need to write base64 encoder for browsers < IE 10
   */
  if (typeof(window.btoa) === 'undefined') {
    console.error('cannot instantiate ifhc: base64 encoder not available');
    return;
  }

  /**
   * The public API object to be hoisted to the global scope / window
   * @type {null}
   */
  var api = null;

  /**
   * Check if global scoped API is defined
   */
  if (typeof(ifhc) !== 'undefined') {
    api = ifhc;
  }

  /**
   * Otherwise assign window scoped API
   */
  else if (typeof(window.ifhc) !== 'undefined') {
    api = window.ifhc;
  }

  /**
   * No brainer, define a new object if all fails :-)
   */
  api = api || {};

  /**
   * Version (DUH)
   * @type {string}
   */
  api.version = "1.0.1";

  /**
   * Either
   */
  ifhc = window.ifhc = api;

  /**
   * Base64 encoder that is used in the API
   * @type {Function}
   */
  var base64Encoder = window.btoa;
  /**
   * Package Constants
   * @type {{}}
   */
  var attachmentConstant = {
    GENERIC_TYPE: 'generic type',
    CLIENT_LIST_TYPE: 'client list type',
    TEXT_MESSAGE_TYPE: 'text message type',
    FILES_TYPE: 'files type'
  };
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
        recipient: params.recipient,
        receipt: params.receipt
      };
    }

    /**
     * Client List type
     * @type {createClientListAttachment}
     */
    attachmentCreator[attachmentConst.CLIENT_LIST_TYPE] = createClientListAttachment;

    /**
     * Text Message type
     * @type {createTextMessageAttachment}
     */
    attachmentCreator[attachmentConst.TEXT_MESSAGE_TYPE] = createTextMessageAttachment;

    /**
     * Files type
     * @type {createFileAttachment}
     */
    attachmentCreator[attachmentConst.FILES_TYPE] = createFileAttachment;

    /**
     * Create a New Attachment
     * @param params
     * @returns {*}
     */

    function createNewAttachment(params) {
      return attachmentCreator[params.type] ? attachmentCreator[params.type](params) : createAttachment(null);
    }

    /**
     * Public API
     */
    return {
      const: attachmentConst,
      create: createNewAttachment
    };
  }
  /**
   * HASH Library
   * Basic HASH library object - useful for tracking objects
   * @param encodeToBase64 - Encode to base64 function
   * @returns {{create: createHASHBucket, createKey: createHASHKey}}
   */

  function hashLibrary(encodeToBase64) {

    'use strict';

    /**
     * Generate Bucket
     * @returns {{set: setInBucket, remove: removeFromBucket}}
     */

    function createHASHBucket() {

      /**
       * HASH bucket
       * @type {{}}
       */
      var bucket = {};

      /**
       * Get a value based on key
       * @param key
       * @returns {*}
       */

      function getFromBucket(key) {
        return bucket[key];
      }

      /**
       * Set value in HASH with given key
       * @param key
       * @param value
       */

      function setInBucket(key, value) {

        if (!(typeof key === "string" || typeof key === "number")) {
          throw new Error(0, "invalid key type");
        }
        bucket[key] = value;

        return bucket[key];
      }

      /**
       * Delete a value with given key
       * @param key
       */

      function removeFromBucket(key) {
        bucket[key] = null;
      }

      /**
       * Public API
       */
      return {
        get: getFromBucket,
        set: setInBucket,
        remove: removeFromBucket
      };
    }

    /**
     * Generate a HASH key
     * @param value
     * @returns {*}
     */

    function createHASHKey(value) {
      return encodeToBase64(value);
    }

    /**
     * Public API
     */
    return {
      create: createHASHBucket,
      createKey: createHASHKey
    };
  }
  /**
   * Client Library
   * This is the base client library, responsible for sending "messages" to the host/server window
   * @param serverConst - Server constant
   * @returns {{send: sendMessageToHost, listen: listenToServer}}
   * @constructor
   */

  function clientLibrary(serverConst) {

    'use strict';

    /**
     * Send a request to server
     * @param message
     */

    function sendMessageToHost(message) {
      parent.postMessage(message, serverConst.DOMAIN_NAME);
    }

    /**
     * Listen to request responded back from Server
     * @param event
     * @returns {*}
     */

    function listenToServer(event) {
      return event.data;
    }

    /**
     * Public API
     */
    return {
      send: sendMessageToHost,
      listen: listenToServer
    };
  }
  /**
   * Server Constants object
   * @type {{SERVER_NAME: string, DOMAIN_NAME: string}}
   */
  var serverConstant = {

    /**
     * A display name for the "window" server
     */
    SERVER_NAME: "Window",

    /**
     * Domain name used for window.postMessage()
     */
    DOMAIN_NAME: "*"
  };
  /**
   * Server Library
   * Base server library, responsible for listening to messages from client IFrames
   * @param serverConst - Server constant
   * @param hash - HASH library
   * @returns {{const: *, connectClient: connectClient, disconnectClient: disconnectClient, getConnectedClients: getConnectedClients, send: sendMessageToClient}}
   */

  function serverLibrary(serverConst, hash) {

    'use strict';

    /**
     * List of connected clients
     * @type {Array}
     */
    var clientsCollection = [];

    /**
     * List of IFrames stored in a HASH
     */
    var iframeHASH = hash.create();

    /**
     * Add a new Client
     * @param clientID
     * @returns {Number}
     */

    function connectClient(clientID) {
      clientsCollection.push(clientID);
      iframeHASH.set(clientID, clientsCollection[clientsCollection.length - 1]);
    }

    /**
     * Remove client
     * @param clientID
     */

    function disconnectClient(clientID) {
      /**
       * TODO need to remove clients from the clientsCollection when they disconnect
       */
      iframeHASH.remove(clientID);
    }

    /**
     * Get Client list
     * @returns {Array}
     */

    function getConnectedClients() {
      return clientsCollection.sort();
    }

    /**
     * Send message to client IFrame
     * @param clientID
     * @param message
     */

    function sendMessageToClient(clientID, message) {
      document.getElementById(clientID).contentWindow.postMessage(message, serverConst.DOMAIN_NAME);
    }

    /**
     * Public API
     */
    return {
      const: serverConst,
      connectClient: connectClient,
      disconnectClient: disconnectClient,
      getConnectedClients: getConnectedClients,
      send: sendMessageToClient
    };
  }
  /**
   * Transmission Library
   * @param createHASHKey - Create HASH key function
   * @returns {{create: createNewTransmission}}
   */

  function transmissionLibrary(createHASHKey) {

    'use strict';

    /**
     * Request ID prefix
     * @type {string}
     */
    var keyPrefix = "A";

    /**
     * Request ID counter
     * @type {number}
     */
    var keyCounter = 0;

    /**
     * Create a Message
     * @param transID
     * @param uri - TODO change URI to request or something else
     * @param clientID
     * @param attachment
     * @returns {{id: *, client: *, host: *, urn: *, parameters: *, receipt: *}}
     */

    function createTransmission(transID, uri, clientID, attachment) {
      return {
        id: transID,
        uri: uri,
        client: clientID,
        attachment: attachment
      };
    }

    /**
     * Create Response - this is for the server to respond back to incoming transmissions from clients,
     * OR when receipts are enabled during a client-to-host-to-client communication - the receiving client will have to "respond" back to
     * their incoming trans
     * @param trans
     * @param attachment
     * @returns {{id: *, client: *, host: *, urn: *, parameters: *, receipt: *}}
     */

    function createResponseTransmission(trans, attachment) {
      return createTransmission(trans.id, trans.uri, trans.client, attachment);
    }

    /**
     * Generate a Request
     * @param uri
     * @param clientID
     * @param attachment
     * @returns {{id: (string|*), host: (XML|string|void|*), urn: (XML|string|void|*), parameters: *, receipt: *}}
     */

    function createNewTransmission(uri, clientID, attachment) {
      return createTransmission(String(createHASHKey(keyPrefix + (keyCounter++))), uri, clientID, attachment);
    }

    /**
     * Public API
     */
    return {
      create: createNewTransmission,
      createResponse: createResponseTransmission
    };
  }
  /**
   * Utility Library
   * Helper library
   * @returns {{formatBytesToUnits: formatBytesToUnits, createFileList: createFileList}}
   */

  function utilityLibrary() {

    'use strict';

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
     * @returns {string}
     */

    function createFileList(files) {

      var fileList = "";

      for (var n = 0, file; file = files[n]; n++) {
        fileList += (n + 1) + '. ' + file.name + ' (' + formatBytesToUnits(file.size) + ')\n';
      }

      return fileList;
    }

    /**
     * Public API
     */
    return {
      formatBytesToUnits: formatBytesToUnits,
      createFileList: createFileList
    };
  }
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
      receivedAttachment.body = '<p>' + ('%CLIENT% > %MESSAGE%').replace(/%CLIENT%/g, receivedAttachment.sender).replace(/%MESSAGE%/g, receivedAttachment.body) + '</p>';
      return deferred.when(receivedAttachment);
    }

    /**
     * Response formatter for Image file type
     * @param index
     * @param file
     * @returns {string}
     */
    responseFileHTMLFormatter["image"] = function (index, fileInfo) {
      // return '<br/>' + index + '. <a href = "' + fileInfo.url + '" target = "new">' + fileInfo.file.name + '</a> (' + formatBytesToUnits(fileInfo.file.size) + ')<br/><a href = "' + fileInfo.url + '" target = "new"><img class = "thumbnail" src = ' + fileInfo.url + '></a><br/>';
      // Returning just the image
      // CSS handles the sizing and positioning
      return '<img src="' + fileInfo.url + '"/>';
    };

    /**
     * Response formatter for Text file type
     * @param index
     * @param file
     * @returns {string}
     */
    responseFileHTMLFormatter["text"] = function (index, fileInfo) {
      return '<p><a href="' + fileInfo.url + '" target="_blank">' + fileInfo.file.name + '</a> (' + formatBytesToUnits(fileInfo.file.size) + ')<p/>';
    };

    /**
     * Response formatter for JSON file type
     * @param index
     * @param file
     * @returns {string}
     */
    responseFileHTMLFormatter["json"] = function (index, fileInfo) {
      return '<p><a href="' + fileInfo.url + '" target="_blank">' + fileInfo.file.name + '</a> (' + formatBytesToUnits(fileInfo.file.size) + ')<p/>';
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
          responseHTML += responseFileHTMLFormatter[fileInfo.file.type.replace(/(^application\/)+|(\/.*)/, "")](fileCount, fileInfo);
        });

        /**
         * When a file is completed processing, the respectivce defer needs to be resolved
         */
        fileReader.onloadend = (function (deferKey, file) {
          return function (event) {
            if (event.target.readyState == FileReader.DONE) {
              deferHASH.get(deferKey).resolve({
                file: file,
                url: event.target.result
              });
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
          body: responseHTML,
          useReceipt: receivedAttachment.receipt
        });
      });
    }

    /**
     * Client list attachment
     * @type {processClientListAttachment}
     */
    attachmentProcessor[attachment.const.CLIENT_LIST_TYPE] = processClientListAttachment;

    /**
     * Text message attachment
     * @type {processTextMessageAttachment}
     */
    attachmentProcessor[attachment.const.TEXT_MESSAGE_TYPE] = processTextMessageAttachment;

    /**
     * Files type attachment
     * @type {processFilesAttachment}
     */
    attachmentProcessor[attachment.const.FILES_TYPE] = processFilesAttachment;

    /**
     * Process Attachment
     * @param receivedAttachment
     * @returns {*}
     */

    function processAttachment(receivedAttachment) {
      return deferred.when(attachmentProcessor[receivedAttachment.type](receivedAttachment));
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
  /**
   * API Client Library
   * Used to allow IFrame Clients to connect to the Host
   * @param hash
   * @param client
   * @param transmission
   * @param routeConst
   * @param attachment
   * @param deferred
   * @returns {{listen: receiveTransmissionFromHost, connect: connectToHost, disconnect: disconnectFromHost, getUsername: getUsername, getClients: getClientListFromHost, getRequestLog: getRequestLog, getResponseLog: getResponseLog, sendMessage: sendMessageToClients, sendFiles: sendFilesToClients}}
   */

  function apiClientLibrary(hash, client, transmission, routeConst, attachment, deferred) {

    'use strict';

    /**
     * Extract the IFrame ID from teh param string
     * @type {string}
     */
    var param = location.toString().replace(/^[^\?]+\?/g, '');

    /**
     * @type {Array}
     */
    var paramList = param.split('&');

    /**
     * Extracted IFrame ID from the URI parameters
     * @type {XML|string|void|*}
     */
    var clientID = paramList[0].replace(/^id=/g, '');

    /**
     * Defer HASH used to track all the promises that need to be resolved
     */
    var deferHASH = hash.create();

    /**
     * A collection of all Client requests
     * @type {Array}
     */
    var requestList = [];

    /**
     * A collection of all Host responses
     * @type {Array}
     */
    var responseList = [];

    /**
     * Cookie cutter for text message sent from the client
     * @param parameters
     * @returns {*}
     */

    function clientAttachmentResponse(parameters) {
      parameters.sender = clientID;
      return attachment.create(parameters);
    }

    /**
     * Receive transmission from Host
     * Returns a deferred object
     * @param event
     */

    function receiveTransmissionFromHost(event) {

      /**
       * Received transmission
       * @type {*}
       */
      var receivedTransmission = client.listen(event);

      /**
       * Find the Defer object that should be resolved
       */
      var defer = deferHASH.get(receivedTransmission.id);

      /**
       * Keep track of all transmissions received
       */
      responseList.push(receivedTransmission);

      /**
       * Handle specific requests that require receipts when transmission is made
       * When a client sends a transmission they have the option to enable "receipts" which the recipient upon receiving a transmission
       * must respond with a response message to the sender.
       * TODO implement receipts for client-to-client messaging
       */
      if (defer) {
        defer.resolve(receivedTransmission);
      }

      console.log(('%CLIENT% > Received a response from host: %RESPONSE%').replace(/%CLIENT%/g, clientID).replace(/%RESPONSE%/g, event.data.toString()));

      return deferred.when(attachment.process(receivedTransmission.attachment));

    }

    /**
     * Send a message to Host
     * Returns a deferred object
     * @param receivedTransmission
     * @returns {*}
     */

    function sendTransmissionToHost(receivedTransmission) {

      /**
       * Create a Defer object that should be resolved later on when the listener receives a response
       */
      var defer = deferHASH.set(receivedTransmission.id, deferred.create());
      requestList.push(receivedTransmission);
      client.send(receivedTransmission);
      console.log(('%CLIENT% > Sent a request to host: "%URI%"').replace(/%CLIENT%/g, clientID).replace(/%URI%/g, receivedTransmission.uri));

      return defer;
    }

    /**
     * Create a transmission and send it to the host
     * TODO make this into a real curried function
     * @param route
     * @param attachment
     * @returns {*}
     */

    function createTransmissionAndSendToHost(route, attachment) {
      return sendTransmissionToHost(transmission.create(route, clientID, attachment)).then(function (responseTransmission) {
        return responseTransmission.attachment;
      });
    }

    /**
     * Connect to Host
     * Returns a deferred object
     * @returns {*}
     */

    function connectToHost() {
      return createTransmissionAndSendToHost(routeConst.CONNECT_CLIENT, null);
    }

    /**
     * Disconnect from Host
     * Returns a deferred object
     * @returns {*}
     */

    function disconnectFromHost() {
      return createTransmissionAndSendToHost(routeConst.DISCONNECT_CLIENT, null);
    }

    /**
     * Get Username
     * @returns {XML|string|void|*}
     */

    function getUsername() {
      return clientID;
    }

    /**
     * Get Clients from Host
     * Returns a deferred object
     * @returns {*}
     */

    function getClientListFromHost() {
      return createTransmissionAndSendToHost(routeConst.REQUEST_CLIENT_LIST, null);
    }

    /**
     * Get all client-to-host requests
     * @returns {Array}
     */

    function getRequestLog() {
      return requestList;
    }

    /**
     * Get all host-to-client responses
     * @returns {Array}
     */

    function getResponseLog() {
      return responseList;
    }

    /**
     * Send attachment to clients
     * @param clients
     * @param sendAttachment
     * @returns {Array}
     */

    function sendAttachmentToClients(clients, sendAttachment) {

      /**
       * Collection of defers that will be returned
       * @type {Array}
       */
      var deferList = [];
      for (var n = 0, nLen = clients.length; n < nLen; n++) {

        /**
         * Update the attachment's recipient
         * TODO - need to create a attachment.updateReceipient function...
         */
        sendAttachment.recipient = clients[n];

        /**
         * TODO when implementing use receipt, we need to figure out how to capture the responses and post process them
         */
        deferList.push(createTransmissionAndSendToHost(routeConst.SEND_CLIENT_ATTACHMENT, sendAttachment));

      }

      return deferList;
    }

    /**
     * Send text message to client
     * TODO need to implement use receipts, make note that you are dealing with an array of defers...
     * TODO make use currying and curry with sendAttachmentToClients
     * @param clients
     * @param body
     * @param useReceipt
     * @returns {*}
     */

    function sendMessageToClients(clients, body, useReceipt) {

      /**
       * TODO recipient is null... not sure if thats a good idea
       */
      var sendAttachment = clientAttachmentResponse({
        type: attachment.const.TEXT_MESSAGE_TYPE,
        recipient: null,
        body: body,
        receipt: useReceipt
      });

      return sendAttachmentToClients(clients, sendAttachment);
    }

    /**
     * Send files to a client
     * TODO need to implement use receipts, make note that you are dealing with an array of defers...
     * TODO make use currying and curry with sendAttachmentToClients
     * @param recipients
     * @param files
     * @param useReceipt
     * @returns {*}
     */

    function sendFilesToClients(recipients, files, useReceipt) {

      /**
       * TODO recipient is null... not sure if thats a good idea
       */
      var sendAttachment = clientAttachmentResponse({
        type: attachment.const.FILES_TYPE,
        recipient: null,
        files: files,
        receipt: useReceipt
      });

      return sendAttachmentToClients(recipients, sendAttachment);
    }

    /**
     * Public API
     */
    return {
      listen: receiveTransmissionFromHost,
      connect: connectToHost,
      disconnect: disconnectFromHost,
      getUsername: getUsername,
      getClients: getClientListFromHost,
      getRequestLog: getRequestLog,
      getResponseLog: getResponseLog,
      sendMessage: sendMessageToClients,
      sendFiles: sendFilesToClients
    };
  }
  /**
   * API Host Library
   * @param router - Router library
   * @returns {{listen: listen}}
   * @constructor
   */

  function apiHostLibrary(router) {

    'use strict';

    /**
     * Window listener event handler
     * @param event
     */

    function receiveTransmissionFromClient(event) {
      router.process(event.data);
      console.log(("HOST > Processing a request: %URI%").replace(/%URI%/g, event.data.uri));
    }

    /**
     * Public API
     */
    return {
      listen: receiveTransmissionFromClient
    };

  }
  /**
   * API Route Constants
   * @type {{CONNECT_CLIENT: string, DISCONNECT_CLIENT: string, REQUEST_CLIENT_LIST: string, SEND_CLIENT_ATTACHMENT: string}}
   */
  var apiRouteConstant = {

    /**
     * Invalid request
     */
    INVALID_REQUEST: "invalid request",

    /**
     * Client: connect to host
     */
    CONNECT_CLIENT: "connect client",

    /**
     * Client: disconnect from host
     */
    DISCONNECT_CLIENT: "disconnect client",

    /**
     * Client: request connected clients list from host
     */
    REQUEST_CLIENT_LIST: "request client list",

    /**
     * Client: send a message to a client
     */
    SEND_CLIENT_ATTACHMENT: "send client attachment"
  };
  /**
   * API Router Library
   * Used by the api-host-library to process incoming transmission request as a route, and responds back to request with a server response
   * TODO -  may want to consider including a promise library that is dependent on the version of the JS Framework used...
   * @param transmission - Transmission library
   * @param server - Server library
   * @param attachment - Attachment library
   * @param routeConst - Route constant
   * @param routerExt - Custom Router Extension TODO - need to implement this feature
   * @returns {{const: *, process: processTransmission}}
   */

  function apiRouterLibrary(transmission, server, attachment, routeConst, routerExt) {

    'use strict';

    /**
     * Transmission Processor
     * @type {{}}
     */
    var transmissionProcessor = {};

    /**
     * Cookie cutter for text message sent from the server
     * @param parameters
     * @returns {*}
     */

    function serverAttachmentResponse(parameters) {
      parameters.sender = server.const.SERVER_NAME;
      return attachment.create(parameters);
    }

    /**
     * Connect a client
     * @param receivedTransmission
     */

    function connectClient(receivedTransmission) {

      var sendAttachment = serverAttachmentResponse({
        type: attachment.const.TEXT_MESSAGE_TYPE,
        recipient: receivedTransmission.client,
        body: ('Connected to %SERVER%').replace(/%SERVER%/g, server.const.SERVER_NAME),
        receipt: false
      });

      server.connectClient(receivedTransmission.client);
      server.send(receivedTransmission.client, transmission.createResponse(receivedTransmission, sendAttachment));
    }

    /**
     * Disconnect a client
     * @param receivedTransmission
     */

    function disconnectClient(receivedTransmission) {

      var sendAttachment = serverAttachmentResponse({
        type: attachment.const.TEXT_MESSAGE_TYPE,
        recipient: receivedTransmission.client,
        body: ('Disconnected from %SERVER%').replace(/%SERVER%/g, server.const.SERVER_NAME),
        receipt: false
      });

      server.disconnectClient(receivedTransmission.client);
      server.send(receivedTransmission.client, transmission.createResponse(receivedTransmission, sendAttachment));
    }

    /**
     * Create a client list that excludes the request client
     * @param clientID
     */

    function createClientList(clientID) {
      var list = server.getConnectedClients();
      var newList = [];
      for (var n = 0, nLen = list.length; n < nLen; n++) {
        if (list[n] === clientID) {
          continue;
        }
        newList.push(list[n]);
      }

      return newList;
    }

    /**
     * Calls server api to message clients with a refreshed connected client list
     * (Occurs whenever a new client joins the network)
     */

    function updateClientsClientList() {

      var clientList = server.getConnectedClients();

      /**
       * Respond back to the client that made the request
       */
      for (var n = 0, nLen = clientList.length; n < nLen; n++) {
        var clientID = clientList[n];

        /**
         * Create a client list attachment
         */
        var sendAttachment = serverAttachmentResponse({
          type: attachment.const.CLIENT_LIST_TYPE,
          recipient: clientID,
          list: createClientList(clientID),
          receipt: false
        });

        /**
         * Respond back to client with a transmission response
         */
        server.send(clientID, transmission.create(routeConst.REQUEST_CLIENT_LIST, clientID, sendAttachment));
      }
    }

    /**
     * Calls server api to respond back to client's request for a refreshed connected client list
     * @param receivedTransmission
     */

    function getClientList(receivedTransmission) {

      /**
       * Create a client list attachment
       */
      var sendAttachment = serverAttachmentResponse({
        type: attachment.const.CLIENT_LIST_TYPE,
        recipient: receivedTransmission.client,
        list: createClientList(receivedTransmission.client),
        receipt: false
      });

      /**
       * Respond back to the client that made the request
       */
      server.send(receivedTransmission.client, transmission.createResponse(receivedTransmission, sendAttachment));
    }

    /**
     * Forward a client a Attachment
     * @param receivedTransmission
     */

    function sendClientAttachment(receivedTransmission) {

      /**
       * Extract the recipient from the parameters
       */
      server.send(receivedTransmission.attachment.recipient, transmission.createResponse(receivedTransmission, receivedTransmission.attachment));
    }

    /**
     * A bad route / invalid URI
     * @param receivedTransmission
     */

    function handleInvalidRequest(receivedTransmission) {

      var sendAttachment = serverAttachmentResponse({
        type: attachment.const.TEXT_MESSAGE_TYPE,
        recipient: receivedTransmission.client,
        body: 'You 404\'ed!!',
        receipt: false
      });

      server.send(receivedTransmission.client, transmission.createResponse(receivedTransmission, sendAttachment));
    }

    /**
     * Connect a client
     */
    transmissionProcessor[routeConst.CONNECT_CLIENT] = function transmissionProcessorConnectClient(receivedTransmission) {
      connectClient(receivedTransmission);
      updateClientsClientList();
    };

    /**
     * Disconnect a client
     */
    transmissionProcessor[routeConst.DISCONNECT_CLIENT] = function transmissionProcessorDisconnectClient(receivedTransmission) {
      disconnectClient(receivedTransmission);
      updateClientsClientList();
    };

    /**
     * Get client list
     */
    transmissionProcessor[routeConst.REQUEST_CLIENT_LIST] = function transmissionProcessorRequestClientList(receivedTransmission) {
      getClientList(receivedTransmission);
    };

    /**
     * Send a transmission to client
     */
    transmissionProcessor[routeConst.SEND_CLIENT_ATTACHMENT] = function transmissionProcessorSendClientAttachment(receivedTransmission) {
      sendClientAttachment(receivedTransmission);
    };

    /**
     * Something equivalent to a 404 (lol)
     */
    transmissionProcessor[routeConst.INVALID_REQUEST] = handleInvalidRequest;

    /**
     * Process an encoded trans
     * @param receivedTransmission
     * @returns {*}
     */

    function processTransmission(receivedTransmission) {

      /**
       * Handle the request
       */
      if (transmissionProcessor[receivedTransmission.uri]) {
        return transmissionProcessor[receivedTransmission.uri](receivedTransmission);
      }

      /**
       * Custom server extension routine that needs to be executed
       * TODO we need to test this
       */
      else if (routerExt) {
        //var oResp = routerExt.call(null, routeConst, transmission, transmission, server, trans);
        //return server.send(oResp.client, oResp.trans);
      }

      /**
       * Something equivalent to a 404 (lol)
       */
      return transmissionProcessor[routeConst.INVALID_REQUEST](receivedTransmission);
    }

    /**
     * Public API
     */
    return {
      const: routeConst,
      process: processTransmission
    };
  }
  /**
   * Utility Library
   * @type {{formatBytesToUnits: formatBytesToUnits, createFileList: createFileList}}
   */
  var util = utilityLibrary();

  /**
   * Core API
   * @type {{}}
   */
  var core = {};

  /**
   * Core Client Library
   */
  core.client = clientLibrary(serverConstant);

  /**
   * Core HASH Library
   */
  core.hash = hashLibrary(base64Encoder);

  /**
   * Core Attachment Constant
   * @type {{}}
   */
  core.attachmentConst = attachmentConstant;

  /**
   * Core Attachment Library
   */
  core.attachment = attachmentLibrary(core.attachmentConst);

  /**
   * Core Server Constant
   * @type {{SERVER_NAME: string, DOMAIN_NAME: string}}
   */
  core.serverConst = serverConstant;

  /**
   * Core Server Library
   */
  core.server = serverLibrary(core.serverConst, core.hash);

  /**
   * Core Transmission Library
   */
  core.transmission = transmissionLibrary(core.hash.createKey);

  /**
   * API constants
   * @type {{}}
   */
  api.const = {};

  /**
   * API Routes
   * @type {{CONNECT_CLIENT: string, DISCONNECT_CLIENT: string, REQUEST_CLIENT_LIST: string, SEND_CLIENT_ATTACHMENT: string}}
   */
  api.const.route = apiRouteConstant;

  /**
   * Attachment types
   * @type {attachmentConst|*|*}
   */
  api.const.attachment = core.attachment.const;

  /**
   * API Host Library
   * TODO need to consider exposing router function such that some people may want to write their own router?
   */
  api.host = function apiHost(routerExtension) {
    var router = apiRouterLibrary(core.transmission, core.server, core.attachment, api.const.route, routerExtension);
    return apiHostLibrary(router);
  };

  /**
   * API Library
   * This requires you to provide your own deferred
   */
  api.client = function apiClient(deferred) {

    if (typeof(deferred) === 'undefined') {
      console.error('cannot instantiate "client" - Deferred library not provided');
      return;
    }

    /**
     * Define the attachment library
     * TODO need to refactor this clunkiness
     * @type {*}
     */
    var attachment = apiAttachmentLibrary(core.hash, core.attachment, util.formatBytesToUnits, deferred);
    return apiClientLibrary(core.hash, core.client, core.transmission, api.const.route, attachment, deferred);
  };

  /**
   * Utility Library
   */
  api.util = util;

  /**
   * Public API
   */
  return api;

})(window);