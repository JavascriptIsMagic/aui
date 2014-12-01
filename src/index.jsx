const
	React = require('react'),
	Aui = require('./lib/aui.bundle.jsx').Aui,
	Login = require('./login.jsx').Login;
require('insert-css')(require('./index.styl'));

export const Index = React.createClass({
	render() {
		return (
			<Aui>
				<div ui page grid>
					<div ui row>
						<div ui column>
							<a href="https://github.com/javascriptismagic/alicorns-ui">
								<img ui small image src="logos/fork.png"  
									style={{ position: 'fixed', right: '0rem', top: '0rem', padding: '0rem', }} />
								<div ui hidden divider />
								<h1 ui header>
									Alicorns UI
								</h1>
							</a>
							<Login />
							<div ui divider />
							<div ui column>
								<div ui doubling three column grid>
									<div ui column>
										<a href="https://github.com/semantic-org/semantic-ui/">
											<img ui small image src="logos/semantic.png" />
										</a>
									</div>
									<div ui column>
										<a href="https://github.com/learnboost/stylus/">
											<img ui small image src="logos/stylus.png" />
										</a>
									</div>
									<div ui column>
										<a href="https://github.com/facebook/react/">
											<img ui small image src="logos/react.png" />
										</a>
									</div>
									<div ui column>
										<a href="https://github.com/baconjs/bacon.js/">
											<img ui small image src="logos/bacon.png" />
										</a>
									</div>
									<div ui column>
										<a href="https://github.com/substack/node-browserify/">
											<img ui small image src="logos/browserify.png" />
										</a>
									</div>
									<div ui column>
										<a href="https://github.com/gulpjs/gulp/">
											<img ui small image src="logos/gulp.png" />
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Aui>
		);
	}
});
