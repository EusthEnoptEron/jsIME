var edict = require("./edict").create();
var Promise = require("promise");
var _ = require("underscore");

var totalMax = 10;

module.exports = function() {
	var cache = {};

	this.getSelections = function(hiragana) {
		return new Promise(function(resolve) {

			var results = edict.searchForEntries(hiragana, true);
			results.unshift(hiragana);

			if(results.length > totalMax)
		 		results.splice(totalMax, results.length-totalMax);
		 	results = _.uniq(results);
		 	resolve(results);
		});
	};
}


