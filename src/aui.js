'use strict';
var
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
	moduleSearch = new RegExp('\\b(' + modules.join('|') + ')\\b', 'i');

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
  propTypes: {
    children: React.PropTypes.element.isRequired
  },
	render: function () {
		function query(Element) {
			if (Array.isArray(Element)) { return Element.map(query); }
			if (	React.isValidElement(Element) &&
						Element.props &&
						Element.props.noaui !== true &&
						Element.type !== Semantic) {
				var
					props = {
						className: Object.keys(Element.props)
							.filter(function (property) {
								return (Element.props[property] === true || moduleSearch.test(property));
							}).join(' '),
					};
				if (Element.key) { props.key = Element.key; }
				if (Element.ref) { props.ref = Element.ref; }
				if (Element.props.children) { props.children = query(Element.props.children); }
				Element = cloneWithProps(Element, props);
				if (jQuery &&
						moduleSearch.test(Element.props.className) &&
						jQuery.fn[moduleSearch.exec(Element.props.className)[0]]) {
					return React.createElement(Semantic, { }, Element);
				}
			}
			return Element;
		};
		return query(this.props.children);
	},
});

var Semantic = React.createClass({
  propTypes: { children: React.PropTypes.element.isRequired },
	getInitialState: function () { return { formData: {} } },
	onFormInput: function (event) {
		var target = event.target;
		setTimeout(function () {
			var formData = this.state.formData;
			formData[target.name] = target.value;
			console.log(target.name, target.value);
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
	applySettings: function (settings) {
		var
			self = this,
			props = this.props.children.props,
			element = jQuery(this.getDOMNode()),
			bothFormOnInput = this.bothFormOnInput;
		function noop() {};
		function AuiSyntheticSyntheticEvent($target) {
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
		if (props.name) { element.attr('data-name', props.name); }
		props.className.split(' ')
			.filter(function (moduleType) { return moduleSearch.test(moduleType); })
			.map(function (moduleType) {
				var settings = props[moduleType];
				if (!settings) { return; }
				settings = Array.isArray(settings) ? settings : [settings];
				var options = settings[settings.length-1] = settings[settings.length-1] || {};
				if (options === true) {
					options = settings[settings.length-1] = {};
				}
				if (moduleType === 'form') {
					if (!settings[1]) { settings[1] = {}; }
					if (props.onSubmit) {
						settings[1].onSuccess = function (event) {
							event.data = self.state.formData;
							props.onSubmit.apply(this, arguments);
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
							console.log(callback, props[callback]);
							element.data(callback, props[callback]);
						});
					if (moduleType === 'form') { element.data('onInput', bothFormOnInput); }
					options.onChange = function (_, value, $target) {
						if (onChange) { onChange.apply(this, arguments); }
						if (props.onInput) { props.onInput.call(this, new AuiSyntheticSyntheticEvent($target)); }
						if (props.onChange) { props.onChange.call(this, new AuiSyntheticSyntheticEvent($target)); }
						var form = $target.parents('.form:first');
						if (form[0]) {
							if (form.data('onChange')) { form.data('onChange').call(this, new AuiSyntheticSyntheticEvent($target)); }
							if (form.data('onInput')) { form.data('onInput').call(this, new AuiSyntheticSyntheticEvent($target)); }
						}
					};
				}
				element[moduleType].apply(element, settings);
				if (props.name) {
					setTimeout(function () {
						var formOnInput = element.parents('.form:first').data('onInput');
						if (formOnInput) {
							formOnInput(new AuiSyntheticSyntheticEvent(element));
						}
					});
				}
			});
	},
	componentDidMount: function () {
		this.applySettings();
	},
	componentWillUnmount: function () {
		jQuery(this.getDOMNode()).remove();
	},
});

if (!module) { var module = {}, exports; }
module.exports = exports = global.Aui = Aui;
exports.Aui = Aui;
exports.Semantic = Semantic;
if (jQuery) { exports.api = jQuery.fn.api; }
