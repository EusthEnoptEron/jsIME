var Selection = require("./selection");
var EventEmitter2 = require("eventemitter2").EventEmitter2;


var SelectionList = module.exports = function(text) {
	EventEmitter2.apply(this, arguments);

	this.selected = null;
	this.items = [];
	this.text = null
}


SelectionList.prototype = Object.create(EventEmitter2.prototype);

SelectionList.prototype.init = function(text) {
	this.text = text;
	this.selected = this.add(this.createSelection(text, 0, text.length()));
	this.selected.next();
	this.emit("select", this.selected.from, this.selected.actualLength());

}
SelectionList.prototype.add = function(selection) {
	this.items.push(selection);
	return selection;
}

SelectionList.prototype.updateSelection = function() {
	var range = this.getRange(this.selected);
	this.emit("select", range[0], range[1]);
}

SelectionList.prototype.getRange = function(selection) {
	var offset = 0;
	for(var i = 0; i < this.items.length; i++) {
		var item = this.items[i];
		if(item === selection) {
			break;
		} else {
			offset += item.actualLength();
		}
	}

	return [offset, selection.actualLength()];
}

SelectionList.prototype.split = function(direction) {
	if(direction < 0 && this.selected.length > 1) {
		var next = this.adjacent(this.selected, true);
		next.lengthen(-1);
		this.selected.shorten(-1);
		this.updateSelection();
	} else if(direction > 0 && (this.selected.from + this.selected.length) < this.text.length()) {
		var next = this.adjacent(this.selected);
		next.shorten(direction);
		this.selected.lengthen(direction);
		this.clean();
		this.updateSelection();
	}
}

SelectionList.prototype.clean = function() {
	for(var i = 0; i < this.items.length; i++) {
		if(this.items[i].length <= 0) {
			this.items.splice(i, 1);
			i--;
		}
	}
}

SelectionList.prototype.adjacent = function(selection, create) {
	var index = this.items.indexOf(selection) + 1;
	if(this.items[index])
		return this.items[index];
	if(!create)
		return null;
	this.items.splice(index, 0, this.createSelection(this.text, selection.from + selection.length, 0));
	return this.items[index];
}

SelectionList.prototype.switch = function(direction) {
	var index = this.items.indexOf(this.selected) + direction;
	if(this.items[index]) {
		this.selected = this.items[index];
		this.updateSelection();
		this.emit("hide_window");
	}
}

SelectionList.prototype.createSelection = function(text, from, length) {
	var sel = new Selection(text, from, length);
	var self = this;
	sel.on("selection_changed", function(index, oldText, newText) {
		if(!self.selected) self.selected = this;

		// console.log(oldText, newText);
		var range = self.getRange(this);

		// this.emit("select", range[0], oldText.length);
		self.emit("text_changed", range[0], oldText.length, newText);
		self.updateSelection();

		self.text.result = self.getResult();

		if(this == self.selected) {
			if(index != 0) {
				self.emit("show_window", self.selected.selections);
			}

			self.emit("select_entry", index);
		}
	});
	sel.on("values_changed", function(values) {
		if(this==self.selected) {
			self.emit("show_window", values);
		}
	});
	sel.update();
	return sel;
}

SelectionList.prototype.getResult = function() {
	var t = "";
	for(var i = 0; i < this.items.length; i++) {
		t += this.items[i].resultingText();
	}
	return t;
}
