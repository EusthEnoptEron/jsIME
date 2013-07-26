var particles = ["は","を","の","か","が","な","や","から","より","です"];

var Edict = module.exports = function(edict) {
	this.edict = edict;

	this.searchForEntries = function(text, aggressive, max) {
		if(!text.length) return [];
		if(!max) max = 50;

		var result = [];
		var suffix = "";

		if(text in this.edict) {
	 		for(var i = 0; i < this.edict[text].length && i < max; i++)
	 			result.push(this.edict[text][i]);
	 	} else if(aggressive) {
	 		var preResults = [];

	 		while(text.length > 1 && !preResults.length) {
				suffix = text.substr(-1) + suffix;
				text = text.substr(0, text.length - 1);

				preResults = this.searchForEntries(text, false, 2);
	 		}
			
			// Found something
			if(preResults.length) {
				//Look for particles
				particles.every(function(particle) {
					if(suffix.substr(0, particle.length) == particle) {
						suffix = suffix.substr(particle.length);
						preResults = this.concatArrays(preResults, [particle]);
						return false;
					}
					return true;
				}, this);
				var postResults = this.searchForEntries(suffix, aggressive, (preResults.length - 1 || 2));
				if(postResults.length) {
					//Mix
					result = this.concatArrays(preResults, postResults);
				} else {
					result = this.concatArrays(preResults, [suffix]);
				}
			}
	 	}
	 	return result;
	}

	this.concatArrays = function(a1, a2) {
		var a = [];
		a1.forEach(function(r1) {
			a2.forEach(function(r2) {
				a.push(r1 + r2);
			});
		});
		return a;
	}
};

module.exports.create = function() {
	return new Edict(require("dict"));
}