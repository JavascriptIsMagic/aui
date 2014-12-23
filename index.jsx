var
	React = window.React,
	Aui = window.Aui;

var Page = React.createClass({
	render: function () {
		return (
			<Aui>
				<div ui basic segment>
					<h1 ui dividing header>Examples</h1>
					<div ui items>
						<div ui item>
							<a ui header href="http://jsfiddle.net/reactjs/69z2wepo/">
								React's Hello World
							</a>
							<div ui description>
								<iframe width="100%" height="300" src="http://jsfiddle.net/reactjs/69z2wepo/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
							</div>
						</div>
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