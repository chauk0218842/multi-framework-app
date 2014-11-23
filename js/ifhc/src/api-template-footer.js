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

  if (typeof (deferred) === 'undefined') {
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

}) (window);