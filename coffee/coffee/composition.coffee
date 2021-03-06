TransformableText = require "./transformabletext.coffee"
Writing = require "./writing.coffee"
_ = require "underscore"

Mode = 
	Composing: 1
	Selecting: 2

Key =
	Left: 37
	Up: 38
	Right: 39
	Down: 40
	Enter: 13
	Backspace: 8
	Space: 32
	Tab: 9
	Shift: 16



class Composition extends TransformableText
	mode: Mode.Composing
	
	writings: []
	windowShown: false

	constructor: (@store) ->
	activeWriting: ->
		for writing in @writings
			return writing if writing.active
	clean: ->
		for writing, i in @writings when writing.length == 0
			writing.destroy()
			@writings[i] = null

		@writings = _.compact @writings
	showWindow: (choices) ->
		@emit "window.show", choices
		@windowShown = true

	selectEntry: (index) ->
		@emit "window.select", index if @windowShown

	hideWindow: ->
		@emit "window.hide" if @windowShown
		@windowShown = false

	removeLetter: (direction = -1) ->
		aborted = (@selectionStart + direction) < 0
		@replaceText(@selectionStart + direction, @selectionEnd, "", true)

		@finalize() if aborted

	preInterpret: (e) ->
		# Zero tolerance while we're composing a text.
		return false if e.ctrlKey

		if @mode == Mode.Composing
			switch e.which
				when Key.Left then @moveCursor -1
				when Key.Right then @moveCursor +1
				when Key.Enter then @finalize()
				when Key.Backspace then @removeLetter -1
				when Key.Space then @setMode(Mode.Selecting)
				when Key.Down, Key.Up
					return false
				else
					return true

		else if @mode == Mode.Selecting
			switch e.which
				when Key.Left
					if e.shiftKey
						@activeWriting()?.moveTail(-1)
					else
						@activeWriting()?.prev(false)?.activate()
				when Key.Right
					if e.shiftKey
						@activeWriting()?.moveTail(+1)
					else
						@activeWriting()?.next(false)?.activate()
				when Key.Enter then @finalize()
				when Key.Down, Key.Space then @activeWriting()?.nextChoice()
				when Key.Up then @activeWriting()?.prevChoice()
				when Key.Backspace
					@setMode Mode.Composing
				when Key.Shift then return false
				else
					@finalize()
					return true

		return false

						

	interpret: (e) ->
		return false if @mode == Mode.Selecting

		@add String.fromCharCode(e.which)

		return false
	finalize: ->
		@hideWindow()
		@selectText @preview.length, @preview.length
		@emit "done"

	setMode: (mode) ->
		if mode == @mode then return false

		if mode == Mode.Composing
			@hideWindow()

			# Clear writings
			@writings.shift().destroy() until !@writings.length

			# Set text & cursor correctly
			@replaceText 0, @preview.length, @input
			@selectText @input.length, @input.length

			@mode = mode

		if mode == Mode.Selecting
			@convertAll()
			@writings = [ new Writing this, 0, @input.length, true ]

			@mode = mode



module.exports = Composition