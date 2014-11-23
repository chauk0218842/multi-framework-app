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