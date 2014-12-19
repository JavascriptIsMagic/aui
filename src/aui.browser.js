'use strict';
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
			[classNameFromProps, wrapSemanticModules, classNameFromProps],
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


var AuiDropdown = React.createClass({
	getInitialState: function () { return {}; },
	toggle: function () {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen,
		});
	},
	select: function (value, text) {
		var event = {
			name: this.props.children.props.name,
			text: text,
			value: value,
		};
		event.target = event;
		if (this.props.children.props.onInput) {
			this.props.children.props.onInput(event);
		}
		if (this.props.children.props.onChange) {
			this.props.children.props.onChange(event);
		}
		this.setState({
			text: text,
			value: value,
		});
	},
	render: function () {
		return (mergeWithProps({
			onClick: this.toggle,
			children: this.props.children.props.children
				.map(function (Element) {
					if (Element.props.text === true && this.state.text) {
						return mergeWithProps({
							children: this.state.text,
						}, Element);
					}
					if (Element.props.menu === true) {
						return mergeWithProps({
							className: this.state.dropdownOpen ? 'transition visible' : 'transition hidden',
							children: Element.props.children.map(function (Element) {
								var value = Element.props.value || Element.props.dataValue || Element.props['data-value'];
								if (Element.props.item === true) {
									return mergeWithProps({
										onClick: this.select.bind(null, value, Element.props.children),
									}, Element);
								}
								return Element;
							}.bind(this)),
						}, Element);
					}
					return Element;
				}.bind(this)),
		}, this.props.children));
	}
});

var AuiAccordian = React.createClass({
	getInitialState: function () { return {}; },
	toggle: function (index) {
		var state = Object.keys(this.state)
			.reduce(function (state, key) {
				state[key] = false;
				return state;
			}, { });
		state['accordionOpen' + index] = !this.state['accordionOpen' + index];
		this.setState(state);
	},
	render: function () {
		var accordion = (mergeWithProps({
			children: this.props.children.props.children
				.map(function (Element, index) {
					var
						title = Element.props.title === true,
						content = Element.props.content === true,
						contentIndex = (title ? index + 1 : index);
					if (title || content) {
						return mergeWithProps({
							onClick: this.toggle.bind(null, contentIndex),
							className: this.state['accordionOpen' + contentIndex] ? 'active' : '',
						}, Element);
					}
					return Element;
				}.bind(this)),
		}, this.props.children));
		return accordion;
	}
});

function wrapSemanticModules(Element) {
	if (
			Element &&
			Element.props &&
			Element.props.children &&
			Element.props.icon !== true &&
			Element.props.ui === true) {
		if (Element.props.dropdown === true) {
			console.log(Element.props);
			return React.createElement(AuiDropdown, {}, Element);
		}
		if (Element.props.accordion === true) {
			console.log(Element.props);
			return React.createElement(AuiAccordian, {}, Element);
		}
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
	@function compose(transformations[], Element)
	merges the results of transformations[] in right to left order.
*/
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
exports.compose = compose;

exports.mergeWithProps = mergeWithProps;
exports.classNameFromProps = classNameFromProps;
