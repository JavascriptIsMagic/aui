(function() {
  var Aui, AuiMixin, AuiOptions, React, cache, jQuery, ref1, ref2, ref3, ref4, ref5,
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

  Aui.classify = function(element, options) {
    var classify;
    options = AuiOptions(options);
    if (!React.isValidElement(element)) {
      element = Aui.warning('Aui.classify: element is not a React.isValidElement', element);
    }
    classify = function(element) {
      var className, classNames, i, key, len, modules, props, ref4, ref5, value;
      if (!React.isValidElement(element)) {
        return element;
      }
      classNames = {};
      modules = null;
      props = {};
      if (element.props.className != null) {
        ref4 = ("" + element.props.className).split(/\s+/g);
        for (i = 0, len = ref4.length; i < len; i++) {
          className = ref4[i];
          classNames[className] = true;
        }
      }
      ref5 = element.props;
      for (key in ref5) {
        if (!hasProp.call(ref5, key)) continue;
        value = ref5[key];
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

  Aui.warning = function(message, element) {
    console.warn(message, element);
    return React.DOM.span({
      'data-warning': message
    }, element);
  };

  Aui.settings = {
    disableModules: jQuery == null,
    ignoreChildren: false
  };

  AuiOptions = (function() {
    function AuiOptions(options) {
      var key, ref4, value;
      if (options instanceof AuiOptions) {
        return options;
      }
      if (!(this instanceof AuiOptions)) {
        return new AuiOptions(options);
      }
      options || (options = {});
      ref4 = Aui.settings;
      for (key in ref4) {
        if (!hasProp.call(ref4, key)) continue;
        value = ref4[key];
        this[key] = options[key] != null ? options[key] : value;
      }
    }

    return AuiOptions;

  })();

  Aui.modules = ((jQuery != null ? (ref4 = jQuery.site) != null ? (ref5 = ref4.settings) != null ? ref5.modules : void 0 : void 0 : void 0) || []).slice();

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
      var $element, module, name, options, ref6, stringifiedOptions;
      $element = jQuery(React.findDOMNode(this));
      this.id = $element.attr('data-reactid');
      cache[name = this.id] || (cache[name] = {});
      ref6 = this.props.modules;
      for (module in ref6) {
        if (!hasProp.call(ref6, module)) continue;
        options = ref6[module];
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

//# sourceMappingURL=data:application/json;base64,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QUFYLEtBQXdCLGtCQUEzQjtVQUNFLEtBQU0sQ0FBQSxJQUFDLENBQUEsRUFBRCxDQUFLLENBQUEsTUFBQSxDQUFYLEdBQXFCOztZQUNyQixRQUFTLENBQUEsTUFBQSxrQkFBUyxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFNLENBQUEsTUFBQTtXQUYxQzs7QUFGRjtJQUpXLENBTGI7SUFlQSxvQkFBQSxFQUFzQixTQUFBO2FBQ3BCLE9BQU8sS0FBTSxDQUFBLElBQUMsQ0FBQSxFQUFEO0lBRE8sQ0FmdEI7R0FEVzs7O0lBbUJiLE1BQU0sQ0FBRSxHQUFSLEdBQWM7Ozs7SUFDZCxNQUFNLENBQUUsT0FBUixHQUFrQjs7QUE1SWxCIiwiZmlsZSI6ImF1aS5qcyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyIsInNvdXJjZXNDb250ZW50IjpbIntSZWFjdCwgalF1ZXJ5fSA9IHdpbmRvdyBvciBnbG9iYWxcclxudW5sZXNzIFJlYWN0PyB0aGVuIHRocm93IG5ldyBFcnJvciBcIkF1aTogd2luZG93LlJlYWN0IG5vdCBmb3VuZC5cIlxyXG51bmxlc3MgalF1ZXJ5PyB0aGVuIGNvbnNvbGUud2FybiBcIkF1aTogd2luZG93LmpRdWVyeSBub3QgZm91bmQsIE1vZHVsZXMgYW5kIFNlbWFudGljLVVJIHdpbGwgYmUgZGlzYWJsZWQuXCJcclxudW5sZXNzIGpRdWVyeT8uc2l0ZT8uc2V0dGluZ3M/Lm1vZHVsZXM/IHRoZW4gY29uc29sZS53YXJuICdBdWk6IE5vIFNlbWFudGljLVVJIHdpbmRvdy5qUXVlcnkuc2l0ZS5zZXR0aW5ncy5tb2R1bGVzIGZvdW5kLCBTZW1hbnRpYyB3aWxsIGJlIGRpc2FibGVkLidcclxuXHJcbiMjIEF1aS5NaXhpblxyXG4jIFtKU0ZpZGRsZSBhcm91bmQgd2l0aCB0aGUgZXhhbXBsZXMgaGVyZSFdKGh0dHA6Ly9qYXZhc2NyaXB0aXNtYWdpYy5naXRodWIuaW8vYXVpLylcclxuIyBBdWkuTWl4aW4gaXMgdGhlIG1haW4gd3JhcHBlciBhcm91bmQgUmVhY3QgQ29tcG9uZW50c1xyXG4jIGl0IHJlY3Vyc2l2ZWx5IGdvZXMgdGhyb3VnaCBhbGwgaXQncyBjaGlsZHJlbixcclxuIyBmaW5kaW5nIHByb3BzIHRoYXQgPT09IHRydWUgb3IgYXJlIG9uIHRoZSBgQXVpLm1vZHVsZXNgIGxpc3QsXHJcbiMgYW5kIG1lcmdlcyB0aGVtIGludG8gdGhlIGNsYXNzTmFtZSBvZiBlYWNoIGVsZW1lbnQuXHJcbkF1aU1peGluID1cclxuICAjIyB0aGlzLiQoJ3JlYWN0IHJlZicpXHJcbiAgIyBqUXVlcnkgd3JhcHMgYSBSZWFjdCByZWYgYDxkaXYgcmVmPVwicmVhY3QgcmVmXCIgLz5gIG9yIGpRdWVyeSBzZWxlY3RvciBgdGhpcy4kKCdyZWFjdCByZWYnKWAuXHJcbiAgIyBUaGlzIGlzIHRoZSBpbnRlbmRlZCB3YXkgdG8gaW50ZXJhY3Qgd2l0aCBqUXVlcnkgdG8gc3VwcGx5IHV0aWxpdHkgZnVuY3Rpb25hbGl0eS5cclxuICAjICoqV2FybmluZyEqKiBVc2UgdGhpcyBvbmx5IGluIGBjb21wb25lbnREaWRNb3VudGAgb3IgZXZlbnQgaGFuZGxlcnMhXHJcbiAgIyBEbyBOT1QgdXNlIGpRdWVyeSB0byByZS1hcmFuZ2UgdGhlIGRvbSBvciB5b3Ugd2lsbCBydW4gaW50byBJbnZhcmllbnQgZXJyb3MgaW4gUmVhY3QsXHJcbiAgIyB1c2UgUmVhY3QgdG8gYXJhbmdlIHlvdXIgZG9tIGFoZWFkIG9mIHRpbWUgYXMgUmVhY3QgaXMgZXhwZWN0aW5nLlxyXG4gICQ6IChyZWYpIC0+IGpRdWVyeSBSZWFjdC5maW5kRE9NTm9kZSBAcmVmc1tyZWZdIG9yIHJlZlxyXG4gIGNvbXBvbmVudFdpbGxNb3VudDogLT5cclxuICAgIHJlbmRlciA9IEByZW5kZXJcclxuICAgIEByZW5kZXIgPSAtPlxyXG4gICAgICBlbGVtZW50ID0gcmVuZGVyPy5hcHBseT8gQCwgYXJndW1lbnRzXHJcbiAgICAgIGlmIFJlYWN0LmlzVmFsaWRFbGVtZW50IGVsZW1lbnRcclxuICAgICAgICBBdWkuY2xhc3NpZnkgZWxlbWVudFxyXG4gICAgICBlbHNlXHJcbiAgICAgICAgQXVpLmNsYXNzaWZ5IEF1aS53YXJuaW5nICdBdWkuTWl4aW46IENoaWxkIGlzIG5vdCBhIFJlYWN0LmlzVmFsaWRFbGVtZW50JywgZWxlbWVudFxyXG5cclxuIyAoZGVwcmljYXRlZCkgYDxBdWkvPmAgdGFnLCB1c2UgQXVpLk1peGluIGluc3RlYWQuXHJcbkF1aSA9IFJlYWN0LmNyZWF0ZUNsYXNzXHJcbiAgbWl4aW5zOiBbQXVpTWl4aW5dXHJcbiAgcmVuZGVyOiAtPlxyXG4gICAgQXVpLndhcm5pbmcgJzxBdWkvPiB0YWcgaXMgZGVwcmljYXRlZCwgdXNlIEF1aS5NaXhpbiBpbnN0ZWFkJywgQHByb3BzLmNoaWxkcmVuXHJcbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XHJcbiAgICBjb25zb2xlLndhcm4gUmVhY3QuZmluZERPTU5vZGUgQFxyXG5BdWkuTWl4aW4gPSBBdWkuQXVpTWl4aW4gPSBBdWlNaXhpblxyXG5BdWkuQXVpID0gQXVpXHJcbiMjIEF1aS4kXHJcbiMgVGhlIGluc3RhbmNlIG9mIGpRdWVyeSBBdWkgaXMgdXNpbmcsIGlmIG5lZWRlZC5cclxuQXVpLiQgPSBqUXVlcnlcclxuXHJcbiMjIEF1aS5jbGFzc2lmeShlbGVtZW50KVxyXG4jIGZpbmRzIGFsbCB0aGUgcHJvcHMgdGhhdCA9PT0gdHJ1ZSBvciBhcmUgb24gdGhlIGBBdWkubW9kdWxlc2AgbGlzdCxcclxuIyBhbmQgbWVyZ2luZyB0aGVtIHdpdGggdGhlIGNsYXNzTmFtZSBwcm9wLlxyXG4jIFVzZSB0aGlzIGluc2lkZSB0aGUgcmVuZGVyIGZ1bmN0aW9uIGxpa2UgYSBSZWFjdCBoZWxwZXIgZnVuY3Rpb24uXHJcbiMgRXhhbXBsZTogYEF1aS5jbGFzc2lmeSg8ZGl2IHVpIGdyaWQ+PGRpdiBjb2x1bW4+Y29udGVudDwvZGl2PjwvZGl2PilgXHJcbiMgcmV0dXJucyBgPGRpdiB1aSBncmlkIGNsYXNzTmFtZT1cInVpIGdyaWRcIj48ZGl2IGNvbHVtbiBjbGFzc05hbWU9XCJjb2x1bW5cIj5jb250ZW50PC9kaXY+PC9kaXY+YFxyXG5BdWkuY2xhc3NpZnkgPSAoZWxlbWVudCwgb3B0aW9ucykgLT5cclxuICBvcHRpb25zID0gQXVpT3B0aW9ucyBvcHRpb25zXHJcbiAgdW5sZXNzIFJlYWN0LmlzVmFsaWRFbGVtZW50IGVsZW1lbnRcclxuICAgIGVsZW1lbnQgPSBBdWkud2FybmluZyAnQXVpLmNsYXNzaWZ5OiBlbGVtZW50IGlzIG5vdCBhIFJlYWN0LmlzVmFsaWRFbGVtZW50JywgZWxlbWVudFxyXG4gIGNsYXNzaWZ5ID0gKGVsZW1lbnQpIC0+XHJcbiAgICByZXR1cm4gZWxlbWVudCB1bmxlc3MgUmVhY3QuaXNWYWxpZEVsZW1lbnQgZWxlbWVudFxyXG4gICAgY2xhc3NOYW1lcyA9IHt9XHJcbiAgICBtb2R1bGVzID0gbnVsbFxyXG4gICAgcHJvcHMgPSB7fVxyXG4gICAgaWYgZWxlbWVudC5wcm9wcy5jbGFzc05hbWU/XHJcbiAgICAgIGZvciBjbGFzc05hbWUgaW4gXCIje2VsZW1lbnQucHJvcHMuY2xhc3NOYW1lfVwiLnNwbGl0IC9cXHMrL2dcclxuICAgICAgICBjbGFzc05hbWVzW2NsYXNzTmFtZV0gPSB5ZXNcclxuICAgIGZvciBvd24ga2V5LCB2YWx1ZSBvZiBlbGVtZW50LnByb3BzXHJcbiAgICAgIGNsYXNzTmFtZXNba2V5XSA9IHllcyBpZiB2YWx1ZSBpcyB5ZXNcclxuICAgICAgaWYgKG5vdCBvcHRpb25zLmRpc2FibGVNb2R1bGVzKSBhbmQgKEFycmF5LmlzQXJyYXkgdmFsdWUpIGFuZCAoa2V5IGluIEF1aS5tb2R1bGVzKVxyXG4gICAgICAgIGNsYXNzTmFtZXNba2V5XSA9IHllc1xyXG4gICAgICAgIG1vZHVsZXMgb3I9IHt9XHJcbiAgICAgICAgbW9kdWxlc1trZXldID0gdmFsdWVcclxuICAgICAgcHJvcHNba2V5XSA9IHZhbHVlXHJcbiAgICBwcm9wcy5jbGFzc05hbWUgPSBPYmplY3Qua2V5cyhjbGFzc05hbWVzKS5qb2luICcgJ1xyXG4gICAgdW5sZXNzIHByb3BzLmNsYXNzTmFtZS5sZW5ndGhcclxuICAgICAgZGVsZXRlIHByb3BzLmNsYXNzTmFtZVxyXG4gICAgZWxlbWVudCA9IFJlYWN0LmNsb25lRWxlbWVudCBlbGVtZW50LCBwcm9wcywgaWYgb3B0aW9ucy5pZ25vcmVDaGlsZHJlbiB0aGVuIGVsZW1lbnQucHJvcHMuY2hpbGRyZW4gZWxzZSBSZWFjdC5DaGlsZHJlbi5tYXAgZWxlbWVudC5wcm9wcy5jaGlsZHJlbiwgY2xhc3NpZnlcclxuICAgIGlmIG1vZHVsZXNcclxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudCBBdWkuTW9kdWxlLCB7IG1vZHVsZXMsIG9wdGlvbnMgfSwgZWxlbWVudFxyXG4gICAgZWxzZSBlbGVtZW50XHJcbiAgY2xhc3NpZnkgZWxlbWVudFxyXG5cclxuIyMgQXVpLndhcm5pbmcoJ3N0cmluZycsIGVsZW1lbnQpXHJcbiMgY29uc29sZS53YXJuIGEgd2FybmluZyBtZXNzYWdlIGluc2lkZSBhIFJlYWN0RWxlbWVudCBkdXJyaW5nIGEgUmVhY3QgQ29tcG9uZW50J3MgcmVuZGVyIGZ1bmN0aW9uLlxyXG4jIHJldHVybnMgdGhlIGVsZW1lbnQgd3JhcHBlZCBpbiBhIHdhcm5pbmcgc3Bhbi5cclxuIyBVc2UgaW5zaWRlIHRoZSByZW5kZXIgZnVuY3Rpb24gb2YgYSBSZWFjdCBDb21wb25lbnRcclxuQXVpLndhcm5pbmcgPSAobWVzc2FnZSwgZWxlbWVudCkgLT5cclxuICBjb25zb2xlLndhcm4gbWVzc2FnZSwgZWxlbWVudFxyXG4gIFJlYWN0LkRPTS5zcGFuIHsgJ2RhdGEtd2FybmluZyc6IG1lc3NhZ2UgfSwgZWxlbWVudFxyXG5cclxuQXVpLnNldHRpbmdzID1cclxuICAjIyBBdWkuc2V0dGluZ3MuZGlzYWJsZU1vZHVsZXNcclxuICAjIGRpc2FibGVzIGpRdWVyeSBiYXNlZCBBdWkubW9kdWxlcyBmcm9tIGNhbGxpbmdcclxuICBkaXNhYmxlTW9kdWxlczogbm90IGpRdWVyeT9cclxuICAjIyBBdWkuc2V0dGluZ3MuaWdub3JlQ2hpbGRyZW5cclxuICAjIGRpc2FibGVzIHJlY3Vyc2l2ZWx5IGNhbGxpbmcgYEF1aS5jbGFzc2lmeWAgdG8gYHByb3BzLmNoaWxkcmVuYC5cclxuICBpZ25vcmVDaGlsZHJlbjogbm9cclxuXHJcbiMgKGludGVybmFsKSBBdWlPcHRpb25zIGRlZmF1bHRzIG9wdGlvbnMgZm9yIGBBdWkuY2xhc3NpZnlgXHJcbmNsYXNzIEF1aU9wdGlvbnNcclxuICBjb25zdHJ1Y3RvcjogKG9wdGlvbnMpIC0+XHJcbiAgICBpZiBvcHRpb25zIGluc3RhbmNlb2YgQXVpT3B0aW9uc1xyXG4gICAgICByZXR1cm4gb3B0aW9uc1xyXG4gICAgdW5sZXNzIEAgaW5zdGFuY2VvZiBBdWlPcHRpb25zXHJcbiAgICAgIHJldHVybiBuZXcgQXVpT3B0aW9ucyBvcHRpb25zXHJcbiAgICBvcHRpb25zIG9yPSB7fVxyXG4gICAgZm9yIG93biBrZXksIHZhbHVlIG9mIEF1aS5zZXR0aW5nc1xyXG4gICAgICBAW2tleV0gPSBpZiBvcHRpb25zW2tleV0/IHRoZW4gb3B0aW9uc1trZXldIGVsc2UgdmFsdWVcclxuXHJcbiMjIEF1aS5tb2R1bGVzXHJcbiMgQSB3aGl0ZWxpc3Qgb2YgalF1ZXJ5IG1vZHVsZXMuXHJcbiMgYEF1aS5tb2R1bGVzLnB1c2goJ3dpZGdldCcpYCB0byBjb25maWd1cmUgQXVpIHRvIHN1cHBvcnQgYCQuZm4ud2lkZ2V0YC5cclxuIyBCeSBkZWZhdWx0IHRoaXMgaW5jbHVkZXMgYHdpbmRvdy5qUXVlcnkuc2l0ZS5zZXR0aW5ncy5tb2R1bGVzYCBmcm9tIFNlbWFudGljLVVJLlxyXG4jIFdoZW4gYSBwcm9wZXJ0eSBpcyBlbmNvdW50ZXJlZCBvbiBhIFJlYWN0RWxlbWVudCB0aGF0IG1hdGNoZXMgdGhpcyB3aGl0ZWxpc3QgYW5kIGlzIGFuIEFycmF5LFxyXG4jIHRoZSBjb3Jpc3BvbmRpbmcgYHdpbmRvdy5qUXVlcnkuZm5bbW9kdWxlbmFtZV1gIHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIHByb3BlcnR5J3MgYXJyYXkgdmFsdWUuXHJcbiMgVGhpcyBpcyBtb3N0bHkgaW50ZW5kZWQgZm9yIHVzZSB3aXRoIFNlbWFudGljLVVJJ3MgamF2YXNjcmlwdCxcclxuIyBidXQgaW4gdGhlb3J5IGNvdWxkIGJlIHVzZWQgdG8gY2FsbCBhbnkgYCQuZm5gIGZ1bmN0aW9uLlxyXG5BdWkubW9kdWxlcyA9IChqUXVlcnk/LnNpdGU/LnNldHRpbmdzPy5tb2R1bGVzIG9yIFtdKS5zbGljZSgpXHJcblxyXG4jIGludGVybmFsIGdsb2JhbCBjYWNoZSBvZiBvcHRpb25zIHBhc3NlZCB0byBtb2R1bGUgZnVuY3Rpb25zLlxyXG5jYWNoZSA9IHt9XHJcblxyXG4jIChpbnRlcm5hbCkgYDxBdWkuTW9kdWxlLz5gXHJcbiMgVGhpcyBjbGFzcyBwcm92aWRlcyBzdXBwb3J0IGZvciBgQXVpLm1vZHVsZXNgIGludGVybmFsbHkgYW5kIGdlbmVyYWxseSBpcyBub3QgdXNlZCBkaXJlY3RseS5cclxuIyBgPEF1aS5Nb2R1bGUvPmAgaGFuZGxlcyBjYWxsaW5nIGpRdWVyeS5mblttb2R1bGVdIGNhbGxzIHdoZW4gdXNlZCBpbnNpZGUgYSBSZWFjdCBDb21wb25lbnQncyByZW5kZXIuXHJcbiMgYDxkaXYgdWkgY2hlY2tib3g9e1tdfS8+YCB3aWxsIGF1dG9tYXRpY2FsbHkgY2FsbCBgJC5mbi5jaGVja2JveCgpYCwgYW5kXHJcbiMgYDxmb3JtIHVpIGZvcm09e1t7Li4ufV19PjwvZm9ybT5gIHdpbGwgYXV0b21hdGljYWxseSBjYWxsIGAkLmZuLmZvcm0oey4uLn0pYFxyXG5BdWkuTW9kdWxlID0gUmVhY3QuY3JlYXRlQ2xhc3NcclxuICByZW5kZXI6IC0+IFJlYWN0LkNoaWxkcmVuLm9ubHkgQHByb3BzLmNoaWxkcmVuXHJcbiAgY29tcG9uZW50RGlkTW91bnQ6IC0+XHJcbiAgICBAY2FsbE1vZHVsZXMgQHByb3BzLmNoaWxkcmVuLnByb3BzXHJcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogKHByb3BzKSAtPlxyXG4gICAgQGNhbGxNb2R1bGVzIHByb3BzLmNoaWxkcmVuLnByb3BzXHJcbiAgY2FsbE1vZHVsZXM6IChwcm9wcykgLT5cclxuICAgICRlbGVtZW50ID0galF1ZXJ5IFJlYWN0LmZpbmRET01Ob2RlIEBcclxuICAgIEBpZCA9ICRlbGVtZW50LmF0dHIgJ2RhdGEtcmVhY3RpZCdcclxuICAgIGNhY2hlW0BpZF0gb3I9IHt9XHJcbiAgICBmb3Igb3duIG1vZHVsZSwgb3B0aW9ucyBvZiBAcHJvcHMubW9kdWxlc1xyXG4gICAgICBzdHJpbmdpZmllZE9wdGlvbnMgPSBKU09OLnN0cmluZ2lmeSBvcHRpb25zXHJcbiAgICAgIGlmIGNhY2hlW0BpZF1bbW9kdWxlXSBpc250IHN0cmluZ2lmaWVkT3B0aW9uc1xyXG4gICAgICAgIGNhY2hlW0BpZF1bbW9kdWxlXSA9IHN0cmluZ2lmaWVkT3B0aW9uc1xyXG4gICAgICAgICRlbGVtZW50W21vZHVsZV0/IEBwcm9wcy5jaGlsZHJlbi5wcm9wc1ttb2R1bGVdLi4uXHJcbiAgICByZXR1cm5cclxuICBjb21wb25lbnRXaWxsVW5tb3VudDogLT5cclxuICAgIGRlbGV0ZSBjYWNoZVtAaWRdXHJcblxyXG53aW5kb3c/LkF1aSA9IEF1aVxyXG5tb2R1bGU/LmV4cG9ydHMgPSBBdWlcclxuIl19