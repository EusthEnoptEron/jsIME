TransformableText = require "./transformabletext"

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
	@mode = Mode.Composing
	
	@transformations = []
	@activeTransformation = null

	preInterpret: (e) ->
		if @mode == Mode.Composing
			switch e.which
				when Key.Left then @moveCursor -1
				when Key.Right then @moveCursor 1
				when Key.Enter then @finalize()
				when Key.Backspace then @replaceText(@selectionStart - 1, @selectionEnd, "")
				when Key.Space then @setMode(Mode.Selecting)
				when Key.Down, Key.Up
					return false
				else
					return true

		else if @mode == Mode.Selecting
			switch e.which
				when Key.Left
					if e.shiftKey
						@activeTransformation?.moveTail(-1)
					else
						# move selection
				when Key.Right
					if e.shiftKey
						@activeTransformation?.moveTail(+1)
					else
						# move selection
				when Key.Enter then @finalize()
				when Key.Down, Key.Space then @activeTransformation?.nextChoice()
				when Key.Up then @activeTransformation?.prevChoice()


						

	interpret: (e) ->
		return false if @mode == Mode.Selecting

	finalize: ->

	setMode: (mode) ->




module.exports = Composition