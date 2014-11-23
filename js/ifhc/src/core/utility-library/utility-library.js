/**
 * Utility Library
 * @returns {{formatBytesToUnits: formatBytesToUnits, createFileList: createFileList}}
 */
function utilityLibrary() {

  'use strict';

  /**
   * Format bytes to appropriate units
   * @param bytes
   * @returns {*}
   */
  function formatBytesToUnits(bytes) {

    if (bytes >= 1000000000) {
      bytes = (bytes / 1000000000).toFixed(2) + ' GB';
    }
    else if (bytes >= 1000000) {
      bytes = (bytes / 1000000).toFixed(2) + ' MB';
    }
    else if (bytes >= 1000) {
      bytes = (bytes / 1000).toFixed(2) + ' KB';
    }
    else if (bytes > 1) {
      bytes = bytes + ' bytes';
    }
    else if (bytes == 1) {
      bytes = bytes + ' byte';
    }
    else {
      bytes = '0 byte';
    }
    return bytes;
  }

  /**
   * Create a file list
   * @param files
   * @returns {string}
   */
  function createFileList(files) {

    var fileList = "";

    for (var n = 0, file; file = files[n]; n++) {
      fileList += (n + 1) + '. ' + file.name + ' (' + formatBytesToUnits(file.size) + ')\n';
    }

    return fileList;
  }

  /**
   * Public API
   */
  return {
    formatBytesToUnits: formatBytesToUnits,
    createFileList: createFileList
  };
}