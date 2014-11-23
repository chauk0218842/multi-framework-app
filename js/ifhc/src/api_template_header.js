/******************************************************************************************************
 * API TEMPLATE HEADER STARTS HERE
 ******************************************************************************************************/
base64Encoder = typeof (base64Encoder) === 'undefined' ? window.btoa : base64Encoder;

/**
 * ifhc Library
 * TODO - write a task script for this (this is just a mock layout
 */
var ifhc = (function (window) {

  'use strict';

  /**
   * TODO need to write base64 encoder for browsers < IE 10
   */
  if (typeof(window.btoa) === 'undefined') {
    console.error('cannot instantiate ifhc: base64 encoder not available');
    return;
  }

  /**
   * The public API object to be hoisted to the global scope / window
   * @type {null}
   */
  var api = null;

  /**
   * Check if global scoped API is defined
   */
  if (typeof (ifhc) !== 'undefined') {
    api = ifhc;
  }

  /**
   * Otherwise assign window scoped API
   */
  else if (typeof (window.ifhc) !== 'undefined') {
    api = window.ifhc;
  }

  /**
   * No brainer, define a new object if all fails :-)
   */
  api = api || {};

  /**
   * Version (DUH)
   * @type {string}
   */
  api.version = "1.0.1";

  /**
   * Either
   */
  ifhc = window.ifhc = api;

  /**
   * Base64 encoder that is used in the API
   * @type {Function}
   */
  var base64Encoder = window.btoa;

/******************************************************************************************************
 * API TEMPLATE HEADER ENDS HERE
 ******************************************************************************************************/

/******************************************************************************************************
 * GENERATED SOURCE STARTS HERE
 ******************************************************************************************************/