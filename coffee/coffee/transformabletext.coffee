EventEmitter2 = require("eventemitter2").EventEmitter2

class TransformableText extends EventEmitter2
	# @input will be a kana string
	input: ""
	preview: ""

	selectionStart: 0
	selectionEnd: 0

	history: 
		selectionStart: 0
		selectionEnd: 0

	selectText: (from, to) ->
		from = Math.min( @preview.length, Math.max( 0, from ) )
		to = Math.min( @preview.length, Math.max( 0, to ) )

		@emit("text.select", from, to)

		@history.selectionStart = @selectionStart
		@history.selectionEnd = @selectionEnd
		@selectionStart = from
		@selectionEnd = to

	###
	Replace the text in the textbox.
	Set `updateInput` to true for all replacements made in composition-mode,
	otherwise the output will be out-of-sync.
	###
	replaceText: (from, to, text, updateInput = false) ->
		@emit("text.replace", from, to, text)

		if updateInput
			@input = @input.substr(0, from)\
		         + text\
		         + @input.substr(to)

		old = @preview
		@preview = @preview.substr(0, from)\
		         + text\
		         + @preview.substr(to)

		# Select new text -- should not be necessary though
		@selectText from, from + text.length


	moveCursor: (direction) ->
		@selectText(
			@selectionStart + direction
			@selectionEnd + direction
		)

	revertSelection: ->
		@selectText @history.selectionStart, @history.selectionEnd
		# @emit "text.select", @history.selectionStart, @history.selectionEnd

	add: (text) ->
		text = @input.substr(0, @selectionStart) + text		
		text = convert text, true

		@replaceText 0, @selectionStart, text, true
		@selectText @selectionEnd, @selectionEnd


`
function convert(str, delay) {
	  var result = [];
	  var text = str;
	  var rem = '';

	  if (delay) {
	    var l = str.length;
	    var last  = str.substr(l - 1, 1);
	    var last2 = str.substr(l - 2, 2);
	    if (l > 1 && last2 == 'nn') {
	      text = str;
	      rem = '';
	    } else if (l > 1 && last2.match(/^[qwrtyplkjhgfdszxcvbmn]y$/)) {
	      text = str.substr(0, l - 2);
	      rem = last2;
	    } else if (l > 0 && last.match(/[qwrtyplkjhgfdszxcvbmn]/)) {
	      text = str.substr(0, l - 1);
	      rem = last;
	    }
	  }
	  
	  for (var i = 0; i < text.length;) {
	    var o = text.charAt(i);
	    var c = o.charCodeAt(0);
	    var len = 0;
	    if ((c >= 97 && c <= 122) || (c >= 65 && c <= 90) || (c >= 44 && c <= 46)) 
	      len = 4;
	    while (len) {
	      var key = text.slice(i, i + len);
	      if (key in IMERoma2KatakanaTable_) {
	        var kana = IMERoma2KatakanaTable_[key];
	        if (typeof(kana) == 'string') {
	          result.push(kana);
	          i += len;
	        } else {
	          result.push(kana[0]);
	          i += (len - kana[1]);
	        }
	        break;
	      }
	      --len;
	    }
	    
	    if (len == 0) {
	      result.push(o);
	      ++i;
	    }
	  }
	  
	  return result.join("") + rem;
}
IMERoma2KatakanaTable_ = {'.':'。',',':'、','-':'ー','~':'〜','va':'う゛ぁ','vi':'う゛ぃ','vu':'う゛','ve':'う゛ぇ','vo':'う゛ぉ','vv': ['っ',1],'xx': ['っ',1],'kk': ['っ',1],'gg': ['っ',1],'ss': ['っ',1],'zz': ['っ',1],'jj': ['っ',1],'tt': ['っ',1],'dd': ['っ',1],'hh': ['っ',1],'ff': ['っ',1],'bb': ['っ',1],'pp': ['っ',1],'mm': ['っ',1],'yy': ['っ',1],'rr': ['っ',1],'ww': ['っ',1],'cc': ['っ',1],'kya':'きゃ','kyi':'きぃ','kyu':'きゅ','kye':'きぇ','kyo':'きょ','gya':'ぎゃ','gyi':'ぎぃ','gyu':'ぎゅ','gye':'ぎぇ','gyo':'ぎょ','sya':'しゃ','syi':'しぃ','syu':'しゅ','sye':'しぇ','syo':'しょ','sha':'しゃ','shi':'し','shu':'しゅ','she':'しぇ','sho':'しょ','zya':'じゃ','zyi':'じぃ','zyu':'じゅ','zye':'じぇ','zyo':'じょ','tya':'ちゃ','tyi':'ちぃ','tyu':'ちゅ','tye':'ちぇ','tyo':'ちょ','cha':'ちゃ','chi':'ち','chu':'ちゅ','che':'ちぇ','cho':'ちょ','dya':'ぢゃ','dyi':'ぢぃ','dyu':'ぢゅ','dye':'ぢぇ','dyo':'ぢょ','tha':'てゃ','thi':'てぃ','thu':'てゅ','the':'てぇ','tho':'てょ','dha':'でゃ','dhi':'でぃ','dhu':'でゅ','dhe':'でぇ','dho':'でょ','nya':'にゃ','nyi':'にぃ','nyu':'にゅ','nye':'にぇ','nyo':'にょ','jya':'じゃ','jyi':'じ','jyu':'じゅ','jye':'じぇ','jyo':'じょ','hya':'ひゃ','hyi':'ひぃ','hyu':'ひゅ','hye':'ひぇ','hyo':'ひょ','bya':'びゃ','byi':'びぃ','byu':'びゅ','bye':'びぇ','byo':'びょ','pya':'ぴゃ','pyi':'ぴぃ','pyu':'ぴゅ','pye':'ぴぇ','pyo':'ぴょ','fa':'ふぁ','fi':'ふぃ','fu':'ふ','fe':'ふぇ','fo':'ふぉ','mya':'みゃ','myi':'みぃ','myu':'みゅ','mye':'みぇ','myo':'みょ','rya':'りゃ','ryi':'りぃ','ryu':'りゅ','rye':'りぇ','ryo':'りょ','n\'':'ん','nn':'ん','n':'ん','a':'あ','i':'い','u':'う','e':'え','o':'お','xa':'ぁ','xi':'ぃ','xu':'ぅ','xe':'ぇ','xo':'ぉ','la':'ぁ','li':'ぃ','lu':'ぅ','le':'ぇ','lo':'ぉ','ka':'か','ki':'き','ku':'く','ke':'け','ko':'こ','ga':'が','gi':'ぎ','gu':'ぐ','ge':'げ','go':'ご','sa':'さ','si':'し','su':'す','se':'せ','so':'そ','za':'ざ','zi':'じ','zu':'ず','ze':'ぜ','zo':'ぞ','ja':'じゃ','ji':'じ','ju':'じゅ','je':'じぇ','jo':'じょ','ta':'た','ti':'ち','tu':'つ','tsu':'つ','te':'て','to':'と','da':'だ','di':'ぢ','du':'づ','de':'で','do':'ど','xtu':'っ','xtsu':'っ','na':'な','ni':'に','nu':'ぬ','ne':'ね','no':'の','ha':'は','hi':'ひ','hu':'ふ','fu':'ふ','he':'へ','ho':'ほ','ba':'ば','bi':'び','bu':'ぶ','be':'べ','bo':'ぼ','pa':'ぱ','pi':'ぴ','pu':'ぷ','pe':'ぺ','po':'ぽ','ma':'ま','mi':'み','mu':'む','me':'め','mo':'も','xya':'ゃ','ya':'や','xyu':'ゅ','yu':'ゆ','xyo':'ょ','yo':'よ','ra':'ら','ri':'り','ru':'る','re':'れ','ro':'ろ','xwa':'ゎ','wa':'わ','wi':'うぃ','we':'うぇ','wo':'を'};
`

module.exports = TransformableText