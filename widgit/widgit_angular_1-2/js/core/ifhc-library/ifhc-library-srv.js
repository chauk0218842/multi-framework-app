angular.module('ifhc')

  /**
   * ifhc factory
   */
  .factory('ifhc', function () {
    'use strict';
    return ifhc;
  })

  /**
   * ifhcClient factory
   */
  .factory ('ifhcClient', function ($q, ifhc, deferred) {
    'use strict';
    return ifhc.client (deferred);
  });