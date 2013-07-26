var edict = require("edict").create();


function unique(list) {
	var result = [];
	$.each(list, function(i, e) {
		if ($.inArray(e, result) == -1) result.push(e);
	});
	return result;
}

var totalMax = 10;

module.exports = function() {
	var cache = {};

	this.getSelections = function(hiragana) {

		var deferred = $.Deferred();
		var results = edict.searchForEntries(hiragana, true);
		results.unshift(hiragana);

		if(results.length > totalMax)
	 		results.splice(totalMax, results.length-totalMax);

	 	results = unique(results);
	 	deferred.resolve(results);
		return deferred.promise();
	};
}


