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

/**
	@class Semantic (internal)
	<Semantic/> is a wrapper component that manages Semantic Modules
	<Aui> component automatically wraps elements with <semantic/> as needed,
	intended mostly for internal use by Aui, and is not typically used directly.
*/
var Semantic = React.createClass({
  propTypes: { children: React.PropTypes.element.isRequired },
	getInitialState: function () { return { formData: {} } },
	onFormInput: function (event) {
		var formData = this.state.formData;
		formData[event.target.name] = event.target.value;
		this.setState({ formData: formData });
	},
	render: function () {
		if (this.props.children.props.form) {
			var onFormInput = this.props.children.props.onInput,
				componentOnFormInput = this.onFormInput;
			return cloneWithProps(this.props.children, {
				onInput: function (event) {
					componentOnFormInput.apply(this, arguments);
					if (onFormInput) { onFormInput.apply(this, arguments); }
				}
			});
		}
		return this.props.children;
	},
	applySettings: function (settings) {
		var props = this.props.children.props,
			element = jQuery(this.getDOMNode()),
			formData = this.state.formData;
		props.className.split(' ')
			.filter(function (moduleType) { return moduleSearch.test(moduleType); })
			.map(function (moduleType) {
				var settings = props[moduleType];
				settings = Array.isArray(settings) ? settings : [settings];
				var options = settings[settings.length-1] = settings[settings.length-1] || {};
				if (moduleType === 'form') {
					if (!settings[1]) { settings[1] = {}; }
					if (props.onSubmit) {
						settings[1].onSuccess = function (event) {
							event.data = formData;
							props.onSubmit.apply(this, arguments);
						};
					}
					options = settings[1];
				}
				Object.keys(props)
					.filter(function (key) { return /^on[A-Z]/.test(key); })
					.map(function (callback) {
						options[callback] = props[callback];
					});
				element[moduleType].apply(element, settings);
			});
	},
	componentDidMount: function () {
		this.applySettings();
	},
	componentWillUnmount: function () {
		var props = this.props.children.props,
			element = jQuery(this.getDOMNode());
		jQuery(this.getDOMNode()).remove();
	},
});

if (!module) { var module = {}, exports; }
module.exports = exports = global.Aui = Aui;
exports.Aui = Aui;
exports.Semantic = Semantic;
if (jQuery) { exports.api = jQuery.fn.api; }
