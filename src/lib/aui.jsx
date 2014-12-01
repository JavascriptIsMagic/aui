const
	React = require('react/addons');

export const applyClassNamesRecursively = function (Parent) {
	if (Array.isArray(Parent))
		return Parent.map(applyClassNamesRecursively);
	if (typeof Parent === 'object') {
		return (React.addons.cloneWithProps(Parent, {
			className:
				(Object.keys((Parent.props.className ?
					Parent.props.className.split(' ') :
					[]).
						concat(Object.keys(Parent.props)).
							filter(key => Parent.props[key] === true).
							reduce((names, name) => {
								names[name] = true;
								return names;
							}, {})).
							join(' ')),
			children:
				applyClassNamesRecursively(Parent.props.children)
		}));
	}
	return Parent;
}

export const Aui = React.createClass({
	render() {
		return (applyClassNamesRecursively(this.props.children) || (<div/>));
	}
});