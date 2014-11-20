'use strict';

/**
 * On DOM Content Loaded Event listener
 */

function onDOMContentLoaded () {
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
   * Message Library
   * @type {{create: createNewMessage}}
   */
  var messageLib = messageLibrary(hashLib.createKey);

  /**
   * IFRouter Library
   * @type {{process: processMessage}}
   */
  var ifrouterLib = ifrouterLibrary(ifuriConstants, messageLib, serverLib, null);

  /**
   * IFHost library
   */
  window.addEventListener("message", ifhostLibrary(ifrouterLib).listen, false);

}

document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
document.addEventListener("unload", onDOMContentLoaded);
