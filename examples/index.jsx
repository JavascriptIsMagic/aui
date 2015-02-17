var
	React = window.React,
	Aui = window.Aui;
	examples = window.examples = [];

var Example = React.createClass({
	render: function () {
		return (
			<Aui>
				<div ui item>
					<div ui segment>
						<a ui header href={"http://jsfiddle.net/" + this.props.fiddle + "/"}>{this.props.title}</a>
						<div ui description>
							<p multiline>{this.props.children}</p>
							<p><iframe width="100%" height="300" src={"http://jsfiddle.net/" + this.props.fiddle + "/embedded/"} allowfullscreen="allowfullscreen" frameborder="0"></iframe></p>
						</div>
					</div>
				</div>
			</Aui>
		);
	}
});

var Page = React.createClass({
	render: function () {
		document.title = '<Aui/> Examples';
		return (
			<Aui>
				<div ui basic segment>
					<h1 ui dividing huge header><a href="https://github.com/javascriptismagic/aui">{"<Aui/>"}</a> Examples</h1>
					<div ui items>
						<Example title="Hello <Aui/>" fiddle="javascriptismagic/ny1k5Ljj" />
						<Example title="Simple Login Form" fiddle="javascriptismagic/7q93rw3c" />
					</div>
				</div>
			</Aui>
		);
	}
});

setTimeout(function () {
	React.render((
		<Aui>
			<div ui page grid>
				<div column>
					<Page/>
				</div>
			</div>
		</Aui>
	), document.body);
}());
