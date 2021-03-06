var EventEmitter2 = require("eventemitter2").EventEmitter2;
var Promise = require("promise");
var _ = require("underscore");


var Selection = module.exports = function(text, from, length, store) {
	EventEmitter2.apply(this, arguments);

	this.length = length;
	this.from = from;
	this.text = text;
	this.index = 0;
	this.store = store;

	this.selections = [this.actualText()];
	this.promise = new Promise(function(resolve) {
		resolve();
	});
}

Selection.prototype = Object.create(EventEmitter2.prototype);

Selection.prototype.update = function() {
	var self = this;
	this.changeValues([this.actualText()]);
	// this.setIndex(0);
	this.promise = this.store.getSelections(this.actualText()).then(function(selections) {
		self.changeValues(selections);
	});
	
};

Selection.prototype.changeValues = function(values) {
	//If they're equal, return
	if(_.isEqual(this.selections, values))  return false;

	var prevResult = this.resultingText();

	this.selections = values;
	this.index = 0;
	this.emit("values_changed", values);
	this.emit("selection_changed", this.index, prevResult, this.resultingText());
}

Selection.prototype.setIndex = function(i) {
	var self = this;
	var prevResult = this.resultingText();
	this.promise.then(function() {
		self.index = i % self.selections.length; 
		if(i < 0)
			self.index = (self.selections.length - 1) - ((Math.abs(i)-1) % self.selections.length); 
		else
			self.index = i % self.selections.length; 

		self.emit("selection_changed", self.index, prevResult, self.resultingText());
	});
}

Selection.prototype.lengthen = function(direction) {
	this.length++;
	if(direction < 0) {
		this.from--;
	}
	this.update();
}

Selection.prototype.shorten = function(direction) {
	this.length--;
	if(direction > 0) {
		this.from++;
	}
	this.update();
}

Selection.prototype.actualLength = function() {
	return this.resultingText().length;
}

Selection.prototype.actualText = function() {
	return this.text.hiragana().substr(this.from, this.length);
}

Selection.prototype.resultingText = function() {
	return this.selections[this.index];
}

Selection.prototype.next = function() {
	this.setIndex(this.index + 1);
}

Selection.prototype.prev = function() {
	this.setIndex(this.index - 1);
}