var fs = require('fs'),
	_  = require("underscore"),
    readline = require('readline');


exports.parse = function(path, threshold, callback) {
	var rd = readline.createInterface({
	    input: fs.createReadStream(path),
	    output: process.stdout,
	    terminal: false
	});

	var conversion = "cHa";
	var edict = {};
	var j = 0;
	rd.on('line', function(line) {
		// Skip first line
		if(j++ == 0) return;

		line = line.trim();
		// 1 = writing
		// 2 = reading
		// 3 = word-type
		// 4 = frequency
		var match = line.match(/(.+?) (?:\[(.+?)\] )?\/\(([^)]+)\).+?\/#*(\d+)\/$/);
		if(match) {
			var writing = match[1];
			var reading = mb_convert_kana(match[2] || writing, conversion);
			var type    = match[3];
			var frequency = match[4];
			add(getFlexions(reading, writing, type.split(",")), frequency*1);
		} 
	});

	rd.on("close", function() {
		finalize();
		callback(edict);
		// fs.writeFile("edict.json", JSON.stringify(edict));
	})


	function add(list, frequency) {
		if(frequency > threshold) {
			// console.log(frequency);
			list.forEach(function(item) {
				var r= item[0], w = item[1];
				if(!(r in edict)) edict[r] = [];
				edict[r].push([w, frequency]);
			});
		}
	}

	function finalize() {
		for(var i in edict) {
			if(edict.hasOwnProperty(i)) {
				edict[i].sort(function(a, b) {
					// ORDER BY frequency DESC
					return b[1]-a[1];
				});
				// Remove frequency list
				edict[i] = _.pluck(edict[i], 0);
			}
		}
	}

	function getFlexions(reading, writing, types) {
		var results = [];
		results.push([reading, writing]);
		for(var key in flexions) {
			if(!flexions.hasOwnProperty(key)) continue;
		
			for(var type in flexions[key]) {
				if(!flexions[key].hasOwnProperty(type)) continue;
				var change = flexions[key][type];
				var config;
				if(types.indexOf(type)>=0) {
					if(typeof(change) == "string")
						config = { reading_rem: 1, reading_rep: change, writing_rem: 1, writing_rep: change };
					else
						config = change;

					var r = reading.substr(0, reading.length - config.reading_rem) + config.reading_rep;
					var w = writing.substr(0, writing.length - config.writing_rem) + config.writing_rep;
					// console.log(key + " - " + type + " - " + w);
					results.push([r, w]);
				}

			}
		}

		return results;
	}

}







//var h = {}; $("#passive tr").find("td:first").each(function() { h[$(this).text()] = $(this).next().next().text().replace(/ .+$/,"").replace(/-/,""); }); JSON.stringify(h);
//https://en.wikipedia.org/wiki/Japanese_verb_conjugation
// {rep : "", rem: 1}
// 
var flexions = 
	{
		"perfective":
		{
			//"aux":"でした",
			// "":"ました",
			// "vs":"した",
			"vk":"た",
			"v5u":"った",
			"v5u-s":"うた",
			"v5k":"いた",
			"v5k-s":"った",
			"v5g":"いだ",
			"v5s":"した",
			"v5t":"った",
			"v5n":"んだ",
			"v5b":"んだ",
			"v5m":"んだ",
			"v5r":"った",
			"v5r-i":"った",
			"v5aru":"った",
			"v1":"た",
			"adj-i":"かった",
			// "adj-na":"だった"
		},
		"negative":
		{
			// "aux":"ではありません de wa arimasen\nじゃありません ja arimasen (colloquial)\n",
			// "vs":"しない shinai\n(さない sanai)\n",
			"vk": { reading_rem: 2, reading_rep: "こない", writing_rem: 1, writing_rep: "ない" },
			"":"ません",
			"v5u":"わない",
			"v5u-s":"わない",
			"v5k":"かない",
			"v5k-s":"かない",
			"v5g":"がない",
			"v5s":"さない",
			"v5t":"たない",
			"v5n":"なない",
			"v5b":"ばない",
			"v5m":"まない",
			"v5r":"らない",
			"v5r-i":"*",
			"v5aru":"らない",
			"v1":"ない",
			"adj-i":"くない",
			// "adj-na":"ではない"
		},
		"shi":
		{
			// "aux":"であり",
			// "vs":"し",
			"vk":"き",
			"vk": { reading_rem: 2, reading_rep: "き", writing_rem: 2, writing_rep: "き" },
			"v5u":"い",
			"v5u-s":"い",
			"v5k":"き",
			"v5k-s":"き",
			"v5g":"ぎ",
			"v5s":"し",
			"v5t":"ち",
			"v5n":"に",
			"v5b":"び",
			"v5m":"み",
			"v5r":"り",
			"v5r-i":"り",
			"v5aru":"い",
			"v1":""
		},
		"te":
		{	
			// "aux":"で",
			// "vs":"して",
			"vk": { reading_rem: 2, reading_rep: "きて", writing_rem: 1, writing_rep: "て" },
			"v5u":"って",
			"v5u-s":"うて",
			"v5k":"いて",
			"v5k-s":"って",
			"v5g":"いで",
			"v5s":"して",
			"v5t":"って",
			"v5n":"んで",
			"v5b":"んで",
			"v5m":"んで",
			"v5r":"って",
			"v5r-i":"って",
			"v5aru":"って",
			"v1":"て",
			"adj-i":"くて",
			// "adj-na":"で"
		},
		"potential":
		{
			// "vs":"出来る dekiru\n(せられる serareru)\n(せる seru)\n",
			"vk":{ reading_rem: 2, reading_rep: "これる", writing_rem: 1, writing_rep: "れる" },
			"v5u":"える",
			"v5u-s":"える",
			"v5k":"ける",
			"v5k-s":"ける",
			"v5g":"げる",
			"v5s":"せる",
			"v5t":"てる",
			"v5n":"ねる",
			"v5b":"める",
			"v5r":"れる",
			"v5r-i":"り得る",
			"v5aru":"り得る",
			"v1":"れる"
		},
		"passive":
		{
			// "vs":"される",
			"vk":{ reading_rem: 2, reading_rep: "こられる", writing_rem: 1, writing_rep: "られる" },
			"v5u":"われる",
			"v5u-s":"われる",
			"v5k":"かれる",
			"v5k-s":"かれる",
			"v5g":"がれる",
			"v5s":"される",
			"v5t":"たれる",
			"v5n":"なれる",
			"v5b":"ばれる",
			"v5m":"まれる",
			"v5r":"られる",
			"v1":"られる"
		}
	};





/**
 * mb_convert_kana function
 * @see  http://svn.coderepos.org/share/lang/javascript/p2js/trunk/src/php.mb_convert_kana.js
 * @package mbstring
 * @author shogo < shogo4405 at gmail dot com >
 * @version 1.0.0RC3
 * @see http://www.php.net/mb_convert_kana
 * @param  {String} s string
 * @return {String} o options
 */
var mb_convert_kana = function()
{
	function c(d, f)
	{
		return function(s)
		{
			var i, c, a = [];
			for(i=s.length-1;0<=i;i--)
			{
				c = s.charCodeAt(i);
				a[i] = f(c) ? c + d : c;
			};
			return String.fromCharCode.apply(null, a);
		};
	};

	var f = 
	{
		h : function(s){ return this.k(s, 0x0060); },
		H : function(s){ return this.K(s, 0x0060); },
		s : c(-0x2FE0, function(c){ return (c == 0x3000); }),
		S : c(+0x2FE0, function(c){ return (c == 0x0020); }),
		r : c(-0xFEE0, function(c){ return (0xFF20 <= c && c <= 0xFF5A); }),
		R : c(+0xFEE0, function(c){ return (0x0040 <= c && c <= 0x007A); }),
		n : c(-0xFEE0, function(c){ return (0xFF10 <= c && c <= 0xFF19); }),
		N : c(+0xFEE0, function(c){ return (0x0030 <= c && c <= 0x0039); }),
		a : c(-0xFEE0, function(c){ return (0xFF02 <= c && c <= 0xFF5E); }),
		A : c(+0xFEE0, function(c){ return (0x0022 <= c && c <= 0x007E); }),
		c : c(-0x0060, function(c){ return (0x30A1 <= c && c <= 0x30F6); }),
		C : c(+0x0060, function(c){ return (0x3041 <= c && c <= 0x3096); }),
		k : function(s, d)
		{
			var i, f, c, m, d = d || 0, a = [];
			m =
			{
				0x30A1:0xFF67, 0x30A3:0xFF68, 0x30A5:0xFF69, 0x30A7:0xFF6A, 0x30A9:0xFF6B,
				0x30FC:0xFF70, 0x30A2:0xFF71, 0x30A4:0xFF72, 0x30A6:0xFF73, 0x30A8:0xFF74,
				0x30AA:0xFF75, 0x30AB:0xFF76, 0x30AD:0xFF77, 0x30AF:0xFF78, 0x30B1:0xFF79,
				0x30B3:0xFF7A, 0x30B5:0xFF7B, 0x30B7:0xFF7C, 0x30B9:0xFF7D, 0x30BB:0xFF7E,
				0x30BD:0xFF7F, 0x30BF:0xFF80, 0x30C1:0xFF81, 0x30C4:0xFF82, 0x30C6:0xFF83,
				0x30C8:0xFF84, 0x30CA:0xFF85, 0x30CB:0xFF86, 0x30CC:0xFF87, 0x30CD:0xFF88,
				0x30CE:0xFF89, 0x30CF:0xFF8A, 0x30D2:0xFF8B, 0x30D5:0xFF8C, 0x30D8:0xFF8D,
				0x30DB:0xFF8E, 0x30DE:0xFF8F, 0x30DF:0xFF90, 0x30E0:0xFF91, 0x30E1:0xFF92,
				0x30E2:0xFF93, 0x30E4:0xFF94, 0x30E6:0xFF95, 0x30E8:0xFF95, 0x30E9:0xFF97,
				0x30EA:0xFF98, 0x30EB:0xFF99, 0x30EC:0xFF9A, 0x30ED:0xFF9B, 0x30EF:0xFF9C,
				0x30F2:0xFF66, 0x30F3:0xFF9D
			};
			for(i=0,f=s.length;i<f;i++)
			{
				c = s.charCodeAt(i) + d;
				switch(true)
				{
					case (c in m):
						a.push(m[c]);
						break;
					case (0x30AB <= c && c <= 0x30C9):
						a.push(m[c-1], 0xFF9E);
						break;
					case (0x30CF <= c && c <= 0x30DD):
						a.push(m[c-c%3], [0xFF9E,0xFF9F][c%3-1]);
						break;
					default:
						a.push(c - d);
						break;
				};
			};
			return String.fromCharCode.apply(null, a);
		},
		K : function(s, d)
		{
			var i, f, c, m, d = d || 0, a = [];
			m =
			{
				0xFF67:0x30A1, 0xFF68:0x30A3, 0xFF69:0x30A5, 0xFF6A:0x30A7, 0xFF6B:0x30A9,
				0xFF70:0x30FC, 0xFF71:0x30A2, 0xFF72:0x30A4, 0xFF73:0x30A6, 0xFF74:0x30A8,
				0xFF75:0x30AA, 0xFF76:0x30AB, 0xFF77:0x30AD, 0xFF78:0x30AF, 0xFF79:0x30B1,
				0xFF7A:0x30B3, 0xFF7B:0x30B5, 0xFF7C:0x30B7, 0xFF7D:0x30B9, 0xFF7E:0x30BB,
				0xFF7F:0x30BD, 0xFF80:0x30BF, 0xFF81:0x30C1, 0xFF82:0x30C4, 0xFF83:0x30C6,
				0xFF84:0x30C8, 0xFF85:0x30CA, 0xFF86:0x30CB, 0xFF87:0x30CC, 0xFF88:0x30CD,
				0xFF89:0x30CE, 0xFF8A:0x30CF, 0xFF8B:0x30D2, 0xFF8C:0x30D5, 0xFF8D:0x30D8,
				0xFF8E:0x30DB, 0xFF8F:0x30DE, 0xFF90:0x30DF, 0xFF91:0x30E0, 0xFF92:0x30E1,
				0xFF93:0x30E2, 0xFF94:0x30E4, 0xFF95:0x30E6, 0xFF95:0x30E8, 0xFF97:0x30E9,
				0xFF98:0x30EA, 0xFF99:0x30EB, 0xFF9A:0x30EC, 0xFF9B:0x30ED, 0xFF9C:0x30EF,
				0xFF9D:0x30F3, 0xFF9E:0x309B, 0xFF9F:0x309C, 0xFF66:0x30F2
			};
			for(i=0,f=s.length;i<f;i++)
			{
				c = s.charCodeAt(i);
				a.push(m[c] - d || c);
			};
			return String.fromCharCode.apply(null, a);
		},
		V : function(s)
		{
			var i, c, n, f, a = [];
			for(i=0,f=s.length;i<f;i++)
			{
				c = s.charCodeAt(i);
				switch(true)
				{
					case (0x304B <= c && c <= 0x3052 && (c % 2 == 1)):
					case (0x30AB <= c && c <= 0x30C2 && (c % 2 == 1)):
					case (0x3064 <= c && c <= 0x3069 && (c % 2 == 0)):
					case (0x30C4 <= c && c <= 0x30C9 && (c % 2 == 0)):
						a.push(c + ({0x309C:1}[s.charCodeAt(i+1)] || 0));
						if(a[a.length-1] != c){ i++; };
						break;
					case (0x306F <= c && c <= 0x307F && (c % 3 == 0)):
					case (0x30CF <= c && c <= 0x30DD && (c % 3 == 0)):
						a.push(c + ({0x309B:1,0x309C:2}[s.charCodeAt(i+1)] || 0));
						if(a[a.length-1] != c){ i++; };
						break;
					default:
						a.push(c);
						break;
				};
			};
			return String.fromCharCode.apply(null, a);
		}
	};

	return function mb_convert_kana(s, o)
	{
		var i, x, a = (o) ? o.split('') : ['K','V'];
		for(i=0,x=a.length;i<x;i++){ s = f[a[i]](s); };
		return s;
	};
}();
