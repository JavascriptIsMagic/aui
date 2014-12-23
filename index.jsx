var
	React = window.React,
	Aui = window.Aui;

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
		return (
			<Aui>
				<div ui basic segment>
					<div ui divider/>
					<h1 ui dividing header>
						<a href="https://github.com/javascriptismagic/aui">&lt;Aui/&gt;</a> Examples
					</h1>
					<div ui items>
						<Example title="Simple Login Screen" fiddle="9tcqoyme/5" />
						<Example title="Form Validation" fiddle="9jz1zkjy/1" />
					</div>
				</div>
			</Aui>
		);
	}
});

React.render((
	<Aui>
		<div ui page grid>
			<div column>
				<Page/>
			</div>
		</div>
	</Aui>
), document.body);
