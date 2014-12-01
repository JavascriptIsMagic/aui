const
	React = require('react/addons');

export const applyClassNamesRecursively = function (Component) {
	if (Array.isArray(Component))
		return Component.map(applyClassNamesRecursively);
	if (Component && Component.props) {
		return (React.addons.cloneWithProps(Component, {
			key: Component.key,
			ref: Component.ref,
			className:
				(Object.keys(Component.props).
					filter(key =>
						Component.props[key] === true).
					reduce((names, name) => {
						names[name] = true;
						return names;
					}, {})).join(' ')),
			children:
				applyClassNamesRecursively(Component.props.children)
		}));
	}
	return Component;
}

export const Aui = React.createClass({
	render() {
		return (applyClassNamesRecursively(this.props.children) || (<div/>));
	}
});