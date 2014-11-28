const React = require('react');
require('insert-css')(require('./Master.styl'));

React.render((
		<div className="ui page grid">
			<a href="https://github.com/javascriptismagic/alicorns-aui" 
					style={{ position: 'fixed', right: '0rem', top: '0rem', padding: '0rem', }}>
				<img className="ui small image" src="logos/fork.png" />
			</a>
			<div className="row">
				<div className="column">
					<div className="column">
						<div className="ui three column grid">
							<div className="one row">
								<div className="ui basic segment">
									<br/><h1 className="ui header">Alicorns UI</h1>
								</div>
							</div>
							<div className="column">
								<a href="https://github.com/Semantic-Org/Semantic-UI/">
									<img className="ui small image" src="logos/semantic.png" />
								</a>
							</div>
							<div className="column">
								<a href="https://github.com/learnboost/stylus/">
									<img className="ui small image" src="logos/stylus.png" />
								</a>
							</div>
							<div className="column">
								<a href="https://github.com/facebook/react/">
									<img className="ui small image" src="logos/react.png" />
								</a>
							</div>
							<div className="column">
								<a href="https://github.com/baconjs/bacon.js/">
									<img className="ui small image" src="logos/bacon.png" />
								</a>
							</div>
							<div className="column">
								<a href="https://github.com/substack/node-browserify/">
									<img className="ui small image" src="logos/browserify.png" />
								</a>
							</div>
							<div className="column">
								<a href="https://github.com/gulpjs/gulp/">
									<img className="ui small image" src="logos/gulp.png" />
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	), document.body);
