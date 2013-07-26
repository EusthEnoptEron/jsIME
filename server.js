var _ = require("underscore"),
    fs = require("fs"),
    Edict = require("./lib/edict.js"),
    express = require('express');

var app = express();

// Parse edict
var dict = JSON.parse(fs.readFileSync(__dirname + "/edict.json"));
var edict = new Edict(dict);
var totalMax = 10;


// Configure simple server
app.use(function(req, res, next){
	res.charset = "utf8";
	// res.set("Access-Control-Allow-Origin", "*");
 	var text = req.query.text;
 	var result = [];
 	if(text) {
	 	result = edict.searchForEntries(text, true);
	 	result.unshift(text);

	 	// Trim to appropriate length
	 	if(result.length > totalMax)
	 		result.splice(totalMax, result.length-totalMax);

	 	// Remove duplicates
	 	result = _.uniq(result);
 	}

 	// Make a JSONP response
	res.send( req.query.callback + "(" + JSON.stringify(result)  + ")" );

});


app.listen(3000);