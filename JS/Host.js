'use strict';

document.addEventListener("DOMContentLoaded", function (_oEvent) {

  var _HASHLibrary = HASHLibrary(window.atob);
  var _ServerConst = ServerConstants;
  var _Server = ServerLibrary(_ServerConst, _HASHLibrary);
  var _Message = MessageLibrary(window.atob, JSON.stringify, JSON.parse);
  var _Request = RequestLibrary(window.atob, JSON.stringify, JSON.parse);
  var _URIConst = IFURIConstants;
  var _Router = IFRouterLibrary(_URIConst, _Request, _Message, _Server, null);
  var _Host = IFHostLibrary(_Router);

  window.addEventListener("message", _Host.listen, false);
});
