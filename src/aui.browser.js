'use strict';
/**
	@namespace Aui
	All functions are auto-curried / partial application.
	(if you do not supply enough arguments to the function,
		it will bind those partial arguments to itself and return.)
	@example ```js
	threeArgs(a, b) === threeArgs.bind(null, a, b)
	threeArgs(a)(b)(c) === threeArgs(a, b, c)
	```
*/
var
	React = require('react/addons'),
	cloneWithProps = React.addons.cloneWithProps;

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
	render: function () {
		return query(function (Element) {
				return Element.type !== NoAui;
			},
			function (Element) {
				return wrappable(classNameFromProps(Element));
			},
			this.props.children);
	}
});

/**
	@class NoAui
	<NoAui/> React Component prevents children from being enhanced by a parent <Aui/> tag.
*/
var NoAui = React.createClass({
	render: function () {
		return this.props.children;
	}
});

/**
	<AuiWrapper/> React Component is intended for internal use only.
	It manages things like open/close state of dropdown/accordion menus.
	use the <Aui/> React Component to apply this class to dropdowns and accordions
*/
var AuiWrapper = React.createClass({
	getInitialState: function () {
		return { open: false };
	},
	toggle: function () {
		this.setState({
			open: !this.state.open,
		});
	},
	render: function () {
		console.log('awfwfw?', this.props.children);
		return classNameFromProps(query(null,
			function (Element) {
				var props = {};
				if (	Element.props.dropdown === true ||
							Element.props.accordion === true) {
					props.onClick = this.toggle;
				}
				if (	Element.props.dropdown === true ||
							Element.props.content === true ||
							Element.props.title === true) {
					props.active = this.state.open;
					props.visible = this.state.open;
				}
				if (	Element.props.menu === true) {
					props.transition = true;
					props.visible = this.state.open;
					props.hidden = !this.state.open;
				}
				return props;
			},
			mergeWithProps(this.props.children, { onClick: this.toggle })));
	}
});
function wrappable(Element) {
	if (arguments.length < 1) { return mergeWithProps.bind(null).bind(arguments); }
	if (Element.props && Element.props.children &&
			((Element.props.dropdown === true) ||
				(Element.props.accordion === true))) {
		return React.createElement(AuiWrapper, Element);
	}
	return Element;
}

/**
	@function query(predicate, transformation, Elements) -> Elements
	If predicate(Element) returns true,
		applies a transformation function to the matched Elements children recursively.
	If predicate does not return true for an Element, Elements.props.children is not touched.
	If predicate is not a function it matches all Elements (null predicate = optional)
*/
function query(predicate, transformation, Elements) {
	if (arguments.length < 3) { return query.bind(null).bind(arguments); }
	function query(Element) {
		if (Array.isArray(Element)) { return Element.map(query); }
		if (React.isValidElement(Element)) {
			var transformedElement = mergeWithProps(transformation(Element), Element);
			if (transformedElement.props.children &&
					(!(predicate instanceof Function) || predicate(Element))) {
				return mergeWithProps({
					children: query(transformedElement.props.children)
				}, transformedElement);
			}
			return transformedElement;
		}
		return Element;
	}
	return query(Elements);
}

/**
	@function mergeWithProps(props{}, Element) -> Element
	Clones an Element with new properties applied, and copies the Key and Ref if not specified.
	This is useful if you want to modify nodes, replacing them with a new modified version.
	If props isValidElement, the props of that props{} element will be merged into Element.
	@returns a new element with props{} merged into Element.
*/
function mergeWithProps(props, Element) {
	if (arguments.length < 2) { return mergeWithProps.bind(null).bind(arguments); }
	if (props === Element) { return Element; }
	if (React.isValidElement(props)) { props = props.props; }
	if (Element.key) { props.key = props.key || Element.key; }
	if (Element.ref) { props.ref = props.ref || Element.ref; }
	return cloneWithProps(Element, props);
}

/**
	@function classNameFromProps(props{}) -> props{}
	@returns a className string from all the props{} that === true
*/
function classNameFromProps(Element) {
	if (arguments.length < 1) { return mergeWithProps.bind(null).bind(arguments); }
	return mergeWithProps({
		className: Object.keys(Element.props || {})
			.filter(function (property) {
				return Element.props[property] === true;
			}).join(' ')
	}, Element);
}


module.exports = exports = Aui;
exports.Aui = Aui;
exports.NoAui = NoAui;

exports.query = query;

exports.mergeWithProps = mergeWithProps;
exports.classNameFromProps = classNameFromProps;
