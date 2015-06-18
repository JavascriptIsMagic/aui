optional = require
$ = window.jQuery or require 'jquery'
React = window.React or require 'react'

## class <Aui/>
# Aui class is the main wrapper class
# it recursively goes through all it's children,
# finding props that === true or are on the Aui.modules list,
# and merges them into the className of each element.
Aui = React.createClass render: -> recursivelyClassifyProps React.Children.only @props.children
Aui.Aui = Aui

## string[] Aui.modules
# A whitelist of jQuery modules
# (also includes $.site.settings.modules from Semantic-UI if it exists)
# When a property is encountered on a ReactElement that matches this whitelist,
# the corisponding $.fn[modulename] will be called with the property's value.
# This is mostly intended for use with Semantic-UI's javascript,
# but in theory could be used to call any jQuery $.fn function
Aui.modules = $?.site?.settings?.modules or []

## mixin AuiMixin
# !EXPIRIMENTAL
# Automatically wraps your render function with an <Aui>tag</Aui>
Aui.AuiMixin =
  componentWillMount: ->
    render = @render
    @render = ->
      React.createElement Aui, render.apply @, arguments

## element Aui.classifyProps(ReactElement, {props})
# Same as React.cloneElement, but with the additional functionality of
# finding all the props that === true or are on the Aui.modules list,
# and merging them with the className prop.
# `Aui.classifyProps(<div ui segment />)`
# returns `<div ui segment className="ui segment" />`
classifyProps = Aui.classifyProps = (element, props = {}) ->
  classNames = {}
  for name in "#{element.props?.className or ''} #{props.className or ''}".split /\s+/g
    classNames[name] = yes if name
  for own name, include of element.props or {}
    if include is yes or name in Aui.modules
      classNames[name] = yes
  for own name, include of props
    if include is yes or name in Aui.modules
      classNames[name] = yes
  classNames = Object.keys classNames
  props.className = classNames.join ' ' if classNames.length
  React.cloneElement element, props

## element Aui.recursivelyClassifyProps(ReactElement)
# calls Aui.classifyProps for the ReactElement, and recusively for all it's children.
# `Aui.recursivelyClassifyProps(<div ui grid><div column>content</div></div>)`
# returns `<div ui grid className="ui grid"><div column className="column">content</div></div>`
recursivelyClassifyProps = Aui.recursivelyClassifyProps = (element) ->
  children = React.Children.map element?.props?.children, (child) ->
    recursivelyClassifyProps child
  classifyProps element, if children then {children} else {}

if module and require then module.exports = Aui else window.Aui = Aui
