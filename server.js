var express = require('express');
var app = express();
var fs = require("fs");
var _ = require("underscore");
var Edict = require("./lib/edict.js")

// Parse edict
var dict = JSON.parse(fs.readFileSync(__dirname + "/edict.json"));
var edict = new Edict(dict);
var totalMax = 10;
app.use(function(req, res, next){
	res.charset = "utf8";
	// res.set("Access-Control-Allow-Origin", "*");
 	var text = req.query.text;

 	var result = edict.searchForEntries(text, true);
 	result.unshift(text);

 	if(result.length > totalMax)
 		result.splice(totalMax, result.length-totalMax);

 	result = _.uniq(result);
 	// Make a JSONP response
	res.send( req.query.callback + "(" + JSON.stringify(result)  + ")" );

});


// app.get('/', function(req, res){
//   res.send('hello world');
// });

app.listen(3000);