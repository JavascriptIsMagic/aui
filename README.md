\<Aui/\> = React + Semantic UI for Alicorns.
==========================================

Aui is a small glue component that integrates Semantic UI into React as properties, which feels more natural.

Instead of many new components, all properties that === true are automatically translated into the className of each tag.
Semantic Modules and other semantic javascript is automatically called on things that need it, like semantic's dropdowns, form validation, and even api.
(don't forget to include semantic.css on your page!)

[JSFiddle around with the examples here!](http://javascriptismagic.github.io/aui/)

```js
var
  React = require('react'),
  Aui = require('aui').Aui;

var Login = React.createClass({
  getInitialState() {
    return {
      username: '',
      password: ''
    }
  },
  input(event) {
    var state = {};
    state[event.target.name] = event.target.value;
    this.setState(state);
  },
  submit(event) {
    console.log(event, this.state);
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
    }];
    return (
      <Aui>
        <form ui segment form={validation} onSubmit={this.submit}>
          <div tree fields>
            <div field>
              <div ui icon input>
                <input placeholder="Username" name="username" type="text" onInput={this.input}/>
                <i user icon/>
              </div>
            </div>
            <div field>
              <div ui icon input>
                <input placeholder="Password" type="password" name="password" onInput={this.input}/>
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
      <form class="ui segment form">
        <div class="tree fields">
          <div class="field">
            <div class="ui icon input">
              <input placeholder="Username" name="username" type="text" />
              <i class="user icon" />
            </div>
          </div>
          <div class="field">
            <div class="ui icon input">
              <input placeholder="Password" type="password" name="password" />
              <i class="privacy icon" />
            </div>
          </div>
          <div class="field">
            <div class="ui blue submit button">Login</div>
          </div>
        </div>
      </form>
    </div>
  </div>
</body>
```

-------------------------------------------------
[Public Domain (Unlicense)](http://unlicense.org/)
