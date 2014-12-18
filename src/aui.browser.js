'use strict';
var
	apply = Function.prototype.apply,
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
			[	classNameFromProps,
				wrappable],
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
		return (query(null,
			function (Element) {
				var props = { className: '' };
				if (	Element.props.dropdown === true ||
							Element.props.accordion === true) {
					props.onClick = this.toggle;
				}
				if (	Element.props.dropdown === true ||
							Element.props.content === true ||
							Element.props.title === true) {
					props.className += this.state.open ? ' active visible ' : '';
				}
				if (	Element.props.menu === true) {
					props.className += this.state.open ? ' transition visible ' : ' transition hidden ';
				}
				if (!props.className) { delete props.className; }
				return props;
			}.bind(this),
			mergeWithProps(this.props.children, { onClick: this.toggle })));
	}
});
function wrappable(Element) {
	if (Element.props && Element.props.children &&
			((Element.props.dropdown === true) ||
				(Element.props.accordion === true))) {
		return React.createElement(AuiWrapper, {}, Element);
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
	transformation = compose.bind(null, transformation);
	function query(Element) {
		if (Array.isArray(Element)) { return Element.map(query); }
		if (React.isValidElement(Element)) {
			if (Element.props.children &&
					(!(predicate instanceof Function) || predicate(Element))) {
				Element = mergeWithProps({
					children: query(Element.props.children)
				}, Element);
			}
			return transformation(Element);
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
	if (props === Element) { return Element; }
	if (React.isValidElement(props)) { return props; }
	if (Element.key) { props.key = props.key || Element.key; }
	if (Element.ref) { props.ref = props.ref || Element.ref; }
	return cloneWithProps(Element, props);
}

function compose(transformations, Element) {
	transformations = (Array.isArray(transformations) ?
		transformations : [transformations]);
	return (transformations
		.reverse()
		.reduce(function (Element, transformation) {
			return mergeWithProps(transformation(Element), Element);
		}, Element));
}

/**
	@function classNameFromProps(Element) -> props{}
	@returns a className string from all the props{} that === true
*/
function classNameFromProps(props) {
	if (React.isValidElement(props)) { props = props.props; }
	return ({
		className: Object.keys(props || {})
			.filter(function (property) {
				return props[property] === true;
			}).join(' ')
	});
}


module.exports = exports = Aui;
exports.Aui = Aui;
exports.NoAui = NoAui;

exports.query = query;

exports.mergeWithProps = mergeWithProps;
exports.classNameFromProps = classNameFromProps;
