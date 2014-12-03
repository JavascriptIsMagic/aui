'use strict';
var
	React = require('react/addons'),
	cloneWithProps = React.addons.cloneWithProps;

function cloneWithPropsPreserveKeyRef(Element, props) {
	if (Element.key) { props.key = Element.key; }
	if (Element.ref) { props.ref = Element.ref; }
	return cloneWithProps(Element, props);
}

function applyPropsToClassNameReacursively(Element) {
	if (Array.isArray(Element)) { return Element.map(applyPropsToClassNameReacursively); }
	if (React.isValidElement(Element)) {
		return cloneWithPropsPreserveKeyRef(Element, {
			className: Object.keys(Element.props).filter(function (property) { return Element.props[property] === true; }).join(' '),
			children: applyPropsToClassNameReacursively(Element.props.children),
		});
	}
	return Element;
};

var Aui = React.createClass({
	render: function () {
		return applyPropsToClassNameReacursively(this.props.children);
	}
});
exports.Aui = Aui;
