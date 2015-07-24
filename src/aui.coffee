{React, jQuery} = global or window
unless React? then throw new Error "Aui: window.React not found."
unless jQuery? then console.warn "Aui: window.jQuery not found, Modules and Semantic-UI will be disabled."
unless jQuery?.site?.settings?.modules? then console.warn 'Aui: No Semantic-UI window.jQuery.site.settings.modules found, Semantic will be disabled.'

## mixin AuiMixin
# !EXPIRIMENTAL
# Automatically wraps your render function with an <Aui>tag</Aui> with default props
AuiMixin =
  componentWillMount: ->
    render = @render
    @render = ->
      console.log 'Aui.Mixin'
      element = Aui.classify (render?.apply? @, arguments), @props
      unless React.isValidElement element
        console.error 'Aui: Child is not a valid Element:', element
        return React.DOM.span null, element
      element

## class <Aui/>
# Aui class is the main wrapper class
# it recursively goes through all it's children,
# finding props that === true or are on the `Aui.modules` list,
# and merges them into the className of each element.
Aui = React.createClass
  mixins: [AuiMixin]
  render: -> @props.children
Aui.Aui = Aui
Aui.Mixin = Aui.AuiMixin = AuiMixin

## object Aui.defaults
# The default options Aui uses when no options or props are passed in.
Aui.defaults =
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
    for own key, value of Aui.defaults
      @[key] = if options[key]? then options[key] else value

## element `Aui.classify(ReactElement, {...props}, { boolean modules })`
# finds all the props that === true or are on the `Aui.modules` list,
# and merging them with the className prop.
# `Aui.classify(<div ui grid><div column>content</div></div>)`
# returns `<div ui grid className="ui grid"><div column className="column">content</div></div>`
Aui.classify = (parent, options) ->
  options = AuiOptions options
  classify = (element) ->
    return element unless React.isValidElement element
    classNames = {}
    modules = null
    props = {}
    if element.props.className?
      for className in "#{element.props.className}".split ' '
        classNames[key] = yes
    for own key, value of element.props
      classNames[key] = yes if value is yes
      if (not options.disableModules) and (Array.isArray value) and (key in Aui.modules)
        unless modules then modules = []
        classNames[key] = true
        modules.push key
      props[key] = value
    props.className = Object.keys(classNames).join ' '
    unless props.className.length
      delete props.className
    console.log modules, (if typeof element.type is 'string' then element.type else 'Component'), props.className or ''
    element = React.cloneElement element, props, if options.ignoreChildren then element.props.children else React.Children.map element.props.children, classify
    if modules
      React.createElement Aui.Module, { modules }, element
    else element
  classify parent

## string[] `Aui.modules`
# A whitelist of jQuery modules
# (also includes `window.jQuery.site.settings.modules` from Semantic-UI if it exists)
# When a property is encountered on a ReactElement that matches this whitelist,
# the corisponding `window.jQuery.fn[modulename]` will be called with the property's value.
# This is mostly intended for use with Semantic-UI's javascript,
# but in theory could be used to call any `window.jQuery.fn` function
Aui.modules = (jQuery?.site?.settings?.modules or []).slice()

## internal class <Aui.Module/>
# This class provides support for `Aui.modules` and handles calling jQuery.fn[module] calls
Aui.Module = React.createClass
  render: -> React.Children.only @props.children
  componentDidMount: -> @callModules @props.children.props
  componentWillReceiveProps: (props) -> @callModules props.children.props
  callModules: (props) ->
    for own module, args of props
      if (Array.isArray args) and (typeof jQuery.fn[module] is 'function') and (module in Aui.module)
        $element = jQuery React.findDOMNode @
        console.log $element[0]
        ($element)[module] args...
    return

window?.Aui = Aui
module?.exports = Aui
