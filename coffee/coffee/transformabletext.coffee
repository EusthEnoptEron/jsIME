EventEmitter2 = require("eventemitter2").EventEmitter2

class TransformableText extends EventEmitter2
	# @input will be a kana string
	input: ""
	preview: ""

	selectionStart: 0
	selectionEnd: 0

	history: 
		selectionStart: 0
		selectionEnd: 0

	selectText: (from, to) ->
		from = Math.min( @preview.length, Math.max( 0, from ) )
		to = Math.min( @preview.length, Math.max( 0, to ) )

		@emit("text.select", from, to)

		@history.selectionStart = @selectionStart
		@history.selectionEnd = @selectionEnd
		@selectionStart = from
		@selectionEnd = to

	###
	Replace the text in the textbox.
	Set `updateInput` to true for all replacements made in composition-mode,
	otherwise the output will be out-of-sync.
	###
	replaceText: (from, to, text, updateInput = false) ->
		@emit("text.replace", from, to, text)

		if updateInput
			@input = @input.substr(0, from)\
		         + text\
		         + @input.substr(to)

		old = @preview
		@preview = @preview.substr(0, from)\
		         + text\
		         + @preview.substr(to)

		# Select new text -- should not be necessary though
		@selectText from, from + text.length


	moveCursor: (direction) ->
		@selectText(
			@selectionStart + direction
			@selectionEnd + direction
		)

	revertSelection: ->
		@selectText @history.selectionStart, @history.selectionEnd
		# @emit "text.select", @history.selectionStart, @history.selectionEnd

	add: (text) ->
		@replaceText @selectionStart, @selectionStart, text, true
		@selectText @selectionStart + 1, @selectionStart + 1


module.exports = TransformableText