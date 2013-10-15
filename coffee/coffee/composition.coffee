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

	constructor: (@store) ->
	activeWriting: ->
		for writing in @writings
			return writing if writing.active
	clean: ->
		for writing, i in @writings when writing.length == 0
			writing.destroy()
			@writings[i] = null

		@writings = _.compact @writings
	showWindow: (choices, index) ->
		@emit "window.show", choices
		@emit "window.select", index

	hideWindow: ->
		@emit "window.hide"

	preInterpret: (e) ->
		if @mode == Mode.Composing
			switch e.which
				when Key.Left then @moveCursor -1
				when Key.Right then @moveCursor +1
				when Key.Enter then @finalize()
				when Key.Backspace then @replaceText(@selectionStart - 1, @selectionEnd, "", true)
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
			@convertText()
			@writings = [ new Writing this, 0, @input.length, true ]

			@mode = mode



module.exports = Composition