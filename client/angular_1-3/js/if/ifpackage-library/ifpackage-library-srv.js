/**
 * Package Library factory
 */
angular.module ('ifpackageLibrary')
  .factory ('ifpackLib', function (ifclientLib, hashLib, deferredLib, packLib, utilLib) {
    return ifpackageLibrary (ifclientLib, hashLib, deferredLib, packLib, utilLib.formatBytesToUnits);
});
