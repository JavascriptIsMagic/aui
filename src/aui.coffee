{React, jQuery} = global or window
unless React? then throw new Error "window.React not found."
unless jQuery? then throw new Error "window.jQuery not found."
unless jQuery?.site?.settings?.modules? then console.warn 'No Semantic-UI window.jQuery.site.settings.modules found.'

## class <Aui/>
# Aui class is the main wrapper class
# it recursively goes through all it's children,
# finding props that === true or are on the `Aui.modules` list,
# and merges them into the className of each element.
Aui = React.createClass
  render: -> Aui.classify (React.Children.only @props.children), @props
Aui.Aui = Aui

## mixin AuiMixin
# !EXPIRIMENTAL
# Automatically wraps your render function with an <Aui>tag</Aui>
Aui.AuiMixin =
  componentWillMount: ->
    render = @render
    @render = ->
      React.createElement Aui, render.apply @, arguments

## element `Aui.classify(ReactElement, {...props}, { boolean modules })`
# finds all the props that === true or are on the `Aui.modules` list,
# and merging them with the className prop.
# `Aui.classify(<div ui grid><div column>content</div></div>)`
# returns `<div ui grid className="ui grid"><div column className="column">content</div></div>`
Aui.classify = (children, options = { modules: yes, recursive: yes }) ->
  React.Children.map children, (element) ->
    return element if element.type is Aui
    props = {}
    isModule = no
    classNames = {}
    for name in "#{element.props?.className or ''}".split /\s+/g
      classNames[name] = yes if name
    for own name, include of element.props or {}
      if jQuery and options.modules and (Array.isArray include) and name in Aui.modules
        isModule = classNames[name] = yes
      else if include is yes
        classNames[name] = yes
    classNames = Object.keys classNames
    if options.recursive and element.props?.children?
      props.children = Aui.classify element.props.children, options
    if classNames.length
      props.className = classNames.join ' '
      if isModule
        return React.createElement Aui.Module, React.cloneElement element, props
    React.cloneElement element, props

## string[] `Aui.modules`
# A whitelist of jQuery modules
# (also includes `window.jQuery.site.settings.modules` from Semantic-UI if it exists)
# When a property is encountered on a ReactElement that matches this whitelist,
# the corisponding `window.jQuery.fn[modulename]` will be called with the property's value.
# This is mostly intended for use with Semantic-UI's javascript,
# but in theory could be used to call any `window.jQuery.fn` function
Aui.modules = jQuery?.site?.settings?.modules or []

## class <Aui.Module/>
Aui.Module = React.createClass
  render: -> React.Children.only @props.children
  componentDidMount: -> @callModules @props.children.props
  componentWillReceiveProps: (props) -> @callModules props.children.props
  callModules: (props) ->
    console.log $element[0]
    for module, args of props
      if (Array.isArray args) and (typeof jQuery.fn[module] is 'function') and (module in Aui.module)
        $element = jQuery React.findDOMNode @
        console.log $element[0]
        ($element)[module] args...
    return

window?.Aui = Aui
module?.exports = Aui
