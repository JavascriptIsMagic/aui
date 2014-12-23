<Aui/> = React + Semantic UI for Alicorns.
==========================================

Aui is a small glue component that intigrates Semantic UI into React as properties, which feels more natural.

Instead of many new components, all properties that === true are automatically translated into the className of each tag.
Semantic Module and other semantic javascript is automatically called on things that need it, like dropdown and even api.
(don't forget to include semantic.css on your page!)

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

The dom should turn out something like this after render:

```html
<body>
	<div class="ui page grid">
		<div class="column">
			<form class="ui form">
				<div class="ui large fluid icon input">
					<input type="text" name="username" placeholder="username..."></input>
					<i class="ui large user icon"></i>
				</div>
				<div class="ui large fluid icon input">
					<input type="password"	name="password" placeholder="password..."></input>
					<i class="ui large privacy icon"></i>
				</div>
				<div class="ui large white fluid button"> Login </div>
			</form>
		</div>
	</div>
</body>
```

-------------------------------------------------
[Public Domain (Unlicense)](http://unlicense.org/)
