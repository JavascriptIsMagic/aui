\<Aui/\> = React + Semantic UI for Alicorns.
==========================================



WARNING: This branch is under construction!
Doing a rewrite for a version 1.x release.




Aui is a small glue component that integrates Semantic UI into React as properties, which feels more natural.

Instead of many new components, all properties that === true are automatically translated into the className of each tag.
Semantic Modules and other semantic javascript is automatically called on things that need it, like semantic's dropdowns, form validation, and even api.
(don't forget to include semantic.css on your page!)

[JSFiddle around with the examples here!](http://javascriptismagic.github.io/aui/)

```js
var
 React = require('react'),
 Aui = require('aui').Aui;

var LoginForm = React.createClass({
 submit: function (event) {
  console.log(event.data);
  alert(JSON.stringify(event.data, null, 4));
 },
 render: function () {
  return (
  <Aui>
   <form ui segment form={this.validation} onSubmit={this.submit}>
   <h1 ui header>{document.title} Login:</h1>
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
   <div ui error message/>
   <div ui right aligned basic segment>
    <div field>
     <div ui blue submit button>Login</div>
    </div>
   </div>
   </form>
  </Aui>
  );
 },
 validation: {
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
 }
});

React.render(
 <Aui>
  <div ui page grid>
   <div column>
    <LoginForm/>
   </div>
  </div>
 </Aui>,
 document.body);
```

This will result in something like this after render:
```html
<body>
 <div class="ui page grid">
  <div class="column">
   <form class="ui segment form">
     <h1 class="ui header">Login:</h1>
     <div class="field">
      <div class="ui icon input">
       <input type="text" name="username" placeholder="Username" />
       <i class="user icon" />
      </div>
     </div>
     <div class="field">
      <div class="ui icon input">
       <input type="password" name="password" placeholder="Password" />
       <i class="privacy icon" />
      </div>
     </div>
     <div class="ui error message"></div>
     <div class="ui right aligned basic segment">
      <div class="field">
       <div class="ui blue submit button">Login</div>
      </div>
     </div>
    </div>
   </form>
  </div>
 </div>
</body>
```

-------------------------------------------------
[Public Domain (Unlicense)](http://unlicense.org/)
