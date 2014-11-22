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
   * Package Library
   * @type {{const: (packConst|*), create: createNewPackage}}
   */
  var packLib = packageLibrary (packageConstants);

  /**
   * IFRouter Library
   * @type {{process: processMessage}}
   */
  var ifrouterLib = ifrouterLibrary(ifuriConstants, transLib, packLib, serverLib, null);

  /**
   * IFHost library
   */
  window.addEventListener("message", ifhostLibrary(ifrouterLib).listen, false);

}
