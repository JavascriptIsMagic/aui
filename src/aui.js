'use strict';

var
  toArray = Function.prototype.call.bind(Array.prototype.slice),
  hasOwn = {}.hasOwnProperty,
  global = global || window,
  jQuery = global.jQuery,
  React = global.React || require('react/addons'),
  cloneWithProps = React.addons.cloneWithProps,
  modules = [
    "accordion",
    "api",
    "checkbox",
    "colorize",
    "dimmer",
    "dropdown",
    "form",
    "modal",
    "dimmer",
    "nag",
    "popup",
    "progress",
    "rating",
    "search",
    "shape",
    "sidebar",
    "site",
    "state",
    "sticky",
    "tab",
    "transition",
    "video",
    "visibility",
    "visit"
  ],
  moduleSearch;
function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
function uniqueStringArray(stringArray, filter) {
  var unique = {};
  stringArray.forEach(function (string) {
    unique[string] = true;
  });
  return Object.keys(unique);
}
function compileModuleSearch() {
  moduleSearch = new RegExp('\\b(' +
      modules.map(function (module) {
        return escapeRegExp(module);
      }).join('|')
    + ')\\b', 'i')
}
compileModuleSearch();
function add$fn(moduleNames) {
  if (!Array.isArray(moduleNames)) { moduleNames = [moduleNames]; }
  modules = uniqueStringArray(modules.concat(moduleNames));
  compileModuleSearch();
  return this;
}
function remove$fn(filter) {
  modules = uniqueStringArray(modules.filter(filter));
  compileModuleSearch();
  return this;
}
function noop() {}

// Fix iOS ignoring onClick handlers
if (/ios|iphone|ipad|ipod/i.test((navigator||{}).userAgent)) {
  jQuery('<style>*{cursor:pointer!important}</style>').appendTo('head');
}

var AuiMixin = {
  getInitialState: function () { return {}; },
  componentWillMount: function () {
    var self = this;
    /**
      @function AuiMixin.behavior(name, value)
      @example <div ui button onClick={this.behavior('name', ['behavior', 'syntax'])} />
      This function helps you call Samantic UI's behavior syntax using a state variable.
      this.behavior returns a function you can easily bind to a callback such as onClick,
      this.behavior will call this.setState with name you specify, and then immediately after call setState again, ensuring you will be able to trigger the behavior each time the handler is called.
    */
    this.behavior = function (name, value) {
      return behavior.bind(this, name, value);
    }.bind(this);
    function behavior(name, value, callback) {
      var state = {};
      state[name] = value;
      self.setState(state, function () {
        state[name] = [];
        self.setState(state, callback instanceof Function ? callback : noop);
      });
    }
    this.behaviors = function (sequence) {
      var behaviors = (
        Array.isArray(sequence) ?
          (sequence
            .filter(function (behavior) {
              return (Array.isArray(behavior) && typeof behavior[0] === 'string');
            })
            .reduce(function (behaviors, behavior) {
              var name = behavior.unshift();
              behaviors[name] = behaviors[name] || [];
              behaviors[name].push(behavior);
            }, { })) : sequence);
      return (Object.keys(behaviors)
        .reduce(function (next, name) {
          return (behaviors[name]
            .reduce(function (next, behaviorState) {
              return function () {
                behavior(name, behaviorState, next);
              }.bind(this);
            }.bind(this), next));
        }.bind(this), noop));
    }.bind(this);
  },
}

/**
  @class Aui
  <Aui/> React Component for displaying Semantic UI,
  recursively queries it's children,
  copying all props that === true to the className,
  and handling things like basic dropdown logic as well.
  @example ```js
  var Page = React.createClass({
    render: function () {
      return (
        <Aui>
          <div ui page grid>
            <div column>
              <h1 ui centered header> Hello Page! </h1>
            </div>
          </div>
        </Aui>
      );
    }
  });
  React.render(<Page/>, document.body);

  // The dom should look something like this:
  <body>
    <div class="ui page grid">
      <div class="column">
        <h1 class="ui centered header"> Hello Page! </h1>
      </div>
    </div>
  </body>
  ```
*/
var Aui = React.createClass({
  displayName: 'Aui',
  propTypes: {
    children: React.PropTypes.element.isRequired
  },
  render: function () {
    function query(Element) {
      if (Array.isArray(Element)) { return Element.map(query); }
      if (  React.isValidElement(Element) &&
            Element.props &&
            Element.props.noaui !== true &&
            Element.type !== Semantic &&
            Element.type !== Aui) {
        var
          props = {
            className: Object.keys(Element.props)
              .filter(function (property) {
                return (Element.props[property] === true || moduleSearch.test(property));
              }).join(' '),
          };
        if (Element.key) { props.key = Element.key; }
        if (Element.ref) { props.ref = Element.ref; }
        if (Element.props.children) {
          props.children = query(Element.props.children);
          if (/\bform\b/.test(props.className) || /\bform\b/.test(Element.props.className)) {
            props.children = (
              Array.isArray(props.children) ?
                props.children :
                [props.children]);
            if (Element.props.onSubmit) {
              props.onFormSubmit = Element.props.onSubmit;
              props.onSubmit = null;
            }
            // normalize form submits:
            props.children.unshift(React.createElement('input', { type: 'submit', style: { display: 'none' } }));
          }
        }
        Element = cloneWithProps(Element, props);
        if (jQuery &&
            moduleSearch.test(Element.props.className) &&
            // prevent <i dropdown icon /> from being wrapped
            !/\bicon\b/.test(Element.props.className) &&
            jQuery.fn[moduleSearch.exec(Element.props.className)[0]]) {
          return React.createElement(Semantic, { }, Element);
        }
        if (jQuery && Element.props.name) {
          return React.createElement(Semantic, { }, Element);
        }
      }
      return Element;
    };
    return query(this.props.children);
  },
});


function AuiSyntheticSyntheticEvent($target, element) {
  var target = (
    $target.filter('select,input')[0] ||
    $target.parents('.dropdown:first').find('select,input')[0] ||
    $target[0] ||
    element[0]);
  this.type = 'input';
  this.timeStamp = Date.now();
  this.target = target;
  this.preventDefault =
  this.isPersistent =
  this.isDefaultPrevented =
  this.isPropagationStopped =
  this.destructor =
  this.spotPropagation = noop;
};

var Semantic = React.createClass({
  displayName: 'Semantic',
  propTypes: { children: React.PropTypes.element.isRequired },
  getInitialState: function () {
    return { formData: {} }
  },
  onFormInput: function (event) {
    var target = event.target;
    setTimeout(function () {
      var formData = this.state.formData;
      formData[target.name] = target.value || target.setValue || target.defaultValue;
      this.setState({ formData: formData });
    }.bind(this));
  },
  componentWillMount: function () {
    var onInput = this.props.children.props.onInput,
      onFormInput = this.onFormInput;
    this.bothFormOnInput = function (event) {
      onFormInput.apply(this, arguments);
      if (onInput) { onInput.apply(this, arguments); }
    }
  },
  render: function () {
    if (this.props.children.props.form) {
      return cloneWithProps(this.props.children, {
        onInput: this.bothFormOnInput
      });
    }
    return this.props.children;
  },
  componentDidMount: function () {
    var
      self = this,
      props = self.props.children.props,
      element = jQuery(self.getDOMNode()),
      bothFormOnInput = self.bothFormOnInput;
    if (props.name) { element.attr('data-name', props.name); }
    props.className.split(' ')
      .filter(function (moduleType) { return moduleSearch.test(moduleType); })
      .map(function (moduleType) {
        var settings = props[moduleType];
        if (!settings) { return; }
        settings = Array.isArray(settings) ? settings : [settings];
        if (settings[0] === 'settings') { settings.shift(); }
        var options = settings[settings.length-1] = settings[settings.length-1] || {};
        if (options === true) {
          options = settings[settings.length-1] = {};
        }
        if (moduleType === 'form') {
          if (!settings[1]) { settings[1] = {}; }
          if (props.onFormSubmit) {
            settings[1].onSuccess = function (event) {
              if (event) {
                if (event.isTrigger) {
                  event.data = JSON.parse(JSON.stringify(self.state.formData));
                  props.onFormSubmit.apply(this, arguments);
                } else {
                  event.preventDefault();
                }
              }
            };
          }
          options = settings[1];
          setTimeout(function () {
            element.find('[data-name]').each(function (_, input) {
              var
                $input = jQuery(input),
                data = self.state.formData;
              data[$input.attr('data-name')] = $input.val();
            });
          });
        }
        if (typeof options === 'object') {
          var onChange = options.onChange;
          Object.keys(props)
            .filter(function (key) { return /^on[A-Z]/.test(key); })
            .map(function (callback) {
              if (!/^on(Input|Change)$/.test(callback)) {
                options[callback] = props[callback];
              }
              element.data(callback, props[callback]);
            });
          if (moduleType === 'form') { element.data('onInput', bothFormOnInput); }
          options.onChange = function (_, value) {
            var $target = jQuery(this);
            setTimeout(function () {
              if (onChange) { onChange.apply(this, arguments); }
              if (props.onInput) { props.onInput.call(this, new AuiSyntheticSyntheticEvent($target, element)); }
              if (props.onChange) { props.onChange.call(this, new AuiSyntheticSyntheticEvent($target, element)); }
              var form = $target.parents('.form:first');
              if (form[0]) {
                if (form.data('onChange')) { form.data('onChange').call(this, new AuiSyntheticSyntheticEvent($target, element)); }
                if (form.data('onInput')) { form.data('onInput').call(this, new AuiSyntheticSyntheticEvent($target, element)); }
              }
            }.bind(this, arguments));
          };
        }
        element[moduleType].apply(element, settings);
        if (props.name) {
          console.log('didmount:set value',
            this.props.name,
            this.props.value
            || this.props.setValue
            || this.props.defaultValue);
          setTimeout(function () {
            var form = element.parents('form.form:first'),
              formOnInput = form.data('onInput');
            if (formOnInput) {
              form.form('set value',
                this.props.name,
                this.props.value
                || this.props.setValue
                || this.props.defaultValue);
              formOnInput(new AuiSyntheticSyntheticEvent(element, element));
            }
          }.bind(this));
        }
      });
  },
  componentWillReceiveProps: function (props) {
    props = props.children.props;
    var
      self = this,
      element = jQuery(self.getDOMNode());
    props.className.split(' ')
      .filter(function (moduleType) { return moduleSearch.test(moduleType); })
      .map(function (moduleType) {
        var behavior =
          (Array.isArray(props[moduleType]) ?
            props[moduleType] :
            [props[moduleType]]);
        if (typeof behavior[0] === 'string') {
          if (behavior[0] === 'settings') { behavior.shift(); }
          element[moduleType].apply(element, behavior);
        }
      });
    if (props.form && JSON.stringify(props.setValues) !== this._setValues) {
      this._setValues = JSON.stringify(props.setValues);
      setTimeout(function () {
        var formOnInput = element.data('onInput');
        if (formOnInput) {
          element.form('set values', props.setValues);
          this.setState({ formData: element.form('get values') });
          formOnInput(new AuiSyntheticSyntheticEvent(element, element));
        }
      }.bind(this));
    }
    if (props.name && JSON.stringify(props.setValue) !== this._setValue) {
      this._setValue = JSON.stringify(props.setValue);
      setTimeout(function () {
        var form = element.parents('form.form:first'),
          formOnInput = form.data('onInput');
        if (formOnInput) {
          form.form('set value',
            props.name,
            props.setValue);
          formOnInput(new AuiSyntheticSyntheticEvent(element, element));
        }
      }.bind(this));
    }
  }
  //shouldComponentUpdate: function () { return false; }
});

if (!module) { var module = {}, exports; }
module.exports = exports = global.Aui = Aui;
exports.Aui = Aui;
exports.Mixin = exports.AuiMixin = AuiMixin;
exports.Semantic = Semantic;
exports.add$fn = add$fn;
if (jQuery) { exports.api = jQuery.fn.api; }
