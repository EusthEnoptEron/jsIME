window.addEventListener("load", function() {
	var areas = document.getElementsByTagName("textarea");
	for(var i = 0; i < areas.length; i++) {
		new IMEBox(areas[i]);
	}
}, false);