'use strict';

/**
 * Deferred generate for JQuery
 * @param _$
 * @returns {{generate: _fnGenerateDeferred, when: (*|DeferredLibrary.when|jQuery.when|Function|$Q.when|when)}}
 * @constructor
 */
function DeferredLibrary(_$) {

  /**
   * Deferred generator
   * @returns {{reject: (*|fnDeferCreate_JQuery.reject|Deferred.fnGenerateDefer.reject|DeferredLibrary._fnGenerateDeferred.reject|jQuery.Deferred.reject|Deferred.reject), resolve: (*|fnDeferCreate_JQuery.resolve|Deferred.fnGenerateDefer.resolve|DeferredLibrary._fnGenerateDeferred.resolve|jQuery.Deferred.resolve|Deferred.resolve), promise: (*|fnDeferCreate_JQuery.promise|Deferred.fnGenerateDefer.promise|DeferredLibrary._fnGenerateDeferred.promise|jQuery.promise|promise.promise), then: (*|fnDeferCreate_JQuery.then|Deferred.fnGenerateDefer.then|DeferredLibrary._fnGenerateDeferred.then|promise.then|Promise.then)}}
   * @private
   */
  function _fnGenerateDeferred() {
    var __oDefer = _$.Deferred();

    return {
      reject: __oDefer.reject,
      resolve: __oDefer.resolve,
      promise: __oDefer.promise,
      then: __oDefer.then
    };
  }

  /**
   * Public API
   */
  return {
    generate: _fnGenerateDeferred,
    when: _$.when
  };

}