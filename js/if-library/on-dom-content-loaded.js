/**
 * Document On load
 */
function onDOMContentLoaded () {

  'use strict';

  /**
   * HASH Library
   * @type {{create: createHASHBucket, createKey: createHASHKey}}
   */
  var hashLib = hashLibrary(window.atob);

  /**
   * Server Library
   * @type {{const: *, addClient: addClient, removeClient: removeClient, getClientList: getClientList, processMessage: processMessage}}
   */
  var serverLib = serverLibrary(serverConstants, hashLib);

  /**
   * Transmission Library
   * @type {{create: createNewTransmission}}
   */
  var transLib = transmissionLibrary(hashLib.createKey);

  /**
   * Package Constants
   * @type {{}}
   */
  var packConst = packageConstants;

  /**
   * Package Library
   * @type {{const: (packConst|*), create: createNewPackage}}
   */
  var packLib = packageLibrary (packConst);

  /**
   * IFURI Constants
   * @type {{CONNECT_CLIENT: string, DISCONNECT_CLIENT: string, REQUEST_CLIENT_LIST: string, SEND_CLIENT_PACKAGE: string}}
   */
  var ifuriConst = ifuriConstants;

  /**
   * IFRouter Library
   * @type {{process: processMessage}}
   */
  var ifrouterLib = ifrouterLibrary(ifuriConst, transLib, packLib, serverLib, null);

  /**
   * IFHost library
   */
  window.addEventListener("message", ifhostLibrary(ifrouterLib).listen, false);

}
