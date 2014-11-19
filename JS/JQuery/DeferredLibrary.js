'use strict';

/**
 * Deferred generate for JQuery
 * @param _$
 * @returns {{generate: createDefer, when: (*|deferredLibrary.when|jQuery.when|Function|$Q.when|when)}}
 * @constructor
 */
function deferredLibrary(_$) {

  /**
   * Create a Defer object
   * @returns {{reject: (*|deferredLibrary.createDefer.reject|jQuery.Deferred.reject|Deferred.reject|Function|$Q.reject), resolve: (*|deferredLibrary.createDefer.resolve|jQuery.Deferred.resolve|Deferred.resolve|fnDeferCreate_JQuery.resolve|Deferred.fnGenerateDefer.resolve), promise: (*|deferredLibrary.createDefer.promise|jQuery.promise|promise.promise|Deferred._fnGenerateDefer.promise|fnDeferCreate_JQuery.promise), then: (*|deferredLibrary.createDefer.then|promise.then|Promise.then|then|fnDeferCreate_JQuery.then)}}
   */
  function createDefer() {
    var defer = _$.Deferred();

    return {
      reject: defer.reject,
      resolve: defer.resolve,
      promise: defer.promise,
      then: defer.then
    };
  }

  /**
   * Public API
   */
  return {
    create: createDefer,
    when: _$.when
  };

}