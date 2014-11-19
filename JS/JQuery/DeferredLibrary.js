'use strict';

/**
 * Deferred Library for JQuery
 * @param _$
 * @returns {{create: createDefer, when: createWhen}}
 */
function deferredLibrary(_$) {

  /**
   * Create Defer object
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
   * Create a Defer when
   * @param object
   * @returns {*|Promise}
   */
  function createWhen (object) {
    return _$.when (object);
  }

  /**
   * Public API
   */
  return {
    create: createDefer,
    when: createWhen
  };

}