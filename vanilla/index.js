var Composition = require("./js/composition");

function insertAtCaret(element, text) {
    if (document.selection) {
        element.focus();
        var sel = document.selection.createRange();
        sel.text = text;
        element.focus();
    } else if (element.selectionStart || element.selectionStart === 0) {
        var startPos = element.selectionStart;
        var endPos = element.selectionEnd;
        var scrollTop = element.scrollTop;
        element.value = element.value.substring(0, startPos) + text + element.value.substring(endPos, element.value.length);
        element.focus();
        element.selectionStart = startPos + text.length;
        element.selectionEnd = startPos + text.length;
        element.scrollTop = scrollTop;
    } else {
        element.value += text;
        element.focus();
    }
}

// $(function() {
	
// 	var a = $('#area')
// 	.on("keydown", function(e) {
// 		if(e.which == Keys.RIGHT) {
// 			a.setSelectionRange(a.selectionStart+2, a.selectionEnd+2);
// 		} else if(e.which == Keys.LEFT) {
// 			a.setSelectionRange(a.selectionStart-2, a.selectionEnd-2);
// 		}

// 		return false;
// 	})
// 	.get(0);
// 	a.setSelectionRange(0, 3);
// 	a.focus();
	

// });

function setRangeText(area, text) {
	if(area.setRangeText) area.setRangeText(text);
	else {
		var val = area.value;
		var start = area.selectionStart;
    	area.value = val.slice(0, area.selectionStart) + text + val.slice(area.selectionEnd);
		area.setSelectionRange(start, start + text.length);
	}
}

function imeify(box) {
		
	var win = $("<ol>", {"class": "ime_window"}).appendTo("body");
	var underlines = [];

	var composition = new Composition();

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
		box.setSelectionRange(from, to);
	});
	composition.on("move", function(step) {
		box.setSelectionRange(box.selectionStart + step, box.selectionEnd + step);
	});

	composition.on("replace", function(from, to, text) {
		if(!to && !text) {
			box.setRangeText(from);
		} else {
			// console.log(from, to, text);
			box.setSelectionRange(from, to);
			// box.setRangeText(text);
			setRangeText(box, text);
			box.setSelectionRange(from + text.length, from + text.length);
		}
		onLengthChanged(text);
	});

	composition.on("insert", function(text) {
		insertAtCaret(box, text);
		onLengthChanged(text);
	});

	composition.on("done", function() {
		$.each(underlines, function() {
			$(this).hide();
		});
		// $(underlines).hide();
	});

	composition.on("show_window", function(values) {
		win.empty();
		$.each(values, function(i, val) {
			$("<li>").append(
				$("<span>").text(val)
			).appendTo(win);
		});
		var pos = $(box).getCaretPosition();
		var bpos = $(box).offset();

		win.css({
			left: pos.left + bpos.left,
			top: pos.top + bpos.top + 16
		});
		win.show();
	});

	composition.on("hide_window", function() {
		win.hide();
	});

	composition.on("select_entry", function(index) {
		win.children().removeClass("selected").filter("li:eq("+index+")").addClass("selected");
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


$(function() {
	// return false;
	$("textarea").each(function() {
		imeify(this);
	});	
	
});