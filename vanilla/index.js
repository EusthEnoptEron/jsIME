var IMEBox = require("./js/imebox");

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


window.addEventListener("load", function() {
	var areas = document.getElementsByTagName("textarea");
	for(var i = 0; i < areas.length; i++) {
		new IMEBox(areas[i]);
	}
}, false);