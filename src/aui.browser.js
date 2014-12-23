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
		var query = function (Element) {
			if (Array.isArray(Element)) { return Element.map(query); }
			if (React.isValidElement(Element) && Element.props && Element.type !== NoAui) {
				var
					props = {
						className: Object.keys(Element.props)
							.filter(function (property) {
								return props[property] === true;
							}).join(' '),
					};
				if (Element.key) { props.key = Element.key; }
				if (Element.ref) { props.ref = Element.ref; }
				if (Element.props.children) { props.children = query(Element.props.children); }
				Element = cloneWithProps(Element, props);
				if (module.exports.withSemanticModules) {
					return module.exports.withSemanticModules(Element);
				}
			}
			return Element;
		}.bind(this);
		return query(this.props.children);
	}
});
var NoAui = React.createClass({
	render: function () {
		return this.props.children;
	}
});


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

module.exports = exports = Aui;
exports.Aui = Aui;
exports.NoAui = NoAui;
