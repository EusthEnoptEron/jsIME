EventEmitter2 = require("eventemitter2").EventEmitter2;

class Transformation extends EventEmitter2
	constructor: (@composition, start, length) ->
		@setRange(start, length)

	setRange: (start, length) ->
		@start = max(0, start)
		@length = min(@composition.input.length - start, length)

		@input = @composition.input.substr(@start, @length)
		@setOutput @input

	setOutput: (output) ->
		old = @output
		@output = output

		# Emit change(old, new, sender)
		@emit "change.output", old, output, this

	moveHead: (amount) ->
		return if amount == 0
		
		old = [@start, @length]
		@setRange @start + amount, @length - amount

		prev = @prev()
		prev.moveTail( @start - 1 - (prev.start + prev.length) )


	moveTail: (amount) ->
		return if amount == 0

		old = [@start, @length]
		@setRange @start, @length + amount

		next = @next()
		next.moveHead( (@start + @length + 1) - next.start)


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
				new Transformation @composition, @start + @length + 1, 0
			)

	prev: (force = true) ->
		obj = @composition.transformations[@index()-1]
		
		if obj? or not force
			return obj
		else
			@composition.transformations.unshift(
				new Transformation @composition, @start + @length + 1, 0
			)

module.exports Transformation