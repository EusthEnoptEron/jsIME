JsIME = require "./jsime.coffee"
Input = require "../../vanilla/js/input"
bonzo = require "bonzo"
LocalStore = require "localstore"
ServerStore = require "serverstore"



imeify = (box, store) ->
	# Create IME window
	win = bonzo(bonzo.create "<ol>")
	      .addClass("ime_window")
	      .appendTo(document.body)

	# Prepare store
	unless store?.getSelections?
		if store == "server"
			store = new ServerStore()
		else
			store = new LocalStore()

	# Init objects
	ime = new JsIME(store)
	I = new Input(box)

	# Handle system events
	box.addEventListener("keydown", (e) ->
		unhandled = ime.preInterpret e
		e.preventDefault() if !unhandled
	false)

	box.addEventListener("keypress", (e) ->
		unhandled = ime.interpret e, box.selectionStart
		e.preventDefault() if !unhandled
	false)


	# Handle IME events
	ime.on "text.select", (from, to) ->
		I.setSelection(from, to)

	ime.on "text.replace", (from, to, text) ->
		I.setSelection(from, to)
		I.replaceSelectedText(text, true)

	ime.on "window.show", (values) ->
		# Add values
		win.empty()

		for value in values
			bonzo(bonzo.create "<li>")
			    .append(
			    	bonzo(bonzo.create "<span>").text(val)
			    )
			    .appendTo(win)
		
		# Reposition window
		pos  = I.getCaretPosition()
		bpos = bonzo(box).offset()

		win.css
			left: pos.left + bpos.left
			top:  pos.bottom + bpos.top + 3

		win.show "block"

	ime.on "window.hide", () ->
		win.hide()

	ime.on "window.select", (index) ->
		for li, i in win[0].children
			if i == index
				bonzo(li).addClass "selected"
			else
				bonzo(li).removeClass "selected"


module.exports = imeify
window?.imeify = imeify