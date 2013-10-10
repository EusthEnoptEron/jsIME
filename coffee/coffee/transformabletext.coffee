EventEmitter2 = require("eventemitter2").EventEmitter2;

class TransformableText extends EventEmitter2
	# @input will be a kana string
	@input = ""
	@preview = ""

	@selectionStart = 0
	@selectionEnd = 0


	selectText: (from, to) ->
		@emit("text.select", from, to)

		@cursor = from
		@selectionLength = to - from

	replaceText: (from, to, text) ->
		@emit("text.replace", from, to, text)

		@preview = @preview.substr(0, from)\
		         + text\
		         + @preview.substr(to)

		@selectText @selectionStart, @selectionEnd

	moveCursor: (direction) ->
		@selectText(
			@selectionStart + direction
			@selectionEnd + direction
		)


module.exports = TransformableText