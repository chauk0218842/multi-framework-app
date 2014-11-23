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

  if (typeof (deferred) === 'undefined') {
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

}) (window);

/******************************************************************************************************
 * API TEMPLATE FOOTER ENDS HERE
 ******************************************************************************************************/