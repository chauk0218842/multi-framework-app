/******************************************************************************************************
 * API TEMPLATE HEADER STARTS HERE
 ******************************************************************************************************/
base64Encoder = typeof(base64Encoder) === 'undefined' ? window.btoa : base64Encoder;

/**
 * ifhc Library
 * TODO - write a task script for this (this is just a mock layout
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

  /******************************************************************************************************
   * API TEMPLATE HEADER ENDS HERE
   ******************************************************************************************************/

  /******************************************************************************************************
   * GENERATED SOURCE STARTS HERE
   ******************************************************************************************************/
  /**
   * HASH Library
   * @param encodeToBase64
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
     * @returns {string}
     */

    function createHASHKey(__sValue) {
      return encodeToBase64(__sValue);
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
   * @param serverConst
   * @returns {{send: sendTransmissionToHost, listen: listenToServer}}
   * @constructor
   */

  function clientLibrary(serverConst) {

    'use strict';

    /**
     * Send a request to server
     * @param transmission
     */

    function sendTransmissionToHost(transmission) {
      parent.postMessage(transmission, serverConst.DOMAIN_NAME);
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
      send: sendTransmissionToHost,
      listen: listenToServer
    };
  }
  /**
   * Package Constants
   * @type {{}}
   */
  var packageConstant = {
    GENERIC_TYPE: 'generic type',
    CLIENT_LIST_TYPE: 'client list type',
    TEXT_MESSAGE_TYPE: 'text message type',
    FILES_TYPE: 'files type'
  };
  /**
   * Package Library
   * @param packgConst
   * @returns {{const: (packgConst|*), create: createNewPackage}}
   */

  function packageLibrary(packgConst) {

    'use strict';

    /**
     * Create client list package
     * @param params
     */

    function createClientListPackage(params) {
      var pkg = createPackage(params);
      pkg.list = params.list;
      return pkg;
    }

    /**
     * Create a text message package
     * @param params
     * @returns {{type: *}}
     */

    function createTextMessagePackage(params) {
      var pkg = createPackage(params);
      pkg.body = params.body;
      return pkg;
    }

    /**
     * Create a files package
     * @param params
     * @returns {{type: *}}
     */

    function createFilePackage(params) {
      var pkg = createPackage(params);
      pkg.files = params.files;
      return pkg;
    }

    /**
     * Create a Package
     * @param params
     * @returns {{type: *}}
     */

    function createPackage(params) {
      return {
        type: params.type || packgConst.GENERIC_TYPE,
        sender: params.sender,
        recipient: params.recipient,
        receipt: params.receipt
      };
    }

    /**
     * Create a New Package
     * @param params
     * @returns {*}
     */

    function createNewPackage(params) {

      var packageHandler = {};
      packageHandler[packgConst.CLIENT_LIST_TYPE] = createClientListPackage;
      packageHandler[packgConst.TEXT_MESSAGE_TYPE] = createTextMessagePackage;
      packageHandler[packgConst.FILES_TYPE] = createFilePackage;

      return packageHandler[params.type] ? packageHandler[params.type](params) : createPackage(null);
    }

    /**
     * Public API
     */
    return {
      const: packgConst,
      create: createNewPackage
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
   * @param serverConst
   * @param hashLib
   * @returns {{const: *, addClient: addClient, removeClient: removeClient, getClientList: getClientList, send: sendTransmission}}
   */

  function serverLibrary(serverConst, hashLib) {

    'use strict';

    /**
     * List of connected clients
     * @type {Array}
     */
    var clientList = [];

    /**
     * List of IFrames stored in a HASH
     */
    var iframeHASH = hashLib.create();

    /**
     * Add a new Client
     * @param clientID
     * @returns {Number}
     */

    function addClient(clientID) {
      clientList.push(clientID);
      iframeHASH.set(clientID, clientList[clientList.length - 1]);
    }

    /**
     * Remove client
     * @param clientID
     */

    function removeClient(clientID) {
      iframeHASH.remove(clientID);
    }

    /**
     * Get Client list
     * @returns {Array}
     */

    function getClientList() {
      return clientList.sort();
    }

    /**
     * Send transmission to client
     * @param clientID
     * @param trans
     */

    function sendTransmission(clientID, trans) {
      document.getElementById(clientID).contentWindow.postMessage(trans, serverConst.DOMAIN_NAME);
    }

    /**
     * Public API
     */
    return {
      const: serverConst,
      addClient: addClient,
      removeClient: removeClient,
      getClientList: getClientList,
      send: sendTransmission
    };
  }
  /**
   * Transmission Library
   * @param createHASHKey
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
     * @param uri
     * @param clientID
     * @param pkg
     * @returns {{id: *, client: *, host: *, urn: *, parameters: *, receipt: *}}
     */

    function createTransmission(transID, uri, clientID, pkg) {
      return {
        id: transID,
        uri: uri,
        client: clientID,
        package: pkg
      };
    }

    /**
     * Create Response - this is for the server to respond back to incoming transmissions from clients,
     * OR when receipts are enabled during a client-to-host-to-client communication - the receiving client will have to "respond" back to
     * their incoming transmission
     * @param transmission
     * @param pkg
     * @returns {{id: *, client: *, host: *, urn: *, parameters: *, receipt: *}}
     */

    function createResponseTransmission(transmission, pkg) {
      return createTransmission(transmission.id, transmission.uri, transmission.client, pkg);
    }

    /**
     * Generate a Request
     * @param uri
     * @param clientID
     * @param pkg
     * @returns {{id: (string|*), host: (XML|string|void|*), urn: (XML|string|void|*), parameters: *, receipt: *}}
     */

    function createNewTransmission(uri, clientID, pkg) {
      return createTransmission(String(createHASHKey(keyPrefix + (keyCounter++))), uri, clientID, pkg);
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
   * API Client Library
   * @param hash
   * @param client
   * @param transmission
   * @param routeConst
   * @param packg
   * @param deferred
   * @returns {{listen: listenToHost, connect: connectToHost, disconnect: disconnectFromHost, getUsername: getUsername, getClients: getClientListFromHost, getRequestLog: getRequestLog, getResponseLog: getResponseLog, sendFiles: sendFilesToClient, sendMessage: sendMessage}}
   */

  function apiClientLibrary(hash, client, transmission, routeConst, packg, deferred) {

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
     * Listen to Host
     * @param event
     */

    function listenToHost(event) {

      /**
       * @type {*}
       */
      var trans = client.listen(event);

      /**
       * Find the Defer object that should be resolved
       */
      var defer = deferHASH.get(trans.id);

      responseList.push(trans);

      /**
       * Handle specific requests that require receipts when transmission is made
       * When a client sends a transmission they have the option to enable "receipts" which the recipient upon receiving a transmission
       * must respond with a response message to the sender.
       * TODO implement receipts for client-to-client messaging
       */
      if (defer) {
        defer.resolve(trans);
      }

      console.log(('%CLIENT% > Received a response from host: %RESPONSE%').replace(/%CLIENT%/g, clientID).replace(/%RESPONSE%/g, event.data.toString()));

      return deferred.when(packg.process(trans.package));

    }

    /**
     * Send a message to Host
     * @param trans
     * @returns {*}
     */

    function sendTransmissionToHost(trans) {

      /**
       * Create a Defer object that should be resolved later on when the listener receives a response
       */
      var defer = deferHASH.set(trans.id, deferred.create());
      requestList.push(trans);
      client.send(trans);
      console.log(('%CLIENT% > Sent a request to host: "%URI%"').replace(/%CLIENT%/g, clientID).replace(/%URI%/g, trans.uri));

      return defer;
    }

    /**
     * Connect to Host
     * @returns {*}
     */

    function connectToHost() {
      return sendTransmissionToHost(transmission.create(routeConst.CONNECT_CLIENT, clientID, null)).then(function (transmission) {
        return transmission.package;
      });
    }

    /**
     * Disconnect from Host
     * @returns {*}
     */

    function disconnectFromHost() {
      return sendTransmissionToHost(transmission.create(routeConst.DISCONNECT_CLIENT, clientID, null)).then(function (transmission) {
        return transmission.package;
      });
    }

    /**
     * Get Clients from Host
     * @returns {*}
     */

    function getClientListFromHost() {
      return sendTransmissionToHost(transmission.create(routeConst.REQUEST_CLIENT_LIST, clientID, null)).then(function (transmission) {
        return transmission.package;
      });
    }

    /**
     * Send text message to client
     * @param recipients
     * @param body
     * @param useReceipt
     * @returns {*}
     */

    function sendMessage(recipients, body, useReceipt) {

      var defers = [];
      for (var n = 0, nLen = recipients.length; n < nLen; n++) {

        var pkg = packg.create({
          type: packg.const.TEXT_MESSAGE_TYPE,
          sender: clientID,
          recipient: recipients[n],
          body: body,
          receipt: useReceipt
        });

        defers.push(sendTransmissionToHost(transmission.create(routeConst.SEND_CLIENT_PACKAGE, clientID, pkg)));

      }

      return defers;
    }

    /**
     * Send files to a client
     * @param recipients
     * @param files
     * @param useReceipt
     * @returns {*}
     */

    function sendFilesToClient(recipients, files, useReceipt) {

      /**
       * @type {Array}
       */
      var defers = [];
      for (var n = 0, nLen = recipients.length; n < nLen; n++) {

        var pkg = packg.create({
          type: packg.const.FILES_TYPE,
          sender: clientID,
          recipient: recipients[n],
          files: files,
          receipt: useReceipt
        });

        defers.push(sendTransmissionToHost(transmission.create(routeConst.SEND_CLIENT_PACKAGE, clientID, pkg)));
      }

      return defers;
    }

    /**
     * Get Username
     * @returns {XML|string|void|*}
     */

    function getUsername() {
      return clientID;
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
     * Public API
     */
    return {
      listen: listenToHost,
      connect: connectToHost,
      disconnect: disconnectFromHost,
      getUsername: getUsername,
      getClients: getClientListFromHost,
      getRequestLog: getRequestLog,
      getResponseLog: getResponseLog,
      sendFiles: sendFilesToClient,
      sendMessage: sendMessage
    };
  }
  /**
   * API Host Library
   * @param router
   * @returns {{listen: listen}}
   * @constructor
   */

  function apiHostLibrary(router) {

    'use strict';

    /**
     * Window listener event handler
     * @param event
     */

    function listen(event) {
      router.process(event.data);

      console.log(("HOST > Processing a request: %URI%").replace(/%URI%/g, event.data.uri));
    }

    /**
     * Public API
     */
    return {
      listen: listen
    };

  }
  /**
   * API Package Library
   * TODO this needs major refactoring
   * @param hash
   * @param packg
   * @param formatBytesToUnits
   * @param deferred
   * @returns {*}
   */

  function apiPackageLibrary(hash, packg, formatBytesToUnits, deferred) {

    'use strict';

    /**
     * Process Client List
     * @param pkg
     * @returns {*}
     */

    function processClientListPackage(pkg) {
      pkg.list = ["ALL"].concat(pkg.list);
      return deferred.when(pkg);
    }

    /**
     * Process Text Message
     * @param pkg
     * @returns {*}
     */

    function processTextMessagePackage(pkg) {
      pkg.body = ('%CLIENT% > %MESSAGE%<hr/>').replace(/%CLIENT%/g, pkg.sender).replace(/%MESSAGE%/g, pkg.body);
      return deferred.when(pkg);
    }

    /**
     * Process Files
     * @param pkg
     * @returns {*}
     */

    function processFilesPackage(pkg) {

      /**
       * @type {string}
       */
      var responseHTML = "";

      /**
       * Defer collection used to track all file status
       * @type {Array}
       */
      var defers = [];

      /**
       * Defer HASH since we aren't using promises to read files, as each file completes reading its respective defer is resolved
       */
      var deferHASH = hash.create();

      /**
       * @type {pkg.files|*}
       */
      var files = pkg.files;

      /**
       * Total files provided
       * @type {number}
       */
      var fileCount = 0;

      /**
       * Handle file transmission with data url
       * @param fileInfo
       */

      function handleFile(fileInfo) {

        /**
         * Current file
         * @type {*|file|Sizzle.file|inputType.file|t.file|Bd.file}
         */
        var file = fileInfo.file;

        /**
         * The generated file URL upon receiving
         */
        var url = fileInfo.url;

        /**
         * Increment the file count as we process more files
         */
        fileCount++;

        /**
         * Image file type
         */
        if (file.type.indexOf('image/') === 0) {
          responseHTML += '<br/>' + fileCount + '. <a href = "' + url + '" target = "new">' + file.name + '</a> (' + formatBytesToUnits(file.size) + ')<br/><a href = "' + url + '" target = "new"><img class = "thumbnail" src = ' + url + '></a><br/>';
        }

        /**
         * Text file type (e.g. HTML / *.txt / *.md)
         */
        else if (file.type.indexOf('text/') === 0) {
          responseHTML += '<br/>' + fileCount + '. <a href = "' + url + '" target = "new">' + file.name + '</a> (' + formatBytesToUnits(file.size) + ')<br/>';
        }

        /**
         * JSON extension file type
         */
        else if (file.type === 'application/json') {
          debugger;
          responseHTML += '<br/>' + fileCount + '. <a href = "' + url + '" target = "new">' + file.name + '</a> (' + formatBytesToUnits(file.size) + ')<br/>';
        }
      }

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
        defers.push(defer);
        defer.then(handleFile);

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
       * Once all the defers are resolved, provide an organized summary of all the files uploaded
       */
      return deferred.all(defers).then(function () {
        return packg.create({
          type: packg.const.TEXT_MESSAGE_TYPE,
          sender: pkg.sender,
          recipient: pkg.recipient,
          body: ('%CLIENT% > Received files...<br />').replace(/%CLIENT%/g, pkg.recipient) + responseHTML + "<hr/>",
          useReceipt: pkg.receipt
        });
      });
    }

    /**
     * Process Package
     * @param pkg
     * @returns {*}
     */

    function processPackage(pkg) {

      /**
       * Process packages based on type
       * @type {{}}
       */
      var packageHandler = {};
      packageHandler[packg.const.CLIENT_LIST_TYPE] = processClientListPackage;
      packageHandler[packg.const.TEXT_MESSAGE_TYPE] = processTextMessagePackage;
      packageHandler[packg.const.FILES_TYPE] = processFilesPackage;

      return deferred.when(packageHandler[pkg.type](pkg));
    }

    /**
     * Append the CORE package library into this API
     */
    var publicAPI = packg;
    publicAPI.process = processPackage;

    /**
     * Public API
     */
    return publicAPI;
  }
  /**
   * API Route Constants
   * @type {{CONNECT_CLIENT: string, DISCONNECT_CLIENT: string, REQUEST_CLIENT_LIST: string, SEND_CLIENT_PACKAGE: string}}
   */
  var apiRouteConstant = {

    /**
     * Client: connect to host
     */
    CONNECT_CLIENT: "HOST: connect client",

    /**
     * Client: disconnect from host
     */
    DISCONNECT_CLIENT: "HOST: disconnect client",

    /**
     * Client: request connected clients list from host
     */
    REQUEST_CLIENT_LIST: "HOST: request client list",

    /**
     * Client: send a message to a client
     */
    SEND_CLIENT_PACKAGE: "HOST: send client package"
  };
  /**
   * API Router Library
   * @param transmission
   * @param server
   * @param packg
   * @param routeConst
   * @param routerExt
   * @returns {{const: *, process: processTransmission}}
   */

  function apiRouterLibrary(transmission, server, packg, routeConst, routerExt) {

    'use strict';

    /**
     * Add a client
     * @param trans
     */

    function addClient(trans) {

      var pkg = packg.create({
        type: packg.const.TEXT_MESSAGE_TYPE,
        sender: server.const.SERVER_NAME,
        recipient: trans.client,
        body: 'Connected to host',
        useReceipt: false
      });

      server.addClient(trans.client);
      server.send(trans.client, transmission.createResponse(trans, pkg));
    }

    /**
     * Remove Client
     * @param trans
     */

    function removeClient(trans) {

      var pkg = packg.create({
        type: packg.const.TEXT_MESSAGE_TYPE,
        sender: server.const.SERVER_NAME,
        recipient: trans.client,
        body: 'Disconnected from host',
        useReceipt: false
      });

      server.removeClient(trans.client);
      server.send(trans.client, transmission.createResponse(trans, pkg));
    }

    /**
     * Create a client list that excludes the client hiimself
     * @param client
     */

    function createClientList(client) {
      var list = server.getClientList();
      var newList = [];
      for (var n = 0, nLen = list.length; n < nLen; n++) {
        if (list[n] === client) {
          continue;
        }
        newList.push(list[n]);
      }

      return newList;
    }

    /**
     * Update client with new client lists
     */

    function updateClientsClientList() {

      var clientList = server.getClientList();
      /**
       * Respond back to the client that made the request
       */
      for (var n = 0, nLen = clientList.length; n < nLen; n++) {
        var sClient = clientList[n];

        var pkg = packg.create({
          type: packg.const.CLIENT_LIST_TYPE,
          list: createClientList(sClient)
        });

        server.send(sClient, transmission.create(routeConst.REQUEST_CLIENT_LIST, sClient, pkg));
      }
    }

    /**
     * Send a client the list of connect clients
     * @param trans
     */

    function getClientList(trans) {

      var pkg = packg.create({
        type: packg.const.CLIENT_LIST_TYPE,
        list: createClientList(trans.client)
      });

      /**
       * Respond back to the client that made the request
       */
      server.send(trans.client, transmission.createResponse(trans, pkg));
    }

    /**
     * Forward a client a package
     * @param trans
     */

    function sendClientPackage(trans) {

      /**
       * Extract the recipient from the parameters
       */
      server.send(trans.package.recipient, transmission.createResponse(trans, trans.package));
    }

    /**
     * Bad route
     * @param trans
     */

    function badRoute(trans) {

      var pkg = packg.create({
        type: packg.const.TEXT_MESSAGE_TYPE,
        sender: server.const.SERVER_NAME,
        recipient: trans.client,
        body: 'you 404\'ed!!',
        useReceipt: false
      });

      server.send(trans.client, transmission.createResponse(trans, pkg));
    }

    /**
     * Process an encoded trans
     * @param trans
     * @returns {*}
     */

    function processTransmission(trans) {

      /**
       * Connect a client
       */
      if (trans.uri === routeConst.CONNECT_CLIENT) {
        addClient(trans);
        updateClientsClientList();
      }

      /**
       * Disconnect a client
       */
      else if (trans.uri === routeConst.DISCONNECT_CLIENT) {
        removeClient(trans);
        updateClientsClientList();
      }

      /**
       * Get client list
       */
      else if (trans.uri === routeConst.REQUEST_CLIENT_LIST) {
        getClientList(trans);
      }

      /**
       * Send a transmission to client
       */
      else if (trans.uri === routeConst.SEND_CLIENT_PACKAGE) {
        sendClientPackage(trans);
      }

      /**
       * Custom server extension routine that needs to be executed
       * TODO we need to test this
       */
      else if (routerExt) {
        //var oResp = routerExt.call(null, routeConst, transmission, transmission, server, trans);
        //server.send(oResp.client, oResp.trans);
      }

      /**
       * Something equivalent to a 404 (lol)
       */
      else {
        badRoute(trans);
      }
    }

    /**
     * Public API
     */
    return {
      const: routeConst,
      process: processTransmission
    };
  }
  /******************************************************************************************************
   * GENERATED SOURCE ENDS HERE
   ******************************************************************************************************/

  /******************************************************************************************************
   * API TEMPLATE FOOTER STARTS HERE
   ******************************************************************************************************/

  /******************************************************************************************************
   * Utility Library components starts here
   ******************************************************************************************************/
  /**
   * Utility Library
   * @type {{formatBytesToUnits: formatBytesToUnits, createFileList: createFileList}}
   */
  var util = utilityLibrary();

  /******************************************************************************************************
   * Core Library components starts here
   ******************************************************************************************************/

  /******************************************************************************************************
   * Core Library components starts here
   ******************************************************************************************************/
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
   * Core Package Constant
   * @type {{}}
   */
  core.packageConst = packageConstant;

  /**
   * Core Package Library
   */
  core.package = packageLibrary(core.packageConst);

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

  /******************************************************************************************************
   * Core Library components ends here
   ******************************************************************************************************/

  /******************************************************************************************************
   * API components starts here
   ******************************************************************************************************/

  /**
   * API constants
   * @type {{}}
   */
  api.const = {};

  /**
   * API Routes
   * @type {{CONNECT_CLIENT: string, DISCONNECT_CLIENT: string, REQUEST_CLIENT_LIST: string, SEND_CLIENT_PACKAGE: string}}
   */
  api.const.route = apiRouteConstant;

  /**
   * Package types
   * TODO could be refactored
   * @type {packConst|*|*}
   */
  api.const.package = core.package.const;

  /**
   * API Host Library
   * TODO need to consider exposing router function such that some people may want to write their own router?
   */
  api.host = function apiHost(routerExtension) {
    var router = apiRouterLibrary(core.transmission, core.server, core.package, api.const.route, routerExtension);
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
     * Define the package library
     * TODO need to refactor this clunkiness
     * @type {*}
     */
    var pkg = apiPackageLibrary(core.hash, core.package, util.formatBytesToUnits, deferred);
    return apiClientLibrary(core.hash, core.client, core.transmission, api.const.route, pkg, deferred);
  };

  /**
   * Utility Library
   */
  api.util = util;

  /******************************************************************************************************
   * API components ends here
   ******************************************************************************************************/

  /******************************************************************************************************
   * Public API
   ******************************************************************************************************/
  return api;

})(window);

/******************************************************************************************************
 * API TEMPLATE FOOTER ENDS HERE
 ******************************************************************************************************/