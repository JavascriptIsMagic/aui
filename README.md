Aui = [![Semantic-UI](http://javascriptismagic.github.io/aui/logos/semantic.png) Semantic](http://semantic-ui.com/) + [![React](http://javascriptismagic.github.io/aui/logos/react.png) React](http://facebook.github.io/react/)
==========================

Aui is a small, lightweight glue library that integrates [Semantic](http://semantic-ui.com/) into [React](http://facebook.github.io/react/) as properties, which feels more natural.

[Aui is a tiny library, you can browse the docs/source code here!](http://javascriptismagic.github.io/aui/docs/aui.coffee.html)

Instead of many new React Components, all properties that === true are automatically translated into the className of each tag.
Semantic Modules and other semantic javascript can be called as it was intended, like semantic's dropdowns, form validation, and even api.

[JSFiddle around with the examples here!](http://javascriptismagic.github.io/aui/)

```js
// Set up Semantic's api module
// http://semantic-ui.com/behaviors/api.html
Aui.$.fn.api.settings.method = 'POST'
Aui.$.fn.api.settings.api = {
  login: '/echo/json/?delay=2'
}

var Example = React.createClass({
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

React.render(<Example />, document.getElementById('container'));

```

This will result in something like this after React's render on the dom:
```html
<body>
  <div class="ui container">
    <form class="ui segment form">
      <label class="ui top attached label"> login</label>
      <div class="field">
        <div class="ui icon input">
          <input type="text" name="username" placeholder="Username"/>
          <i class="user icon"/>
        </div>
      </div>
      <div class="field">
        <div class="ui icon input">
          <input type="password" name="password" placeholder="Password"/>
          <i class="privacy icon"/>
        </div>
      </div>
      <div class="field">
        <div class="ui checkbox">
          <label>Remember Me</label>
          <input type="checkbox" name="remember" />
        </div>
      </div>
      <div class="ui error message"></div>
      <div class="field">
        <div class="ui blue submit button">Login</div>
      </div>
    </form>
  </div>
</body>
```

Make sure to include react.js, jquery.js, semantic.js, and semantic.css on your page
```html
  <link href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.0.7/semantic.css" rel="stylesheet"></link>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.0.0-alpha1/jquery.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.0.7/semantic.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/react/0.13.3/react.js"></script>
  <script src="aui.js"></script>
```

Aui is also available on Bower!

You may also may wish to use Browserify or some other CommonJS style bundler:
```js
// If you wish to load Semantic, jQuery, and React from the window object:
var Aui = require('aui')

// If you wish to bundle Semantic, jQuery, and React
var Aui = require('aui/externals')
```

If you use coffee-script and wish to go native:
```coffee
Aui = require 'aui/.coffee'
# or
Aui = require 'aui/externals.coffee'
```

-------------------------------------------------
[Public Domain (Unlicense)](http://unlicense.org/)
