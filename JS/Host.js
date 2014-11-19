'use strict';

document.addEventListener("DOMContentLoaded", function () {

  var hashLib = hashLibrary(window.atob);
  var serverLib = serverLibrary(serverConstants, hashLib);
  var messageLib = messageLibrary(window.atob, JSON.stringify, JSON.parse);
  var requestLib = requestLibrary(window.atob, JSON.stringify, JSON.parse);
  var uriConst = ifuriConstants;
  var routerLib = ifrouterLibrary(uriConst, requestLib, messageLib, serverLib, null);
  var hostLib = ifhostLibrary(routerLib);

  window.addEventListener("message", hostLib.listen, false);
});
