var SelectionList = require("./selectionlist");
var JapaneseString = require("./japanesestring");
// var EventEmitter2 = require("eventemitter2");


var Mode = {
	"Idle"     : 0,
	"Composing": 1,
	"Selecting": 2
};
var Key = {
	Left: 37,
	Up: 38,
	Right: 39,
	Down: 40,
	Enter: 13,
	Backspace: 8,
	Space: 32,
	Tab: 9,
	Shift: 16
};



var Composition = module.exports = function() {
	EventEmitter2.apply(this, arguments);

	this.mode = Mode.Idle;
	this.active = false;
	this.from;
	this.to;
	this.index;


	this.text = new JapaneseString();
	this.converted;
	this.selections;
}

var C = Composition;
C.prototype = Object.create(EventEmitter2.prototype);

// Change mode
C.prototype.setMode = function(mode) {
	var self = this;
	this.mode = mode;

	this.active = mode > Mode.Idle;

	if(mode == Mode.Selecting) {
		this.selections = new SelectionList();
		this.selections.on("select", function(from, length) {
			self.emit("select", from + self.from, from + self.from + length);
		});
		this.selections.on("text_changed", function(i, l, text) {
			self.emit("replace", i + self.from, i+self.from+l, text);
		});
		this.selections.on("show_window", function(values) {
			self.emit("show_window", values);
		});
		this.selections.on("hide_window", function() {
			self.emit("hide_window");
		});
		this.selections.on("select_entry", function(index) {
			self.emit("select_entry", index);
		});
		this.selections.init(this.text);
	} else {
		this.emit("hide_window");
	}
}

// Start composition
C.prototype.start = function(index) {
	this.from = index;
	this.index = 0;
	this.text = new JapaneseString();
	this.setMode(Mode.Composing);
}

// Close current step
C.prototype.close = function() {
	var pos = this.from + this.text.current().length;
	this.emit("done");
	this.emit("select", pos, pos);
	this.setMode( Mode.Idle );
}

C.prototype.add = function(letter) {
	var len = this.text.hiragana().length;

	this.text.add(letter, this.index);

	this.index += this.text.hiragana().length - len;
	this.emit("replace", this.from, this.from + len, this.text.hiragana());
	this.emit("select", this.index + this.from, this.index + this.from);

	this.emit("length_changed", this.text.length());
}

C.prototype.remove = function(index) {
	var len = this.text.hiragana().length;
	this.text.remove(index);
	this.index--;

	var hiragana = this.text.hiragana();

	this.emit("replace", this.from, this.from + len , hiragana);
	this.emit("select", this.index + this.from, this.index + this.from);

	this.emit("length_changed", this.text.length());
	if(hiragana.length <= 0) {
		this.setMode(Mode.Idle );
	}
}

C.prototype.updateText = function() {
	this.emit("replace", this.from, this.from + this.text.current().length, this.text.hiragana());
}

C.prototype.move = function(step) {
	var newIndex = this.index + step;
	if(newIndex < 0 || newIndex > this.text.hiragana().length) {
		return false;
	}
	this.emit("move", step);
	this.index = newIndex;

}


C.prototype.next = function() {

}

C.prototype.prev = function() {

}

C.prototype.preInterpret = function(e, index) {
	if(!this.active) {
		return true;
	}
	if(this.mode == Mode.Composing) {
		switch(e.which) {
			case Key.Left:
				this.move(-1);
				break;
			case Key.Right:
				this.move(1);
				break;
			case Key.Enter:
				this.close();
				break;
			case Key.Backspace:
				this.remove(index - this.from - 1);
				break;
			case Key.Space:
				this.setMode(Mode.Selecting);
				break;
			case Key.Down:
			case Key.Up:
				break;
			default:
				return true;
		}
	} else if(this.mode == Mode.Selecting) {

		switch(e.which) {
			case Key.Left:
				if(e.shiftKey)
					this.selections.split(-1);
				else
					this.selections.switch(-1);
				break;
			case Key.Right:
				if(e.shiftKey)
					this.selections.split(1);
				else
					this.selections.switch(1);
				break;
			case Key.Enter:
				this.close();
				break;
			case Key.Down:
			case Key.Space:
				this.selections.selected.next();
				break;
			case Key.Up:
				this.selections.selected.prev();
				break;
			case Key.Shift:
				return false;
				break;
			case Key.Backspace:
				this.setMode(Mode.Composing);
				this.updateText();
				break;
			default:
				this.close();
				return true;
		}
	}
	
	return false;
}

C.prototype.interpret = function(e, index) {
	if(this.mode == Mode.Selecting) return false;

	if(e.which > 33) {

		if(!this.active)
			this.start(index);

		this.add(String.fromCharCode(e.which));
		return false;
	}

	return true;
}