'use strict';

/**
 * Deferred generate for Angular
 * @param _$q
 * @returns {{generate: _fnGenerateDeferred, when: (*|jQuery.when|Function|$Q.when|DeferredLibrary.when|when)}}
 * @constructor
 */
function DeferredLibrary (_$q) {

  /**
   * Deferred wrapper
   * @returns {{reject: Deferred.reject, resolve: Deferred.resolve, promise: (*|Deferred._fnGenerateDefer.promise|fnDeferCreate_JQuery.promise|Deferred.fnGenerateDefer.promise|jQuery.promise|promise.promise), then: _fnThen}}
   * @private
   */
  function _fnGenerateDeferred () {
    var __oDefer = _$q.defer ();

    function _fnThen (__fnFunc) {
      return __oDefer.promise.then (__fnFunc);
    }

    return {
      reject: __oDefer.reject,
      resolve: __oDefer.resolve,
      promise: __oDefer.promise,
      then: _fnThen
    };
  }

  /**
   * Public API
   */
  return {
    generate : _fnGenerateDeferred,
    when : _$q.when
  };

};