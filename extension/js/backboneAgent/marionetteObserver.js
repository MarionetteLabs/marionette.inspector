window._ = this._;

var AppObserver = function() {
};

_.extend(AppObserver.prototype, {

  _: window._,

  // expression that's eval'd on the window to get the app
  appExpression: "app",

  // expresion that's eval'd on the window to get the radio
  radioExpression: "app.wreqr",

  // called by inspector to get the current region tree
  regionTree: function(path) {//
    path = path || '';
    return regionInspector(this.getApp(), path, true);
  },

  getView: function(path) {
    var subTree = regionInspector(this.getApp(), path);

    if (!subTree._view) {
      throw new Error('could not find view');
    }

    return subTree._view;
  },

  // called by the inspector to get the current channel list
  getChannelList: function() {},

  getApp: function() {
    var app = window.eval(this.appExpression);
    return app;
  },

  isAppLoaded: function() {
    return !_.isUndefined(this.getApp());
  }

});

this.appObserver = new AppObserver();

var regionInspector = function(app, path, shouldSerialize) {
  shouldSerialize = !!shouldSerialize;

  var regions = _regionInspector(app, shouldSerialize)

  if (!!path) {
    regions = objectPath(regions, path, {});
  }

  console.log('ri: ', regions);
  return regions;
};

var _regionInspector = function (obj, shouldSerialize) {


  if (!obj) {
    return {};
  }

  if (obj._regionManager) { // app
    var subViews = _subViews(obj, shouldSerialize);
    return subViews;

  } else if (obj.regionManager) { // layout
    var subViews = _subViews(obj, shouldSerialize);
    subViews._view =  shouldSerialize ? viewSerializer(obj) :  obj;
    return subViews;

  } else if (obj.children) { // collection view
    return _.map(obj.children._views, _.partial(_regionInspector, _, shouldSerialize));

  } else { // simple view
    return {
      _view: shouldSerialize ? viewSerializer(obj) :  obj
    }
  }
};

var _subViews = function(obj, shouldSerialize) {
  var subViews = {};
  var regions = (obj._regionManager || obj.regionManager)._regions;
  _.each(regions, function(region, regionName) {
    var subRegions = _regionInspector(region.currentView, shouldSerialize);
    subRegions._region = 'region' //region;
    subViews[regionName] = subRegions;
  });
  return subViews;
};

var objectPath = function (obj, path, defaultValue) {
  if (typeof path == "string") path = path.split(".");
  if (obj === undefined) return defaultValue;
  if (path.length === 0) return obj;
  if (obj === null) return defaultValue;


  return objectPath(obj[_.first(path)], _.rest(path), defaultValue);
};


var viewSerializer = function(view) {
  var data = {};

  if (!_.isObject(view)) {
    return {};
  }

  data.cid = view.cid;

  data.options = _.map(view.options || {}, function(optValue, optName) {

    var optType;
    if (_.isString(optValue)) {
      optType = "string";
    } else if (_.isNumber(optValue)) {
      optType = "number";
    } else if (_.isFunction(optValue)) {
       optType = "function"
    } else if (_.isObject(optValue)) {
      optType = "object";
    } else if (_.isUndefined(optValue)) {
      optType = "undefined";
    }

    var val = "";
    if (optValue == "string" || optValue == "number") {
      val = optValue;
    }

    return {
      option: optName,
      optType: optType,
      optValue: val
    }

  }, this);

  data.element = serializeElement(view.el, true);

  data.model = {
    attributes: JSON.stringify({})
  };

  data.events = _.map(view.events, function(callback, eventName) {
    return {
      eventName: eventName,
      functionSrc: callback.toString(),
      isNativeFunction: callback.toString().match(/native code/),
      isFunction: _.isFunction(callback),
      eventHandler: !_.isFunction(callback) ? callback : ''
    }
  });


  data.ui = _.map(view.ui, function(element, uiName) {
    return {
      ui: uiName,
      element: serializeElement(element)
    }
  });

  if (_.isObject(view.model)) {
      data.model = {
        cid: view.model.cid,
        attributes: JSON.stringify(view.model.attributes),
      }
  }

  console.log('serialize', data);
  return data;
}

var serializeElement = function (element, recurse) {
    var $el = $(element);

    var obj = {};

    if (_.isUndefined($el[0])) {
      return {};
    }

    obj.tagName = $el[0].tagName;

    obj.attributes = _.map($el[0].attributes, function(v,i) {
      return {
        name: v.name,
        value: v.value
      }
    });

    if (recurse) {
        obj.children = _.map($el.children(), function(child){
            return serializeElement(child, true);
        }, this);
    }

    return  obj;
}
