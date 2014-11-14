function DeferHASH (_fnDeferCreate) {

  var _oHASH = {};

  return {
    get : function (__sKey) {
      return _oHASH [__sKey];
    },

    set : function (__sKey) {
      _oHASH [__sKey] = _fnDeferCreate ();
      return _oHASH [__sKey];
    },

    remove : function (__sKey) {
      _oHASH [__sKey] = null;
    }
  };

}