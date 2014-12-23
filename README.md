\<Aui/\> = React + Semantic UI for Alicorns.
==========================================

Aui is a small glue component that integrates Semantic UI into React as properties, which feels more natural.

Instead of many new components, all properties that === true are automatically translated into the className of each tag.
Semantic Modules and other semantic javascript is automatically called on things that need it, like semantic's dropdowns, form validation, and even api.
(don't forget to include semantic.css on your page!)

```js
var
	React = require('react'),
	Aui = require('aui').Aui;

var Login = React.createClass({
	events(event) {
		console.log(event);
		event.stopPropagation();
		event.preventDefault();
	},
	render() {
		var validation = [{
			username: {
				identifier: 'username',
				rules: [
					{ type: 'empty', prompt: 'Please enter a username' }
				]
			},
			password: {
				identifier: 'password',
				rules: [
					{ type: 'empty', prompt: 'Please enter a password' },
					{ type: 'length[6]', prompt: 'Your password must be at least 6 characters' }
				]
			}
		}, { onSuccess: this.events }];
		return (
			<Aui>
				<form ui segment form={validation}>
					<div tree fields>
						<div field>
							<div ui icon input>
								<input placeholder="Username" name="username" type="text"/>
								<i user icon/>
							</div>
						</div>
						<div field>
							<div ui icon input>
								<input placeholder="Password" type="password" name="password"/>
								<i privacy icon/>
							</div>
						</div>
						<div field>
							<div ui blue submit button>Login</div>
						</div>
					</div>
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
