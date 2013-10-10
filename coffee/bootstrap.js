window.addEventListener("load", function() {
	var areas = document.getElementsByTagName("textarea");
	for(var i = 0; i < areas.length; i++) {
		imeify(areas[i]);
	}
}, false);