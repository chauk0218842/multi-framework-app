/**
 * JQuery Component
 */
'use strict';

function fnDeferCreate_JQuery (_$) {

  return function fnDeferCreate() {
    var __oDefer = _$.Deferred();
    return {
      reject: __oDefer.reject,
      resolve: __oDefer.resolve,
      promise: __oDefer.promise,
      then: __oDefer.then
    }
  }
}