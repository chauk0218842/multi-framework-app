/**
 * JQuery Component
 */
'use strict';

$("document").ready(function () {

  var _fnCreateDefer = fnDeferCreate_JQuery($);
  var _DeferHASH = DeferHASH(_fnCreateDefer);
  var _PMLibrary = PMCLibrary(PMConstants, PMError, PMData);
  var _PMClient = PMClient(_PMLibrary, _DeferHASH);

  window.addEventListener("message", function (__oEvent) {

    /**
     * Listen for messages
     */
    _PMClient.receive(__oEvent);

    /**
     * Update response
     */
    var ___oMessages = _PMClient.getMessages();
    var ___o$Response = $("#response");
    ___o$Response.val((___oMessages.length ? ___oMessages [___oMessages.length - 1] + "\n--\n" : "") + ___o$Response.val());

  });

  window.addEventListener("unload", function () {
    window.removeEventListener("message");
  });

  _PMClient.connect();

  $("#clientName").text(_PMClient.getClientName());

  $("#response").val();

  _PMClient.getContacts().then(function (_oContacts) {

    $("#contacts").empty();
    for (var n in _oContacts) {
      $("#contacts").append("<option value = \"" + _oContacts [n] + "\">" + _oContacts [n] + "</option>");
    }

    $("#contacts").index(0);
  });

  $("#refresh").bind("click", function () {

    _PMClient.getContacts().then(function (_oContacts) {

      $("#contacts").empty();
      for (var n in _oContacts) {
        $("#contacts").append("<option value = \"" + _oContacts [n] + "\">" + _oContacts [n] + "</option>");
      }
    });

  });

  $("#send").bind("click", function () {
    _PMClient.send($("#contacts").val(), $("#message").val());
  });

});
