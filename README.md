Aui
====

Aui is React + Semantic UI for Alicorns

This is in early stages of development and is really little more then a starting point for working with React + Semantic UI.

```js
const React = require('React'),
	Aui = require('aui').Aui;

export const Login = React.createClass({
	render() {
		return (
			<Aui>
				<form ui form>
					<div ui large fluid icon input>
						<input type="text" name="username" placeholder="username..." />
						<i ui large user icon />
					</div>
					<div ui large fluid icon input>
						<input type="password"	name="password" placeholder="password..." />
						<i ui large privacy icon />
					</div>
					<div ui large white fluid button> Login </div>
				</form>
			</Aui>
		);
	}
});

React.render(
	<Aui>
		<div ui page grid>
			<div column>
				<Login/>
			</div>
		</div>
	</Aui>,
	document.body);
```

[Public Domain (Unlicense)](http://unlicense.org/)