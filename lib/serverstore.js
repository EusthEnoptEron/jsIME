var server = "http://localhost:3000";

module.exports = function() {
	var cache = {};

	this.getSelections = function(hiragana) {
		$.support.cors = true;
		return $.ajax(server, {
			data: {
				text: hiragana
			},
			type: "GET",
			dataType: "jsonp",
			contentType: "application/json; charset=utf8"
		});
	};
}