
// # Examples
var Example, examples = {}
// React.render(<Example />, document.getElementById('container'));

// Aui's Semantic Syntax

// Set up Semantic's api module
// http://semantic-ui.com/behaviors/api.html
Aui.$.fn.api.settings.method = 'POST'
Aui.$.fn.api.settings.api = {
  login: 'package.json'
  //login: '/echo/json/?delay=2'
}

examples['dp9reqnz'] = React.createClass({
  mixins: [Aui.Mixin],
  getInitialState: function () {
    return {
      data: {}
    }
  },
  render: function () {
    return (
      <div ui container>
        <form ref="login form" ui segment form>
          <label ui top attached label>{location.origin} login</label>
          <div field>
            <div ui icon input>
              <input type="text" name="username" placeholder="Username"/>
              <i user icon/>
            </div>
          </div>
          <div field>
            <div ui icon input>
              <input type="password" name="password" placeholder="Password"/>
              <i privacy icon/>
            </div>
          </div>
          <div field>
            {/* checkbox={[]} will call $.fn.checkbox() */}
            <div ui checkbox={[]}>
              <label>Remember Me</label>
              <input type="checkbox" name="remember" />
            </div>
          </div>
          <div ui error message></div>
          <div field>
            <div ui blue submit button>Login</div>
          </div>
        </form>
      </div>
    )
  },
  onSubmit: function (event) {
    event.preventDefault()
    this.setState({
      data: this.$(event.target)
        .form('get values')
    })
  },
  beforeSend: function (settings) {
    // Merge with other React state as desired:
    settings.data = this.state.data
    return settings
  },
  onLoggedIn: function (data) {
    alert(this.state.data.username + " is logged in!")
  },
  componentDidMount: function () {
    // jQuery wrap by React ref:
    var $form = this.$("login form")
      // http://semantic-ui.com/behaviors/form.html
      .form({
        on: "change",
        inline: true,
        onSuccess: this.onSubmit,
        fields: {
          username: {
            identifier: "username",
            rules: [
              { type: "email", prompt: "Demo Username must be a valid email address (do not submit your real email)" }
            ]
          },
          password: {
            identifier: "password",
            rules: [
              { type: "minLength[3]", prompt: "Demo Password must be 3 or more characters long (do not use a real password)" }
            ]
          }
        }
      })
      // http://semantic-ui.com/behaviors/api.html
      .api({
        action: 'login',
        beforeSend: this.beforeSend,
        onSuccess: this.onLoggedIn,
        onError: function (error) {
          $form.form('add errors', [error])
        }
      })
  }
})

// Examples Page:
$.fn.embed.settings.sources.fiddle = {
  name   : "fiddle",
  icon   : "jsfiddle",
  domain : "jsfiddle.net",
  url    : "http://jsfiddle.net/{id}/embedded/"
}

var Example = React.createClass({
  mixins: [Aui.Mixin],
  render: function () {
    var RenderExample = examples[this.props.id]
    return (
      <div>
        <h5 header>{this.props.title}</h5>
        <a ui text target="_blank" href={this.props.link}> {this.props.link}</a>
        <br/><br/>
        <div ref="fiddle"></div>
        <RenderExample />
        <div ui divider></div>
      </div>
    )
  },
  componentDidMount: function () {
    this.$('fiddle')
      .embed({
        id: this.props.id,
        source: 'fiddle'
      })
  }
})

var Page = React.createClass({
  mixins: [Aui.Mixin],
  render: function () {
    return (
      <div ui container>
        <br/> <h1 header>Aui 2.x - Examples</h1>
        <div ui divider></div>
        <Example id="dp9reqnz" title="Semantic Form Example:" link="http://semantic-ui.com/introduction/getting-started.html"></Example>
      </div>
    )
  }
})

React.render(<Page/>, document.body)
document.title = "Aui 2.x - Examples"
