'use strict';

/**
 * IFrame Host Library
 * @param routerLib
 * @returns {{listen: listen}}
 * @constructor
 */
function ifhostLibrary (routerLib) {

  /**
   * Window listener event handler
   * @param event
   */
  function listen (event) {
    routerLib.process (event.data);

    console.log (("HOST > Processing a request: %URI%").replace (/%URI%/g, event.data.uri));
  }

  /**
   * Public API
   */
  return {
    listen : listen
  };

}