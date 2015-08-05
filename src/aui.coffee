{React, jQuery} = window or global
unless React? then throw new Error "Aui: window.React not found."
unless jQuery? then console.warn "Aui: window.jQuery not found, Modules and Semantic-UI will be disabled."
unless jQuery?.site?.settings?.modules? then console.warn 'Aui: No Semantic-UI window.jQuery.site.settings.modules found, Semantic will be disabled.'


## mixin Aui.Mixin
# Aui.Mixin is the main wrapper around React Components
# it recursively goes through all it's children,
# finding props that === true or are on the `Aui.modules` list,
# and merges them into the className of each element.
AuiMixin =
  $: (ref) -> jQuery React.findDOMNode @refs[ref] or ref
  componentWillMount: ->
    render = @render
    @render = ->
      element = render?.apply? @, arguments
      if React.isValidElement element
        Aui.classify element
      else
        Aui.classify Aui.warning 'Aui.Mixin: Child is not a React.isValidElement', element

## (depricated) class <Aui/>
# A tag that applies the Aui.Mixin
# Using the Aui.Mixin in your Component is prefered over <Aui/> tag.
Aui = React.createClass
  mixins: [AuiMixin]
  render: ->
    Aui.warning '<Aui/> tag is depricated, use Aui.Mixin instead', @props.children
  componentDidMount: ->
    console.warn React.findDOMNode @
Aui.Mixin = Aui.AuiMixin = AuiMixin
Aui.Aui = Aui
Aui.$ = jQuery

## function Aui.warning (string, element)
# console.warn a warning message
# returns the element wrapped in a warning span
Aui.warning = (message, element) ->
  console.warn message, element
  React.DOM.span { 'data-warning': message }, element

## object Aui.settings
# The default options Aui uses when no options or props are passed in.
Aui.settings =
  # disables jQuery based Aui.modules from calling
  disableModules: not jQuery?
  # disables Semantic-UI specific features
  disableSemantic: not jQuery?.site?.settings?.modules?
  # do not recursively Aui.classify children by default.
  ignoreChildren: no

## internal class `AuiOptions({options})`
# defaults all Aui options
class AuiOptions
  constructor: (options) ->
    if options instanceof AuiOptions
      return options
    unless @ instanceof AuiOptions
      return new AuiOptions options
    options or= {}
    for own key, value of Aui.settings
      @[key] = if options[key]? then options[key] else value

## element `Aui.classify(element, {options})`
# finds all the props that === true or are on the `Aui.modules` list,
# and merging them with the className prop.
# `Aui.classify(<div ui grid><div column>content</div></div>)`
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
        classNames[key] = yes
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
    #console.log modules, (if typeof element.type is 'string' then element.type else 'Component'), props.className or ''
    element = React.cloneElement element, props, if options.ignoreChildren then element.props.children else React.Children.map element.props.children, classify
    if modules
      React.createElement Aui.Module, { modules, options }, element
    else element
  classify element

## string[] `Aui.modules`
# A whitelist of jQuery modules
# (also includes `window.jQuery.site.settings.modules` from Semantic-UI if it exists)
# When a property is encountered on a ReactElement that matches this whitelist,
# the corisponding `window.jQuery.fn[modulename]` will be called with the property's value.
# This is mostly intended for use with Semantic-UI's javascript,
# but in theory could be used to call any `window.jQuery.fn` function
Aui.modules = (jQuery?.site?.settings?.modules or []).slice()

## internal global cache of options passed to module functions.
cache = {}

## internal class <Aui.Module/>
# This class provides support for `Aui.modules` and handles calling jQuery.fn[module] calls
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
