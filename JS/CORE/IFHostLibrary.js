'use strict';

/**
 * IFrame Host Library
 * @param _Router
 * @returns {{listen: _fnListen}}
 * @constructor
 */
function IFHostLibrary (_Router) {

  /**
   * Window listener event handler
   * @param __oWindowEvent
   * @private
   */
  function _fnListen (__oWindowEvent) {
    _Router.process (__oWindowEvent.data);

    console.log (("HOST > Processing a request:\n%REQUEST%\n").replace (/%REQUEST%/g, __oWindowEvent.data));
  }

  return {
    listen : _fnListen
  };

}