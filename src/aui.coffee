{React, jQuery} = window or global
unless React? then throw new Error "Aui: window.React not found."
unless jQuery? then console.warn "Aui: window.jQuery not found, Modules and Semantic-UI will be disabled."
unless jQuery?.site?.settings?.modules? then console.warn 'Aui: No Semantic-UI window.jQuery.site.settings.modules found, Semantic will be disabled.'

# [JSFiddle around with the examples here!](http://javascriptismagic.github.io/aui/)
## Aui.Mixin
# Aui.Mixin is the main wrapper around React Components
# it recursively goes through all it's children,
# finding props that === true or are on the `Aui.modules` list,
# and merges them into the className of each element.
AuiMixin =
  ## this.$('react ref')
  # jQuery wraps a React ref `<div ref="react ref" />` or jQuery selector `this.$('react ref')`.
  # This is the intended way to interact with jQuery to supply utility functionality.
  # **Warning!** Use this only in `componentDidMount` or event handlers!
  # Do NOT use jQuery to re-arange the dom or you will run into Invarient erros in React,
  # use React to arange your dom ahead of time as React is expecting.
  $: (ref) -> jQuery React.findDOMNode @refs[ref] or ref
  componentWillMount: ->
    render = @render
    @render = ->
      element = render?.apply? @, arguments
      if React.isValidElement element
        Aui.classify element
      else
        Aui.classify Aui.warning 'Aui.Mixin: Child is not a React.isValidElement', element

# (depricated) `<Aui/>` tag, use Aui.Mixin instead.
Aui = React.createClass
  mixins: [AuiMixin]
  render: ->
    Aui.warning '<Aui/> tag is depricated, use Aui.Mixin instead', @props.children
  componentDidMount: ->
    console.warn React.findDOMNode @
Aui.Mixin = Aui.AuiMixin = AuiMixin
Aui.Aui = Aui
## Aui.$
# The instance of jQuery Aui is using, if needed.
Aui.$ = jQuery

## Aui.classify(element)
# finds all the props that === true or are on the `Aui.modules` list,
# and merging them with the className prop.
# Use this inside the render function like a React helper function.
# Example: `Aui.classify(<div ui grid><div column>content</div></div>)`
# returns `<div ui grid className="ui grid"><div column className="column">content</div></div>`
Aui.classify = (element, options) ->
  options = AuiOptions options
  unless React.isValidElement element
    element = Aui.warning 'Aui.classify: element is not a React.isValidElement', element
  classify = (element) ->
    return element unless React.isValidElement element
    classNames = {}
    modules = null
    props = {}
    if element.props.className?
      for className in "#{element.props.className}".split /\s+/g
        classNames[className] = yes
    for own key, value of element.props
      classNames[key] = yes if value is yes
      if (not options.disableModules) and (Array.isArray value) and (key in Aui.modules)
        classNames[key] = yes
        modules or= {}
        modules[key] = value
      props[key] = value
    props.className = Object.keys(classNames).join ' '
    unless props.className.length
      delete props.className
    element = React.cloneElement element, props, if options.ignoreChildren then element.props.children else React.Children.map element.props.children, classify
    if modules
      React.createElement Aui.Module, { modules, options }, element
    else element
  classify element

## Aui.warning('string', element)
# console.warn a warning message inside a ReactElement durring a React Component's render function.
# returns the element wrapped in a warning span.
# Use inside the render function of a React Component
Aui.warning = (message, element) ->
  console.warn message, element
  React.DOM.span { 'data-warning': message }, element

Aui.settings =
  ## Aui.settings.disableModules
  # disables jQuery based Aui.modules from calling
  disableModules: not jQuery?
  ## Aui.settings.ignoreChildren
  # disables recursively calling `Aui.classify` to `props.children`.
  ignoreChildren: no

# (internal) AuiOptions defaults options for `Aui.classify`
class AuiOptions
  constructor: (options) ->
    if options instanceof AuiOptions
      return options
    unless @ instanceof AuiOptions
      return new AuiOptions options
    options or= {}
    for own key, value of Aui.settings
      @[key] = if options[key]? then options[key] else value

## Aui.modules
# A whitelist of jQuery modules.
# `Aui.modules.push('widget')` to configure Aui to support `$.fn.widget`.
# By default this includes `window.jQuery.site.settings.modules` from Semantic-UI.
# When a property is encountered on a ReactElement that matches this whitelist and is an Array,
# the corisponding `window.jQuery.fn[modulename]` will be called with the property's array value.
# This is mostly intended for use with Semantic-UI's javascript,
# but in theory could be used to call any `$.fn` function.
Aui.modules = (jQuery?.site?.settings?.modules or []).slice()

# internal global cache of options passed to module functions.
cache = {}

# (internal) `<Aui.Module/>`
# This class provides support for `Aui.modules` internally and generally is not used directly.
# `<Aui.Module/>` handles calling jQuery.fn[module] calls when used inside a React Component's render.
# `<div ui checkbox={[]}/>` will automatically call `$.fn.checkbox()`, and
# `<form ui form={[{...}]}></form>` will automatically call `$.fn.form({...})`
Aui.Module = React.createClass
  render: -> React.Children.only @props.children
  componentDidMount: ->
    @callModules @props.children.props
  componentWillReceiveProps: (props) ->
    @callModules props.children.props
  callModules: (props) ->
    $element = jQuery React.findDOMNode @
    @id = $element.attr 'data-reactid'
    cache[@id] or= {}
    for own module, options of @props.modules
      stringifiedOptions = JSON.stringify options
      if cache[@id][module] isnt stringifiedOptions
        cache[@id][module] = stringifiedOptions
        $element[module]? @props.children.props[module]...
    return
  componentWillUnmount: ->
    delete cache[@id]

window?.Aui = Aui
module?.exports = Aui
