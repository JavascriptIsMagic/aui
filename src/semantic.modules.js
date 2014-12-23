var
	$ = global.jQuery;
require('semantic-ui\dist\semantic');
var Semantic = React.createClass({
	render: function () {
		var Element = this.props.children;
		
		return Element;
	}
});
module.exports = Semantic;