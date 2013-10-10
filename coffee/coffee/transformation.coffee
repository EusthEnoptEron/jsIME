EventEmitter2 = require("eventemitter2").EventEmitter2

class Transformation extends EventEmitter2
	output: null
	constructor: (@composition, @start, @length, @active = false) ->
		@setRange(start, length)

	destroy: ->
		@composition = null

	setRange: (start, length) ->
		@start = Math.max(0, start)
		@length = Math.max(0, Math.min(@composition.input.length - start, length))
		@input = @composition.input.substr(@start, @length)

		@output = @input if not @output?

		@setOutput @input


	setOutput: (output) ->
		offset = @offset()
		@composition.replaceText( offset, offset + (@output).length, output )

		@composition.revertSelection() unless @active

		@output = output

		# Emit change(old, new, sender)
		# @emit "change.output", old, output, this

	offset: ->
		prev = @prev false
		if prev
			return prev.offset() + prev.length
		else
			return 0


	moveHead: (amount) ->
		return @composition.clean() if amount == 0
		prev = @prev()
		
		old = [@start, @length]
		@setRange @start + amount, @length - amount

		prev.moveTail( @start - (prev.start + prev.length) )


	moveTail: (amount) ->
		return @composition.clean() if amount == 0
		return if @length + amount == 0
		
		next = @next()

		old = [@start, @length]
		@setRange @start, @length + amount


		next.moveHead( (@start + @length ) - next.start)


	nextChoice: ->
		# TODO: implement
	prevChoice: ->
		# TODO: implement

	index: ->
		@composition.transformations.indexOf this	

	next: (force = true) ->
		obj = @composition.transformations[@index()+1]
		
		if obj? or not force
			return obj
		else
			@composition.transformations.push(
				tmp = new Transformation @composition, @start + @length, 0
			)
			return tmp

	prev: (force = true) ->
		obj = @composition.transformations[@index()-1]
		
		if obj? or not force
			return obj
		else
			@composition.transformations.unshift(
				tmp = new Transformation @composition, @start, 0
			)
			return tmp

	activate: ->
		if !@active
			for trans in @composition.transformations when trans.active
				trans.active = false
			@active = true

			# select this item
			offset = @offset()
			@composition.selectText( offset, offset + @output.length )


module.exports = Transformation