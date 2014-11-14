/**
 * Angular Component
 */
'use strict';

function fnDeferCreate_Angular (_$q) {

  return function fnDeferCreate() {
    var __oDefer = _$q.defer ();
    return {
      reject: __oDefer.reject,
      resolve: __oDefer.resolve,
      promise: __oDefer.promise,
      then: function (__fn) {
          return __oDefer.promise.then (__fn);
      }
    }
  }
}