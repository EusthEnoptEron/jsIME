var Composition = require("./composition");
var bonzo = require("bonzo");
var _ = require("underscore");
var Input = require("./input");
var LocalStore = require("localstore");
var ServerStore = require("serverstore");

window.IMEBox = module.exports = function(box, store) {
	var win = bonzo(bonzo.create("<ol>")).addClass("ime_window").appendTo(document.body);
	var underlines = [];

	if(!(store || "").getSelections) {
		if(store == "server") store = new ServerStore();
		else store = new LocalStore();
	}

	var composition = new Composition(store);
	var I = new Input(box);

	function onLengthChanged(text) {
		// var pos = composition.from;
		// while(underlines.length < text.length) {
		// 	underlines.push($("<div>", {"class": "underline"}).appendTo("body"));

		// }
		// var bpos = $(box).offset();

		// for(var i = 0; i < underlines.length; i++) {
		// 	var u = underlines[i];
		// 	if(i < text.length) {
		// 		u.show();
		// 		var pxls = $(box).getCaretPosition(composition.from + i);
		// 		u.css({
		// 			left: pxls.left + bpos.left,
		// 			top: pxls.top + bpos.top + 16
		// 		});
		// 	} else {
		// 		u.hide();
		// 	}
			
		// }
	}

	composition.on("select", function(from, to) {
		I.setSelection(from, to);
	});
	composition.on("move", function(step) {
		var sel = I.getSelection();
		I.setSelection(sel.start + step, sel.end + step);
	});

	composition.on("replace", function(from, to, text) {

		if(!to && !text) {
			I.replaceSelectedText(text, true);
		} else {
			I.setSelection(from, to);
			I.replaceSelectedText(text);
		}
		onLengthChanged(text);
	});

	composition.on("insert", function(text) {
		I.insertText(I.end(), true);
		onLengthChanged(text);
	});

	composition.on("done", function() {
		// $.each(underlines, function() {
		// 	$(this).hide();
		// });
		// $(underlines).hide();
	});

	composition.on("show_window", function(values) {
		win.empty();
		for(var i = 0; i < values.length; i++) {
			var val = values[i];
			bonzo(bonzo.create("<li>")).append(
				bonzo(bonzo.create("<span>")).text(val)
			).appendTo(win);
		}

		var pos = I.getCaretPosition();
		var bpos= bonzo(box).offset();

		win.css({
			left: pos.left + bpos.left,
			top: pos.bottom + bpos.top + 3 // + small margin
		});
		

		win.show("block");
	});

	composition.on("hide_window", function() {
		win.hide();
	});

	composition.on("select_entry", function(index) {
		_.forEach(win[0].children, function(li, i) {
			if(i == index)
				bonzo(li).addClass("selected");
			else
				bonzo(li).removeClass("selected");
		});
	});


	box.addEventListener("keydown", function(e) {
		if(!composition.preInterpret(e, box.selectionStart)) {
			e.preventDefault();
		}
	});
	// This is our textbox!
	box.addEventListener("keypress", function(e) {
		if(!composition.interpret(e, box.selectionStart)) {
			e.preventDefault();
		}
		// e.preventDefault();
	}, false);


	box.addEventListener("keyup", function(e) {

	}, false);

}