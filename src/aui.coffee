optional = require
React = window.React or optional 'react'
$ = window.jQuery or optional 'jquery'


Aui = React.createClass
  render: ->
    recursivelyClassifyProps @props.children
Aui.Aui = Aui
Aui.modules = $.site?.settings?.modules or []

classifyProps = Aui.classifyProps = (element, props = {}) ->
  classNames = {}
  for name in "#{element.props?.className or ''} #{props.className or ''}".split /\s+/g
    classNames[name] = yes if name
  for own name, include of element.props
    if include is yes or name in Aui.modules
      classNames[name] = yes
  props.className = classNames.join ' ' if classNames.length
  React.cloneElement element, props

recursivelyClassifyProps = Aui.recursivelyClassifyProps = (element, props = {}) ->
  children = React.Children.map if props.children or element.props?.children or null, (child) ->
    recursivelyClassifyProps child
  props.children = children if children.length
  classifyProps element, props

if module and require then module.exports = Aui else window.Aui = Aui
