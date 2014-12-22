(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define(["underscore","backbone"], function(_, Backbone) {
      // Use global variables if the locals are undefined.
      return factory(_ || root._, Backbone || root.Backbone);
    });
  }
  else if (typeof exports === 'object') {
    // Commonjs module
    module.exports = factory(require("underscore"), require("backbone"));
  } 
  else {
    // RequireJS isn't being used. Assume underscore and backbone are loaded in <script> tags
    factory(_, Backbone);
  }
}(this, function(_, Backbone) {

  var BaseView = Backbone.View.extend({

    // Taken from Marionette.View
    // https://github.com/marionettejs/backbone.marionette/blob/master/src/view.js#L184
    bindUIElements: function () {
      if (!this.ui) { return; }

      // store the ui hash in _uiBindings so they can be reset later
      // and so re-rendering the view will be able to find the bindings
      if (!this._uiBindings) {
        this._uiBindings = this.ui;
      }

      // get the bindings result, as a function or otherwise
      var bindings = _.result(this, '_uiBindings');

      // empty the ui so we don't have anything to start with
      this.ui = {};

      // bind each of the selectors
      _.each(_.keys(bindings), function(key) {
        var selector = bindings[key];
        this.ui[key] = this.el.querySelector(selector);
      }, this);
    },

    unbindUIElements: function () {
      if (!this.ui || !this._uiBindings) { return; }

      // delete all of the existing ui bindings
      _.each(this.ui, function($el, name) {
        delete this.ui[name];
      }, this);

      // reset the ui element to the original bindings configuration
      this.ui = this._uiBindings;
      delete this._uiBindings;
    },

    render: function () {
      // Render the template with the model data
      var ctx = this.model ? this.model.toJSON() : {};
      this.el.innerHTML = this.template(ctx);
      
      // Set this.el to the first element in rendered template
      this.setElement(this.el.innerHTML);

      // Bind UI Elements for easy retrieval
      this.bindUIElements();

      // Return this for chaining function calls
      return this;
    },

    close: function () {
      this.unbindUIElements();
      this.remove();
      this.unbind();
    }

  });

  Backbone.BaseView = BaseView;
  return Backbone.BaseView;
}));