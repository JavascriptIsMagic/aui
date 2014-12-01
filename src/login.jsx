const React = require('React'),
	Aui = require('./lib/aui.bundle.jsx').Aui;

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
