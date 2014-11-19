'use strict';

/**
 * Deferred Library for Angular
 * @param _$q
 * @returns {{create: createDefer, when: createWhen}}
 */
function deferredLibrary (_$q) {

  /**
   * Create a Defer object
   * @returns {{reject: Deferred.reject, resolve: Deferred.resolve, promise: (*|deferredLibrary.createDefer.promise|jQuery.promise|promise.promise|Deferred._fnGenerateDefer.promise|fnDeferCreate_JQuery.promise), then: then}}
   */
  function createDefer () {
    var defer = _$q.defer ();

    function then (func) {
      return defer.promise.then (func);
    }

    return {
      reject: defer.reject,
      resolve: defer.resolve,
      promise: defer.promise,
      then: then
    };
  }

  /**
   * Create a Defer when
   * @param object
   * @returns {*|Promise}
   */
  function createWhen (object) {
    return _$q.when (object);
  }

  /**
   * Public API
   */
  return {
    create : createDefer,
    when : createWhen
  };
}