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
  propTypes: {
    children: React.PropTypes.element.isRequired
  },
	render: function () {
		return this.props.children;
	},
	applySettings: function (settings) {
		var props = this.props.children.props,
			moduleType = moduleSearch.exec(props.className)[0],
			element = jQuery(this.getDOMNode());
		settings = settings || props[moduleType];
		settings = Array.isArray(settings) ? settings : [settings];
		element[moduleType].apply(element, settings);
	},
	componentDidMount: function () {
		this.applySettings();
	},
	componentWillUnmount: function () {
		this.applySettings('destroy');
	},
});

if (!module) { var module = {}, exports; }
module.exports = exports = global.Aui = Aui;
exports.Aui = Aui;
exports.Semantic = Semantic;
if (jQuery) { exports.api = jQuery.fn.api; }
