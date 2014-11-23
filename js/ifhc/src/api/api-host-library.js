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
  function receiveTransmissionFromClient (event) {
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