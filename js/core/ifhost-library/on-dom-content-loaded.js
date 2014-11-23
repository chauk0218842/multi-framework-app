/**
 * Document On load
 */
function onDOMContentLoaded () {

  'use strict';

  /**
   * IFHost library
   */
  window.addEventListener("message", ifhc.host(null).listen, false);

}
