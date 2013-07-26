var bonzo = require("bonzo");
var _ = require("underscore");

var I = module.exports = function(el) {
	this.el = el;
}

I.prototype.getSelection = function() {
	return rangyInputs.getSelection(this.el);
}

I.prototype.setSelection = function(start, end) {
	return rangyInputs.setSelection(this.el, start, end);
}

I.prototype.collapseSelection = function(toStart) {
	return rangyInputs.collapseSelection(this.el, toStart);
}

I.prototype.deleteText = function(start, end, moveSelection) {
	return rangyInputs.deleteText(this.el, start, end, moveSelection);
}

I.prototype.deleteSelectedText = function() {
	return rangyInputs.deleteSelectedText(this.el);
}

I.prototype.extractSelectedText = function() {
	return rangyInputs.extractSelectedText(this.el);
}

I.prototype.insertText = function(text, pos, moveSelection) {
	if(pos === undefined) pos = this.start();
	return rangyInputs.insertText(this.el, text, pos, moveSelection);
}

I.prototype.replaceSelectedText = function(text, doSelect) {
	var result = rangyInputs.replaceSelectedText(this.el, text);
	if(doSelect) {
		this.setSelection(this.start(), text.length);
	}
	return result;
}

I.prototype.surroundSelectedText = function(textBefore, textAfter) {
	return rangyInputs.surroundSelectedText(this.el, textBefore, textAfter);
}


// HELPERS
I.prototype.start = function() {
	return this.getSelection().start;
}

I.prototype.end = function() {
	return this.getSelection().end;
}

I.prototype.getCaretPosition = function(i) {
	if(i === undefined) i = this.start();
	var el = this.el;

	clone = getClone(el);
	bonzo(clone).text(el.value);
	var textnode = clone.firstChild;
	
	var replacementNode = textnode.splitText(i);
	var span = document.createElement('span');
	bonzo(span).text(" ");
	clone.insertBefore(span, replacementNode);
	bonzo(document.body).append(clone);
	var pos = {
		left: span.offsetLeft,
		top: span.offsetTop
	};

	pos.top -= bonzo(el).scrollTop();
	pos.left -= bonzo(el).scrollLeft();

	pos.bottom = pos.top + bonzo(span).dim().height;
	bonzo(clone).remove();
	return pos;
}


function getClone(el) {
	var curr_style = [];
	if (window.getComputedStyle) {
	    curr_style = window.getComputedStyle(el);
	} else if (el.currentStyle) {
	    curr_style = _.keys(el.currentStyle || {});
	}
	var div = bonzo(bonzo.create("<div>"));

	// console.log(curr_style);
	_.forEach(curr_style, function(val,i) {
		div.css(val, bonzo(el).css(val));
	});
	div.css("opacity", 0);
	div.css("position", "relative");
	div.css("display", "block");
	div.css("white-space", "pre");
	return div[0];
}
