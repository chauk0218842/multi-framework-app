/**
 * API Package Library
 * TODO this needs major refactoring
 * @param hash
 * @param packg
 * @param formatBytesToUnits
 * @param deferred
 * @returns {*}
 */
function apiPackageLibrary(hash, packg, formatBytesToUnits, deferred) {

  'use strict';

  /**
   * Process Client List
   * @param pkg
   * @returns {*}
   */
  function processClientListPackage(pkg) {
    pkg.list = ["ALL"].concat (pkg.list);
    return deferred.when (pkg);
  }

  /**
   * Process Text Message
   * @param pkg
   * @returns {*}
   */
  function processTextMessagePackage(pkg) {
    pkg.body = ('%CLIENT% > %MESSAGE%<hr/>').replace(/%CLIENT%/g, pkg.sender).replace(/%MESSAGE%/g, pkg.body);
    return deferred.when (pkg);
  }

  /**
   * Process Files
   * @param pkg
   * @returns {*}
   */
  function processFilesPackage(pkg) {

    /**
     * @type {string}
     */
    var responseHTML = "";

    /**
     * Defer collection used to track all file status
     * @type {Array}
     */
    var defers = [];

    /**
     * Defer HASH since we aren't using promises to read files, as each file completes reading its respective defer is resolved
     */
    var deferHASH = hash.create();

    /**
     * @type {pkg.files|*}
     */
    var files = pkg.files;

    /**
     * Total files provided
     * @type {number}
     */
    var fileCount = 0;

    /**
     * Handle file transmission with data url
     * @param fileInfo
     */
    function handleFile(fileInfo) {

      /**
       * Current file
       * @type {*|file|Sizzle.file|inputType.file|t.file|Bd.file}
       */
      var file = fileInfo.file;

      /**
       * The generated file URL upon receiving
       */
      var url = fileInfo.url;

      /**
       * Increment the file count as we process more files
       */
      fileCount++;

      /**
       * Image file type
       */
      if (file.type.indexOf('image/') === 0) {
        responseHTML += '<br/>' + fileCount + '. <a href = "' + url + '" target = "new">' + file.name + '</a> (' + formatBytesToUnits(file.size) + ')<br/><a href = "' + url + '" target = "new"><img class = "thumbnail" src = ' + url + '></a><br/>';
      }

      /**
       * Text file type (e.g. HTML / *.txt / *.md)
       */
      else if (file.type.indexOf('text/') === 0) {
        responseHTML += '<br/>' + fileCount + '. <a href = "' + url + '" target = "new">' + file.name + '</a> (' + formatBytesToUnits(file.size) + ')<br/>';
      }

      /**
       * JSON extension file type
       */
      else if (file.type === 'application/json') {
        debugger;
        responseHTML += '<br/>' + fileCount + '. <a href = "' + url + '" target = "new">' + file.name + '</a> (' + formatBytesToUnits(file.size) + ')<br/>';
      }
    }

    /**
     * Process each file that's been uploaded
     */
    for (var n = 0, nLen = files.length; n < nLen; n++) {

      /**
       * @type {FileReader}
       */
      var fileReader = new FileReader();

      /**
       * Create a defer and store it into a HASH for later resolving
       */
      var defer = deferHASH.set(n, deferred.create());
      defers.push(defer);
      defer.then(handleFile);

      /**
       * When a file is completed processing, the respectivce defer needs to be resolved
       */
      fileReader.onloadend = (function (deferKey, file) {
        return function (event) {
          if (event.target.readyState == FileReader.DONE) {
            deferHASH.get(deferKey).resolve({file: file, url: event.target.result});
          }
        };
      })(n, files[n]);

      fileReader.readAsDataURL(files[n]);

    }

    /**
     * Once all the defers are resolved, provide an organized summary of all the files uploaded
     */
    return deferred.all(defers).then(function () {
      return packg.create({
        type: packg.const.TEXT_MESSAGE_TYPE,
        sender: pkg.sender,
        recipient: pkg.recipient,
        body: ('%CLIENT% > Received files...<br />').replace(/%CLIENT%/g, pkg.recipient) + responseHTML + "<hr/>",
        useReceipt: pkg.receipt
      });
    });
  }

  /**
   * Process Package
   * @param pkg
   * @returns {*}
   */
  function processPackage(pkg) {

    /**
     * Process packages based on type
     * @type {{}}
     */
    var packageHandler = {};
    packageHandler [packg.const.CLIENT_LIST_TYPE] = processClientListPackage;
    packageHandler [packg.const.TEXT_MESSAGE_TYPE] = processTextMessagePackage;
    packageHandler [packg.const.FILES_TYPE] = processFilesPackage;

    return deferred.when (packageHandler [pkg.type] (pkg));
  }

  /**
   * Append the CORE package library into this API
   */
  var publicAPI = packg;
  publicAPI.process = processPackage;

  /**
   * Public API
   */
  return publicAPI;
}