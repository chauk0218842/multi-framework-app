/**
 * Deferred Library Wrapper for Angular
 * Since a lot of libraries implement 'promises' differently we need to create a wrapper interface to have a common ground between different JS frameworks
 * @param _$q
 * @returns {{create: createDefer, when: createWhen, all: createAll}}
 */
function deferredLibrary (_$q) {
  'use strict';

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
   * Create a Defer all
   * @param object
   * @returns {*|Promise}
   */
  function createAll (object) {
    return _$q.all (object);
  }

  /**
   * Public API
   */
  return {
    create : createDefer,
    when : createWhen,
    all : createAll
  };
}