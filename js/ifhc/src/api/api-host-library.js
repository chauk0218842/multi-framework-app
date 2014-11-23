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