(function() {
  var Aui, AuiMixin, AuiOptions, React, cache, jQuery, ref1, ref2, ref3, ref4, ref5, ref6, ref7,
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref1 = window || global, React = ref1.React, jQuery = ref1.jQuery;

  if (React == null) {
    throw new Error("Aui: window.React not found.");
  }

  if (jQuery == null) {
    console.warn("Aui: window.jQuery not found, Modules and Semantic-UI will be disabled.");
  }

  if ((jQuery != null ? (ref2 = jQuery.site) != null ? (ref3 = ref2.settings) != null ? ref3.modules : void 0 : void 0 : void 0) == null) {
    console.warn('Aui: No Semantic-UI window.jQuery.site.settings.modules found, Semantic will be disabled.');
  }

  AuiMixin = {
    $: function(ref) {
      return jQuery(React.findDOMNode(this.refs[ref] || ref));
    },
    componentWillMount: function() {
      var render;
      render = this.render;
      return this.render = function() {
        var element;
        element = render != null ? typeof render.apply === "function" ? render.apply(this, arguments) : void 0 : void 0;
        if (React.isValidElement(element)) {
          return Aui.classify(element);
        } else {
          return Aui.classify(Aui.warning('Aui.Mixin: Child is not a React.isValidElement', element));
        }
      };
    }
  };

  Aui = React.createClass({
    mixins: [AuiMixin],
    render: function() {
      return Aui.warning('<Aui/> tag is depricated, use Aui.Mixin instead', this.props.children);
    },
    componentDidMount: function() {
      return console.warn(React.findDOMNode(this));
    }
  });

  Aui.Mixin = Aui.AuiMixin = AuiMixin;

  Aui.Aui = Aui;

  Aui.$ = jQuery;

  Aui.warning = function(message, element) {
    console.warn(message, element);
    return React.DOM.span({
      'data-warning': message
    }, element);
  };

  Aui.settings = {
    disableModules: jQuery == null,
    disableSemantic: (jQuery != null ? (ref4 = jQuery.site) != null ? (ref5 = ref4.settings) != null ? ref5.modules : void 0 : void 0 : void 0) == null,
    ignoreChildren: false
  };

  AuiOptions = (function() {
    function AuiOptions(options) {
      var key, ref6, value;
      if (options instanceof AuiOptions) {
        return options;
      }
      if (!(this instanceof AuiOptions)) {
        return new AuiOptions(options);
      }
      options || (options = {});
      ref6 = Aui.settings;
      for (key in ref6) {
        if (!hasProp.call(ref6, key)) continue;
        value = ref6[key];
        this[key] = options[key] != null ? options[key] : value;
      }
    }

    return AuiOptions;

  })();

  Aui.classify = function(element, options) {
    var classify;
    options = AuiOptions(options);
    if (!React.isValidElement(element)) {
      element = Aui.warning('Aui.classify: element is not a React.isValidElement', element);
    }
    classify = function(element) {
      var className, classNames, i, key, len, modules, props, ref6, ref7, value;
      if (!React.isValidElement(element)) {
        return element;
      }
      classNames = {};
      modules = null;
      props = {};
      if (element.props.className != null) {
        ref6 = ("" + element.props.className).split(/\s+/g);
        for (i = 0, len = ref6.length; i < len; i++) {
          className = ref6[i];
          classNames[className] = true;
        }
      }
      ref7 = element.props;
      for (key in ref7) {
        if (!hasProp.call(ref7, key)) continue;
        value = ref7[key];
        if (value === true) {
          classNames[key] = true;
        }
        if ((!options.disableModules) && (Array.isArray(value)) && (indexOf.call(Aui.modules, key) >= 0)) {
          classNames[key] = true;
          modules || (modules = {});
          modules[key] = value;
        }
        props[key] = value;
      }
      props.className = Object.keys(classNames).join(' ');
      if (!props.className.length) {
        delete props.className;
      }
      element = React.cloneElement(element, props, options.ignoreChildren ? element.props.children : React.Children.map(element.props.children, classify));
      if (modules) {
        return React.createElement(Aui.Module, {
          modules: modules,
          options: options
        }, element);
      } else {
        return element;
      }
    };
    return classify(element);
  };

  Aui.modules = ((jQuery != null ? (ref6 = jQuery.site) != null ? (ref7 = ref6.settings) != null ? ref7.modules : void 0 : void 0 : void 0) || []).slice();

  cache = {};

  Aui.Module = React.createClass({
    render: function() {
      return React.Children.only(this.props.children);
    },
    componentDidMount: function() {
      return this.callModules(this.props.children.props);
    },
    componentWillReceiveProps: function(props) {
      return this.callModules(props.children.props);
    },
    callModules: function(props) {
      var $element, module, name, options, ref8, stringifiedOptions;
      $element = jQuery(React.findDOMNode(this));
      this.id = $element.attr('data-reactid');
      cache[name = this.id] || (cache[name] = {});
      ref8 = this.props.modules;
      for (module in ref8) {
        if (!hasProp.call(ref8, module)) continue;
        options = ref8[module];
        stringifiedOptions = JSON.stringify(options);
        if (cache[this.id][module] !== stringifiedOptions) {
          cache[this.id][module] = stringifiedOptions;
          if (typeof $element[module] === "function") {
            $element[module].apply($element, this.props.children.props[module]);
          }
        }
      }
    },
    componentWillUnmount: function() {
      return delete cache[this.id];
    }
  });

  if (typeof window !== "undefined" && window !== null) {
    window.Aui = Aui;
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Aui;
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,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LEVBQUQsQ0FBSyxDQUFBLE1BQUEsQ0FBWCxLQUF3QixrQkFBM0I7VUFDRSxLQUFNLENBQUEsSUFBQyxDQUFBLEVBQUQsQ0FBSyxDQUFBLE1BQUEsQ0FBWCxHQUFxQjs7WUFDckIsUUFBUyxDQUFBLE1BQUEsa0JBQVMsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBTSxDQUFBLE1BQUE7V0FGMUM7O0FBRkY7SUFKVyxDQUxiO0lBZUEsb0JBQUEsRUFBc0IsU0FBQTthQUNwQixPQUFPLEtBQU0sQ0FBQSxJQUFDLENBQUEsRUFBRDtJQURPLENBZnRCO0dBRFc7OztJQWtCYixNQUFNLENBQUUsR0FBUixHQUFjOzs7O0lBQ2QsTUFBTSxDQUFFLE9BQVIsR0FBa0I7O0FBbklsQiIsImZpbGUiOiJhdWkuanMiLCJzb3VyY2VSb290IjoiL3NvdXJjZS8iLCJzb3VyY2VzQ29udGVudCI6WyJ7UmVhY3QsIGpRdWVyeX0gPSB3aW5kb3cgb3IgZ2xvYmFsXHJcbnVubGVzcyBSZWFjdD8gdGhlbiB0aHJvdyBuZXcgRXJyb3IgXCJBdWk6IHdpbmRvdy5SZWFjdCBub3QgZm91bmQuXCJcclxudW5sZXNzIGpRdWVyeT8gdGhlbiBjb25zb2xlLndhcm4gXCJBdWk6IHdpbmRvdy5qUXVlcnkgbm90IGZvdW5kLCBNb2R1bGVzIGFuZCBTZW1hbnRpYy1VSSB3aWxsIGJlIGRpc2FibGVkLlwiXHJcbnVubGVzcyBqUXVlcnk/LnNpdGU/LnNldHRpbmdzPy5tb2R1bGVzPyB0aGVuIGNvbnNvbGUud2FybiAnQXVpOiBObyBTZW1hbnRpYy1VSSB3aW5kb3cualF1ZXJ5LnNpdGUuc2V0dGluZ3MubW9kdWxlcyBmb3VuZCwgU2VtYW50aWMgd2lsbCBiZSBkaXNhYmxlZC4nXHJcblxyXG5cclxuIyMgbWl4aW4gQXVpLk1peGluXHJcbiMgQXVpLk1peGluIGlzIHRoZSBtYWluIHdyYXBwZXIgYXJvdW5kIFJlYWN0IENvbXBvbmVudHNcclxuIyBpdCByZWN1cnNpdmVseSBnb2VzIHRocm91Z2ggYWxsIGl0J3MgY2hpbGRyZW4sXHJcbiMgZmluZGluZyBwcm9wcyB0aGF0ID09PSB0cnVlIG9yIGFyZSBvbiB0aGUgYEF1aS5tb2R1bGVzYCBsaXN0LFxyXG4jIGFuZCBtZXJnZXMgdGhlbSBpbnRvIHRoZSBjbGFzc05hbWUgb2YgZWFjaCBlbGVtZW50LlxyXG5BdWlNaXhpbiA9XHJcbiAgJDogKHJlZikgLT4galF1ZXJ5IFJlYWN0LmZpbmRET01Ob2RlIEByZWZzW3JlZl0gb3IgcmVmXHJcbiAgY29tcG9uZW50V2lsbE1vdW50OiAtPlxyXG4gICAgcmVuZGVyID0gQHJlbmRlclxyXG4gICAgQHJlbmRlciA9IC0+XHJcbiAgICAgIGVsZW1lbnQgPSByZW5kZXI/LmFwcGx5PyBALCBhcmd1bWVudHNcclxuICAgICAgaWYgUmVhY3QuaXNWYWxpZEVsZW1lbnQgZWxlbWVudFxyXG4gICAgICAgIEF1aS5jbGFzc2lmeSBlbGVtZW50XHJcbiAgICAgIGVsc2VcclxuICAgICAgICBBdWkuY2xhc3NpZnkgQXVpLndhcm5pbmcgJ0F1aS5NaXhpbjogQ2hpbGQgaXMgbm90IGEgUmVhY3QuaXNWYWxpZEVsZW1lbnQnLCBlbGVtZW50XHJcblxyXG4jIyAoZGVwcmljYXRlZCkgY2xhc3MgPEF1aS8+XHJcbiMgQSB0YWcgdGhhdCBhcHBsaWVzIHRoZSBBdWkuTWl4aW5cclxuIyBVc2luZyB0aGUgQXVpLk1peGluIGluIHlvdXIgQ29tcG9uZW50IGlzIHByZWZlcmVkIG92ZXIgPEF1aS8+IHRhZy5cclxuQXVpID0gUmVhY3QuY3JlYXRlQ2xhc3NcclxuICBtaXhpbnM6IFtBdWlNaXhpbl1cclxuICByZW5kZXI6IC0+XHJcbiAgICBBdWkud2FybmluZyAnPEF1aS8+IHRhZyBpcyBkZXByaWNhdGVkLCB1c2UgQXVpLk1peGluIGluc3RlYWQnLCBAcHJvcHMuY2hpbGRyZW5cclxuICBjb21wb25lbnREaWRNb3VudDogLT5cclxuICAgIGNvbnNvbGUud2FybiBSZWFjdC5maW5kRE9NTm9kZSBAXHJcbkF1aS5NaXhpbiA9IEF1aS5BdWlNaXhpbiA9IEF1aU1peGluXHJcbkF1aS5BdWkgPSBBdWlcclxuQXVpLiQgPSBqUXVlcnlcclxuXHJcbiMjIGZ1bmN0aW9uIEF1aS53YXJuaW5nIChzdHJpbmcsIGVsZW1lbnQpXHJcbiMgY29uc29sZS53YXJuIGEgd2FybmluZyBtZXNzYWdlXHJcbiMgcmV0dXJucyB0aGUgZWxlbWVudCB3cmFwcGVkIGluIGEgd2FybmluZyBzcGFuXHJcbkF1aS53YXJuaW5nID0gKG1lc3NhZ2UsIGVsZW1lbnQpIC0+XHJcbiAgY29uc29sZS53YXJuIG1lc3NhZ2UsIGVsZW1lbnRcclxuICBSZWFjdC5ET00uc3BhbiB7ICdkYXRhLXdhcm5pbmcnOiBtZXNzYWdlIH0sIGVsZW1lbnRcclxuXHJcbiMjIG9iamVjdCBBdWkuc2V0dGluZ3NcclxuIyBUaGUgZGVmYXVsdCBvcHRpb25zIEF1aSB1c2VzIHdoZW4gbm8gb3B0aW9ucyBvciBwcm9wcyBhcmUgcGFzc2VkIGluLlxyXG5BdWkuc2V0dGluZ3MgPVxyXG4gICMgZGlzYWJsZXMgalF1ZXJ5IGJhc2VkIEF1aS5tb2R1bGVzIGZyb20gY2FsbGluZ1xyXG4gIGRpc2FibGVNb2R1bGVzOiBub3QgalF1ZXJ5P1xyXG4gICMgZGlzYWJsZXMgU2VtYW50aWMtVUkgc3BlY2lmaWMgZmVhdHVyZXNcclxuICBkaXNhYmxlU2VtYW50aWM6IG5vdCBqUXVlcnk/LnNpdGU/LnNldHRpbmdzPy5tb2R1bGVzP1xyXG4gICMgZG8gbm90IHJlY3Vyc2l2ZWx5IEF1aS5jbGFzc2lmeSBjaGlsZHJlbiBieSBkZWZhdWx0LlxyXG4gIGlnbm9yZUNoaWxkcmVuOiBub1xyXG5cclxuIyMgaW50ZXJuYWwgY2xhc3MgYEF1aU9wdGlvbnMoe29wdGlvbnN9KWBcclxuIyBkZWZhdWx0cyBhbGwgQXVpIG9wdGlvbnNcclxuY2xhc3MgQXVpT3B0aW9uc1xyXG4gIGNvbnN0cnVjdG9yOiAob3B0aW9ucykgLT5cclxuICAgIGlmIG9wdGlvbnMgaW5zdGFuY2VvZiBBdWlPcHRpb25zXHJcbiAgICAgIHJldHVybiBvcHRpb25zXHJcbiAgICB1bmxlc3MgQCBpbnN0YW5jZW9mIEF1aU9wdGlvbnNcclxuICAgICAgcmV0dXJuIG5ldyBBdWlPcHRpb25zIG9wdGlvbnNcclxuICAgIG9wdGlvbnMgb3I9IHt9XHJcbiAgICBmb3Igb3duIGtleSwgdmFsdWUgb2YgQXVpLnNldHRpbmdzXHJcbiAgICAgIEBba2V5XSA9IGlmIG9wdGlvbnNba2V5XT8gdGhlbiBvcHRpb25zW2tleV0gZWxzZSB2YWx1ZVxyXG5cclxuIyMgZWxlbWVudCBgQXVpLmNsYXNzaWZ5KGVsZW1lbnQsIHtvcHRpb25zfSlgXHJcbiMgZmluZHMgYWxsIHRoZSBwcm9wcyB0aGF0ID09PSB0cnVlIG9yIGFyZSBvbiB0aGUgYEF1aS5tb2R1bGVzYCBsaXN0LFxyXG4jIGFuZCBtZXJnaW5nIHRoZW0gd2l0aCB0aGUgY2xhc3NOYW1lIHByb3AuXHJcbiMgYEF1aS5jbGFzc2lmeSg8ZGl2IHVpIGdyaWQ+PGRpdiBjb2x1bW4+Y29udGVudDwvZGl2PjwvZGl2PilgXHJcbiMgcmV0dXJucyBgPGRpdiB1aSBncmlkIGNsYXNzTmFtZT1cInVpIGdyaWRcIj48ZGl2IGNvbHVtbiBjbGFzc05hbWU9XCJjb2x1bW5cIj5jb250ZW50PC9kaXY+PC9kaXY+YFxyXG5BdWkuY2xhc3NpZnkgPSAoZWxlbWVudCwgb3B0aW9ucykgLT5cclxuICBvcHRpb25zID0gQXVpT3B0aW9ucyBvcHRpb25zXHJcbiAgdW5sZXNzIFJlYWN0LmlzVmFsaWRFbGVtZW50IGVsZW1lbnRcclxuICAgIGVsZW1lbnQgPSBBdWkud2FybmluZyAnQXVpLmNsYXNzaWZ5OiBlbGVtZW50IGlzIG5vdCBhIFJlYWN0LmlzVmFsaWRFbGVtZW50JywgZWxlbWVudFxyXG4gIGNsYXNzaWZ5ID0gKGVsZW1lbnQpIC0+XHJcbiAgICByZXR1cm4gZWxlbWVudCB1bmxlc3MgUmVhY3QuaXNWYWxpZEVsZW1lbnQgZWxlbWVudFxyXG4gICAgY2xhc3NOYW1lcyA9IHt9XHJcbiAgICBtb2R1bGVzID0gbnVsbFxyXG4gICAgcHJvcHMgPSB7fVxyXG4gICAgaWYgZWxlbWVudC5wcm9wcy5jbGFzc05hbWU/XHJcbiAgICAgIGZvciBjbGFzc05hbWUgaW4gXCIje2VsZW1lbnQucHJvcHMuY2xhc3NOYW1lfVwiLnNwbGl0IC9cXHMrL2dcclxuICAgICAgICBjbGFzc05hbWVzW2NsYXNzTmFtZV0gPSB5ZXNcclxuICAgIGZvciBvd24ga2V5LCB2YWx1ZSBvZiBlbGVtZW50LnByb3BzXHJcbiAgICAgIGNsYXNzTmFtZXNba2V5XSA9IHllcyBpZiB2YWx1ZSBpcyB5ZXNcclxuICAgICAgaWYgKG5vdCBvcHRpb25zLmRpc2FibGVNb2R1bGVzKSBhbmQgKEFycmF5LmlzQXJyYXkgdmFsdWUpIGFuZCAoa2V5IGluIEF1aS5tb2R1bGVzKVxyXG4gICAgICAgIGNsYXNzTmFtZXNba2V5XSA9IHllc1xyXG4gICAgICAgIG1vZHVsZXMgb3I9IHt9XHJcbiAgICAgICAgbW9kdWxlc1trZXldID0gdmFsdWVcclxuICAgICAgcHJvcHNba2V5XSA9IHZhbHVlXHJcbiAgICBwcm9wcy5jbGFzc05hbWUgPSBPYmplY3Qua2V5cyhjbGFzc05hbWVzKS5qb2luICcgJ1xyXG4gICAgdW5sZXNzIHByb3BzLmNsYXNzTmFtZS5sZW5ndGhcclxuICAgICAgZGVsZXRlIHByb3BzLmNsYXNzTmFtZVxyXG4gICAgI2NvbnNvbGUubG9nIG1vZHVsZXMsIChpZiB0eXBlb2YgZWxlbWVudC50eXBlIGlzICdzdHJpbmcnIHRoZW4gZWxlbWVudC50eXBlIGVsc2UgJ0NvbXBvbmVudCcpLCBwcm9wcy5jbGFzc05hbWUgb3IgJydcclxuICAgIGVsZW1lbnQgPSBSZWFjdC5jbG9uZUVsZW1lbnQgZWxlbWVudCwgcHJvcHMsIGlmIG9wdGlvbnMuaWdub3JlQ2hpbGRyZW4gdGhlbiBlbGVtZW50LnByb3BzLmNoaWxkcmVuIGVsc2UgUmVhY3QuQ2hpbGRyZW4ubWFwIGVsZW1lbnQucHJvcHMuY2hpbGRyZW4sIGNsYXNzaWZ5XHJcbiAgICBpZiBtb2R1bGVzXHJcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQgQXVpLk1vZHVsZSwgeyBtb2R1bGVzLCBvcHRpb25zIH0sIGVsZW1lbnRcclxuICAgIGVsc2UgZWxlbWVudFxyXG4gIGNsYXNzaWZ5IGVsZW1lbnRcclxuXHJcbiMjIHN0cmluZ1tdIGBBdWkubW9kdWxlc2BcclxuIyBBIHdoaXRlbGlzdCBvZiBqUXVlcnkgbW9kdWxlc1xyXG4jIChhbHNvIGluY2x1ZGVzIGB3aW5kb3cualF1ZXJ5LnNpdGUuc2V0dGluZ3MubW9kdWxlc2AgZnJvbSBTZW1hbnRpYy1VSSBpZiBpdCBleGlzdHMpXHJcbiMgV2hlbiBhIHByb3BlcnR5IGlzIGVuY291bnRlcmVkIG9uIGEgUmVhY3RFbGVtZW50IHRoYXQgbWF0Y2hlcyB0aGlzIHdoaXRlbGlzdCxcclxuIyB0aGUgY29yaXNwb25kaW5nIGB3aW5kb3cualF1ZXJ5LmZuW21vZHVsZW5hbWVdYCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBwcm9wZXJ0eSdzIHZhbHVlLlxyXG4jIFRoaXMgaXMgbW9zdGx5IGludGVuZGVkIGZvciB1c2Ugd2l0aCBTZW1hbnRpYy1VSSdzIGphdmFzY3JpcHQsXHJcbiMgYnV0IGluIHRoZW9yeSBjb3VsZCBiZSB1c2VkIHRvIGNhbGwgYW55IGB3aW5kb3cualF1ZXJ5LmZuYCBmdW5jdGlvblxyXG5BdWkubW9kdWxlcyA9IChqUXVlcnk/LnNpdGU/LnNldHRpbmdzPy5tb2R1bGVzIG9yIFtdKS5zbGljZSgpXHJcblxyXG4jIyBpbnRlcm5hbCBnbG9iYWwgY2FjaGUgb2Ygb3B0aW9ucyBwYXNzZWQgdG8gbW9kdWxlIGZ1bmN0aW9ucy5cclxuY2FjaGUgPSB7fVxyXG5cclxuIyMgaW50ZXJuYWwgY2xhc3MgPEF1aS5Nb2R1bGUvPlxyXG4jIFRoaXMgY2xhc3MgcHJvdmlkZXMgc3VwcG9ydCBmb3IgYEF1aS5tb2R1bGVzYCBhbmQgaGFuZGxlcyBjYWxsaW5nIGpRdWVyeS5mblttb2R1bGVdIGNhbGxzXHJcbkF1aS5Nb2R1bGUgPSBSZWFjdC5jcmVhdGVDbGFzc1xyXG4gIHJlbmRlcjogLT4gUmVhY3QuQ2hpbGRyZW4ub25seSBAcHJvcHMuY2hpbGRyZW5cclxuICBjb21wb25lbnREaWRNb3VudDogLT5cclxuICAgIEBjYWxsTW9kdWxlcyBAcHJvcHMuY2hpbGRyZW4ucHJvcHNcclxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiAocHJvcHMpIC0+XHJcbiAgICBAY2FsbE1vZHVsZXMgcHJvcHMuY2hpbGRyZW4ucHJvcHNcclxuICBjYWxsTW9kdWxlczogKHByb3BzKSAtPlxyXG4gICAgJGVsZW1lbnQgPSBqUXVlcnkgUmVhY3QuZmluZERPTU5vZGUgQFxyXG4gICAgQGlkID0gJGVsZW1lbnQuYXR0ciAnZGF0YS1yZWFjdGlkJ1xyXG4gICAgY2FjaGVbQGlkXSBvcj0ge31cclxuICAgIGZvciBvd24gbW9kdWxlLCBvcHRpb25zIG9mIEBwcm9wcy5tb2R1bGVzXHJcbiAgICAgIHN0cmluZ2lmaWVkT3B0aW9ucyA9IEpTT04uc3RyaW5naWZ5IG9wdGlvbnNcclxuICAgICAgaWYgY2FjaGVbQGlkXVttb2R1bGVdIGlzbnQgc3RyaW5naWZpZWRPcHRpb25zXHJcbiAgICAgICAgY2FjaGVbQGlkXVttb2R1bGVdID0gc3RyaW5naWZpZWRPcHRpb25zXHJcbiAgICAgICAgJGVsZW1lbnRbbW9kdWxlXT8gQHByb3BzLmNoaWxkcmVuLnByb3BzW21vZHVsZV0uLi5cclxuICAgIHJldHVyblxyXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiAtPlxyXG4gICAgZGVsZXRlIGNhY2hlW0BpZF1cclxud2luZG93Py5BdWkgPSBBdWlcclxubW9kdWxlPy5leHBvcnRzID0gQXVpXHJcbiJdfQ==