var server = "http://localhost:3000";
var Promise = require("promise");

module.exports = function() {
	var cache = {};

	this.getSelections = function(hiragana) {
		return new Promise(function(resolve, fail) {
			JSONP.get(server, {text: hiragana}, resolve);
		});
	};
}