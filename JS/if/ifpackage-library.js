/**
 * IF Package Library
 * @param ifclientLib
 * @param hashLib
 * @param deferredLib
 * @param packLib
 * @param formatBytesToUnits
 * @returns {*}
 */
function ifpackageLibrary(ifclientLib, hashLib, deferredLib, packLib, formatBytesToUnits) {

  'use strict';

  /**
   * Process Client List
   * @param pkg
   * @returns {*}
   */
  function processClientListPackage(pkg) {

    var list = pkg.list.sort();
    var contacts = ['ALL'];
    for (var n = 0, nLen = list.length; n < nLen; n++) {
      if (list [n] === ifclientLib.getUsername()) {
        continue;
      }
      contacts.push(list [n]);
    }

    return deferredLib.when(contacts);
  }

  /**
   * Process Text Message
   * @param pkg
   * @returns {*}
   */
  function processTextMessagePackage(pkg) {
    return deferredLib.when(('%CLIENT% > %MESSAGE%<hr/>').replace(/%CLIENT%/g, pkg.recipient).replace(/%MESSAGE%/g, pkg.body));
  }

  /**
   * Process Files
   * @param pkg
   * @returns {*}
   */
  function processFilesPackage(pkg) {

    var responseHTML = "";
    var defers = [];
    var deferHASH = hashLib.create();
    var files = pkg.files;
    var fileCount = 0;

    /**
     * Handle file transmission
     * @param fileInfo
     */
    function handleFile(fileInfo) {

      var file = fileInfo.file;
      var url = fileInfo.url;

      fileCount++;

      if (file.type.indexOf('image/') === 0) {
        responseHTML += '<br/>' + fileCount + '. <a href = "' + url + '" target = "new">' + file.name + '</a> (' + formatBytesToUnits(file.size) + ')<br/><a href = "' + url + '" target = "new"><img class = "thumbnail" src = ' + url + '></a><br/>';
      }
      else if (file.type.indexOf('text/') === 0) {
        responseHTML += '<br/>' + fileCount + '. <a href = "' + url + '" target = "new">' + file.name + '</a> (' + formatBytesToUnits(file.size) + ')<br/>';
      }
    }

    for (var n = 0, nLen = files.length; n < nLen; n++) {

      var fileReader = new FileReader();
      var defer = deferHASH.set(n, deferredLib.create());
      defers.push(defer);
      defer.then(handleFile);

      fileReader.onloadend = (function (deferKey, file) {
        return function (event) {
          if (event.target.readyState == FileReader.DONE) {
            deferHASH.get(deferKey).resolve({file: file, url: event.target.result});
          }
        };
      })(n, files[n]);

      fileReader.readAsDataURL(files[n]);

    }

    return deferredLib.all(defers).then(function () {
      return ('%CLIENT% > Received files...<br />').replace(/%CLIENT%/g, pkg.recipient) + responseHTML + "<hr/>";
    });
  }

  /**
   * Process Package
   * @param pkg
   * @returns {*}
   */
  function processPackage(pkg) {

    var defer;
    if (pkg.type === packLib.const.CLIENT_LIST_TYPE) {
      defer = processClientListPackage(pkg);
    }
    else if (pkg.type === packLib.const.TEXT_MESSAGE_TYPE) {
      defer = processTextMessagePackage(pkg);
    }
    else if (pkg.type === packLib.const.FILE_TYPE) {
      defer = processFilesPackage(pkg);
    }

    return deferredLib.when(defer);
  }

  var publicAPI = packLib;
  publicAPI.process = processPackage;

  /**
   * Public API
   */
  return publicAPI;
}