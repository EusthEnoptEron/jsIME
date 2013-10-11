EventEmitter2 = require("eventemitter2").EventEmitter2
Composition = require "./composition.coffee"
_ = require "underscore"


FIRST_CHAR = '!'.charCodeAt(0)

class JsIME extends EventEmitter2 
	composition: null
	offset: 0
	constructor: (@store) ->

	# Interpret input before it is written
	preInterpret: (e) ->
		return true unless @composition?
		@composition.preInterpret(e)

	# Interpret input
	interpret: (e, index) ->
		if e.which > FIRST_CHAR and not @composition?
			@composition = new Composition(@store)
			@offset = index
			@bindComposition()

		if e.which > FIRST_CHAR and @composition?
			return @composition.interpret(e)
		else
			return true

	# Bind events of `composition` and proxy them.
	bindComposition: ->
		self = this
		@composition.on "text.select", (from, to) =>
			@emit "text.select", from + @offset, to + @offset

		@composition.on "text.replace", (from, to, text) =>
			@emit "text.replace", from + @offset, to + @offset, text

		# Forward event
		@composition.on "window.*", ->
			self.emit.apply self, [@event].concat _.values(arguments)

		@composition.on "done", =>
			@composition = null


module.exports = JsIME