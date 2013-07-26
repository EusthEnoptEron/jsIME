/*!
 * jQuery JavaScript Library v1.7.2
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Wed Mar 21 12:46:34 2012 -0700
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document,
	navigator = window.navigator,
	location = window.location;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Matches dashed string for camelizing
	rdashAlpha = /-([a-z]|[0-9])/ig,
	rmsPrefix = /^-ms-/,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// The deferred used on DOM ready
	readyList,

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = quickExpr.exec( selector );
			}

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context ? context.ownerDocument || context : document );

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = ( ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.7.2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.add( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {
		// Either a released hold or an DOMready/load event and not yet ready
		if ( (wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.fireWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).off( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyList ) {
			return;
		}

		readyList = jQuery.Callbacks( "once memory" );

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!hasOwn.call(obj, "constructor") &&
				!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}
		var xml, tmp;
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction( object );

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( object[ i ], i, object[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type( array );

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array, i ) {
		var len;

		if ( array ) {
			if ( indexOf ) {
				return indexOf.call( array, elem, i );
			}

			len = array.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in array && array[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key, ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		if ( typeof context === "string" ) {
			var tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		var args = slice.call( arguments, 2 ),
			proxy = function() {
				return fn.apply( context, args.concat( slice.call( arguments ) ) );
			};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
		var exec,
			bulk = key == null,
			i = 0,
			length = elems.length;

		// Sets many values
		if ( key && typeof key === "object" ) {
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
			}
			chainable = 1;

		// Sets one value
		} else if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = pass === undefined && jQuery.isFunction( value );

			if ( bulk ) {
				// Bulk operations only iterate when executing function values
				if ( exec ) {
					exec = fn;
					fn = function( elem, key, value ) {
						return exec.call( jQuery( elem ), value );
					};

				// Otherwise they run against the entire set
				} else {
					fn.call( elems, value );
					fn = null;
				}
			}

			if ( fn ) {
				for (; i < length; i++ ) {
					fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
				}
			}

			chainable = 1;
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySub( selector, context ) {
			return new jQuerySub.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySub, this );
		jQuerySub.superclass = this;
		jQuerySub.fn = jQuerySub.prototype = this();
		jQuerySub.fn.constructor = jQuerySub;
		jQuerySub.sub = this.sub;
		jQuerySub.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
				context = jQuerySub( context );
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
		};
		jQuerySub.fn.init.prototype = jQuerySub.fn;
		var rootjQuerySub = jQuerySub(document);
		return jQuerySub;
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

return jQuery;

})();


// String to Object flags format cache
var flagsCache = {};

// Convert String-formatted flags into Object-formatted ones and store in cache
function createFlags( flags ) {
	var object = flagsCache[ flags ] = {},
		i, length;
	flags = flags.split( /\s+/ );
	for ( i = 0, length = flags.length; i < length; i++ ) {
		object[ flags[i] ] = true;
	}
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	flags:	an optional list of space-separated flags that will change how
 *			the callback list behaves
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible flags:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( flags ) {

	// Convert flags from String-formatted to Object-formatted
	// (we check in cache first)
	flags = flags ? ( flagsCache[ flags ] || createFlags( flags ) ) : {};

	var // Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function( args ) {
			var i,
				length,
				elem,
				type,
				actual;
			for ( i = 0, length = args.length; i < length; i++ ) {
				elem = args[ i ];
				type = jQuery.type( elem );
				if ( type === "array" ) {
					// Inspect recursively
					add( elem );
				} else if ( type === "function" ) {
					// Add if not in unique mode and callback is not in
					if ( !flags.unique || !self.has( elem ) ) {
						list.push( elem );
					}
				}
			}
		},
		// Fire callbacks
		fire = function( context, args ) {
			args = args || [];
			memory = !flags.memory || [ context, args ];
			fired = true;
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( context, args ) === false && flags.stopOnFalse ) {
					memory = true; // Mark as halted
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( !flags.once ) {
					if ( stack && stack.length ) {
						memory = stack.shift();
						self.fireWith( memory[ 0 ], memory[ 1 ] );
					}
				} else if ( memory === true ) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					var length = list.length;
					add( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away, unless previous
					// firing was halted (stopOnFalse)
					} else if ( memory && memory !== true ) {
						firingStart = length;
						fire( memory[ 0 ], memory[ 1 ] );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					var args = arguments,
						argIndex = 0,
						argLength = args.length;
					for ( ; argIndex < argLength ; argIndex++ ) {
						for ( var i = 0; i < list.length; i++ ) {
							if ( args[ argIndex ] === list[ i ] ) {
								// Handle firingIndex and firingLength
								if ( firing ) {
									if ( i <= firingLength ) {
										firingLength--;
										if ( i <= firingIndex ) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice( i--, 1 );
								// If we have some unicity property then
								// we only need to do this once
								if ( flags.unique ) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				if ( list ) {
					var i = 0,
						length = list.length;
					for ( ; i < length; i++ ) {
						if ( fn === list[ i ] ) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory || memory === true ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( stack ) {
					if ( firing ) {
						if ( !flags.once ) {
							stack.push( [ context, args ] );
						}
					} else if ( !( flags.once && memory ) ) {
						fire( context, args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};




var // Static reference to slice
	sliceDeferred = [].slice;

jQuery.extend({

	Deferred: function( func ) {
		var doneList = jQuery.Callbacks( "once memory" ),
			failList = jQuery.Callbacks( "once memory" ),
			progressList = jQuery.Callbacks( "memory" ),
			state = "pending",
			lists = {
				resolve: doneList,
				reject: failList,
				notify: progressList
			},
			promise = {
				done: doneList.add,
				fail: failList.add,
				progress: progressList.add,

				state: function() {
					return state;
				},

				// Deprecated
				isResolved: doneList.fired,
				isRejected: failList.fired,

				then: function( doneCallbacks, failCallbacks, progressCallbacks ) {
					deferred.done( doneCallbacks ).fail( failCallbacks ).progress( progressCallbacks );
					return this;
				},
				always: function() {
					deferred.done.apply( deferred, arguments ).fail.apply( deferred, arguments );
					return this;
				},
				pipe: function( fnDone, fnFail, fnProgress ) {
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( {
							done: [ fnDone, "resolve" ],
							fail: [ fnFail, "reject" ],
							progress: [ fnProgress, "notify" ]
						}, function( handler, data ) {
							var fn = data[ 0 ],
								action = data[ 1 ],
								returned;
							if ( jQuery.isFunction( fn ) ) {
								deferred[ handler ](function() {
									returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise().then( newDefer.resolve, newDefer.reject, newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								});
							} else {
								deferred[ handler ]( newDefer[ action ] );
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					if ( obj == null ) {
						obj = promise;
					} else {
						for ( var key in promise ) {
							obj[ key ] = promise[ key ];
						}
					}
					return obj;
				}
			},
			deferred = promise.promise({}),
			key;

		for ( key in lists ) {
			deferred[ key ] = lists[ key ].fire;
			deferred[ key + "With" ] = lists[ key ].fireWith;
		}

		// Handle state
		deferred.done( function() {
			state = "resolved";
		}, failList.disable, progressList.lock ).fail( function() {
			state = "rejected";
		}, doneList.disable, progressList.lock );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( firstParam ) {
		var args = sliceDeferred.call( arguments, 0 ),
			i = 0,
			length = args.length,
			pValues = new Array( length ),
			count = length,
			pCount = length,
			deferred = length <= 1 && firstParam && jQuery.isFunction( firstParam.promise ) ?
				firstParam :
				jQuery.Deferred(),
			promise = deferred.promise();
		function resolveFunc( i ) {
			return function( value ) {
				args[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				if ( !( --count ) ) {
					deferred.resolveWith( deferred, args );
				}
			};
		}
		function progressFunc( i ) {
			return function( value ) {
				pValues[ i ] = arguments.length > 1 ? sliceDeferred.call( arguments, 0 ) : value;
				deferred.notifyWith( promise, pValues );
			};
		}
		if ( length > 1 ) {
			for ( ; i < length; i++ ) {
				if ( args[ i ] && args[ i ].promise && jQuery.isFunction( args[ i ].promise ) ) {
					args[ i ].promise().then( resolveFunc(i), deferred.reject, progressFunc(i) );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( deferred, args );
			}
		} else if ( deferred !== firstParam ) {
			deferred.resolveWith( deferred, length ? [ firstParam ] : [] );
		}
		return promise;
	}
});




jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		fragment,
		tds,
		events,
		eventName,
		i,
		isSupported,
		div = document.createElement( "div" ),
		documentElement = document.documentElement;

	// Preliminary tests
	div.setAttribute("className", "t");
	div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName( "*" );
	a = div.getElementsByTagName( "a" )[ 0 ];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement( "select" );
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName( "input" )[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		pixelMargin: true
	};

	// jQuery.boxModel DEPRECATED in 1.3, use jQuery.support.boxModel instead
	jQuery.boxModel = support.boxModel = (document.compatMode === "CSS1Compat");

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent( "onclick" );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute("type", "radio");
	support.radioValue = input.value === "t";

	input.setAttribute("checked", "checked");

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "name", "t" );

	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for ( i in {
			submit: 1,
			change: 1,
			focusin: 1
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	fragment.removeChild( div );

	// Null elements to avoid leaks in IE
	fragment = select = opt = div = input = null;

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, outer, inner, table, td, offsetSupport,
			marginDiv, conMarginTop, style, html, positionTopLeftWidthHeight,
			paddingMarginBorderVisibility, paddingMarginBorder,
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		conMarginTop = 1;
		paddingMarginBorder = "padding:0;margin:0;border:";
		positionTopLeftWidthHeight = "position:absolute;top:0;left:0;width:1px;height:1px;";
		paddingMarginBorderVisibility = paddingMarginBorder + "0;visibility:hidden;";
		style = "style='" + positionTopLeftWidthHeight + paddingMarginBorder + "5px solid #000;";
		html = "<div " + style + "display:block;'><div style='" + paddingMarginBorder + "0;display:block;overflow:hidden;'></div></div>" +
			"<table " + style + "' cellpadding='0' cellspacing='0'>" +
			"<tr><td></td></tr></table>";

		container = document.createElement("div");
		container.style.cssText = paddingMarginBorderVisibility + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td style='" + paddingMarginBorder + "0;display:none'></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName( "td" );
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check if div with explicit width and no margin-right incorrectly
		// gets computed margin-right based on width of container. For more
		// info see bug #3333
		// Fails in WebKit before Feb 2011 nightlies
		// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
		if ( window.getComputedStyle ) {
			div.innerHTML = "";
			marginDiv = document.createElement( "div" );
			marginDiv.style.width = "0";
			marginDiv.style.marginRight = "0";
			div.style.width = "2px";
			div.appendChild( marginDiv );
			support.reliableMarginRight =
				( parseInt( ( window.getComputedStyle( marginDiv, null ) || { marginRight: 0 } ).marginRight, 10 ) || 0 ) === 0;
		}

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.innerHTML = "";
			div.style.width = div.style.padding = "1px";
			div.style.border = 0;
			div.style.overflow = "hidden";
			div.style.display = "inline";
			div.style.zoom = 1;
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "block";
			div.style.overflow = "visible";
			div.innerHTML = "<div style='width:5px;'></div>";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );
		}

		div.style.cssText = positionTopLeftWidthHeight + paddingMarginBorderVisibility;
		div.innerHTML = html;

		outer = div.firstChild;
		inner = outer.firstChild;
		td = outer.nextSibling.firstChild.firstChild;

		offsetSupport = {
			doesNotAddBorder: ( inner.offsetTop !== 5 ),
			doesAddBorderForTableAndCells: ( td.offsetTop === 5 )
		};

		inner.style.position = "fixed";
		inner.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		offsetSupport.fixedPosition = ( inner.offsetTop === 20 || inner.offsetTop === 15 );
		inner.style.position = inner.style.top = "";

		outer.style.overflow = "hidden";
		outer.style.position = "relative";

		offsetSupport.subtractsBorderForOverflowNotVisible = ( inner.offsetTop === -5 );
		offsetSupport.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== conMarginTop );

		if ( window.getComputedStyle ) {
			div.style.marginTop = "1%";
			support.pixelMargin = ( window.getComputedStyle( div, null ) || { marginTop: 0 } ).marginTop !== "1%";
		}

		if ( typeof container.style.zoom !== "undefined" ) {
			container.style.zoom = 1;
		}

		body.removeChild( container );
		marginDiv = div = container = null;

		jQuery.extend( support, offsetSupport );
	});

	return support;
})();




var rbrace = /^(?:\{.*\}|\[.*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var privateCache, thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey,
			isEvents = name === "events";

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = ++jQuery.uuid;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		privateCache = thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Users should not attempt to inspect the internal events object using jQuery.data,
		// it is undocumented and subject to change. But does anyone listen? No.
		if ( isEvents && !thisCache[ name ] ) {
			return privateCache.events;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ internalKey ] : internalKey;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split( " " );
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		// Ensure that `cache` is not a window object #10080
		if ( jQuery.support.deleteExpando || !cache.setInterval ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the cache and need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ internalKey ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( internalKey );
			} else {
				elem[ internalKey ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, part, attr, name, l,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attr = elem.attributes;
					for ( l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split( ".", 2 );
		parts[1] = parts[1] ? "." + parts[1] : "";
		part = parts[1] + "!";

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				data = this.triggerHandler( "getData" + part, [ parts[0] ] );

				// Try to fetch any internally stored data first
				if ( data === undefined && elem ) {
					data = jQuery.data( elem, key );
					data = dataAttr( elem, key, data );
				}

				return data === undefined && parts[1] ?
					this.data( parts[0] ) :
					data;
			}

			parts[1] = value;
			this.each(function() {
				var self = jQuery( this );

				self.triggerHandler( "setData" + part, parts );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + part, parts );
			});
		}, null, value, arguments.length > 1, null, false );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				jQuery.isNumeric( data ) ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




function handleQueueMarkDefer( elem, type, src ) {
	var deferDataKey = type + "defer",
		queueDataKey = type + "queue",
		markDataKey = type + "mark",
		defer = jQuery._data( elem, deferDataKey );
	if ( defer &&
		( src === "queue" || !jQuery._data(elem, queueDataKey) ) &&
		( src === "mark" || !jQuery._data(elem, markDataKey) ) ) {
		// Give room for hard-coded callbacks to fire first
		// and eventually mark/queue something else on the element
		setTimeout( function() {
			if ( !jQuery._data( elem, queueDataKey ) &&
				!jQuery._data( elem, markDataKey ) ) {
				jQuery.removeData( elem, deferDataKey, true );
				defer.fire();
			}
		}, 0 );
	}
}

jQuery.extend({

	_mark: function( elem, type ) {
		if ( elem ) {
			type = ( type || "fx" ) + "mark";
			jQuery._data( elem, type, (jQuery._data( elem, type ) || 0) + 1 );
		}
	},

	_unmark: function( force, elem, type ) {
		if ( force !== true ) {
			type = elem;
			elem = force;
			force = false;
		}
		if ( elem ) {
			type = type || "fx";
			var key = type + "mark",
				count = force ? 0 : ( (jQuery._data( elem, key ) || 1) - 1 );
			if ( count ) {
				jQuery._data( elem, key, count );
			} else {
				jQuery.removeData( elem, key, true );
				handleQueueMarkDefer( elem, type, "mark" );
			}
		}
	},

	queue: function( elem, type, data ) {
		var q;
		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			q = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !q || jQuery.isArray(data) ) {
					q = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					q.push( data );
				}
			}
			return q || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift(),
			hooks = {};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			jQuery._data( elem, type + ".run", hooks );
			fn.call( elem, function() {
				jQuery.dequeue( elem, type );
			}, hooks );
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue " + type + ".run", true );
			handleQueueMarkDefer( elem, type, "queue" );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, object ) {
		if ( typeof type !== "string" ) {
			object = type;
			type = undefined;
		}
		type = type || "fx";
		var defer = jQuery.Deferred(),
			elements = this,
			i = elements.length,
			count = 1,
			deferDataKey = type + "defer",
			queueDataKey = type + "queue",
			markDataKey = type + "mark",
			tmp;
		function resolve() {
			if ( !( --count ) ) {
				defer.resolveWith( elements, [ elements ] );
			}
		}
		while( i-- ) {
			if (( tmp = jQuery.data( elements[ i ], deferDataKey, undefined, true ) ||
					( jQuery.data( elements[ i ], queueDataKey, undefined, true ) ||
						jQuery.data( elements[ i ], markDataKey, undefined, true ) ) &&
					jQuery.data( elements[ i ], deferDataKey, jQuery.Callbacks( "once memory" ), true ) )) {
				count++;
				tmp.add( resolve );
			}
		}
		resolve();
		return defer.promise( object );
	}
});




var rclass = /[\n\t\r]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	nodeHook, boolHook, fixSpecified;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( !~setClass.indexOf( " " + classNames[ c ] + " " ) ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classNames, i, l, elem, className, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			classNames = ( value || "" ).split( rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						className = (" " + elem.className + " ").replace( rclass, " " );
						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[ c ] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var self = jQuery(this), val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, "" + value );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, l, isBool,
			i = 0;

		if ( value && elem.nodeType === 1 ) {
			attrNames = value.toLowerCase().split( rspace );
			l = attrNames.length;

			for ( ; i < l; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;
					isBool = rboolean.test( name );

					// See #9699 for explanation of this approach (setting first, then removal)
					// Do not do this for boolean attributes (see #10870)
					if ( !isBool ) {
						jQuery.attr( elem, name, "" );
					}
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( isBool && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true,
		coords: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.nodeValue !== "" : ret.specified ) ?
				ret.nodeValue :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.nodeValue = value + "" );
		}
	};

	// Apply the nodeHook to tabindex
	jQuery.attrHooks.tabindex.set = nodeHook.set;

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = "" + value );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});




var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/,
	rhoverHack = /(?:^|\s)hover(\.\S+)?\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
	quickParse = function( selector ) {
		var quick = rquickIs.exec( selector );
		if ( quick ) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = ( quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp( "(?:^|\\s)" + quick[3] + "(?:\\s|$)" );
		}
		return quick;
	},
	quickIs = function( elem, m ) {
		var attrs = elem.attributes || {};
		return (
			(!m[1] || elem.nodeName.toLowerCase() === m[1]) &&
			(!m[2] || (attrs.id || {}).value === m[2]) &&
			(!m[3] || m[3].test( (attrs[ "class" ] || {}).value ))
		);
	},
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, quick, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				quick: selector && quickParse( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			t, tns, type, origType, namespaces, origCount,
			j, events, special, handle, eventType, handleObj;

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, [ "events", "handle" ], true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var type = event.type || event,
			namespaces = [],
			cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			old = null;
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old && old === elem.ownerDocument ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = [].slice.call( arguments, 0 ),
			run_all = !event.exclusive && !event.namespace,
			special = jQuery.event.special[ event.type ] || {},
			handlerQueue = [],
			i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers that should run if there are delegated events
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !(event.button && event.type === "click") ) {

			// Pregenerate a single jQuery object for reuse with .is()
			jqcur = jQuery(this);
			jqcur.context = this.ownerDocument || this;

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

				// Don't process events on disabled elements (#6911, #8165)
				if ( cur.disabled !== true ) {
					selMatch = {};
					matches = [];
					jqcur[0] = cur;
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];
						sel = handleObj.selector;

						if ( selMatch[ sel ] === undefined ) {
							selMatch[ sel ] = (
								handleObj.quick ? quickIs( cur, handleObj.quick ) : jqcur.is( sel )
							);
						}
						if ( selMatch[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, matches: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
		if ( event.metaKey === undefined ) {
			event.metaKey = event.ctrlKey;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady
		},

		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector,
				ret;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !form._submit_attached ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					form._submit_attached = true;
				}
			});
			// return undefined since we don't need an event listener
		},
		
		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
							jQuery.event.simulate( "change", this, event, true );
						}
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !elem._change_attached ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					elem._change_attached = true;
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) { // && selector != null
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			var handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( var type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length == 1? this.off( selector, "**" ) : this.off( types, selector, fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});



/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	expando = "sizcache" + (Math.random() + '').replace('.', ''),
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rReturn = /\r\n/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;

	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];

			parts.push( m[1] );

			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context, seed );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}

				set = posProcess( selector, set, seed );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set, i, len, match, type, left;

	if ( !expr ) {
		return [];
	}

	for ( i = 0, len = Expr.order.length; i < len; i++ ) {
		type = Expr.order[i];

		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		type, found, item, filter, left,
		i, pass,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				filter = Expr.filter[ type ];
				left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							pass = not ^ found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Utility function for retreiving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
var getText = Sizzle.getText = function( elem ) {
    var i, node,
		nodeType = elem.nodeType,
		ret = "";

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent || innerText for elements
			if ( typeof elem.textContent === 'string' ) {
				return elem.textContent;
			} else if ( typeof elem.innerText === 'string' ) {
				// Replace IE's carriage returns
				return elem.innerText.replace( rReturn, '' );
			} else {
				// Traverse it's children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
	} else {

		// If no nodeType, this is expected to be an array
		for ( i = 0; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			if ( node.nodeType !== 8 ) {
				ret += getText( node );
			}
		}
	}
	return ret;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );

			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}

			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},

	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},

		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			var attr = elem.getAttribute( "type" ), type = elem.type;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" && "text" === type && ( attr === type || attr === null );
		},

		radio: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
		},

		file: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
		},

		password: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
		},

		submit: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "submit" === elem.type;
		},

		image: function( elem ) {
			return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
		},

		reset: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return (name === "input" || name === "button") && "reset" === elem.type;
		},

		button: function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && "button" === elem.type || name === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		},

		focus: function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var first, last,
				doneName, parent, cache,
				count, diff,
				type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) ) {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					if ( type === "first" ) {
						return true;
					}

					node = elem;

					/* falls through */
				case "last":
					while ( (node = node.nextSibling) ) {
						if ( node.nodeType === 1 ) {
							return false;
						}
					}

					return true;

				case "nth":
					first = match[2];
					last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}

					doneName = match[0];
					parent = elem.parentNode;

					if ( parent && (parent[ expando ] !== doneName || !elem.nodeIndex) ) {
						count = 0;

						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						}

						parent[ expando ] = doneName;
					}

					diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
		},

		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Sizzle.attr ?
					Sizzle.attr( elem, name ) :
					Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				!type && Sizzle.attr ?
				result != null :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}
// Expose origPOS
// "global" as in regardless of relation to brackets/parens
Expr.match.globalPOS = origPOS;

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}

	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}

		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );

				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );

					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}

				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );

					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}

						} else {
							return makeArray( [], extra );
						}
					}

					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}

			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

	if ( matches ) {
		// Check to see if it's possible to do matchesSelector
		// on a disconnected node (IE 9 fails this)
		var disconnectedMatch = !matches.call( document.createElement( "div" ), "div" ),
			pseudoWorks = false;

		try {
			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( document.documentElement, "[test!='']:sizzle" );

		} catch( pseudoError ) {
			pseudoWorks = true;
		}

		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try {
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						var ret = matches.call( node, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11 ) {
							return ret;
						}
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}

	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem[ expando ] = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem[ expando ] === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem[ expando ] = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context, seed ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet, seed );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
Sizzle.selectors.attrMap = {};
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.globalPOS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self = this,
			i, l;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		var ret = this.pushStack( "", "find", selector ),
			length, n, r;

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				POS.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];

		// Array (deprecated as of jQuery 1.7)
		if ( jQuery.isArray( selectors ) ) {
			var level = 1;

			while ( cur && cur.ownerDocument && cur !== context ) {
				for ( i = 0; i < selectors.length; i++ ) {

					if ( jQuery( cur ).is( selectors[ i ] ) ) {
						ret.push({ selector: selectors[ i ], elem: cur, level: level });
					}
				}

				cur = cur.parentNode;
				level++;
			}

			return ret;
		}

		// String
		var pos = POS.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context || cur.nodeType === 11 ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}




function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery.clean(arguments) );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					null;
			}


			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( elem.getElementsByTagName( "*" ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.length ?
				this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
				this;
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || ( l > 1 && i < lastIndex ) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, function( i, elem ) {
					if ( elem.src ) {
						jQuery.ajax({
							type: "GET",
							global: false,
							url: elem.src,
							async: false,
							dataType: "script"
						});
					} else {
						jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "/*$0*/" ) );
					}

					if ( elem.parentNode ) {
						elem.parentNode.removeChild( elem );
					}
				});
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;

	// IE blanks contents when cloning scripts
	} else if ( nodeName === "script" && dest.text !== src.text ) {
		dest.text = src.text;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );

	// Clear flags for bubbling special change/submit events, they must
	// be reattached when the newly cloned events are first activated
	dest.removeAttribute( "_submit_attached" );
	dest.removeAttribute( "_change_attached" );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults, doc,
	first = args[ 0 ];

	// nodes may contain either an explicit document object,
	// a jQuery collection or context object.
	// If nodes[0] contains a valid object to assign to doc
	if ( nodes && nodes[0] ) {
		doc = nodes[0].ownerDocument || nodes[0];
	}

	// Ensure that an attr object doesn't incorrectly stand in as a document object
	// Chrome and Firefox seem to allow this to occur and will throw exception
	// Fixes #8950
	if ( !doc.createDocumentFragment ) {
		doc = document;
	}

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && doc === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		cacheable = true;

		cacheresults = jQuery.fragments[ first ];
		if ( cacheresults && cacheresults !== 1 ) {
			fragment = cacheresults;
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ first ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( elem.type === "checkbox" || elem.type === "radio" ) {
		elem.defaultChecked = elem.checked;
	}
}
// Finds all inputs and passes them to fixDefaultChecked
function findInputs( elem ) {
	var nodeName = ( elem.nodeName || "" ).toLowerCase();
	if ( nodeName === "input" ) {
		fixDefaultChecked( elem );
	// Skip scripts, get other children
	} else if ( nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined" ) {
		jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
	}
}

// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
function shimCloneNode( elem ) {
	var div = document.createElement( "div" );
	safeFragment.appendChild( div );

	div.innerHTML = elem.outerHTML;
	return div.firstChild;
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			// IE<=8 does not properly clone detached, unknown element nodes
			clone = jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ?
				elem.cloneNode( true ) :
				shimCloneNode( elem );

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var checkScriptType, script, j,
				ret = [];

		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Trim whitespace, otherwise indexOf won't work as expected
					var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(),
						wrap = wrapMap[ tag ] || wrapMap._default,
						depth = wrap[0],
						div = context.createElement("div"),
						safeChildNodes = safeFragment.childNodes,
						remove;

					// Append wrapper element to unknown element safe doc fragment
					if ( context === document ) {
						// Use the fragment we've already created for this document
						safeFragment.appendChild( div );
					} else {
						// Use a fragment created with the owner document
						createSafeFragment( context ).appendChild( div );
					}

					// Go to html and back, then peel off extra wrappers
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						var hasBody = rtbody.test(elem),
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;

					// Clear elements from DocumentFragment (safeFragment or otherwise)
					// to avoid hoarding elements. Fixes #11356
					if ( div ) {
						div.parentNode.removeChild( div );

						// Guard against -1 index exceptions in FF3.6
						if ( safeChildNodes.length > 0 ) {
							remove = safeChildNodes[ safeChildNodes.length - 1 ];

							if ( remove && remove.parentNode ) {
								remove.parentNode.removeChild( remove );
							}
						}
					}
				}
			}

			// Resets defaultChecked for any radios and checkboxes
			// about to be appended to the DOM in IE 6/7 (#8060)
			var len;
			if ( !jQuery.support.appendChecked ) {
				if ( elem[0] && typeof (len = elem.length) === "number" ) {
					for ( j = 0; j < len; j++ ) {
						findInputs( elem[j] );
					}
				} else {
					findInputs( elem );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			checkScriptType = function( elem ) {
				return !elem.type || rscriptType.test( elem.type );
			};
			for ( i = 0; ret[i]; i++ ) {
				script = ret[i];
				if ( scripts && jQuery.nodeName( script, "script" ) && (!script.type || rscriptType.test( script.type )) ) {
					scripts.push( script.parentNode ? script.parentNode.removeChild( script ) : script );

				} else {
					if ( script.nodeType === 1 ) {
						var jsTags = jQuery.grep( script.getElementsByTagName( "script" ), checkScriptType );

						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
					}
					fragment.appendChild( script );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id,
			cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g,
	rnum = /^[\-+]?(?:\d*\.)?\d+$/i,
	rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
	rrelNum = /^([\-+])=([\-+.\de]+)/,
	rmargin = /^margin/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },

	// order is important!
	cssExpand = [ "Top", "Right", "Bottom", "Left" ],

	curCSS,

	getComputedStyle,
	currentStyle;

jQuery.fn.css = function( name, value ) {
	return jQuery.access( this, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	}, name, value, arguments.length > 1 );
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( +( ret[1] + 1) * +ret[2] ) + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		var ret, hooks;

		// Make sure that we're working with the right name
		name = jQuery.camelCase( name );
		hooks = jQuery.cssHooks[ name ];
		name = jQuery.cssProps[ name ] || name;

		// cssFloat needs a special treatment
		if ( name === "cssFloat" ) {
			name = "float";
		}

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {},
			ret, name;

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// DEPRECATED in 1.3, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, name ) {
		var ret, defaultView, computedStyle, width,
			style = elem.style;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( (defaultView = elem.ownerDocument.defaultView) &&
				(computedStyle = defaultView.getComputedStyle( elem, null )) ) {

			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// WebKit uses "computed value (percentage if specified)" instead of "used value" for margins
		// which is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( !jQuery.support.pixelMargin && computedStyle && rmargin.test( name ) && rnumnonpx.test( ret ) ) {
			width = style.width;
			style.width = ret;
			ret = computedStyle.width;
			style.width = width;
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left, rsLeft, uncomputed,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && (uncomputed = style[ name ]) ) {
			ret = uncomputed;
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( rnumnonpx.test( ret ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		i = name === "width" ? 1 : 0,
		len = 4;

	if ( val > 0 ) {
		if ( extra !== "border" ) {
			for ( ; i < len; i += 2 ) {
				if ( !extra ) {
					val -= parseFloat( jQuery.css( elem, "padding" + cssExpand[ i ] ) ) || 0;
				}
				if ( extra === "margin" ) {
					val += parseFloat( jQuery.css( elem, extra + cssExpand[ i ] ) ) || 0;
				} else {
					val -= parseFloat( jQuery.css( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
				}
			}
		}

		return val + "px";
	}

	// Fall back to computed then uncomputed css if necessary
	val = curCSS( elem, name );
	if ( val < 0 || val == null ) {
		val = elem.style[ name ];
	}

	// Computed unit is not pixels. Stop here and return.
	if ( rnumnonpx.test(val) ) {
		return val;
	}

	// Normalize "", auto, and prepare for extra
	val = parseFloat( val ) || 0;

	// Add padding, border, margin
	if ( extra ) {
		for ( ; i < len; i += 2 ) {
			val += parseFloat( jQuery.css( elem, "padding" + cssExpand[ i ] ) ) || 0;
			if ( extra !== "padding" ) {
				val += parseFloat( jQuery.css( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
			if ( extra === "margin" ) {
				val += parseFloat( jQuery.css( elem, extra + cssExpand[ i ]) ) || 0;
			}
		}
	}

	return val + "px";
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					return getWidthOrHeight( elem, name, extra );
				} else {
					return jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					});
				}
			}
		},

		set: function( elem, value ) {
			return rnum.test( value ) ?
				value + "px" :
				value;
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( parseFloat( RegExp.$1 ) / 100 ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

jQuery(function() {
	// This hook cannot be added until DOM ready because the support test
	// for it is not run until after DOM ready
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				return jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						return curCSS( elem, "margin-right" );
					} else {
						return elem.style.marginRight;
					}
				});
			}
		};
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return ( width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {

	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i,

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ],
				expanded = {};

			for ( i = 0; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};
});




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			var isSuccess,
				success,
				error,
				statusText = nativeStatusText,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = "" + ( nativeStatusText || statusText );

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( var name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for ( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for ( key in s.converters ) {
				if ( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if ( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for ( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|\?\?/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var inspectData = ( typeof s.data === "string" ) && /^application\/x\-www\-form\-urlencoded/.test( s.contentType );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				inspectData && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2";

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( inspectData ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Clean-up function
		jqXHR.always(function() {
			// Set callback back to previous value
			window[ jsonpCallback ] = previous;
			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( previous ) ) {
				window[ jsonpCallback ]( responseContainer[ 0 ] );
			}
		});

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});




var // #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0,
	xhrCallbacks;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									try {
										responses.text = xhr.responseText;
									} catch( _ ) {
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	iframe, iframeDoc,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	],
	fxNow;

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback );

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					// Reset the inline display of this element to learn if it is
					// being hidden by cascaded rules or not
					if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
						display = elem.style.display = "";
					}

					// Set elements which have been overridden with display: none
					// in a stylesheet to whatever the default browser style is
					// for such an element
					if ( (display === "" && jQuery.css(elem, "display") === "none") ||
						!jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
						jQuery._data( elem, "olddisplay", defaultDisplay(elem.nodeName) );
					}
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[ i ];

				if ( elem.style ) {
					display = elem.style.display;

					if ( display === "" || display === "none" ) {
						elem.style.display = jQuery._data( elem, "olddisplay" ) || "";
					}
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			var elem, display,
				i = 0,
				j = this.length;

			for ( ; i < j; i++ ) {
				elem = this[i];
				if ( elem.style ) {
					display = jQuery.css( elem, "display" );

					if ( display !== "none" && !jQuery._data( elem, "olddisplay" ) ) {
						jQuery._data( elem, "olddisplay", display );
					}
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				if ( this[i].style ) {
					this[i].style.display = "none";
				}
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed( speed, easing, callback );

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete, [ false ] );
		}

		// Do not change referenced properties as per-property easing will be lost
		prop = jQuery.extend( {}, prop );

		function doAnimation() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			if ( optall.queue === false ) {
				jQuery._mark( this );
			}

			var opt = jQuery.extend( {}, optall ),
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				name, val, p, e, hooks, replace,
				parts, start, end, unit,
				method;

			// will store per property easing and be used to determine when an animation is complete
			opt.animatedProperties = {};

			// first pass over propertys to expand / normalize
			for ( p in prop ) {
				name = jQuery.camelCase( p );
				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
				}

				if ( ( hooks = jQuery.cssHooks[ name ] ) && "expand" in hooks ) {
					replace = hooks.expand( prop[ name ] );
					delete prop[ name ];

					// not quite $.extend, this wont overwrite keys already present.
					// also - reusing 'p' from above because we have the correct "name"
					for ( p in replace ) {
						if ( ! ( p in prop ) ) {
							prop[ p ] = replace[ p ];
						}
					}
				}
			}

			for ( name in prop ) {
				val = prop[ name ];
				// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
				if ( jQuery.isArray( val ) ) {
					opt.animatedProperties[ name ] = val[ 1 ];
					val = prop[ name ] = val[ 0 ];
				} else {
					opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
				}

				if ( val === "hide" && hidden || val === "show" && !hidden ) {
					return opt.complete.call( this );
				}

				if ( isElement && ( name === "height" || name === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {

						// inline-level elements accept inline-block;
						// block-level elements need to be inline with layout
						if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
							this.style.display = "inline-block";

						} else {
							this.style.zoom = 1;
						}
					}
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			for ( p in prop ) {
				e = new jQuery.fx( this, opt, p );
				val = prop[ p ];

				if ( rfxtypes.test( val ) ) {

					// Tracks whether to show or hide based on private
					// data attached to the element
					method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
					if ( method ) {
						jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
						e[ method ]();
					} else {
						e[ val ]();
					}

				} else {
					parts = rfxnum.exec( val );
					start = e.cur();

					if ( parts ) {
						end = parseFloat( parts[2] );
						unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( this, p, (end || 1) + unit);
							start = ( (end || 1) / e.cur() ) * start;
							jQuery.style( this, p, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			}

			// For JS strict compliance
			return true;
		}

		return optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},

	stop: function( type, clearQueue, gotoEnd ) {
		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var index,
				hadTimers = false,
				timers = jQuery.timers,
				data = jQuery._data( this );

			// clear marker counters if we know they won't be
			if ( !gotoEnd ) {
				jQuery._unmark( true, this );
			}

			function stopQueue( elem, data, index ) {
				var hooks = data[ index ];
				jQuery.removeData( elem, index, true );
				hooks.stop( gotoEnd );
			}

			if ( type == null ) {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && index.indexOf(".run") === index.length - 4 ) {
						stopQueue( this, data, index );
					}
				}
			} else if ( data[ index = type + ".run" ] && data[ index ].stop ){
				stopQueue( this, data, index );
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					if ( gotoEnd ) {

						// force the next step to be the last
						timers[ index ]( true );
					} else {
						timers[ index ].saveState();
					}
					hadTimers = true;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( !( gotoEnd && hadTimers ) ) {
				jQuery.dequeue( this, type );
			}
		});
	}

});

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout( clearFxNow, 0 );
	return ( fxNow = jQuery.now() );
}

function clearFxNow() {
	fxNow = undefined;
}

// Generate parameters to create a standard animation
function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice( 0, num )), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx( "show", 1 ),
	slideUp: genFx( "hide", 1 ),
	slideToggle: genFx( "toggle", 1 ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

		// normalize opt.queue - true/undefined/null -> "fx"
		if ( opt.queue == null || opt.queue === true ) {
			opt.queue = "fx";
		}

		// Queueing
		opt.old = opt.complete;

		opt.complete = function( noUnmark ) {
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}

			if ( opt.queue ) {
				jQuery.dequeue( this, opt.queue );
			} else if ( noUnmark !== false ) {
				jQuery._unmark( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p ) {
			return p;
		},
		swing: function( p ) {
			return ( -Math.cos( p*Math.PI ) / 2 ) + 0.5;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		options.orig = options.orig || {};
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		( jQuery.fx.step[ this.prop ] || jQuery.fx.step._default )( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[ this.prop ] != null && (!this.elem.style || this.elem.style[ this.prop ] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = fxNow || createFxNow();
		this.end = to;
		this.now = this.start = from;
		this.pos = this.state = 0;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );

		function t( gotoEnd ) {
			return self.step( gotoEnd );
		}

		t.queue = this.options.queue;
		t.elem = this.elem;
		t.saveState = function() {
			if ( jQuery._data( self.elem, "fxshow" + self.prop ) === undefined ) {
				if ( self.options.hide ) {
					jQuery._data( self.elem, "fxshow" + self.prop, self.start );
				} else if ( self.options.show ) {
					jQuery._data( self.elem, "fxshow" + self.prop, self.end );
				}
			}
		};

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval( fx.tick, fx.interval );
		}
	},

	// Simple 'show' function
	show: function() {
		var dataShow = jQuery._data( this.elem, "fxshow" + this.prop );

		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = dataShow || jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any flash of content
		if ( dataShow !== undefined ) {
			// This show is picking up where a previous hide or show left off
			this.custom( this.cur(), dataShow );
		} else {
			this.custom( this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur() );
		}

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[ this.prop ] = jQuery._data( this.elem, "fxshow" + this.prop ) || jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom( this.cur(), 0 );
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var p, n, complete,
			t = fxNow || createFxNow(),
			done = true,
			elem = this.elem,
			options = this.options;

		if ( gotoEnd || t >= options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			options.animatedProperties[ this.prop ] = true;

			for ( p in options.animatedProperties ) {
				if ( options.animatedProperties[ p ] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {

					jQuery.each( [ "", "X", "Y" ], function( index, value ) {
						elem.style[ "overflow" + value ] = options.overflow[ index ];
					});
				}

				// Hide the element if the "hide" operation was done
				if ( options.hide ) {
					jQuery( elem ).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( options.hide || options.show ) {
					for ( p in options.animatedProperties ) {
						jQuery.style( elem, p, options.orig[ p ] );
						jQuery.removeData( elem, "fxshow" + p, true );
						// Toggle data is no longer needed
						jQuery.removeData( elem, "toggle" + p, true );
					}
				}

				// Execute the complete function
				// in the event that the complete function throws an exception
				// we must ensure it won't be called twice. #5684

				complete = options.complete;
				if ( complete ) {

					options.complete = false;
					complete.call( elem );
				}
			}

			return false;

		} else {
			// classical easing cannot be used with an Infinity duration
			if ( options.duration == Infinity ) {
				this.now = t;
			} else {
				n = t - this.startTime;
				this.state = n / options.duration;

				// Perform the easing function, defaults to swing
				this.pos = jQuery.easing[ options.animatedProperties[this.prop] ]( this.state, n, 0, 1, options.duration );
				this.now = this.start + ( (this.end - this.start) * this.pos );
			}
			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timer,
			timers = jQuery.timers,
			i = 0;

		for ( ; i < timers.length; i++ ) {
			timer = timers[ i ];
			// Checks the timer has not already been removed
			if ( !timer() && timers[ i ] === timer ) {
				timers.splice( i--, 1 );
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

// Ensure props that can't be negative don't go there on undershoot easing
jQuery.each( fxAttrs.concat.apply( [], fxAttrs ), function( i, prop ) {
	// exclude marginTop, marginLeft, marginBottom and marginRight from this list
	if ( prop.indexOf( "margin" ) ) {
		jQuery.fx.step[ prop ] = function( fx ) {
			jQuery.style( fx.elem, prop, Math.max(0, fx.now) + fx.unit );
		};
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

// Try to restore the default display value of an element
function defaultDisplay( nodeName ) {

	if ( !elemdisplay[ nodeName ] ) {

		var body = document.body,
			elem = jQuery( "<" + nodeName + ">" ).appendTo( body ),
			display = elem.css( "display" );
		elem.remove();

		// If the simple way fails,
		// get element's real default display by attaching it to a temp iframe
		if ( display === "none" || display === "" ) {
			// No iframe to use yet, so create it
			if ( !iframe ) {
				iframe = document.createElement( "iframe" );
				iframe.frameBorder = iframe.width = iframe.height = 0;
			}

			body.appendChild( iframe );

			// Create a cacheable copy of the iframe document on first call.
			// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
			// document to it; WebKit & Firefox won't allow reusing the iframe document.
			if ( !iframeDoc || !iframe.createElement ) {
				iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
				iframeDoc.write( ( jQuery.support.boxModel ? "<!doctype html>" : "" ) + "<html><body>" );
				iframeDoc.close();
			}

			elem = iframeDoc.createElement( nodeName );

			iframeDoc.body.appendChild( elem );

			display = jQuery.css( elem, "display" );
			body.removeChild( iframe );
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var getOffset,
	rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	getOffset = function( elem, doc, docElem, box ) {
		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow( doc ),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	getOffset = function( elem, doc, docElem ) {
		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.support.fixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var elem = this[0],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return null;
	}

	if ( elem === doc.body ) {
		return jQuery.offset.bodyOffset( elem );
	}

	return getOffset( elem, doc, doc.documentElement );
};

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					jQuery.support.boxModel && win.document.documentElement[ method ] ||
						win.document.body[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					 top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	var clientProp = "client" + name,
		scrollProp = "scroll" + name,
		offsetProp = "offset" + name;

	// innerHeight and innerWidth
	jQuery.fn[ "inner" + name ] = function() {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, "padding" ) ) :
			this[ type ]() :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn[ "outer" + name ] = function( margin ) {
		var elem = this[0];
		return elem ?
			elem.style ?
			parseFloat( jQuery.css( elem, type, margin ? "margin" : "border" ) ) :
			this[ type ]() :
			null;
	};

	jQuery.fn[ type ] = function( value ) {
		return jQuery.access( this, function( elem, type, value ) {
			var doc, docElemProp, orig, ret;

			if ( jQuery.isWindow( elem ) ) {
				// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
				doc = elem.document;
				docElemProp = doc.documentElement[ clientProp ];
				return jQuery.support.boxModel && docElemProp ||
					doc.body && doc.body[ clientProp ] || docElemProp;
			}

			// Get document width or height
			if ( elem.nodeType === 9 ) {
				// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
				doc = elem.documentElement;

				// when a window > document, IE6 reports a offset[Width/Height] > client[Width/Height]
				// so we can't use max, as it'll choose the incorrect offset[Width/Height]
				// instead we use the correct client[Width/Height]
				// support:IE6
				if ( doc[ clientProp ] >= doc[ scrollProp ] ) {
					return doc[ clientProp ];
				}

				return Math.max(
					elem.body[ scrollProp ], doc[ scrollProp ],
					elem.body[ offsetProp ], doc[ offsetProp ]
				);
			}

			// Get width or height on the element
			if ( value === undefined ) {
				orig = jQuery.css( elem, type );
				ret = parseFloat( orig );
				return jQuery.isNumeric( ret ) ? ret : orig;
			}

			// Set the width or height on the element
			jQuery( elem ).css( type, value );
		}, type, value, arguments.length, null );
	};
});




// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}



})( window );

;!function(exports, undefined) {

  var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };
  var defaultMaxListeners = 10;

  function init() {
    this._events = {};
    if (this._conf) {
      configure.call(this, this._conf);
    }
  }

  function configure(conf) {
    if (conf) {
      
      this._conf = conf;
      
      conf.delimiter && (this.delimiter = conf.delimiter);
      conf.maxListeners && (this._events.maxListeners = conf.maxListeners);
      conf.wildcard && (this.wildcard = conf.wildcard);
      conf.newListener && (this.newListener = conf.newListener);

      if (this.wildcard) {
        this.listenerTree = {};
      }
    }
  }

  function EventEmitter(conf) {
    this._events = {};
    this.newListener = false;
    configure.call(this, conf);
  }

  //
  // Attention, function return type now is array, always !
  // It has zero elements if no any matches found and one or more
  // elements (leafs) if there are matches
  //
  function searchListenerTree(handlers, type, tree, i) {
    if (!tree) {
      return [];
    }
    var listeners=[], leaf, len, branch, xTree, xxTree, isolatedBranch, endReached,
        typeLength = type.length, currentType = type[i], nextType = type[i+1];
    if (i === typeLength && tree._listeners) {
      //
      // If at the end of the event(s) list and the tree has listeners
      // invoke those listeners.
      //
      if (typeof tree._listeners === 'function') {
        handlers && handlers.push(tree._listeners);
        return [tree];
      } else {
        for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
          handlers && handlers.push(tree._listeners[leaf]);
        }
        return [tree];
      }
    }

    if ((currentType === '*' || currentType === '**') || tree[currentType]) {
      //
      // If the event emitted is '*' at this part
      // or there is a concrete match at this patch
      //
      if (currentType === '*') {
        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+1));
          }
        }
        return listeners;
      } else if(currentType === '**') {
        endReached = (i+1 === typeLength || (i+2 === typeLength && nextType === '*'));
        if(endReached && tree._listeners) {
          // The next element has a _listeners, add it to the handlers.
          listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
        }

        for (branch in tree) {
          if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
            if(branch === '*' || branch === '**') {
              if(tree[branch]._listeners && !endReached) {
                listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
              }
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            } else if(branch === nextType) {
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i+2));
            } else {
              // No match on this one, shift into the tree but not in the type array.
              listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
            }
          }
        }
        return listeners;
      }

      listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i+1));
    }

    xTree = tree['*'];
    if (xTree) {
      //
      // If the listener tree will allow any match for this part,
      // then recursively explore all branches of the tree
      //
      searchListenerTree(handlers, type, xTree, i+1);
    }
    
    xxTree = tree['**'];
    if(xxTree) {
      if(i < typeLength) {
        if(xxTree._listeners) {
          // If we have a listener on a '**', it will catch all, so add its handler.
          searchListenerTree(handlers, type, xxTree, typeLength);
        }
        
        // Build arrays of matching next branches and others.
        for(branch in xxTree) {
          if(branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
            if(branch === nextType) {
              // We know the next element will match, so jump twice.
              searchListenerTree(handlers, type, xxTree[branch], i+2);
            } else if(branch === currentType) {
              // Current node matches, move into the tree.
              searchListenerTree(handlers, type, xxTree[branch], i+1);
            } else {
              isolatedBranch = {};
              isolatedBranch[branch] = xxTree[branch];
              searchListenerTree(handlers, type, { '**': isolatedBranch }, i+1);
            }
          }
        }
      } else if(xxTree._listeners) {
        // We have reached the end and still on a '**'
        searchListenerTree(handlers, type, xxTree, typeLength);
      } else if(xxTree['*'] && xxTree['*']._listeners) {
        searchListenerTree(handlers, type, xxTree['*'], typeLength);
      }
    }

    return listeners;
  }

  function growListenerTree(type, listener) {

    type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
    
    //
    // Looks for two consecutive '**', if so, don't add the event at all.
    //
    for(var i = 0, len = type.length; i+1 < len; i++) {
      if(type[i] === '**' && type[i+1] === '**') {
        return;
      }
    }

    var tree = this.listenerTree;
    var name = type.shift();

    while (name) {

      if (!tree[name]) {
        tree[name] = {};
      }

      tree = tree[name];

      if (type.length === 0) {

        if (!tree._listeners) {
          tree._listeners = listener;
        }
        else if(typeof tree._listeners === 'function') {
          tree._listeners = [tree._listeners, listener];
        }
        else if (isArray(tree._listeners)) {

          tree._listeners.push(listener);

          if (!tree._listeners.warned) {

            var m = defaultMaxListeners;
            
            if (typeof this._events.maxListeners !== 'undefined') {
              m = this._events.maxListeners;
            }

            if (m > 0 && tree._listeners.length > m) {

              tree._listeners.warned = true;
              console.error('(node) warning: possible EventEmitter memory ' +
                            'leak detected. %d listeners added. ' +
                            'Use emitter.setMaxListeners() to increase limit.',
                            tree._listeners.length);
              console.trace();
            }
          }
        }
        return true;
      }
      name = type.shift();
    }
    return true;
  };

  // By default EventEmitters will print a warning if more than
  // 10 listeners are added to it. This is a useful default which
  // helps finding memory leaks.
  //
  // Obviously not all Emitters should be limited to 10. This function allows
  // that to be increased. Set to zero for unlimited.

  EventEmitter.prototype.delimiter = '.';

  EventEmitter.prototype.setMaxListeners = function(n) {
    this._events || init.call(this);
    this._events.maxListeners = n;
    if (!this._conf) this._conf = {};
    this._conf.maxListeners = n;
  };

  EventEmitter.prototype.event = '';

  EventEmitter.prototype.once = function(event, fn) {
    this.many(event, 1, fn);
    return this;
  };

  EventEmitter.prototype.many = function(event, ttl, fn) {
    var self = this;

    if (typeof fn !== 'function') {
      throw new Error('many only accepts instances of Function');
    }

    function listener() {
      if (--ttl === 0) {
        self.off(event, listener);
      }
      fn.apply(this, arguments);
    };

    listener._origin = fn;

    this.on(event, listener);

    return self;
  };

  EventEmitter.prototype.emit = function() {
    
    this._events || init.call(this);

    var type = arguments[0];

    if (type === 'newListener' && !this.newListener) {
      if (!this._events.newListener) { return false; }
    }

    // Loop through the *_all* functions and invoke them.
    if (this._all) {
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
      for (i = 0, l = this._all.length; i < l; i++) {
        this.event = type;
        this._all[i].apply(this, args);
      }
    }

    // If there is no 'error' event listener then throw.
    if (type === 'error') {
      
      if (!this._all && 
        !this._events.error && 
        !(this.wildcard && this.listenerTree.error)) {

        if (arguments[1] instanceof Error) {
          throw arguments[1]; // Unhandled 'error' event
        } else {
          throw new Error("Uncaught, unspecified 'error' event.");
        }
        return false;
      }
    }

    var handler;

    if(this.wildcard) {
      handler = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
    }
    else {
      handler = this._events[type];
    }

    if (typeof handler === 'function') {
      this.event = type;
      if (arguments.length === 1) {
        handler.call(this);
      }
      else if (arguments.length > 1)
        switch (arguments.length) {
          case 2:
            handler.call(this, arguments[1]);
            break;
          case 3:
            handler.call(this, arguments[1], arguments[2]);
            break;
          // slower
          default:
            var l = arguments.length;
            var args = new Array(l - 1);
            for (var i = 1; i < l; i++) args[i - 1] = arguments[i];
            handler.apply(this, args);
        }
      return true;
    }
    else if (handler) {
      var l = arguments.length;
      var args = new Array(l - 1);
      for (var i = 1; i < l; i++) args[i - 1] = arguments[i];

      var listeners = handler.slice();
      for (var i = 0, l = listeners.length; i < l; i++) {
        this.event = type;
        listeners[i].apply(this, args);
      }
      return (listeners.length > 0) || this._all;
    }
    else {
      return this._all;
    }

  };

  EventEmitter.prototype.on = function(type, listener) {
    
    if (typeof type === 'function') {
      this.onAny(type);
      return this;
    }

    if (typeof listener !== 'function') {
      throw new Error('on only accepts instances of Function');
    }
    this._events || init.call(this);

    // To avoid recursion in the case that type == "newListeners"! Before
    // adding it to the listeners, first emit "newListeners".
    this.emit('newListener', type, listener);

    if(this.wildcard) {
      growListenerTree.call(this, type, listener);
      return this;
    }

    if (!this._events[type]) {
      // Optimize the case of one listener. Don't need the extra array object.
      this._events[type] = listener;
    }
    else if(typeof this._events[type] === 'function') {
      // Adding the second element, need to change to array.
      this._events[type] = [this._events[type], listener];
    }
    else if (isArray(this._events[type])) {
      // If we've already got an array, just append.
      this._events[type].push(listener);

      // Check for listener leak
      if (!this._events[type].warned) {

        var m = defaultMaxListeners;
        
        if (typeof this._events.maxListeners !== 'undefined') {
          m = this._events.maxListeners;
        }

        if (m > 0 && this._events[type].length > m) {

          this._events[type].warned = true;
          console.error('(node) warning: possible EventEmitter memory ' +
                        'leak detected. %d listeners added. ' +
                        'Use emitter.setMaxListeners() to increase limit.',
                        this._events[type].length);
          console.trace();
        }
      }
    }
    return this;
  };

  EventEmitter.prototype.onAny = function(fn) {

    if(!this._all) {
      this._all = [];
    }

    if (typeof fn !== 'function') {
      throw new Error('onAny only accepts instances of Function');
    }

    // Add the function to the event listener collection.
    this._all.push(fn);
    return this;
  };

  EventEmitter.prototype.addListener = EventEmitter.prototype.on;

  EventEmitter.prototype.off = function(type, listener) {
    if (typeof listener !== 'function') {
      throw new Error('removeListener only takes instances of Function');
    }

    var handlers,leafs=[];

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
    }
    else {
      // does not use listeners(), so no side effect of creating _events[type]
      if (!this._events[type]) return this;
      handlers = this._events[type];
      leafs.push({_listeners:handlers});
    }

    for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
      var leaf = leafs[iLeaf];
      handlers = leaf._listeners;
      if (isArray(handlers)) {

        var position = -1;

        for (var i = 0, length = handlers.length; i < length; i++) {
          if (handlers[i] === listener ||
            (handlers[i].listener && handlers[i].listener === listener) ||
            (handlers[i]._origin && handlers[i]._origin === listener)) {
            position = i;
            break;
          }
        }

        if (position < 0) {
          return this;
        }

        if(this.wildcard) {
          leaf._listeners.splice(position, 1)
        }
        else {
          this._events[type].splice(position, 1);
        }

        if (handlers.length === 0) {
          if(this.wildcard) {
            delete leaf._listeners;
          }
          else {
            delete this._events[type];
          }
        }
      }
      else if (handlers === listener ||
        (handlers.listener && handlers.listener === listener) ||
        (handlers._origin && handlers._origin === listener)) {
        if(this.wildcard) {
          delete leaf._listeners;
        }
        else {
          delete this._events[type];
        }
      }
    }

    return this;
  };

  EventEmitter.prototype.offAny = function(fn) {
    var i = 0, l = 0, fns;
    if (fn && this._all && this._all.length > 0) {
      fns = this._all;
      for(i = 0, l = fns.length; i < l; i++) {
        if(fn === fns[i]) {
          fns.splice(i, 1);
          return this;
        }
      }
    } else {
      this._all = [];
    }
    return this;
  };

  EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

  EventEmitter.prototype.removeAllListeners = function(type) {
    if (arguments.length === 0) {
      !this._events || init.call(this);
      return this;
    }

    if(this.wildcard) {
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

      for (var iLeaf=0; iLeaf<leafs.length; iLeaf++) {
        var leaf = leafs[iLeaf];
        leaf._listeners = null;
      }
    }
    else {
      if (!this._events[type]) return this;
      this._events[type] = null;
    }
    return this;
  };

  EventEmitter.prototype.listeners = function(type) {
    if(this.wildcard) {
      var handlers = [];
      var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
      searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
      return handlers;
    }

    this._events || init.call(this);

    if (!this._events[type]) this._events[type] = [];
    if (!isArray(this._events[type])) {
      this._events[type] = [this._events[type]];
    }
    return this._events[type];
  };

  EventEmitter.prototype.listenersAny = function() {

    if(this._all) {
      return this._all;
    }
    else {
      return [];
    }

  };

  if (typeof define === 'function' && define.amd) {
    define(function() {
      return EventEmitter;
    });
  } else {
    exports.EventEmitter2 = EventEmitter; 
  }

}(typeof process !== 'undefined' && typeof process.title !== 'undefined' && typeof exports !== 'undefined' ? exports : window);

/**
 * jQuery plugin for getting position of cursor in textarea

 * @license under Apache license
 * @author Bevis Zhao (i@bevis.me, http://bevis.me)
 */
$(function() {

	var calculator = {
		// key styles
		primaryStyles: ['fontFamily', 'fontSize', 'fontWeight', 'fontVariant', 'fontStyle',
			'paddingLeft', 'paddingTop', 'paddingBottom', 'paddingRight',
			'marginLeft', 'marginTop', 'marginBottom', 'marginRight',
			'borderLeftColor', 'borderTopColor', 'borderBottomColor', 'borderRightColor',
			'borderLeftStyle', 'borderTopStyle', 'borderBottomStyle', 'borderRightStyle',
			'borderLeftWidth', 'borderTopWidth', 'borderBottomWidth', 'borderRightWidth',
			'line-height', 'outline'],

		specificStyle: {
			'word-wrap': 'break-word',
			'overflow-x': 'hidden',
			'overflow-y': 'auto'
		},

		simulator : $('<div id="textarea_simulator"/>').css({
				position: 'absolute',
				top: 0,
				left: 0,
				visibility: 'hidden'
			}).appendTo(document.body),

		toHtml : function(text) {
			return text.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g, '<br>')
				.split(' ').join('<span style="white-space:prev-wrap">&nbsp;</span>');
		},
		// calculate position
		getCaretPosition: function(cursorPosition) {
			var cal = calculator, self = this, element = self[0], elementOffset = self.offset();

			// IE has easy way to get caret offset position
			if ($.browser.msie) {
				// must get focus first
				element.focus();
			    var range = document.selection.createRange();
			    $('#hskeywords').val(element.scrollTop);
			    return {
			        left: range.boundingLeft - elementOffset.left,
			        top: parseInt(range.boundingTop) - elementOffset.top + element.scrollTop
						+ document.documentElement.scrollTop + parseInt(self.getComputedStyle("fontSize"))
			    };
			}
			cal.simulator.empty();
			// clone primary styles to imitate textarea
			$.each(cal.primaryStyles, function(index, styleName) {
				self.cloneStyle(cal.simulator, styleName);
			});

			// caculate width and height
			cal.simulator.css($.extend({
				'width': self.width(),
				'height': self.height()
			}, cal.specificStyle));

			if(cursorPosition === null)
				 cursorPosition = self.getCursorPosition()
			var value = self.val();
			var beforeText = value.substring(0, cursorPosition),
				afterText = value.substring(cursorPosition);

			var before = $('<span class="before"/>').html(cal.toHtml(beforeText)),
				focus = $('<span class="focus"/>'),
				after = $('<span class="after"/>').html(cal.toHtml(afterText));

			cal.simulator.append(before).append(focus).append(after);
			var focusOffset = focus.offset(), simulatorOffset = cal.simulator.offset();
			// alert(focusOffset.left  + ',' +  simulatorOffset.left + ',' + element.scrollLeft);
			return {
				top: focusOffset.top - simulatorOffset.top - element.scrollTop
					// calculate and add the font height except Firefox
					+ ($.browser.mozilla ? 0 : parseInt(self.getComputedStyle("fontSize"))),
				left: focus[0].offsetLeft -  cal.simulator[0].offsetLeft - element.scrollLeft
			};
		}
	};

	$.fn.extend({
		getComputedStyle: function(styleName) {
			if (this.length == 0) return;
			var thiz = this[0];
			var result = this.css(styleName);
			result = result || ($.browser.msie ?
				thiz.currentStyle[styleName]:
				document.defaultView.getComputedStyle(thiz, null)[styleName]);
			return result;
		},
		// easy clone method
		cloneStyle: function(target, styleName) {
			var styleVal = this.getComputedStyle(styleName);
			if (!!styleVal) {
				$(target).css(styleName, styleVal);
			}
		},
		cloneAllStyle: function(target, style) {
			var thiz = this[0];
			for (var styleName in thiz.style) {
				var val = thiz.style[styleName];
				typeof val == 'string' || typeof val == 'number'
					? this.cloneStyle(target, styleName)
					: NaN;
			}
		},
		getCursorPosition : function() {
	        var thiz = this[0], result = 0;
	        if ('selectionStart' in thiz) {
	            result = thiz.selectionStart;
	        } else if('selection' in document) {
	        	var range = document.selection.createRange();
	        	if (parseInt($.browser.version) > 6) {
		            thiz.focus();
		            var length = document.selection.createRange().text.length;
		            range.moveStart('character', - thiz.value.length);
		            result = range.text.length - length;
	        	} else {
	                var bodyRange = document.body.createTextRange();
	                bodyRange.moveToElementText(thiz);
	                for (; bodyRange.compareEndPoints("StartToStart", range) < 0; result++)
	                	bodyRange.moveStart('character', 1);
	                for (var i = 0; i <= result; i ++){
	                    if (thiz.value.charAt(i) == '\n')
	                        result++;
	                }
	                var enterCount = thiz.value.split('\n').length - 1;
					result -= enterCount;
                    return result;
	        	}
	        }
	        return result;
	    },
		getCaretPosition: calculator.getCaretPosition
	});
});

require=(function(e,t,n){function i(n,s){if(!t[n]){if(!e[n]){var o=typeof require=="function"&&require;if(!s&&o)return o(n,!0);if(r)return r(n,!0);throw new Error("Cannot find module '"+n+"'")}var u=t[n]={exports:{}};e[n][0].call(u.exports,function(t){var r=e[n][1][t];return i(r?r:t)},u,u.exports)}return t[n].exports}var r=typeof require=="function"&&require;for(var s=0;s<n.length;s++)i(n[s]);return i})({"Ikh15T":[function(require,module,exports){
module.exports = {"あるふぁ":["Α","α"],"べーた":["Β","β"],"いぷしろん":["Ε","ε"],"えぷしろん":["Ε","ε"],"しーた":["Θ","θ"],"てーた":["Θ","θ"],"みゅー":["Μ","μ"],"おみくろん":["Ο","ο"],"ろー":["ロー","ρ","Ρ"],"しぐま":["Σ","σ"],"ふぁい":["φ","Φ"],"ふぃー":["φ","Φ"],"おめが":["Ω","ω"],"おなじ":["同じ","々"],"おなじく":["同じく","々"],"くりかえし":["ヽ","々","ゞ","繰り返し","ヾ","繰り返し","ゝ"],"しめ":["締め","〆","占め","シメ"],"かんすうじぜろ":["〇"],"まる":["円","丸","〇"],"あ":["あ","彼","我","亜","吾"],"ああ":["ああ","嗚呼"],"ああいう":["ああいう"],"あいた":["開いた","空いた","あいた"],"あけおめ":["あけおめ"],"あさひ":["朝日","旭","あさひ"],"あたふた":["あたふた"],"あだな":["あだ名"],"あっさり":["あっさり"],"あっての":["あっての"],"あっと":["あっと","アット"],"あっというま":["あっという間"],"あっというまに":["あっという間に","あっと言う間に"],"あっとゆうまに":["あっと言う間に"],"あの":["あの","彼の"],"あのね":["あのね"],"あのひと":["あの人"],"あのかた":["あの方"],"あのころ":["あの頃"],"あや":["文","あや","綾"],"あら":["新","あら","アラ","粗"],"あられ":["あられ"],"ありがと":["ありがと"],"ありえない":["あり得ない","有り得ない"],"ありえなかった":["あり得なかった","有り得なかった"],"ありえなくない":["あり得なくない","有り得なくない"],"ありえなくて":["あり得なくて","有り得なくて"],"ありかた":["あり方"],"あるある":["あるある"],"あるがまま":["あるがまま"],"あるらしい":["あるらしい"],"あるいみで":["ある意味で"],"あるひ":["ある日"],"あるとき":["ある時"],"あるていど":["ある程度"],"あるしゅ":["ある種"],"あるかぎり":["ある限り"],"あれから":["あれから"],"あれだけ":["あれだけ"],"あんた":["あんた"],"あんな":["あんな"],"あんなに":["あんなに"],"あーあ":["あーあ"],"いいから":["いいから"],"いいとこ":["いいとこ"],"いいところ":["いいところ"],"いいとも":["いいとも"],"いいかげん":["いい加減"],"いいこ":["いい子"],"いいき":["いい気"],"いく":["行く","いく","逝く"],"いった":["行った","言った","いった","入った","云った","逝った","要った"],"いかない":["行かない","いかない","逝かない"],"いき":["行き","いき","行き","生き","息","生き","粋","域","意気","逝き"],"いって":["行って","言って","いって","入って","云って","逝って","要って"],"いける":["行ける","いける","行ける","逝ける"],"いかれる":["行かれる","いかれる","怒れる","逝かれる"],"いざ":["いざ"],"いちはやく":["いち早く"],"いつのまにか":["いつの間にか"],"いつのまにやら":["いつの間にやら"],"いつもとおり":["いつも通り"],"いと":["糸","意図","いと","幼"],"いなくなった":["いなくなった"],"いなくなる":["いなくなる"],"いやだ":["いやだ"],"いやはや":["いやはや"],"いらしてください":["いらしてください"],"いらっしゃい":["いらっしゃい","いらっしゃい"],"いらっしゃいませ":["いらっしゃいませ"],"いらっしゃる":["いらっしゃる"],"いらっしゃった":["いらっしゃった"],"いらっしゃらない":["いらっしゃらない"],"いらっしゃって":["いらっしゃって"],"いらっしゃり得る":["いらっしゃり得る"],"うず":["渦","うず"],"うたたね":["うたた寝"],"うだうだ":["うだうだ"],"うっかり":["うっかり"],"うっとり":["うっとり"],"うつびょう":["うつ病"],"うねり":["うねり"],"うふふ":["うふふ"],"うまいはなし":["うまい話"],"うむ":["うむ","有無","生む","産む"],"うろうろ":["うろうろ"],"うろおぼえ":["うろ覚え"],"うわ":["上","うわ"],"うわー":["うわー"],"うん":["うん","運"],"うんうん":["うんうん"],"うんざり":["うんざり"],"うんと":["うんと"],"うーん":["うーん"],"え":["方","会","え","絵","縁","柄","画","辺","得","重","餌","江"],"ええ":["ええ"],"えっ":["えっ"],"えっと":["えっと"],"えへへ":["えへへ"],"お":["お","小","御","尾","緒"],"おい":["おい","追い","甥","負","老い"],"おいおい":["おいおい"],"おいた":["おいた","置いた"],"おおい":["多い","おおい"],"おしっこ":["おしっこ"],"おっさん":["おっさん"],"おっと":["夫","おっと"],"おっとり":["おっとり"],"おっぱい":["おっぱい"],"おねだり":["おねだり"],"おは":["おは"],"おみ":["おみ"],"おもろい":["おもろい"],"おもろかった":["おもろかった"],"おもろくない":["おもろくない"],"おもろくて":["おもろくて"],"おや":["親","おや","祖"],"おーい":["おーい"],"おじょうず":["お上手"],"おせわ":["お世話"],"おせわになる":["お世話になる"],"おせじ":["お世辞"],"おちゅうげん":["お中元"],"おひさ":["お久"],"おひさしぶり":["お久しぶり"],"おたがい":["お互い"],"おたがいに":["お互いに"],"おつきあい":["お付き合い"],"おまかせ":["お任せ"],"おやすみ":["お休み"],"おつかい":["お使い"],"おとも":["お供"],"おげんきですか":["お元気ですか"],"おにいさん":["お兄さん"],"おにいちゃん":["お兄ちゃん"],"おさき":["お先"],"おさきに":["お先に"],"おでかけ":["お出かけ","お出掛け"],"おわかれ":["お別れ"],"おまい":["お前"],"おまえ":["お前"],"おめえ":["お前"],"おつとめ":["お勤め"],"おすすめ":["お勧め","お薦め","お奨め"],"おばけ":["お化け"],"おいしゃさん":["お医者さん"],"おまいり":["お参り"],"おといあわせ":["お問い合わせ"],"おしゃべり":["お喋り"],"おみやげ":["お土産"],"おぼうさん":["お坊さん"],"おだいじに":["お大事に"],"おてんき":["お天気"],"おこのみ":["お好み"],"おこのみやき":["お好み焼き"],"おねえさん":["お姉さん"],"おねえちゃん":["お姉ちゃん"],"およめさん":["お嫁さん"],"おじょう":["お嬢"],"おじょうさん":["お嬢さん"],"おじょうさま":["お嬢様"],"おこ":["お子"],"おこさん":["お子さん"],"おこちゃま":["お子ちゃま"],"おこさま":["お子様"],"おまごさん":["お孫さん"],"おたく":["オタク","お宅"],"おまもり":["お守り"],"おもり":["お守り"],"おたから":["お宝"],"おきゃくさま":["お客様","お客さま"],"おきゃくさん":["お客さん"],"おうち":["お家"],"おてら":["お寺"],"おこづかい":["お小遣い"],"おしり":["お尻"],"おかえり":["お帰り"],"おかえりなさい":["お帰りなさい"],"おとしだま":["お年玉"],"おたな":["お店"],"おべんとう":["お弁当"],"おまたせしました":["お待たせしました"],"おまち":["お待ち"],"おて":["お手"],"おてつだい":["お手伝い"],"おてかず":["お手数"],"おてすう":["お手数"],"おひろめ":["お披露目"],"おそろい":["お揃い"],"おことわり":["お断り"],"おかた":["お方"],"おひさま":["お日様"],"おひる":["お昼"],"おいとま":["お暇"],"おさつ":["お札"],"おふだ":["お札"],"おふくろ":["お母"],"おかあさん":["お母さん"],"おかあさま":["お母様"],"おきにいり":["お気に入り"],"おみず":["お水"],"おしゃれ":["お洒落"],"おゆ":["お湯"],"おとうさん":["お父さん"],"おとうさま":["お父様"],"おたま":["お玉"],"おさん":["お産"],"おつかれさま":["お疲れ様"],"おさら":["お皿"],"おぼん":["お盆"],"おめ":["お目"],"おめめ":["お目目"],"おしらせ":["お知らせ"],"おれい":["お礼","御礼"],"おいのり":["お祈り"],"おいわい":["お祝い"],"おまつり":["お祭り"],"おたち":["お立ち"],"おわらい":["お笑い"],"おわらいげいにん":["お笑い芸人"],"おなか":["お腹"],"おなかいっぱい":["お腹いっぱい"],"おはなばたけ":["お花畑"],"おはなみ":["お花見"],"おちゃ":["お茶"],"おかし":["お菓子"],"おすそわけ":["お裾分け"],"おみごと":["お見事"],"おみあい":["お見合い"],"おみまい":["お見舞い"],"おことば":["お言葉"],"おわび":["お詫び"],"おたんじょうびおめでとう":["お誕生日おめでとう"],"おたんじょうびおめでとうございます":["お誕生日おめでとうございます"],"おかいあげ":["お買い上げ"],"おこし":["お越し","起こし","興","起こし"],"おかえし":["お返し"],"おすごし":["お過ごし"],"おじゃま":["お邪魔"],"おじゃまします":["お邪魔します"],"おさけ":["お酒"],"おかね":["お金"],"おなべ":["お鍋"],"おかげ":["お陰"],"おかげで":["お陰で"],"おかげさまで":["お陰様で"],"おとなりさん":["お隣さん"],"おひなさま":["お雛様"],"おかお":["お顔"],"おねがい":["お願い","御願い"],"おねがいいたします":["お願いいたします","お願い致します"],"おねがいします":["お願いします"],"おふろ":["お風呂"],"おもち":["お餅"],"おなじみ":["お馴染み"],"おたかい":["お高い"],"おたかかった":["お高かった"],"おたかくない":["お高くない"],"おたかくて":["お高くて"],"か":["日","火","か","家","夏","下","化","個","個","科","可","課","ヶ","ヶ","鹿","蚊","加","ケ","ケ","果","過","佳"],"かあ":["かあ"],"かい":["回","会","買い","買い","かい","階","界","甲斐","解","改","貝","飼い","怪","下位"],"かきごおり":["かき氷"],"かしら":["頭","かしら"],"かといって":["かと言って"],"かどうか":["かどうか"],"かな":["かな","仮名","哉"],"かなあ":["かなあ"],"かね":["金","かね","鐘"],"かむ":["カム","噛む","かむ"],"かんだ":["噛んだ","かんだ"],"かまない":["噛まない","かまない"],"かみ":["上","神","紙","髪","守","長官","噛み","かみ"],"かんで":["噛んで","かんで"],"かまれる":["噛まれる","かまれる"],"かも":["かも","鴨"],"かもしれん":["かもしれん"],"かもしれない":["かも知れない"],"かもしれません":["かも知れません"],"かよ":["かよ"],"から":["から","空","柄","殻","幹"],"からして":["からして"],"からすると":["からすると"],"からといって":["からと言って"],"からなる":["からなる"],"からには":["からには"],"かん":["間","感","館","汗","観","巻","かん","缶","完","官","冠","管","寒","漢","長官","環","甲","幹","勘","艦","歓"],"が":["が","我","画","雅"],"がっかり":["がっかり"],"がっくり":["がっくり"],"がっちり":["がっちり"],"がっつり":["がっつり","ガッツリ"],"がてら":["がてら"],"がる":["がる","ガル"],"がった":["がった"],"がらない":["がらない"],"がり":["ガリ","ガリ","がり"],"がって":["がって"],"がれる":["がれる"],"がられる":["がられる"],"がれ":["がれ"],"がん":["丸","ガン","がん","願","癌"],"がんば":["がんば"],"きちんと":["きちんと"],"きっちり":["きっちり"],"きつい":["きつい"],"きつかった":["きつかった"],"きつくない":["きつくない"],"きつくて":["きつくて"],"きゃあ":["きゃあ"],"きゃっ":["きゃっ","キャッ"],"きらきら":["きらきら"],"きらり":["きらり"],"ぎっしり":["ぎっしり"],"ぎりぎり":["ぎりぎり"],"くっきり":["くっきり"],"くらい":["くらい","位","暗い"],"くるくる":["くるくる"],"ぐう":["ぐう"],"ぐうたら":["ぐうたら"],"ぐだぐだ":["ぐだぐだ"],"ぐちゃぐちゃ":["ぐちゃぐちゃ"],"ぐっすり":["ぐっすり"],"ぐったり":["ぐったり"],"ぐっと":["ぐっと"],"ぐらい":["ぐらい"],"ぐる":["ぐる"],"ぐるぐる":["ぐるぐる"],"ぐるっと":["ぐるっと"],"ぐるみ":["ぐるみ"],"ぐんぐん":["ぐんぐん"],"け":["気","家","け","仮","毛","異"],"けど":["けど"],"けども":["けども"],"けり":["けり","蹴り"],"けれど":["けれど"],"けれども":["けれども"],"げ":["気","下","げ"],"げっ":["げっ"],"こういった":["こういった"],"こうやって":["こうやって"],"こういう":["こう言う"],"こうゆう":["こう言う"],"ここで":["ここで"],"こそ":["こそ"],"こだま":["こだま"],"こだわり":["こだわり"],"こちらこそ":["こちらこそ"],"こっそり":["こっそり"],"こってり":["こってり"],"こつこつ":["コツコツ","こつこつ"],"ことから":["ことから"],"ことがある":["ことがある"],"ことができる":["ことができる"],"ことができた":["ことができた"],"ことができない":["ことができない"],"ことができ":["ことができ"],"ことができて":["ことができて"],"ことができれる":["ことができれる"],"ことができられる":["ことができられる"],"ことになっている":["ことになっている"],"このため":["このため"],"このほか":["このほか"],"このよ":["この世"],"このうち":["この中"],"このなか":["この中"],"このさき":["この先"],"このまえ":["この前"],"このばあい":["この場合"],"このたび":["この度"],"このて":["この手"],"このかた":["この方"],"このほう":["この方"],"このよう":["この様"],"このけっか":["この結果"],"このへん":["この辺"],"このあいだ":["この間"],"このかん":["この間"],"このさい":["この際"],"このごろ":["この頃"],"こよなく":["こよなく"],"こよなくあいする":["こよなく愛する"],"こら":["こら"],"こりゃ":["こりゃ"],"これ":["これ","是","之"],"これで":["これで"],"これでも":["これでも"],"これにより":["これにより"],"ころ":["頃","ころ","自"],"ころころ":["ころころ"],"ころり":["ころり"],"こんな":["こんな"],"こんなに":["こんなに"],"こんなふうに":["こんな風に"],"こんにちわ":["こんにちわ"],"こんばんわ":["こんばんわ"],"ごくごく":["ごくごく"],"ごっこ":["ごっこ"],"ごまあぶら":["ごま油"],"ごろごろ":["ごろごろ"],"ごりょうしん":["ご両親"],"ごしゅじん":["ご主人"],"ごりょうしょう":["ご了承"],"ごきょうりょく":["ご協力"],"ごぞんじ":["ご存知","ご存じ"],"ごあいさつ":["ご挨拶"],"ごらいてん":["ご来店"],"ごきげん":["ご機嫌"],"ごちゅうい":["ご注意"],"ごちゅうもん":["ご注文"],"ごぶさた":["ご無沙汰"],"ごじしん":["ご自身"],"ごくろう":["ご苦労"],"ごくろうさま":["ご苦労様"],"ごほうび":["ご褒美"],"ごらん":["ご覧","御覧"],"ごらんください":["ご覧ください","ご覧下さい"],"ごめいわく":["ご迷惑"],"ごれんらく":["ご連絡"],"ごえんりょください":["ご遠慮ください","ご遠慮下さい"],"ごはん":["ご飯","御飯"],"ごちそう":["ご馳走"],"ごちそうさまでした":["ご馳走様でした"],"さ":["さ","左","差","矢","沙","然"],"さあ":["さあ"],"さえ":["さえ"],"さえあれば":["さえあれば"],"さく":["作","咲く","策","さく","柵","昨"],"さくさく":["サクサク","さくさく"],"さし":["さし","指し","刺し","差し","刺し"],"さすがに":["さすがに"],"させていただく":["させて頂く"],"させていただいた":["させて頂いた"],"させていただかない":["させて頂かない"],"させていただき":["させて頂き"],"させていただいて":["させて頂いて"],"させていただける":["させて頂ける"],"させていただかれる":["させて頂かれる"],"さっき":["さっき"],"さっさと":["さっさと"],"さっぱり":["さっぱり"],"さてさて":["さてさて"],"さび":["さび","サビ"],"さよなら":["さよなら","サヨナラ"],"さらさら":["さらさら"],"さらば":["さらば"],"されたもの":["されたもの"],"さん":["さん","山","三","サン","産","参","酸"],"ざっと":["ざっと"],"ざる":["ざる"],"し":["し","し","市","子","氏","四","姉","師","死","詩","誌","史","糸","枝","視","シ","司","詞","仕","至"],"しか":["しか","歯科","鹿","然","確"],"しかない":["しかない","若かない","如かない"],"しがない":["しがない"],"しがなかった":["しがなかった"],"しがなくない":["しがなくない"],"しがなくて":["しがなくて"],"したい":["したい","死体"],"したかった":["したかった"],"したくない":["したくない"],"したくて":["したくて"],"したり":["したり"],"したほうがいい":["した方がいい"],"しっくり":["しっくり"],"しっとり":["しっとり"],"しつこい":["しつこい"],"しつこかった":["しつこかった"],"しつこくない":["しつこくない"],"しつこくて":["しつこくて"],"しつつある":["しつつある"],"しつつあった":["しつつあった"],"しつつあ*":["しつつあ*"],"しつつあり":["しつつあり"],"しつつあって":["しつつあって"],"しつつあり得る":["しつつあり得る"],"してみると":["してみると"],"してみれば":["してみれば"],"しばしば":["数","数々","しばしば"],"しばらくのあいだ":["しばらくの間"],"しまった":["しまった"],"しゃぶしゃぶ":["しゃぶしゃぶ"],"しやすい":["しやすい"],"しょっちゅう":["しょっちゅう"],"しょぼい":["しょぼい"],"しょぼかった":["しょぼかった"],"しょぼくない":["しょぼくない"],"しょぼくて":["しょぼくて"],"しろ":["代","白","しろ","城"],"しんどい":["しんどい"],"しんどかった":["しんどかった"],"しんどくない":["しんどくない"],"しんどくて":["しんどくて"],"じっくり":["じっくり"],"じっと":["じっと"],"じゃ":["じゃ","蛇"],"じゃあ":["じゃあ"],"じゃう":["じゃう"],"じゃった":["じゃった"],"じゃわない":["じゃわない"],"じゃい":["じゃい"],"じゃって":["じゃって"],"じゃえる":["じゃえる"],"じゃわれる":["じゃわれる"],"じゃないか":["じゃないか"],"じゃね":["じゃね"],"じゃん":["じゃん"],"すいません":["すいません"],"すか":["スカ","すか"],"すきやき":["すき焼き"],"すくすく":["すくすく"],"すっかり":["すっかり"],"すっきり":["すっきり"],"すっと":["すっと"],"すべく":["すべく"],"すまん":["すまん"],"すら":["すら"],"すると":["すると"],"するべき":["するべき"],"すれば":["すれば"],"すれちがう":["すれ違う"],"すれちがった":["すれ違った"],"すれちがわない":["すれ違わない"],"すれちがい":["すれ違い"],"すれちがって":["すれ違って"],"すれちがえる":["すれ違える"],"すれちがわれる":["すれ違われる"],"すんごい":["すんごい"],"すんごかった":["すんごかった"],"すんごくない":["すんごくない"],"すんごくて":["すんごくて"],"すんなり":["すんなり"],"すんません":["すんません"],"ずっと":["ずっと"],"ずつ":["ずつ"],"ずばり":["ずばり"],"ずぶ":["ずぶ"],"ずれ":["ずれ"],"ずーっと":["ずーっと"],"せず":["せず"],"せずに":["せずに"],"せっせと":["せっせと"],"せめて":["せめて","攻めて","責めて"],"せよ":["せよ"],"ぜ":["ぜ","是"],"そう":["そう","総","相","想","層","荘","琴","候","僧"],"そうか":["そうか","草花"],"そうする":["そうする"],"そうすると":["そうすると"],"そうすれば":["そうすれば"],"そうだ":["そうだ"],"そうです":["そうです"],"そうですが":["そうですが"],"そうですね":["そうですね"],"そうでない":["そうでない"],"そうね":["そうね"],"そういう":["そう言う"],"そうゆう":["そう言う"],"そういえば":["そう言えば"],"そこから":["そこから"],"そこそこ":["そこそこ"],"そこそこに":["そこそこに"],"そこまで":["そこまで"],"そしたら":["そしたら"],"そそくさ":["そそくさ"],"そっか":["そっか"],"そっくり":["そっくり"],"そっと":["そっと"],"そのうえ":["その上"],"そのうえで":["その上で"],"そのた":["その他"],"そのほか":["その他"],"そのかわり":["その代わり"],"そのうち":["その内"],"そのぶん":["その分"],"そのば":["その場"],"そのあと":["その後"],"そのご":["その後"],"そののち":["その後"],"そのかた":["その方"],"そのほう":["その方"],"そのひ":["その日"],"そのとき":["その時"],"そのき":["その気"],"そのけ":["その気"],"そのため":["その為"],"そのあたり":["その辺り"],"そのとおり":["その通り"],"そのみち":["その道"],"そのつど":["その都度"],"そよかぜ":["そよ風"],"そら":["空","そら"],"そりゃ":["そりゃ"],"それ":["それ"],"それこそ":["それこそ"],"それでいて":["それでいて"],"それなのに":["それなのに"],"それにしても":["それにしても"],"それは":["それは"],"それはさておき":["それはさておき"],"それはそうと":["それはそうと"],"それはそれで":["それはそれで"],"それはそれは":["それはそれは"],"それも":["それも"],"それより":["それより"],"それいじょうの":["それ以上の"],"それいらい":["それ以来"],"それほど":["それ程"],"そろそろ":["そろそろ"],"そんで":["そんで"],"そんでもって":["そんでもって"],"そんな":["そんな"],"そんなこんな":["そんなこんな"],"そんなに":["そんなに"],"そんなふうに":["そんな風に"],"ぞ":["ぞ"],"たい":["体","隊","対","タイ","タイ","タイ","たい","帯","鯛","泰"],"たこやき":["たこ焼き"],"ただいま":["只今","ただ今"],"たった":["たった","立った","経った","建った"],"たったひとり":["たった一人"],"たったいま":["たった今"],"たって":["たって","立って","経って","建って"],"たっぷり":["たっぷり"],"たどりつく":["たどり着く"],"たどりついた":["たどり着いた"],"たどりつかない":["たどり着かない"],"たどりつき":["たどり着き"],"たどりついて":["たどり着いて"],"たどりつける":["たどり着ける"],"たどりつかれる":["たどり着かれる"],"ためいき":["ため息","溜息"],"たも":["たも"],"たら":["たら","タラ"],"たり":["人","たり"],"たる":["たる","樽"],"たん":["反","たん","タン","段","端"],"たんと":["たんと"],"だ":["だ"],"だい":["大","第","代","台","だい","題"],"だから":["だから"],"だからこそ":["だからこそ"],"だからって":["だからって"],"だからといって":["だからと言って"],"だが":["だが"],"だく":["抱く","だく"],"だけあって":["だけあって"],"だけでなく":["だけでなく"],"だけど":["だけど"],"だけども":["だけども"],"だけに":["だけに"],"だけれども":["だけれども"],"だっけ":["だっけ"],"だったら":["だったら"],"だって":["だって"],"だと":["だと"],"だに":["だに","ダニ"],"だの":["だの"],"だもの":["だもの"],"だらけ":["だらけ"],"だらだら":["だらだら"],"だろ":["だろ"],"だろう":["だろう"],"ちくちく":["チクチク","ちくちく"],"ちっぽけ":["ちっぽけ"],"ちびっこ":["ちびっ子"],"ちまちま":["ちまちま"],"ちゃう":["ちゃう","ちゃう"],"ちゃった":["ちゃった"],"ちゃわない":["ちゃわない"],"ちゃい":["ちゃい"],"ちゃって":["ちゃって"],"ちゃえる":["ちゃえる"],"ちゃわれる":["ちゃわれる"],"ちゃっかり":["ちゃっかり"],"ちゃら":["ちゃら"],"ちゃり":["チャリ","ちゃり"],"ちゃん":["ちゃん","荘"],"ちゃんこ":["ちゃんこ"],"ちゃんと":["ちゃんと"],"ちゅう":["中","厨","ちゅう","注","宙"],"ちょい":["ちょい"],"ちょいと":["ちょいと"],"ちょくちょく":["ちょくちょく"],"ちょこちょこ":["ちょこちょこ"],"ちょこっと":["ちょこっと"],"ちょっくら":["ちょっくら"],"ちょっぴり":["ちょっぴり"],"ちょびっと":["ちょびっと"],"ちらっと":["ちらっと"],"ちらほら":["ちらほら"],"ちり":["チリ","地理","ちり","散り"],"ちん":["ちん","チン","チン","珍"],"っけ":["っけ"],"っしょ":["っしょ"],"っす":["っす"],"ったく":["ったく"],"ったら":["ったら"],"っつーか":["っつーか"],"って":["って"],"っていうか":["っていうか"],"ってか":["ってか"],"ってば":["ってば"],"っぷり":["っぷり"],"っぽい":["っぽい"],"っこ":["っ子"],"っぱなし":["っ放し"],"つ":["つ","個"],"つい":["つい","対"],"ついつい":["ついつい"],"つかのま":["つかの間"],"つけめん":["つけ麺"],"つつ":["つつ"],"つつある":["つつある"],"つと":["つと"],"つばさ":["翼","つばさ"],"つゆ":["梅雨","汁","露","つゆ"],"つるつる":["つるつる"],"つーか":["つーか"],"づつ":["づつ"],"て":["て","手"],"てい":["体","弟","底","てい","丁"],"てくてく":["てくてく"],"てっきり":["てっきり"],"てな":["てな"],"で":["で","出","出"],"であります":["であります"],"である":["である"],"であった":["であった","出会った"],"であらない":["であらない"],"であり":["であり"],"であって":["であって","出会って"],"であれる":["であれる"],"であられる":["であられる"],"であるから":["であるから"],"であれ":["であれ"],"であろう":["であろう"],"でか":["でか","デカ"],"でかい":["でかい"],"でかかった":["でかかった"],"でかくない":["でかくない"],"でかくて":["でかくて"],"できるかぎり":["出来る限り","できる限り"],"でさえ":["でさえ"],"でしょ":["でしょ"],"でしょう":["でしょう"],"ですから":["ですから"],"ですが":["ですが"],"ですがなにか":["ですが何か"],"でっかい":["でっかい"],"でっかかった":["でっかかった"],"でっかくない":["でっかくない"],"でっかくて":["でっかくて"],"でないと":["でないと"],"でなければ":["でなければ"],"では":["では"],"ではある":["ではある"],"ではあった":["ではあった"],"ではあらない":["ではあらない"],"ではあり":["ではあり"],"ではあって":["ではあって"],"ではあれる":["ではあれる"],"ではあられる":["ではあられる"],"ではないか":["ではないか"],"ではまた":["ではまた"],"でも":["でも","デモ"],"でもある":["でもある"],"でもあった":["でもあった"],"でもあらない":["でもあらない"],"でもあり":["でもあり"],"でもあって":["でもあって"],"でもあれる":["でもあれる"],"でもあられる":["でもあられる"],"でもって":["でもって"],"でもない":["でもない"],"と":["と","都","人","十","門","ト","斗","戸"],"とあって":["とあって"],"とか":["とか"],"とき":["時","とき","とき","解き","トキ","斎"],"ときめき":["ときめき"],"とく":["とく","得","徳","解く"],"といた":["といた","解いた"],"とかない":["とかない","解かない"],"といて":["といて","解いて"],"とける":["とける","解ける","溶ける"],"とかれる":["とかれる","解かれる"],"ところを":["ところを"],"とされる":["とされる"],"としたら":["としたら"],"として":["として"],"としては":["としては"],"としても":["としても"],"とする":["とする"],"とすると":["とすると"],"とすれば":["とすれば"],"とっとと":["とっとと"],"とて":["とて"],"となく":["となく"],"となる":["となる"],"となると":["となると"],"となれば":["となれば"],"とは":["とは"],"とはべつに":["とは別に"],"とはいえ":["とは言え"],"とはかぎらない":["とは限らない"],"とも":["とも","友","共","朋"],"とる":["とる","撮る","取る"],"とった":["とった","撮った","取った"],"とらない":["とらない","撮らない","取らない"],"とり":["鳥","とり","撮り","取り","鶏"],"とって":["とって","撮って","取って"],"とれる":["とれる","撮れる","取れる","取れる","撮れる"],"とられる":["とられる","撮られる","取られる"],"とろ":["とろ"],"とろとろ":["とろとろ"],"とんだ":["飛んだ","とんだ"],"とんでもない":["とんでもない"],"とんとん":["とんとん"],"とともに":["と共に"],"とおなじように":["と同じように"],"とくらべて":["と比べて"],"とかんがえられる":["と考えられる"],"という":["と言う"],"というか":["と言うか"],"ということは":["と言うことは"],"というと":["と言うと"],"というのに":["と言うのに"],"というのは":["と言うのは"],"というのも":["と言うのも"],"というもの":["と言うもの"],"といえば":["と言えば"],"といえる":["と言える"],"といって":["と言って"],"といっても":["と言っても"],"といわれる":["と言われる"],"ど":["土","ど","度","ド"],"どう":["動","どう","どう","道","同","堂","如何","銅","胴"],"どうか":["どうか"],"どうかな":["どうかな"],"どうしたの":["どうしたの"],"どうしたもの":["どうしたもの"],"どうしたら":["どうしたら"],"どうしたん":["どうしたん"],"どうしよう":["どうしよう"],"どうするか":["どうするか"],"どうせ":["どうせ"],"どうせなら":["どうせなら"],"どうぞ":["どうぞ"],"どうぞよろしく":["どうぞ宜しく"],"どうでもいい":["どうでもいい"],"どうにか":["どうにか"],"どうにかして":["どうにかして"],"どうにもならない":["どうにもならない"],"どうも":["どうも"],"どうやったら":["どうやったら"],"どうやって":["どうやって"],"どうやら":["どうやら"],"どきどき":["ドキドキ","どきどき"],"どころ":["どころ"],"どたばた":["どたばた"],"どちらか":["どちらか"],"どっさり":["どっさり"],"どっちか":["どっちか"],"どっと":["どっと","ドット"],"どっぷり":["どっぷり"],"どなたか":["どなたか"],"どれか":["どれか"],"どれだけ":["どれだけ"],"どん":["ドン","どん","丼"],"どんだけ":["どんだけ"],"どんどん":["どんどん"],"どんな":["どんな"],"どんより":["どんより"],"どんぞこ":["どん底"],"どまんなか":["ど真ん中"],"な":["な","七","菜","己"],"なあ":["なあ"],"ない":["内","ない","無い","地震","ない"],"ないか":["ないか","内科"],"ないで":["ないで"],"なう":["ナウ","なう"],"なった":["鳴った","成った","なった"],"なわない":["なわない"],"なって":["鳴って","成って","なって"],"なえる":["なえる"],"なわれる":["なわれる"],"なえ":["地震","苗","なえ"],"なおこ":["なおこ"],"なさい":["なさい"],"なぞ":["謎","なぞ"],"なってない":["なってない"],"なのだ":["なのだ"],"なのである":["なのである"],"なのです":["なのです"],"なのに":["なのに"],"なら":["なら"],"ならでは":["ならでは"],"ならない":["ならない","鳴らない","成らない"],"ならぬ":["ならぬ"],"ならば":["ならば"],"なり":["なり","形","也","鳴り","成り","鳴り"],"なりに":["なりに"],"なる":["なる","ナル","鳴る","成る"],"なんか":["なんか","何か","南下"],"なんぞ":["なんぞ"],"なんだ":["なんだ","何だ"],"なんちゃって":["なんちゃって"],"なんて":["なんて","何て"],"なんです":["なんです"],"なんやかんや":["なんやかんや"],"に":["に","二","弐","似","ニ","丹","荷","煮"],"にかけて":["にかけて"],"にして":["にして"],"にしては":["にしては"],"にしても":["にしても"],"にする":["にする"],"にせよ":["にせよ"],"にっこり":["にっこり"],"にて":["にて","似て","煮て"],"になる":["になる"],"になると":["になると"],"には":["には"],"にも":["にも"],"にもかかわらず":["にも関わらず"],"にゃ":["にゃ"],"にゃあ":["にゃあ"],"にゃんこ":["にゃんこ"],"にゃんにゃん":["にゃんにゃん"],"にわたって":["にわたって"],"について":["に付いて"],"ににて":["に似て"],"にくわえ":["に加え"],"にくわえて":["に加えて"],"にはんして":["に反して"],"にとって":["に取って"],"にもとづいて":["に基づいて"],"にもとづき":["に基づき"],"にたいして":["に対して"],"にたいする":["に対する"],"にあたって":["に当たって"],"におうじて":["に応じて"],"にくらべ":["に比べ"],"にそって":["に沿って"],"につれて":["に連れて"],"にすぎない":["に過ぎない"],"にちがいない":["に違いない"],"にかんして":["に関して"],"にかんする":["に関する"],"にかぎって":["に限って"],"にかぎらず":["に限らず"],"にかぎる":["に限る"],"にさいして":["に際して"],"ぬるまゆ":["ぬるま湯"],"ね":["ね","子","音","寝","寝","値","根","直"],"ねえ":["ねえ","姉"],"ねた":["ネタ","寝た","ねた"],"ねば":["ねば"],"の":["の","野","之","乃"],"のぞみ":["望み","望み","のぞみ","臨み"],"のだ":["のだ"],"ので":["ので"],"のです":["のです"],"のに":["のに"],"のほほんと":["のほほんと"],"のみ":["のみ","飲み","飲み","呑み","呑み","ノミ"],"のみならず":["のみならず"],"のんびり":["のんびり"],"のもとに":["の下に"],"のように":["の様に"],"のために":["の為に"],"は":["は","は","派","葉","歯","ハ","刃"],"はあ":["はあ"],"はい":["はい","ハイ","杯","灰","輩","肺"],"はいはい":["はいはい"],"はずがない":["はずがない"],"はずだ":["はずだ"],"はずです":["はずです"],"はっきり":["はっきり"],"はて":["果て","はて"],"はてな":["はてな"],"はる":["春","はる","貼る","張る"],"はった":["はった","貼った","張った"],"はらない":["はらない","貼らない","張らない"],"はり":["はり","針","張り","貼り","張り","梁"],"はって":["はって","貼って","張って"],"はれる":["はれる","晴れる","貼れる","張れる"],"はられる":["はられる","貼られる","張られる"],"はん":["反","版","半","ハン","はん","班","犯","藩","判"],"ば":["ば","場","羽"],"ばあちゃん":["ばあちゃん"],"ばたばた":["バタバタ","ばたばた"],"ばっちり":["ばっちり"],"ばば":["馬場","婆","祖母","ばば"],"ぱっと":["ぱっと","パット"],"ひかり":["光","光り","ひかり"],"ひきにく":["ひき肉"],"ひっそり":["ひっそり"],"ひとりごと":["独り言","ひとり言"],"ひととき":["一時","ひと時"],"ひとつき":["一月","ひと月"],"ひとこと":["一言","ひと言"],"ひなまつり":["ひな祭り"],"ひばり":["ひばり"],"ひょっと":["ひょっと"],"ひょっとしたら":["ひょっとしたら"],"ひょっとして":["ひょっとして"],"ひらり":["ひらり"],"ひんやり":["ひんやり"],"びっしり":["びっしり"],"びり":["びり"],"ぴったり":["ぴったり"],"ふっくら":["ふっくら"],"ふっと":["ふっと"],"ふとした":["ふとした"],"ふふ":["ふふ"],"ふむ":["踏む","ふむ"],"ふらっと":["フラット","ふらっと"],"ふらふら":["ふらふら","フラフラ"],"ふん":["分","ふん","糞"],"ふんわり":["ふんわり"],"ふーん":["ふーん"],"ぶっちゃけ":["ぶっちゃけ"],"ぶつぶつ":["ぶつぶつ"],"ぶらぶら":["ぶらぶら"],"ぶらり":["ぶらり"],"ぶれ":["ぶれ"],"ぶんぶん":["ぶんぶん"],"ぷりぷり":["プリプリ","ぷりぷり"],"へ":["へ","方","辺","ヘ"],"へえ":["へえ"],"へたれ":["へたれ"],"へっぽこ":["へっぽこ"],"へん":["編","変","へん","辺","篇"],"べ":["方","べ","辺"],"べえ":["べえ"],"べく":["べく"],"べったり":["べったり"],"ぺ":["ぺ"],"ほうれんそう":["ほうれん草"],"ほっこり":["ほっこり"],"ほっと":["ほっと","ホット"],"ほな":["ほな"],"ほら":["ほら","洞"],"ほろよい":["ほろ酔い"],"ほろよかった":["ほろ酔かった"],"ほろよくない":["ほろ酔くない"],"ほろよくて":["ほろ酔くて"],"ほんのり":["ほんのり"],"ぼそぼそ":["ぼそぼそ"],"ぼちぼち":["ぼちぼち","ボチボチ"],"ぼろぼろ":["ボロボロ","ぼろぼろ"],"ぼんやり":["ぼんやり"],"ぼーっと":["ぼーっと"],"ぽい":["ぽい"],"ぽかぽか":["ぽかぽか"],"ぽん":["ぽん"],"まあ":["まあ"],"まあまあ":["まあまあ"],"まい":["枚","マイ","まい","舞","毎","舞い","麻衣"],"まし":["まし","猿","マシ","増し","増し"],"ましょ":["ましょ"],"まじ":["マジ","まじ"],"ます":["ます","マス","マス","斗","増す","升"],"ません":["ません"],"ませんか":["ませんか"],"ませんでした":["ませんでした"],"またね":["またね"],"またあした":["また明日"],"まったり":["まったり"],"まへん":["まへん"],"まんまと":["まんまと"],"み":["見","見","子","海","み","味","三","身","御","実","美","未","観","回","深","ミ"],"みじんぎり":["みじん切り"],"みたい":["みたい"],"みっちり":["みっちり"],"む":["む","無","六"],"むかつく":["むかつく"],"むかついた":["むかついた"],"むかつかない":["むかつかない"],"むかつき":["むかつき"],"むかついて":["むかついて"],"むかつける":["むかつける"],"むかつかれる":["むかつかれる"],"めっ":["めっ"],"めっさ":["めっさ"],"めっちゃ":["めっちゃ"],"も":["も","面"],"もう":["もう","毛","網","猛"],"もうすっかり":["もうすっかり"],"もうひとつ":["もう一つ"],"もうひとり":["もう一人"],"もういっかい":["もう一回"],"もういちど":["もう一度"],"もうすこし":["もう少し"],"もうすこしで":["もう少しで"],"もくもく":["もくもく"],"もぐ":["もぐ"],"もいだ":["もいだ"],"もがない":["もがない"],"もぎ":["もぎ","模擬"],"もいで":["もいで"],"もげる":["もげる"],"もがれる":["もがれる"],"もぐもぐ":["もぐもぐ"],"もさることながら":["もさることながら"],"もしもし":["もしもし"],"もちもち":["もちもち"],"もっと":["もっと"],"もつ":["持つ","もつ"],"ものか":["ものか"],"ものだから":["ものだから"],"もので":["もので"],"ものである":["ものである"],"ものですから":["ものですから"],"ものの":["ものの","物の"],"ものを":["ものを"],"もやもや":["モヤモヤ","もやもや"],"もりもり":["もりもり"],"もんか":["もんか"],"もんだから":["もんだから"],"もんで":["もんで"],"もんぺ":["もんぺ"],"もひとつ":["も一つ"],"や":["や","家","嫌","八","野","矢"],"やあ":["やあ"],"やがる":["やがる"],"やけに":["やけに"],"やさぐれ":["やさぐれ"],"やった":["やった"],"やったー":["やったー"],"やってくる":["やって来る"],"やってくた":["やって来た"],"やってこない":["やって来ない"],"やってき":["やってき"],"やってきて":["やって来て"],"やってこれる":["やって来れる"],"やってこられる":["やって来られる"],"やっと":["やっと"],"やっとこ":["やっとこ"],"やっぱし":["やっぱし"],"やねん":["やねん"],"やばい":["やばい"],"やばかった":["やばかった"],"やばくない":["やばくない"],"やばくて":["やばくて"],"ややこしい":["ややこしい"],"ややこしかった":["ややこしかった"],"ややこしくない":["ややこしくない"],"ややこしくて":["ややこしくて"],"やら":["やら"],"やらせ":["やらせ"],"やりとり":["やり取り"],"やりかた":["やり方"],"やりなおし":["やり直し"],"やるき":["やる気"],"やれ":["やれ"],"やれやれ":["やれやれ"],"やろう":["やろう"],"やんちゃ":["やんちゃ"],"ゆっくり":["ゆっくり"],"ゆったり":["ゆったり"],"ゆとり":["ゆとり"],"よ":["よ","夜","代","四","世","節","余"],"ようが":["洋画","ようが"],"ようこそ":["ようこそ"],"ような":["ような"],"ように":["ように"],"ようにする":["ようにする"],"ようになる":["ようになる"],"よさこい":["よさこい"],"より":["より","寄り","寄り"],"よりによって":["よりによって"],"よりよい":["より良い"],"よりよかった":["より良かった"],"よりよくない":["より良くない"],"よりよくて":["より良くて"],"よれば":["よれば"],"よろしくおねがいいたします":["よろしくお願いいたします","宜しくお願い致します"],"よろしくおねがいします":["よろしくお願いします","宜しくお願いします"],"らしい":["らしい"],"らっしゃる":["らっしゃる"],"らっしゃった":["らっしゃった"],"らっしゃらない":["らっしゃらない"],"らっしゃい":["らっしゃい"],"らっしゃって":["らっしゃって"],"らっしゃり得る":["らっしゃり得る"],"りんりん":["りんりん"],"ろは":["ろは"],"わ":["話","わ","我","和","輪","羽","環","吾"],"わあ":["わあ"],"わい":["私","わい"],"わいわい":["わいわい"],"わがくに":["我が国","わが国"],"わがこ":["我が子","わが子"],"わくわく":["わくわく"],"わはは":["わはは"],"ゑ":["ゑ"],"を":["を"],"をば":["をば"],"をめぐって":["を回って","を巡って"],"をとおして":["を通して"],"ん":["ん"],"んず":["んず"],"んだ":["んだ"],"んで":["んで"],"んです":["んです"],"あい":["愛","アイ","会い","合い","相","合い","藍","鮎","埃"],"あいあん":["アイアン"],"あいこん":["アイコン"],"あいす":["アイス","愛す"],"あいすくりーむ":["アイスクリーム"],"あいてむ":["アイテム"],"あいであ":["アイデア"],"あいでぃあ":["アイディア"],"あいどる":["アイドル"],"あいらんど":["アイランド"],"あいるらんど":["アイルランド"],"あいろん":["アイロン"],"あうぇい":["アウェイ"],"あうと":["アウト"],"あうとどあ":["アウトドア"],"あうとれっと":["アウトレット"],"あかでみー":["アカデミー"],"あかでみーしょう":["アカデミー賞"],"あくあ":["アクア"],"あくしでんと":["アクシデント"],"あくしょん":["アクション"],"あくせ":["アクセ"],"あくせさりー":["アクセサリー"],"あくせす":["アクセス"],"あくせる":["アクセル"],"あくせんと":["アクセント"],"あくてぃぶ":["アクティブ"],"あくりる":["アクリル"],"あこぎ":["アコギ"],"あこーすてぃっく":["アコースティック"],"あしすたんと":["アシスタント"],"あしすと":["アシスト"],"あじ":["味","アジ","鯵"],"あじあ":["アジア"],"あじあん":["アジアン"],"あじさい":["紫陽花","アジサイ"],"あすぱら":["アスパラ"],"あすふぁると":["アスファルト"],"あすりーと":["アスリート"],"あすろん":["アスロン"],"あたっく":["アタック"],"あだると":["アダルト"],"あっ":["アッ"],"あっしゅ":["アッシュ"],"あっとほーむ":["アットホーム"],"あっぷ":["アップ"],"あっぷでーと":["アップデート"],"あっぷる":["アップル"],"あっぷるぱい":["アップルパイ"],"あっぷろーど":["アップロード"],"あてね":["アテネ"],"あでぃだす":["アディダス"],"あとぴー":["アトピー"],"あとむ":["アトム"],"あとらくしょん":["アトラクション"],"あとりえ":["アトリエ"],"あど":["アド"],"あどばいざー":["アドバイザー"],"あどばいす":["アドバイス"],"あどばんす":["アドバンス"],"あどべんちゃー":["アドベンチャー"],"あどりぶ":["アドリブ"],"あどれす":["アドレス"],"あな":["穴","アナ"],"あなうんさー":["アナウンサー"],"あなうんす":["アナウンス"],"あなりすと":["アナリスト"],"あなろぐ":["アナログ"],"あにまる":["アニマル"],"あにめ":["アニメ"],"あにめーしょん":["アニメーション"],"あばうと":["アバウト"],"あぱれる":["アパレル"],"あぱーと":["アパート"],"あぴーる":["アピール"],"あふがにすたん":["アフガニスタン"],"あふがん":["アフガン"],"あふたぬーん":["アフタヌーン"],"あふたー":["アフター"],"あふりか":["アフリカ"],"あふろ":["アフロ"],"あぶ":["アブ"],"あぷり":["アプリ"],"あぷりけーしょん":["アプリケーション"],"あぷろーち":["アプローチ"],"あほ":["アホ"],"あぼかど":["アボカド"],"あぽ":["アポ"],"あぽろ":["アポロ"],"あま":["天","アマ"],"あまぞん":["アマゾン"],"あまちゅあ":["アマチュア"],"あまちゅあむせん":["アマチュア無線"],"あみ":["網","アミ"],"あめふと":["アメフト"],"あめりか":["アメリカ"],"あめりかん":["アメリカン"],"あめりかじん":["アメリカ人"],"あらかると":["アラカルト"],"あらぶ":["アラブ"],"ありあ":["アリア"],"ありーな":["アリーナ"],"あるこーる":["アルコール"],"あるぜんちん":["アルゼンチン"],"あると":["アルト"],"あるばいと":["アルバイト"],"あるばむ":["アルバム"],"あるふぁべっと":["アルファベット"],"あるぷす":["アルプス"],"あるみ":["アルミ"],"あれっくす":["アレックス"],"あれるぎー":["アレルギー"],"あれんじ":["アレンジ"],"あれんじめんと":["アレンジメント"],"あろは":["アロハ"],"あろま":["アロマ"],"あろませらぴー":["アロマセラピー"],"あろまてらぴー":["アロマテラピー"],"あわー":["アワー"],"あんかー":["アンカー"],"あんぐる":["アングル"],"あんけーと":["アンケート"],"あんこーる":["アンコール"],"あんさんぶる":["アンサンブル"],"あんだー":["アンダー"],"あんち":["アンチ"],"あんちえいじんぐ":["アンチエイジング"],"あんてぃーく":["アンティーク"],"あんてな":["アンテナ"],"あんど":["アンド","安堵"],"あんぱん":["アンパン"],"あんぷ":["アンプ"],"あーかいぶ":["アーカイブ"],"あーく":["アーク"],"あーけーど":["アーケード"],"あーす":["アース"],"あーち":["アーチ"],"あーてぃすと":["アーティスト"],"あーと":["アート"],"あーばん":["アーバン"],"あーむ":["アーム"],"あーもんど":["アーモンド"],"あーる":["アール"],"い":["位","五","寝","居","イ","イ","胃","医","異","意","井","伊","居","猪","五十"],"いい":["言い","良い","イイ","云い","好い"],"いえす":["イエス"],"いえろー":["イエロー"],"いおん":["イオン"],"いぎりす":["イギリス"],"いぎりすじん":["イギリス人"],"いけてる":["イケてる"],"いけめん":["イケメン"],"いすらえる":["イスラエル"],"いすらむ":["イスラム"],"いたりあ":["イタリア"],"いたりあん":["イタリアン"],"いたりあじん":["イタリア人"],"いたりありょうり":["イタリア料理"],"いたりあご":["イタリア語"],"いちょう":["銀杏","胃腸","イチョウ"],"いど":["イド","井戸"],"いに":["イニ"],"いにしゃる":["イニシャル"],"いにんぐ":["イニング"],"いのしし":["猪","イノシシ"],"いぶ":["イブ"],"いべんと":["イベント"],"いまいち":["イマイチ","今一"],"いめーじ":["イメージ"],"いや":["嫌","イヤ","否"],"いやほん":["イヤホン"],"いやー":["イヤー"],"いらく":["イラク"],"いらくせんそう":["イラク戦争"],"いらすと":["イラスト"],"いらすとれーたー":["イラストレーター"],"いらん":["イラン"],"いるか":["イルカ"],"いるみねーしょん":["イルミネーション"],"いれぶん":["イレブン"],"いん":["イン","員","印","陰"],"いんく":["インク"],"いんぐらんど":["イングランド"],"いんぐりっしゅ":["イングリッシュ"],"いんこ":["インコ"],"いんす":["インス"],"いんすたんと":["インスタント"],"いんすとらくたー":["インストラクター"],"いんすとーる":["インストール"],"いんたびゅー":["インタビュー"],"いんたー":["インター"],"いんたーなしょなる":["インターナショナル"],"いんたーねっと":["インターネット"],"いんたーん":["インターン"],"いんち":["インチ"],"いんちき":["インチキ"],"いんてりあ":["インテリア"],"いんてる":["インテル"],"いんでぃあん":["インディアン"],"いんでぃーず":["インディーズ"],"いんでっくす":["インデックス"],"いんとろ":["イントロ"],"いんど":["インド"],"いんどあ":["インドア"],"いんどねしあ":["インドネシア"],"いんどりょうり":["インド料理"],"いんなー":["インナー"],"いんぱくと":["インパクト"],"いんふぉめーしょん":["インフォメーション"],"いんふら":["インフラ"],"いんふるえんざ":["インフルエンザ"],"いんふれ":["インフレ"],"いんぷらんと":["インプラント"],"いゔ":["イヴ"],"いーぐる":["イーグル"],"いーじす":["イージス"],"いーじー":["イージー"],"いーすと":["イースト"],"うぃきぺでぃあ":["ウィキペディア"],"うぃすきー":["ウィスキー"],"うぃるす":["ウィルス"],"うぃんぐ":["ウィング"],"うぃんたー":["ウィンター"],"うぃんど":["ウィンド"],"うぃんどう":["ウィンドウ"],"うぃーく":["ウィーク"],"ういすきー":["ウイスキー"],"ういるす":["ウイルス"],"ういんぐ":["ウイング"],"ういんど":["ウインド"],"ういーく":["ウイーク"],"うぇあ":["ウェア"],"うぇい":["ウェイ"],"うぇざー":["ウェザー"],"うぇでぃんぐ":["ウェディング"],"うぇぶ":["ウェブ"],"うぇぶさいと":["ウェブサイト"],"うぇぶぺーじ":["ウェブページ"],"うぇぶろぐ":["ウェブログ"],"うぇるかむ":["ウェルカム"],"うぇーぶ":["ウェーブ"],"うえあ":["ウエア"],"うえすたん":["ウエスタン"],"うえすと":["ウエスト"],"うえでぃんぐ":["ウエディング"],"うぉっち":["ウォッチ"],"うぉっちんぐ":["ウォッチング"],"うぉん":["ウォン"],"うぉーかー":["ウォーカー"],"うぉーきんぐ":["ウォーキング"],"うぉーる":["ウォール"],"うおーきんぐ":["ウオーキング"],"うきうき":["ウキウキ"],"うくれれ":["ウクレレ"],"うさぎ":["ウサギ","兎"],"うそ":["嘘","ウソ"],"うっど":["ウッド"],"うど":["ウド"],"うに":["ウニ"],"うめ":["梅","埋め","ウメ"],"うるとら":["ウルトラ"],"うるふ":["ウルフ"],"うーまん":["ウーマン"],"えあ":["エア"],"えあこん":["エアコン"],"えあろ":["エアロ"],"えあー":["エアー"],"えい":["英","エイ"],"えいと":["エイト"],"えいど":["エイド"],"えいりあん":["エイリアン"],"えきさいと":["エキサイト"],"えきす":["エキス"],"えきすとら":["エキストラ"],"えきすぱーと":["エキスパート"],"えくささいず":["エクササイズ"],"えくすぷれす":["エクスプレス"],"えくせる":["エクセル"],"えこ":["エコ"],"えころじー":["エコロジー"],"えこー":["エコー"],"えご":["エゴ"],"えじぷと":["エジプト"],"えすかれーたー":["エスカレーター"],"えすて":["エステ"],"えすにっく":["エスニック"],"えすぷれっそ":["エスプレッソ"],"えっぐ":["エッグ"],"えっじ":["エッジ"],"えっせい":["エッセイ"],"えっせんす":["エッセンス"],"えっせー":["エッセー"],"えっち":["エッチ"],"えでぃしょん":["エディション"],"えとせとら":["エトセトラ"],"えねるぎっしゅ":["エネルギッシュ"],"えねるぎー":["エネルギー"],"えび":["エビ","海老","葡萄"],"えぴそーど":["エピソード"],"えふ":["エフ"],"えぷろん":["エプロン"],"えめらるど":["エメラルド"],"えらー":["エラー"],"えりあ":["エリア"],"えりーと":["エリート"],"える":["エル","得る"],"えれがんと":["エレガント"],"えれべーたー":["エレベーター"],"えろ":["エロ"],"えろい":["エロい"],"えろかった":["エロかった"],"えろくない":["エロくない"],"えろくて":["エロくて"],"えんじぇる":["エンジェル"],"えんじにあ":["エンジニア"],"えんじょい":["エンジョイ"],"えんじん":["エンジン"],"えんぜる":["エンゼル"],"えんたていんめんと":["エンタテインメント"],"えんため":["エンタメ"],"えんたーていめんと":["エンターテイメント"],"えんたーていんめんと":["エンターテインメント"],"えんでぃんぐ":["エンディング"],"えんとり":["エントリ"],"えんとりー":["エントリー"],"えんど":["エンド"],"えんどれす":["エンドレス"],"えーじぇんと":["エージェント"],"えーす":["エース"],"えーる":["エール"],"おあしす":["オアシス"],"おいる":["オイル"],"おおかみ":["狼","オオカミ"],"おかま":["オカマ"],"おかると":["オカルト"],"おくら":["オクラ","オクラ"],"おけ":["オケ"],"おすかー":["オスカー"],"おせあにあ":["オセアニア"],"おた":["オタ"],"おっず":["オッズ"],"おにおん":["オニオン"],"おふ":["オフ"],"おふぁー":["オファー"],"おふぃしゃる":["オフィシャル"],"おふぃす":["オフィス"],"おふかい":["オフ会"],"おぶじぇ":["オブジェ"],"おぷしょん":["オプション"],"おぺら":["オペラ"],"おぺらざ":["オペラ座"],"おむつ":["オムツ"],"おむらいす":["オムライス"],"おむれつ":["オムレツ"],"おらんだ":["オランダ"],"おりえんたる":["オリエンタル"],"おりおん":["オリオン"],"おりじなる":["オリジナル"],"おりっくす":["オリックス"],"おりんぴっく":["オリンピック"],"おりーぶ":["オリーブ"],"おりーぶおいる":["オリーブオイル"],"おるがん":["オルガン"],"おれんじ":["オレンジ"],"おれんじいろ":["オレンジ色"],"おん":["音","御","オン","恩"],"おんえあ":["オンエア"],"おんぱれーど":["オンパレード"],"おんらいん":["オンライン"],"おんらいんげーむ":["オンラインゲーム"],"おんらいんしょっぷ":["オンラインショップ"],"おんりー":["オンリー"],"おーがにっく":["オーガニック"],"おーくしょん":["オークション"],"おーくす":["オークス"],"おーけすとら":["オーケストラ"],"おーしゃん":["オーシャン"],"おーすとらりあ":["オーストラリア"],"おーすとりあ":["オーストリア"],"おーそどっくす":["オーソドックス"],"おーだー":["オーダー"],"おーだーめいど":["オーダーメイド"],"おーでぃお":["オーディオ"],"おーでぃしょん":["オーディション"],"おーと":["オート"],"おーとばい":["オートバイ"],"おーなー":["オーナー"],"おーばー":["オーバー"],"おーぶん":["オーブン"],"おーぷにんぐ":["オープニング"],"おーぷん":["オープン"],"おーぷんせん":["オープン戦"],"おーら":["オーラ"],"おーる":["オール"],"おーるすたー":["オールスター"],"おーるないと":["オールナイト"],"おーろら":["オーロラ"],"かいろ":["回路","カイロ"],"かいろぷらくてぃっく":["カイロプラクティック"],"かう":["買う","飼う","カウ"],"かうんせらー":["カウンセラー"],"かうんせりんぐ":["カウンセリング"],"かうんた":["カウンタ"],"かうんたー":["カウンター"],"かうんと":["カウント"],"かうんとだうん":["カウントダウン"],"かえる":["買える","帰る","変える","カエル","蛙","飼える"],"かおす":["カオス"],"かき":["下記","書き","描き","柿","カキ","夏季","夏期","牡蠣"],"かきこ":["カキコ"],"かくてる":["カクテル"],"かじ":["家事","火事","カジ"],"かじの":["カジノ"],"かじゅある":["カジュアル"],"かすたまいず":["カスタマイズ"],"かすたむ":["カスタム"],"かすたーど":["カスタード"],"かすてら":["カステラ"],"かせっと":["カセット"],"かぜ":["風","風邪","カゼ"],"かたろぐ":["カタログ"],"かっこ":["カッコ"],"かったー":["カッター"],"かっと":["カット"],"かっぱ":["カッパ","河童"],"かっぷ":["カップ"],"かっぷる":["カップル"],"かっぷめん":["カップ麺"],"かつ":["勝つ","活","カツ","且つ","喝"],"かつどん":["カツ丼"],"かてごり":["カテゴリ"],"かてごりー":["カテゴリー"],"かとりっく":["カトリック"],"かなだ":["カナダ"],"かぬー":["カヌー"],"かのん":["カノン"],"かば":["カバ","カバ","カバ"],"かばー":["カバー"],"かび":["カビ"],"かふぇ":["カフェ"],"かふぇおれ":["カフェオレ"],"かぶ":["頭","株","カブ","下部"],"かぶとむし":["カブトムシ"],"かぷせる":["カプセル"],"かまきり":["カマキリ"],"かみんぐあうと":["カミングアウト"],"かめら":["カメラ"],"かめらまん":["カメラマン"],"からおけ":["カラオケ"],"からす":["カラス","烏"],"からふる":["カラフル"],"からー":["カラー"],"かりすま":["カリスマ"],"かりふぉるにあ":["カリフォルニア"],"かるしうむ":["カルシウム"],"かるちゃー":["カルチャー"],"かるて":["カルテ"],"かると":["カルト"],"かるび":["カルビ"],"かるぴす":["カルピス"],"かれっじ":["カレッジ"],"かれんだー":["カレンダー"],"かれー":["カレー"],"かれーらいす":["カレーライス"],"かろりー":["カロリー"],"かわせみ":["カワセミ"],"かんかん":["カンカン"],"かんたーびれ":["カンタービレ"],"かんとりー":["カントリー"],"かんぱにー":["カンパニー"],"かんぼじあ":["カンボジア"],"かー":["カー"],"かーてん":["カーテン"],"かーと":["カート"],"かーど":["カード"],"かーなび":["カーナビ"],"かーにばる":["カーニバル"],"かーぶ":["カーブ"],"かーぺっと":["カーペット"],"かーぼん":["カーボン"],"かーる":["カール"],"かこく":["過酷","カ国","ヶ国"],"かしょ":["箇所","ヶ所","カ所"],"かげつ":["ヶ月","ヵ月","カ月","ケ月"],"がい":["外","街","蓋","ガイ","害"],"がいあ":["ガイア"],"がいど":["ガイド"],"がいどぶっく":["ガイドブック"],"がいどらいん":["ガイドライン"],"がき":["ガキ"],"がす":["ガス"],"がそりん":["ガソリン"],"がそりんすたんど":["ガソリンスタンド"],"がそりんだい":["ガソリン代"],"がたがた":["ガタガタ"],"がちんこ":["ガチンコ"],"がっつ":["ガッツ"],"がつん":["ガツン"],"がとー":["ガトー"],"がむ":["ガム"],"がらす":["ガラス"],"がりがり":["ガリガリ"],"がりれお":["ガリレオ"],"がれーじ":["ガレージ"],"がんがん":["ガンガン"],"がんぷら":["ガンプラ"],"がーぜ":["ガーゼ"],"がーでにんぐ":["ガーデニング"],"がーでん":["ガーデン"],"がーど":["ガード"],"がーりっく":["ガーリック"],"がーる":["ガール"],"がーん":["ガーン"],"きうい":["キウイ"],"きじ":["記事","生地","キジ"],"きす":["キス","キス","記す"],"きち":["吉","基地","キチ"],"きっく":["キック"],"きっくおふ":["キックオフ"],"きっす":["キッス"],"きっず":["キッズ"],"きっちん":["キッチン"],"きっと":["キット"],"きっど":["キッド"],"きつね":["狐","キツネ"],"きのこ":["菌","キノコ","茸"],"きむたく":["キムタク"],"きゃすたー":["キャスター"],"きゃすてぃんぐ":["キャスティング"],"きゃすと":["キャスト"],"きゃっしゅ":["キャッシュ"],"きゃっしんぐ":["キャッシング"],"きゃっち":["キャッチ"],"きゃっちこぴー":["キャッチコピー"],"きゃっちぼーる":["キャッチボール"],"きゃっちゃー":["キャッチャー"],"きゃっと":["キャット"],"きゃっぷ":["キャップ"],"きゃにおん":["キャニオン"],"きゃのん":["キャノン"],"きゃぷてん":["キャプテン"],"きゃべつ":["キャベツ"],"きゃら":["キャラ"],"きゃらくたー":["キャラクター"],"きゃらばん":["キャラバン"],"きゃらめる":["キャラメル"],"きゃりあ":["キャリア"],"きゃりー":["キャリー"],"きゃろっと":["キャロット"],"きゃんせる":["キャンセル"],"きゃんでぃ":["キャンディ"],"きゃんでぃー":["キャンディー"],"きゃんどる":["キャンドル"],"きゃんばす":["キャンバス"],"きゃんぱす":["キャンパス"],"きゃんぴんぐ":["キャンピング"],"きゃんぷ":["キャンプ"],"きゃんぷじょう":["キャンプ場"],"きゃんぺーん":["キャンペーン"],"きやのん":["キヤノン"],"きゅうり":["キュウリ"],"きゅー":["キュー"],"きゅーと":["キュート"],"きゅーば":["キューバ"],"きゅーぴー":["キューピー"],"きらー":["キラー"],"きりすと":["キリスト"],"きりすときょう":["キリスト教"],"きりん":["キリン","麒麟"],"きる":["切る","着る","斬る","キル"],"きると":["キルト"],"きろ":["キロ","帰路"],"きんぐ":["キング"],"きー":["キー"],"きーぱー":["キーパー"],"きーぷ":["キープ"],"きーほるだー":["キーホルダー"],"きーぼーど":["キーボード"],"きーわーど":["キーワード"],"ぎあ":["ギア"],"ぎたりすと":["ギタリスト"],"ぎたー":["ギター"],"ぎふと":["ギフト"],"ぎゃぐ":["ギャグ"],"ぎゃっぷ":["ギャップ"],"ぎゃら":["ギャラ"],"ぎゃらりー":["ギャラリー"],"ぎゃる":["ギャル"],"ぎゃんぐ":["ギャング"],"ぎゃんぶる":["ギャンブル"],"ぎょーざ":["ギョーザ"],"ぎりしゃ":["ギリシャ"],"ぎるど":["ギルド"],"くぃーん":["クィーン"],"くいず":["クイズ"],"くいっく":["クイック"],"くいーん":["クイーン"],"くおりてぃ":["クオリティ"],"くっきんぐ":["クッキング"],"くっきー":["クッキー"],"くっく":["クック"],"くっしょん":["クッション"],"くび":["首","クビ"],"くらいあんと":["クライアント"],"くらいまっくす":["クライマックス"],"くらいみんぐ":["クライミング"],"くらうん":["クラウン"],"くらげ":["クラゲ"],"くらしっく":["クラシック"],"くらしっくおんがく":["クラシック音楽"],"くらす":["クラス","暮らす"],"くらっしゅ":["クラッシュ"],"くらふと":["クラフト"],"くらぶ":["クラブ","クラブ","倶楽部"],"くらりねっと":["クラリネット"],"くらん":["クラン"],"くり":["クリ","クリ","栗"],"くりあ":["クリア"],"くりあー":["クリアー"],"くりえいたー":["クリエイター"],"くりえーたー":["クリエーター"],"くりすたる":["クリスタル"],"くりすちゃん":["クリスチャン"],"くりすぴー":["クリスピー"],"くりすます":["クリスマス"],"くりすますいぶ":["クリスマスイブ"],"くりすますけーき":["クリスマスケーキ"],"くりすますつりー":["クリスマスツリー"],"くりすますぷれぜんと":["クリスマスプレゼント"],"くりすますろーず":["クリスマスローズ"],"くりっく":["クリック"],"くりっぷ":["クリップ"],"くりにっく":["クリニック"],"くりーなー":["クリーナー"],"くりーにんぐ":["クリーニング"],"くりーみー":["クリーミー"],"くりーむ":["クリーム"],"くりーむちーず":["クリームチーズ"],"くりーん":["クリーン"],"くるー":["クルー"],"くるーず":["クルーズ"],"くれい":["クレイ"],"くれいじー":["クレイジー"],"くれじっと":["クレジット"],"くれじっとかーど":["クレジットカード"],"くれまちす":["クレマチス"],"くれよん":["クレヨン"],"くれーぷ":["クレープ"],"くれーむ":["クレーム"],"くれーん":["クレーン"],"くろあちあ":["クロアチア"],"くろす":["クロス"],"くろっく":["クロック"],"くろにくる":["クロニクル"],"くろわっさん":["クロワッサン"],"くろーす":["クロース"],"くろーず":["クローズ"],"くろーずあっぷ":["クローズアップ"],"くろーぜっと":["クローゼット"],"くろーばー":["クローバー"],"くろーん":["クローン"],"くんくん":["クンクン"],"くーぽん":["クーポン"],"くーらー":["クーラー"],"くーる":["クール"],"ぐあむ":["グアム"],"ぐっず":["グッズ"],"ぐっち":["グッチ"],"ぐっど":["グッド"],"ぐみ":["グミ"],"ぐらうんど":["グラウンド"],"ぐらす":["グラス"],"ぐらたん":["グラタン"],"ぐらでーしょん":["グラデーション"],"ぐらびあ":["グラビア"],"ぐらびああいどる":["グラビアアイドル"],"ぐらふ":["グラフ"],"ぐらふぃっく":["グラフィック"],"ぐらんど":["グランド"],"ぐらんぷり":["グランプリ"],"ぐりっぷ":["グリップ"],"ぐりる":["グリル"],"ぐりーん":["グリーン"],"ぐりーんぴーす":["グリーンピース"],"ぐるじあ":["グルジア"],"ぐるめ":["グルメ"],"ぐるーぷ":["グループ"],"ぐるーゔ":["グルーヴ"],"ぐれい":["グレイ"],"ぐれー":["グレー"],"ぐれーと":["グレート"],"ぐれーど":["グレード"],"ぐれーぷ":["グレープ"],"ぐれーぷふるーつ":["グレープフルーツ"],"ぐろ":["グロ"],"ぐろーばる":["グローバル"],"ぐろーぶ":["グローブ"],"ぐー":["グー"],"ぐーぐる":["グーグル"],"ぐーぐー":["グーグー"],"けあ":["ケア"],"けいたい":["携帯","形態","ケイタイ"],"けせらせら":["ケセラセラ"],"けちゃっぷ":["ケチャップ"],"けーき":["ケーキ"],"けーじ":["ケージ"],"けーす":["ケース"],"けーたい":["ケータイ"],"けーぶる":["ケーブル"],"けーぶるてれび":["ケーブルテレビ"],"けーぷ":["ケープ"],"げい":["芸","ゲイ"],"げすと":["ゲスト"],"げっと":["ゲット"],"げりら":["ゲリラ"],"げる":["ゲル"],"げれんで":["ゲレンデ"],"げん":["元","原","現","源","減","ゲン","弦"],"げーじ":["ゲージ"],"げーせん":["ゲーセン"],"げーと":["ゲート"],"げーまー":["ゲーマー"],"げーむ":["ゲーム"],"げーむせんたー":["ゲームセンター"],"げーむそふと":["ゲームソフト"],"こあ":["コア"],"こあら":["コアラ"],"こい":["恋","濃い","鯉","乞い","コイ"],"こいん":["コイン"],"ここあ":["ココア"],"ここなっつ":["ココナッツ"],"こし":["腰","コシ"],"こしょう":["故障","胡椒","コショウ"],"こすちゅーむ":["コスチューム"],"こすと":["コスト"],"こすぷれ":["コスプレ"],"こすめ":["コスメ"],"こすも":["コスモ"],"こすもす":["コスモス"],"こっく":["コック"],"こっとん":["コットン"],"こっぷ":["コップ"],"こつ":["骨","コツ"],"こね":["コネ"],"こぴぺ":["コピペ"],"こぴー":["コピー"],"こま":["コマ","駒"],"こまんど":["コマンド"],"こまーしゃる":["コマーシャル"],"こみかる":["コミカル"],"こみけ":["コミケ"],"こみっく":["コミック"],"こみっくす":["コミックス"],"こみゅ":["コミュ"],"こみゅにけーしょん":["コミュニケーション"],"こみゅにてぃ":["コミュニティ"],"こみゅにてぃー":["コミュニティー"],"こむ":["コム","混む"],"こめ":["米","コメ"],"こめでぃ":["コメディ"],"こめでぃー":["コメディー"],"こめんてーたー":["コメンテーター"],"こめんと":["コメント"],"こめんとらん":["コメント欄"],"こらぼ":["コラボ"],"こらぼれーしょん":["コラボレーション"],"こらむ":["コラム"],"こらーげん":["コラーゲン"],"こりー":["コリー"],"これくしょん":["コレクション"],"これくたー":["コレクター"],"これすてろーる":["コレステロール"],"ころっけ":["コロッケ"],"ころん":["コロン"],"ころんびあ":["コロンビア"],"こんくりーと":["コンクリート"],"こんくーる":["コンクール"],"こんさる":["コンサル"],"こんさるたんと":["コンサルタント"],"こんさるてぃんぐ":["コンサルティング"],"こんさーと":["コンサート"],"こんせぷと":["コンセプト"],"こんせんと":["コンセント"],"こんそめ":["コンソメ"],"こんたくと":["コンタクト"],"こんたくとれんず":["コンタクトレンズ"],"こんてすと":["コンテスト"],"こんてな":["コンテナ"],"こんてんつ":["コンテンツ"],"こんでぃしょん":["コンディション"],"こんと":["コント"],"こんとらすと":["コントラスト"],"こんとろーる":["コントロール"],"こんぱくと":["コンパクト"],"こんび":["コンビ"],"こんびに":["コンビニ"],"こんぴゅーた":["コンピュータ"],"こんぴゅーたー":["コンピューター"],"こんぷりーと":["コンプリート"],"こんぷれっくす":["コンプレックス"],"こんぺ":["コンペ"],"こんぼ":["コンボ"],"こーす":["コース"],"こーすたー":["コースター"],"こーち":["コーチ"],"こーてぃんぐ":["コーティング"],"こーでぃねーたー":["コーディネーター"],"こーでぃねーと":["コーディネート"],"こーと":["コート"],"こーど":["コード"],"こーなー":["コーナー"],"こーひー":["コーヒー","珈琲"],"こーぷ":["コープ"],"こーぽれーしょん":["コーポレーション"],"こーら":["コーラ"],"こーらす":["コーラス"],"こーる":["コール"],"こーるど":["コールド"],"こーん":["コーン"],"ごきぶり":["ゴキブリ"],"ごじら":["ゴジラ"],"ごすぺる":["ゴスペル"],"ごっど":["ゴッド"],"ごみ":["ゴミ"],"ごむ":["ゴム"],"ごりら":["ゴリラ"],"ごるふ":["ゴルフ"],"ごるふぁー":["ゴルファー"],"ごるふじょう":["ゴルフ場"],"ごろ":["頃","ゴロ"],"ごー":["ゴー"],"ごーごー":["ゴーゴー"],"ごーじゃす":["ゴージャス"],"ごーすと":["ゴースト"],"ごーや":["ゴーヤ"],"ごーやー":["ゴーヤー"],"ごーる":["ゴール"],"ごーるでん":["ゴールデン"],"ごーるでんうぃーく":["ゴールデンウィーク"],"ごーるでんういーく":["ゴールデンウイーク"],"ごーるど":["ゴールド"],"さい":["歳","再","際","最","才","菜","サイ","細","載"],"さいえんす":["サイエンス"],"さいくりんぐ":["サイクリング"],"さいくる":["サイクル"],"さいこ":["サイコ","最古"],"さいころ":["サイコロ"],"さいず":["サイズ"],"さいだー":["サイダー"],"さいと":["サイト"],"さいど":["サイド","再度"],"さいどばー":["サイドバー"],"さいばー":["サイバー"],"さいぼーぐ":["サイボーグ"],"さいれん":["サイレン"],"さいん":["サイン"],"さいんかい":["サイン会"],"さうな":["サウナ"],"さうんど":["サウンド"],"さうんどとらっく":["サウンドトラック"],"さくせす":["サクセス"],"さざえ":["サザエ"],"さすぺんす":["サスペンス"],"さっかー":["サッカー"],"さっかーちーむ":["サッカーチーム"],"さっかーぶ":["サッカー部"],"さっくす":["サックス"],"さてらいと":["サテライト"],"さば":["鯖","サバ"],"さばいばる":["サバイバル"],"さふぁり":["サファリ"],"さぶ":["サブ"],"さぶたいとる":["サブタイトル"],"さぶぷらいむ":["サブプライム"],"さぷらいず":["サプライズ"],"さぷり":["サプリ"],"さぷりめんと":["サプリメント"],"さぼてん":["サボテン"],"さぽーたー":["サポーター"],"さぽーと":["サポート"],"さまー":["サマー"],"さまーたいむ":["サマータイム"],"さみっと":["サミット"],"さむ":["サム"],"さら":["新","更","皿","盤","サラ"],"さらだ":["サラダ"],"さらりーまん":["サラリーマン"],"さりー":["サリー"],"さわー":["サワー"],"さんきゅー":["サンキュー"],"さんくす":["サンクス"],"さんぐらす":["サングラス"],"さんしゃいん":["サンシャイン"],"さんせっと":["サンセット"],"さんたくろーす":["サンタクロース"],"さんだる":["サンダル"],"さんだー":["サンダー"],"さんでー":["サンデー"],"さんとら":["サントラ"],"さんとりー":["サントリー"],"さんど":["サンド","三度"],"さんどいっち":["サンドイッチ"],"さんば":["サンバ"],"さんふらんしすこ":["サンフランシスコ"],"さんぷる":["サンプル"],"さー":["サー"],"さーかす":["サーカス"],"さーきっと":["サーキット"],"さーくる":["サークル"],"さーち":["サーチ"],"さーちえんじん":["サーチエンジン"],"さーど":["サード"],"さーば":["サーバ"],"さーばー":["サーバー"],"さーびす":["サービス"],"さーふ":["サーフ"],"さーふぁー":["サーファー"],"さーふぃん":["サーフィン"],"さーぶ":["サーブ"],"さーもん":["サーモン"],"ざっく":["ザック"],"しあたー":["シアター"],"しあとる":["シアトル"],"しい":["シイ"],"しぇあ":["シェア"],"しぇいく":["シェイク"],"しぇぱーど":["シェパード"],"しぇふ":["シェフ"],"しぇる":["シェル"],"しかご":["シカゴ"],"しくらめん":["シクラメン"],"しぐなる":["シグナル"],"しすこ":["シスコ"],"しすたー":["シスター"],"しすてむ":["システム"],"しちゅえーしょん":["シチュエーション"],"しちゅー":["シチュー"],"しっく":["シック"],"しっぷ":["シップ"],"してぃ":["シティ"],"しどにー":["シドニー"],"しなもん":["シナモン"],"しなりお":["シナリオ"],"しにあ":["シニア"],"しねこん":["シネコン"],"しねま":["シネマ"],"しびあ":["シビア"],"しふぉん":["シフォン"],"しふと":["シフト"],"しべりあ":["シベリア"],"しみゅれーしょん":["シミュレーション"],"しゃい":["シャイ"],"しゃったー":["シャッター"],"しゃつ":["シャツ","奴"],"しゃとる":["シャトル"],"しゃねる":["シャネル"],"しゃぼん":["シャボン"],"しゃわー":["シャワー"],"しゃん":["シャン"],"しゃんぱん":["シャンパン"],"しゃんぷー":["シャンプー"],"しゃーぷ":["シャープ"],"しゃーべっと":["シャーベット"],"しゅがー":["シュガー"],"しゅーくりーむ":["シュークリーム"],"しゅーと":["シュート"],"しゅーる":["シュール"],"しょう":["小","賞","省","症","章","商","床","相","傷","少","ショウ","荘","匠","象","抄","将","升","背負う"],"しょこら":["ショコラ"],"しょっきんぐ":["ショッキング"],"しょっく":["ショック"],"しょっと":["ショット"],"しょっぴんぐ":["ショッピング"],"しょっぴんぐせんたー":["ショッピングセンター"],"しょっぴんぐもーる":["ショッピングモール"],"しょっぷ":["ショップ"],"しょぱん":["ショパン"],"しょるだー":["ショルダー"],"しょー":["ショー"],"しょーと":["ショート"],"しりあす":["シリアス"],"しりある":["シリアル"],"しりうす":["シリウス"],"しりこん":["シリコン"],"しりーず":["シリーズ"],"しるえっと":["シルエット"],"しるく":["シルク"],"しるくろーど":["シルクロード"],"しるばー":["シルバー"],"しろっぷ":["シロップ"],"しん":["心","新","親","真","寝","シン","信","清","芯","辛","参","秦"],"しんがぽーる":["シンガポール"],"しんがー":["シンガー"],"しんがーそんぐらいたー":["シンガーソングライター"],"しんくろ":["シンクロ"],"しんぐる":["シングル"],"しんでれら":["シンデレラ"],"しんふぉにー":["シンフォニー"],"しんぷる":["シンプル"],"しんぼる":["シンボル"],"しんぽじうむ":["シンポジウム"],"しー":["シー"],"しーくれっと":["シークレット"],"しーさー":["シーサー"],"しーずん":["シーズン"],"しーつ":["シーツ"],"しーと":["シート"],"しーど":["シード"],"しーふーど":["シーフード"],"しーる":["シール"],"しーん":["シーン"],"じぇい":["ジェイ"],"じぇっと":["ジェット"],"じぇっとこーすたー":["ジェットコースター"],"じぇらーと":["ジェラート"],"じぇりー":["ジェリー"],"じぇる":["ジェル"],"じむ":["事務","ジム"],"じゃいあんと":["ジャイアント"],"じゃがいも":["ジャガイモ"],"じゃがー":["ジャガー"],"じゃけっと":["ジャケット"],"じゃすと":["ジャスト"],"じゃすみん":["ジャスミン"],"じゃず":["ジャズ"],"じゃっく":["ジャック"],"じゃっじ":["ジャッジ"],"じゃぱにーず":["ジャパニーズ"],"じゃぱん":["ジャパン"],"じゃむ":["ジャム"],"じゃんきー":["ジャンキー"],"じゃんく":["ジャンク"],"じゃんぐる":["ジャングル"],"じゃんぱー":["ジャンパー"],"じゃんぷ":["ジャンプ"],"じゃんぼ":["ジャンボ"],"じゃんる":["ジャンル"],"じゃー":["ジャー"],"じゃーじ":["ジャージ"],"じゃーなりすと":["ジャーナリスト"],"じゃーなりずむ":["ジャーナリズム"],"じゃーなる":["ジャーナル"],"じゃーまん":["ジャーマン"],"じゅえりー":["ジュエリー"],"じゅにあ":["ジュニア"],"じゅりー":["ジュリー"],"じゅーしー":["ジューシー"],"じゅーす":["ジュース"],"じょい":["ジョイ"],"じょぎんぐ":["ジョギング"],"じょぶ":["ジョブ"],"じょん":["ジョン"],"じょー":["ジョー"],"じょーく":["ジョーク"],"じる":["ジル"],"じれんま":["ジレンマ"],"じん":["人","陣","仁","ジン"],"じんぎすかん":["ジンギスカン"],"じんじゃー":["ジンジャー"],"じーぱん":["ジーパン"],"じーん":["ジーン"],"じーんと":["ジーンと"],"じーんず":["ジーンズ"],"すいか":["スイカ","スイカ"],"すいす":["スイス"],"すいっち":["スイッチ"],"すいんぐ":["スイング"],"すいーつ":["スイーツ"],"すいーと":["スイート"],"すうぃーつ":["スウィーツ"],"すうぇーでん":["スウェーデン"],"すかい":["スカイ"],"すかいらいん":["スカイライン"],"すかうと":["スカウト"],"すかる":["スカル"],"すかーと":["スカート"],"すかーれっと":["スカーレット"],"すきっぷ":["スキップ"],"すきゃん":["スキャン"],"すきゃんだる":["スキャンダル"],"すきる":["スキル"],"すきるあっぷ":["スキルアップ"],"すきん":["スキン"],"すきんけあ":["スキンケア"],"すきー":["スキー"],"すきーじょう":["スキー場"],"すぎ":["過ぎ","過ぎ","杉","スギ"],"すくえあ":["スクエア"],"すくらっぷ":["スクラップ"],"すくらんぶる":["スクランブル"],"すくりーん":["スクリーン"],"すくろーる":["スクロール"],"すくーたー":["スクーター"],"すくーぷ":["スクープ"],"すくーる":["スクール"],"すけじゅーる":["スケジュール"],"すけっち":["スケッチ"],"すけっちぶっく":["スケッチブック"],"すけーたー":["スケーター"],"すけーと":["スケート"],"すけーる":["スケール"],"すこあ":["スコア"],"すこっとらんど":["スコットランド"],"すこーん":["スコーン"],"すずき":["スズキ"],"すずめ":["雀","スズメ"],"すたいりすと":["スタイリスト"],"すたいりっしゅ":["スタイリッシュ"],"すたいる":["スタイル"],"すたじあむ":["スタジアム"],"すたじお":["スタジオ"],"すたっふ":["スタッフ"],"すたば":["スタバ"],"すたみな":["スタミナ"],"すためん":["スタメン"],"すたん":["スタン"],"すたんす":["スタンス"],"すたんだーど":["スタンダード"],"すたんど":["スタンド"],"すたんばい":["スタンバイ"],"すたんぷ":["スタンプ"],"すたー":["スター"],"すたーうぉーず":["スターウォーズ"],"すたーと":["スタート"],"すたーばっくす":["スターバックス"],"すちーる":["スチール"],"すてぃっく":["スティック"],"すてい":["ステイ"],"すてっかー":["ステッカー"],"すてっち":["ステッチ"],"すてっぷ":["ステップ"],"すてら":["ステラ"],"すてれお":["ステレオ"],"すてんどぐらす":["ステンドグラス"],"すてんれす":["ステンレス"],"すてーき":["ステーキ"],"すてーしょん":["ステーション"],"すてーじ":["ステージ"],"すてーたす":["ステータス"],"すと":["スト"],"すとあ":["ストア"],"すとっく":["ストック"],"すとっぷ":["ストップ"],"すとらいく":["ストライク"],"すとらいぷ":["ストライプ"],"すとらっぷ":["ストラップ"],"すとりーと":["ストリート"],"すとりーとびゅー":["ストリートビュー"],"すとりーむ":["ストリーム"],"すとれす":["ストレス"],"すとれすかいしょう":["ストレス解消"],"すとれっち":["ストレッチ"],"すとれーと":["ストレート"],"すとろべりー":["ストロベリー"],"すとーかー":["ストーカー"],"すとーぶ":["ストーブ"],"すとーりー":["ストーリー"],"すとーる":["ストール"],"すとーん":["ストーン"],"すなっく":["スナック"],"すなっぷ":["スナップ"],"すにーかー":["スニーカー"],"すぬーぴー":["スヌーピー"],"すのぼ":["スノボ"],"すのー":["スノー"],"すのーぼーど":["スノーボード"],"すばる":["スバル"],"すぱ":["スパ"],"すぱい":["スパイ"],"すぱいく":["スパイク"],"すぱいしー":["スパイシー"],"すぱいす":["スパイス"],"すぱいだー":["スパイダー"],"すぱいらる":["スパイラル"],"すぱげってぃ":["スパゲッティ"],"すぱげてぃ":["スパゲティ"],"すぱむ":["スパム"],"すぱん":["スパン"],"すぱーく":["スパーク"],"すぱーと":["スパート"],"すぴあ":["スピア"],"すぴっつ":["スピッツ"],"すぴりちゅある":["スピリチュアル"],"すぴりっつ":["スピリッツ"],"すぴりっと":["スピリット"],"すぴん":["スピン"],"すぴーかー":["スピーカー"],"すぴーち":["スピーチ"],"すぴーど":["スピード"],"すぷりんぐ":["スプリング"],"すぷりんと":["スプリント"],"すぷれー":["スプレー"],"すぷーん":["スプーン"],"すぺいん":["スペイン"],"すぺいんご":["スペイン語"],"すぺしゃりすと":["スペシャリスト"],"すぺしゃる":["スペシャル"],"すぺっく":["スペック"],"すぺーす":["スペース"],"すぺーど":["スペード"],"すぽっと":["スポット"],"すぽんさー":["スポンサー"],"すぽんじ":["スポンジ"],"すぽーつ":["スポーツ"],"すぽーつくらぶ":["スポーツクラブ"],"すぽーつせんしゅ":["スポーツ選手"],"すまいる":["スマイル"],"すまーと":["スマート"],"すみれ":["スミレ"],"すむーす":["スムース"],"すむーず":["スムーズ"],"すもーく":["スモーク"],"すらいす":["スライス"],"すらいど":["スライド"],"すらいどしょー":["スライドショー"],"すらむ":["スラム"],"すらんぷ":["スランプ"],"すりっぱ":["スリッパ"],"すりっぷ":["スリップ"],"すりむ":["スリム"],"すりる":["スリル"],"すりー":["スリー"],"するー":["スルー"],"すれ":["スレ"],"すれっど":["スレッド"],"すろっと":["スロット"],"すろー":["スロー"],"すろーがん":["スローガン"],"すわっぷ":["スワップ"],"すわん":["スワン"],"すーつ":["スーツ"],"すーつけーす":["スーツケース"],"すーぱー":["スーパー"],"すーぷ":["スープ"],"ずっきーに":["ズッキーニ"],"ずぼん":["ズボン"],"ずーむ":["ズーム"],"せかんど":["セカンド"],"せかんどらいふ":["セカンドライフ"],"せきゅりてぃ":["セキュリティ"],"せきゅりてぃー":["セキュリティー"],"せくしょん":["セクション"],"せくしー":["セクシー"],"せくはら":["セクハラ"],"せっくす":["セックス"],"せっしょん":["セッション"],"せってぃんぐ":["セッティング"],"せっと":["セット"],"せぶん":["セブン"],"せぶんいれぶん":["セブンイレブン"],"せみ":["セミ","蝉"],"せみなー":["セミナー"],"せら":["セラ"],"せらぴすと":["セラピスト"],"せらぴー":["セラピー"],"せりふ":["セリフ","台詞"],"せる":["セル"],"せるふ":["セルフ"],"せれくしょん":["セレクション"],"せれくと":["セレクト"],"せれぶ":["セレブ"],"せれもにー":["セレモニー"],"せろり":["セロリ"],"せん":["先","戦","線","千","選","セン","仙","銭","栓"],"せんさー":["センサー"],"せんす":["センス"],"せんたー":["センター"],"せんち":["センチ"],"せんと":["仙","セント","セント"],"せんとらる":["セントラル"],"せーたー":["セーター"],"せーふ":["セーフ"],"せーぶ":["セーブ"],"せーらー":["セーラー"],"せーる":["セール"],"せーるす":["セールス"],"ぜみ":["ゼミ"],"ぜりー":["ゼリー"],"ぜろ":["ゼロ"],"そ":["素","祖","ソ"],"そうる":["ソウル"],"そっくす":["ソックス"],"そてー":["ソテー"],"そなた":["ソナタ"],"そにっく":["ソニック"],"そにー":["ソニー"],"そふぁ":["ソファ"],"そふぁー":["ソファー"],"そふと":["ソフト"],"そふとうぇあ":["ソフトウェア"],"そふとくりーむ":["ソフトクリーム"],"そふとばんく":["ソフトバンク"],"そふとぼーる":["ソフトボール"],"そぷらの":["ソプラノ"],"そむりえ":["ソムリエ"],"そりゅーしょん":["ソリューション"],"そる":["ソル"],"そると":["ソルト"],"そろ":["ソロ","候"],"そんぐ":["ソング"],"そーす":["ソース"],"そーせーじ":["ソーセージ"],"そーだ":["ソーダ"],"そーど":["ソード"],"そーぷ":["ソープ"],"そーらー":["ソーラー"],"そーる":["ソール"],"それん":["ソ連"],"ぞんび":["ゾンビ"],"ぞーん":["ゾーン"],"たいあっぷ":["タイアップ"],"たいがー":["タイガー"],"たいつ":["タイツ"],"たいと":["タイト"],"たいとる":["タイトル"],"たいぷ":["タイプ"],"たいまー":["タイマー"],"たいみんぐ":["タイミング"],"たいむ":["タイム"],"たいむすりっぷ":["タイムスリップ"],"たいむず":["タイムズ"],"たいむりー":["タイムリー"],"たいや":["タイヤ"],"たいる":["タイル"],"たうん":["タウン"],"たおる":["タオル"],"たくしー":["タクシー"],"たぐ":["タグ"],"たこ":["タコ"],"たす":["タス"],"たっくる":["タックル"],"たっち":["タッチ"],"たばこ":["タバコ","煙草"],"たふ":["タフ"],"たぶ":["タブ"],"たぶー":["タブー"],"ため":["為","タメ"],"たると":["タルト"],"たれんと":["タレント"],"たわー":["タワー"],"たんく":["タンク"],"たんぽぽ":["タンポポ"],"たーげっと":["ターゲット"],"たーぼ":["ターボ"],"たーみなる":["ターミナル"],"たーん":["ターン"],"だいあもんど":["ダイアモンド"],"だいありー":["ダイアリー"],"だいえっと":["ダイエット"],"だいじぇすと":["ダイジェスト"],"だいなまいと":["ダイナマイト"],"だいなみっく":["ダイナミック"],"だいにんぐ":["ダイニング"],"だいばー":["ダイバー"],"だいびんぐ":["ダイビング"],"だいぶ":["大分","ダイブ"],"だいや":["ダイヤ"],"だいやもんど":["ダイヤモンド"],"だいやる":["ダイヤル"],"だいれくと":["ダイレクト"],"だう":["ダウ"],"だうん":["ダウン"],"だうんたうん":["ダウンタウン"],"だうんろーど":["ダウンロード"],"だっく":["ダック"],"だっしゅ":["ダッシュ","奪取"],"だびんぐ":["ダビング"],"だぶる":["ダブル"],"だむ":["ダム"],"だめ":["ダメ","駄目"],"だめーじ":["ダメージ"],"だりあ":["ダリア"],"だんく":["ダンク"],"だんさー":["ダンサー"],"だんじょん":["ダンジョン"],"だんす":["ダンス"],"だんでぃ":["ダンディ"],"だんとつ":["ダントツ"],"だんぼーる":["ダンボール","段ボール"],"だー":["ダー"],"だーく":["ダーク"],"だーす":["ダース"],"だーつ":["ダーツ"],"だーりん":["ダーリン"],"ち":["家","道","地","個","千","血","値","路","知","智","乳","チ"],"ちぇ":["チェ"],"ちぇあ":["チェア"],"ちぇこ":["チェコ"],"ちぇっく":["チェック"],"ちぇっくあうと":["チェックアウト"],"ちぇっくいん":["チェックイン"],"ちぇりー":["チェリー"],"ちぇろ":["チェロ"],"ちぇんじ":["チェンジ"],"ちぇーん":["チェーン"],"ちぇーんてん":["チェーン店"],"ちきん":["チキン"],"ちけっと":["チケット"],"ちっく":["チック"],"ちっぷ":["チップ"],"ちび":["チビ"],"ちべっと":["チベット"],"ちゃいな":["チャイナ"],"ちゃいるど":["チャイルド"],"ちゃこ":["チャコ"],"ちゃっく":["チャック"],"ちゃっと":["チャット"],"ちゃりてぃー":["チャリティー"],"ちゃれんじ":["チャレンジ"],"ちゃれんじゃー":["チャレンジャー"],"ちゃんす":["チャンス"],"ちゃんねる":["チャンネル"],"ちゃんぴおん":["チャンピオン"],"ちゃんぷ":["チャンプ"],"ちゃーじ":["チャージ"],"ちゃーと":["チャート"],"ちゃーはん":["チャーハン"],"ちゃーみんぐ":["チャーミング"],"ちゃーむ":["チャーム"],"ちゅーなー":["チューナー"],"ちゅーにんぐ":["チューニング"],"ちゅーぶ":["チューブ"],"ちゅーりっぷ":["チューリップ"],"ちゅーん":["チューン"],"ちょいす":["チョイス"],"ちょこ":["チョコ"],"ちょこれーと":["チョコレート"],"ちょん":["チョン"],"ちょー":["チョー"],"ちらし":["チラシ"],"ちるどれん":["チルドレン"],"ちろる":["チロル"],"ちわわ":["チワワ"],"ちーず":["チーズ"],"ちーずけーき":["チーズケーキ"],"ちーふ":["チーフ"],"ちーぷ":["チープ"],"ちーむ":["チーム"],"つあー":["ツアー"],"ついん":["ツイン"],"つき":["月","付き","杯","着き","付き","ツキ","ツキ","吐き","尽き"],"つな":["ツナ","綱"],"つばめ":["ツバメ","燕"],"つりー":["ツリー"],"つる":["鶴","弦","ツル","釣る"],"つんでれ":["ツンデレ"],"つー":["ツー"],"つーしょっと":["ツーショット"],"つーりんぐ":["ツーリング"],"つーる":["ツール"],"てぃ":["ティ"],"てぃあら":["ティアラ"],"てぃっしゅ":["ティッシュ"],"てぃー":["ティー"],"てぃーん":["ティーン"],"ていくあうと":["テイクアウト"],"ていすと":["テイスト"],"てき":["的","敵","テキ"],"てきさす":["テキサス"],"てきすと":["テキスト"],"てく":["テク"],"てくにかる":["テクニカル"],"てくにっく":["テクニック"],"てくの":["テクノ"],"てくのろじー":["テクノロジー"],"てすと":["テスト"],"てっく":["テック"],"てにす":["テニス"],"てら":["寺","テラ"],"てらす":["テラス"],"てりあ":["テリア"],"てる":["テル"],"てれび":["テレビ"],"てれびどらま":["テレビドラマ"],"てれびきょく":["テレビ局"],"てれびえいが":["テレビ映画"],"てれびばんぐみ":["テレビ番組"],"てろ":["テロ"],"てろりすと":["テロリスト"],"てん":["テン","テン","店","点","展","天"],"てんしょん":["テンション"],"てんと":["テント"],"てんぷれ":["テンプレ"],"てんぷれーと":["テンプレート"],"てんぽ":["店舗","テンポ"],"てーぶる":["テーブル"],"てーぷ":["テープ"],"てーま":["テーマ"],"てーまそんぐ":["テーマソング"],"てーまぱーく":["テーマパーク"],"てーる":["テール"],"でぃ":["ディ"],"でぃすく":["ディスク"],"でぃすこ":["ディスコ"],"でぃすぷれい":["ディスプレイ"],"でぃずにー":["ディズニー"],"でぃずにーらんど":["ディズニーランド"],"でぃなー":["ディナー"],"でぃふぇんす":["ディフェンス"],"でぃれくたー":["ディレクター"],"でぃん":["ディン"],"でぃーぜる":["ディーゼル"],"でぃーぷ":["ディープ"],"でぃーらー":["ディーラー"],"でい":["デイ"],"でいりー":["デイリー"],"でこれーしょん":["デコレーション"],"でざいなー":["デザイナー"],"でざいん":["デザイン"],"でざーと":["デザート"],"でじいち":["デジイチ"],"でじかめ":["デジカメ"],"でじたる":["デジタル"],"でじたるかめら":["デジタルカメラ"],"です":["デス"],"ですく":["デスク"],"ですくとっぷ":["デスクトップ"],"でっき":["デッキ"],"でっど":["デッド"],"でにむ":["デニム"],"でぱーと":["デパート"],"でぱちか":["デパ地下"],"でびゅー":["デビュー"],"でびる":["デビル"],"でふぉると":["デフォルト"],"でぶ":["デブ"],"でめりっと":["デメリット"],"でゅえっと":["デュエット"],"でゅお":["デュオ"],"でらっくす":["デラックス"],"でりけーと":["デリケート"],"でんまーく":["デンマーク"],"でーた":["データ"],"でーたべーす":["データベース"],"でーと":["デート"],"といれ":["トイレ"],"といれっと":["トイレット"],"とう":["等","頭","島","当","党","塔","問う","糖","トウ","灯","刀","棟","唐"],"とうもろこし":["トウモロコシ"],"ところ":["所","トコロ"],"とす":["トス"],"とっぴんぐ":["トッピング"],"とっぷ":["トップ"],"とっぷくらす":["トップクラス"],"とぴっく":["トピック"],"とぴっくす":["トピックス"],"とまと":["トマト"],"とまとそーす":["トマトソース"],"とよた":["トヨタ"],"とら":["虎","トラ","寅"],"とらい":["トライ"],"とらいあすろん":["トライアスロン"],"とらいある":["トライアル"],"とらうま":["トラウマ"],"とらくたー":["トラクター"],"とらっく":["トラック"],"とらっくばっく":["トラックバック"],"とらっぷ":["トラップ"],"とらぶる":["トラブル"],"とらべる":["トラベル"],"とらんく":["トランク"],"とらんす":["トランス"],"とらんすふぉーまー":["トランスフォーマー"],"とらんぷ":["トランプ"],"とらんぺっと":["トランペット"],"とりお":["トリオ"],"とりっく":["トリック"],"とりっぷ":["トリップ"],"とりびあ":["トリビア"],"とりぷる":["トリプル"],"とりみんぐ":["トリミング"],"とりーとめんと":["トリートメント"],"とれじゃー":["トレジャー"],"とれっきんぐ":["トレッキング"],"とれんど":["トレンド"],"とれー":["トレー"],"とれーす":["トレース"],"とれーだー":["トレーダー"],"とれーど":["トレード"],"とれーなー":["トレーナー"],"とれーにんぐ":["トレーニング"],"とろぴかる":["トロピカル"],"とん":["トン"],"とんでも":["トンデモ"],"とんねる":["トンネル"],"とー":["トー"],"とーく":["トーク"],"とーくしょー":["トークショー"],"とーすと":["トースト"],"とーたる":["トータル"],"とーなめんと":["トーナメント"],"とーる":["トール"],"とーん":["トーン"],"どあ":["ドア"],"どいつ":["ドイツ"],"どいつじん":["ドイツ人"],"どいつご":["ドイツ語"],"どきゅめんたりー":["ドキュメンタリー"],"どきゅめんと":["ドキュメント"],"どくたー":["ドクター"],"どこも":["ドコモ"],"どじ":["ドジ"],"どす":["ドス"],"どっく":["ドック"],"どっぐ":["ドッグ"],"どめいん":["ドメイン"],"どらい":["ドライ"],"どらいばー":["ドライバー"],"どらいぶ":["ドライブ"],"どらいやー":["ドライヤー"],"どらくえ":["ドラクエ"],"どらごん":["ドラゴン"],"どらっぐ":["ドラッグ"],"どらっぐすとあ":["ドラッグストア"],"どらふと":["ドラフト"],"どらま":["ドラマ"],"どらまちっく":["ドラマチック"],"どらまー":["ドラマー"],"どらむ":["ドラム"],"どりぶる":["ドリブル"],"どりる":["ドリル"],"どりんく":["ドリンク"],"どりー":["ドリー"],"どりーむ":["ドリーム"],"どる":["ドル"],"どるちぇ":["ドルチェ"],"どれす":["ドレス"],"どれすあっぷ":["ドレスアップ"],"どれっしんぐ":["ドレッシング"],"どろっぷ":["ドロップ"],"どろー":["ドロー"],"どーなつ":["ドーナツ"],"どーむ":["ドーム"],"どーる":["ドール"],"ないす":["ナイス"],"ないたー":["ナイター"],"ないと":["ナイト","無いと"],"ないふ":["ナイフ"],"ないん":["ナイン"],"なしょなる":["ナショナル"],"なちす":["ナチス"],"なちゅらる":["ナチュラル"],"なっつ":["ナッツ"],"なの":["ナノ"],"なび":["ナビ"],"なびげーたー":["ナビゲーター"],"なぽりたん":["ナポリタン"],"なぽれおん":["ナポレオン"],"なれーしょん":["ナレーション"],"なんばー":["ナンバー"],"なんばーわん":["ナンバーワン"],"なんぱ":["ナンパ"],"なーす":["ナース"],"にこにこ":["ニコニコ"],"にこらす":["ニコラス"],"にっく":["ニック"],"にっくねーむ":["ニックネーム"],"にっと":["ニット"],"にやにや":["ニヤニヤ"],"にやり":["ニヤリ"],"にゅあんす":["ニュアンス"],"にゅー":["ニュー","ニュー"],"にゅーじーらんど":["ニュージーランド"],"にゅーす":["ニュース"],"にゅーすさいと":["ニュースサイト"],"にゅーよーく":["ニューヨーク"],"にら":["ニラ"],"にーず":["ニーズ"],"にーと":["ニート"],"ぬーど":["ヌード"],"ぬーどる":["ヌードル"],"ねいちゃー":["ネイチャー"],"ねいる":["ネイル"],"ねいるあーと":["ネイルアート"],"ねお":["ネオ"],"ねがてぃぶ":["ネガティブ"],"ねぎ":["ネギ","葱"],"ねくすと":["ネクスト"],"ねくたい":["ネクタイ"],"ねす":["ネス"],"ねずみ":["ネズミ","鼠"],"ねたばれ":["ネタバレ","ネタばれ"],"ねっく":["ネック"],"ねっくれす":["ネックレス"],"ねっと":["ネット"],"ねっとかふぇ":["ネットカフェ"],"ねっとびじねす":["ネットビジネス"],"ねっとわーく":["ネットワーク"],"ねとげ":["ネトゲ"],"ねぱーる":["ネパール"],"ねる":["寝る","ネル"],"ねーみんぐ":["ネーミング"],"ねーむ":["ネーム"],"のあ":["ノア"],"のいず":["ノイズ"],"のうはう":["ノウハウ"],"のえる":["ノエル"],"のし":["ノシ"],"のすたるじっく":["ノスタルジック"],"のっく":["ノック"],"のぶ":["ノブ"],"のべる":["ノベル","述べる"],"のみねーと":["ノミネート"],"のりのり":["ノリノリ"],"のるうぇー":["ノルウェー"],"のるま":["ノルマ"],"のん":["ノン"],"のんふぃくしょん":["ノンフィクション"],"のー":["ノー"],"のーす":["ノース"],"のーと":["ノート"],"のーとぱそこん":["ノートパソコン"],"のーとぴーしー":["ノートＰＣ"],"のーべる":["ノーベル"],"のーまる":["ノーマル"],"はいうぇい":["ハイウェイ"],"はいきんぐ":["ハイキング"],"はいてく":["ハイテク"],"はいてんしょん":["ハイテンション"],"はいぱー":["ハイパー"],"はいびじょん":["ハイビジョン"],"はいびすかす":["ハイビスカス"],"はいぶりっど":["ハイブリッド"],"はいむ":["ハイム"],"はいらいと":["ハイライト"],"はうす":["ハウス"],"はぐ":["ハグ"],"はさみ":["ハサミ"],"はざーど":["ハザード"],"はすきー":["ハスキー"],"はっする":["ハッスル","発する"],"はっち":["ハッチ"],"はっと":["ハット"],"はっぴー":["ハッピー"],"はっぴーえんど":["ハッピーエンド"],"はと":["鳩","ハト"],"はにー":["ハニー"],"はぶ":["ハブ"],"はぷにんぐ":["ハプニング"],"はむ":["ハム"],"はむすたー":["ハムスター"],"はらはら":["ハラハラ"],"はりけーん":["ハリケーン"],"はろー":["ハロー"],"はろーわーく":["ハローワーク"],"はわいあん":["ハワイアン"],"はんかち":["ハンカチ"],"はんかちーふ":["ハンカチーフ"],"はんがりー":["ハンガリー"],"はんがー":["ハンガー"],"はんぐる":["ハングル"],"はんさむ":["ハンサム"],"はんたー":["ハンター"],"はんで":["ハンデ"],"はんでぃ":["ハンディ"],"はんど":["ハンド"],"はんどめいど":["ハンドメイド"],"はんどる":["ハンドル"],"はんどるねーむ":["ハンドルネーム"],"はんばーがー":["ハンバーガー"],"はんばーぐ":["ハンバーグ"],"はんまー":["ハンマー"],"はーと":["ハート"],"はーとふる":["ハートフル"],"はーど":["ハード"],"はーどでぃすく":["ハードディスク"],"はーどる":["ハードル"],"はーどろっく":["ハードロック"],"はーばー":["ハーバー"],"はーふ":["ハーフ"],"はーぶ":["ハーブ"],"はーぶてぃー":["ハーブティー"],"はーもにー":["ハーモニー"],"ばい":["倍","バイ","バイ","貝"],"ばいお":["バイオ"],"ばいおはざーど":["バイオハザード"],"ばいおりん":["バイオリン"],"ばいきんぐ":["バイキング"],"ばいく":["バイク"],"ばいと":["バイト"],"ばいばい":["売買","バイバイ"],"ばいぱす":["バイパス"],"ばいぶる":["バイブル"],"ばか":["バカ","馬鹿"],"ばかんす":["バカンス"],"ばくばく":["バクバク"],"ばぐ":["バグ"],"ばけつ":["バケツ"],"ばざー":["バザー"],"ばじる":["バジル"],"ばす":["バス"],"ばすけ":["バスケ"],"ばすけっと":["バスケット"],"ばすけっとぼーる":["バスケットボール"],"ばすたおる":["バスタオル"],"ばすたー":["バスター"],"ばすつあー":["バスツアー"],"ばすと":["バスト"],"ばすてい":["バス停"],"ばたふらい":["バタフライ"],"ばたー":["バター"],"ばっく":["バック"],"ばっくあっぷ":["バックアップ"],"ばっくす":["バックス"],"ばっくなんばー":["バックナンバー"],"ばっぐ":["バッグ"],"ばったー":["バッター"],"ばっち":["バッチ"],"ばってぃんぐ":["バッティング"],"ばってりー":["バッテリー"],"ばっと":["バット"],"ばっは":["バッハ"],"ばついち":["バツイチ"],"ばでぃ":["バディ"],"ばとる":["バトル"],"ばとん":["バトン"],"ばどみんとん":["バドミントン"],"ばなな":["バナナ"],"ばなー":["バナー"],"ばにら":["バニラ"],"ばぶる":["バブル"],"ばら":["バラ","バラ","原","薔薇","輩"],"ばらえてぃー":["バラエティー"],"ばらばら":["バラバラ"],"ばらんす":["バランス"],"ばらーど":["バラード"],"ばらえん":["バラ園"],"ばり":["バリ","張り","張り"],"ばりあふりー":["バリアフリー"],"ばりえーしょん":["バリエーション"],"ばりばり":["バリバリ"],"ばりゅー":["バリュー"],"ばる":["バル","張る"],"ばるこにー":["バルコニー"],"ばるせろな":["バルセロナ"],"ばるーん":["バルーン"],"ばれえ":["バレエ"],"ばればれ":["バレバレ"],"ばれんたいん":["バレンタイン"],"ばれんたいんでー":["バレンタインデー"],"ばれー":["バレー"],"ばれーぼーる":["バレーボール"],"ばろん":["バロン"],"ばん":["万","番","バン","晩","盤","判"],"ばんく":["バンク"],"ばんくーばー":["バンクーバー"],"ばんこく":["バンコク"],"ばんと":["バント"],"ばんど":["バンド"],"ばんび":["バンビ"],"ばー":["バー"],"ばーがー":["バーガー"],"ばーげん":["バーゲン"],"ばーじょん":["バージョン"],"ばーじょんあっぷ":["バージョンアップ"],"ばーす":["バース"],"ばーすでぃ":["バースディ"],"ばーすでー":["バースデー"],"ばーちゃる":["バーチャル"],"ばーど":["バード"],"ばーべきゅー":["バーベキュー"],"ばーん":["バーン"],"ぱい":["パイ"],"ぱいおにあ":["パイオニア"],"ぱいなっぷる":["パイナップル"],"ぱいぷ":["パイプ"],"ぱいれーつ":["パイレーツ"],"ぱいろっと":["パイロット"],"ぱいん":["パイン"],"ぱうだー":["パウダー"],"ぱうんどけーき":["パウンドケーキ"],"ぱきすたん":["パキスタン"],"ぱくり":["パクリ"],"ぱしふぃっく":["パシフィック"],"ぱじゃま":["パジャマ"],"ぱす":["パス"],"ぱすた":["パスタ"],"ぱすてる":["パステル"],"ぱすぽーと":["パスポート"],"ぱすわーど":["パスワード"],"ぱずる":["パズル"],"ぱせり":["パセリ"],"ぱそ":["パソ"],"ぱそこん":["パソコン"],"ぱたーん":["パターン"],"ぱちすろ":["パチスロ"],"ぱちぱち":["パチパチ"],"ぱちんこ":["パチンコ"],"ぱっ":["パッ"],"ぱっく":["パック"],"ぱっけーじ":["パッケージ"],"ぱっしょん":["パッション"],"ぱっち":["パッチ"],"ぱっちわーく":["パッチワーク"],"ぱっど":["パッド"],"ぱてぃしえ":["パティシエ"],"ぱとかー":["パトカー"],"ぱとろーる":["パトロール"],"ぱにっく":["パニック"],"ぱねる":["パネル"],"ぱのらま":["パノラマ"],"ぱぱ":["パパ"],"ぱぴー":["パピー"],"ぱふぇ":["パフェ"],"ぱふぉーまんす":["パフォーマンス"],"ぱぶ":["パブ"],"ぱぶりっく":["パブリック"],"ぱぷりか":["パプリカ"],"ぱらだいす":["パラダイス"],"ぱらぱら":["パラパラ"],"ぱり":["パリ"],"ぱりーぐ":["パリーグ"],"ぱるこ":["パルコ"],"ぱれす":["パレス"],"ぱれすちな":["パレスチナ"],"ぱれっと":["パレット"],"ぱれーど":["パレード"],"ぱろでぃ":["パロディ"],"ぱわふる":["パワフル"],"ぱわー":["パワー"],"ぱわーあっぷ":["パワーアップ"],"ぱん":["パン"],"ぱんく":["パンク"],"ぱんけーき":["パンケーキ"],"ぱんじー":["パンジー"],"ぱんだ":["パンダ"],"ぱんち":["パンチ"],"ぱんちら":["パンチラ"],"ぱんつ":["パンツ"],"ぱんぱん":["パンパン"],"ぱんふ":["パンフ"],"ぱんふれっと":["パンフレット"],"ぱんぷきん":["パンプキン"],"ぱんや":["パン屋"],"ぱー":["パー"],"ぱーかっしょん":["パーカッション"],"ぱーかー":["パーカー"],"ぱーきんぐ":["パーキング"],"ぱーく":["パーク"],"ぱーせんと":["パーセント"],"ぱーそなりてぃ":["パーソナリティ"],"ぱーそなる":["パーソナル"],"ぱーつ":["パーツ"],"ぱーてぃ":["パーティ"],"ぱーてぃー":["パーティー"],"ぱーと":["パート"],"ぱーとなー":["パートナー"],"ぱーふぇくと":["パーフェクト"],"ぱーぷる":["パープル"],"ぱーま":["パーマ"],"ぱーる":["パール"],"ひあるろんさん":["ヒアルロン酸"],"ひっと":["ヒット"],"ひっぷ":["ヒップ"],"ひっぷほっぷ":["ヒップホップ"],"ひとらー":["ヒトラー"],"ひまらや":["ヒマラヤ"],"ひゅーまん":["ヒューマン"],"ひる":["昼","ヒル"],"ひれ":["ヒレ"],"ひろいん":["ヒロイン"],"ひんと":["ヒント"],"ひーたー":["ヒーター"],"ひーと":["ヒート"],"ひーる":["ヒール"],"ひーろー":["ヒーロー"],"びあ":["ビア"],"びあがーでん":["ビアガーデン"],"びおら":["ビオラ"],"びきに":["ビキニ"],"びぎなー":["ビギナー"],"びくたー":["ビクター"],"びざ":["ビザ"],"びじたー":["ビジター"],"びじねす":["ビジネス"],"びじねすほてる":["ビジネスホテル"],"びじねすまん":["ビジネスマン"],"びじゅある":["ビジュアル"],"びじょん":["ビジョン"],"びす":["ビス"],"びすけっと":["ビスケット"],"びすとろ":["ビストロ"],"びたみん":["ビタミン"],"びたー":["ビター"],"びっくり":["ビックリ","吃驚"],"びっぐ":["ビッグ"],"びっと":["ビット"],"びでお":["ビデオ"],"びでおかめら":["ビデオカメラ"],"びにーる":["ビニール"],"びにーるぶくろ":["ビニール袋"],"びば":["ビバ"],"びびり":["ビビリ"],"びゅー":["ビュー"],"びゅーてぃ":["ビューティ"],"びゅーてぃふる":["ビューティフル"],"びゅーてぃー":["ビューティー"],"びら":["ビラ"],"びる":["ビル"],"びるだー":["ビルダー"],"びれっじ":["ビレッジ"],"びんご":["ビンゴ"],"びー":["ビー"],"びーぐる":["ビーグル"],"びーず":["ビーズ"],"びーち":["ビーチ"],"びーと":["ビート"],"びーとるず":["ビートルズ"],"びーふ":["ビーフ"],"びーむ":["ビーム"],"びーる":["ビール"],"びーんず":["ビーンズ"],"ぴあ":["ピア"],"ぴあす":["ピアス"],"ぴあにすと":["ピアニスト"],"ぴあの":["ピアノ"],"ぴえろ":["ピエロ"],"ぴくにっく":["ピクニック"],"ぴざ":["ピザ"],"ぴっく":["ピック"],"ぴっくあっぷ":["ピックアップ"],"ぴっち":["ピッチ"],"ぴっちゃー":["ピッチャー"],"ぴっちんぐ":["ピッチング"],"ぴっと":["ピット"],"ぴゅあ":["ピュア"],"ぴらみっど":["ピラミッド"],"ぴり":["ピリ"],"ぴん":["ピン"],"ぴんく":["ピンク"],"ぴんち":["ピンチ"],"ぴんと":["ピント"],"ぴんぽいんと":["ピンポイント"],"ぴんぽん":["ピンポン"],"ぴーく":["ピーク"],"ぴーす":["ピース"],"ぴーち":["ピーチ"],"ぴーなっつ":["ピーナッツ"],"ぴーぷる":["ピープル"],"ぴーまん":["ピーマン"],"ふぁ":["ファ"],"ふぁいたー":["ファイター"],"ふぁいと":["ファイト"],"ふぁいなる":["ファイナル"],"ふぁいぶ":["ファイブ"],"ふぁいやー":["ファイヤー"],"ふぁいる":["ファイル"],"ふぁいん":["ファイン"],"ふぁいんだー":["ファインダー"],"ふぁくとりー":["ファクトリー"],"ふぁっしょん":["ファッション"],"ふぁみこん":["ファミコン"],"ふぁみりー":["ファミリー"],"ふぁみれす":["ファミレス"],"ふぁん":["ファン"],"ふぁんきー":["ファンキー"],"ふぁんくらぶ":["ファンクラブ"],"ふぁんさいと":["ファンサイト"],"ふぁんたじー":["ファンタジー"],"ふぁんたすてぃっく":["ファンタスティック"],"ふぁんど":["ファンド"],"ふぁー":["ファー"],"ふぁーすと":["ファースト"],"ふぁーすとふーど":["ファーストフード"],"ふぁーむ":["ファーム"],"ふぃぎゅあ":["フィギュア"],"ふぃぎゅあすけーと":["フィギュアスケート"],"ふぃくしょん":["フィクション"],"ふぃっしゅ":["フィッシュ"],"ふぃっしんぐ":["フィッシング"],"ふぃっと":["フィット"],"ふぃっとねす":["フィットネス"],"ふぃなーれ":["フィナーレ"],"ふぃにっしゅ":["フィニッシュ"],"ふぃりぴん":["フィリピン"],"ふぃる":["フィル"],"ふぃるたー":["フィルター"],"ふぃるむ":["フィルム"],"ふぃん":["フィン"],"ふぃんらんど":["フィンランド"],"ふぃーど":["フィード"],"ふぃーばー":["フィーバー"],"ふぃーるど":["フィールド"],"ふぇあ":["フェア"],"ふぇありー":["フェアリー"],"ふぇいす":["フェイス"],"ふぇすた":["フェスタ"],"ふぇすてぃばる":["フェスティバル"],"ふぇち":["フェチ"],"ふぇにっくす":["フェニックス"],"ふぇらーり":["フェラーリ"],"ふぇりー":["フェリー"],"ふぇると":["フェルト"],"ふぇんす":["フェンス"],"ふぉっくす":["フォックス"],"ふぉと":["フォト"],"ふぉとぐらふぁー":["フォトグラファー"],"ふぉるだ":["フォルダ"],"ふぉれすと":["フォレスト"],"ふぉろー":["フォロー"],"ふぉん":["フォン"],"ふぉんと":["フォント"],"ふぉー":["フォー"],"ふぉーかす":["フォーカス"],"ふぉーく":["フォーク"],"ふぉーす":["フォース"],"ふぉーど":["フォード"],"ふぉーむ":["フォーム"],"ふぉーらむ":["フォーラム"],"ふじ":["フジ","藤"],"ふじてれび":["フジテレビ"],"ふっく":["フック"],"ふっとさる":["フットサル"],"ふっとぼーる":["フットボール"],"ふっとわーく":["フットワーク"],"ふらい":["フライ"],"ふらいと":["フライト"],"ふらいぱん":["フライパン"],"ふらいんぐ":["フライング"],"ふらぐ":["フラグ"],"ふらっぐ":["フラッグ"],"ふらっしゅ":["フラッシュ"],"ふらめんこ":["フラメンコ"],"ふらわー":["フラワー"],"ふらわーあれんじめんと":["フラワーアレンジメント"],"ふらん":["フラン"],"ふらんく":["フランク"],"ふらんす":["フランス"],"ふらんすぱん":["フランスパン"],"ふらんすじん":["フランス人"],"ふらんすりょうり":["フランス料理"],"ふらんすご":["フランス語"],"ふりま":["フリマ"],"ふりー":["フリー"],"ふりーく":["フリーク"],"ふりーす":["フリース"],"ふりーず":["フリーズ"],"ふりーそふと":["フリーソフト"],"ふりーたー":["フリーター"],"ふりーぺーぱー":["フリーペーパー"],"ふる":["旧","フル","古","降る","故","振る"],"ふるーつ":["フルーツ"],"ふるーと":["フルート"],"ふれっしゅ":["フレッシュ"],"ふれんず":["フレンズ"],"ふれんち":["フレンチ"],"ふれんど":["フレンド"],"ふれんどりー":["フレンドリー"],"ふれーず":["フレーズ"],"ふれーばー":["フレーバー"],"ふれーむ":["フレーム"],"ふろあ":["フロア"],"ふろんてぃあ":["フロンティア"],"ふろんと":["フロント"],"ふろー":["フロー"],"ふろーりんぐ":["フローリング"],"ふわふわ":["フワフワ"],"ふーず":["フーズ"],"ふーど":["フード"],"ぶい":["部位","ブイ"],"ぶす":["ブス"],"ぶっきんぐ":["ブッキング"],"ぶっく":["ブック"],"ぶっくまーく":["ブックマーク"],"ぶっくれびゅー":["ブックレビュー"],"ぶっしゅ":["ブッシュ"],"ぶてぃっく":["ブティック"],"ぶらいだる":["ブライダル"],"ぶらいんど":["ブラインド"],"ぶらうざ":["ブラウザ"],"ぶらうす":["ブラウス"],"ぶらうん":["ブラウン"],"ぶらざー":["ブラザー"],"ぶらざーず":["ブラザーズ"],"ぶらし":["ブラシ"],"ぶらじる":["ブラジル"],"ぶらっく":["ブラック"],"ぶらぼー":["ブラボー"],"ぶらんく":["ブランク"],"ぶらんち":["ブランチ"],"ぶらんど":["ブランド"],"ぶりき":["ブリキ"],"ぶりっじ":["ブリッジ"],"ぶる":["ブル","振る"],"ぶるどっぐ":["ブルドッグ"],"ぶるー":["ブルー"],"ぶるーす":["ブルース"],"ぶるーべりー":["ブルーベリー"],"ぶるーれい":["ブルーレイ"],"ぶれいく":["ブレイク"],"ぶれす":["ブレス"],"ぶれすれっと":["ブレスレット"],"ぶれっど":["ブレッド"],"ぶれんど":["ブレンド"],"ぶれーき":["ブレーキ"],"ぶれーど":["ブレード"],"ぶろがー":["ブロガー"],"ぶろぐ":["ブログ"],"ぶろっく":["ブロック"],"ぶろっこりー":["ブロッコリー"],"ぶろー":["ブロー"],"ぶろーど":["ブロード"],"ぶろーどばんど":["ブロードバンド"],"ぶーいんぐ":["ブーイング"],"ぶーけ":["ブーケ"],"ぶーす":["ブース"],"ぶーつ":["ブーツ"],"ぶーと":["ブート"],"ぶーむ":["ブーム"],"ぷあ":["プア"],"ぷち":["プチ"],"ぷちとまと":["プチトマト"],"ぷちぷち":["プチプチ"],"ぷっしゅ":["プッシュ"],"ぷらいす":["プライス"],"ぷらいど":["プライド"],"ぷらいばしー":["プライバシー"],"ぷらいべーと":["プライベート"],"ぷらざ":["プラザ"],"ぷらす":["プラス"],"ぷらすちっく":["プラスチック"],"ぷらちな":["プラチナ"],"ぷらむ":["プラム"],"ぷらも":["プラモ"],"ぷらもでる":["プラモデル"],"ぷらん":["プラン"],"ぷらんたー":["プランター"],"ぷらんと":["プラント"],"ぷらんなー":["プランナー"],"ぷらんにんぐ":["プランニング"],"ぷり":["プリ"],"ぷりくら":["プリクラ"],"ぷりざーぶど":["プリザーブド"],"ぷりざーぶどふらわー":["プリザーブドフラワー"],"ぷりん":["プリン"],"ぷりんす":["プリンス"],"ぷりんせす":["プリンセス"],"ぷりんた":["プリンタ"],"ぷりんたー":["プリンター"],"ぷりんと":["プリント"],"ぷる":["プル"],"ぷれ":["プレ"],"ぷれい":["プレイ"],"ぷれいやー":["プレイヤー"],"ぷれす":["プレス"],"ぷれすりりーす":["プレスリリース"],"ぷれぜん":["プレゼン"],"ぷれぜんと":["プレゼント"],"ぷれっしゃー":["プレッシャー"],"ぷれびゅー":["プレビュー"],"ぷれみあ":["プレミア"],"ぷれみあむ":["プレミアム"],"ぷれりりーす":["プレリリース"],"ぷれー":["プレー"],"ぷれーおふ":["プレーオフ"],"ぷれーと":["プレート"],"ぷれーやー":["プレーヤー"],"ぷれーん":["プレーン"],"ぷろ":["プロ"],"ぷろぐらみんぐ":["プログラミング"],"ぷろぐらむ":["プログラム"],"ぷろじぇくと":["プロジェクト"],"ぷろせす":["プロセス"],"ぷろだくしょん":["プロダクション"],"ぷろでゅーさー":["プロデューサー"],"ぷろでゅーす":["プロデュース"],"ぷろふ":["プロフ"],"ぷろふぃーる":["プロフィール"],"ぷろふぇっしょなる":["プロフェッショナル"],"ぷろぽーず":["プロポーズ"],"ぷろもーしょん":["プロモーション"],"ぷろれす":["プロレス"],"ぷろれすらー":["プロレスラー"],"ぷろろーぐ":["プロローグ"],"ぷろやきゅう":["プロ野球"],"ぷんぷん":["プンプン"],"ぷーどる":["プードル"],"ぷーる":["プール"],"へあ":["ヘア"],"へあすたいる":["ヘアスタイル"],"へっど":["ヘッド"],"へっどほん":["ヘッドホン"],"へっどらいん":["ヘッドライン"],"へびー":["ヘビー"],"へり":["縁","減り","ヘリ","減り"],"へりこぷたー":["ヘリコプター"],"へる":["減る","ヘル"],"へるしー":["ヘルシー"],"へるす":["ヘルス"],"へるにあ":["ヘルニア"],"へるぱー":["ヘルパー"],"へるぷ":["ヘルプ"],"へるめっと":["ヘルメット"],"へろへろ":["ヘロヘロ"],"べあ":["ベア"],"べが":["ベガ"],"べすと":["ベスト"],"べすとせらー":["ベストセラー"],"べた":["ベタ"],"べっと":["ベット","別途"],"べっど":["ベッド"],"べてらん":["ベテラン"],"べとなむ":["ベトナム"],"べびー":["ベビー"],"べびーかー":["ベビーカー"],"べら":["ベラ"],"べらんだ":["ベランダ"],"べりー":["ベリー"],"べる":["ベル"],"べるぎー":["ベルギー"],"べると":["ベルト"],"べるりん":["ベルリン"],"べろ":["ベロ"],"べんち":["ベンチ"],"べんちゃー":["ベンチャー"],"べんつ":["ベンツ"],"べーかりー":["ベーカリー"],"べーぐる":["ベーグル"],"べーこん":["ベーコン"],"べーしすと":["ベーシスト"],"べーしっく":["ベーシック"],"べーじゅ":["ベージュ"],"べーす":["ベース"],"べーすぼーる":["ベースボール"],"べーる":["ベール"],"ぺあ":["ペア"],"ぺいんと":["ペイント"],"ぺがさす":["ペガサス"],"ぺだる":["ペダル"],"ぺっと":["ペット","ＰＥＴ"],"ぺっとしょっぷ":["ペットショップ"],"ぺっぱー":["ペッパー"],"ぺるー":["ペルー"],"ぺん":["ペン"],"ぺんき":["ペンキ"],"ぺんぎん":["ペンギン"],"ぺんしょん":["ペンション"],"ぺんだんと":["ペンダント"],"ぺーす":["ペース"],"ぺーすと":["ペースト"],"ぺーぱー":["ペーパー"],"ほ":["歩","ホ","穂","帆"],"ほいっぷ":["ホイップ"],"ほいーる":["ホイール"],"ほすと":["ホスト"],"ほたる":["ホタル","蛍"],"ほっけー":["ホッケー"],"ほっとけーき":["ホットケーキ"],"ほてる":["ホテル"],"ほのるる":["ホノルル"],"ほびー":["ホビー"],"ほむぺ":["ホムペ"],"ほらー":["ホラー"],"ほりでー":["ホリデー"],"ほるだー":["ホルダー"],"ほるもん":["ホルモン"],"ほわいとでー":["ホワイトデー"],"ほん":["本","ホン"],"ほんだ":["ホンダ"],"ほーく":["ホーク"],"ほーす":["ホース"],"ほーぷ":["ホープ"],"ほーむ":["ホーム"],"ほーむず":["ホームズ"],"ほーむぺーじ":["ホームページ"],"ほーむらん":["ホームラン"],"ほーむれす":["ホームレス"],"ほーる":["ホール"],"ほーるど":["ホールド"],"ほーん":["ホーン"],"ぼいす":["ボイス"],"ぼうりんぐ":["ボウリング"],"ぼうる":["ボウル"],"ぼくさー":["ボクサー"],"ぼくしんぐ":["ボクシング"],"ぼけ":["ボケ"],"ぼこぼこ":["ボコボコ"],"ぼす":["ボス"],"ぼすとん":["ボストン"],"ぼたん":["ボタン","牡丹","釦"],"ぼっくす":["ボックス"],"ぼでぃ":["ボディ"],"ぼでぃー":["ボディー"],"ぼとる":["ボトル"],"ぼぶ":["ボブ"],"ぼら":["ボラ"],"ぼらんてぃあ":["ボランティア"],"ぼらんてぃあかつどう":["ボランティア活動"],"ぼりゅーむ":["ボリューム"],"ぼると":["ボルト"],"ぼれー":["ボレー"],"ぼん":["ボン","盆"],"ぼんど":["ボンド"],"ぼんぼん":["ボンボン"],"ぼー":["ボー"],"ぼーい":["ボーイ"],"ぼーかる":["ボーカル"],"ぼーだー":["ボーダー"],"ぼーと":["ボート"],"ぼーど":["ボード"],"ぼーなす":["ボーナス"],"ぼーりんぐ":["ボーリング"],"ぼーる":["ボール"],"ぼーるぺん":["ボールペン"],"ぼーん":["ボーン"],"ぽいんと":["ポイント"],"ぽえむ":["ポエム"],"ぽけっと":["ポケット"],"ぽけもん":["ポケモン"],"ぽじ":["ポジ"],"ぽじしょん":["ポジション"],"ぽじてぃぶ":["ポジティブ"],"ぽすたー":["ポスター"],"ぽすと":["ポスト"],"ぽすとかーど":["ポストカード"],"ぽっと":["ポット"],"ぽっど":["ポッド"],"ぽっどきゃすと":["ポッドキャスト"],"ぽっぷ":["ポップ"],"ぽっぷこーん":["ポップコーン"],"ぽっぷす":["ポップス"],"ぽてと":["ポテト"],"ぽてとさらだ":["ポテトサラダ"],"ぽにー":["ポニー"],"ぽぴゅらー":["ポピュラー"],"ぽぴー":["ポピー"],"ぽめらにあん":["ポメラニアン"],"ぽり":["ポリ"],"ぽりしー":["ポリシー"],"ぽりす":["ポリス"],"ぽるしぇ":["ポルシェ"],"ぽるとがる":["ポルトガル"],"ぽるの":["ポルノ"],"ぽろ":["ポロ"],"ぽんど":["ポンド"],"ぽんぷ":["ポンプ"],"ぽんぽん":["ポンポン"],"ぽんず":["ポン酢"],"ぽーく":["ポーク"],"ぽーず":["ポーズ"],"ぽーたぶる":["ポータブル"],"ぽーたる":["ポータル"],"ぽーたるさいと":["ポータルサイト"],"ぽーち":["ポーチ"],"ぽーと":["ポート"],"ぽーとれーと":["ポートレート"],"ぽーらんど":["ポーランド"],"ぽーる":["ポール"],"まいかー":["マイカー"],"まいく":["マイク"],"まいくろ":["マイクロ"],"まいくろそふと":["マイクロソフト"],"まいすたー":["マイスター"],"まいなす":["マイナス"],"まいなー":["マイナー"],"まいぶーむ":["マイブーム"],"まいぺーす":["マイペース"],"まいほーむ":["マイホーム"],"まいみく":["マイミク"],"まいる":["マイル"],"まいるど":["マイルド"],"まいれーじ":["マイレージ"],"まいんど":["マインド"],"まうす":["マウス"],"まうんてん":["マウンテン"],"まうんてんばいく":["マウンテンバイク"],"まうんと":["マウント"],"まうんど":["マウンド"],"まかろに":["マカロニ"],"まかろん":["マカロン"],"まがじん":["マガジン"],"まき":["巻","巻き","マキ","薪","巻き","真木"],"まくどなるど":["マクドナルド"],"まくろ":["マクロ"],"まぐかっぷ":["マグカップ"],"まぐねっと":["マグネット"],"まざー":["マザー"],"ましん":["マシン"],"ましーん":["マシーン"],"まじっく":["マジック"],"ますく":["マスク"],"ますこっと":["マスコット"],"ますこみ":["マスコミ"],"ますたー":["マスター"],"ますたーど":["マスタード"],"ますめでぃあ":["マスメディア"],"まだむ":["マダム"],"まっく":["マック"],"まっくす":["マックス"],"まっさーじ":["マッサージ"],"まっしゅ":["マッシュ"],"まっち":["マッチ"],"まっちんぐ":["マッチング"],"まっと":["マット"],"まっど":["マッド"],"まっは":["マッハ"],"まっぷ":["マップ"],"まどんな":["マドンナ"],"まなー":["マナー"],"まにあ":["マニア"],"まにあっく":["マニアック"],"まにゅある":["マニュアル"],"まね":["真似","マネ"],"まねじめんと":["マネジメント"],"まねー":["マネー"],"まねーじゃー":["マネージャー"],"まふぃん":["マフィン"],"まふらー":["マフラー"],"まま":["ママ"],"ままちゃり":["ママチャリ"],"まよねーず":["マヨネーズ"],"まり":["マリ"],"まりね":["マリネ"],"まりん":["マリン"],"まりー":["マリー"],"まりーな":["マリーナ"],"まるち":["マルチ"],"まるちーず":["マルチーズ"],"まれーしあ":["マレーシア"],"まろん":["マロン"],"まん":["万","マン","満","萬"],"まんしょん":["マンション"],"まんはったん":["マンハッタン"],"まんほーる":["マンホール"],"まーがれっと":["マーガレット"],"まーく":["マーク"],"まーけっと":["マーケット"],"まーけてぃんぐ":["マーケティング"],"まーち":["マーチ"],"まーと":["マート"],"まーぶる":["マーブル"],"まーめいど":["マーメイド"],"みかん":["ミカン"],"みきさー":["ミキサー"],"みくろ":["ミクロ"],"みさ":["ミサ"],"みさいる":["ミサイル"],"みしゅらん":["ミシュラン"],"みしん":["ミシン"],"みす":["ミス"],"みすたー":["ミスター"],"みすちる":["ミスチル"],"みすてり":["ミステリ"],"みすてりー":["ミステリー"],"みすと":["ミスト"],"みすど":["ミスド"],"みず":["水","ミズ"],"みせす":["ミセス"],"みっきー":["ミッキー"],"みっくす":["ミックス"],"みっしょん":["ミッション"],"みっどないと":["ミッドナイト"],"みどる":["ミドル"],"みに":["ミニ"],"みにかー":["ミニカー"],"みにちゅあ":["ミニチュア"],"みねらる":["ミネラル"],"みねらるうぉーたー":["ミネラルウォーター"],"みもざ":["ミモザ"],"みゃんまー":["ミャンマー"],"みゅんへん":["ミュンヘン"],"みゅーじあむ":["ミュージアム"],"みゅーじかる":["ミュージカル"],"みゅーじしゃん":["ミュージシャン"],"みゅーじっく":["ミュージック"],"みらくる":["ミラクル"],"みらー":["ミラー"],"みり":["ミリ"],"みりおん":["ミリオン"],"みる":["見る","観る","回る","ミル","ミル"],"みるく":["ミルク"],"みんと":["ミント"],"みー":["ミー"],"みーてぃんぐ":["ミーティング"],"みーと":["ミート"],"みーはー":["ミーハー"],"むっく":["ムック"],"むーす":["ムース"],"むーど":["ムード"],"むーびー":["ムービー"],"むーん":["ムーン"],"めあど":["メアド"],"めい":["名","命","明","メイ","姪"],"めいきんぐ":["メイキング"],"めいく":["メイク"],"めいと":["メイト"],"めいど":["メイド"],"めいん":["メイン"],"めいんぺーじ":["メインページ"],"めか":["メカ"],"めかにずむ":["メカニズム"],"めが":["メガ"],"めきしこ":["メキシコ"],"めじゃー":["メジャー"],"めす":["メス","雌"],"めそっど":["メソッド"],"めぞん":["メゾン"],"めた":["メタ"],"めたぼ":["メタボ"],"めたぼりっく":["メタボリック"],"めたぼりっくしんどろーむ":["メタボリックシンドローム"],"めたる":["メタル"],"めだりすと":["メダリスト"],"めだる":["メダル"],"めっしゅ":["メッシュ"],"めっせ":["メッセ"],"めっせーじ":["メッセージ"],"めっと":["メット"],"めでぃあ":["メディア"],"めとろ":["メトロ"],"めどれー":["メドレー"],"めにゅー":["メニュー"],"めも":["メモ"],"めもり":["メモリ"],"めもりある":["メモリアル"],"めもりー":["メモリー"],"めりっと":["メリット"],"めりはり":["メリハリ"],"めりー":["メリー"],"めりーくりすます":["メリークリスマス"],"めるへん":["メルヘン"],"めるまが":["メルマガ"],"めろでぃ":["メロディ"],"めろでぃー":["メロディー"],"めろめろ":["メロメロ"],"めろん":["メロン"],"めんず":["メンズ"],"めんたる":["メンタル"],"めんて":["メンテ"],"めんてなんす":["メンテナンス"],"めんばー":["メンバー"],"めーかー":["メーカー"],"めーたー":["メーター"],"めーぷる":["メープル"],"めーる":["メール"],"めーるあどれす":["メールアドレス"],"めーるまがじん":["メールマガジン"],"もあ":["モア"],"もざいく":["モザイク"],"もだん":["モダン"],"もち":["持ち","持ち","餅","モチ","望"],"もちべーしょん":["モチベーション"],"もちーふ":["モチーフ"],"もっとー":["モットー"],"もてもて":["モテモテ"],"もでる":["モデル"],"もにたー":["モニター"],"もの":["者","物","モノ"],"ものくろ":["モノクロ"],"ものれーる":["モノレール"],"もばいる":["モバイル"],"もぶ":["モブ"],"もらる":["モラル"],"もんきー":["モンキー"],"もんすたー":["モンスター"],"もんぶらん":["モンブラン"],"もーしょん":["モーション"],"もーたー":["モーター"],"もーたーしょー":["モーターショー"],"もーたーすぽーつ":["モータースポーツ"],"もーつぁると":["モーツァルト"],"もーど":["モード"],"もーにんぐ":["モーニング"],"もーる":["モール"],"やぎ":["ヤギ"],"やくざ":["ヤクザ"],"やくると":["ヤクルト"],"やふおく":["ヤフオク"],"やまは":["ヤマハ"],"やんきー":["ヤンキー"],"やんぐ":["ヤング"],"やーど":["ヤード"],"ゆだや":["ユダヤ"],"ゆないてっど":["ユナイテッド"],"ゆにおん":["ユニオン"],"ゆにっと":["ユニット"],"ゆにばーさる":["ユニバーサル"],"ゆにばーす":["ユニバース"],"ゆにふぉーむ":["ユニフォーム"],"ゆにーく":["ユニーク"],"ゆー":["ユー"],"ゆーざ":["ユーザ"],"ゆーざー":["ユーザー"],"ゆーす":["ユース"],"ゆーもあ":["ユーモア"],"ゆーろ":["ユーロ"],"よが":["ヨガ"],"よし":["良し","ヨシ","由"],"よっと":["ヨット"],"よーぐると":["ヨーグルト"],"よーろっぱ":["ヨーロッパ"],"ら":["等","ラ","羅"],"らい":["来","ライ"],"らいおん":["ライオン"],"らいす":["ライス"],"らいせんす":["ライセンス"],"らいたー":["ライター"],"らいだー":["ライダー"],"らいと":["ライト"],"らいとのべる":["ライトノベル"],"らいど":["ライド"],"らいなー":["ライナー"],"らいばる":["ライバル"],"らいふ":["ライフ"],"らいふすたいる":["ライフスタイル"],"らいふわーく":["ライフワーク"],"らいぶ":["ライブ"],"らいぶどあ":["ライブドア"],"らいぶはうす":["ライブハウス"],"らいぶらりー":["ライブラリー"],"らいむ":["ライム"],"らいん":["ライン"],"らいんなっぷ":["ラインナップ"],"らいゔ":["ライヴ"],"らうんじ":["ラウンジ"],"らうんど":["ラウンド"],"らぐ":["ラグ"],"らぐびー":["ラグビー"],"らけっと":["ラケット"],"らじお":["ラジオ"],"らじおたいそう":["ラジオ体操"],"らじおばんぐみ":["ラジオ番組"],"らじこん":["ラジコン"],"らす":["ラス"],"らすと":["ラスト"],"らすとしーん":["ラストシーン"],"らすとすぱーと":["ラストスパート"],"らずべりー":["ラズベリー"],"らっきー":["ラッキー"],"らっく":["ラック"],"らっしゅ":["ラッシュ"],"らっせる":["ラッセル"],"らっと":["ラット"],"らっぴんぐ":["ラッピング"],"らっぷ":["ラップ","乱舞"],"らてん":["ラテン"],"らばー":["ラバー"],"らび":["ラビ"],"らびりんす":["ラビリンス"],"らふ":["ラフ"],"らぶ":["ラブ"],"らぶすとーりー":["ラブストーリー"],"らぶそんぐ":["ラブソング"],"らぶらぶ":["ラブラブ"],"らぶれたー":["ラブレター"],"らべる":["ラベル"],"らべんだー":["ラベンダー"],"らぼ":["ラボ"],"らま":["ラマ","ラマ"],"らむ":["ラム"],"らむね":["ラムネ"],"らりー":["ラリー"],"らん":["ラン","欄","蘭","乱","ＬＡＮ"],"らんきんぐ":["ランキング"],"らんく":["ランク"],"らんくいん":["ランクイン"],"らんだむ":["ランダム"],"らんち":["ランチ"],"らんちたいむ":["ランチタイム"],"らんど":["ランド"],"らんどせる":["ランドセル"],"らんなー":["ランナー"],"らんにんぐ":["ランニング"],"らんぷ":["ランプ"],"らゔ":["ラヴ"],"らーめん":["ラーメン","ラーメン","拉麺"],"りあ":["リア"],"りあくしょん":["リアクション"],"りありてぃ":["リアリティ"],"りある":["リアル"],"りあるたいむ":["リアルタイム"],"りくえすと":["リクエスト"],"りくるーと":["リクルート"],"りさいくる":["リサイクル"],"りさいたる":["リサイタル"],"りさーち":["リサーチ"],"りす":["リス","リス"],"りすく":["リスク"],"りすと":["リスト"],"りすとら":["リストラ"],"りすなー":["リスナー"],"りすにんぐ":["リスニング"],"りずむ":["リズム"],"りせっと":["リセット"],"りぞーと":["リゾート"],"りたいあ":["リタイア"],"りたーん":["リターン"],"りたーんず":["リターンズ"],"りっく":["リック"],"りっち":["リッチ","立地"],"りっとる":["リットル"],"りっぷ":["リップ"],"りとる":["リトル"],"りにゅーある":["リニューアル"],"りねん":["理念","リネン"],"りは":["リハ"],"りはびり":["リハビリ"],"りはーさる":["リハーサル"],"りばうんど":["リバウンド"],"りびんぐ":["リビング"],"りぴーたー":["リピーター"],"りぴーと":["リピート"],"りふぉーむ":["リフォーム"],"りふと":["リフト"],"りふれっしゅ":["リフレッシュ"],"りぶ":["リブ"],"りべんじ":["リベンジ"],"りぼん":["リボン"],"りぽーと":["リポート"],"りま":["リマ"],"りみっと":["リミット"],"りめいく":["リメイク"],"りもこん":["リモコン"],"りゅっく":["リュック"],"りら":["リラ"],"りらくぜーしょん":["リラクゼーション"],"りらっくす":["リラックス"],"りりー":["リリー"],"りりーす":["リリース"],"りれー":["リレー"],"りんく":["リンク"],"りんくふりー":["リンクフリー"],"りんぐ":["リング"],"りんご":["リンゴ","林檎"],"りんぱ":["リンパ"],"りーがー":["リーガー"],"りーぐ":["リーグ"],"りーぐせん":["リーグ戦"],"りーす":["リース"],"りーずなぶる":["リーズナブル"],"りーだ":["リーダ"],"りーだー":["リーダー"],"りーだーしっぷ":["リーダーシップ"],"りーち":["リーチ"],"りーでぃんぐ":["リーディング"],"りーど":["リード"],"りーふ":["リーフ"],"りーまん":["リーマン"],"りーる":["リール"],"るあー":["ルアー"],"るっくす":["ルックス"],"るのー":["ルノー"],"るぱん":["ルパン"],"るびー":["ルビー"],"るぽ":["ルポ"],"るんるん":["ルンルン"],"るー":["ルー"],"るーきー":["ルーキー"],"るーく":["ルーク"],"るーつ":["ルーツ"],"るーと":["ルート"],"るーぷ":["ループ"],"るーむ":["ルーム"],"るーる":["ルール"],"れ":["レ"],"れあ":["レア"],"れい":["例","レイ","鈴","霊","冷","礼","令","零"],"れいあうと":["レイアウト"],"れいぷ":["レイプ"],"れいん":["レイン"],"れいんぼー":["レインボー"],"れぎゅらー":["レギュラー"],"れくちゃー":["レクチャー"],"れげえ":["レゲエ"],"れこーだー":["レコーダー"],"れこーでぃんぐ":["レコーディング"],"れこーど":["レコード"],"れざー":["レザー"],"れしぴ":["レシピ"],"れしーと":["レシート"],"れじ":["レジ"],"れじゃー":["レジャー"],"れす":["レス"],"れすきゅー":["レスキュー"],"れすと":["レスト"],"れすとらん":["レストラン"],"れすらー":["レスラー"],"れすりんぐ":["レスリング"],"れたす":["レタス"],"れたー":["レター"],"れっく":["レック"],"れっくす":["レックス"],"れっすん":["レッスン"],"れっど":["レッド"],"れでぃ":["レディ"],"れでぃー":["レディー"],"れでぃーす":["レディース"],"れとると":["レトルト"],"れとろ":["レトロ"],"ればー":["レバー"],"れぱーとりー":["レパートリー"],"れびゅー":["レビュー"],"れふ":["レフ"],"れふと":["レフト"],"れべる":["レベル"],"れべるあっぷ":["レベルアップ"],"れぽ":["レポ"],"れぽーたー":["レポーター"],"れぽーと":["レポート"],"れもん":["レモン"],"れんじ":["レンジ"],"れんじゃー":["レンジャー"],"れんず":["レンズ"],"れんたかー":["レンタカー"],"れんたる":["レンタル"],"れんとげん":["レントゲン"],"れーさー":["レーサー"],"れーざー":["レーザー"],"れーしんぐ":["レーシング"],"れーす":["レース"],"れーだー":["レーダー"],"れーと":["レート"],"れーべる":["レーベル"],"れーる":["レール"],"れーん":["レーン"],"ろ":["ロ","ロ","露"],"ろいやる":["ロイヤル"],"ろぐ":["ログ"],"ろぐいん":["ログイン"],"ろぐはうす":["ログハウス"],"ろけ":["ロケ"],"ろけっと":["ロケット"],"ろけーしょん":["ロケーション"],"ろけち":["ロケ地"],"ろご":["ロゴ"],"ろさんぜるす":["ロサンゼルス"],"ろしあ":["ロシア"],"ろじっく":["ロジック"],"ろす":["ロス"],"ろすたいむ":["ロスタイム"],"ろすと":["ロスト"],"ろっかー":["ロッカー"],"ろっく":["ロック"],"ろっくんろーる":["ロックンロール"],"ろって":["ロッテ"],"ろっと":["ロット"],"ろっど":["ロッド"],"ろば":["ロバ","ロバ"],"ろびん":["ロビン"],"ろびー":["ロビー"],"ろふと":["ロフト"],"ろぼっと":["ロボット"],"ろまん":["ロマン"],"ろまんす":["ロマンス"],"ろまんちっく":["ロマンチック"],"ろまんてぃっく":["ロマンティック"],"ろり":["ロリ"],"ろんぐ":["ロング"],"ろんどん":["ロンドン"],"ろーかる":["ローカル"],"ろーしょん":["ローション"],"ろーす":["ロース"],"ろーすと":["ロースト"],"ろーず":["ローズ"],"ろーずまりー":["ローズマリー"],"ろーたりー":["ロータリー"],"ろーてーしょん":["ローテーション"],"ろーど":["ロード"],"ろーどしょー":["ロードショー"],"ろーどれーす":["ロードレース"],"ろーぷ":["ロープ"],"ろーま":["ローマ"],"ろーらー":["ローラー"],"ろーりんぐ":["ローリング"],"ろーる":["ロール"],"ろーるけーき":["ロールケーキ"],"ろーん":["ローン"],"わいど":["ワイド"],"わいどしょー":["ワイドショー"],"わいやー":["ワイヤー"],"わいるど":["ワイルド"],"わいん":["ワイン"],"わかめ":["ワカメ"],"わくちん":["ワクチン"],"わごん":["ワゴン"],"わしんとん":["ワシントン"],"わっくす":["ワックス"],"わっふる":["ワッフル"],"わに":["ワニ"],"わるつ":["ワルツ"],"わん":["ワン","湾","ＷＡＮ"],"わんせぐ":["ワンセグ"],"わんだふる":["ワンダフル"],"わんだー":["ワンダー"],"わんだーらんど":["ワンダーランド"],"わんぴーす":["ワンピース"],"わんぽいんと":["ワンポイント"],"わんまん":["ワンマン"],"わんわん":["ワンワン"],"わーかー":["ワーカー"],"わーきんぐ":["ワーキング"],"わーく":["ワーク"],"わーくしょっぷ":["ワークショップ"],"わーくす":["ワークス"],"わーど":["ワード"],"わーるど":["ワールド"],"わーるどかっぷ":["ワールドカップ"],"をた":["ヲタ"],"をたく":["ヲタク"],"ゔぁいおりん":["ヴァイオリン"],"ゔぉーかる":["ヴォーカル"],"ちょうおん":["ー"],"いち":["一","市","位置","壱"],"ひと":["人","一"],"ひとつ":["一","一つ","１つ"],"いちから":["一から"],"ひとつは":["一つは"],"ひとつひとつ":["一つ一つ"],"いっかげつ":["一ヶ月"],"いちまん":["一万"],"いちにん":["一人","１人"],"ひとり":["一人","１人","独り"],"ひとりで":["一人で"],"ひとりとして":["一人として"],"ひとりひとり":["一人一人","一人ひとり"],"ひとりびとり":["一人一人"],"いちにんまえ":["一人前"],"ひとりまえ":["一人前"],"ひとりたび":["一人旅"],"ひとりぐらし":["一人暮らし"],"いちだい":["一台","一代","一大"],"いっけん":["一見","一件","一軒"],"ひとやすみ":["一休み"],"いちい":["一位"],"いったい":["一体","一帯"],"いったいかん":["一体感"],"いっこ":["一個"],"いちこじん":["一個人"],"いっこじん":["一個人"],"いちおく":["一億"],"いっさつ":["一冊"],"いちぶ":["一部","一分"],"いちぶん":["一分","一文"],"いっぷん":["一分"],"いっさい":["一切"],"いっこく":["一刻","一石"],"いっぴき":["一匹"],"ひとくち":["一口"],"いっく":["一句"],"いちどう":["一同"],"いっしゅう":["一周"],"ひとめぐり":["一周"],"いっしゅうねん":["一周年"],"いちみ":["一味"],"ひとあじ":["一味"],"いっぴん":["一品","逸品"],"ひとしな":["一品"],"いちいん":["一員"],"いっきいちゆう":["一喜一憂"],"いっかい":["一回","一階"],"ひとまわり":["一回り"],"いっぽう":["一方","一報"],"いっせい":["一斉","一声"],"ひとこえ":["一声"],"いっぺん":["一変"],"いちや":["一夜"],"ひとや":["一夜"],"ひとよ":["一夜"],"ひとあんしん":["一安心"],"いちじょう":["一定"],"いってい":["一定"],"いっか":["一家","一過"],"いっけ":["一家"],"いっすん":["一寸"],"ちょっと":["一寸"],"ちょと":["一寸"],"いっそ":["一層"],"いっそう":["一層","一掃"],"いちねん":["一年","一念"],"ひととし":["一年"],"ひととせ":["一年"],"いちねんじゅう":["一年中"],"いちねんまえ":["一年前"],"いちねんせい":["一年生"],"いちねんかん":["一年間"],"いちど":["一度"],"ひとたび":["一度"],"いちどだけ":["一度だけ"],"いちどに":["一度に"],"いちども":["一度も"],"いっしき":["一色","一式"],"いっしん":["一心","一新"],"いちおう":["一応"],"ひといき":["一息"],"いっせん":["一戦","一線"],"いっこだて":["一戸建て"],"いちおし":["一押し"],"ひとおし":["一押し"],"いっかつ":["一括"],"いっきょ":["一挙"],"いちげき":["一撃"],"いちもん":["一文"],"いちもんじ":["一文字"],"ひともじ":["一文字"],"いっせいに":["一斉に"],"ひとかた":["一方"],"いっぽうてき":["一方的"],"いちぞく":["一族"],"いちじつ":["１日","一日"],"いちにち":["１日","一日"],"いっぴ":["一日"],"ついたち":["一日"],"つきたち":["一日"],"ひとえ":["１日","一日","単"],"ひとひ":["１日","一日"],"いちにちじゅう":["一日中"],"いったん":["一旦","一段","一端"],"ひとむかし":["一昔"],"ひとむかしまえ":["一昔前"],"いっさくねん":["一昨年"],"おととし":["一昨年"],"いっさくじつ":["一昨日"],"おとつい":["一昨日"],"おととい":["一昨日"],"いちじ":["一時","一次"],"いっとき":["一時"],"いちじき":["一時期"],"いちじてき":["一時的"],"いちじかん":["一時間"],"ひとばん":["一晩"],"いっきょく":["一曲"],"いちがつ":["１月","一月"],"いちげつ":["一月"],"いっぷく":["一服"],"いちぼう":["一望"],"いちご":["一期","苺"],"いっき":["一気","一期"],"いちごいちえ":["一期一会"],"いっぽん":["一本"],"いっぱい":["一杯"],"いちまい":["一枚","１枚"],"ひとひら":["一枚"],"いっぽ":["一歩"],"いっぽいっぽ":["一歩一歩"],"いちだん":["一段"],"いちだんと":["一段と"],"いちだんらく":["一段落"],"ひとだんらく":["一段落"],"いっきに":["一気に"],"いっぱく":["一泊"],"いちりゅう":["一流"],"いってん":["一転","一点"],"いっかん":["一環","一貫"],"いっしょう":["一生"],"いっしょうけんめい":["一生懸命"],"いちばん":["一番"],"ひとつがい":["一番"],"いちばんした":["一番下"],"いちばんのり":["一番乗り"],"いっぱつ":["一発","一髪"],"いちもく":["一目"],"ひとめ":["人目","一目"],"ひとめぼれ":["一目惚れ"],"いっちょくせん":["一直線"],"いちがん":["一眼"],"いちがんれふ":["一眼レフ"],"いっしゅん":["一瞬"],"いっせき":["一石"],"いっせきにちょう":["一石二鳥"],"いっぴょう":["一票"],"いっしゅ":["一種","一首"],"ひとくさ":["一種"],"いっぱし":["一端"],"ひとすじ":["一筋"],"ひとつぶ":["一粒"],"いっきゅう":["一級"],"いっしょ":["一緒"],"いっしょに":["一緒に"],"いっち":["一致"],"いっぱん":["一般"],"いっぱんに":["一般に"],"いっぱんじん":["一般人"],"いっぱんこうかい":["一般公開"],"いっぱんてき":["一般的"],"いっしょく":["一色"],"ひといろ":["一色"],"ひとくろう":["一苦労"],"いちぎょう":["一行"],"いっこう":["一行"],"いちげん":["一言","一見"],"いちらん":["一覧"],"いっかく":["一角"],"いっかど":["一角"],"ひとかど":["一角"],"いちごん":["一言"],"いちげんこじ":["一言居士"],"いちごんこじ":["一言居士"],"いちどく":["一読"],"いっかんして":["一貫して"],"いっそく":["一足"],"ひとあし":["一足"],"ひとあしさき":["一足先"],"いちろ":["一路"],"いちりん":["一輪"],"いちず":["一途"],"いっと":["一途"],"ひととおり":["一通り"],"いちれん":["一連"],"いっしゅうかん":["一週間"],"いちめん":["一面"],"ちょう":["朝","町","超","長","帳","蝶","調","庁","兆","腸","張","丁"],"ひのと":["丁"],"ていねい":["丁寧"],"ちょうど":["丁度"],"ちょうどいい":["丁度いい","丁度良い"],"ちょうどいかった":["丁度いかった","丁度良かった"],"ちょうどいくない":["丁度いくない","丁度良くない"],"ちょうどいくて":["丁度いくて","丁度良くて"],"ちょうどよい":["丁度良い"],"ちょうどよかった":["丁度良かった"],"ちょうどよくない":["丁度良くない"],"ちょうどよくて":["丁度良くて"],"ちょうめ":["丁目"],"しち":["七"],"なな":["七"],"しちごさん":["七五三"],"しちせき":["七夕"],"たなばた":["七夕"],"しちがつ":["７月","七月"],"しちしょく":["七色"],"なないろ":["七色"],"よろず":["万","萬"],"まんがいち":["万が一"],"まんがいつ":["万が一"],"ばんじょう":["万丈"],"ばんじん":["万人"],"ばんにん":["万人"],"まんにん":["万人"],"ばんぜん":["万全"],"まんえん":["万円","蔓延"],"ばんぱく":["万博"],"まんねん":["万年"],"ばんざい":["万歳"],"ばんぜい":["万歳"],"まんざい":["万歳","漫才"],"ばんたん":["万端"],"ばんのう":["万能"],"まんのう":["万能"],"ばんかきょう":["万華鏡"],"まんげきょう":["万華鏡"],"ばんしょう":["万象"],"ばんり":["万里"],"はおんりのちょうじょう":["万里の長城"],"ばんりのちょうじょう":["万里の長城"],"じょう":["上","娘","城","嬢","状","条","丈","帖","畳","情","乗","鎖","杖","錠"],"たけ":["竹","岳","丈","菌","茸"],"だけ":["丈"],"じょうふ":["丈夫"],"じょうぶ":["丈夫","上部"],"ますらお":["丈夫"],"みっつ":["３つ","三つ"],"さんせい":["賛成","三世"],"さんぜ":["三世"],"みついすみとも":["三井住友"],"さんにん":["三人"],"みたり":["三人"],"さんい":["三位"],"さんみ":["酸味","三位"],"さんぶん":["三分"],"さんぷん":["三分"],"さんじゅう":["三重","三十"],"みそ":["味噌","三十"],"みそじ":["三十路"],"さみせん":["三味線"],"しゃみせん":["三味線"],"さんかい":["三回"],"さんごく":["三国"],"さんごくし":["三国志"],"さんだい":["三大"],"さんぐう":["三宮"],"さんねん":["三年"],"さんしん":["三振"],"さんぼう":["三方"],"さんぽう":["三方"],"みっか":["３日","三日"],"みっかぼうず":["三日坊主"],"みかずき":["三日月"],"みかづき":["三日月"],"みっかかん":["三日間"],"さんまい":["三昧","３枚"],"さんがつ":["３月","三月"],"みつき":["三月"],"さんぼん":["三本"],"さんじ":["三次","惨事"],"みけ":["三毛"],"みけねこ":["三毛猫"],"さんなん":["三男"],"さんしゃ":["三者"],"さんきゃく":["三脚"],"みつびし":["三菱"],"さんかく":["三角","参画"],"みつこし":["三越"],"さんれん":["三連"],"さんぶさく":["三部作"],"みえけん":["三重県"],"うえ":["上","植え"],"じょうじょう":["上々","上場"],"あがり":["上がり","上がり"],"あがる":["上がる","上る"],"あがった":["上がった"],"あがらない":["上がらない"],"あがって":["上がって"],"あがれる":["上がれる"],"あがられる":["上がられる"],"あげ":["上げ","揚げ","上げ","挙げ"],"あげる":["上げる","挙げる"],"あげた":["上げた","挙げた","挙げた"],"あげない":["上げない","挙げない"],"あげて":["上げて","挙げて","挙げて"],"あげれる":["上げれる","挙げれる"],"あげられる":["上げられる","挙げられる"],"うえで":["上で"],"うえでは":["上では"],"うえは":["上は"],"のぼり":["登り","上り","登り","上り","昇り"],"のぼる":["登る","上る","昇る"],"のぼった":["登った","上った","昇った"],"のぼらない":["登らない","上らない","昇らない"],"のぼって":["登って","上って","昇って"],"のぼれる":["登れる","上れる","昇れる"],"のぼられる":["登られる","上られる","昇られる"],"うえした":["上下"],"かみしも":["上下"],"しょうか":["消化","上下"],"じょうげ":["上下"],"じょうきょう":["状況","上京"],"じょうい":["上位"],"じょうでき":["上出来"],"かみはんき":["上半期"],"じょうはんしん":["上半身"],"じょうし":["上司"],"じょうひん":["上品"],"じょうぼん":["上品"],"うわまわる":["上回る"],"うわまわった":["上回った"],"うわまわらない":["上回らない"],"うわまわり":["上回り"],"うわまわって":["上回って"],"うわまわれる":["上回れる"],"うわまわられる":["上回られる"],"じょうご":["上戸"],"うわて":["上手"],"かみて":["上手"],"じょうしゅ":["上手"],"じょうず":["上手"],"じょうて":["上手"],"うまい":["甘い","美味い","上手い","旨い"],"うまかった":["甘かった","美味かった","上手かった","旨かった"],"うまくない":["甘くない","美味くない","上手くない","旨くない"],"うまくて":["甘くて","美味くて","上手くて","旨くて"],"かみがた":["髪型","上方"],"じょうほう":["情報","上方"],"じょうじゅん":["上旬"],"じょうしょう":["上昇"],"じょうえい":["上映"],"じょうえいじかん":["上映時間"],"じょうりゅう":["上流"],"しゃんはい":["上海"],"じょうえん":["上演"],"じょうでん":["上田"],"うわぎ":["上着"],"じょうくう":["上空"],"じょうとう":["上等"],"じょうきゅう":["上級"],"じょうき":["上記","蒸気"],"じょうしつ":["上質"],"じょうえつ":["上越"],"じょうたつ":["上達"],"うえの":["上野"],"じょうげん":["上限"],"じょうりく":["上陸"],"した":["下","舌"],"しも":["下","霜"],"もと":["本","元","元","下","旧","素","故","基"],"さがり":["下がり","下がり"],"さがる":["下がる","下る"],"さがった":["下がった"],"さがらない":["下がらない"],"さがって":["下がって"],"さがれる":["下がれる"],"さがられる":["下がられる"],"さげる":["下げる"],"さげた":["下げた"],"さげない":["下げない"],"さげ":["下げ"],"さげて":["下げて"],"さげれる":["下げれる"],"さげられる":["下げられる"],"ください":["下さい","下さい"],"くださる":["下さる"],"くださった":["下さった"],"くださらない":["下さらない"],"くださって":["下さって"],"くださり得る":["下さり得る"],"くだって":["降って","降って","下って","下って"],"しもに":["下に"],"したのこ":["下の子"],"くだり":["件","降り","条","下り","下り"],"おりる":["降りる","下りる"],"おりた":["降りた","下りた"],"おりない":["降りない","下りない"],"おり":["居り","折","降り","折り","織","檻","下り"],"おりて":["降りて","下りて"],"おりれる":["降りれる","下りれる"],"おりられる":["降りられる","下りられる"],"くだりざか":["下り坂"],"くだる":["降る","下る"],"くだった":["降った","下った"],"くだらない":["降らない","下らない"],"くだれる":["降れる","下れる"],"くだられる":["降られる","下られる"],"しもねた":["下ネタ"],"かはんしん":["下半身"],"しもはんしん":["下半身"],"かひん":["下品"],"げひん":["下品"],"したじ":["下地"],"げさん":["下山"],"げざん":["下山"],"したて":["下手","仕立て"],"したで":["下手"],"しもて":["下手"],"へた":["下手"],"げじゅん":["下旬"],"したがき":["下書き"],"げこう":["下校"],"かりゅう":["下流"],"げでん":["下田"],"したまち":["下町"],"げり":["下痢"],"したぎ":["下着"],"げらく":["下落"],"したみ":["下見"],"げしゃ":["下車"],"しもべ":["僕","下部"],"かこう":["加工","河口","下降"],"げた":["下駄"],"ふ":["二","府","不","歩","布","負","譜","腑"],"ふびん":["不便"],"ふべん":["不便"],"ふしん":["不審","不信","不振"],"ふしんかん":["不信感"],"ふりん":["不倫"],"ふけんこう":["不健康"],"ふぜん":["不全"],"ふぐあい":["不具合"],"ふり":["風","振り","降り","降り","振り","不利"],"ふろう":["不労"],"ふろうしょとく":["不労所得"],"ふどう":["不動"],"ふどうさん":["不動産"],"ふどうさんや":["不動産屋"],"ふじゅうぶん":["不十分"],"ふさんか":["不参加"],"ふか":["不可","負荷","付加"],"ふかけつ":["不可欠"],"ふかのう":["不可能"],"ふかかい":["不可解"],"ふむき":["不向き"],"ぶきよう":["不器用"],"ふざい":["不在"],"ふにん":["赴任","不妊"],"ふあん":["不安"],"ふあんてい":["不安定"],"ふていき":["不定期"],"ふこう":["不幸"],"ふとう":["不当"],"ふかい":["深い","不快"],"ふかいかん":["不快感"],"ふしぎ":["不思議"],"ふしぎに":["不思議に"],"ふゆかい":["不愉快"],"ふい":["不意"],"ふめい":["不明"],"ふじょうり":["不条理"],"ふきげん":["不機嫌"],"ふせい":["不正"],"ふしちょう":["不死鳥"],"ぶきみ":["不気味"],"ふきょう":["不況"],"ふほう":["訃報","不法"],"ふまん":["不満"],"ふはつ":["不発"],"ふとうこう":["不登校"],"ふみん":["不眠"],"ふしょうじ":["不祥事"],"ふのう":["不能"],"ふしぜん":["不自然"],"ふじゆう":["不自由"],"ふりょう":["不良"],"ふよう":["不要","芙蓉"],"ふかく":["不覚"],"ふひょう":["不評"],"ふちょう":["不調"],"ふきんしん":["不謹慎"],"ふそく":["不足"],"ふとうめい":["不透明"],"ふうん":["不運"],"ふてきせつ":["不適切"],"ふつごう":["不都合"],"あたえ":["費","与え","直","与え"],"あたえる":["与える"],"あたえた":["与えた"],"あたえない":["与えない"],"あたえて":["与えて"],"あたえれる":["与えれる"],"あたえられる":["与えられる"],"よとう":["与党"],"うしのひ":["丑の日"],"せい":["性","生","星","西","世","制","製","背","正","聖","勢","井","精"],"よにも":["世にも"],"よのなか":["世の中"],"せだい":["世代"],"せたい":["世帯"],"せかい":["世界"],"せかいいち":["世界一"],"せかいいっしゅう":["世界一周"],"せかいじゅう":["世界中"],"せかいはつ":["世界初"],"せかいし":["世界史"],"せかいかっこく":["世界各国"],"せかいたいせん":["世界大戦"],"せかいへいわ":["世界平和"],"せかいさいだい":["世界最大"],"せかいてき":["世界的"],"せかいかん":["世界観"],"せかいせんしゅけん":["世界選手権"],"せかいいさん":["世界遺産"],"せそう":["世相"],"せいき":["世紀","正規"],"せわ":["世話"],"せろん":["世論"],"よろん":["世論"],"せろんちょうさ":["世論調査"],"よろんちょうさ":["世論調査"],"せじ":["世辞"],"せけん":["世間"],"せけんばなし":["世間話"],"おか":["丘","陸","岡"],"つかさ":["長","首","丘","官","司","寮"],"きゅうりょう":["給料","丘陵"],"りょう":["量","良","龍","両","料","竜","漁","寮","了","令","梁","領"],"りょうがわ":["両側"],"りょうそく":["両側","両足"],"りょうこく":["両国"],"りょうごく":["両国"],"りょうて":["両手"],"りょうほう":["両方","療法"],"りょうほうとも":["両方とも"],"りょうりつ":["両立"],"りょうしゃ":["両者"],"ふたおや":["両親"],"りょうしん":["両親","良心"],"りょうろん":["両論"],"もろあし":["両足"],"りょうあし":["両足"],"りょうめん":["両面"],"なみ":["波","並み","並","浪"],"ならび":["並び","並び"],"ならびに":["並びに"],"ならぶ":["並ぶ"],"ならんだ":["並んだ"],"ならばない":["並ばない"],"ならんで":["並んで"],"ならめる":["並める"],"ならばれる":["並ばれる"],"ならべる":["並べる"],"ならべた":["並べた"],"ならべない":["並べない"],"ならべ":["並べ"],"ならべて":["並べて"],"ならべれる":["並べれる"],"ならべられる":["並べられる"],"なみき":["並木"],"へいこう":["平行","並行"],"うち":["内","中","家","打ち"],"じゅう":["中","十","重","獣","住","銃","砲"],"なか":["中","仲"],"なかなか":["中々"],"なかでも":["中でも"],"なかには":["中には"],"ちゅうせい":["中世","中性"],"ちゅうきょう":["中京"],"ちゅうしょう":["中小","中傷"],"ちゅうげん":["仲間","中元","中原"],"ちゅうこ":["中古"],"ちゅうぶる":["中古"],"ちゅうこしゃ":["中古車"],"ちゅうごく":["中国"],"ちゅうごくじん":["中国人"],"ちゅうごくちゃ":["中国茶"],"ちゅうごくご":["中国語"],"ちゅうがた":["中型"],"ちゅうけん":["中堅"],"ちゅうおう":["中央"],"ちゅうおうけいば":["中央競馬"],"ちゅうおうせん":["中央線"],"ちゅうがく":["中学"],"ちゅうがっこう":["中学校"],"ちゅうがくせい":["中学生"],"ちゅうしょうきぎょう":["中小企業"],"ちゅうねん":["中年"],"なかにわ":["中庭"],"ちゅうしん":["中心"],"なかご":["中心"],"ちゅうしんとする":["中心とする"],"ちゅうしんてき":["中心的"],"ちゅうしんぶ":["中心部"],"ちゅうせいしぼう":["中性脂肪"],"ちゅうだん":["中断"],"ちゅうにち":["中日"],"なかび":["中日"],"ちゅうじゅん":["中旬"],"ちゅうき":["中期"],"ちゅうとう":["中東"],"ちゅうかく":["中核"],"ちゅうし":["中止"],"ちゅうどく":["中毒"],"ちゅうりゃく":["中略"],"ちゅうばん":["中盤"],"ちゅうしゅう":["中秋"],"ちゅうじゅう":["中秋"],"ちゅうしゅうのめいげつ":["中秋の名月"],"ちゅうりつ":["中立"],"ちゅうきゅう":["中級"],"ちゅうけい":["中継"],"なかつぎ":["中継ぎ"],"ちゅうか":["中華"],"ちゅうかりょうり":["中華料理"],"ちゅうかがい":["中華街"],"ちゅうごし":["中越"],"なかみ":["中身"],"ちゅうとはんぱ":["中途半端"],"ちゅうぶ":["中部"],"ちゅうかん":["昼間","中間"],"ちゅうこう":["中高"],"なかだか":["中高"],"ちゅうこうねん":["中高年"],"ちゅうこうせい":["中高生"],"ちゅういち":["中１"],"ちゅうに":["中２"],"くし":["駆使","串"],"まるまる":["丸々"],"まるい":["丸い"],"まるかった":["丸かった"],"まるくない":["丸くない"],"まるくて":["丸くて"],"まろい":["丸い"],"まるごと":["丸ごと"],"まるだし":["丸出し"],"まるみえ":["丸見え"],"あるじ":["主","主人"],"おも":["主","面","重"],"しゅ":["主","種","首","朱","衆"],"ぬし":["主"],"おもな":["主な"],"おもに":["主に"],"しゅじん":["主人"],"しゅじんこう":["主人公"],"しゅにん":["主任"],"しゅたい":["主体"],"しゅさい":["主催","主宰"],"しゅさいしゃ":["主催者"],"しゅりょく":["主力"],"しゅふ":["主婦"],"しゅどう":["主導","手動"],"しゅせき":["主席"],"しゅちょう":["主張","首長"],"しゅやく":["主役"],"しゅけん":["主権"],"しゅじい":["主治医"],"しゅりゅう":["主流"],"しゅえん":["主演"],"しゅぎ":["主義"],"しゅぎしゃ":["主義者"],"しゅよう":["主要","腫瘍"],"しゅかん":["主観"],"しゅだい":["主題"],"しゅだいか":["主題歌"],"しゅしょく":["主食"],"どんぶり":["丼"],"ひさびさ":["久々"],"ひさしく":["久しく"],"ひさしぶり":["久しぶり","久し振り"],"ひさしぶりに":["久しぶりに"],"とぼしい":["乏しい"],"とぼしかった":["乏しかった"],"とぼしくない":["乏しくない"],"とぼしくて":["乏しくて"],"ともしい":["乏しい"],"ともしかった":["乏しかった"],"ともしくない":["乏しくない"],"ともしくて":["乏しくて"],"のせる":["載せる","乗せる"],"のせた":["載せた","乗せた"],"のせない":["載せない","乗せない"],"のせ":["載せ","乗せ"],"のせて":["載せて","乗せて"],"のせれる":["載せれる","乗せれる"],"のせられる":["載せられる","乗せられる"],"のり":["乗り","乗り","海苔","載り"],"のりきる":["乗り切る"],"のりきった":["乗り切った"],"のりきらない":["乗り切らない"],"のりきり":["乗り切り"],"のりきって":["乗り切って"],"のりきれる":["乗り切れる"],"のりきられる":["乗り切られる"],"のりば":["乗り場"],"のりかえ":["乗り換え"],"のりもの":["乗り物"],"のりつぎ":["乗り継ぎ"],"のりこえる":["乗り越える"],"のりこえた":["乗り越えた"],"のりこえない":["乗り越えない"],"のりこえ":["乗り越え"],"のりこえて":["乗り越えて"],"のりこえれる":["乗り越えれる"],"のりこえられる":["乗り越えられる"],"のりこむ":["乗り込む"],"のりこんだ":["乗り込んだ"],"のりこまない":["乗り込まない"],"のりこみ":["乗り込み"],"のりこんで":["乗り込んで"],"のりこまれる":["乗り込まれる"],"のる":["乗る","載る"],"のった":["乗った","載った"],"のらない":["乗らない","載らない"],"のって":["乗って","載って"],"のれる":["乗れる","載れる"],"のられる":["乗られる","載られる"],"じょうかく":["乗客"],"じょうきゃく":["乗客"],"じょうようしゃ":["乗用車"],"じょうしゃ":["乗車"],"じょうば":["乗馬"],"おつ":["乙"],"きのと":["乙"],"おとめ":["少女","乙女"],"きゅう":["旧","急","級","球","宮","九"],"く":["口","区","九","苦","句","垢"],"ここ":["九","個々","此処"],"ここの":["九"],"この":["九"],"きゅうしゅう":["九州","吸収"],"くがつ":["９月","九月"],"こう":["口","高","行","更","港","香","喉","校","公","江","長官","功","甲","項","溝","乞う","候","抗","孝","稿"],"こうた":["乞うた"],"こわない":["乞わない"],"こうて":["乞うて"],"こえる":["超える","越える","乞える"],"こわれる":["壊れる","乞われる"],"みだれ":["乱れ"],"らんにゅう":["乱入"],"らんぼう":["乱暴"],"らんぶ":["乱舞"],"らんとう":["乱闘"],"ちち":["父","乳"],"ちくび":["乳首"],"ちちくび":["乳首"],"かわく":["乾く"],"かわいた":["乾いた"],"かわかない":["乾かない"],"かわき":["乾き"],"かわいて":["乾いて"],"かわける":["乾ける"],"かわかれる":["乾かれる"],"かんぱい":["乾杯","完敗"],"かんそう":["感想","乾燥","完走"],"かんそうき":["乾燥機"],"かめ":["亀","瓶"],"りょうしょう":["了承"],"りょうかい":["了解"],"あらかじめ":["予め"],"よび":["呼び","予備"],"よびこう":["予備校"],"よびぐん":["予備軍"],"よこく":["予告"],"よこくへん":["予告編"],"よほう":["予報"],"よてい":["予定"],"よていび":["予定日"],"よていひょう":["予定表"],"よていどおり":["予定通り"],"よそう":["予想"],"よそういじょう":["予想以上"],"よそうがい":["予想外"],"よそうどおり":["予想通り"],"よかん":["予感"],"よき":["良き","予期"],"よそく":["予測"],"よち":["余地","予知"],"よさん":["予算"],"よやく":["予約"],"よやくせい":["予約制"],"よしゅう":["予習"],"かねごと":["予言"],"よげん":["予言"],"よせん":["予選"],"よぼう":["予防"],"よぼうせっしゅ":["予防接種"],"あらそい":["争い","争い"],"あらがう":["争う"],"あらがった":["争った"],"あらがわない":["争わない"],"あらがい":["争い"],"あらがって":["争って"],"あらがえる":["争える"],"あらがわれる":["争われる"],"あらそう":["争う"],"あらそった":["争った"],"あらそわない":["争わない"],"あらそって":["争って"],"あらそえる":["争える"],"あらそわれる":["争われる"],"そうだつ":["争奪"],"そうだつせん":["争奪戦"],"こと":["事","異","琴","古都"],"じ":["次","時","事","寺","字","児","自","路"],"ことになる":["事になる"],"じけん":["事件"],"じれい":["事例"],"ことてん":["事典"],"じてん":["時点","辞典","事典"],"じぜん":["事前"],"じむきょく":["事務局"],"じむきょくちょう":["事務局長"],"じむしょ":["事務所"],"じじつ":["事実"],"じじつじょう":["事実上"],"じご":["事後"],"じじょう":["事情"],"じたい":["自体","事態","辞退"],"じこ":["自己","事故"],"じこまい":["事故米"],"ことがら":["事柄"],"じぎょう":["事業","地形"],"じぎょうしょ":["事業所"],"じぎょうしゃ":["事業者"],"じぎょうぶ":["事業部"],"じしょう":["自称","事象"],"じこう":["事項","時効"],"ふう":["二","風","封"],"ふた":["二","蓋","双"],"ふたつ":["２つ","二つ"],"ふたつめ":["二つ目"],"にのうで":["二の腕"],"ににん":["二人"],"ふたり":["二人"],"ふたりとも":["二人とも","２人とも"],"ふたりめ":["二人目"],"にじゅう":["二重","二十"],"はた":["側","機","杯","畑","端","旗","傍","二十"],"はたち":["２０歳","二十","二十歳"],"はたとせ":["二十歳"],"にかい":["二回","二階"],"ふたご":["双子","二子"],"にぐう":["二宮"],"にど":["二度"],"にどと":["二度と","２度と"],"にどめ":["二度目"],"ふつか":["２日","二日"],"ふつかよい":["二日酔い"],"ふつかかん":["二日間"],"にがつ":["２月","二月"],"ふたつき":["二月"],"にほん":["日本","二本"],"にまい":["２枚","二枚"],"にじ":["虹","二次"],"にじかい":["二次会"],"にじげん":["二次元"],"にばん":["二番"],"にりん":["二輪"],"にしゅうかん":["二週間"],"にぶ":["二部"],"にさんかたんそ":["二酸化炭素"],"ふたえ":["二重"],"うんぬん":["云々"],"いう":["言う","云う"],"いわない":["言わない","云わない"],"いえる":["言える","云える"],"いわれる":["言われる","云われる"],"ゆう":["言う","有","優","夕","云う","勇"],"ゆった":["行った","言った","云った","逝った"],"ゆわない":["言わない","云わない"],"ゆい":["言い","云い"],"ゆって":["行って","言って","云って","逝って"],"ゆえる":["言える","云える"],"ゆわれる":["言われる","云われる"],"たがい":["違い","互い"],"たがいに":["互いに"],"いつ":["五","何時"],"ご":["後","御","語","五"],"いつつ":["５つ","五つ"],"ごふん":["五分"],"ごぶ":["五分"],"ごぶん":["五分"],"いそ":["磯","五十"],"ごじゅう":["五十"],"ごかん":["五感"],"ごがつ":["５月","五月"],"さつき":["五月"],"ごりん":["五輪"],"いどばた":["井戸端"],"いどばたかいぎ":["井戸端会議"],"ささい":["些細"],"なき":["泣き","泣き","鳴き","無き","亡き"],"なくなる":["無くなる","亡くなる"],"なくなった":["無くなった","亡くなった"],"なくならない":["無くならない","亡くならない"],"なくなり":["無くなり","亡くなり"],"なくなって":["無くなって","亡くなって"],"なくなれる":["無くなれる","亡くなれる"],"なくなられる":["無くなられる","亡くなられる"],"こもごも":["更","相","交"],"こうご":["交互"],"こうふ":["工夫","交付"],"こうたい":["交代","後退"],"こうたいで":["交代で"],"こうさ":["黄砂","交差"],"こうさてん":["交差点"],"こうかん":["交換","好感"],"こうりゅう":["交流"],"こうりゅうかい":["交流会"],"こうしょう":["交渉"],"こうつう":["交通"],"こうつうじこ":["交通事故"],"こうつうあんぜん":["交通安全"],"こうつうきかん":["交通機関"],"こうつうひ":["交通費"],"こうさい":["交際","高裁"],"こうきょうきょく":["交響曲"],"こうきょうがく":["交響楽"],"こうきょうがくだん":["交響楽団"],"きょう":["今日","京","共","橋","強","香","経","狂","郷","興","協","凶"],"けい":["頃","系","形","兄","京","計","軽","桂","刑"],"みやこ":["都","京"],"きょうせら":["京セラ"],"けいせい":["形成","京成"],"けいひん":["景品","京浜"],"きょうと":["京都"],"きょうとし":["京都市"],"きょうとふ":["京都府"],"けいはん":["京阪"],"ていしゅ":["亭主"],"にん":["人","仁","忍"],"り":["人","里","理","利","離"],"にんにん":["人々"],"ひとびと":["人々"],"ひとごみ":["人ごみ"],"ひとたち":["人たち","人達"],"ひとだかり":["人だかり"],"ひとのこ":["人の子"],"ひといちばい":["人一倍"],"ひとなみ":["人並み"],"じんちゅう":["人中"],"ひとなか":["人中"],"じんじ":["人事"],"ひとごと":["人事","他人事"],"じんけんひ":["人件費"],"じんたい":["人体"],"じんてい":["人体"],"にんてい":["認定","人体"],"ひとで":["人出"],"にんまえ":["人前"],"ひとまえ":["人前"],"ひとまえで":["人前で"],"にんじん":["人参"],"じんこう":["人口","人工"],"じんめい":["人命"],"じんいん":["人員"],"ひとづま":["人妻"],"ひとさし":["人差し"],"ひとさしゆび":["人差し指"],"にんぎょう":["人形"],"にんじょう":["人情"],"にんずう":["人数"],"ひとかず":["人数"],"じんさい":["人材"],"じんざい":["人材"],"ひとがら":["人柄"],"じんかく":["人格"],"ひとさま":["人様"],"じんけん":["人権"],"おおみたから":["人民","百姓"],"じんみん":["人民"],"じんき":["人気"],"にんき":["人気","任期"],"ひとけ":["人気"],"にんきもの":["人気者"],"じんぶつ":["人物"],"じんせい":["人生"],"じんてき":["人的"],"じんもく":["人目"],"じんしゅ":["人種"],"にんぐみ":["人組"],"じんみゃく":["人脈"],"ひとみしり":["人見知り"],"じんしん":["人身"],"ひとみ":["瞳","人身"],"じんかん":["人間"],"にんげん":["人間"],"にんげんせい":["人間性"],"にんげんてき":["人間的"],"にんげんかんけい":["人間関係"],"じんるい":["人類"],"じんぎ":["仁義"],"いま":["今","居間"],"こん":["今","魂","喉","紺"],"いまこそ":["今こそ"],"いまごろ":["今頃","今ごろ"],"いまさら":["今更","今さら"],"いますぐ":["今すぐ"],"いまでは":["今では"],"いまでも":["今でも"],"いまに":["今に"],"いまにも":["今にも"],"いまのところ":["今のところ","今の所"],"いまひとつ":["今ひとつ","今一"],"いままで":["今まで"],"いまや":["今や"],"こんかい":["今回"],"こんか":["今夏"],"こんや":["今夜"],"こんき":["今季","今期","根気"],"こよい":["今宵"],"ことし":["今年"],"こんねん":["今年"],"こんねんど":["今年度"],"こんど":["今度"],"こんご":["今後"],"こんごとも":["今後とも"],"いまおもうと":["今思うと"],"こんじつ":["今日"],"こんち":["今日"],"こんにち":["今日"],"こんちは":["今日は"],"こんにちは":["今日は"],"きょうまで":["今日まで"],"こんにちまで":["今日まで"],"きょうあす":["今日明日"],"こんじゃく":["今昔"],"こんせき":["今昔"],"いまどき":["今時"],"こんばん":["今晩"],"こんばんは":["今晩は"],"こんげつ":["今月"],"こんげつまつ":["今月末"],"けさ":["今朝"],"こんちょう":["今朝"],"こんしゅう":["今週","今秋"],"こんしゅうまつ":["今週末"],"かいにゅう":["介入"],"かいじょ":["解除","介助"],"かいご":["介護"],"かいごほけん":["介護保険"],"ふつ":["仏"],"ぶつ":["物","仏","打つ"],"ほとけ":["仏"],"ぶつぞう":["仏像"],"ぶつだん":["仏壇"],"ぶっきょう":["仏教"],"ほとけさま":["仏様"],"ぶっかく":["仏閣"],"こいぬ":["子犬","仔犬"],"こねこ":["子猫","仔猫"],"しあがり":["仕上がり"],"しあげ":["仕上げ","仕上げ"],"しあげる":["仕上げる"],"しあげた":["仕上げた"],"しあげない":["仕上げない"],"しあげて":["仕上げて"],"しあげれる":["仕上げれる"],"しあげられる":["仕上げられる"],"しごと":["仕事"],"しごとちゅう":["仕事中"],"しごとば":["仕事場"],"しごとがら":["仕事柄"],"しいれ":["仕入れ"],"しきり":["仕切り"],"しかけ":["仕掛け"],"しかた":["仕方"],"しかたがない":["仕方がない","仕方が無い"],"しかたがなかった":["仕方がなかった","仕方が無かった"],"しかたがなくない":["仕方がなくない","仕方が無くない"],"しかたがなくて":["仕方がなくて","仕方が無くて"],"しかたない":["仕方ない"],"しかたなかった":["仕方なかった"],"しかたなくない":["仕方なくない"],"しかたなくて":["仕方なくて"],"しかたなく":["仕方なく"],"しわざ":["仕業"],"しよう":["使用","仕様"],"しくみ":["仕組み"],"しぐさ":["仕草"],"しこみ":["仕込み"],"た":["他","誰","多","田"],"ほか":["他","外"],"ほかに":["他に","外に"],"あだびと":["他人"],"たにん":["他人"],"たにんごと":["他人事"],"たりき":["他力"],"たこく":["他国"],"たあい":["他愛"],"たしょ":["他所"],"よそ":["他所","四十"],"たしゃ":["他社","他者"],"づけ":["付","付け","漬け"],"ついている":["付いている"],"づき":["付き","付き"],"つきあい":["付き合い","付き合い"],"つきあう":["付き合う"],"つきあった":["付き合った"],"つきあわない":["付き合わない"],"つきあって":["付き合って"],"つきあえる":["付き合える"],"つきあわれる":["付き合われる"],"つく":["着く","付く","吐く"],"ついた":["着いた","付いた","吐いた"],"つかない":["着かない","付かない","吐かない"],"ついて":["着いて","付いて","吐いて"],"つける":["着ける","付ける","付ける","吐ける"],"つかれる":["着かれる","付かれる","疲れる","吐かれる"],"づく":["付く"],"づいた":["付いた"],"づかない":["付かない"],"づいて":["付いて"],"づける":["付ける"],"づかれる":["付かれる"],"つけ":["付け","付け"],"つけた":["付けた"],"つけない":["付けない"],"つけて":["付けて"],"つけれる":["付けれる"],"つけられる":["付けられる"],"つけね":["付け根"],"ふぞく":["付属"],"ふきん":["付近"],"ふろく":["付録"],"せんにん":["仙人"],"せんだい":["仙台","千代","先代"],"かわり":["変わり","代わり","変わり","替わり","代わり"],"がわり":["代わり"],"かわりに":["代わりに"],"かわる":["変わる","代わる"],"かわった":["変わった","変わった","代わった"],"かわらない":["変わらない","変わらない","代わらない"],"かわって":["変わって","代わって"],"かわれる":["買われる","変われる","飼われる","代われる"],"かわられる":["変わられる","代わられる"],"だいしょう":["大将","大小","代償"],"だいめいし":["代名詞"],"だいかん":["代官"],"だいだ":["代打"],"だいがえ":["代替"],"だいがわり":["代替"],"だいたい":["大体","代替"],"しろもの":["代物"],"だいぶつ":["代物","大仏"],"だいり":["代理"],"だいりてん":["代理店"],"だいよう":["代用"],"だいこう":["代行"],"だいひょう":["代表"],"だいひょうさく":["代表作"],"だいひょうとりしまりやく":["代表取締役"],"だいひょうてき":["代表的"],"だいひょうしゃ":["代表者"],"たいしゃ":["代謝","大社","退社"],"だいきん":["代金"],"いじょう":["以上","異常"],"いか":["以下","如何"],"いげ":["以下"],"いかのとおり":["以下の通り"],"いない":["以内","居ない"],"いぜん":["以前"],"いぜんに":["以前に"],"いがい":["以外","意外"],"いご":["以後","囲碁"],"いらい":["以来","依頼"],"いこう":["以降","移行","意向"],"かり":["仮","借り","狩り","借り"],"かりに":["仮に"],"かめい":["加盟","仮名"],"かりな":["仮名"],"けみょう":["仮名"],"かそう":["仮想","仮装"],"かみん":["仮眠"],"かしょう":["仮称","歌唱","火傷"],"かせつ":["仮説"],"かめん":["仮面"],"おっしゃる":["仰る"],"おっしゃった":["仰った"],"おっしゃらない":["仰らない"],"おっしゃい":["仰い"],"おっしゃって":["仰って"],"おっしゃり得る":["仰り得る"],"あおむけ":["仰向け"],"ぎょうてん":["仰天"],"ちゅうかい":["仲介"],"なかよく":["仲良く"],"なかよし":["仲良し"],"なかま":["仲間"],"なかまいり":["仲間入り"],"くだん":["件"],"けん":["県","間","見","件","券","軒","兼","鍵","権","剣","圏","拳","賢","腱"],"けんすう":["件数"],"まかせる":["任せる"],"まかせた":["任せた"],"まかせない":["任せない"],"まかせ":["任せ"],"まかせて":["任せて"],"まかせれる":["任せれる"],"まかせられる":["任せられる"],"にんむ":["任務"],"にんめい":["任命"],"にんてんどう":["任天堂"],"にんい":["任意"],"きぎょう":["企業","起業"],"きかく":["企画","規格"],"きかくしょ":["企画書"],"いせたん":["伊勢丹"],"いぶき":["伊吹"],"だて":["伊達"],"ふくせん":["伏線"],"やすみ":["休み","休み"],"やすみちゅう":["休み中"],"やすむ":["休む"],"やすんだ":["休んだ"],"やすまない":["休まない"],"やすんで":["休んで"],"やすまれる":["休まれる"],"やすめる":["休める"],"やすめた":["休めた"],"やすめない":["休めない"],"やすめ":["休め"],"やすめて":["休めて"],"やすめれる":["休めれる"],"やすめられる":["休められる"],"きゅうかん":["休刊"],"きゅうそく":["休息","急速"],"きゅうけい":["休憩"],"きゅうけいしつ":["休憩室"],"きゅうけいじかん":["休憩時間"],"きゅうじつ":["休日"],"きゅうじつしゅっきん":["休日出勤"],"きゅうか":["休暇"],"きゅうぎょう":["休業"],"きゅうし":["休止"],"きゅうよう":["休養"],"あう":["会う","合う"],"あった":["会った","合った","有った","在った"],"あわない":["会わない","合わない"],"あって":["会って","合って","有って","在って"],"あえる":["会える","合える"],"あわれる":["会われる","合われる"],"かいごう":["会合"],"かいいん":["会員"],"かいいんせい":["会員制"],"かいほう":["解放","開放","会報"],"かいじょう":["会場","開場","海上"],"かいき":["怪奇","回帰","会期"],"かいは":["会派"],"かいしゃ":["会社"],"かいしゃいん":["会社員"],"かいけん":["会見","改憲"],"かいけい":["会計"],"かいけいし":["会計士"],"かいわ":["会話"],"かいだん":["階段","会談","怪談"],"かいぎ":["会議"],"かいぎしつ":["会議室"],"かいぎしょ":["会議所"],"かいひ":["回避","会費"],"かいちょう":["会長","快調"],"かいかん":["会館","快感","開館"],"つて":["伝"],"でん":["伝"],"つたえ":["伝え","伝え"],"つたえる":["伝える"],"つたえた":["伝えた"],"つたえない":["伝えない"],"つたえて":["伝えて"],"つたえれる":["伝えれる"],"つたえられる":["伝えられる"],"つたわる":["伝わる"],"つたわった":["伝わった"],"つたわらない":["伝わらない"],"つたわり":["伝わり"],"つたわって":["伝わって"],"つたわれる":["伝われる"],"つたわられる":["伝わられる"],"でんしょう":["伝承"],"でんじゅ":["伝授"],"でんとう":["伝統","電灯"],"でんとうてき":["伝統的"],"つてごと":["伝言"],"でんごん":["伝言"],"でんせつ":["伝説"],"でんどう":["電動","伝道","殿堂"],"でんどうし":["伝道師"],"でんたつ":["伝達"],"ともない":["伴い","伴い"],"ともなう":["伴う"],"ともなった":["伴った"],"ともなわない":["伴わない"],"ともなって":["伴って"],"ともなえる":["伴える"],"ともなわれる":["伴われる"],"ばんそう":["伴奏"],"のばす":["伸ばす"],"のばした":["伸ばした"],"のばさない":["伸ばさない"],"のばし":["伸ばし"],"のばして":["伸ばして"],"のばせる":["伸ばせる"],"のばされる":["伸ばされる"],"のび":["伸び","伸び"],"のびる":["伸びる"],"のびた":["伸びた"],"のびない":["伸びない"],"のびて":["伸びて"],"のびれる":["伸びれる"],"のびられる":["伸びられる"],"うかがい":["伺い","伺い"],"うかがう":["伺う"],"うかがった":["伺った"],"うかがわない":["伺わない"],"うかがって":["伺って"],"うかがえる":["伺える"],"うかがわれる":["伺われる"],"にている":["似ている"],"にていた":["似ていた"],"にていない":["似ていない"],"にてい":["似てい"],"にていて":["似ていて"],"にていれる":["似ていれる"],"にていられる":["似ていられる"],"にてる":["似てる"],"にてた":["似てた"],"にてない":["似てない"],"にてて":["似てて"],"にてれる":["似てれる"],"にてられる":["似てられる"],"にあい":["似合い","似合い"],"にあう":["似合う"],"にあった":["似合った"],"にあわない":["似合わない"],"にあって":["似合って"],"にあえる":["似合える"],"にあわれる":["似合われる"],"にがおえ":["似顔絵"],"つくだに":["佃煮"],"ただし":["但し"],"いちづけ":["位置づけ"],"ひくい":["低い"],"ひくかった":["低かった"],"ひくくない":["低くない"],"ひくくて":["低くて"],"ひくく":["低く"],"ていか":["低下","定価"],"ていかかく":["低価格"],"ていがくねん":["低学年"],"ていきあつ":["低気圧"],"ていめい":["低迷"],"ていおん":["低音"],"すまい":["住まい","相撲","住居"],"すむ":["住む","済む"],"すんだ":["住んだ","済んだ"],"すまない":["住まない","済まない"],"すみ":["住み","角","済み","済み","隅","済","墨","炭"],"すんで":["住んで","済んで"],"すまれる":["住まれる","済まれる"],"じゅうにん":["住人"],"すみとも":["住友"],"じゅうたく":["住宅"],"じゅうたくろーん":["住宅ローン"],"じゅうたくち":["住宅地"],"じゅうたくがい":["住宅街"],"じゅうきょ":["住居"],"じゅうしょ":["住所"],"じゅうみん":["住民"],"じゅうしょく":["住職"],"さがけん":["佐賀県"],"からだ":["体","身体"],"からだじゅう":["体中"],"たいない":["体内"],"たいせい":["大勢","体制","態勢","体勢"],"たいりょく":["体力"],"たいけい":["体型","体系"],"たいあたり":["体当たり"],"たいかん":["体感"],"たいそう":["体操"],"たいかく":["体格"],"たいおん":["体温"],"たいいく":["体育"],"たいいくかいけい":["体育会系"],"たいいくさい":["体育祭"],"たいいくかん":["体育館"],"たいしぼうりつ":["体脂肪率"],"たいちょう":["体調","隊長"],"たいちょうふりょう":["体調不良"],"たいしつ":["体質"],"たいじゅう":["体重"],"たいじゅうけい":["体重計"],"たいけんだん":["体験談"],"なに":["何"],"なん":["何","難"],"なにか":["何か"],"なにかしら":["何かしら"],"なにかと":["何かと"],"なにしろ":["何しろ"],"なにせ":["何せ"],"なんせ":["何せ"],"なんだか":["何だか"],"なんだかんだ":["何だかんだ"],"なんで":["何で"],"なんでも":["何でも"],"なんでもいい":["何でもいい"],"なんでもない":["何でもない"],"なんでもなかった":["何でもなかった"],"なんでもなくない":["何でもなくない"],"なんでもなくて":["何でもなくて"],"なんと":["何と"],"なんとか":["何とか"],"なにとなく":["何となく"],"なんとなく":["何となく"],"なんとも":["何とも"],"なんといっても":["何と言っても"],"なになのか":["何なのか"],"なんなのか":["何なのか"],"なににでも":["何にでも"],"なんにでも":["何にでも"],"なににも":["何にも"],"なんにも":["何にも"],"どの":["何の","殿"],"なんの":["何の"],"なにはともあれ":["何はともあれ"],"なにも":["何も"],"なにもかも":["何もかも"],"なにもない":["何もない","何も無い"],"なにもなかった":["何もなかった","何も無かった"],"なにもなくない":["何もなくない","何も無くない"],"なにもなくて":["何もなくて","何も無くて"],"なにやら":["何やら"],"なにより":["何より"],"なによりも":["何よりも"],"なんよりも":["何よりも"],"なにら":["何ら"],"なんら":["何ら"],"なんかげつ":["何ヶ月"],"なにひとつ":["何一つ"],"なにごと":["何事"],"なにごとも":["何事も"],"なにごともなく":["何事もなく"],"なにじん":["何人"],"なにびと":["何人"],"なんにん":["何人"],"なんびと":["何人"],"なんぴと":["何人"],"なんにんか":["何人か"],"なんびとも":["何人も"],"なんぴとも":["何人も"],"なんこ":["何個"],"いずく":["何処"],"いずこ":["何処"],"いどこ":["何処"],"どこ":["何処"],"どこか":["何処か"],"どっか":["何処か"],"なにぶん":["何分"],"なんぷん":["何分"],"なんじゅう":["何十"],"なにとぞ":["何卒"],"なんかい":["何回","難解"],"なんかいか":["何回か"],"なんかいも":["何回も"],"なんねん":["何年"],"なんど":["何度"],"なんどか":["何度か"],"なんどでも":["何度でも"],"なんども":["何度も"],"なぜ":["何故"],"なにゆえ":["何故"],"なぜか":["何故か"],"なぜなら":["何故なら"],"なんにち":["何日"],"なんじ":["何時"],"なんどき":["何時"],"いつも":["何時も"],"なんじかん":["何時間"],"なんまい":["何枚"],"なにさま":["何様"],"なんさい":["何歳"],"なにげない":["何気ない"],"なにげなかった":["何気なかった"],"なにげなくない":["何気なくない"],"なにげなくて":["何気なくて"],"なにげに":["何気に"],"なんびゃく":["何百"],"なにもの":["何者"],"あまり":["余り"],"あんまり":["余り"],"あまりにも":["余りにも"],"よぎなく":["余儀なく"],"よぶん":["余分"],"よめい":["余命"],"よっぽど":["余程"],"よほど":["余程"],"よゆう":["余裕"],"よけい":["余計"],"よだん":["余談"],"よいん":["余韻"],"つくり":["作り","作り","造り","創り","造り"],"づくり":["作り","造り"],"つくりだす":["作り出す"],"つくりだした":["作り出した"],"つくりださない":["作り出さない"],"つくりだし":["作り出し"],"つくりだして":["作り出して"],"つくりだせる":["作り出せる"],"つくりだされる":["作り出される"],"つくりて":["作り手"],"つくりかた":["作り方"],"つくる":["作る","創る","造る"],"つくった":["作った","創った","造った"],"つくらない":["作らない","創らない","造らない"],"つくって":["作って","創って","造って"],"つくれる":["作れる","創れる","造れる"],"つくられる":["作られる","創られる","造られる"],"さどう":["茶道","作動"],"さくひん":["作品"],"さっか":["作家"],"さくせい":["作成"],"さくせいちゅう":["作成中"],"さくせいしゃ":["作成者"],"さくせん":["作戦"],"さくぶん":["作文"],"さっきょく":["作曲"],"さっきょくか":["作曲家"],"さぎょう":["作業"],"さほう":["作法"],"さくぶつ":["作物"],"さくもつ":["作物"],"さよう":["作用"],"さくが":["作画"],"さくしゃ":["作者"],"さくし":["作詞"],"さくふう":["作風"],"あわせて":["合わせて","併せて"],"へいよう":["併用"],"へいせつ":["併設"],"つかい":["使い","使い","遣い"],"つかいやすい":["使いやすい"],"つかいやすかった":["使いやすかった"],"つかいやすくない":["使いやすくない"],"つかいやすくて":["使いやすくて"],"つかいかって":["使い勝手"],"つかいがって":["使い勝手"],"つかいすて":["使い捨て"],"つかいかた":["使い方"],"つかいみち":["使い道"],"つかう":["使う"],"つかった":["使った"],"つかわない":["使わない"],"つかって":["使って"],"つかえる":["使える","使える","支える"],"つかわれる":["使われる"],"つかえた":["使えた","支えた"],"つかえない":["使えない","支えない"],"つかえ":["使え","支え"],"つかえて":["使えて","支えて"],"つかえれる":["使えれる","支えれる"],"つかえられる":["使えられる","支えられる"],"しめい":["指名","使命","氏名"],"ためし":["例","試し","試し"],"たとえ":["例え","例え"],"たとえば":["例えば"],"たとえる":["例える"],"たとえた":["例えた"],"たとえない":["例えない"],"たとえて":["例えて"],"たとえれる":["例えれる"],"たとえられる":["例えられる"],"れいによって":["例によって"],"れいの":["例の"],"れいかい":["例会"],"れいがい":["例外"],"れいねん":["例年"],"さぶらい":["侍"],"さむらい":["侍"],"きょうきゅう":["供給"],"くよう":["供養"],"いそん":["依存"],"いぞん":["依存"],"いぞんしょう":["依存症"],"かち":["勝ち","価値","勝ち"],"かちかん":["価値観"],"かかく":["価格"],"しんにゅう":["侵入","新入","進入"],"しんがい":["侵害"],"しんりゃく":["侵略"],"びん":["便","瓶","貧"],"べん":["便","弁","弁","弁"],"よすか":["縁","便"],"よすが":["縁","便"],"たより":["便り","頼り","頼り"],"だより":["便り"],"びんじょう":["便乗"],"べんり":["便利"],"べんぴ":["便秘"],"かかり":["係","掛かり","係り","掛かり"],"かかりちょう":["係長"],"うながす":["促す"],"うながした":["促した"],"うながさない":["促さない"],"うながし":["促し"],"うながして":["促して"],"うながせる":["促せる"],"うながされる":["促される"],"そくしん":["促進"],"がぜん":["俄然"],"しゅん":["旬","俊"],"じゅん":["順","旬","純","準","俊","准"],"ぞく":["続","族","属","俗"],"ぞくに":["俗に"],"たもつ":["保つ"],"たもった":["保った"],"たもたない":["保たない"],"たもち":["保ち"],"たもって":["保って"],"たもてる":["保てる"],"たもたれる":["保たれる"],"ほけんしつ":["保健室"],"ほぜん":["保全"],"ほぞん":["保存"],"ほしゅ":["保守","捕手"],"ほじ":["保持"],"ほゆう":["保有"],"ほりゅう":["保留"],"ほかん":["保管","補完"],"ほいく":["保育"],"ほいくえん":["保育園"],"ほいくしょ":["保育所"],"ほいくじょ":["保育所"],"ほしょう":["保障","保証","補償"],"ほご":["保護"],"ほごしゃ":["保護者"],"ほけん":["保険"],"ほけんがいしゃ":["保険会社"],"ほけんりょう":["保険料"],"ほよう":["保養"],"しんじる":["信じる"],"しんじた":["信じた"],"しんじない":["信じない"],"しんじ":["心地","信じ"],"しんじて":["信じて"],"しんじれる":["信じれる"],"しんじられる":["信じられる"],"しんこう":["進行","振興","信仰","新興"],"しんごう":["信号"],"しんごうまち":["信号待ち"],"しんねん":["新年","信念"],"しんじょう":["心情","信条"],"しんよう":["信用"],"しんじゃ":["信者"],"しんたく":["信託"],"しんらい":["信頼"],"しんらいせい":["信頼性"],"しんらいかんけい":["信頼関係"],"しゅうりょう":["終了","修了"],"しゅうがく":["修学"],"しゅうがくりょこう":["修学旅行"],"しゅうふく":["修復"],"しゅうぎょう":["修行","終業","就業","修業"],"しゅぎょう":["修行","修業"],"しゅうせい":["修正","習性"],"しゅうり":["修理"],"しゅり":["修理"],"すり":["修理"],"はいゆう":["俳優"],"はいく":["俳句"],"おれ":["俺","己"],"おれたち":["俺たち","俺達"],"おいら":["俺ら"],"おれら":["俺ら"],"おれさま":["俺様"],"くら":["蔵","庫","倉"],"そうこ":["倉庫"],"くらしき":["倉敷"],"こ":["子","小","個","湖","児","粉","故","戸","濃","胡","壺","壷"],"ぢ":["道","個","路"],"こじん":["個人"],"こじんじょうほう":["個人情報"],"こじんてき":["個人的"],"こたい":["個体"],"こべつ":["個別"],"こしつ":["個室"],"こてん":["古典","個展"],"こせい":["個性"],"こせいてき":["個性的"],"ばいぞう":["倍増"],"ばいりつ":["倍率"],"たおす":["倒す"],"たおした":["倒した"],"たおさない":["倒さない"],"たおし":["倒し"],"たおして":["倒して"],"たおせる":["倒せる"],"たおされる":["倒される"],"たおれ":["倒れ","倒れ"],"たおれる":["倒れる"],"たおれた":["倒れた"],"たおれない":["倒れない"],"たおれて":["倒れて"],"たおれれる":["倒れれる"],"たおれられる":["倒れられる"],"とうさん":["父さん","嬢さん","倒産"],"さう":["候"],"す":["為","州","素","酢","巣","洲","酸","候"],"そうらう":["候"],"そうろう":["候"],"こうほ":["候補"],"こうほしゃ":["候補者"],"かりる":["借りる"],"かりた":["借りた"],"かりない":["借りない"],"かりて":["借りて"],"かりれる":["借りれる"],"かりられる":["借りられる"],"しゃっきん":["借金"],"あたい":["私","費","値","直"],"あたいする":["値する"],"ねあがり":["値上がり"],"ねあげ":["値上げ"],"ねさげ":["値下げ"],"ねびき":["値引き"],"ねうち":["値打ち"],"ねだん":["値段"],"りんり":["倫理"],"えらい":["偉い"],"えらかった":["偉かった"],"えらくない":["偉くない"],"えらくて":["偉くて"],"えらそう":["偉そう"],"いだい":["偉大"],"へんくつ":["偏屈"],"へんさち":["偏差値"],"へんけん":["偏見"],"ていし":["停止","弟子"],"ていたい":["停滞"],"ていしゃ":["停車"],"ていでん":["停電"],"すこやか":["健やか"],"けんぜん":["健全"],"けんざい":["健在"],"けんこう":["健康"],"けんこうほけん":["健康保険"],"けんこうほう":["健康法"],"けんこうてき":["健康的"],"けんこうかんり":["健康管理"],"けんこうしんだん":["健康診断"],"けんこうしょくひん":["健康食品"],"けなげ":["健気"],"けんしん":["検診","健診"],"けんとう":["検討","健闘","見当"],"かたわら":["側","脇","傍","傍ら"],"かわ":["側","川","皮","河","革"],"がわ":["側","川","河"],"そく":["足","側","即","息","速"],"そば":["側","蕎麦","傍"],"わき":["側","脇","傍","和気"],"そばから":["側から"],"そくめん":["側面"],"ていさつ":["偵察"],"ぐうぜん":["偶然"],"ぎ":["気","着","技","偽","義","議","疑"],"にせ":["偽"],"いつわり":["偽り"],"ぎそう":["偽装"],"ぎぞう":["偽造"],"ぼうちょう":["傍聴"],"けっさく":["傑作"],"かさ":["傘","笠"],"からかさ":["傘"],"そなえ":["備え","備え"],"そなえる":["備える"],"そなえた":["備えた"],"そなえない":["備えない"],"そなえて":["備えて"],"そなえれる":["備えれる"],"そなえられる":["備えられる"],"びぼうろく":["備忘録"],"もよおし":["催し"],"さいそく":["最速","催促"],"ごうまん":["傲慢"],"さいけん":["再建","債権","債券"],"さいむ":["債務"],"きず":["傷"],"きずつける":["傷つける"],"きずつけた":["傷つけた"],"きずつけない":["傷つけない"],"きずつけ":["傷つけ"],"きずつけて":["傷つけて"],"きずつけれる":["傷つけれる"],"きずつけられる":["傷つけられる"],"けいこう":["傾向"],"けいしゃ":["傾斜"],"わずか":["僅か"],"はたらき":["働き","働き"],"はたらく":["働く"],"はたらいた":["働いた"],"はたらかない":["働かない"],"はたらいて":["働いて"],"はたらける":["働ける"],"はたらかれる":["働かれる"],"ぞう":["蔵","像","増","象"],"ぼく":["僕"],"やつがれ":["僕"],"やつこらま":["僕","奴"],"ぼくたち":["僕たち","僕達"],"そうりょ":["僧侶"],"ぎしき":["儀式"],"おく":["奥","億","置く"],"おくまん":["億万"],"おくまんちょうじゃ":["億万長者"],"おくえん":["億円"],"おくこう":["億劫"],"おっくう":["億劫"],"やさ":["優"],"やさしい":["優しい"],"やさしかった":["優しかった"],"やさしくない":["優しくない"],"やさしくて":["優しくて"],"すぐれた":["優れた"],"すぐれて":["優れて"],"ゆうい":["優位"],"ゆうせん":["優先","有線"],"ゆうせんじゅんい":["優先順位"],"ゆうしょう":["優勝"],"ゆうせい":["郵政","優勢"],"ゆうたい":["優待"],"ゆうしゅう":["優秀"],"ゆうりょう":["有料","優良"],"ゆうぐう":["優遇"],"ゆうが":["優雅"],"もうかる":["儲かる"],"もうかった":["儲かった"],"もうからない":["儲からない"],"もうかり":["儲かり"],"もうかって":["儲かって"],"もうかれる":["儲かれる"],"もうかられる":["儲かられる"],"もうけ":["儲け","儲け"],"もうける":["儲ける"],"もうけた":["儲けた"],"もうけない":["儲けない"],"もうけて":["儲けて"],"もうけれる":["儲けれる"],"もうけられる":["儲けられる"],"もともと":["元々"],"もとは":["元は"],"もとへ":["元へ"],"がんねん":["元年"],"がんたん":["元旦"],"げんき":["元気"],"がんそ":["元祖"],"もとしゅしょう":["元首相"],"あに":["兄"],"にい":["新","兄"],"あにさん":["兄さん"],"にいさん":["兄さん"],"あんちゃん":["兄ちゃん"],"にいちゃん":["兄ちゃん"],"きょうだい":["兄弟","姉妹","兄妹","姉弟"],"けいまい":["兄妹"],"けいてい":["兄弟"],"あにき":["兄貴"],"じゅうぶん":["十分","充分"],"じゅうじつ":["充実"],"じゅうじつした":["充実した"],"じゅうでん":["充電"],"きざし":["兆し"],"ちょうこう":["重厚","長江","兆候"],"さき":["前","先","咲き","崎","岬"],"さきざき":["先々"],"せんせんしゅう":["先々週"],"まず":["先ず"],"さきに":["先に"],"せんに":["先に"],"さきほど":["先ほど","先程"],"せんにゅうかん":["先入観"],"せんせい":["先生","先制"],"さきどり":["先取り"],"せんじつ":["先日"],"せんげつ":["先月"],"さきもの":["先物"],"せんせいがた":["先生方"],"せんぱつ":["先発"],"せんちゃく":["先着"],"せんぞ":["先祖"],"せんたん":["先端"],"せんこう":["先行","選考","線香","専攻"],"せんぱい":["先輩"],"さきおくり":["先送り"],"せんしゅう":["先週","千秋"],"せんしん":["先進"],"せんしんこく":["先進国"],"せんとう":["戦闘","先頭","銭湯"],"ひかる":["光る"],"ひかった":["光った"],"ひからない":["光らない"],"ひかって":["光って"],"ひかれる":["引かれる","光れる","弾かれる"],"ひかられる":["光られる"],"こうけい":["光景","後継"],"こうえい":["光栄","公営"],"こうせん":["光線"],"こくふく":["克服"],"めんえき":["免疫"],"めんきょ":["免許"],"めんせき":["面積","免責"],"めんじょ":["免除"],"とにかく":["兎に角"],"じどう":["自動","児童"],"たむら":["党"],"とうしゅ":["投手","党首"],"いり":["入り","入り","入","要り"],"しお":["塩","入","潮"],"いりくち":["入り口","入口"],"いりぐち":["入り口","入口"],"はいりくち":["入り口","入口"],"はいりぐち":["入り口","入口"],"いる":["入る","居る","要る"],"いらない":["入らない","要らない"],"いれる":["入れる","入れる","居れる","要れる"],"いられる":["入られる","居られる","要られる"],"はいる":["入る"],"はいった":["入った"],"はいらない":["入らない"],"はいり":["入り"],"はいって":["入って"],"はいれる":["入れる"],"はいられる":["入られる"],"いれ":["入れ","入れ"],"いれた":["入れた"],"いれない":["入れない"],"いれて":["入れて"],"いれれる":["入れれる"],"いれられる":["入れられる"],"いれかえ":["入れ替え"],"いれもの":["入れ物"],"いりあい":["入会"],"にゅうかい":["入会"],"にゅうりょく":["入力"],"にゅうだん":["入団"],"にゅうこく":["入国"],"にゅうえん":["入園"],"にゅうじょう":["入場"],"にゅうじょうりょう":["入場料"],"にゅうがく":["入学"],"にゅうがくしき":["入学式"],"にゅうきょ":["入居"],"にゅうしゅ":["入手"],"にゅうさつ":["入札"],"にゅうよく":["入浴"],"にゅうしゃ":["入社"],"にゅうせき":["入籍"],"にゅうか":["入荷"],"にゅうし":["入試"],"にゅうしょう":["入賞"],"にゅうきん":["入金"],"にゅうもん":["入門"],"にゅういん":["入院"],"にゅういんちゅう":["入院中"],"にゅうたい":["入隊"],"じゅこん":["入魂"],"じゅっこん":["入魂"],"にゅうこん":["入魂"],"ぜん":["前","全","善","膳","禅"],"まったく":["全く"],"すべて":["全て"],"ぜんせかい":["全世界"],"ぜんたい":["全体"],"ぜんたいで":["全体で"],"ぜんたいとして":["全体として"],"ぜんたいに":["全体に"],"ぜんりょく":["全力"],"ぜんしょう":["全勝"],"ぜんいん":["全員"],"ぜんこく":["全国"],"ぜんごく":["全国"],"ぜんこくたいかい":["全国大会"],"ぜんこくてき":["全国的"],"ぜんいき":["全域"],"ぜんぶん":["全文"],"ぜんにほん":["全日本"],"ぜんきょく":["全曲"],"ぜんこう":["全校"],"ぜんめつ":["全滅"],"ぜんぜん":["全然"],"ぜんせいき":["全盛期"],"ぜんべい":["全米"],"ぜんぺん":["前編","全編"],"ぜんぱん":["全般","前半"],"ぜんら":["全裸"],"ぜんぼう":["全貌"],"ぜんしん":["全身","前進"],"ぜんぶ":["全部"],"ぜんちょう":["全長"],"ぜんかい":["前回","全開"],"ぜんしゅう":["全集"],"ぜんめん":["全面","前面"],"ぜんめんてき":["全面的"],"ぜんがく":["全額"],"はち":["八","鉢","蜂"],"やっつ":["八つ"],"やつ":["奴","八つ"],"はちまん":["八幡"],"はちまんぐう":["八幡宮"],"はっぽう":["発泡","八方"],"はちがつ":["８月","八月"],"やおや":["八百屋"],"はっく":["八苦"],"やえ":["八重"],"おおやけ":["公"],"きみ":["君","気味","公"],"こうきょう":["公共"],"こうむいん":["公務員"],"こうぼ":["酵母","公募"],"こうえん":["公園","公演","講演"],"こうあん":["考案","公安"],"こうへい":["公平"],"こうしき":["公式"],"こうしきせん":["公式戦"],"こうめい":["公明"],"こうめいとう":["公明党"],"こうせい":["構成","厚生","向性","公正","攻勢"],"こうみんかん":["公民館"],"こうてき":["公的"],"こうしゃ":["後者","校舎","公社"],"こうし":["講師","行使","公私"],"こうりつ":["効率","公立"],"こうやく":["公約"],"こうしゅう":["講習","公衆"],"こうひょう":["好評","公表"],"こうにん":["公認"],"こうにんかいけいし":["公認会計士"],"こうかい":["公開","後悔","航海"],"むう":["六"],"ろく":["六","録","陸","陸","鹿"],"ろくがつ":["６月","六月"],"ども":["共"],"ともども":["共々"],"ともに":["共に"],"きょうどう":["共同","協同"],"きょうどうつうしん":["共同通信"],"きょうわこく":["共和国"],"きょうそん":["共存"],"きょうぞん":["共存"],"きょうかん":["共感","教官"],"きょうゆう":["共有"],"きょうえん":["共演","競演"],"きょうせい":["強制","矯正","共生"],"ともいき":["共生"],"きょうさん":["共産","協賛"],"きょうさんとう":["共産党"],"きょうぼう":["共謀"],"きょうつう":["共通"],"きょうつうてん":["共通点"],"きょうめい":["共鳴"],"つわもの":["兵"],"へい":["兵","塀"],"へいき":["平気","兵器"],"へいし":["兵士"],"ひょうごけん":["兵庫県"],"へいたい":["兵隊"],"その":["園","其の","苑"],"ぐ":["具","愚"],"つま":["夫","妻","具"],"ぐたい":["具体"],"ぐたいてき":["具体的"],"ぐあい":["具合"],"てんけい":["典型"],"てんけいてき":["典型的"],"かねて":["兼ねて"],"けんぎょう":["兼業"],"けんごう":["兼業"],"うちがわ":["内側"],"うちそと":["内外"],"ないがい":["内外"],"ないてい":["内定"],"ないよう":["内容"],"ないしん":["内心"],"うちうみ":["内海"],"うちかい":["内海"],"うちのみ":["内海"],"うつみ":["内海"],"ないかい":["内海"],"ないしょ":["内緒"],"ないしょく":["内職"],"ないぞう":["内臓","内蔵"],"ないそう":["内装"],"うちわ":["内輪"],"ないりん":["内輪"],"ないぶ":["内部"],"ないや":["内野"],"ないかく":["内閣"],"ないかくふ":["内閣府"],"ないりく":["内陸"],"うちづら":["内面"],"ないめん":["内面"],"えん":["円","塩","縁","園","炎","苑","艶"],"えんやす":["円安"],"えんけい":["円形"],"まるがた":["円形"],"えんだか":["円高"],"さつ":["冊","札"],"さっし":["冊子","察し"],"そうし":["冊子"],"ふたたび":["再び"],"さいかい":["再開","再会","最下位"],"さいしゅっぱつ":["再出発"],"さいりよう":["再利用"],"さいこん":["再建","再婚"],"さいほうそう":["再放送"],"さいらい":["再来"],"さいねん":["再燃"],"さいげん":["再現"],"さいせい":["再生"],"さいはつ":["再発"],"さいかくにん":["再確認"],"さいへん":["再編"],"さいこう":["最高","再考"],"さいにんしき":["再認識"],"さいはん":["再販"],"さいき":["再起"],"さいきどう":["再起動"],"さいかいはつ":["再開発"],"ぼうけん":["冒険"],"ぼうとう":["冒頭"],"じょうだん":["冗談"],"うつす":["移す","写す"],"うつした":["移した","写した"],"うつさない":["移さない","写さない"],"うつし":["移し","写し"],"うつして":["移して","写して"],"うつせる":["移せる","写せる"],"うつされる":["移される","写される"],"うつり":["映り","写り","移り","写り"],"うつる":["映る","写る","移る"],"うつった":["映った","写った","移った"],"うつらない":["映らない","写らない","移らない"],"うつって":["映って","写って","移って"],"うつれる":["映れる","写れる","移れる"],"うつられる":["映られる","写られる","移られる"],"しゃめ":["写メ"],"しゃしん":["写真"],"しゃしんをとる":["写真を撮る"],"しゃしんか":["写真家"],"しゃしんしゅう":["写真集"],"しゃしんかん":["写真館"],"かうぶり":["冠"],"かがふり":["冠"],"かぶり":["頭","冠"],"かむり":["冠"],"かんぶり":["冠"],"かんむり":["冠"],"こうぶり":["冠"],"めいふく":["冥福"],"ふゆ":["冬"],"ふゆやすみ":["冬休み"],"ふゆば":["冬場"],"とうき":["陶器","冬季"],"とうみん":["冬眠"],"ひや":["冷"],"ひえ":["冷え","冷え"],"ひえる":["冷える"],"ひえた":["冷えた"],"ひえない":["冷えない"],"ひえて":["冷えて"],"ひえれる":["冷えれる"],"ひえられる":["冷えられる"],"ひえしょう":["冷え性"],"つべたい":["冷たい"],"つべたかった":["冷たかった"],"つべたくない":["冷たくない"],"つべたくて":["冷たくて"],"つめたい":["冷たい"],"つめたかった":["冷たかった"],"つめたくない":["冷たくない"],"つめたくて":["冷たくて"],"ひやしちゅうか":["冷やし中華"],"ひやす":["冷やす"],"ひやした":["冷やした"],"ひやさない":["冷やさない"],"ひやし":["冷やし"],"ひやして":["冷やして"],"ひやせる":["冷やせる"],"ひやされる":["冷やされる"],"ひやあせ":["冷や汗"],"れいとう":["冷凍"],"れいとうこ":["冷凍庫"],"れいとうしょくひん":["冷凍食品"],"れいきゃく":["冷却"],"れいぼう":["冷房"],"れいぞうこ":["冷蔵庫"],"れいせい":["冷静"],"れいめん":["冷麺"],"すごい":["凄い"],"すごかった":["凄かった"],"すごくない":["凄くない"],"すごくて":["凄くて"],"すごく":["凄く"],"すさまじい":["凄まじい"],"すさまじかった":["凄まじかった"],"すさまじくない":["凄まじくない"],"すさまじくて":["凄まじくて"],"とうけつ":["凍結"],"りん":["輪","凛","鈴"],"こった":["凝った"],"ぎょうしゅく":["凝縮"],"ぼんじん":["凡人"],"ぼんにん":["凡人"],"しょぶん":["処分"],"しょほう":["処方"],"しょり":["処理"],"しょち":["処置"],"なぎ":["凪"],"きょうあく":["凶悪"],"でこ":["凸"],"でこぼこ":["凸凹"],"とつおう":["凸凹"],"おう":["王","合う","追う","央","翁","凹"],"くぼむ":["凹む"],"くぼんだ":["凹んだ"],"くぼまない":["凹まない"],"くぼみ":["凹み"],"くぼんで":["凹んで"],"くぼまれる":["凹まれる"],"へこむ":["凹む"],"へこんだ":["凹んだ"],"へこまない":["凹まない"],"へこみ":["凹み"],"へこんで":["凹んで"],"へこまれる":["凹まれる"],"でかける":["出かける","出掛ける"],"でかけた":["出かけた","出掛けた"],"でかけない":["出かけない","出掛けない"],"でかけ":["出かけ","出掛け"],"でかけて":["出かけて","出掛けて"],"でかけれる":["出かけれる","出掛けれる"],"でかけられる":["出かけられる","出掛けられる"],"だし":["出し","出し","出汁"],"だしてくれる":["出してくれる"],"だす":["出す"],"だした":["出した"],"ださない":["出さない"],"だして":["出して"],"だせる":["出せる"],"だされる":["出される"],"でだし":["出だし"],"でていく":["出て行く"],"でていった":["出て行った"],"でていかない":["出て行かない"],"でていき":["出て行き"],"でていって":["出て行って"],"でていける":["出て行ける"],"でていかれる":["出て行かれる"],"でてゆく":["出て行く"],"でてゆった":["出て行った"],"でてゆかない":["出て行かない"],"でてゆき":["出て行き"],"でてゆって":["出て行って"],"でてゆける":["出て行ける"],"でてゆかれる":["出て行かれる"],"でる":["出る"],"でた":["出た"],"でない":["出ない"],"でて":["出て"],"でれる":["出れる"],"でられる":["出られる"],"しゅっせ":["出世"],"であい":["出会い","出会い"],"であう":["出会う"],"であわない":["出会わない"],"であえる":["出会える"],"であわれる":["出会われる"],"でさき":["出先"],"でいり":["出入り"],"ではいり":["出入り"],"でまえ":["出前"],"しゅつりょく":["出力"],"しゅつどう":["出動"],"しゅっきん":["出勤"],"でぐち":["出口"],"しゅっぴん":["出品"],"しゅつじょう":["出場"],"でば":["出場"],"しゅってん":["出店","出展"],"しゅっせき":["出席"],"でみせ":["出店"],"しゅっちょう":["出張"],"しゅっちょうじょ":["出張所"],"しゅっしょ":["出所"],"でどこ":["出所"],"でどころ":["出所"],"でがけ":["出掛け"],"しゅつげき":["出撃"],"しゅったい":["出来"],"でき":["出来","出来"],"できる":["出来る"],"できた":["出来た"],"できない":["出来ない"],"できて":["出来て"],"できれる":["出来れる"],"できられる":["出来られる"],"できるだけ":["出来るだけ"],"できあがり":["出来上がり","出来上がり"],"できあがる":["出来上がる"],"できあがった":["出来上がった"],"できあがらない":["出来上がらない"],"できあがって":["出来上がって"],"できあがれる":["出来上がれる"],"できあがられる":["出来上がられる"],"できごと":["出来事"],"しゅつぼつ":["出没"],"しゅつえん":["出演"],"しゅつえんしゃ":["出演者"],"しゅっぱん":["出版"],"しゅっぱんしゃ":["出版社"],"しゅつげん":["出現"],"しゅっさん":["出産"],"でばん":["出番"],"しゅっぱつ":["出発"],"しゅっか":["出荷"],"しゅっけつ":["出血"],"しゅっぴ":["出費"],"しゅっし":["出資"],"しゅっそう":["出走"],"しゅっしん":["出身"],"しゅっしんち":["出身地"],"しゅっしんしゃ":["出身者"],"でむかえ":["出迎え"],"しゅつじん":["出陣"],"しゅつだい":["出題"],"しゅつば":["出馬"],"かたな":["刀"],"やいば":["刃"],"ぶ":["分","部","歩","武"],"ぶん":["分","文"],"わからん":["分からん"],"わかり":["分かり","分かり","解り","判り"],"わかりにくい":["分かりにくい"],"わかりにくかった":["分かりにくかった"],"わかりにくくない":["分かりにくくない"],"わかりにくくて":["分かりにくくて"],"わかりやすい":["分かりやすい"],"わかりやすかった":["分かりやすかった"],"わかりやすくない":["分かりやすくない"],"わかりやすくて":["分かりやすくて"],"わかる":["分かる","解る","判る"],"わかった":["分かった","解った","判った"],"わからない":["分からない","解らない","判らない"],"わかって":["分かって","解って","判って"],"わかれる":["分かれる","解れる","判れる","分かれる","別れる"],"わかられる":["分かられる","解られる","判られる"],"わかれ":["別れ","分かれ","分かれ","別れ"],"わかれた":["分かれた","別れた"],"わかれない":["分かれない","別れない"],"わかれて":["分かれて","別れて"],"わかれれる":["分かれれる","別れれる"],"わかれられる":["分かれられる","別れられる"],"わけ":["別","訳","分け","分け"],"わけて":["分けて","分けて"],"わける":["分ける"],"わけた":["分けた"],"わけない":["分けない"],"わけれる":["分けれる"],"わけられる":["分けられる"],"ぶんだけ":["分だけ"],"ぶんの":["分の"],"ぶんのいち":["分の１"],"ふんべつ":["分別"],"ぶんべつ":["分別"],"ぶんかつ":["分割"],"ぶあつい":["分厚い"],"ぶあつかった":["分厚かった"],"ぶあつくない":["分厚くない"],"ぶあつくて":["分厚くて"],"ぶんし":["分子"],"ぶんぷ":["分布"],"ぶんたん":["分担"],"ぶんさん":["分散"],"ぶんせき":["分析"],"ぶんれつ":["分裂"],"ぶんかい":["分解"],"ぶんじょう":["分譲"],"ぶんや":["分野"],"ぶんりょう":["分量"],"ふんかん":["分間"],"ぶんり":["分離"],"ぶんるい":["分類"],"せつ":["節","説","切","拙"],"せつない":["切ない"],"せつなかった":["切なかった"],"せつなくない":["切なくない"],"せつなくて":["切なくて"],"せつに":["切に"],"きり":["切り","切り","霧","斬り","桐"],"きりくち":["切り口"],"きりかえ":["切替","切り替え"],"きった":["切った","斬った"],"きらない":["切らない","斬らない"],"きって":["切って","斬って","切手"],"きれる":["切れる","着れる","斬れる","切れる"],"きられる":["切られる","着られる","斬られる"],"きれ":["切れ","切れ"],"きれない":["切れない","切れない"],"きれた":["切れた"],"きれて":["切れて","切手"],"きれれる":["切れれる"],"きれられる":["切れられる"],"きれあじ":["切れ味"],"せつじつ":["切実"],"せつだん":["切断"],"せったい":["切替","接待"],"きっぷ":["切符"],"かんこう":["観光","刊行"],"けいじ":["刑事","掲示"],"けいむしょ":["刑務所"],"れつ":["列"],"れつでん":["列伝"],"れっとう":["列島"],"れっしゃ":["列車"],"うぶ":["初","生","産","初心"],"はつ":["初","発"],"はじめ":["始め","初め","始め"],"はじめて":["初めて","始めて","始めて"],"はじめに":["初めに","始めに"],"はじめは":["初めは","始めは"],"はじめまして":["初めまして","始めまして"],"しょだい":["初代"],"しょたいけん":["初体験"],"はつたいけん":["初体験"],"はつゆうしょう":["初優勝"],"しょかい":["初回"],"しょか":["初夏"],"はつなつ":["初夏"],"しょたいめん":["初対面"],"しょしん":["初心"],"しょしんしゃ":["初心者"],"はつこい":["初恋"],"しょせん":["初戦","所詮"],"はつちょうせん":["初挑戦"],"しょにち":["初日"],"はつひ":["初日"],"しょじゅん":["初旬"],"しょき":["初期","暑気","書記"],"しょしゅう":["初秋"],"はつあき":["初秋"],"しょきゅう":["初級"],"しょけん":["初見"],"はつもうで":["初詣"],"はつゆき":["初雪"],"はつね":["初音"],"はんべつ":["判別"],"はんてい":["判定"],"はんだん":["判断"],"はんめい":["判明"],"はんけつ":["判決"],"べつ":["別"],"べつべつ":["別々"],"べつべつに":["別々に"],"べつとして":["別として"],"べつに":["別に"],"べっせかい":["別世界"],"べつじん":["別人"],"べつにん":["別人"],"べっさつ":["別冊"],"べつみょう":["別名"],"べつめい":["別名"],"べっしつ":["別室"],"べっかく":["別格"],"べつもの":["別物"],"べっそう":["別荘"],"べっかん":["別館"],"りこう":["利口"],"りけん":["利権"],"りてん":["利点"],"りよう":["利用"],"りようしゃ":["利用者"],"りえき":["利益"],"りやく":["利益"],"とうてい":["到底"],"とうらい":["到来"],"とうちゃく":["到着"],"とうたつ":["到達"],"せいさく":["制作","製作","政策"],"せいてい":["制定"],"せいど":["制度","精度"],"せいぎょ":["制御"],"せいふく":["制服","征服"],"せいやく":["製薬","制約"],"せいさい":["制裁"],"せいは":["制覇"],"せいげん":["制限"],"せつな":["刹那"],"さす":["指す","差す","刺す"],"さした":["指した","差した","刺した"],"ささない":["指さない","差さない","刺さない"],"さして":["指して","差して","刺して"],"させる":["指せる","差せる","刺せる"],"さされる":["指される","差される","刺される"],"しかく":["資格","視覚","刺客"],"しきゃく":["刺客"],"しげき":["刺激"],"しげきてき":["刺激的"],"ししゅう":["刺繍","詩集"],"さしみ":["刺身"],"きざ":["刻"],"こく":["石","刻"],"きざみ":["刻み"],"けずる":["削る"],"けずった":["削った"],"けずらない":["削らない"],"けずり":["削り"],"けずって":["削って"],"けずれる":["削れる"],"けずられる":["削られる"],"はつる":["削る"],"はつった":["削った"],"はつらない":["削らない"],"はつり":["削り"],"はつって":["削って"],"はつれる":["削れる"],"はつられる":["削られる"],"さくげん":["削減"],"さくじょ":["削除"],"まえ":["前"],"まえまえ":["前々"],"まえに":["前に"],"まえもって":["前もって"],"ぜんせ":["前世"],"ぜんせい":["前世"],"ぜんだい":["前代"],"ぜんだいみもん":["前代未聞"],"ぜんさく":["前作"],"ぜんれつ":["前列"],"ぜんはん":["前半"],"ぜんはんせん":["前半戦"],"ぜんぱんせん":["前半戦"],"まえむき":["前向き"],"まえうり":["前売り"],"ぜんや":["前夜"],"ぜんやさい":["前夜祭"],"ぜんねん":["前年"],"ぜんご":["前後"],"ぜんてい":["前提"],"ぜんぽう":["前方"],"まえかた":["前方"],"ぜんじつ":["前日"],"まえび":["前日"],"ぜんげつ":["前月"],"ぜんき":["前期"],"ぜんりゃく":["前略"],"ぜんせん":["前線"],"まえおき":["前置き"],"ぜんしゃ":["前者"],"ぜんさい":["前菜"],"まえあし":["前足"],"ぜんじゅつ":["前述"],"ぜんと":["前途"],"まえがみ":["前髪"],"ごう":["号","業","剛","合","郷","豪"],"つるぎ":["剣"],"けんどう":["剣道"],"ざい":["材","剤","在","財"],"せんてい":["選定","剪定"],"とりわけ":["副"],"ふく":["服","福","副","吹く","複"],"ふくかいちょう":["副会長"],"ふくさよう":["副作用"],"ふくしゅうにゅう":["副収入"],"ふくぎょう":["副業"],"ふくとしん":["副都心"],"わり":["割","割り","割り"],"わりと":["割と","割りと"],"わりに":["割に","割りに"],"わる":["悪","割る"],"わった":["割った"],"わらない":["割らない"],"わって":["割って"],"われる":["割れる"],"わられる":["割られる"],"われ":["我","割れ","吾"],"わりあい":["割合"],"わりびき":["割引"],"かつあい":["割愛"],"かっぽう":["割烹"],"そうさく":["創作","捜索"],"そうかがっかい":["創価学会"],"そうかん":["創刊","相関"],"そうぎょう":["創業"],"そうりつ":["創立"],"そうせつ":["創設"],"そうぞう":["想像","創造"],"げき":["劇","隙"],"げきちゅう":["劇中"],"げきだん":["劇団"],"げきじょう":["劇場"],"げきじょうばん":["劇場版"],"げきてき":["劇的"],"ちから":["力"],"りき":["力"],"りょく":["力"],"ちからぶそく":["力不足"],"りきさく":["力作"],"りきし":["力士"],"ちからづよい":["力強い"],"ちからづよかった":["力強かった"],"ちからづよくない":["力強くない"],"ちからづよくて":["力強くて"],"りきりょう":["力量"],"こうせき":["功績"],"くわえる":["加える"],"くわえた":["加えた"],"くわえない":["加えない"],"くわえ":["加え"],"くわえて":["加えて"],"くわえれる":["加えれる"],"くわえられる":["加えられる"],"くわわる":["加わる"],"くわわった":["加わった"],"くわわらない":["加わらない"],"くわわり":["加わり"],"くわわって":["加わって"],"くわわれる":["加われる"],"くわわられる":["加わられる"],"かにゅう":["加入"],"かがいしゃ":["加害者"],"かげん":["加減"],"かねつ":["加熱"],"かさん":["加算"],"かご":["籠","加護"],"かそく":["加速"],"かれい":["華麗","加齢"],"れっか":["劣化"],"じょ":["女","助","序"],"すけ":["助","次官"],"たすかる":["助かる"],"たすかった":["助かった"],"たすからない":["助からない"],"たすかり":["助かり"],"たすかって":["助かって"],"たすかれる":["助かれる"],"たすかられる":["助かられる"],"たすけ":["助け","助け"],"たすけて":["助けて","助けて"],"たすける":["助ける"],"たすけた":["助けた"],"たすけない":["助けない"],"たすけれる":["助けれる"],"たすけられる":["助けられる"],"すけっと":["助っ人"],"じょせい":["女性","助成"],"じょせいきん":["助成金"],"じょしゅ":["助手"],"すけて":["助手"],"じょしゅせき":["助手席"],"じょげん":["助言"],"じょごん":["助言"],"つとめて":["務めて","勤めて","努めて"],"どりょく":["努力"],"はげまし":["励まし"],"はげみ":["励み","励み"],"はげむ":["励む"],"はげんだ":["励んだ"],"はげまない":["励まない"],"はげんで":["励んで"],"はげまれる":["励まれる"],"ろう":["労","老","楼"],"ろうどう":["労働"],"ろうどうくみあい":["労働組合"],"ろうどうしゃ":["労働者"],"ろうりょく":["労力"],"ろうむ":["労務"],"ろうくみ":["労組"],"ろうそ":["労組"],"きく":["聞く","聴く","効く","菊"],"きいた":["聞いた","聴いた","効いた"],"きかない":["聞かない","聴かない","効かない"],"きき":["聞き","危機","聴き","機器","効き"],"きいて":["聞いて","聴いて","効いて"],"きける":["聞ける","聴ける","効ける"],"きかれる":["聞かれる","聴かれる","効かれる"],"こうか":["効果","高価","硬化"],"こうかてき":["効果的"],"こうりつてき":["効率的"],"こうよう":["紅葉","効用","高揚"],"こうのう":["効能"],"ぼっぱつ":["勃発"],"ゆうき":["勇気","有機"],"ゆうしゃ":["勇者"],"べんきょう":["勉強"],"べんきょうちゅう":["勉強中"],"べんきょうかい":["勉強会"],"うごかす":["動かす"],"うごかした":["動かした"],"うごかさない":["動かさない"],"うごかし":["動かし"],"うごかして":["動かして"],"うごかせる":["動かせる"],"うごかされる":["動かされる"],"うごき":["動き","動き"],"うごきだす":["動き出す"],"うごきだした":["動き出した"],"うごきださない":["動き出さない"],"うごきだし":["動き出し"],"うごきだして":["動き出して"],"うごきだせる":["動き出せる"],"うごきだされる":["動き出される"],"うごく":["動く"],"うごいた":["動いた"],"うごかない":["動かない"],"うごいて":["動いて"],"うごける":["動ける"],"うごかれる":["動かれる"],"どうさ":["動作"],"どうりょく":["動力"],"どうこう":["動向","同行"],"どういん":["動員"],"どうよう":["同様","動揺","童謡"],"どうしょくぶつ":["動植物"],"どうき":["同期","動機"],"どうぶつ":["動物"],"どうぶつえん":["動物園"],"どうが":["動画"],"どうてき":["動的"],"かんじょう":["感情","勘定"],"かんべん":["勘弁"],"かんちがい":["勘違い"],"つとめる":["務める","勤める"],"つとめた":["務めた","勤めた"],"つとめない":["務めない","勤めない"],"つとめ":["務め","勤め","勤め"],"つとめれる":["務めれる","勤めれる"],"つとめられる":["務められる","勤められる"],"がち":["勝ち"],"かちぐみ":["勝ち組"],"かちまけ":["勝ち負け"],"かちこし":["勝ち越し"],"かちうま":["勝ち馬"],"かった":["買った","勝った","飼った"],"かたない":["勝たない"],"かって":["勝手","買って","勝って","飼って"],"かてる":["勝てる"],"かたれる":["語れる","勝たれる"],"まさる":["勝る"],"まさった":["勝った"],"まさらない":["勝らない"],"まさり":["勝り"],"まさって":["勝って"],"まされる":["増される","勝れる"],"まさられる":["勝られる"],"しょうり":["勝利"],"かってに":["勝手に"],"かってきまま":["勝手気まま"],"しょうはい":["勝敗"],"しょうりつ":["勝率"],"しょうしゃ":["勝者","商社"],"しょうぶ":["勝負","菖蒲"],"ぼきん":["募金"],"ぼしゅう":["募集"],"いきおい":["勢い","勢"],"はずみ":["勢"],"せいりょく":["勢力"],"きんむ":["勤務"],"きんむさき":["勤務先"],"すすめ":["勧め","薦め","進め","奨め"],"かんこく":["韓国","勧告"],"かんゆう":["勧誘"],"もったいない":["勿体無い","勿体ない"],"もったいなかった":["勿体無かった","勿体なかった"],"もったいなくない":["勿体無くない","勿体なくない"],"もったいなくて":["勿体無くて","勿体なくて"],"におい":["匂い","臭い"],"つつみ":["堤","包み","包み"],"くるむ":["包む"],"くるんだ":["包んだ"],"くるまない":["包まない"],"くるみ":["包み","胡桃"],"くるんで":["包んで"],"くるまれる":["包まれる"],"つつむ":["包む"],"つつんだ":["包んだ"],"つつまない":["包まない"],"つつんで":["包んで"],"つつまれる":["包まれる"],"ほうちょう":["包丁"],"ほうそう":["放送","包装"],"かする":["化する"],"かがく":["科学","化学"],"ばけがく":["化学"],"ばけもの":["化物"],"かせき":["化石"],"けしょう":["化粧"],"けそう":["化粧"],"けわい":["化粧"],"けしょうひん":["化粧品"],"けしょうすい":["化粧水"],"けしょうみず":["化粧水"],"きた":["北","着た"],"ほくじょう":["北上"],"きたきゅうしゅう":["北九州"],"ぺきん":["北京"],"きたがわ":["北側"],"ほくそく":["北側"],"きたぐち":["北口"],"きたぐに":["北国"],"ほっこく":["北国"],"ほっぽう":["北方"],"きたちょうせん":["北朝鮮"],"きたひがし":["北東"],"ほくとう":["北東"],"ほくおう":["北欧"],"ほっかいどう":["北海道"],"ほくべい":["北米"],"ほくぶ":["北部"],"ほくりく":["北陸"],"きたかぜ":["北風"],"ほくふう":["北風"],"たくみ":["工","匠","巧み"],"き":["木","気","記","生","き","匹","機","期","城","鬼","器","樹","黄","基","着","貴","己","季","紀","奇","柵","葱"],"ひき":["匹","引き","引き","弾き","弾き","悲喜"],"ひってき":["匹敵"],"くない":["区内"],"くぎり":["区切り"],"くべつ":["区別"],"くやくしょ":["区役所"],"くかん":["区間"],"くすし":["医","薬師"],"いがく":["医学"],"いがくぶ":["医学部"],"いし":["石","医師","椅子","意思","意志"],"いりょう":["医療","衣料"],"いりょうほけん":["医療保険"],"いりょうせいど":["医療制度"],"いりょうひ":["医療費"],"いしゃ":["医者"],"いしゃさん":["医者さん"],"いやくひん":["医薬品"],"いいん":["委員","医院"],"とくめい":["匿名"],"とお":["十","遠"],"じゅういち":["十一"],"じゅうさん":["十三"],"じゅうに":["十二"],"じゅうご":["十五"],"じゅうごや":["十五夜"],"じゅうはち":["十八"],"じゅうろく":["十六"],"じっぷん":["十分"],"じゅっぷん":["十分"],"じゅうねん":["十年"],"じゅうすう":["十数"],"せんばん":["千万"],"せんまん":["千万"],"ちよろず":["千万"],"ちよ":["千代"],"せんえん":["１０００円","千円"],"せんぎり":["千切り"],"せんじん":["千尋"],"ちひろ":["千尋"],"せんねん":["専念","千年"],"ちとせ":["千年","千歳"],"せんしゅうらく":["千秋楽"],"ちば":["千葉"],"ちばけん":["千葉県"],"せんり":["千里"],"ちどり":["千鳥"],"ごぜん":["午前"],"ごぜんちゅう":["午前中"],"ごご":["午後"],"なかば":["半ば"],"はんせいき":["半世紀"],"はんぶん":["半分"],"はんぷん":["半分"],"はんとう":["半島"],"はんとし":["半年"],"はんねん":["半年"],"はんじつ":["半日"],"はんにち":["半日","反日"],"はんげつ":["半月"],"はんつき":["半月"],"はんげん":["半減"],"はんじゅく":["半熟"],"はんぱ":["半端"],"はんそで":["半袖"],"はんかく":["半角"],"はんしん":["阪神","半身"],"はんみ":["半身"],"はんがく":["半額"],"ひきょう":["卑怯","秘境"],"そつ":["卒"],"そつぎょう":["卒業"],"そつぎょうしき":["卒業式"],"そつぎょうご":["卒業後"],"そつぎょうせい":["卒業生"],"そつろん":["卒論"],"たく":["宅","卓"],"たっきゅう":["卓球"],"きょうかい":["協会","教会","境界"],"きょうりょく":["協力","強力"],"きょうどうくみあい":["協同組合"],"きょうそうきょく":["協奏曲"],"きょうてい":["競艇","協定"],"きょうちょう":["強調","協調"],"きょうぎ":["競技","協議"],"きょうぎかい":["協議会"],"みなみ":["南"],"みなみあふりか":["南アフリカ"],"なんそく":["南側"],"みなみがわ":["南側"],"なんぼく":["南北"],"みなみぐち":["南口"],"なんこく":["南国"],"なんごく":["南国"],"なんきょく":["南極"],"なんべい":["南米"],"なんせい":["南西"],"みなみにし":["南西"],"なんぶ":["南部"],"なんぷう":["南風"],"はえ":["栄","南風","栄え","映え"],"みなみかぜ":["南風"],"たんなる":["単なる"],"たんに":["単に"],"たんい":["単位"],"たんたい":["単体"],"たんか":["短歌","単価"],"たんぴん":["単品"],"たんどく":["単独"],"たんどくで":["単独で"],"たんぱつ":["単発"],"たんじゅん":["単純"],"たんこうぼん":["単行本"],"たんご":["単語"],"たんちょう":["単調"],"たんしん":["単身"],"たんしんふにん":["単身赴任"],"はく":["泊","着く","博","吐く","履く"],"ばく":["爆","博"],"はかせ":["博士"],"はくし":["博士","白紙"],"はくぶつかん":["博物館"],"はくらんかい":["博覧会"],"うらない":["占い","売らない"],"うらないし":["占い師"],"しめる":["占める"],"しめた":["占めた"],"しめない":["占めない"],"しめて":["占めて"],"しめれる":["占めれる"],"しめられる":["占められる"],"せんきょ":["選挙","占拠"],"せんりょう":["占領"],"うずき":["卯月"],"うつき":["卯月"],"うづき":["卯月"],"しるし":["印","記し"],"いんさつ":["印刷"],"いんしょう":["印象"],"いんしょうてき":["印象的"],"あやうい":["危うい"],"あやうかった":["危うかった"],"あやうくない":["危うくない"],"あやうくて":["危うくて"],"あやうく":["危うく"],"あぶない":["危ない"],"あぶなかった":["危なかった"],"あぶなくない":["危なくない"],"あぶなくて":["危なくて"],"きぐ":["器具","危惧"],"ききいっぱつ":["危機一髪"],"ききかん":["危機感"],"ききかんり":["危機管理"],"きけん":["危険"],"きけんせい":["危険性"],"そっこく":["即刻"],"そっこう":["速攻","即効"],"そくせき":["足跡","即席"],"そくざ":["即座"],"そくざに":["即座に"],"そくじつ":["即日"],"きゃっか":["却下"],"たまご":["卵","玉子"],"たまごやき":["卵焼き"],"おろし":["卸"],"やっかい":["厄介"],"あつ":["厚","圧"],"あつい":["暑い","熱い","厚い"],"あつかった":["暑かった","熱かった","扱った","厚かった"],"あつくない":["暑くない","熱くない","厚くない"],"あつくて":["暑くて","熱くて","厚くて"],"あつさ":["暑さ","厚さ"],"あつみ":["厚み"],"こうろうしょう":["厚労省"],"こうせいろうどうしょう":["厚生労働省"],"こうせいねんきん":["厚生年金"],"ともがら":["原","輩"],"はら":["腹","原"],"げんさく":["原作"],"げんさくしゃ":["原作者"],"げんそく":["原則"],"げんどうりょく":["原動力"],"げんこく":["原告"],"げんいん":["原因"],"げんいんふめい":["原因不明"],"げんけい":["原型"],"げんしりょく":["原子力"],"げんぶん":["原文"],"げんりょう":["減量","原料"],"げんざいりょう":["原材料"],"げんゆ":["原油"],"げんてん":["原点"],"げんばく":["原爆"],"げんり":["原理"],"げんさん":["原産"],"げんぱつ":["原発"],"げんこう":["原稿","現行"],"げんだい":["現代","原題"],"くりや":["厨"],"ちゅうぼう":["厨房"],"きゅうしゃ":["厩舎"],"きびしい":["厳しい"],"きびしかった":["厳しかった"],"きびしくない":["厳しくない"],"きびしくて":["厳しくて"],"きびしさ":["厳しさ"],"げんみつ":["厳密"],"げんきん":["現金","厳禁"],"げんせん":["厳選","源泉"],"げんじゅう":["厳重"],"さる":["猿","去る","申"],"さった":["去った"],"さらない":["去らない"],"さり":["去り"],"さって":["去って"],"される":["去れる"],"さられる":["去られる"],"きょねん":["去年"],"こぞ":["去年"],"まいった":["参った"],"さんじょう":["参上"],"さんにゅう":["参入"],"さんか":["参加","酸化"],"さんかしゃ":["参加者"],"さんかひ":["参加費"],"さんせん":["参戦"],"さんぱい":["参拝","惨敗"],"さんしょう":["参照","山椒"],"さんこう":["参考","山行"],"さんこうになる":["参考になる"],"さんこうになった":["参考になった"],"さんこうにならない":["参考にならない"],"さんこうになり":["参考になり"],"さんこうになって":["参考になって"],"さんこうになれる":["参考になれる"],"さんこうになられる":["参考になられる"],"さんこうしょ":["参考書"],"さんかん":["参観","山間"],"さんぎいん":["参議院"],"さんぎいんせんきょ":["参議院選挙"],"さんどう":["山道","賛同","参道"],"さんいん":["参院","山陰"],"さんいんせん":["参院選"],"また":["又","股","復"],"または":["又は"],"およばない":["及ばない","及ばない"],"および":["指","及び","及び"],"およぶ":["及ぶ"],"およんだ":["及んだ"],"およんで":["及んで"],"およめる":["及める"],"およばれる":["及ばれる"],"およぼす":["及ぼす"],"およぼした":["及ぼした"],"およぼさない":["及ぼさない"],"およぼし":["及ぼし"],"およぼして":["及ぼして"],"およぼせる":["及ぼせる"],"およぼされる":["及ぼされる"],"ともだち":["友達","友だち"],"ゆうじん":["友人"],"ゆうこう":["有効","友好"],"ゆうじょう":["友情"],"そうほう":["双方"],"ふたば":["双葉"],"はんする":["反する"],"はんそく":["反則","販促"],"はんどう":["反動"],"はんたい":["反対"],"はんたいがわ":["反対側"],"はんしゃ":["反射"],"はんのう":["反応"],"はんせん":["反戦"],"はんげき":["反撃"],"はんえい":["反映","繁栄"],"はんぱつ":["反発"],"はんせい":["反省"],"はんせいかい":["反省会"],"はんろん":["反論"],"はんてん":["飯店","反転"],"はんぎゃく":["反逆"],"はんめん":["反面"],"はんきょう":["反響"],"おさまる":["収まる"],"おさまった":["収まった"],"おさまらない":["収まらない"],"おさまり":["収まり"],"おさまって":["収まって"],"おさまれる":["収まれる"],"おさまられる":["収まられる"],"しゅうにゅう":["収入"],"しゅうよう":["収容"],"しゅうし":["終始","収支"],"しゅうりつ":["収率"],"しゅうえき":["収益"],"しゅうかく":["収穫"],"しゅうのう":["収納"],"しゅうろく":["収録"],"しゅうしゅう":["収集"],"おば":["祖母","叔母"],"しゅくぼ":["叔母"],"おじ":["祖父","叔父"],"しゅくふ":["叔父"],"とりあえず":["取りあえず","取り敢えず"],"とりあげる":["取り上げる"],"とりあげた":["取り上げた"],"とりあげない":["取り上げない"],"とりあげ":["取り上げ"],"とりあげて":["取り上げて"],"とりあげれる":["取り上げれる"],"とりあげられる":["取り上げられる"],"とりつけ":["取り付け"],"とりだす":["取り出す"],"とりだした":["取り出した"],"とりださない":["取り出さない"],"とりだし":["取り出し"],"とりだして":["取り出して"],"とりだせる":["取り出せる"],"とりだされる":["取り出される"],"とりあい":["取り合い"],"とりまく":["取り巻く"],"とりまいた":["取り巻いた"],"とりまかない":["取り巻かない"],"とりまき":["取り巻き"],"とりまいて":["取り巻いて"],"とりまける":["取り巻ける"],"とりまかれる":["取り巻かれる"],"とりいそぎ":["取り急ぎ"],"とりもどす":["取り戻す"],"とりもどした":["取り戻した"],"とりもどさない":["取り戻さない"],"とりもどし":["取り戻し"],"とりもどして":["取り戻して"],"とりもどせる":["取り戻せる"],"とりもどされる":["取り戻される"],"とりあつかい":["取り扱い","取扱"],"とりかた":["取り方"],"とりくみ":["取り組み","取り組み"],"とりくむ":["取り組む"],"とりくんだ":["取り組んだ"],"とりくまない":["取り組まない"],"とりくんで":["取り組んで"],"とりくまれる":["取り組まれる"],"とれた":["取れた","撮れた"],"とれない":["取れない","撮れない"],"とれ":["取れ","撮れ"],"とれて":["取れて","撮れて"],"とれれる":["取れれる","撮れれる"],"とれられる":["取れられる","撮れられる"],"とりひき":["取引"],"とりひきさき":["取引先"],"しゅとく":["取得"],"とりえ":["取得"],"しゅざい":["取材"],"とりしまりやく":["取締役"],"じゅ":["受"],"うけ":["受け","受け"],"うける":["受ける","浮ける"],"うけた":["受けた"],"うけない":["受けない"],"うけて":["受けて"],"うけれる":["受けれる"],"うけられる":["受けられる"],"うけいれ":["受け入れ","受け入れ"],"うけいれる":["受け入れる"],"うけいれた":["受け入れた"],"うけいれない":["受け入れない"],"うけいれて":["受け入れて"],"うけいれれる":["受け入れれる"],"うけいれられる":["受け入れられる"],"うけとり":["受け取り","受け取り"],"うけとる":["受け取る"],"うけとった":["受け取った"],"うけとらない":["受け取らない"],"うけとって":["受け取って"],"うけとれる":["受け取れる"],"うけとられる":["受け取られる"],"うけとめる":["受け止める"],"うけとめた":["受け止めた"],"うけとめない":["受け止めない"],"うけとめ":["受け止め"],"うけとめて":["受け止めて"],"うけとめれる":["受け止めれる"],"うけとめられる":["受け止められる"],"うけつけ":["受付"],"うけつけちゅう":["受付中"],"じゅしん":["受信","受診"],"じゅちゅう":["受注"],"じゅこう":["受講"],"じゅこうせい":["受講生"],"じゅしょう":["受賞"],"じゅけん":["受験"],"じゅけんべんきょう":["受験勉強"],"じゅけんせい":["受験生"],"くち":["口"],"くちに":["口に"],"くちにする":["口にする"],"くちこみ":["口コミ"],"くちもと":["口元"],"こうじつ":["口実"],"こうざ":["講座","口座"],"くちぐせ":["口癖"],"くちょう":["口調"],"いにしえ":["古"],"ふるい":["古い"],"ふるかった":["古かった"],"ふるくない":["古くない"],"ふるくて":["古くて"],"ふるく":["古く"],"ここん":["古今"],"こだい":["古代"],"こふん":["古墳"],"ふるかわ":["古川"],"こほん":["古本"],"ふるほん":["古本"],"ふるぼん":["古本"],"ふるほんや":["古本屋"],"こらい":["古来"],"ふるぎ":["古着"],"たたき":["叩き","叩き"],"はたき":["叩き","叩き"],"たたく":["叩く"],"たたいた":["叩いた"],"たたかない":["叩かない"],"たたいて":["叩いて"],"たたける":["叩ける"],"たたかれる":["叩かれる"],"はたく":["叩く"],"はたいた":["叩いた"],"はたかない":["叩かない"],"はたいて":["叩いて"],"はたける":["叩ける"],"はたかれる":["叩かれる"],"ただ":["常","直","唯","只"],"ただなか":["只中"],"しこん":["只今"],"さけび":["叫び","叫び"],"さけぶ":["叫ぶ"],"さけんだ":["叫んだ"],"さけばない":["叫ばない"],"さけんで":["叫んで"],"さけめる":["叫める"],"さけばれる":["叫ばれる"],"しょうしゅう":["召集","消臭"],"かわいそう":["可哀想","可哀相"],"かわいい":["可愛い"],"かわゆい":["可愛い"],"かわいらしい":["可愛らしい"],"かわいらしかった":["可愛らしかった"],"かわいらしくない":["可愛らしくない"],"かわいらしくて":["可愛らしくて"],"かれん":["可憐"],"かけつ":["可決"],"おかしい":["可笑しい"],"おかしかった":["可笑しかった"],"おかしくない":["可笑しくない"],"おかしくて":["可笑しくて"],"かのう":["可能"],"かのうせい":["可能性"],"かのうせいがたかい":["可能性が高い"],"うてな":["台"],"だいば":["台場"],"だいどこ":["台所"],"だいどころ":["台所"],"だいすう":["台数"],"だいほん":["台本"],"たいわん":["台湾"],"だいなし":["台無し"],"たいとう":["台頭"],"たいふう":["台風"],"たいふういっか":["台風一過"],"しじょう":["市場","史上","試乗","至上"],"しせき":["史跡"],"みぎ":["右"],"みぎうえ":["右上"],"みぎした":["右下"],"うそく":["右側"],"みぎがわ":["右側"],"うおうさおう":["右往左往"],"みぎて":["右手"],"うせつ":["右折"],"うよく":["右翼"],"みぎかた":["右肩"],"うのう":["右脳"],"うわん":["右腕"],"みぎうで":["右腕"],"みぎあし":["右足"],"かなう":["叶う"],"かなった":["叶った"],"かなわない":["叶わない"],"かない":["叶い","家内"],"かなって":["叶って"],"かなえる":["叶える","叶える"],"かなわれる":["叶われる"],"かなえた":["叶えた"],"かなえない":["叶えない"],"かなえ":["叶え"],"かなえて":["叶えて"],"かなえれる":["叶えれる"],"かなえられる":["叶えられる"],"ごうがい":["号外"],"ごうきゅう":["号泣"],"ごうかん":["号館"],"しかい":["司会","視界"],"しかいしゃ":["司会者"],"しほう":["司法","四方"],"しほうしょし":["司法書士"],"しば":["柴","芝","司馬"],"きっきょう":["吃驚"],"おのおの":["各","各々"],"かく":["書く","各","客","描く","画","角","核","格","殻","確"],"それぞれ":["各々"],"かくこく":["各国"],"かっこく":["各国"],"かくち":["各地"],"かくしょ":["各所"],"かくしゃ":["各社"],"かくしゅ":["各種"],"かくじ":["各自"],"あわせ":["合わせ","合わせ"],"あわせる":["合わせる"],"あわせた":["合わせた"],"あわせない":["合わせない"],"あわせれる":["合わせれる"],"あわせられる":["合わせられる"],"ごうこん":["合コン"],"がったい":["合体"],"がっぺい":["合併"],"ごうへい":["合併"],"ごうどう":["合同"],"がっしょう":["合唱","合掌"],"がっしょうだん":["合唱団"],"あいず":["合図"],"がっそう":["合奏"],"がっしゅく":["合宿"],"ごうい":["合意"],"ごうせい":["合成"],"かっせん":["合戦"],"ごうかく":["合格"],"ごうりゅう":["合流"],"ごうり":["合理"],"ごうりてき":["合理的"],"がっしゅうこく":["合衆国"],"あいことば":["合言葉"],"ごうけい":["合計"],"あいま":["合間"],"きつ":["吉","狐"],"きっちょう":["吉兆"],"きちじつ":["吉日"],"きちにち":["吉日"],"きちじょう":["吉祥"],"きっしょう":["吉祥"],"おないどし":["同い年"],"おんなじ":["同じ"],"おなじくらい":["同じくらい"],"おなじよう":["同じよう","同じ様"],"おなじとし":["同じ年"],"おなじどし":["同じ年"],"どういつ":["同一"],"どうせだい":["同世代"],"どうじん":["同人"],"どうにん":["同人"],"どうじんし":["同人誌"],"どうはん":["同伴"],"どうりょう":["同僚"],"どうみょう":["同名"],"どうめい":["同盟","同名"],"どうし":["同士","同志"],"どうこうかい":["同好会"],"どうきょ":["同居"],"どうきょにん":["同居人"],"どうねん":["同年"],"どうねんだい":["同年代"],"どうじょう":["道場","同情"],"どうい":["同意"],"どうかん":["同感"],"どうじつ":["同日"],"どうじ":["同時"],"どうじに":["同時に"],"どうせい":["同棲"],"どうぎょうしゃ":["同業者"],"どうように":["同様に"],"どうてん":["同点"],"どうぜん":["同然"],"どうしゃ":["同社"],"どうそうかい":["同窓会"],"どうとう":["同等"],"どうきゅうせい":["同級生"],"どうぎょう":["同行"],"どうきょう":["同郷"],"なのる":["名乗る"],"なのった":["名乗った"],"なのらない":["名乗らない"],"なのり":["名乗り"],"なのって":["名乗って"],"なのれる":["名乗れる"],"なのられる":["名乗られる"],"めいじん":["名人"],"めいさく":["名作"],"めいし":["名刺"],"なまえ":["名前"],"なごや":["名古屋"],"めいてん":["名店"],"めいしょ":["名所"],"めいきょく":["名曲"],"めいげつ":["名月"],"なごり":["名残"],"ななし":["名無し"],"めいぶつ":["名物"],"めいさん":["名産"],"めいばん":["名盤"],"みょうもく":["名目"],"めいもく":["名目"],"めいしょう":["名称"],"めいぼ":["名簿"],"めいぎ":["名義"],"めいげん":["名言","明言"],"めいよ":["名誉"],"めいかん":["名鑑"],"めいもん":["名門"],"はきけ":["吐き気"],"はいた":["着いた","吐いた","履いた"],"はかない":["着かない","吐かない","履かない"],"はき":["着き","吐き","履き"],"はいて":["着いて","吐いて","履いて"],"はける":["着ける","吐ける","履ける"],"はかれる":["着かれる","図れる","吐かれる","履かれる"],"むいている":["向いている"],"むかう":["向かう","向う"],"むかい":["向かい","向かい"],"むかった":["向かった"],"むかわない":["向かわない"],"むかって":["向かって"],"むかえる":["向かえる","迎える"],"むかわれる":["向かわれる"],"むき":["向き","向き"],"むきあう":["向き合う"],"むきあった":["向き合った"],"むきあわない":["向き合わない"],"むきあい":["向き合い"],"むきあって":["向き合って"],"むきあえる":["向き合える"],"むきあわれる":["向き合われる"],"むく":["向く","無垢"],"むいた":["向いた"],"むかない":["向かない"],"むいて":["向いて"],"むける":["向ける","向ける"],"むかれる":["向かれる"],"むけ":["向け","向け"],"むけた":["向けた"],"むけない":["向けない"],"むけて":["向けて"],"むけれる":["向けれる"],"むけられる":["向けられる"],"むこう":["向こう","無効"],"むこうがわ":["向こう側"],"こうじょう":["工場","向上"],"ひまわり":["向日葵"],"くん":["君"],"きみたち":["君たち","君達"],"きんだち":["君達"],"ぎんみ":["吟味"],"ほえる":["吠える"],"ほえた":["吠えた"],"ほえない":["吠えない"],"ほえ":["吠え"],"ほえて":["吠えて"],"ほえれる":["吠えれる"],"ほえられる":["吠えられる"],"いいえ":["否"],"いいや":["否"],"いえ":["家","否"],"いな":["否"],"ひ":["日","火","非","費","陽","氷","比","否","飛","被","灯","妃","緋","悲"],"いなか":["田舎","否か"],"いなめない":["否めない"],"ひてい":["否定"],"ひていてき":["否定的"],"ふくまれる":["含まれる","含まれる"],"ふくまれた":["含まれた"],"ふくまれない":["含まれない"],"ふくまれ":["含まれ"],"ふくまれて":["含まれて"],"ふくまれれる":["含まれれる"],"ふくまれられる":["含まれられる"],"ふくみ":["含み","含み"],"くくむ":["含む"],"くくんだ":["含んだ"],"くくまない":["含まない"],"くくみ":["含み"],"くくんで":["含んで"],"くくまれる":["含まれる"],"ふくむ":["含む"],"ふくんだ":["含んだ"],"ふくまない":["含まない"],"ふくんで":["含んで"],"すう":["数","吸う"],"すった":["吸った"],"すわない":["吸わない"],"すい":["水","粋","吸い"],"すって":["吸って"],"すえる":["吸える"],"すわれる":["座れる","吸われる"],"きゅういん":["吸引"],"ふきかえ":["吹き替え"],"ふいた":["吹いた"],"ふかない":["吹かない"],"ふき":["吹き"],"ふいて":["吹いて"],"ふける":["吹ける"],"ふかれる":["吹かれる"],"すいそうがく":["吹奏楽"],"ふぶき":["吹雪"],"あれ":["彼","我","荒れ","吾"],"わぬ":["我","吾"],"あずま":["東","吾妻"],"あづま":["東","吾妻"],"りょ":["呂"],"ぼうぜん":["呆然"],"つげる":["告げる","注げる","次げる","継げる"],"つげた":["告げた"],"つげない":["告げない"],"つげ":["告げ"],"つげて":["告げて"],"つげれる":["告げれる"],"つげられる":["告げられる"],"こくはつ":["告発","黒髪"],"こくはく":["告白"],"こくち":["告知"],"のむ":["飲む","呑む"],"のんだ":["飲んだ","呑んだ"],"のまない":["飲まない","呑まない"],"のんで":["飲んで","呑んで"],"のまれる":["飲まれる","呑まれる"],"つぶやき":["呟き"],"ぐるり":["周"],"しゅう":["集","週","州","周","臭","宗","洲","秀","衆"],"まわり":["周り","回り","回り","廻り"],"まわりのひと":["周りの人"],"しゅうかい":["集会","周回"],"しゅうい":["周囲"],"しゅうねん":["周年","執念"],"しゅうき":["秋季","周期"],"しゅうち":["周知"],"しゅうへん":["周辺"],"しゅうへんきき":["周辺機器"],"のろい":["呪い","鈍い"],"まじない":["呪い"],"じゅもん":["呪文"],"あじわい":["味わい","味わい"],"あじわう":["味わう"],"あじわった":["味わった"],"あじわわない":["味わわない"],"あじわって":["味わって"],"あじわえる":["味わえる"],"あじわわれる":["味わわれる"],"あじつけ":["味付け"],"みそしる":["味噌汁"],"みかた":["味方","見方"],"あじみ":["味見"],"みかく":["味覚"],"よばれる":["呼ばれる","呼ばれる"],"よばれた":["呼ばれた"],"よばれない":["呼ばれない"],"よばれ":["呼ばれ"],"よばれて":["呼ばれて"],"よばれれる":["呼ばれれる"],"よばれられる":["呼ばれられる"],"よびかけ":["呼びかけ"],"よびだし":["呼び出し"],"よびな":["呼び名"],"よびかた":["呼び方"],"よぶ":["呼ぶ"],"よんだ":["読んだ","呼んだ"],"よばない":["呼ばない"],"よんで":["読んで","呼んで"],"よめる":["呼める"],"こきゅう":["呼吸"],"いのち":["命"],"みこと":["命","命","尊"],"みょう":["命","妙","明"],"めいれい":["命令"],"めいめい":["命名"],"めいにち":["命日"],"やわ":["和","夜話"],"なごむ":["和む"],"なごんだ":["和んだ"],"なごまない":["和まない"],"なごみ":["和み"],"なごんで":["和んで"],"なごまれる":["和まれる"],"なごやか":["和やか"],"わしつ":["和室"],"わふく":["和服"],"わかやまけん":["和歌山県"],"わえい":["和英"],"わがし":["和菓子"],"わかい":["若い","和解"],"わげ":["和解"],"わふう":["和風"],"わしょく":["和食"],"さかせる":["咲かせる"],"さかせた":["咲かせた"],"さかせない":["咲かせない"],"さかせ":["咲かせ"],"さかせて":["咲かせて"],"さかせれる":["咲かせれる"],"さかせられる":["咲かせられる"],"さいた":["咲いた","最多"],"さかない":["咲かない"],"さいて":["咲いて"],"さける":["咲ける","避ける"],"さかれる":["咲かれる"],"しわぶき":["咳"],"せき":["席","関","咳"],"かなしい":["悲しい","哀しい"],"あわれ":["哀れ"],"あいしゅう":["哀愁"],"あいらく":["哀楽"],"しな":["品","科","支那"],"ひん":["品","貧"],"しなぎれ":["品切れ"],"しなぞろえ":["品揃え"],"ひんかく":["品格"],"しなもの":["品物"],"ひんしゅ":["品種"],"ひんしつ":["品質"],"てつがく":["哲学"],"うた":["歌","詩","唄"],"うたう":["唄う"],"うたった":["唄った"],"うたわない":["唄わない"],"うたい":["唄い"],"うたって":["唄って"],"うたえる":["唄える"],"うたわれる":["唄われる"],"くちびる":["唇"],"からあげ":["唐揚げ"],"とうとつ":["唐突"],"とうがらし":["唐辛子"],"とんがらし":["唐辛子"],"あぜん":["唖然"],"ゆいいつ":["唯一"],"ゆいつ":["唯一"],"となえる":["唱える"],"となえた":["唱えた"],"となえない":["唱えない"],"となえ":["唱え"],"となえて":["唱えて"],"となえれる":["唱えれる"],"となえられる":["唱えられる"],"しょうじ":["精進","生じ","小路","商事"],"あきうど":["商人"],"あきびと":["商人"],"あきゅうど":["商人"],"あきんど":["商人"],"しょうにん":["承認","商人","証人"],"しょうかい":["紹介","商会"],"しょうひん":["商品","賞品"],"しょうひんけん":["商品券"],"しょうひんめい":["商品名"],"しょうばい":["商売"],"しょうこう":["商工","消耗"],"しょうこうかいぎしょ":["商工会議所"],"しょうてん":["商店","焦点"],"しょうてんがい":["商店街"],"しょうぎょう":["商業"],"しょうひょう":["商標"],"しょうほう":["商法"],"とい":["問","問い","問い"],"もん":["物","文","門","問","紋"],"といあわせ":["問い合わせ","問合せ"],"とうた":["問うた"],"とわない":["問わない"],"とうて":["問うて"],"とえる":["問える"],"とわれる":["問われる"],"とわず":["問わず"],"といや":["問屋"],"とんや":["問屋"],"もんどう":["問答"],"もんだい":["問題"],"もんだいてん":["問題点"],"もんだいかいけつ":["問題解決"],"もんだいしゅう":["問題集"],"けいはつ":["啓発"],"ぜんい":["善意"],"のど":["喉"],"のみと":["喉"],"のみど":["喉"],"のんど":["喉"],"しゃべり":["喋り","喋り"],"しゃべる":["喋る"],"しゃべった":["喋った"],"しゃべらない":["喋らない"],"しゃべって":["喋って"],"しゃべれる":["喋れる"],"しゃべられる":["喋られる"],"ぜんそく":["喘息"],"よろこばしい":["喜ばしい"],"よろこばしかった":["喜ばしかった"],"よろこばしくない":["喜ばしくない"],"よろこばしくて":["喜ばしくて"],"よろこび":["喜び","喜び"],"よろこぶ":["喜ぶ"],"よろこんだ":["喜んだ"],"よろこばない":["喜ばない"],"よろこんで":["喜んで","喜んで"],"よろこめる":["喜める"],"よろこばれる":["喜ばれる"],"きげき":["喜劇"],"きどあいらく":["喜怒哀楽"],"けんか":["喧嘩"],"そうしつ":["喪失","消失"],"きつえん":["喫煙"],"きっさ":["喫茶"],"きっさてん":["喫茶店"],"いとなみ":["営み"],"えいり":["営利"],"えいぎょう":["営業"],"えいぎょうまん":["営業マン"],"えいぎょうちゅう":["営業中"],"えいぎょうしょ":["営業所"],"えいぎょうじかん":["営業時間"],"しこう":["思考","試行","施工","志向","施行","嗜好"],"なげき":["嘆き"],"おうと":["首","嘔吐"],"うそつき":["嘘つき"],"うわさ":["噂"],"うつわ":["器"],"きよう":["器用","起用"],"ふんしゅつ":["噴出"],"ふんすい":["噴水"],"はやし":["林","囃子"],"よん":["四"],"よっつ":["４つ","四つ"],"よたり":["四人"],"よったり":["四人"],"よにん":["四人"],"しじゅう":["四十","始終"],"よんじゅう":["四十"],"しこく":["四国"],"しき":["色","式","四季","職","若き","如き","指揮"],"しきおりおり":["四季折々"],"しせん":["視線","四川"],"よも":["四方"],"よもやまばなし":["四方山話"],"よっか":["４日","四日"],"しがつ":["４月","四月"],"しきゅう":["支給","四球","子宮"],"しく":["若く","如く","四苦"],"しくはっく":["四苦八苦"],"しかくい":["四角い"],"しかくかった":["四角かった"],"しかくくない":["四角くない"],"しかくくて":["四角くて"],"まわし":["回し","回し"],"まわす":["回す"],"まわした":["回した"],"まわさない":["回さない"],"まわして":["回して"],"まわせる":["回せる"],"まわされる":["回される"],"まわる":["回る"],"まわった":["回った"],"まわらない":["回らない"],"まわって":["回って"],"まわれる":["回れる","舞われる"],"まわられる":["回られる"],"みた":["見た","観た","回た"],"みない":["見ない","観ない","回ない"],"みて":["見て","観て","回て"],"みれる":["見れる","観れる","見れる","回れる"],"みられる":["見られる","観られる","回られる"],"めぐる":["回る","巡る"],"めぐった":["回った","巡った"],"めぐらない":["回らない","巡らない"],"めぐり":["巡り","回り","巡り","廻り"],"めぐって":["回って","巡って"],"めぐれる":["回れる","巡れる"],"めぐられる":["回られる","巡られる"],"もとおる":["回る"],"もとおった":["回った"],"もとおらない":["回らない"],"もとおり":["回り"],"もとおって":["回って"],"もとおれる":["回れる"],"もとおられる":["回られる"],"かいしゅう":["回収","改修"],"かいろう":["回廊"],"かいふく":["回復"],"かいそう":["改装","回想"],"かいせん":["回戦","回線"],"かいすう":["回数"],"かいせい":["改正","快晴","回生"],"かいめ":["回目"],"かいとう":["回答","解答","解凍"],"かいてん":["回転","開店"],"かいてんずし":["回転寿司"],"かいこ":["解雇","回顧"],"かいころく":["回顧録"],"ちなみに":["因みに"],"いんが":["因果"],"いんえん":["因縁"],"いんねん":["因縁"],"だん":["弾","団","段","断"],"だんたい":["団体"],"だんいん":["団員"],"だんち":["団地"],"だんかい":["段階","団塊"],"だんかいのせだい":["団塊の世代"],"だんかいせだい":["団塊世代"],"だんご":["団子"],"だんけつ":["団結"],"だんちょう":["団長"],"こまる":["困る"],"こまった":["困った"],"こまらない":["困らない"],"こまり":["困り"],"こまって":["困って"],"こまれる":["困れる","混まれる"],"こまられる":["困られる"],"こんわく":["困惑"],"こんなん":["困難"],"かこむ":["囲む"],"かこんだ":["囲んだ"],"かこまない":["囲まない"],"かこみ":["囲み"],"かこんで":["囲んで"],"かこまれる":["囲まれる"],"ず":["頭","図"],"はかる":["図る"],"はかった":["図った"],"はからない":["図らない"],"はかり":["図り"],"はかって":["図って"],"はかられる":["図られる"],"としょ":["図書"],"ずしょかん":["図書館"],"としょかん":["図書館"],"ずかん":["図鑑"],"ずめん":["図面"],"かたい":["硬い","固い","堅い"],"かたかった":["硬かった","固かった","堅かった"],"かたくない":["硬くない","固くない","堅くない"],"かたくて":["硬くて","固くて","堅くて"],"かため":["固め"],"こてい":["固定"],"こゆう":["固有"],"くに":["国"],"くにぐに":["国々"],"こっこう":["国交"],"くにびと":["国人"],"こっかい":["国会"],"こっかいぎいん":["国会議員"],"こくたい":["国体"],"こくさい":["国際","国債"],"こくない":["国内","濃くない"],"こくないがい":["国内外"],"こくないりょこう":["国内旅行"],"こくぶんじ":["国分寺"],"こくえい":["国営"],"こくど":["国土"],"こくどこうつうしょう":["国土交通省"],"くにざかい":["国境"],"こっきょう":["国境"],"こくがい":["国外"],"こくほう":["国宝"],"こっか":["国家"],"こっかしけん":["国家試験"],"こくせい":["国政"],"こっき":["国旗"],"こくみん":["国民"],"こくみんねんきん":["国民年金"],"こくみんとうひょう":["国民投票"],"こくおう":["国王"],"こくさん":["国産"],"こくりつ":["国立"],"こくりつこうえん":["国立公園"],"こくりつはくぶつかん":["国立博物館"],"こくせき":["国籍"],"こくご":["国語"],"こくれん":["国連"],"こくどう":["国道"],"こくてつ":["国鉄"],"こくぼう":["国防"],"こくさいこうりゅう":["国際交流"],"こくさいてき":["国際的"],"こくさいしゃかい":["国際社会"],"こくさいくうこう":["国際空港"],"こくさいけっこん":["国際結婚"],"けんない":["県内","圏内"],"えんじ":["演じ","園児"],"えんない":["園内"],"えんげい":["園芸"],"えんちょう":["延長","園長"],"つち":["土"],"どひょう":["土俵"],"どだい":["土台"],"とち":["土地"],"どじょう":["土壌"],"どて":["土手"],"どにち":["土日"],"どよう":["土曜","土用"],"どようび":["土曜日"],"どぼく":["土木"],"とさん":["土産"],"どさん":["土産"],"みやげ":["土産"],"どしゃ":["土砂"],"どしゃぶり":["土砂降り"],"あっとう":["圧倒"],"あっとうてき":["圧倒的"],"あつりょく":["圧力"],"あつりょくなべ":["圧力鍋"],"あっしょう":["圧勝"],"あっかん":["圧巻","悪感"],"あっしゅく":["圧縮"],"あっぱく":["圧迫"],"ある":["有る","或る","在る"],"あ*":["有*","在*"],"あり":["有り","有り","在り","蟻"],"あり得る":["有り得る","在り得る"],"ざいじゅう":["在住"],"ざいがく":["在学"],"ざいたく":["在宅"],"ざいこ":["在庫"],"ざいにち":["在日"],"ざいせき":["在籍"],"ちでじ":["地デジ"],"ちじょう":["地上"],"ちじょうは":["地上波"],"ちか":["地下"],"ちかてつ":["地下鉄"],"ちちゅうかい":["地中海"],"ちい":["地位"],"じもと":["地元"],"ちく":["地区"],"ちめい":["地名"],"じみ":["地味"],"ちみ":["地味"],"ちず":["地図"],"ちいき":["地域"],"ちたい":["地帯"],"ちけい":["地形"],"じかた":["地方"],"ちほう":["地方"],"ちほうけいば":["地方競馬"],"ちほうじち":["地方自治"],"ちてん":["地点"],"じごく":["地獄"],"ちきゅう":["地球"],"ちきゅうじょう":["地球上"],"ちきゅうおんだんか":["地球温暖化"],"ちきゅうかんきょう":["地球環境"],"じばん":["地盤"],"じぞう":["地蔵"],"ちさい":["地裁"],"じみち":["地道"],"じざけ":["地酒"],"じらい":["地雷"],"じしん":["自身","地震","自信"],"じめん":["地面"],"じとり":["地鶏"],"じどり":["地鶏"],"さか":["坂","阪"],"さかみち":["坂道"],"きんいち":["均一"],"きんいつ":["均一"],"ぼう":["某","坊","棒","房","望","鵬"],"ぼうさん":["坊さん"],"ぼっちゃん":["坊ちゃん"],"ぼうや":["坊や"],"ぼうず":["坊主"],"たんたん":["淡々","坦々"],"つぼ":["壺","壷","坪"],"たれ":["誰","垂れ"],"たれながし":["垂れ流し"],"すいちょく":["垂直"],"かた":["方","型","形","肩","片","潟"],"がた":["方","型","形"],"あか":["赤","紅","朱","垢"],"ほこり":["誇り","誇り","埃"],"うずめる":["埋める"],"うずめた":["埋めた"],"うずめない":["埋めない"],"うずめ":["埋め"],"うずめて":["埋めて"],"うずめれる":["埋めれる"],"うずめられる":["埋められる"],"うめる":["埋める"],"うめた":["埋めた"],"うめない":["埋めない"],"うめて":["埋めて"],"うめれる":["埋めれる"],"うめられる":["埋められる"],"しつじ":["執事"],"しゅうじゃく":["執着"],"しゅうちゃく":["執着"],"しっぴつ":["執筆"],"しっこう":["執行"],"もとい":["基"],"もとづく":["基づく"],"もとづいた":["基づいた"],"もとづかない":["基づかない"],"もとづき":["基づき"],"もとづいて":["基づいて"],"もとづける":["基づける"],"もとづかれる":["基づかれる"],"きほん":["基本"],"きほんほう":["基本法"],"きほんてき":["基本的"],"きほんてきに":["基本的に"],"きじゅん":["基準"],"きじゅんほう":["基準法"],"きばん":["基盤"],"きそ":["基礎"],"きそちしき":["基礎知識"],"きちょう":["貴重","基調"],"ききん":["基金"],"さいたま":["埼玉"],"さいたまけん":["埼玉県"],"ほり":["堀"],"ほりえ":["堀江"],"どうどう":["堂々"],"けんじつ":["堅実"],"だらく":["堕落"],"ていぼう":["堤防"],"かんのう":["堪能"],"たんのう":["堪能"],"ほう":["方","法","報","鵬","砲"],"ほうこく":["報告"],"ほうこくしょ":["報告書"],"ほうち":["放置","報知"],"ほうどう":["報道"],"ほうしゅう":["報酬"],"じょうない":["場内"],"ばあい":["場合"],"ばあいによって":["場合によって"],"じょうがい":["場外"],"ばしょ":["場所"],"ばめん":["場面"],"とりで":["塁","砦"],"るい":["類","塁"],"かたまり":["塊"],"ぬり":["塗り","塗り"],"ぬる":["塗る"],"ぬった":["塗った"],"ぬらない":["塗らない"],"ぬって":["塗って"],"ぬれる":["塗れる","濡れる"],"ぬられる":["塗られる"],"とそう":["塗装"],"つか":["柄","束","塚"],"えんぶん":["塩分"],"しおあじ":["塩味"],"しおやき":["塩焼き"],"じゅく":["塾"],"じゅくちょう":["塾長"],"さかい":["界","境"],"けいだい":["境内"],"きょうち":["境地"],"きょうかいせん":["境界線"],"きょうぐう":["境遇"],"はか":["墓"],"はかまいり":["墓参り"],"はかち":["墓地"],"ぼち":["点","墓地"],"ふえる":["増える"],"ふえた":["増えた"],"ふえない":["増えない"],"ふえ":["増え","笛"],"ふえて":["増えて"],"ふえれる":["増えれる"],"ふえられる":["増えられる"],"ました":["増した","真下"],"まさない":["増さない"],"まして":["増して"],"ませる":["増せる"],"ふやす":["増やす"],"ふやした":["増やした"],"ふやさない":["増やさない"],"ふやし":["増やし"],"ふやして":["増やして"],"ふやせる":["増やせる"],"ふやされる":["増やされる"],"ぞうか":["増加"],"ぞうだい":["増大"],"ぞうきょう":["増強"],"ぞうしょく":["増殖"],"ぞうぜい":["増税"],"ぞうせつ":["増設"],"ぞうりょう":["増量"],"ついらく":["墜落"],"かべ":["壁"],"へき":["壁"],"かべがみ":["壁紙"],"こわす":["壊す"],"こわした":["壊した"],"こわさない":["壊さない"],"こわし":["壊し"],"こわして":["壊して"],"こわせる":["壊せる"],"こわされる":["壊される"],"こわれた":["壊れた"],"こわれない":["壊れない"],"こわれ":["壊れ"],"こわれて":["壊れて"],"こわれれる":["壊れれる"],"こわれられる":["壊れられる"],"かいめつ":["壊滅"],"そうだい":["壮大"],"そうぜつ":["壮絶"],"こえ":["声","超え","越え"],"こえをかける":["声をかける"],"こえをかけた":["声をかけた"],"こえをかけない":["声をかけない"],"こえをかけ":["声をかけ"],"こえをかけて":["声をかけて"],"こえをかけれる":["声をかけれる"],"こえをかけられる":["声をかけられる"],"せいゆう":["声優"],"せいえん":["声援"],"しょうみょう":["声明"],"せいめい":["生命","声明"],"うり":["売り","売り"],"うりあげ":["売り上げ","売上"],"うりきれ":["売り切れ"],"うりば":["売り場"],"うる":["得る","売る"],"うった":["打った","売った"],"うって":["打って","売って"],"うれる":["売れる","売れる"],"うられる":["売られる"],"うれた":["売れた"],"うれない":["売れない"],"うれ":["末","売れ"],"うれて":["売れて"],"うれれる":["売れれる"],"うれられる":["売れられる"],"うれすじ":["売れ筋"],"ばいきゃく":["売却"],"ばいてん":["売店"],"つふ":["壺","壷"],"つほ":["壺","壷"],"かえ":["替え","変え","換え","変え"],"かえた":["変えた"],"かえない":["変えない"],"かえて":["変えて"],"かえれる":["帰れる","変えれる"],"かえられる":["帰られる","変えられる"],"へんに":["変に"],"かわらなかった":["変わらなかった"],"かわらなくない":["変わらなくない"],"かわらなくて":["変わらなくて"],"かわらぬ":["変わらぬ"],"かわりない":["変わりない"],"かわりめ":["変わり目"],"へんじん":["変人"],"へんどう":["変動"],"へんか":["変化"],"へんげ":["変化"],"へんけい":["変形"],"へんたい":["変態"],"へんかん":["変換","返還"],"へんこう":["変更"],"へんぼう":["変貌"],"へんしん":["変身","返信"],"へんせん":["変遷"],"へんかく":["変革"],"なつ":["夏"],"なつばて":["夏バテ"],"なつやすみ":["夏休み"],"なつば":["夏場"],"なつき":["夏季"],"かじつ":["果実","夏日"],"なつび":["夏日"],"なつまつり":["夏祭り"],"げし":["夏至"],"なつかぜ":["夏風邪"],"しゃく":["夕","尺"],"ゆうべ":["昨夜","夕","夕べ"],"ゆうごはん":["夕ご飯"],"ゆうかん":["有閑","夕刊"],"ゆうこく":["夕刻"],"ゆうがた":["夕方"],"ゆうひ":["夕日","夕陽"],"ゆうけい":["夕景"],"ゆうぐれ":["夕暮れ"],"ゆうやけ":["夕焼け"],"せきよう":["夕陽"],"ゆうしょく":["夕食"],"ゆうしょくご":["夕食後"],"ゆうはん":["夕飯"],"ゆうめし":["夕飯"],"そと":["外"],"はずす":["外す"],"はずした":["外した"],"はずさない":["外さない"],"はずし":["外し"],"はずして":["外して"],"はずせる":["外せる"],"はずされる":["外される"],"はずれ":["外れ","外れ"],"はずれる":["外れる"],"はずれた":["外れた"],"はずれない":["外れない"],"はずれて":["外れて"],"はずれれる":["外れれる"],"はずれられる":["外れられる"],"がいこう":["外交"],"がいじん":["外人"],"がいでん":["外伝"],"がいそく":["外側"],"そとがわ":["外側"],"がいしゅつ":["外出"],"そとで":["外出"],"がいむ":["外務"],"がいむしょう":["外務省"],"がいこく":["外国"],"がいこくじん":["外国人"],"がいこくかわせ":["外国為替"],"がいこくご":["外国語"],"がいへき":["外壁"],"そとかべ":["外壁"],"がいらい":["外来"],"がいしょう":["外相"],"げか":["外科"],"げかい":["外科医"],"がいけん":["外見"],"そとみ":["外見"],"がいかん":["外観"],"がいか":["外貨"],"がいし":["外資"],"がいしけい":["外資系"],"がいぶ":["外部"],"がいや":["外野"],"がいしょく":["外食"],"たた":["多々"],"ふさふさ":["多々"],"おおかった":["多かった"],"おおくない":["多くない"],"おおくて":["多くて"],"おおく":["多く"],"おおすぎる":["多すぎる"],"おおすぎた":["多すぎた"],"おおすぎない":["多すぎない"],"おおすぎ":["多すぎ"],"おおすぎて":["多すぎて"],"おおすぎれる":["多すぎれる"],"おおすぎられる":["多すぎられる"],"たぶん":["多分"],"たこくせき":["多国籍"],"ただい":["多大"],"たしょう":["多少"],"たき":["滝","多岐"],"たさい":["多彩","多才"],"たぼう":["多忙"],"たまがわ":["多摩川"],"たすう":["多数"],"たよう":["多様","多用"],"たはつ":["多発"],"たしゅ":["多種"],"たしゅたよう":["多種多様"],"たにく":["多肉"],"たしゅみ":["多趣味"],"たじゅう":["多重"],"たがく":["多額"],"よる":["夜","寄る"],"よなよな":["夜な夜な"],"やちゅう":["夜中"],"よじゅう":["夜中"],"よなか":["夜中"],"やきん":["夜勤"],"よあけ":["夜明け"],"やけい":["夜景"],"よふかし":["夜更かし"],"よざくら":["夜桜"],"よぞら":["夜空"],"やぎょう":["夜行"],"やこう":["夜行"],"よばなし":["夜話"],"よるおそく":["夜遅く"],"よあそび":["夜遊び"],"よなが":["夜長"],"やかん":["夜間"],"ゆめ":["夢"],"ゆめをみる":["夢を見る"],"ゆめをみた":["夢を見た"],"ゆめをみない":["夢を見ない"],"ゆめをみ":["夢を見"],"ゆめをみて":["夢を見て"],"ゆめをみれる":["夢を見れる"],"ゆめをみられる":["夢を見られる"],"むちゅう":["夢中"],"むげん":["無限","夢幻"],"ゆめまぼろし":["夢幻"],"むそう":["無双","夢想"],"ゆめみ":["夢見","夢見"],"ゆめみる":["夢見る"],"ゆめみた":["夢見た"],"ゆめみない":["夢見ない"],"ゆめみて":["夢見て"],"ゆめみれる":["夢見れる"],"ゆめみられる":["夢見られる"],"おお":["大"],"だいだいてき":["大々的"],"おおいなる":["大いなる"],"おおきい":["大きい"],"おおきかった":["大きかった"],"おおきくない":["大きくない"],"おおきくて":["大きくて"],"おおきく":["大きく"],"おおきさ":["大きさ"],"おおきな":["大きな"],"おおきめ":["大きめ"],"おおげさ":["大げさ","大袈裟"],"おおさじ":["大さじ"],"たいした":["大した"],"たいして":["対して","大して"],"だいの":["大の"],"おおまか":["大まか"],"だいひっと":["大ヒット"],"だいりーぐ":["大リーグ"],"だいじょうぶ":["大丈夫"],"おおごと":["大事"],"だいじ":["大事"],"おとな":["大人"],"たいじん":["大人","退陣","対人"],"だいにん":["大人"],"おとなしい":["大人しい"],"おとなしかった":["大人しかった"],"おとなしくない":["大人しくない"],"おとなしくて":["大人しくて"],"おおにんず":["大人数"],"おおにんずう":["大人数"],"おとなげ":["大人気"],"だいにんき":["大人気"],"おとながい":["大人買い"],"だいきぎょう":["大企業"],"たいかい":["大会","大海"],"たいさ":["大佐"],"たいさく":["対策","大作"],"たいし":["大使"],"たいしかん":["大使館"],"だいぼうけん":["大冒険"],"だいぶん":["大分"],"おおいたけん":["大分県"],"たいせつ":["大切","大雪"],"たいせつに":["大切に"],"たいしょう":["対象","大賞","大正","大将","大勝"],"だいぼしゅう":["大募集"],"おおぜい":["大勢"],"たいぜい":["大勢"],"たいはん":["大半"],"だいそつ":["大卒"],"おおぐち":["大口"],"だいきち":["大吉"],"だいみょう":["大名"],"やまと":["大和"],"おおよろこび":["大喜び"],"たいこく":["大国"],"だいち":["大地"],"おおじしん":["大地震"],"だいじしん":["大地震"],"おおがた":["大型"],"おおがたけん":["大型犬"],"おおごえ":["大声"],"たいへん":["大変"],"だいたすう":["大多数"],"だいしっぱい":["大失敗"],"おおおく":["大奥"],"だいすき":["大好き"],"だいこうぶつ":["大好物"],"だいきらい":["大嫌い"],"だいがく":["大学"],"だいがくきょうじゅ":["大学教授"],"だいがくせい":["大学生"],"だいがくびょういん":["大学病院"],"だいがくいん":["大学院"],"だいがくいんせい":["大学院生"],"おおみや":["大宮"],"おおや":["大家"],"たいか":["大家"],"たいけ":["大家"],"だいかぞく":["大家族"],"だいようりょう":["大容量"],"たいざん":["大山"],"だいく":["大工","第九"],"だいし":["大師"],"おおはば":["大幅"],"おおあたり":["大当たり"],"おおごしょ":["大御所"],"おおいそがし":["大忙し"],"おおいそぎ":["大急ぎ"],"だいせいこう":["大成功"],"たいせん":["対戦","大戦"],"おおて":["大手"],"おおで":["大手"],"たいてい":["大抵"],"おおそうじ":["大掃除"],"たいはい":["大敗"],"おおもじ":["大文字"],"だいもんじ":["大文字"],"おおかた":["大方"],"おおむかし":["大昔"],"おおみそか":["大晦日"],"たいぼく":["大木"],"だいこん":["大根"],"だいこおろし":["大根おろし"],"だいこんおろし":["大根おろし"],"たいがい":["大概"],"たいじゅ":["大樹"],"だいかんげい":["大歓迎"],"たいき":["待機","大気"],"たいがどらま":["大河ドラマ"],"おおうみ":["大海"],"だいばくしょう":["大爆笑"],"おおもの":["大物"],"だいおう":["大王"],"だいせい":["大生"],"おおもり":["大盛り"],"おおずもう":["大相撲"],"おおいし":["大石"],"だいふく":["大福"],"おおぞら":["大空"],"おおわらい":["大笑い"],"おおつぶ":["大粒"],"だいとうりょう":["大統領"],"たいせいどう":["大聖堂"],"だいせいどう":["大聖堂"],"だいたん":["大胆"],"だいじん":["大臣"],"だいしぜん":["大自然"],"おおあれ":["大荒れ"],"おおば":["祖母","大葉"],"たいしゅう":["大衆"],"だいきぼ":["大規模"],"おおづめ":["大詰め"],"だいず":["大豆"],"おおどおり":["大通り"],"おおちがい":["大違い"],"だいぶぶん":["大部分"],"おおの":["大野"],"たいりょう":["大量"],"おおがね":["大金"],"たいきん":["大金"],"おおぜき":["大関"],"おおさか":["大阪"],"おおさかし":["大阪市"],"おおさかふ":["大阪府"],"たいりく":["大陸"],"おおざっぱ":["大雑把"],"おおあめ":["大雨"],"おおゆき":["大雪"],"だいしんさい":["大震災"],"おおぐい":["大食い"],"おおさわぎ":["大騒ぎ"],"たいま":["大麻"],"だいこく":["大黒"],"あめ":["雨","天","飴"],"あまの":["天の"],"あめの":["天の"],"てんぷら":["天ぷら"],"てんか":["天下","添加"],"あまくだり":["天下り"],"てんどん":["天丼"],"てんじょう":["天井"],"てんたい":["天体"],"てんし":["天使"],"てんこう":["天候","転向"],"てんごく":["天国"],"あめつち":["天地"],"てんち":["天地"],"てんせい":["転生","天性"],"てんさい":["天才","転載","天災"],"てんてき":["点滴","天敵"],"てんぶん":["天文"],"てんもん":["天文"],"てんき":["天気","転機"],"てんきよほう":["天気予報"],"てんねん":["天然"],"てんぐ":["天狗"],"てんのう":["天皇","天王"],"すめらぎ":["天皇"],"すめろぎ":["天皇"],"てんのうはい":["天皇杯"],"てんしんらんまん":["天真爛漫"],"てんしん":["天神"],"てんじん":["天神"],"てんくう":["天空"],"ふとい":["太い"],"ふとかった":["太かった"],"ふとくない":["太くない"],"ふとくて":["太くて"],"ふとった":["太った","太った"],"ふともも":["太もも"],"ふとる":["太る"],"ふとらない":["太らない"],"ふとり":["太り"],"ふとって":["太って"],"ふとれる":["太れる"],"ふとられる":["太られる"],"たいへいよう":["太平洋"],"たいへいようせんそう":["太平洋戦争"],"たいきょくけん":["太極拳"],"たろうさん":["太郎さん"],"たいよう":["太陽"],"たいようこう":["太陽光"],"たいようこうはつでん":["太陽光発電"],"たいこ":["太鼓"],"はしかし":["夫人"],"ふじん":["夫人","婦人"],"ぶにん":["夫人","無人"],"ふさい":["夫妻"],"ふうふ":["夫婦"],"みょうと":["夫婦"],"めおと":["夫婦"],"うしなう":["失う"],"うしなった":["失った"],"うしなわない":["失わない"],"うしない":["失い"],"うしなって":["失って"],"うしなえる":["失える"],"うしなわれる":["失われる"],"しつれん":["失恋"],"しったい":["失態"],"しっぱい":["失敗"],"しつぼう":["失望"],"しっかく":["失格"],"しつぎょう":["失業"],"しってん":["失点"],"しつれい":["失礼"],"しつれいしました":["失礼しました"],"しつれいします":["失礼します"],"しつげん":["湿原","失言"],"しっちょう":["失調"],"しっそう":["疾走","失踪"],"しっそく":["失速"],"きみょう":["奇妙"],"きせき":["奇跡","軌跡"],"きせきてき":["奇跡的"],"きれい":["綺麗","奇麗"],"ならけん":["奈良県"],"ほうし":["奉仕"],"ほうのう":["奉納"],"かなでる":["奏でる"],"かなでた":["奏でた"],"かなでない":["奏でない"],"かなで":["奏で"],"かなでて":["奏でて"],"かなでれる":["奏でれる"],"かなでられる":["奏でられる"],"そうしゃ":["奏者","走者"],"けいき":["景気","契機"],"けいやく":["契約"],"けいやくしょ":["契約書"],"ほんぽう":["奔放"],"ほんそう":["奔走"],"おくさん":["奥さん"],"おくさま":["奥様"],"おくふかい":["奥深い"],"おくふかかった":["奥深かった"],"おくふかくない":["奥深くない"],"おくふかくて":["奥深くて"],"おくぶかい":["奥深い"],"おくぶかかった":["奥深かった"],"おくぶかくない":["奥深くない"],"おくぶかくて":["奥深くて"],"うばう":["奪う"],"うばった":["奪った"],"うばわない":["奪わない"],"うばい":["奪い"],"うばって":["奪って"],"うばえる":["奪える"],"うばわれる":["奪われる"],"ふんせん":["奮戦"],"ふんぱつ":["奮発"],"ふんき":["奮起"],"ふんとう":["奮闘"],"おんな":["女"],"おんなのひと":["女の人"],"おんなのこ":["女の子"],"にょにん":["女人"],"じょゆう":["女優"],"じょじ":["女児"],"じょし":["女子","女史"],"おなご":["女子"],"めこ":["女子","女子"],"じょしあな":["女子アナ"],"じょしだいせい":["女子大生"],"じょしこうせい":["女子高生"],"おかみ":["女将"],"じょしょう":["女将","序章"],"にょうぼう":["女房"],"じょりゅう":["女流"],"じょおう":["女王"],"じょしん":["女神"],"めがみ":["女神"],"つぶね":["奴"],"め":["目","奴","眼","芽"],"やっこ":["奴"],"やつこ":["奴"],"どれい":["奴隷"],"いかった":["良かった","怒った","好かった"],"いくない":["良くない","好くない"],"いくて":["良くて","好くて"],"よい":["良い","酔い","酔い","宵","好い"],"よかった":["良かった","好かった"],"よくない":["良くない","好くない"],"よくて":["良くて","好くて"],"すき":["好き","隙","空き"],"ずき":["好き"],"すきなように":["好きなように"],"すきになる":["好きになる"],"すきかって":["好き勝手"],"すききらい":["好き嫌い"],"このみ":["好み","好み","木の実"],"ごのみ":["好み"],"このむ":["好む"],"このんだ":["好んだ"],"このまない":["好まない"],"このんで":["好んで","好んで"],"このまれる":["好まれる"],"こうきしん":["好奇心"],"こうきしんおうせい":["好奇心旺盛"],"こうい":["行為","好意"],"こうとう":["高騰","高等","好投"],"こうぶつ":["好物"],"こうちょう":["好調","校長"],"ごとく":["如く"],"しいた":["若いた","如いた"],"しいて":["若いて","如いて","強いて"],"しける":["若ける","如ける"],"しかれる":["若かれる","如かれる"],"ごとし":["如し"],"いかが":["如何"],"いかん":["如何"],"きさらぎ":["如月"],"じょげつ":["如月"],"きさき":["妃"],"ぼうそう":["妄想","暴走"],"もうそう":["妄想"],"にんしん":["妊娠"],"にんぷ":["妊婦"],"ようかい":["妖怪"],"ようせい":["要請","妖精","養成"],"だきょう":["妥協"],"だとう":["妥当"],"ぼうがい":["妨害"],"いもうと":["妹"],"あね":["姉","姐"],"あねさん":["姉さん","姐さん"],"ねえさん":["姉さん","姐さん"],"ねえちゃん":["姉ちゃん"],"しまい":["姉妹","終い"],"してい":["指定","姉弟"],"はじまらない":["始まらない","始まらない"],"はじまり":["始まり","始まり"],"はじまる":["始まる"],"はじまった":["始まった"],"はじまって":["始まって"],"はじまれる":["始まれる"],"はじまられる":["始まられる"],"はじめる":["始める"],"はじめた":["始めた"],"はじめない":["始めない"],"はじめれる":["始めれる"],"はじめられる":["始められる"],"しどう":["指導","始動"],"しまつ":["始末"],"しぎょう":["施行","始業"],"しはつ":["始発"],"しいとめ":["姑"],"しうとめ":["姑"],"しゅうと":["姑"],"しゅうとめ":["姑"],"いいんかい":["委員会"],"いいんちょう":["委員長"],"いたく":["委託"],"めいっこ":["姪っ子"],"ひめ":["姫"],"ひめさま":["姫様"],"すがた":["姿"],"しせい":["姿勢"],"いりょく":["威力"],"いかく":["威嚇"],"むすめ":["娘"],"むすめさん":["娘さん"],"ごらく":["娯楽"],"ばばあ":["婆"],"こんやく":["婚約"],"ばいたい":["媒体"],"よめ":["嫁"],"よめさん":["嫁さん"],"しっと":["嫉妬"],"きらい":["嫌い","嫌い"],"きらう":["嫌う"],"きらった":["嫌った"],"きらわない":["嫌わない"],"きらって":["嫌って"],"きらえる":["嫌える"],"きらわれる":["嫌われる"],"いやがらせ":["嫌がらせ"],"いやがる":["嫌がる"],"いやがった":["嫌がった"],"いやがらない":["嫌がらない"],"いやがり":["嫌がり"],"いやがって":["嫌がって"],"いやがれる":["嫌がれる"],"いやがられる":["嫌がられる"],"いやみ":["嫌味"],"けんお":["嫌悪"],"いやき":["嫌気"],"いやけ":["嫌気"],"けんき":["嫌気"],"うれしい":["嬉しい"],"うれしかった":["嬉しかった"],"うれしくない":["嬉しくない"],"うれしくて":["嬉しくて"],"うれしそう":["嬉しそう"],"じょうさん":["嬢さん"],"こども":["子供","子ども"],"こどもたち":["子供たち","子供達","子どもたち","子ども達"],"こがいしゃ":["子会社"],"こどもふく":["子供服"],"こどもよう":["子供用"],"しそん":["子孫"],"こもり":["子守"],"こやく":["子役"],"こもち":["子持ち"],"こそだて":["子育て"],"こづれ":["子連れ"],"こたち":["子達"],"あざ":["字"],"あざな":["字"],"じまく":["字幕"],"ぞんじ":["存知","存知","存じ"],"ぞんぶん":["存分"],"ぞんぶんに":["存分に"],"そんざい":["存在"],"そんざいいぎ":["存在意義"],"そんざいかん":["存在感"],"ぞんち":["存知"],"そんぞく":["存続"],"きせつ":["季節"],"きせつかん":["季節感"],"こどく":["孤独"],"こりつ":["孤立"],"ここう":["孤高"],"がく":["学","額"],"まなび":["学び","学び"],"まなぶ":["学ぶ"],"まなんだ":["学んだ"],"まなばない":["学ばない"],"まなんで":["学んで"],"まなめる":["学める"],"まなばれる":["学ばれる"],"がっかい":["学会"],"がくりょく":["学力"],"がくもん":["学問"],"がくえん":["学園"],"がくえんさい":["学園祭"],"がくねん":["学年"],"がっき":["楽器","学期"],"がっこう":["学校"],"がっこうきょういく":["学校教育"],"がっこうせいかつ":["学校生活"],"がくれき":["学歴"],"がくせい":["学生"],"がくせいじだい":["学生時代"],"がくせいせいかつ":["学生生活"],"がっか":["学科"],"がくどう":["学童"],"がっきゅう":["学級"],"がくしゅう":["学習"],"がくしゅうじゅく":["学習塾"],"がくしゃ":["学者"],"がくじゅつ":["学術"],"がくぶ":["学部"],"がくいん":["学院"],"がくしょく":["学食"],"まご":["孫"],"たっけん":["宅建"],"たっきゅうびん":["宅急便"],"たくはい":["宅配"],"たくはいびん":["宅配便"],"う":["得","有","羽","宇"],"のき":["軒","宇"],"うちゅう":["宇宙"],"うちゅうじん":["宇宙人"],"まもり":["守り","守り","守"],"もり":["森","盛り","守り","杜","守"],"まもる":["守る"],"まもった":["守った"],"まもらない":["守らない"],"まもって":["守って"],"まもれる":["守れる"],"まもられる":["守られる"],"しゅび":["守備"],"しゅご":["守護"],"しゅごしん":["守護神"],"しゅごじん":["守護神"],"やす":["安"],"やすい":["安い"],"やすかった":["安かった"],"やすくない":["安くない"],"やすくて":["安くて"],"やすく":["安く"],"やすらか":["安らか"],"やすらぎ":["安らぎ"],"あんか":["安価"],"やすね":["安値"],"あんぜん":["安全"],"あんぜんほしょう":["安全保障"],"あんぜんせい":["安全性"],"あんぜんうんてん":["安全運転"],"やすうり":["安売り"],"あんてい":["安定"],"あんていした":["安定した"],"あんていかん":["安定感"],"あんしん":["安心"],"あんじん":["安心"],"あんしんかん":["安心感"],"あんだ":["安打"],"あんい":["安易"],"やすもの":["安物"],"あんせい":["安静"],"かんりょう":["完了","官僚"],"かんび":["完備"],"かんぜん":["完全"],"かんぜんねんしょう":["完全燃焼"],"かんぜんはん":["完全版"],"かんしょう":["鑑賞","観賞","干渉","完勝"],"かんばい":["完売"],"かんぷう":["完封"],"かんせい":["完成","関西","感性","歓声"],"かんせいひん":["完成品"],"かんとう":["関東","完投"],"かんじ":["感じ","感じ","漢字","幹事","完治"],"かんち":["完治"],"かんじゅく":["完熟"],"かんぺき":["完璧"],"かんけつ":["完結","簡潔"],"かんけつへん":["完結編"],"かんしょく":["感触","完食"],"むね":["胸","旨","宗","棟"],"しゅうきょう":["宗教"],"かんこうちょう":["官公庁"],"かんぼう":["官房"],"かんぼうちょうかん":["官房長官"],"かんてい":["鑑定","官邸"],"さだか":["定か"],"さだめる":["定める"],"さだめた":["定めた"],"さだめない":["定めない"],"さだめ":["定め"],"さだめて":["定めて"],"さだめれる":["定めれる"],"さだめられる":["定められる"],"ていきゅう":["定休"],"ていきゅうび":["定休日"],"ていれい":["定例"],"ていれいかい":["定例会"],"ていいん":["定員"],"ていねん":["定年"],"ていねんたいしょく":["定年退職"],"ていじ":["提示","定時"],"ていき":["定期","提起"],"ていきてき":["定期的"],"ていきてきに":["定期的に"],"ていてん":["定点"],"ていばん":["定番"],"ていちゃく":["定着"],"ていぎ":["定義"],"ていひょう":["定評"],"ていがく":["定額"],"ていしょく":["定食"],"あて":["私","当て","当て","宛"],"よろしく":["宜しく"],"よろしければ":["宜しければ"],"たから":["宝","財"],"たからくじ":["宝くじ"],"ほうこ":["宝庫"],"たからもの":["宝物"],"ほうもつ":["宝物"],"ほうせき":["宝石"],"たからばこ":["宝箱"],"さね":["実","真実","核"],"じち":["実","自治"],"じつ":["実"],"そうじみ":["実"],"ただみ":["実"],"まこと":["実","誠"],"むざね":["実"],"げに":["実に"],"じつに":["実に"],"まことに":["実に","誠に","真に"],"じつの":["実の"],"じつは":["実は"],"みのり":["実り"],"じったい":["実態","実体"],"じっしゃ":["実写"],"じつりょく":["実力"],"じつむ":["実務"],"じつめい":["実名"],"じつざい":["実在"],"じっか":["実家"],"じつじょう":["実情"],"じっかん":["実感"],"じっせん":["実践","実戦"],"じつぎ":["実技"],"じっし":["実施"],"じっしちゅう":["実施中"],"じつぎょう":["実業"],"じっきょう":["実況"],"じつえん":["実演"],"じつぶつ":["実物"],"みもの":["実物","見物"],"じつげん":["実現"],"じつよう":["実用"],"じっせき":["実績"],"じっしゅう":["実習"],"じっこう":["実行"],"じっこういいんかい":["実行委員会"],"じっしょう":["実証"],"じつわ":["実話"],"じっしつ":["実質"],"じっしつてき":["実質的"],"じつろく":["実録"],"じっさい":["実際"],"じっさいに":["実際に"],"じっけん":["実験"],"じっけんしつ":["実験室"],"きゃく":["客","脚","格"],"きゃくせき":["客席"],"きゃっかんてき":["客観的"],"せんでん":["宣伝"],"せんこく":["宣告"],"せんげん":["宣言"],"しつ":["室","質"],"むろ":["室"],"しつない":["室内"],"みや":["宮"],"きゅうじょう":["宮城","球場"],"みやぎけん":["宮城県"],"みやざきけん":["宮崎県"],"うたげ":["宴"],"えんかい":["宴会"],"んち":["家"],"いえにかえる":["家に帰る"],"いえじゅう":["家中"],"うちじゅう":["家中"],"かちゅう":["家中"],"かじん":["家人","歌人"],"けにん":["家人"],"かぐ":["家具"],"やうち":["家内"],"いえで":["家出"],"かおく":["家屋"],"かてい":["家庭","過程","課程"],"かていない":["家庭内"],"かていきょうし":["家庭教師"],"かていりょうり":["家庭料理"],"かていよう":["家庭用"],"かていさいえん":["家庭菜園"],"かぞく":["家族"],"かぞくりょこう":["家族旅行"],"かぞくづれ":["家族連れ"],"かけい":["家計"],"かけいぼ":["家計簿"],"やちん":["家賃"],"いえじ":["家路"],"いえでん":["家電"],"かでん":["家電"],"ようき":["陽気","容器"],"ようし":["用紙","陽子","容姿"],"ようい":["用意","容易"],"ようぎ":["容疑"],"ようぎしゃ":["容疑者"],"ようにん":["容認"],"ようしゃ":["容赦"],"ようしゃなく":["容赦なく"],"ようりょう":["容量","要領"],"やど":["宿"],"しゅくめい":["宿命"],"しゅくはく":["宿泊"],"しゅくしゃ":["宿舎"],"しゅくだい":["宿題"],"さびしい":["寂しい","淋しい"],"さびしかった":["寂しかった","淋しかった"],"さびしくない":["寂しくない","淋しくない"],"さびしくて":["寂しくて","淋しくて"],"さみしい":["寂しい","淋しい"],"さみしかった":["寂しかった","淋しかった"],"さみしくない":["寂しくない","淋しくない"],"さみしくて":["寂しくて","淋しくて"],"よせ":["寄せ","寄席","寄せ"],"よせる":["寄せる"],"よせた":["寄せた"],"よせない":["寄せない"],"よせて":["寄せて"],"よせれる":["寄せれる"],"よせられる":["寄せられる"],"よりみち":["寄り道"],"よった":["寄った","酔った"],"よらない":["寄らない"],"よって":["寄って","酔って"],"よれる":["寄れる"],"よられる":["寄られる"],"きふ":["寄付"],"きこう":["紀行","機構","気候","気功","寄稿"],"みつ":["蜜","密"],"ひそか":["密か"],"ひそかに":["密かに"],"みつど":["密度"],"みっちゃく":["密着"],"とみ":["富"],"ふじさん":["富士山"],"とやまけん":["富山県"],"さぶい":["寒い"],"さぶかった":["寒かった"],"さぶくない":["寒くない"],"さぶくて":["寒くて"],"さむい":["寒い"],"さむかった":["寒かった"],"さむくない":["寒くない"],"さむくて":["寒くて"],"さむさ":["寒さ"],"かんてん":["観点","寒天"],"かんき":["歓喜","寒気"],"さむけ":["寒気"],"ねない":["寝ない"],"ねて":["寝て"],"ねれる":["寝れる"],"ねられる":["寝られる"],"ねぶそく":["寝不足"],"しんだい":["寝台"],"ねだい":["寝台"],"ねぼう":["寝坊"],"しんしつ":["寝室"],"ねどこ":["寝床"],"ねごと":["寝言"],"ねおき":["寝起き"],"ねがえり":["寝返り"],"ねがお":["寝顔"],"さっち":["察知"],"しんばん":["審判"],"しんぱん":["審判"],"しんさ":["審査"],"しんさいん":["審査員"],"しんぎ":["審議"],"すん":["寸"],"すんぜん":["寸前"],"じいん":["寺院"],"たいする":["対する"],"たいちゅう":["対中"],"たいしょ":["対処"],"たいしょほう":["対処法"],"たいきょく":["対局"],"たいがん":["対岸"],"たいじ":["退治","対峙"],"たいおう":["対応"],"たいせんあいて":["対戦相手"],"たいこう":["対抗"],"たいひ":["対比"],"たいけつ":["対決"],"たいしょうてき":["対照的"],"たいりつ":["対立"],"たいわ":["対話"],"たいだん":["対談","退団"],"たいめん":["対面"],"ことぶき":["寿"],"すし":["寿司","鮨"],"すしや":["寿司屋"],"じゅみょう":["寿命"],"ふういん":["封印"],"ふうとう":["封筒"],"せんむ":["専務"],"せんぞく":["専属"],"せんぎょう":["専業"],"せんぎょうしゅふ":["専業主婦"],"せんよう":["専用"],"せんか":["専科"],"せんもん":["専門"],"せんもんがっこう":["専門学校"],"せんもんか":["専門家"],"せんもんてん":["専門店"],"せんもんてき":["専門的"],"しゃげき":["射撃"],"しょうらい":["将来"],"しょうぎ":["将棋"],"しょうぐん":["将軍"],"そん":["損","尊"],"とうと":["貴","尊"],"たっとい":["尊い"],"たっとかった":["尊かった"],"たっとくない":["尊くない"],"たっとくて":["尊くて"],"とうとい":["尊い"],"とうとかった":["尊かった"],"とうとくない":["尊くない"],"とうとくて":["尊くて"],"そんけい":["尊敬"],"そんちょう":["尊重","村長"],"たずねる":["尋ねる","訪ねる"],"たずねた":["尋ねた","訪ねた"],"たずねない":["尋ねない","訪ねない"],"たずね":["尋ね","訪ね"],"たずねて":["尋ねて","訪ねて"],"たずねれる":["尋ねれる","訪ねれる"],"たずねられる":["尋ねられる","訪ねられる"],"じんじょう":["尋常"],"みちびく":["導く"],"みちびいた":["導いた"],"みちびかない":["導かない"],"みちびき":["導き"],"みちびいて":["導いて"],"みちびける":["導ける"],"みちびかれる":["導かれる"],"どうにゅう":["導入"],"ささ":["小","細","笹"],"さざ":["小","細"],"ちいさい":["小さい"],"ちいさかった":["小さかった"],"ちいさくない":["小さくない"],"ちいさくて":["小さくて"],"こさじ":["小さじ"],"ちいさな":["小さな"],"ちいさめ":["小さめ"],"しょうちゅうがっこう":["小中学校"],"こぞう":["小僧"],"しょうに":["小児"],"しょうにか":["小児科"],"しょうどうぶつ":["小動物"],"こがた":["小型"],"こうり":["小売"],"しょうがく":["小学"],"しょうがっこう":["小学校"],"しょうがくせい":["小学生"],"こや":["小屋"],"こやま":["小山"],"こじま":["小島"],"おがわ":["小川"],"しょうしん":["小心"],"しょうしんもの":["小心者"],"こあくま":["小悪魔"],"こゆび":["小指"],"こはる":["小春"],"こはるびより":["小春日和"],"こまつな":["小松菜"],"こがら":["小柄"],"こづか":["小柄"],"しょうへい":["小柄"],"こもの":["小物"],"しょうせい":["小生"],"おだ":["小田"],"こまち":["小町"],"しょうきぼ":["小規模"],"こごと":["小言"],"こばなし":["小話"],"しょうわ":["昭和","小話"],"しょうせつ":["小説","小雪"],"しょうせつか":["小説家"],"あずき":["小豆"],"こうじ":["工事","小路","麹"],"こみち":["小路","小道"],"こどうぐ":["小道具"],"こづかい":["小遣い"],"こべや":["小部屋"],"おの":["小野"],"こぜに":["小銭"],"こあめ":["小雨"],"こさめ":["小雨"],"しょうう":["小雨"],"こゆき":["小雪"],"ことり":["小鳥"],"こむぎ":["小麦"],"こむぎこ":["小麦粉"],"しょうしょう":["少々"],"すこし":["少し"],"すこしずつ":["少しずつ"],"すこしづつ":["少しづつ"],"すくない":["少ない"],"すくなかった":["少なかった"],"すくなくない":["少なくない"],"すくなくて":["少なくて"],"すくなからず":["少なからず"],"すくなくとも":["少なくとも"],"すくなめ":["少なめ"],"しょうにんず":["少人数"],"しょうにんずう":["少人数"],"しょうじょ":["少女"],"しょうしか":["少子化"],"しょうねん":["少年"],"しょうすう":["少数"],"しょうりょう":["青龍","少量","精霊"],"なお":["直","尚"],"なおさら":["尚更"],"しゅうにん":["就任"],"しゅうろう":["就労"],"しゅうしん":["就寝"],"しゅうかつ":["就活"],"しゅうしょく":["就職","秋色"],"しゅうしょくかつどう":["就職活動"],"あた":["尺"],"けつ":["穴","尻","決"],"しり":["後","知り","尻"],"しっぽ":["尻尾"],"つきない":["尽きない","尽きない"],"つきなかった":["尽きなかった"],"つきなくない":["尽きなくない"],"つきなくて":["尽きなくて"],"つきる":["尽きる"],"つきた":["尽きた"],"つきて":["尽きて"],"つきれる":["尽きれる"],"つきられる":["尽きられる"],"ずくし":["尽くし"],"づくし":["尽くし"],"じんりょく":["尽力"],"び":["美","尾","微"],"おね":["尾根"],"にょう":["尿"],"きょく":["曲","局","極"],"つぼね":["局"],"きょくちょう":["局長"],"きょくめん":["局面"],"きょ":["居"],"いた":["板","居た","痛"],"いて":["居て"],"おる":["居る"],"おった":["居った","追った"],"おらない":["居らない"],"おって":["居って","追って","追って"],"おれる":["居れる"],"おられる":["居られる"],"きょじゅう":["居住"],"いばしょ":["居場所"],"こじ":["居士"],"いごこち":["居心地"],"いねむり":["居眠り"],"いざかや":["居酒屋"],"くっし":["屈指"],"くつじょく":["屈辱"],"とどけ":["届け","届","届け"],"とどく":["届く"],"とどいた":["届いた"],"とどかない":["届かない"],"とどき":["届き"],"とどいて":["届いて"],"とどける":["届ける","届ける"],"とどかれる":["届かれる"],"とどけた":["届けた"],"とどけない":["届けない"],"とどけて":["届けて"],"とどけれる":["届けれる"],"とどけられる":["届けられる"],"とどけもの":["届け物"],"おくじょう":["屋上"],"おくない":["屋内"],"やたい":["屋台"],"おくがい":["屋外"],"やしき":["屋敷","邸"],"やね":["屋根"],"やねうら":["屋根裏"],"てんぼう":["展望"],"てんぼうだい":["展望台"],"てんじ":["展示"],"てんじかい":["展示会"],"てんじじょう":["展示場"],"てんらんかい":["展覧会"],"てんかい":["展開"],"しょくする":["属する"],"ぞくする":["属する"],"ぞくせい":["属性"],"りれき":["履歴"],"りれきしょ":["履歴書"],"やま":["山"],"やまやま":["山々"],"やまほど":["山ほど"],"さんちゅう":["山中"],"さんない":["山内"],"やまぐちけん":["山口県"],"やまおく":["山奥"],"やまごや":["山小屋"],"やまがた":["山形"],"やまがたけん":["山形県"],"さんそん":["山村"],"やまなしけん":["山梨県"],"やまあるき":["山歩き"],"やまのぼり":["山登り"],"やまもり":["山盛り"],"やまづみ":["山積み"],"さんさい":["山菜"],"せんどう":["山道"],"やまみち":["山道"],"やまざと":["山里"],"さんや":["山野"],"やまあい":["山間"],"やまかげ":["山陰"],"さんよう":["山陽"],"さんちょう":["山頂"],"さんろく":["山麓"],"ぎふ":["岐阜","義父"],"ぎふけん":["岐阜県"],"おかやまけん":["岡山県"],"いわ":["岩"],"いわてけん":["岩手県"],"がんばん":["岩盤"],"がんばんよく":["岩盤浴"],"みさき":["崎","岬"],"きし":["騎士","岸","棋士","記し"],"とうげ":["峠"],"みね":["峰"],"しま":["島","嶋"],"しまね":["島根"],"しまねけん":["島根県"],"がけ":["崖","掛け"],"がけっぷち":["崖っぷち"],"くずす":["崩す"],"くずした":["崩した"],"くずさない":["崩さない"],"くずし":["崩し"],"くずして":["崩して"],"くずせる":["崩せる"],"くずされる":["崩される"],"くずれ":["崩れ","崩れ"],"くずれる":["崩れる"],"くずれた":["崩れた"],"くずれない":["崩れない"],"くずれて":["崩れて"],"くずれれる":["崩れれる"],"くずれられる":["崩れられる"],"ほうかい":["崩壊"],"あらし":["嵐","荒らし"],"かわかみ":["川上"],"かわはら":["河原","川原"],"かわら":["河原","川原","瓦"],"かわぐち":["川口","河口"],"かわさき":["川崎"],"かわやぎ":["川柳"],"かわやなぎ":["川柳"],"せんりゅう":["川柳"],"かわぞい":["川沿い"],"かわあそび":["川遊び"],"じゅんかい":["巡回"],"じゅんれい":["巡礼"],"こうじちゅう":["工事中"],"こうさく":["工作","耕作"],"こうぐ":["工具"],"こうむてん":["工務店"],"こうば":["工場"],"くふう":["工夫"],"こうがく":["高額","工学"],"こうぼう":["工房","攻防"],"こうぎょう":["工業","興行","興業"],"こうてい":["皇帝","工程","肯定","行程","校庭"],"こうげい":["工芸"],"ひだり":["左"],"ひだりうえ":["左上"],"ひだりした":["左下"],"さそく":["左側"],"ひだりがわ":["左側"],"さゆう":["左右"],"とかく":["左右"],"ひだりて":["左手"],"さよく":["左翼"],"さわん":["左腕"],"ひだりうで":["左腕"],"ひだりあし":["左足"],"きょにゅう":["巨乳"],"きょじん":["巨人"],"きょしょう":["巨匠"],"きょだい":["巨大"],"きょがく":["巨額"],"ふじょ":["巫女"],"みこ":["皇子","巫女"],"さしいれ":["差し入れ"],"さべつ":["差別"],"うぬ":["己"],"うら":["裏","末","己","浦"],"おどれ":["己"],"おのれ":["己"],"おら":["己"],"おんどら":["己"],"おんどれ":["己"],"つちのと":["己"],"ともえ":["巴"],"ちまた":["巷"],"まく":["幕","巻く"],"まいた":["巻いた"],"まかない":["巻かない"],"まいて":["巻いて"],"まける":["負ける","巻ける"],"まかれる":["巻かれる"],"きんちゃく":["巾着"],"しない":["市内"],"しえい":["市営"],"いちば":["市場"],"しやくしょ":["市役所"],"しみん":["市民"],"しちょうそん":["市町村"],"いちりつ":["市立"],"しりつ":["市立","私立"],"しがいち":["市街地"],"しぎ":["市議"],"しぎかい":["市議会"],"しぎかいぎいん":["市議会議員"],"しはん":["市販"],"しちょう":["視聴","市長","試聴"],"にぬ":["布"],"にの":["布"],"ぬの":["布"],"ふとん":["布団"],"まれ":["稀","希"],"きしょう":["気象","起床","希少"],"きぼう":["希望"],"きぼうしゃ":["希望者"],"みかど":["帝"],"ていこく":["帝国"],"ていおう":["帝王"],"ししょう":["師匠","支障"],"しはす":["師走"],"しわす":["師走"],"むしろ":["席"],"おび":["帯"],"かえってくる":["帰ってくる","帰って来る"],"かえってくた":["帰ってくた","帰って来た"],"かえってこない":["帰ってくない","帰って来ない"],"かえってき":["帰ってき","帰ってき"],"かえってきて":["帰ってくて","帰って来て"],"かえってこれる":["帰ってくれる","帰って来れる"],"かえってこられる":["帰ってくられる","帰って来られる"],"かえり":["帰り","帰り"],"かえりみち":["帰り道"],"かえった":["帰った"],"かえらない":["帰らない"],"かえって":["帰って"],"かえれ":["帰れ"],"きこく":["帰国"],"きたく":["帰宅"],"きぞく":["貴族","帰属"],"きせい":["帰省","規制"],"きかん":["期間","機関","帰還"],"ききょう":["桔梗","帰郷"],"とばり":["帳"],"つね":["常"],"とこ":["所","常","床"],"とわ":["常","永久"],"つねづね":["常々"],"つねに":["常に"],"じょうにん":["常任"],"じょうび":["常備"],"じょうじ":["常時"],"じょうしき":["常識"],"じょうれん":["常連"],"ぼうし":["防止","帽子"],"はば":["幅"],"はばひろい":["幅広い"],"はばひろかった":["幅広かった"],"はばひろくない":["幅広くない"],"はばひろくて":["幅広くて"],"ばくふ":["幕府"],"ばくまつ":["幕末"],"まくあけ":["幕開け"],"ほし":["星","干し"],"えと":["干支"],"かんし":["監視","干支"],"ひもの":["干物"],"ほしもの":["干物"],"ひら":["平"],"たいら":["平ら"],"へいぼん":["平凡"],"へいわ":["平和"],"ひらち":["平地"],"へいち":["平地"],"へいきん":["平均"],"へいぎん":["平均"],"へいあん":["平安"],"へいせい":["平成"],"ひらび":["平日"],"へいじつ":["平日"],"へいおん":["平穏"],"びょうどう":["平等"],"へいや":["平野"],"とし":["年","歳","都市"],"とせ":["年","歳"],"ねん":["年","念"],"としどし":["年々"],"ねんねん":["年々"],"ねんにいちど":["年に一度"],"ねんぶり":["年ぶり","年振り"],"としより":["年寄り","年より"],"としうえ":["年上"],"としした":["年下"],"ねんじゅう":["年中"],"ねんじゅうむきゅう":["年中無休"],"ねんだい":["年代"],"ねんかい":["年会"],"ねんない":["年内"],"ねんないに":["年内に"],"ねんぶん":["年分"],"ねんしょ":["年初"],"ねんしゅう":["年収"],"ねんど":["年度","粘土"],"ねんどまつ":["年度末"],"ねんご":["年後"],"ねんすう":["年数"],"としあけ":["年明け"],"ねんあけ":["年明け"],"としつき":["年月","歳月"],"ねんげつ":["年月"],"ねんがっぴ":["年月日"],"ねんまつ":["年末"],"ねんまつねんし":["年末年始"],"ねんらい":["年来"],"としだま":["年玉"],"ねんせい":["年生"],"ねんめ":["年目"],"ねんが":["年賀"],"ねんがじょう":["年賀状"],"としこし":["年越し"],"ねんぱい":["年配"],"ねんきん":["年金"],"ねんちょう":["年長"],"ねんかん":["年間"],"としごろ":["年頃"],"ねんれい":["年齢"],"ねんれいそう":["年齢層"],"さち":["幸"],"さいわい":["幸い"],"しあわせ":["幸せ"],"しあわせもの":["幸せ者"],"こうふく":["幸福"],"こううん":["幸運"],"みき":["幹"],"かんじちょう":["幹事長"],"かんぶ":["幹部"],"まぼろし":["幻"],"げんえい":["幻影"],"げんそう":["幻想"],"げんそうてき":["幻想的"],"いとけない":["幼い"],"いとけなかった":["幼かった"],"いとけなくない":["幼くない"],"いとけなくて":["幼くて"],"おさない":["幼い","押さない"],"おさなかった":["幼かった"],"おさなくない":["幼くない"],"おさなくて":["幼くて"],"おさななじみ":["幼馴染","幼なじみ"],"ようじ":["用事","幼児"],"ようしょう":["幼少"],"ようち":["幼稚"],"ようちえん":["幼稚園"],"ようちえんじ":["幼稚園児"],"ようちゅう":["幼虫"],"ゆうれい":["幽霊"],"いくつ":["幾つ"],"いくつか":["幾つか"],"いくら":["幾ら"],"いくたび":["幾度"],"いくど":["幾度"],"ひろびろ":["広々"],"ひろい":["広い","拾い"],"ひろかった":["広かった"],"ひろくない":["広くない"],"ひろくて":["広くて"],"ひろがり":["広がり","広がり"],"ひろがる":["広がる"],"ひろがった":["広がった"],"ひろがらない":["広がらない"],"ひろがって":["広がって"],"ひろがれる":["広がれる"],"ひろがられる":["広がられる"],"ひろく":["広く"],"ひろげる":["広げる"],"ひろげた":["広げた"],"ひろげない":["広げない"],"ひろげ":["広げ"],"ひろげて":["広げて"],"ひろげれる":["広げれる"],"ひろげられる":["広げられる"],"ひろさ":["広さ"],"ひろめる":["広める"],"ひろめた":["広めた"],"ひろめない":["広めない"],"ひろめ":["広め"],"ひろめて":["広めて"],"ひろめれる":["広めれる"],"ひろめられる":["広められる"],"こうこく":["広告"],"こういき":["広域"],"こうほう":["広報","後方"],"ひろば":["広場"],"こうだい":["広大"],"ひろしま":["広島"],"ひろしまけん":["広島県"],"ゆか":["床"],"とこや":["床屋"],"ついで":["注いで","序","次いで","次いで","継いで"],"じょばん":["序盤"],"そこ":["底"],"ていへん":["底辺"],"たな":["店","棚"],"みせ":["店","見せ"],"てんしゅ":["店主"],"てんない":["店内"],"てんいん":["店員"],"みせばん":["店番"],"てんちょう":["店長"],"てんとう":["店頭","転倒","点灯"],"ふちゅう":["府中"],"たび":["度","旅"],"たびたび":["度々"],"たびに":["度に"],"たんびに":["度に"],"どあい":["度合い"],"どめ":["度目","止め"],"どきょう":["度胸"],"ざ":["座"],"すわり":["座り","座り"],"すわる":["座る"],"すわった":["座った"],"すわらない":["座らない"],"すわって":["座って"],"すわられる":["座られる"],"ざゆうのめい":["座右の銘"],"ざぶとん":["座布団"],"ざせき":["座席"],"ざしき":["座敷"],"にわ":["庭"],"ていえん":["庭園"],"あん":["庵","案","餡"],"いおり":["庵"],"しょみん":["庶民"],"はいじん":["廃人"],"はいきょ":["廃墟"],"はいき":["廃棄","排気"],"はいきぶつ":["廃棄物"],"はいぎょう":["廃業"],"はいし":["廃止"],"ろうか":["廊下","老化"],"えんえん":["延々"],"えんき":["延期"],"えんちょうせん":["延長戦"],"たつ":["龍","立つ","経つ","竜","建つ"],"たたない":["立たない","経たない","建たない"],"たち":["達","館","立ち","立ち","質","経ち","建ち"],"たてる":["立てる","経てる","立てる","建てる","建てる"],"たたれる":["立たれる","経たれる","建たれる"],"たてた":["立てた","建てた"],"たてない":["立てない","建てない"],"たて":["経","立て","縦","立て","建て","盾"],"たてて":["立てて","立てて","建てて"],"たてれる":["立てれる","建てれる"],"たてられる":["立てられる","建てられる"],"たてもの":["建物"],"けんちく":["建築"],"けんちくし":["建築士"],"けんちくか":["建築家"],"けんちくぶつ":["建築物"],"けんせつ":["建設"],"けんぞうぶつ":["建造物"],"べんとう":["弁当"],"べんとうばこ":["弁当箱"],"べんご":["弁護"],"べんごし":["弁護士"],"へいがい":["弊害"],"へいしゃ":["弊社"],"しきてん":["式典"],"しきじょう":["式場"],"ゆみ":["弓"],"びき":["引き","美姫"],"ひきこもり":["引きこもり"],"ひきあげ":["引き上げ"],"ひきだし":["引き出し","引き出し"],"ひきだす":["引き出す"],"ひきだした":["引き出した"],"ひきださない":["引き出さない"],"ひきだして":["引き出して"],"ひきだせる":["引き出せる"],"ひきだされる":["引き出される"],"ひきわけ":["引き分け"],"ひきとり":["引き取り"],"ひきかえ":["引き換え"],"ひきつづき":["引き続き"],"ひきおこす":["引き起こす"],"ひきおこした":["引き起こした"],"ひきおこさない":["引き起こさない"],"ひきおこし":["引き起こし"],"ひきおこして":["引き起こして"],"ひきおこせる":["引き起こせる"],"ひきおこされる":["引き起こされる"],"ひく":["引く","弾く"],"ひいた":["引いた","弾いた"],"ひかない":["引かない","弾かない"],"ひいて":["引いて","弾いて"],"ひける":["引ける","弾ける"],"ひけ":["引け"],"ひっかかる":["引っかかる"],"ひっかかった":["引っかかった"],"ひっかからない":["引っかからない"],"ひっかかり":["引っかかり"],"ひっかかって":["引っかかって"],"ひっかかれる":["引っかかれる"],"ひっかかられる":["引っかかられる"],"ひっぱる":["引っ張る"],"ひっぱった":["引っ張った"],"ひっぱらない":["引っ張らない"],"ひっぱり":["引っ張り"],"ひっぱって":["引っ張って"],"ひっぱれる":["引っ張れる"],"ひっぱられる":["引っ張られる"],"ひっこし":["引越し","引っ越し","引越","引っ越し"],"ひっこす":["引っ越す"],"ひっこした":["引っ越した"],"ひっこさない":["引っ越さない"],"ひっこして":["引っ越して"],"ひっこせる":["引っ越せる"],"ひっこされる":["引っ越される"],"いんよう":["引用"],"いんたい":["引退"],"おと":["音","弟"],"おとうと":["弟"],"おとと":["弟"],"でし":["弟子"],"やよい":["弥生"],"じゃく":["弱"],"なよなよ":["弱"],"よわい":["弱い"],"よわかった":["弱かった"],"よわくない":["弱くない"],"よわくて":["弱くて"],"よわさ":["弱さ"],"よわき":["弱気"],"じゃくてん":["弱点"],"じゃくしゃ":["弱者"],"はりがみ":["張り紙"],"ばった":["張った"],"ばらない":["張らない"],"ばって":["張って"],"ばれる":["張れる"],"ばられる":["張られる"],"こわい":["強い","怖い","恐い"],"こわかった":["強かった","怖かった","恐かった"],"こわくない":["強くない","怖くない","恐くない"],"こわくて":["強くて","怖くて","恐くて"],"つよい":["強い"],"つよかった":["強かった"],"つよくない":["強くない"],"つよくて":["強くて"],"つよさ":["強さ"],"つよみ":["強み"],"きょうせいてき":["強制的"],"ごうりき":["強力"],"きょうか":["強化","教科"],"きょうど":["郷土","強度"],"ごういん":["強引"],"ごういんに":["強引に"],"きょうてき":["強敵"],"ごうぎ":["強気"],"つよき":["強気"],"きょうれつ":["強烈"],"ごうとう":["強盗"],"きょうこう":["強行"],"きょうよう":["教養","強要"],"きょうごう":["強豪"],"きょうふう":["強風"],"たま":["弾","魂","玉","球","霊","適"],"はじき":["弾き","弾き"],"ひきがたり":["弾き語り"],"はじく":["弾く"],"はじいた":["弾いた"],"はじかない":["弾かない"],"はじいて":["弾いて"],"はじける":["弾ける","弾ける"],"はじかれる":["弾かれる"],"はじけた":["弾けた"],"はじけない":["弾けない"],"はじけ":["弾け"],"はじけて":["弾けて"],"はじけれる":["弾けれる"],"はじけられる":["弾けられる"],"だんがん":["弾丸"],"だんあつ":["弾圧"],"あたり":["当たり","当たり","辺り","当り"],"あたりまえ":["当たり前"],"あたる":["当たる"],"あたった":["当たった"],"あたらない":["当たらない"],"あたって":["当たって"],"あたれる":["当たれる"],"あたられる":["当たられる"],"あてはまる":["当てはまる"],"あてはまった":["当てはまった"],"あてはまらない":["当てはまらない"],"あてはまり":["当てはまり"],"あてはまって":["当てはまって"],"あてはまれる":["当てはまれる"],"あてはまられる":["当てはまられる"],"あてる":["当てる"],"あてた":["当てた"],"あてない":["当てない"],"あてて":["当てて"],"あてれる":["当てれる"],"あてられる":["当てられる"],"とうの":["当の"],"とうじしゃ":["当事者"],"とうにん":["当人"],"とうぶん":["当分"],"とうしょ":["当初"],"とうち":["当地","統治"],"とうきょく":["当局"],"とうてん":["当店"],"とうほう":["東方","当方","東宝"],"とうじつ":["当日"],"とうじ":["当時","統治"],"とうぜん":["当然"],"とうばん":["登板","当番"],"とうしゃ":["当社"],"とうがい":["当該"],"とうせん":["当選"],"とうせんしゃ":["当選者"],"とうめん":["当面"],"すいせい":["彗星"],"かたち":["形"],"けいしき":["形式"],"けいじょう":["形状"],"ひこ":["彦"],"いろどり":["彩り","彩り"],"いろどる":["彩る"],"いろどった":["彩った"],"いろどらない":["彩らない"],"いろどって":["彩って"],"いろどれる":["彩れる"],"いろどられる":["彩られる"],"ちょうこく":["彫刻"],"かげ":["影","陰","蔭"],"えいきょう":["影響"],"えいきょうりょく":["影響力"],"ほうふつ":["彷彿"],"ほうこう":["方向","彷徨"],"えき":["駅","役","液","益"],"やく":["約","訳","役","薬","焼く","益"],"やくにたたない":["役に立たない","役に立たない"],"やくにたつ":["役に立つ"],"やくにたった":["役に立った"],"やくにたち":["役に立ち"],"やくにたって":["役に立って"],"やくにたてる":["役に立てる"],"やくにたたれる":["役に立たれる"],"やくにん":["役人"],"やくわり":["役割"],"やくいん":["役員"],"やくば":["役場"],"やくしょ":["役所"],"やくがら":["役柄"],"やくめ":["役目"],"やくだつ":["役立つ"],"やくだった":["役立った"],"やくだたない":["役立たない"],"やくだち":["役立ち"],"やくだって":["役立って"],"やくだてる":["役立てる"],"やくだたれる":["役立たれる"],"やくしゃ":["役者"],"かれ":["彼"],"かの":["彼の"],"あれら":["彼ら","彼等"],"かれら":["彼ら","彼等"],"かのじょ":["彼女"],"ひがん":["彼岸","悲願"],"ひがんばな":["彼岸花"],"あち":["彼方"],"あちら":["彼方"],"あっち":["彼方"],"あなた":["貴方","彼方","貴女"],"かなた":["彼方"],"かれし":["彼氏"],"おうふく":["往復"],"おうじょう":["往生"],"まち":["町","街","待ち","待ち"],"まちあわせ":["待ち合わせ"],"まちじかん":["待ち時間"],"まちどおしい":["待ち遠しい"],"まちどおしかった":["待ち遠しかった"],"まちどおしくない":["待ち遠しくない"],"まちどおしくて":["待ち遠しくて"],"まった":["待った","待った","舞った"],"まつ":["末","待つ","松"],"またない":["待たない"],"まって":["待って","舞って"],"まてる":["待てる"],"またれる":["待たれる"],"まちあいしつ":["待合室"],"たいぼう":["待望"],"たいぐう":["待遇"],"あと":["後","跡","痕"],"うしろ":["後","後ろ"],"のち":["後"],"あとあと":["後々"],"のちのち":["後々"],"あとで":["後で"],"のちほど":["後ほど"],"うしろから":["後ろから"],"うしろすがた":["後姿","後ろ姿"],"こうはん":["後半"],"こうはんせん":["後半戦"],"あとあじ":["後味"],"あとまわし":["後回し"],"あとおし":["後押し"],"こうえんかい":["講演会","後援会"],"ごじつ":["後日","期日"],"ごにち":["後日"],"こうき":["後期","後記"],"あとかたづけ":["後片付け"],"こうけいしゃ":["後継者"],"こうへん":["後編"],"こうはい":["後輩"],"こういしょう":["後遺症"],"こうぶ":["後部"],"じょじょ":["徐々"],"じょじょに":["徐々に"],"とほ":["徒歩"],"つれづれ":["徒然"],"とぜん":["徒然"],"したがって":["従って"],"じゅうじ":["従事"],"いとこ":["従兄弟"],"じゅうけいてい":["従兄弟"],"じゅうらい":["従来"],"じゅうぎょういん":["従業員"],"とくする":["得する"],"えない":["得ない","得ない"],"えなかった":["得なかった"],"えなくない":["得なくない"],"えなくて":["得なくて"],"えた":["得た"],"えて":["得て"],"えれる":["得れる"],"えられる":["得られる"],"とくい":["得意"],"とくてん":["得点","特典"],"はいかい":["徘徊"],"おおむ":["御"],"おおん":["御"],"ぎょ":["御"],"ごめん":["御免"],"ございます":["御座います"],"ごしょ":["御所"],"ごてん":["御殿"],"ごよう":["御用"],"ごようたし":["御用達"],"ごようたつ":["御用達"],"ごようだち":["御用達"],"ごようだつ":["御用達"],"おんれい":["御礼"],"ぎょえん":["御苑"],"おまんま":["御飯"],"ふくげん":["復元"],"ふっこく":["復刻"],"ふっき":["復帰"],"ふくきゅう":["復旧"],"ふっきゅう":["復旧"],"ふっかつ":["復活"],"ふくしゅう":["復習","復讐"],"ふっこう":["復興"],"じゅんかん":["循環"],"みじん":["微塵"],"びみょう":["微妙"],"みみょう":["微妙"],"びねつ":["微熱"],"びしょう":["微笑"],"ほほえましい":["微笑ましい"],"ほほえましかった":["微笑ましかった"],"ほほえましくない":["微笑ましくない"],"ほほえましくて":["微笑ましくて"],"ほおえみ":["微笑み"],"ほほえみ":["微笑み"],"とくしまけん":["徳島県"],"ちょうしゅう":["徴収"],"てつや":["徹夜"],"てってい":["徹底"],"てっていてき":["徹底的"],"こころ":["心"],"こころから":["心から"],"しんから":["心から"],"こころのうち":["心の中"],"こころのそこ":["心の底"],"こころより":["心より"],"しんじゅう":["心中"],"しんちゅう":["心中"],"ここち":["心地"],"ここちよい":["心地よい","心地良い"],"ここちよかった":["心地よかった","心地良かった"],"ここちよくない":["心地よくない","心地良くない"],"ここちよくて":["心地よくて","心地良くて"],"しんきょう":["心境"],"しんそこ":["心底"],"しんてい":["心底"],"こころづよい":["心強い"],"こころづよかった":["心強かった"],"こころづよくない":["心強くない"],"こころづよくて":["心強くて"],"こころまち":["心待ち"],"こころえ":["心得"],"こころいき":["心意気"],"こころがまえ":["心構え"],"しんき":["新規","心機"],"しんきいってん":["心機一転"],"こころのこり":["心残り"],"こころあたたまる":["心温まる"],"こころあたたまった":["心温まった"],"こころあたたまらない":["心温まらない"],"こころあたたまり":["心温まり"],"こころあたたまって":["心温まって"],"こころあたたまれる":["心温まれる"],"こころあたたまられる":["心温まられる"],"しんり":["心理","真理"],"しんりがく":["心理学"],"しんりてき":["心理的"],"しんきん":["心筋"],"しんぞう":["心臓"],"しんしん":["心身","深々"],"こころづかい":["心遣い"],"しんぱい":["心配"],"しんれい":["心霊"],"かならず":["必ず"],"かならずしも":["必ずしも"],"ひっしょう":["必勝"],"ひっし":["必死","必至"],"ひっしに":["必死に"],"ひっしになって":["必死になって"],"ひっさつ":["必殺"],"ひつぜん":["必然"],"ひつぜんてき":["必然的"],"ひつよう":["必要"],"ひつようとする":["必要とする"],"ひつようせい":["必要性"],"ひっけん":["必見"],"ひつどく":["必読"],"ひつじゅひん":["必需品"],"ひっす":["必須"],"しのぶ":["忍"],"にんじゃ":["忍者"],"こころざし":["志"],"しぼう":["脂肪","死亡","志望"],"わすれる":["忘れる"],"わすれた":["忘れた"],"わすれない":["忘れない"],"わすれ":["忘れ"],"わすれて":["忘れて"],"わすれれる":["忘れれる"],"わすれられる":["忘れられる"],"わすれもの":["忘れ物"],"ぼうねんかい":["忘年会"],"いそがしい":["忙しい"],"いそがしかった":["忙しかった"],"いそがしくない":["忙しくない"],"いそがしくて":["忙しくて"],"せわしい":["忙しい"],"せわしかった":["忙しかった"],"せわしくない":["忙しくない"],"せわしくて":["忙しくて"],"いらえ":["応え"],"こたえ":["答え","答え","応え","答","応え"],"こたえる":["答える","応える"],"こたえた":["答えた","応えた"],"こたえない":["答えない","応えない"],"こたえて":["答えて","応えて"],"こたえれる":["答えれる","応えれる"],"こたえられる":["答えられる","応えられる"],"おうじて":["応じて"],"おうぼ":["応募"],"おうたい":["応対"],"おうえん":["応援"],"おうえんだん":["応援団"],"おうえんか":["応援歌"],"おうよう":["応用"],"おうとう":["応答"],"ちゅうこく":["忠告"],"ちゅうじつ":["忠実"],"まめ":["豆","忠実"],"こころよく":["快く"],"かいしょう":["解消","快勝"],"かいきょ":["快挙"],"かいらく":["快楽"],"けらく":["快楽"],"かいみん":["快眠"],"かいそく":["快速"],"かいてき":["快適"],"かいしょく":["快食"],"ねんのため":["念のため"],"ねんいり":["念入り"],"ねんがん":["念願"],"いかり":["怒り","怒り"],"いかる":["怒る"],"いからない":["怒らない"],"いかって":["怒って"],"いかられる":["怒られる"],"おこる":["起こる","怒る"],"おこった":["起こった","怒った"],"おこらない":["起こらない","怒らない"],"おこり":["起こり","怒り","起こり"],"おこって":["起こって","怒って"],"おこれる":["起これる","怒れる"],"おこられる":["起こられる","怒られる"],"どとう":["怒涛"],"こわ":["怖"],"おもい":["思い","思い","想い","重い","想い"],"おもいがけず":["思いがけず"],"おもいがけない":["思いがけない"],"おもいがけなかった":["思いがけなかった"],"おもいがけなくない":["思いがけなくない"],"おもいがけなくて":["思いがけなくて"],"おもいきや":["思いきや"],"おもいっきり":["思いっきり"],"おもいつく":["思いつく"],"おもいついた":["思いついた"],"おもいつかない":["思いつかない"],"おもいつき":["思いつき"],"おもいついて":["思いついて"],"おもいつける":["思いつける"],"おもいつかれる":["思いつかれる"],"おもいのまま":["思いのまま"],"おもいやり":["思いやり"],"おもいいれ":["思い入れ"],"おもいで":["思い出","想い出"],"おもいだす":["思い出す"],"おもいだした":["思い出した"],"おもいださない":["思い出さない"],"おもいだし":["思い出し"],"おもいだして":["思い出して"],"おもいだせる":["思い出せる"],"おもいだされる":["思い出される"],"おもいでばなし":["思い出話"],"おもいきって":["思い切って"],"おもいきり":["思い切り"],"おもいこみ":["思い込み"],"おもいどおり":["思い通り"],"おもう":["思う","想う"],"おもった":["思った","想った"],"おもわない":["思わない","想わない"],"おもって":["思って","想って"],"おもえる":["思える","思える","想える"],"おもわれる":["思われる","思われる","想われる"],"おもうに":["思うに"],"おもうまま":["思うまま"],"おもうぞんぶん":["思う存分"],"おもえた":["思えた"],"おもえない":["思えない"],"おもえ":["思え"],"おもえて":["思えて"],"おもえれる":["思えれる"],"おもえられる":["思えられる"],"おもわず":["思わず"],"おもわせる":["思わせる"],"おもわせた":["思わせた"],"おもわせない":["思わせない"],"おもわせ":["思わせ"],"おもわせて":["思わせて"],"おもわせれる":["思わせれる"],"おもわせられる":["思わせられる"],"おもわぬ":["思わぬ"],"おもわれた":["思われた"],"おもわれない":["思われない"],"おもわれ":["思われ"],"おもわれて":["思われて"],"おもわれれる":["思われれる"],"おもわれられる":["思われられる"],"おもわく":["思惑"],"しそう":["思想"],"ししゅんき":["思春期"],"しあん":["思案"],"しこうかいろ":["思考回路"],"たいだ":["怠惰"],"たいまん":["怠慢"],"いそいで":["急いで","急いで"],"いそぎ":["急ぎ","急ぎ"],"いそぐ":["急ぐ"],"いそいだ":["急いだ"],"いそがない":["急がない"],"いそげる":["急げる"],"いそがれる":["急がれる"],"きゅうに":["急に"],"きゅうじょうしょう":["急上昇"],"きゅうぞう":["急増"],"きゅうせい":["急性"],"きゅうげき":["急激"],"きゅうらく":["急落"],"きゅうこう":["急行"],"きゅうきょ":["急遽"],"さが":["性"],"せいべつ":["性別"],"せいかく":["性格","正確"],"せいてき":["性的"],"せいのう":["性能"],"せいしつ":["性質"],"あやしい":["怪しい"],"あやしかった":["怪しかった"],"あやしくない":["怪しくない"],"あやしくて":["怪しくて"],"あやしげ":["怪しげ"],"かいじん":["怪人"],"けが":["怪我"],"かいぶつ":["怪物"],"かいじゅう":["怪獣"],"こいしい":["恋しい"],"こいしかった":["恋しかった"],"こいしくない":["恋しくない"],"こいしくて":["恋しくて"],"こいする":["恋する"],"こいびと":["恋人"],"こいこころ":["恋心"],"こいごころ":["恋心"],"れんあい":["恋愛"],"おそらく":["恐らく"],"おそるおそる":["恐る恐る"],"おそれ":["恐れ"],"おそれがある":["恐れがある"],"おそろしい":["恐ろしい"],"おそろしかった":["恐ろしかった"],"おそろしくない":["恐ろしくない"],"おそろしくて":["恐ろしくて"],"きょうふ":["恐怖"],"くふ":["恐怖"],"きょうふしょう":["恐怖症"],"きょうりゅう":["恐竜"],"きょうしゅく":["恐縮"],"こうれい":["恒例","高齢"],"はじ":["恥"],"はずかしい":["恥ずかしい"],"はずかしかった":["恥ずかしかった"],"はずかしくない":["恥ずかしくない"],"はずかしくて":["恥ずかしくて"],"うらみ":["恨み"],"おんし":["恩師"],"おんけい":["恩恵"],"おんがえし":["恩返し"],"おき":["息","起き","置き","沖"],"むすこ":["息子","息"],"むすこさん":["息子さん"],"いきぬき":["息抜き"],"めぐみ":["恵み"],"えびす":["恵比寿"],"ゑびす":["恵比寿"],"くい":["食い","悔い","杭"],"くやしい":["悔しい"],"くやしかった":["悔しかった"],"くやしくない":["悔しくない"],"くやしくて":["悔しくて"],"くやしさ":["悔しさ"],"さとり":["悟り"],"ゆうゆう":["悠々"],"ゆうきゅう":["有給","悠久"],"かんじゃ":["患者"],"なやみ":["悩み","悩み"],"なやむ":["悩む"],"なやんだ":["悩んだ"],"なやまない":["悩まない"],"なやんで":["悩んで"],"なやまれる":["悩まれる"],"あく":["悪","開く","空く"],"にくい":["悪い","悪い"],"にくかった":["悪かった"],"にくくない":["悪くない"],"にくくて":["悪くて"],"わるい":["悪い"],"わるかった":["悪かった"],"わるくない":["悪くない"],"わるくて":["悪くて"],"わるさ":["悪さ"],"あし":["足","脚","悪し"],"あくにん":["悪人"],"あっか":["悪化"],"あっこう":["悪口"],"わるくち":["悪口"],"わるぐち":["悪口"],"あくむ":["悪夢"],"あくてんこう":["悪天候"],"あくえいきょう":["悪影響"],"あくやく":["悪役"],"あくじゅんかん":["悪循環"],"あくとく":["悪徳"],"あくい":["悪意"],"おかん":["悪感"],"あくせん":["悪戦"],"あくせんくとう":["悪戦苦闘"],"あくぎ":["悪戯"],"いたずら":["悪戯"],"わるもの":["悪者"],"あくしつ":["悪質"],"あくま":["悪魔"],"かなしかった":["悲しかった"],"かなしくない":["悲しくない"],"かなしくて":["悲しくて"],"かなしみ":["悲しみ"],"ひげき":["悲劇"],"ひさん":["悲惨"],"ひめい":["悲鳴"],"もんもん":["悶々"],"もんぜつ":["悶絶"],"なさけない":["情けない"],"なさけなかった":["情けなかった"],"なさけなくない":["情けなくない"],"なさけなくて":["情けなくて"],"じょうせい":["情勢"],"じょうほうこうかん":["情報交換"],"じょうほうしゅうしゅう":["情報収集"],"じょうほうていきょう":["情報提供"],"じょうほうげん":["情報源"],"じょうほうはっしん":["情報発信"],"じょうほうし":["情報誌"],"じょうほうりょう":["情報量"],"じょうけい":["情景"],"じょうねつ":["情熱"],"じょうしょ":["情緒"],"じょうちょ":["情緒"],"わくせい":["惑星"],"おしい":["惜しい"],"おしかった":["惜しかった"],"おしくない":["惜しくない"],"おしくて":["惜しくて"],"おしくも":["惜しくも"],"そうざい":["惣菜"],"ざんぱい":["惨敗"],"そうぞうりょく":["想像力"],"そうてい":["想定"],"そうていがい":["想定外"],"たのしみ":["楽しみ","楽しみ","愉しみ"],"ゆかい":["愉快"],"いみ":["意味","斎"],"いみふめい":["意味不明"],"いみあい":["意味合い"],"いとてき":["意図的"],"いじ":["維持","意地"],"いじわる":["意地悪"],"いよく":["意欲"],"いきごみ":["意気込み"],"いぎ":["意義","異議"],"いけん":["意見","違憲"],"いけんこうかん":["意見交換"],"いしき":["意識"],"がくぜん":["愕然"],"おろか":["愚か"],"ぐち":["愚痴"],"いとしい":["愛しい"],"いとしかった":["愛しかった"],"いとしくない":["愛しくない"],"いとしくて":["愛しくて"],"あいしてる":["愛してる"],"あいした":["愛した"],"あいさない":["愛さない"],"あいし":["愛し"],"あいして":["愛して"],"あいせる":["愛せる"],"あいされる":["愛される"],"あいすべき":["愛すべき"],"あいする":["愛する"],"めでる":["愛でる"],"めでた":["愛でた"],"めでない":["愛でない"],"めで":["愛で"],"めでて":["愛でて"],"めでれる":["愛でれる"],"めでられる":["愛でられる"],"あいらしい":["愛らしい"],"あいらしかった":["愛らしかった"],"あいらしくない":["愛らしくない"],"あいらしくて":["愛らしくて"],"あいじん":["愛人"],"あいこく":["愛国"],"あいこくしん":["愛国心"],"あいこう":["愛好"],"あいこうか":["愛好家"],"あいさい":["愛妻"],"まなむすめ":["愛娘"],"えひめけん":["愛媛県"],"あいきょう":["愛嬌"],"いとしご":["愛子"],"あいじょう":["愛情"],"あいそ":["愛想"],"あいそう":["愛想"],"あいけん":["愛犬"],"あいびょう":["愛猫"],"あいよう":["愛用"],"あいじゃく":["愛着"],"あいちゃく":["愛着"],"あいちけん":["愛知県"],"あいしょう":["相性","愛称"],"あいどく":["愛読"],"あいご":["愛護"],"あいしゃ":["愛車"],"あいば":["愛馬"],"かんじる":["感じる"],"かんじた":["感じた"],"かんじない":["感じない"],"かんじて":["感じて"],"かんじれる":["感じれる"],"かんじられる":["感じられる"],"かんどう":["感動"],"かんたん":["簡単","感嘆"],"かんど":["感度"],"かんしん":["感心","関心"],"かんじょうてき":["感情的"],"かんじょういにゅう":["感情移入"],"かんそうぶん":["感想文"],"かんがい":["感慨"],"かんがいぶかい":["感慨深い"],"かんがいぶかかった":["感慨深かった"],"かんがいぶかくない":["感慨深くない"],"かんがいぶかくて":["感慨深くて"],"かんぷく":["感服"],"かんせん":["観戦","感染"],"かんせんしょう":["感染症"],"かんげき":["感激","観劇"],"かんかく":["感覚","間隔"],"かんしゃ":["感謝"],"かんしゃさい":["感謝祭"],"かんめい":["感銘"],"たいど":["態度"],"あわてて":["慌てて"],"しんちょう":["身長","慎重","新潮","新調"],"まんせい":["慢性"],"なれ":["慣れ","慣れ"],"なれた":["慣れた","慣れた"],"なれる":["慣れる","鳴れる","成れる"],"なれない":["慣れない"],"なれて":["慣れて"],"なれれる":["慣れれる"],"なれられる":["慣れられる"],"いあんふ":["慰安婦"],"いれい":["異例","慰霊"],"けいおう":["慶応"],"うい":["憂い"],"うかった":["憂かった"],"うくない":["憂くない"],"うくて":["憂くて"],"うれい":["憂い"],"ゆううつ":["憂鬱"],"にくしみ":["憎しみ"],"いきどおり":["憤り"],"あこがれ":["憧れ","憧れ"],"あこがれる":["憧れる"],"あこがれた":["憧れた"],"あこがれない":["憧れない"],"あこがれて":["憧れて"],"あこがれれる":["憧れれる"],"あこがれられる":["憧れられる"],"いこい":["憩い"],"けんぽう":["憲法"],"けんぽうかいせい":["憲法改正"],"こんしんかい":["懇親会"],"こんだんかい":["懇談会"],"ふところ":["懐"],"なつかし":["懐かし"],"なつかしい":["懐かしい"],"なつかしかった":["懐かしかった"],"なつかしくない":["懐かしくない"],"なつかしくて":["懐かしくて"],"かいせき":["解析","懐石"],"ちょうえき":["懲役"],"けんめい":["懸命"],"けねん":["懸念"],"けんしょう":["検証","懸賞"],"なりたつ":["成り立つ"],"なりたった":["成り立った"],"なりたたない":["成り立たない"],"なりたち":["成り立ち"],"なりたって":["成り立って"],"なりたてる":["成り立てる"],"なりたたれる":["成り立たれる"],"なりゆき":["成り行き"],"なられる":["鳴られる","成られる"],"せいじん":["星人","成人"],"せいじんしき":["成人式"],"せいぶん":["成分"],"せいこう":["成功"],"じょうじゅ":["成就"],"せいか":["成果","聖火","製菓"],"せいじゅく":["成熟"],"せいりつ":["成立"],"せいせき":["成績"],"せいちょう":["成長"],"せいちょうき":["成長期"],"わが":["我","我が"],"わろ":["我"],"われわれ":["我々"],"わがいえ":["我が家","我家"],"わがや":["我が家","我家"],"われながら":["我ながら"],"われら":["我ら"],"がまん":["我慢"],"がりゅう":["我流"],"あるいは":["或いは"],"いくさ":["戦","軍"],"たたかい":["戦い","戦い","闘い","闘い"],"たたかう":["戦う","闘う"],"たたかった":["戦った","闘った"],"たたかわない":["戦わない","闘わない"],"たたかって":["戦って","闘って"],"たたかえる":["戦える","闘える"],"たたかわれる":["戦われる","闘われる"],"せんそう":["戦争"],"せんりひん":["戦利品"],"せんぜん":["戦前"],"せんりょく":["戦力"],"せんゆう":["戦友"],"せんごく":["戦国"],"せんごくじだい":["戦国時代"],"せんじょう":["戦場","洗浄"],"せんし":["戦士"],"せんご":["戦後"],"せんりつ":["旋律","戦慄"],"せんぱん":["戦犯"],"せんりゃく":["戦略"],"せんりゃくてき":["戦略的"],"せんせん":["戦線"],"せんせき":["戦績"],"せんかん":["戦艦"],"せんじゅつ":["戦術"],"せんき":["戦記"],"せんしゃ":["洗車","戦車"],"せんとうき":["戦闘機"],"せんたい":["戦隊"],"たわむれ":["戯れ","戯れ"],"ざれる":["戯れる"],"ざれた":["戯れた"],"ざれない":["戯れない"],"ざれ":["戯れ"],"ざれて":["戯れて"],"ざれれる":["戯れれる"],"ざれられる":["戯れられる"],"じゃれる":["戯れる"],"じゃれた":["戯れた"],"じゃれない":["戯れない"],"じゃれ":["戯れ"],"じゃれて":["戯れて"],"じゃれれる":["戯れれる"],"じゃれられる":["戯れられる"],"たわむれる":["戯れる"],"たわむれた":["戯れた"],"たわむれない":["戯れない"],"たわむれて":["戯れて"],"たわむれれる":["戯れれる"],"たわむれられる":["戯れられる"],"ざれごと":["戯言","戯れ言"],"ぎげん":["戯言"],"たわこと":["戯言"],"たわごと":["戯言"],"とまどい":["戸惑い","戸惑い"],"とまどう":["戸惑う"],"とまどった":["戸惑った"],"とまどわない":["戸惑わない"],"とまどって":["戸惑って"],"とまどえる":["戸惑える"],"とまどわれる":["戸惑われる"],"もどし":["戻し","戻し"],"もどす":["戻す"],"もどした":["戻した"],"もどさない":["戻さない"],"もどして":["戻して"],"もどせる":["戻せる"],"もどされる":["戻される"],"もどってくる":["戻ってくる"],"もどってくた":["戻ってくた"],"もどってこない":["戻ってくない"],"もどってき":["戻ってき"],"もどってきて":["戻ってくて"],"もどってこれる":["戻ってくれる"],"もどってこられる":["戻ってくられる"],"もどり":["戻り","戻り"],"もどる":["戻る"],"もどった":["戻った"],"もどらない":["戻らない"],"もどって":["戻って"],"もどれる":["戻れる"],"もどられる":["戻られる"],"ふさ":["総","房"],"しょ":["所","書","諸","署"],"しょしょ":["所々"],"ところどころ":["所々"],"ところが":["所が"],"ところで":["所で"],"ところでは":["所では"],"ところへ":["所へ"],"ゆえん":["所以"],"しょざい":["所在"],"しょざいち":["所在地"],"しょぞく":["所属"],"しょとく":["所得"],"しょじ":["所持"],"しょゆう":["所有"],"しょよう":["所用","所要"],"しょぞう":["所蔵"],"いわゆる":["所謂"],"しょちょう":["所長"],"おうぎ":["扇"],"おおぎ":["扇"],"せんぷうき":["扇風機"],"とびら":["扉"],"てがける":["手がける"],"てがけた":["手がけた"],"てがけない":["手がけない"],"てがけ":["手がけ"],"てがけて":["手がけて"],"てがけれる":["手がけれる"],"てがけられる":["手がけられる"],"てごろ":["手頃","手ごろ"],"てづくり":["手作り","手づくり"],"てにする":["手にする"],"てにはいる":["手に入る"],"てにいれる":["手に入れる"],"てにいれた":["手に入れた"],"てにいれない":["手に入れない"],"てにいれ":["手に入れ"],"てにいれて":["手に入れて"],"てにいれれる":["手に入れれる"],"てにいれられる":["手に入れられる"],"てにとる":["手に取る"],"てのひら":["手のひら","掌"],"てをだす":["手を出す"],"てしごと":["手仕事"],"てつだい":["手伝い","手伝い"],"てつだう":["手伝う"],"てつだった":["手伝った"],"てつだわない":["手伝わない"],"てつだって":["手伝って"],"てつだえる":["手伝える"],"てつだわれる":["手伝われる"],"てもと":["手元"],"てさき":["手先"],"ていれ":["手入れ"],"てまえ":["手前"],"てめえ":["手前"],"てだすけ":["手助け"],"てぐち":["手口"],"てちょう":["手帳","手帖"],"てあて":["手当"],"てうち":["手打ち"],"てぬき":["手抜き"],"てもち":["手持ち"],"てかず":["手数"],"てすう":["手数"],"てすうりょう":["手数料"],"てりょうり":["手料理"],"てかき":["手書き"],"てがき":["手書き"],"てほん":["手本"],"しゅだん":["手段"],"しゅほう":["手法"],"てあらい":["手洗い"],"てがみ":["手紙"],"てつづき":["手続き","手続"],"てばさき":["手羽先"],"しゅげい":["手芸"],"しゅじゅつ":["手術"],"てぶくろ":["手袋"],"てせい":["手製"],"しゅき":["手記"],"しゅわ":["手話"],"てあし":["手足"],"てがる":["手軽"],"てはい":["手配"],"てま":["手間"],"てぎわ":["手際"],"てじゅん":["手順"],"てくび":["手首"],"さいのう":["才能"],"うたれる":["打たれる","打たれる"],"うたれた":["打たれた"],"うたれない":["打たれない"],"うたれ":["打たれ"],"うたれて":["打たれて"],"うたれれる":["打たれれる"],"うたれられる":["打たれられる"],"うちあげ":["打ち上げ"],"うちあわせ":["打ち合わせ","打合せ"],"うつ":["打つ","鬱"],"うたない":["打たない"],"うてる":["打てる"],"ぶった":["打った","振った"],"ぶたない":["打たない"],"ぶち":["打ち"],"ぶって":["打って","振って"],"ぶてる":["打てる"],"ぶたれる":["打たれる"],"だせき":["打席"],"だげき":["打撃"],"だがっき":["打楽器"],"だてん":["打点"],"だせん":["打線"],"だしゃ":["打者"],"はらい":["払い","払い"],"はらう":["払う"],"はらった":["払った"],"はらわない":["払わない"],"はらって":["払って"],"はらえる":["払える"],"はらわれる":["払われる"],"ふっしき":["払拭"],"ふっしょく":["払拭"],"あつかい":["扱い","扱い"],"あつかう":["扱う"],"あつかわない":["扱わない"],"あつかって":["扱って"],"あつかえる":["扱える"],"あつかわれる":["扱われる"],"ひはん":["批判"],"ひはんてき":["批判的"],"ひひょう":["批評"],"しょうち":["承知"],"しょうだく":["承諾"],"わざ":["技","業"],"ぎほう":["技法"],"ぎのう":["技能"],"ぎじゅつ":["技術"],"ぎじゅつてき":["技術的"],"ぎじゅつしゃ":["技術者"],"はあく":["把握"],"おさえ":["抑え","抑え","押さえ"],"おさえる":["抑える"],"おさえた":["抑えた"],"おさえない":["抑えない"],"おさえて":["抑えて"],"おさえれる":["抑えれる"],"おさえられる":["抑えられる"],"よくせい":["抑制"],"なげ":["投げ","投げ"],"なげる":["投げる"],"なげた":["投げた"],"なげない":["投げない"],"なげて":["投げて"],"なげれる":["投げれる"],"なげられる":["投げられる"],"とうか":["投下"],"とうよ":["投与"],"とうにゅう":["投入","豆乳"],"とうしゅじん":["投手陣"],"とうきゅう":["投球"],"とうひょう":["投票"],"とうこう":["投稿","登校"],"とうし":["投資"],"とうししんたく":["投資信託"],"とうしか":["投資家"],"こうせいぶっしつ":["抗生物質"],"こうぎ":["講義","抗議"],"おりおり":["折々"],"おりがみ":["折り紙"],"おりかえし":["折り返し"],"せっかく":["折角"],"ぬき":["抜き","抜き"],"ぬく":["抜く"],"ぬいた":["抜いた"],"ぬかない":["抜かない"],"ぬいて":["抜いて"],"ぬける":["抜ける","抜ける"],"ぬかれる":["抜かれる"],"ぬけた":["抜けた"],"ぬけない":["抜けない"],"ぬけ":["抜け"],"ぬけて":["抜けて"],"ぬけれる":["抜けれる"],"ぬけられる":["抜けられる"],"ぬけげ":["抜け毛"],"ばっすい":["抜粋"],"ばつぐん":["抜群"],"ひろう":["披露","疲労","拾う"],"ひろうえん":["披露宴"],"かかえ":["抱え","抱え"],"かかえる":["抱える"],"かかえた":["抱えた"],"かかえない":["抱えない"],"かかえて":["抱えて"],"かかえれる":["抱えれる"],"かかえられる":["抱えられる"],"いだく":["抱く"],"いだいた":["抱いた"],"いだかない":["抱かない"],"いだき":["抱き"],"いだいて":["抱いて"],"いだける":["抱ける"],"いだかれる":["抱かれる"],"だいた":["抱いた"],"だかない":["抱かない"],"だき":["抱き"],"だいて":["抱いて"],"だける":["抱ける"],"だかれる":["抱かれる"],"だっこ":["抱っこ"],"ほうふ":["豊富","抱負"],"ていこう":["抵抗"],"まっしょう":["抹消"],"まっちゃ":["抹茶"],"おし":["押し","押し"],"おして":["押して","押して"],"おす":["押す","雄"],"おした":["押した"],"おせる":["押せる"],"おされる":["押される"],"おしいれ":["押入れ"],"ちゅうしゅつ":["抽出"],"ちゅうせん":["抽選"],"になう":["担う"],"になった":["担った"],"になわない":["担わない"],"にない":["担い","煮ない"],"になって":["担って"],"になえる":["担える"],"になわれる":["担われる"],"たんにん":["担任"],"たんにんのせんせい":["担任の先生"],"たんぽ":["担保"],"たんとう":["担当"],"たんとうしゃ":["担当者"],"らち":["拉致"],"らちもんだい":["拉致問題"],"らあめん":["拉麺"],"ひょうし":["表紙","拍子","表し"],"ひょうしぬけ":["拍子抜け"],"はくしゅ":["拍手"],"はくしゃ":["拍車"],"きょひ":["拒否"],"きょぜつ":["拒絶"],"こうそく":["高速","拘束"],"つたない":["拙い"],"つたなかった":["拙かった"],"つたなくない":["拙くない"],"つたなくて":["拙くて"],"まずい":["拙い"],"まずかった":["拙かった"],"まずくない":["拙くない"],"まずくて":["拙くて"],"まねき":["招き","招き"],"まねきねこ":["招き猫"],"まねく":["招く"],"まねいた":["招いた"],"まねかない":["招かない"],"まねいて":["招いて"],"まねける":["招ける"],"まねかれる":["招かれる"],"しょうたい":["招待","正体"],"しょうたいじょう":["招待状"],"はいしゃく":["拝借"],"はいけい":["背景","拝啓"],"はいけん":["拝見"],"きょてん":["拠点"],"かくだい":["拡大"],"かくちょう":["拡張"],"こぶし":["拳"],"ごうもん":["拷問"],"ひろった":["拾った"],"ひろわない":["拾わない"],"ひろって":["拾って"],"ひろえる":["拾える"],"ひろわれる":["拾われる"],"もたせる":["持たせる"],"もたせた":["持たせた"],"もたせない":["持たせない"],"もたせ":["持たせ"],"もたせて":["持たせて"],"もたせれる":["持たせれる"],"もたせられる":["持たせられる"],"もちぬし":["持ち主"],"もちあじ":["持ち味"],"もちかえり":["持ち帰り"],"もちもの":["持ち物"],"もちこみ":["持ち込み"],"もっていく":["持っていく","持って行く"],"もってくる":["持ってくる"],"もってくた":["持ってくた"],"もってこない":["持ってくない"],"もってき":["持ってき"],"もってきて":["持ってくて"],"もってこれる":["持ってくれる"],"もってこられる":["持ってくられる"],"もってゆく":["持って行く"],"もった":["持った"],"もたない":["持たない"],"もって":["持って"],"もてる":["持てる","持てる"],"もたれる":["持たれる"],"もてた":["持てた"],"もてない":["持てない"],"もて":["面","持て"],"もてて":["持てて"],"もてれる":["持てれる"],"もてられる":["持てられる"],"じさん":["持参","自賛"],"じびょう":["持病"],"じぞく":["持続"],"じぞくかのう":["持続可能"],"おゆび":["指"],"ゆび":["指"],"しれい":["指令"],"ゆびさき":["指先"],"しなん":["指南"],"していせき":["指定席"],"しどういん":["指導員"],"しどうしゃ":["指導者"],"しきしゃ":["指揮者"],"してき":["指摘","私的"],"しすう":["指数"],"しひょう":["指標"],"しじ":["支持","指示","私事"],"ゆびわ":["指輪"],"ししん":["指針","私信"],"いどむ":["挑む"],"いどんだ":["挑んだ"],"いどまない":["挑まない"],"いどみ":["挑み"],"いどんで":["挑んで"],"いどまれる":["挑まれる"],"ちょうせん":["挑戦","朝鮮"],"ちょうせんしゃ":["挑戦者"],"ちょうはつ":["挑発"],"あげく":["挙句"],"きょしき":["挙式"],"あいさつ":["挨拶"],"ざせつ":["挫折"],"ぶり":["振り","振り"],"ふりつけ":["振り付け"],"ふりかえる":["振り返る"],"ふりかえった":["振り返った"],"ふりかえらない":["振り返らない"],"ふりかえり":["振り返り"],"ふりかえって":["振り返って"],"ふりかえれる":["振り返れる"],"ふりかえられる":["振り返られる"],"ふった":["降った","振った"],"ふらない":["降らない","振らない"],"ふって":["降って","振って"],"ふれる":["降れる","触れる","振れる"],"ふられる":["降られる","振られる"],"ぶらない":["振らない"],"ぶれる":["振れる"],"ぶられる":["振られる"],"ふるまい":["振る舞い"],"しんどう":["振動"],"そうにゅう":["挿入"],"とらえる":["捉える"],"とらえた":["捉えた"],"とらえない":["捉えない"],"とらえ":["捉え"],"とらえて":["捉えて"],"とらえれる":["捉えれる"],"とらえられる":["捉えられる"],"ねつぞう":["捏造"],"ほかく":["捕獲"],"そうさ":["操作","捜査"],"ささげる":["捧げる"],"ささげた":["捧げた"],"ささげない":["捧げない"],"ささげ":["捧げ"],"ささげて":["捧げて"],"ささげれる":["捧げれる"],"ささげられる":["捧げられる"],"すてる":["捨てる"],"すてた":["捨てた"],"すてない":["捨てない"],"すて":["捨て"],"すてて":["捨てて"],"すてれる":["捨てれる"],"すてられる":["捨てられる"],"そうじ":["掃除","精進"],"そうじき":["掃除機"],"じゅよ":["授与"],"じゅにゅう":["授乳"],"じゅぎょう":["授業"],"じゅぎょうちゅう":["授業中"],"たなごころ":["掌"],"はいしゅつ":["排出"],"はいじょ":["排除"],"がかり":["掛かり"],"かかる":["掛かる"],"かかった":["掛かった"],"かからない":["掛からない"],"かかって":["掛かって"],"かかれる":["書かれる","描かれる","掛かれる"],"かかられる":["掛かられる"],"かけ":["鶏","掛け","欠け","掛け","賭け"],"かける":["書ける","描ける","欠ける","掛ける"],"かけた":["欠けた","掛けた"],"かけない":["欠けない","掛けない"],"かけて":["欠けて","掛けて"],"かけれる":["欠けれる","掛けれる"],"かけられる":["欠けられる","掛けられる"],"かけあい":["掛け合い"],"かけごえ":["掛け声"],"おきて":["起きて","掟"],"さいしゅ":["採取"],"さいてん":["祭典","採点"],"さいよう":["採用"],"さいけつ":["採血"],"さいしゅう":["最終","採集"],"さがしに":["探しに"],"さがす":["探す"],"さがした":["探した"],"さがさない":["探さない"],"さがし":["探し"],"さがして":["探して"],"さがせる":["探せる"],"さがされる":["探される"],"さぐる":["探る"],"さぐった":["探った"],"さぐらない":["探らない"],"さぐり":["探り"],"さぐって":["探って"],"さぐれる":["探れる"],"さぐられる":["探られる"],"たんてい":["探偵"],"たんていだん":["探偵団"],"たんけん":["探検"],"たんけんたい":["探検隊"],"たんきゅう":["探求"],"たんさく":["探索"],"たんぼう":["探訪"],"せっする":["接する"],"せっきゃく":["接客"],"せっせん":["接戦"],"せってん":["接点"],"せっしゅ":["摂取","接種"],"せつぞく":["接続"],"せっしょく":["接触"],"せっきん":["接近"],"ひかえ":["控え"],"ひかえめ":["控えめ"],"こうじょ":["控除"],"すいしょう":["推奨","水晶"],"すいてい":["推定"],"すいそく":["推測"],"すいり":["推理"],"すいい":["推移"],"すいせん":["推薦","水仙"],"すいしん":["推進"],"そち":["措置"],"かかげる":["掲げる"],"かかげた":["掲げた"],"かかげない":["掲げない"],"かかげ":["掲げ"],"かかげて":["掲げて"],"かかげれる":["掲げれる"],"かかげられる":["掲げられる"],"けいじばん":["掲示板"],"けいさい":["掲載"],"つかむ":["掴む"],"つかんだ":["掴んだ"],"つかまない":["掴まない"],"つかみ":["掴み"],"つかんで":["掴んで"],"つかまれる":["掴まれる"],"そろい":["揃い","揃い"],"そろう":["揃う"],"そろった":["揃った"],"そろわない":["揃わない"],"そろって":["揃って","揃って"],"そろえる":["揃える"],"そろわれる":["揃われる"],"えがく":["描く"],"えがいた":["描いた"],"えがかない":["描かない"],"えがき":["描き"],"えがいて":["描いて"],"えがける":["描ける"],"えがかれる":["描かれる"],"かいた":["書いた","描いた"],"かかない":["書かない","描かない"],"かいて":["書いて","描いて"],"びょうしゃ":["描写"],"ていきょう":["提供"],"ていしゅつ":["提出"],"ていしょう":["提唱"],"ていけい":["提携"],"ていあん":["提案"],"ちょうちん":["提灯"],"ていげん":["提言"],"ていそ":["提訴"],"あげもの":["揚げ物"],"かんさん":["換算"],"かんざん":["換算"],"にぎり":["握り","握り"],"にぎる":["握る"],"にぎった":["握った"],"にぎらない":["握らない"],"にぎって":["握って"],"にぎれる":["握れる"],"にぎられる":["握られる"],"あくしゅ":["握手"],"えんじょ":["援助"],"えんご":["援護"],"ゆれ":["揺れ","揺れ"],"ゆれる":["揺れる"],"ゆれた":["揺れた"],"ゆれない":["揺れない"],"ゆれて":["揺れて"],"ゆれれる":["揺れれる"],"ゆれられる":["揺れられる"],"そんしょう":["損傷"],"そんしつ":["損失"],"そんがい":["損害"],"はんにゅう":["搬入"],"はんそう":["搬送"],"とうじょう":["登場","搭乗"],"とうさい":["搭載"],"たずさわる":["携わる"],"たずさわった":["携わった"],"たずさわらない":["携わらない"],"たずさわり":["携わり"],"たずさわって":["携わって"],"たずさわれる":["携われる"],"たずさわられる":["携わられる"],"けいたいかめら":["携帯カメラ"],"けいたいすとらっぷ":["携帯ストラップ"],"けいたいよう":["携帯用"],"けいたいでんわ":["携帯電話"],"げきちん":["撃沈"],"げきは":["撃破"],"げきたい":["撃退"],"てっきょ":["撤去"],"てっしゅう":["撤収"],"てっかい":["撤回"],"てったい":["撤退"],"さつえい":["撮影"],"ぼくめつ":["撲滅"],"ようご":["用語","擁護","養護"],"あやつる":["操る"],"あやつった":["操った"],"あやつらない":["操らない"],"あやつり":["操り"],"あやつって":["操って"],"あやつれる":["操れる"],"あやつられる":["操られる"],"ささえ":["支え","支え"],"ささえる":["支える"],"ささえた":["支えた"],"ささえない":["支えない"],"ささえて":["支えて"],"ささえれる":["支えれる"],"ささえられる":["支えられる"],"つっかえる":["支える"],"つっかえた":["支えた"],"つっかえない":["支えない"],"つっかえ":["支え"],"つっかえて":["支えて"],"つっかえれる":["支えれる"],"つっかえられる":["支えられる"],"ししゅつ":["支出"],"してん":["視点","支店"],"したく":["支度"],"しはらい":["支払い","支払い","支払"],"しはらう":["支払う"],"しはらった":["支払った"],"しはらわない":["支払わない"],"しはらって":["支払って"],"しはらえる":["支払える"],"しはらわれる":["支払われる"],"しじりつ":["支持率"],"しえん":["支援"],"しぶ":["支部","渋"],"しはい":["支配"],"あらため":["改め"],"あらためて":["改めて"],"かいめい":["解明","改名"],"かいぜん":["改善"],"かいてい":["改訂","改定","海底"],"かいあく":["改悪"],"かいさつ":["改札"],"かいちく":["改築"],"かいりょう":["改良"],"かいていばん":["改訂版"],"かいぞう":["改造"],"かいかく":["改革"],"せめ":["攻め","攻め","責め"],"せめる":["攻める","責める"],"せめた":["攻めた","責めた"],"せめない":["攻めない","責めない"],"せめれる":["攻めれる","責めれる"],"せめられる":["攻められる","責められる"],"こうげき":["攻撃"],"こうげきてき":["攻撃的"],"こうりゃく":["攻略"],"はなつ":["放つ"],"はなった":["放った"],"はなたない":["放たない"],"はなち":["放ち"],"はなって":["放って"],"はなてる":["放てる"],"はなたれる":["放たれる"],"ほうしゅつ":["放出"],"ほうえい":["放映"],"ほうき":["放棄"],"ほうろう":["放浪"],"ほうぼく":["放牧"],"ほうかご":["放課後"],"ほうだん":["放談"],"ほうそうきょく":["放送局"],"ほうだい":["放題","邦題"],"まつりごと":["政"],"せいとう":["政党","正当"],"せいふ":["政府"],"せいけん":["政権"],"せいけんこうたい":["政権交代"],"せいじ":["政治"],"せいじか":["政治家"],"せいじてき":["政治的"],"せいかい":["正解","政界"],"ゆえ":["故"],"ゆえに":["故に"],"こきょう":["故郷"],"ふるさと":["故郷"],"びんかん":["敏感"],"すくい":["救い","救い"],"すくう":["救う"],"すくった":["救った"],"すくわない":["救わない"],"すくって":["救って"],"すくえる":["救える"],"すくわれる":["救われる"],"きゅうせいしゅ":["救世主"],"きゅうしゅつ":["救出"],"きゅうじょ":["救助"],"きゅうめい":["救命"],"きゅうきゅう":["救急"],"きゅうきゅうしゃ":["救急車"],"きゅうえん":["救援"],"きゅうさい":["救済"],"やぶれる":["敗れる","破れる"],"やぶれた":["敗れた"],"やぶれない":["敗れない"],"やぶれ":["敗れ"],"やぶれて":["敗れて"],"やぶれれる":["敗れれる"],"やぶれられる":["敗れられる"],"はいぼく":["敗北"],"はいいん":["敗因"],"はいせん":["敗戦","配線"],"はいしゃ":["歯医者","敗者"],"はいたい":["敗退"],"おしえ":["教え","教え"],"おしえる":["教える"],"おしえた":["教えた"],"おしえない":["教えない"],"おしえて":["教えて"],"おしえれる":["教えれる"],"おしえられる":["教えられる"],"おしえご":["教え子"],"きょういん":["教員"],"きょうい":["脅威","驚異","教委"],"きょうしつ":["教室"],"きょうし":["教師"],"きょうじゅ":["教授"],"きょうざい":["教材"],"きょうかしょ":["教科書"],"きょうしゅう":["教習"],"きょうしゅうしょ":["教習所"],"きょうしゅうじょ":["教習所"],"きょういく":["教育"],"きょういくきほんほう":["教育基本法"],"きょういくいいんかい":["教育委員会"],"きょうくん":["教訓"],"きょうゆ":["教諭"],"あえて":["敢えて"],"さんざん":["散々"],"ちる":["散る"],"ちった":["散った"],"ちらない":["散らない"],"ちって":["散って"],"ちれる":["散れる"],"ちられる":["散られる"],"さんぽ":["散歩"],"さんぽみち":["散歩道"],"さんさく":["散策"],"さんざい":["散財"],"さんぱつ":["散髪"],"けいい":["経緯","敬意"],"けいあい":["敬愛"],"けいろうのひ":["敬老の日"],"けいえん":["敬遠"],"かず":["数"],"かずかず":["数々"],"かぞえる":["数える"],"かぞえた":["数えた"],"かぞえない":["数えない"],"かぞえ":["数え"],"かぞえて":["数えて"],"かぞえれる":["数えれる"],"かぞえられる":["数えられる"],"すうかげつ":["数ヶ月"],"すうにん":["数人"],"すうち":["数値"],"すうふん":["数分"],"すうじゅう":["数十"],"すうじゅうねん":["数十年"],"すうせん":["数千"],"すうめい":["数名"],"すうかい":["数回"],"かずおおく":["数多く"],"すうじ":["数字"],"すうがく":["数学"],"かずすくない":["数少ない"],"かずすくなかった":["数少なかった"],"かずすくなくない":["数少なくない"],"かずすくなくて":["数少なくて"],"すうねん":["数年"],"すうじつ":["数日"],"すうじつご":["数日後"],"すうじつかん":["数日間"],"すうじかん":["数時間"],"すうまい":["数枚"],"すうひゃく":["数百"],"すうびょう":["数秒"],"すうりょう":["数量"],"ととのえる":["整える"],"ととのえた":["整えた"],"ととのえない":["整えない"],"ととのえ":["整え"],"ととのえて":["整えて"],"ととのえれる":["整えれる"],"ととのえられる":["整えられる"],"せいたい":["整体","生態"],"せいび":["整備"],"せいけい":["整形"],"せいけいげか":["整形外科"],"せいり":["整理","生理"],"せいりせいとん":["整理整頓"],"せいとん":["整頓"],"せいこつ":["整骨"],"あだ":["敵"],"かたき":["敵"],"しきち":["敷地"],"しきい":["敷居"],"ふみ":["文","踏み"],"ぶんたい":["文体"],"ぶんぐ":["文具"],"ぶんか":["文化","文科"],"ぶんかてき":["文化的"],"ぶんかさい":["文化祭"],"ぶんかざい":["文化財"],"もんく":["文句"],"もんくなし":["文句なし"],"もじ":["文字"],"もんじ":["文字"],"もじばけ":["文字化け"],"もじどおり":["文字通り"],"ぶんがく":["文学"],"ぶんこ":["文庫"],"ぶんこぼん":["文庫本"],"ぶんぼうぐ":["文房具"],"ぶんさい":["文才"],"ぶんめい":["文明"],"ぶんしょ":["文書"],"もんじょ":["文書"],"ぶんぽう":["文法"],"ぶんけん":["文献"],"ぶんしょう":["文章"],"ぶんけい":["文系"],"ぶんげい":["文芸"],"もんぶ":["文部"],"もんぶかがくしょう":["文部科学省"],"ぶんめん":["文面"],"ぶんちょう":["文鳥"],"とます":["斗"],"りょうてい":["料亭"],"りょうり":["料理"],"りょうりにん":["料理人"],"りょうりや":["料理屋"],"りょうりてん":["料理店"],"りょうりきょうしつ":["料理教室"],"りょうきん":["料金"],"ななめ":["斜め"],"ななめに":["斜めに"],"しゃめん":["斜面"],"ざん":["残","斬"],"ざんしん":["斬新"],"ことわり":["断り","断り"],"ことわる":["断る"],"ことわった":["断った"],"ことわらない":["断らない"],"ことわって":["断って"],"ことわれる":["断れる"],"ことわられる":["断られる"],"だんこ":["断固"],"だんてい":["断定"],"だんねん":["断念"],"だんぜん":["断然"],"だんげん":["断言"],"だんじき":["断食"],"あたらしい":["新しい"],"あたらしかった":["新しかった"],"あたらしくない":["新しくない"],"あたらしくて":["新しくて"],"あたらしいもの":["新しいもの"],"あたらしく":["新しく"],"あらた":["新た"],"しんせかい":["新世界"],"しんせいき":["新世紀"],"しんじん":["新人"],"しんさく":["新作"],"しんとう":["浸透","新党"],"しんいり":["新入り"],"しんにゅうせい":["新入生"],"しんにゅうしゃいん":["新入社員"],"しんかん":["新刊","新館"],"しんそつ":["新卒"],"しんぴん":["新品"],"しんがた":["新型"],"しんぽう":["新報"],"しんこん":["新婚"],"しんこんりょこう":["新婚旅行"],"しんぷ":["親父","新譜","親爺","新婦"],"しんがっき":["新学期"],"しんきょ":["新居"],"しんねんかい":["新年会"],"しんかんせん":["新幹線"],"しんきゅう":["鍼灸","新旧"],"しんしゅん":["新春"],"しんきょく":["新曲"],"しんしょ":["新書"],"しんげつ":["新月"],"しんばし":["新橋"],"にいがた":["新潟"],"にいがたけん":["新潟県"],"しんせい":["申請","新生","神聖"],"しんせいかつ":["新生活"],"しんでん":["神田","新田"],"しんはつばい":["新発売"],"しんはっけん":["新発見"],"しんちゃく":["新着"],"しんしゅ":["新種"],"しんちく":["新築"],"しんまい":["新米"],"しんりょく":["新緑"],"しんぶん":["新聞"],"しんぶんしゃ":["新聞社"],"しんぶんし":["新聞紙"],"しんぶんきじ":["新聞記事"],"しんぶんきしゃ":["新聞記者"],"しんめ":["新芽"],"しんそう":["真相","新装","深層"],"しんせいひん":["新製品"],"しんきろく":["新記録"],"しんせつ":["親切","新設"],"しんしゃ":["新車"],"しんせん":["新鮮","新選"],"しんろう":["新郎"],"かたがた":["方々"],"ほうぼう":["方々"],"ほうがいい":["方がいい","方が良い"],"ほうがよい":["方が良い","方がよい"],"ほうこうせい":["方向性"],"ほうしき":["方式"],"ほうほう":["方法"],"ほうていしき":["方程式"],"ほうげん":["方言"],"ほうしん":["方針"],"ほうめん":["方面"],"せこう":["施工","施行"],"しさく":["試作","施策"],"せぎょう":["施行"],"しじゅつ":["施術"],"しせつ":["施設","私設"],"たびする":["旅する"],"たびにん":["旅人"],"たびびと":["旅人"],"りょじん":["旅人"],"たびさき":["旅先"],"たびにっき":["旅日記"],"たびだち":["旅立ち","旅立ち"],"たびだつ":["旅立つ"],"たびだった":["旅立った"],"たびだたない":["旅立たない"],"たびだって":["旅立って"],"たびだてる":["旅立てる"],"たびだたれる":["旅立たれる"],"りょこう":["旅行"],"りょこうがいしゃ":["旅行会社"],"りょこうき":["旅行記"],"りょひ":["旅費"],"たびじ":["旅路"],"りょかん":["旅館"],"せんぷう":["旋風"],"つじかぜ":["旋風"],"つむじかぜ":["旋風"],"やから":["族","輩"],"すでに":["既に"],"すんでに":["既に"],"きこん":["既婚"],"きそん":["既存"],"にち":["日"],"にちにち":["日々","日日"],"ひび":["日々","日日"],"ひごろ":["日頃","日ごろ"],"ひにち":["日日","日にち"],"ひにひに":["日に日に"],"ひのまる":["日の丸"],"ひので":["日の出"],"にっちゅう":["日中"],"ひなか":["日中"],"ひづけ":["日付","日付け"],"にっこう":["日光"],"にっかん":["日刊","日韓"],"ひなた":["日向"],"ひなたぼっこ":["日向ぼっこ"],"ひより":["日和"],"にっぽう":["日報"],"にちや":["日夜"],"ひざし":["日差し","陽射し"],"ひがえり":["日帰り"],"にちじょう":["日常"],"にちじょうせいかつ":["日常生活"],"にちじょうさはんじ":["日常茶飯事"],"ひあたり":["日当たり"],"にっすう":["日数"],"ひかず":["日数"],"にちじ":["日時"],"ひぐらし":["日暮らし"],"にちよう":["日曜"],"にちようび":["日曜日"],"ひがわり":["日替り","日替わり"],"にっちょう":["日朝"],"にっぽん":["日本"],"にほんしりーず":["日本シリーズ"],"にっぽんいち":["日本一"],"にほんいち":["日本一"],"にっぽんじん":["日本人"],"にほんじん":["日本人"],"にほんきぎょう":["日本企業"],"にほんぜんこく":["日本全国"],"にほんきょうさんとう":["日本共産党"],"にほんれっとう":["日本列島"],"にっぽんはつ":["日本初"],"にほんはつ":["日本初"],"にほんし":["日本史"],"にほんかくち":["日本各地"],"にほんこくない":["日本国内"],"にほんこくけんぽう":["日本国憲法"],"にほんこくみん":["日本国民"],"にほんせいふ":["日本政府"],"にほんりょうり":["日本料理"],"にほんじかん":["日本時間"],"にっぽんかい":["日本海"],"にほんかい":["日本海"],"にほんてき":["日本的"],"にほんけいざい":["日本経済"],"にほんせい":["日本製"],"にっぽんご":["日本語"],"にほんご":["日本語"],"にほんごはん":["日本語版"],"にほんぐん":["日本軍"],"にほんしゅ":["日本酒"],"にほんしょく":["日本食"],"ひやけ":["日焼け"],"ひやけどめ":["日焼け止め"],"にってい":["日程"],"ひたち":["日立"],"にちべい":["日米"],"にっけい":["日経","日系"],"にっけいしんぶん":["日経新聞"],"にっき":["日記"],"にっきちょう":["日記帳"],"にっし":["日誌"],"にっか":["日課"],"にちぎん":["日銀"],"にちろく":["日録"],"ひあい":["日間"],"ひかげ":["日陰"],"だんな":["旦那"],"きゅうさく":["旧作"],"うまみ":["甘味","甘み","旨み","旨味"],"はや":["早"],"はよ":["早"],"そうそう":["早々"],"はやばや":["早々"],"はやい":["早い","速い"],"はやかった":["早かった","速かった"],"はやくない":["早くない","速くない"],"はやくて":["早くて","速くて"],"はやく":["早く","速く"],"はやくから":["早くから"],"はやくも":["早くも"],"はやめ":["早め"],"はやめに":["早めに"],"はやね":["早寝"],"さっきゅう":["早急"],"そうきゅう":["早急"],"そうちょう":["早朝","総長"],"そうき":["早期"],"わさだ":["早稲田"],"わせだ":["早稲田"],"さなえ":["早苗"],"はやおき":["早起き"],"そうたい":["早退","総体"],"さっそく":["早速"],"おうせい":["旺盛"],"こぶ":["昆布"],"こんぶ":["昆布"],"こんちゅう":["昆虫"],"しょうかく":["昇格"],"みん":["明"],"あかす":["明かす"],"あかした":["明かした"],"あかさない":["明かさない"],"あかし":["証","明かし"],"あかして":["明かして"],"あかせる":["明かせる"],"あかされる":["明かされる"],"あかり":["灯","明かり","灯り"],"あけ":["明け","開け","朱","緋"],"あけましておめでとうございます":["明けましておめでとうございます"],"あけがた":["明け方"],"あきらか":["明らか"],"あかるい":["明るい"],"あかるかった":["明るかった"],"あかるくない":["明るくない"],"あかるくて":["明るくて"],"あかるさ":["明るさ"],"あさって":["明後日"],"みょうごにち":["明後日"],"めいかい":["明快"],"あした":["明日","朝"],"あす":["明日"],"みょうにち":["明日"],"めいじ":["明治"],"あからさま":["明白"],"めいはく":["明白"],"めいかく":["明確"],"めいき":["明記"],"むかし":["昔"],"むかしながら":["昔ながら"],"むかしばなし":["昔話"],"せいざ":["星座","正座"],"ほしぞら":["星空"],"はえる":["映える"],"はえた":["映えた"],"はえない":["映えない"],"はえて":["映えて"],"はえれる":["映えれる"],"はえられる":["映えられる"],"えいぞう":["映像"],"えいが":["映画"],"えいがか":["映画化"],"えいがかんとく":["映画監督"],"えいがさい":["映画祭"],"えいがひょう":["映画評"],"えいがおんがく":["映画音楽"],"えいがかん":["映画館"],"はるいちばん":["春一番"],"はるやすみ":["春休み"],"はるさき":["春先"],"しゅんかしゅうとう":["春夏秋冬"],"しゅんき":["春季"],"はるまき":["春巻き"],"しゅんじゅう":["春秋"],"はるあき":["春秋"],"しゅんう":["春雨"],"はるさめ":["春雨"],"さくこん":["昨今"],"さっこん":["昨今"],"さくや":["昨夜"],"さくねん":["昨年"],"さくねんど":["昨年度"],"きのう":["昨日","機能"],"さくじつ":["昨日"],"きのうきょう":["昨日今日"],"さくばん":["昨晩"],"ぜひ":["是非"],"ぜひとも":["是非とも"],"ぜひぜひ":["是非是非"],"ひるごはん":["昼ご飯"],"ひるさがり":["昼下がり"],"ひるやすみ":["昼休み"],"ひるまえ":["昼前"],"ちゅうや":["昼夜"],"ひるね":["昼寝"],"ひるどき":["昼時"],"ひるすぎ":["昼過ぎ"],"ひるま":["昼間"],"ちゅうしょく":["昼食"],"ちゅうじき":["昼食"],"ひるげ":["昼食"],"ちゅうはん":["昼飯"],"ひるはん":["昼飯"],"ひるめし":["昼飯"],"どき":["時"],"ときどき":["時々"],"ときに":["時に"],"ときには":["時には"],"じじ":["時事","爺","祖父"],"じじもんだい":["時事問題"],"じだい":["時代"],"じだいげき":["時代劇"],"じこく":["時刻","自国"],"じこくひょう":["時刻表"],"じはん":["時半"],"じさ":["時差"],"ときおり":["時折"],"じき":["時期","直","次期"],"じくう":["時空"],"じきゅう":["自給","時給"],"ときはかり":["時計"],"とけい":["時計"],"じひょう":["時評"],"じそく":["時速","自足"],"じかん":["時間","次官"],"じかんがかかる":["時間がかかる"],"じかんのもんだい":["時間の問題"],"じかんたい":["時間帯"],"ばんごはん":["晩御飯","晩ご飯"],"ばんねん":["晩年"],"ばんしゅう":["晩秋"],"ばんしゃく":["晩酌"],"ばんめし":["晩飯"],"ふきゅう":["普及"],"ふだん":["普段"],"ふだんぎ":["普段着"],"ふつう":["普通"],"けしき":["景色"],"けいかん":["景観","警官"],"はれ":["晴れ","晴","晴れ","腫れ"],"はれて":["晴れて","晴れて"],"はれた":["晴れた"],"はれない":["晴れない"],"はれれる":["晴れれる"],"はれられる":["晴れられる"],"はれま":["晴れ間"],"せいてん":["晴天"],"あかつき":["暁"],"いとま":["暇"],"ひま":["暇","隙"],"ひまつぶし":["暇つぶし"],"ひまなとき":["暇な時"],"ひまじん":["暇人"],"しょちゅう":["暑中"],"しょちゅうおみまい":["暑中お見舞い"],"しょちゅうおみまいもうしあげます":["暑中お見舞い申し上げます"],"あたたかい":["暖かい","温かい"],"あたたかかった":["暖かかった","温かかった"],"あたたかくない":["暖かくない","温かくない"],"あたたかくて":["暖かくて","温かくて"],"あったかい":["暖かい","温かい"],"あったかかった":["暖かかった","温かかった"],"あったかくない":["暖かくない","温かくない"],"あったかくて":["暖かくて","温かくて"],"あたたかさ":["暖かさ"],"だんとう":["暖冬"],"だんぼう":["暖房"],"くらかった":["暗かった"],"くらくない":["暗くない"],"くらくて":["暗くて"],"あんさつ":["暗殺"],"あんじ":["暗示"],"あんき":["暗記"],"くらやみ":["暗闇"],"あんこく":["暗黒"],"こよみ":["暦"],"れき":["歴","暦"],"しばらく":["暫く"],"ざんてい":["暫定"],"くらし":["暮らし","暮らし"],"くらした":["暮らした"],"くらさない":["暮らさない"],"くらして":["暮らして"],"くらせる":["暮らせる"],"くらされる":["暮らされる"],"くれ":["暮れ","暮れ"],"くれる":["暮れる"],"くれた":["暮れた"],"くれない":["紅","暮れない"],"くれて":["暮れて"],"くれれる":["暮れれる"],"くれられる":["暮れられる"],"あばれる":["暴れる"],"あばれた":["暴れた"],"あばれない":["暴れない"],"あばれ":["暴れ"],"あばれて":["暴れて"],"あばれれる":["暴れれる"],"あばれられる":["暴れられる"],"あばれんぼう":["暴れん坊"],"ぼうりょく":["暴力"],"ぼうどう":["暴動"],"ぼうらく":["暴落"],"ぼうこう":["暴行"],"ぼうげん":["暴言"],"ばくろ":["暴露"],"くもりぞら":["曇り空"],"あいまい":["曖昧"],"ようび":["曜日"],"いわく":["曰く"],"いわいた":["曰いた"],"いわかない":["曰かない"],"いわき":["曰き"],"いわいて":["曰いて"],"いわける":["曰ける"],"いわかれる":["曰かれる"],"くせ":["曲","癖"],"くま":["曲","熊","阿"],"まが":["曲"],"まがり":["曲がり","曲がり"],"まがる":["曲がる"],"まがった":["曲がった"],"まがらない":["曲がらない"],"まがって":["曲がって"],"まがれる":["曲がれる"],"まがられる":["曲がられる"],"きょくめい":["曲名"],"きょくもく":["曲目"],"きょくせん":["曲線"],"ふけ":["更","深"],"さらなる":["更なる"],"さらに":["更に"],"こうねんき":["更年期"],"こうしん":["更新","行進"],"こうしんりれき":["更新履歴"],"かきかた":["書き方"],"かきこみ":["書き込み","書き込み"],"かきこむ":["書き込む"],"かきこんだ":["書き込んだ"],"かきこまない":["書き込まない"],"かきこんで":["書き込んで"],"かきこまれる":["書き込まれる"],"しょてん":["書店"],"しょこ":["書庫"],"しょぼう":["書房"],"しょさい":["書斎"],"しょもつ":["書物"],"しょせき":["書籍"],"しょきちょう":["書記長"],"しょひょう":["書評"],"しょどう":["書道"],"しょるい":["書類"],"まんじゅしゃげ":["曼珠沙華"],"もっとも":["最も"],"さいちゅう":["最中"],"さなか":["最中"],"もなか":["最中"],"さいてい":["最低"],"さいていげん":["最低限"],"さいゆうせん":["最優先"],"さいゆうしゅう":["最優秀"],"さいせんたん":["最先端"],"さいしょ":["最初"],"さいぜんれつ":["最前列"],"さいぜんせん":["最前線"],"さいぜん":["最善"],"さいだい":["最大","歳代"],"さいだいげん":["最大限"],"もより":["最寄り"],"さいしょう":["最小"],"さいしょうげん":["最小限"],"さいねんしょう":["最年少"],"さいきょう":["最強"],"さいご":["最後","最期"],"さいごのさいごに":["最後の最後に"],"さいごまで":["最後まで"],"さいあく":["最悪"],"さいあい":["最愛"],"さいしん":["最新"],"さいしんにゅーす":["最新ニュース"],"さいしんじょうほう":["最新情報"],"さいしんばん":["最新版"],"さいたん":["最短"],"さいしゅうかい":["最終回"],"さいしゅうび":["最終日"],"さいしゅうこうしん":["最終更新"],"さいしゅうてき":["最終的"],"さいしゅうしょう":["最終章"],"さいきん":["最近","細菌"],"さいてき":["最適"],"さいちょう":["最長"],"さいこうほう":["最高峰"],"さいこうきゅう":["最高級"],"さいこうさい":["最高裁"],"がつ":["月"],"げつ":["月"],"げっか":["月下"],"がつちゅう":["月中"],"げつちゅう":["月中"],"つきなか":["月中"],"げつちゅうじゅん":["月中旬"],"げっこう":["月光"],"げっかん":["月刊","月間"],"つきべつ":["月別"],"げっしゅう":["月収"],"つきよ":["月夜"],"がっぴ":["月日"],"つきひ":["月日"],"げつよう":["月曜"],"げつようび":["月曜日"],"げつまつ":["月末"],"つきずえ":["月末"],"つきみ":["月見"],"つきごろ":["月頃"],"げつがく":["月額"],"ゆうする":["有する"],"ありがたい":["有難い","有り難い"],"ありがたかった":["有難かった","有り難かった"],"ありがたくない":["有難くない","有り難くない"],"ありがたくて":["有難くて","有り難くて"],"ありがとう":["有難う","有り難う"],"ありがとうございます":["有難うございます","有り難うございます"],"ゆうり":["有利"],"ゆうりょく":["有力"],"ゆうめい":["有名"],"ゆうめいじん":["有名人"],"ゆうがい":["有害"],"ゆうし":["融資","有志"],"ゆういぎ":["有意義"],"ゆうすう":["有数"],"ありあけ":["有明"],"ありさま":["有様"],"ありよう":["有様"],"ゆうけんしゃ":["有権者"],"ゆうむ":["有無"],"ゆうえき":["有益"],"ゆうざい":["有罪"],"ゆうげん":["有限"],"ゆうげんがいしゃ":["有限会社"],"うちょうてん":["有頂天"],"ぶく":["服"],"ふくよう":["服用"],"ふくそう":["服装"],"ろうほう":["朗報"],"ろうどく":["朗読"],"のぞましい":["望ましい"],"のぞましかった":["望ましかった"],"のぞましくない":["望ましくない"],"のぞましくて":["望ましくて"],"のぞむ":["望む","臨む"],"のぞんだ":["望んだ","臨んだ"],"のぞまない":["望まない","臨まない"],"のぞんで":["望んで","臨んで"],"のぞまれる":["望まれる","臨まれる"],"ぼうげつ":["望月"],"もちづき":["望月"],"ぼうえん":["望遠"],"あさ":["朝","麻"],"あさごはん":["朝ご飯"],"あさいち":["朝一"],"あさいちばん":["朝一番"],"ちょうかん":["長官","朝刊"],"あさゆう":["朝夕"],"ちょうせき":["朝夕"],"あさがた":["朝方"],"あさひしんぶん":["朝日新聞"],"あさはやく":["朝早く"],"あさばん":["朝晩"],"あさやけ":["朝焼け"],"あされん":["朝練"],"あさおき":["朝起き"],"あさがお":["朝顔"],"ちょうしょく":["朝食"],"ちょうせんじん":["朝鮮人"],"ちょうせんはんとう":["朝鮮半島"],"きたい":["期待","機体"],"きたいどおり":["期待通り"],"きじつ":["期日"],"きにち":["期日"],"きまつ":["期末"],"きかんちゅう":["期間中"],"きげん":["機嫌","期限","起源"],"きげんぎれ":["期限切れ"],"もく":["木","目"],"きぎ":["木々"],"このした":["木の下"],"このもと":["木の下"],"きのみ":["木の実"],"もっこう":["木工"],"もくよう":["木曜"],"もくようび":["木曜日"],"もくざい":["木材"],"もくせい":["木製"],"もくぞう":["木造"],"こかげ":["木陰"],"ひつじ":["未","羊"],"いまだ":["未だ"],"まだ":["未だ"],"いまだに":["未だに"],"みかんせい":["未完成"],"みてい":["未定"],"みせいねん":["未成年"],"みめい":["未明"],"みらい":["未来"],"みまん":["未満"],"みじゅく":["未熟"],"みち":["道","路","未知"],"みかくにん":["未確認"],"みもん":["未聞"],"みすい":["未遂"],"すえ":["末"],"すえっこ":["末っ子"],"すえに":["末に"],"まっき":["末期"],"まつご":["末期"],"すえながく":["末永く"],"ほんの":["本の"],"ほんかいぎ":["本会議"],"ほんい":["本位"],"ほんたい":["本体"],"ほんさく":["本作"],"ほんしょ":["本初","本書"],"ほんみょう":["本名"],"ほんめい":["本名","本命"],"ほんごく":["本国"],"ほんど":["本土"],"ほんどう":["本堂"],"ほんば":["本場"],"ほんるいだ":["本塁打"],"ほんけ":["本家"],"ほんおく":["本屋"],"ほんや":["本屋"],"ほんしゅう":["本州"],"ほんねん":["本年"],"ほんてん":["本店"],"ほんと":["本当"],"ほんとう":["本当"],"ほんとうに":["本当に"],"ほんとに":["本当に"],"ほんしん":["本心"],"ほんきょち":["本拠地"],"ほんすう":["本数"],"ほんぶん":["本文"],"ほんもん":["本文"],"ほんじつ":["本日"],"ほんらい":["本来"],"ほんらいなら":["本来なら"],"ほんかく":["本格"],"ほんかくてき":["本格的"],"ほんだな":["本棚"],"ほんぎょう":["本業"],"ほんき":["本気"],"ほんもの":["本物"],"ほんばん":["本番"],"ほんめ":["本目"],"ほんしゃ":["本社"],"ほんじゃ":["本社"],"ほんたて":["本立て"],"ほんせん":["本線"],"ほんぺん":["本編"],"ほんしょく":["本職"],"ほんのう":["本能"],"ほんぽ":["本舗"],"ほんしつ":["本質"],"ほんしつてき":["本質的"],"ほんぶ":["本部"],"ほんね":["本音"],"ほんりょう":["本領"],"ほんだい":["本題"],"ほんがん":["本願"],"ほんかん":["本館"],"ふだ":["札"],"さっぽろ":["札幌"],"つくえ":["机"],"すもも":["李"],"あんず":["杏"],"あんにん":["杏仁"],"きょうにん":["杏仁"],"あんにんどうふ":["杏仁豆腐"],"きょうにんどうふ":["杏仁豆腐"],"ざいりょう":["材料"],"むら":["村"],"つえ":["杖"],"たば":["束"],"じょうけん":["条件"],"じょうれい":["条例"],"じょうやく":["条約"],"きたる":["来る"],"きたった":["来った"],"きたらない":["来らない"],"きたり":["来り"],"きたって":["来って"],"きたれる":["来れる"],"きたられる":["来られる"],"くる":["来る"],"くた":["来た"],"こない":["来ない"],"きて":["来て","着て"],"これる":["来れる"],"こられる":["来られる"],"らいじょう":["来場"],"らいば":["来場"],"らいき":["来季","来期"],"らいかく":["来客"],"らいきゃく":["来客"],"らいねん":["来年"],"らいねんど":["来年度"],"らいてん":["来店"],"らいにち":["来日"],"らいしゅん":["来春"],"らいはる":["来春"],"らいげつ":["来月"],"らいほう":["来訪"],"らいしゅう":["来週"],"さかずき":["杯"],"ひがし":["東"],"ひむかし":["東"],"ひんがし":["東"],"ひがしあじあ":["東アジア"],"とうきょう":["東京"],"とうきょうわん":["東京湾"],"とうきょうと":["東京都"],"とうそく":["東側"],"ひがしがわ":["東側"],"とうほく":["東北"],"ひがしきた":["東北"],"とうなん":["東南","盗難"],"ひがしみなみ":["東南"],"とうなんあじあ":["東南アジア"],"ひがしぐち":["東口"],"とうごく":["東国"],"ひがしがた":["東方"],"とうよう":["東洋"],"とうかい":["東海"],"とうかいどう":["東海道"],"とうしば":["東芝"],"とうざい":["東西"],"とうざいなんぼく":["東西南北"],"とうしょう":["東証"],"とうぶ":["東部","頭部"],"まつばら":["松原"],"まつや":["松屋"],"まくら":["枕"],"りんぎょう":["林業"],"りんどう":["林道"],"まいすう":["枚数"],"まいぐみ":["枚組"],"はたして":["果たして","果たして"],"はたす":["果たす"],"はたした":["果たした"],"はたさない":["果たさない"],"はたし":["果たし"],"はたせる":["果たせる"],"はたされる":["果たされる"],"かかん":["果敢"],"かじゅう":["果汁"],"かぶつ":["果物","貨物"],"くだもの":["果物"],"えだ":["枝"],"えだまめ":["枝豆"],"わく":["枠"],"かけはし":["架け橋"],"かくう":["架空"],"がら":["柄","殻"],"ひいらぎ":["柊"],"ひらぎ":["柊"],"かしわ":["柏"],"それがし":["某"],"なにがし":["某"],"ぼうしょ":["某所"],"そまる":["染まる"],"そまった":["染まった"],"そまらない":["染まらない"],"そまり":["染まり"],"そまって":["染まって"],"そまれる":["染まれる"],"そまられる":["染まられる"],"そめ":["染め"],"やわらか":["柔らか"],"やわらかい":["柔らかい"],"やわらかかった":["柔らかかった"],"やわらかくない":["柔らかくない"],"やわらかくて":["柔らかくて"],"じゅうなん":["柔軟"],"じゅうどう":["柔道"],"ゆず":["柚子","柚"],"はしら":["柱"],"やなぎ":["柳"],"りゅう":["流","龍","竜","柳"],"しばいぬ":["柴犬"],"しばけん":["柴犬"],"しがらみ":["柵"],"さてい":["査定"],"こけら":["柿","鱗"],"とちのき":["栃木"],"とちぎけん":["栃木県"],"さかえ":["栄え"],"えいこう":["栄光"],"えいよう":["栄養"],"えいようし":["栄養士"],"しおり":["栞"],"こうない":["構内","校内"],"こうちょうせんせい":["校長先生"],"かぶぬし":["株主"],"かぶか":["株価"],"かぶしき":["株式"],"かぶしきがいしゃ":["株式会社"],"かぶしきしじょう":["株式市場"],"かぶしきとうし":["株式投資"],"かくへいき":["核兵器"],"かくしん":["確信","革新","核心"],"ねっこ":["根っこ"],"こんげん":["根元","根源"],"ねもと":["根本","根元"],"こんてい":["根底"],"こんじょう":["根性"],"こんきょ":["根拠"],"こんぽん":["根本"],"こんぽんてき":["根本的"],"かくべつ":["格別"],"かっこう":["格好"],"かっこいい":["格好いい"],"かっこいかった":["格好いかった"],"かっこいくない":["格好いくない"],"かっこいくて":["格好いくて"],"かっこういい":["格好いい"],"かっこういかった":["格好いかった"],"かっこういくない":["格好いくない"],"かっこういくて":["格好いくて"],"かくやす":["格安"],"かくさ":["格差"],"かくさしゃかい":["格差社会"],"かくだん":["格段"],"かくげん":["格言"],"かくとう":["格闘"],"かくとうぎ":["格闘技"],"さいばい":["栽培"],"けた":["桁"],"かつら":["桂"],"もも":["桃","桃","百","股"],"ももいろ":["桃色"],"あんのじょう":["案の定"],"あんけん":["案件"],"あんない":["案内"],"あんないじょ":["案内所"],"あんがい":["案外"],"そうでん":["桑田"],"さくら":["桜","櫻"],"さくらのき":["桜の木"],"さんきょう":["桟橋"],"さんばし":["桟橋"],"うめぼし":["梅干","梅干し"],"うめしゅ":["梅酒"],"ばいう":["梅雨"],"つゆいり":["梅雨入り"],"つゆあけ":["梅雨明け"],"つゆどき":["梅雨時"],"なし":["無し","梨"],"こんぽう":["梱包"],"しんりん":["森林"],"しんりんこうえん":["森林公園"],"しんりんよく":["森林浴"],"いす":["椅子"],"うえる":["植える"],"うえた":["植えた"],"うえない":["植えない"],"うえて":["植えて"],"うえれる":["植えれる"],"うえられる":["植えられる"],"うえき":["植木"],"しょくみんち":["植民地"],"しょくぶつ":["植物"],"しょくぶつえん":["植物園"],"しいたけ":["椎茸"],"けんしゅつ":["検出"],"けんてい":["検定"],"けんさつ":["検察"],"けんさ":["検査"],"けんさく":["検索"],"けんさくえんじん":["検索エンジン"],"けんさくけっか":["検索結果"],"けんとうちゅう":["検討中"],"つばき":["椿"],"かえで":["楓"],"ぎょう":["行","業"],"ぎょうむ":["業務"],"ぎょうむよう":["業務用"],"ぎょうかい":["業界"],"ぎょうしゅ":["業種"],"ぎょうせき":["業績"],"ぎょうしゃ":["業者"],"ごく":["極"],"きわまりない":["極まりない"],"きわまりなかった":["極まりなかった"],"きわまりなくない":["極まりなくない"],"きわまりなくて":["極まりなくて"],"きわみ":["極み"],"きめ":["決め","決め","極め"],"ぎめ":["極め"],"きわめて":["極めて","極めて"],"きわめる":["極める"],"きわめた":["極めた"],"きわめない":["極めない"],"きわめ":["極め"],"きわめれる":["極めれる"],"きわめられる":["極められる"],"ごくじょう":["極上"],"きょくりょく":["極力"],"ごくい":["極意"],"きょくとう":["極東"],"ごくらく":["極楽"],"ごくひ":["極秘"],"きょくたん":["極端"],"きょくげん":["極限"],"らく":["楽"],"らくらく":["楽々"],"たのしい":["楽しい"],"たのしかった":["楽しかった"],"たのしくない":["楽しくない"],"たのしくて":["楽しくて"],"たのしむ":["楽しむ"],"たのしんだ":["楽しんだ"],"たのしまない":["楽しまない"],"たのしんで":["楽しんで"],"たのしまれる":["楽しまれる"],"たのしめる":["楽しめる"],"たのしめた":["楽しめた"],"たのしめない":["楽しめない"],"たのしめ":["楽しめ"],"たのしめて":["楽しめて"],"たのしめれる":["楽しめれる"],"たのしめられる":["楽しめられる"],"らくしょう":["楽勝"],"らくえん":["楽園"],"らくてん":["楽天"],"がくや":["楽屋"],"がっきょく":["楽曲"],"がくしょう":["楽章"],"がくふ":["楽譜"],"おおむね":["概ね"],"がいねん":["概念"],"がいよう":["概要"],"かまいません":["構いません"],"かまえ":["構え","構え"],"かまえる":["構える"],"かまえた":["構えた"],"かまえない":["構えない"],"かまえて":["構えて"],"かまえれる":["構えれる"],"かまえられる":["構えられる"],"かまわない":["構わない"],"こうず":["構図"],"こうそう":["構想","高層"],"こうちく":["構築"],"こうぞう":["構造"],"こうぞうかいかく":["構造改革"],"ほこ":["槍"],"やり":["槍"],"さま":["様"],"ざま":["様"],"よう":["様","用","葉","陽","要","酔う","益"],"さまさま":["様々"],"さまざま":["様々"],"ようだ":["様だ"],"ようです":["様です"],"ようす":["様子"],"ようすみ":["様子見"],"ようしき":["様式"],"ようそう":["様相"],"ひょうじゅん":["標準"],"ひょうてき":["標的"],"ひょうしき":["標識"],"ひょうこう":["標高"],"もけい":["模型"],"もよう":["模様"],"もようがえ":["模様替え"],"もさく":["模索"],"もし":["模試"],"けんり":["権利"],"けんりょく":["権力"],"けんい":["権威"],"けんげん":["権限"],"よこ":["横"],"よこから":["横から"],"よこに":["横に"],"よこちょう":["横丁"],"おうだん":["横断"],"よこはま":["横浜"],"よこめ":["横目"],"よこづな":["横綱"],"よこがお":["横顔"],"じゅもく":["樹木"],"じゅし":["樹脂"],"はし":["橋","端","箸"],"たちばな":["橘"],"きかい":["機会","機械"],"きない":["着ない","機内"],"きどう":["機動","起動","軌道"],"きどうたい":["機動隊"],"きざい":["機材"],"きしゅ":["機種","騎手"],"きかんしゃ":["機関車"],"けつじょう":["欠場"],"けつじょ":["欠如"],"けっせき":["欠席"],"けってん":["欠点"],"けっかん":["欠陥","血管"],"つぎ":["次","注ぎ","次ぎ","継ぎ"],"つぎつぎ":["次々"],"つぎつぎに":["次々に"],"つぎからつぎへと":["次から次へと"],"つぐ":["注ぐ","次ぐ","継ぐ"],"ついだ":["注いだ","次いだ","継いだ"],"つがない":["注がない","次がない","継がない"],"つがれる":["注がれる","次がれる","継がれる"],"つぎのように":["次のように"],"じせだい":["次世代"],"じかい":["次回","次会"],"じげん":["次元"],"じじょ":["次女"],"じなん":["次男"],"しだい":["次第"],"しだいに":["次第に"],"おうしゅう":["欧州"],"おうべい":["欧米"],"よく":["良く","翼","欲","翌"],"ほしい":["欲しい"],"ほしかった":["欲しかった"],"ほしくない":["欲しくない"],"ほしくて":["欲しくて"],"よくばり":["欲張り"],"よくぼう":["欲望"],"よっきゅう":["欲求"],"かげき":["過激","歌劇"],"うたごえ":["歌声"],"うたひめ":["歌姫"],"かしゅ":["歌手"],"かぶき":["歌舞伎"],"かぶきざ":["歌舞伎座"],"かし":["菓子","歌詞","貸し"],"かよう":["通う","火曜","歌謡"],"かようきょく":["歌謡曲"],"かんげい":["歓迎"],"かんげいかい":["歓迎会"],"とまり":["泊まり","泊り","止まり","泊まり","止まり"],"どまり":["止まり"],"とどまる":["止まる"],"とどまった":["止まった"],"とどまらない":["止まらない"],"とどまり":["止まり"],"とどまって":["止まって"],"とどまれる":["止まれる"],"とどまられる":["止まられる"],"とまる":["止まる","泊まる"],"とまった":["止まった","泊まった"],"とまらない":["止まらない","泊まらない"],"とまって":["止まって","泊まって"],"とまれる":["止まれる","泊まれる"],"とまられる":["止まられる","泊まられる"],"やむ":["止む"],"やんだ":["止んだ"],"やまない":["止まない"],"やみ":["闇","止み"],"やんで":["止んで"],"やまれる":["止まれる"],"とどめ":["止め","止め"],"とめ":["止め","止め"],"とどめる":["止める"],"とどめた":["止めた"],"とどめない":["止めない"],"とどめて":["止めて"],"とどめれる":["止めれる"],"とどめられる":["止められる"],"とめる":["飛める","止める"],"とめた":["止めた"],"とめない":["止めない"],"とめて":["止めて"],"とめれる":["止めれる"],"とめられる":["止められる"],"やめる":["止める","辞める"],"やめた":["止めた","辞めた"],"やめない":["止めない","辞めない"],"やめ":["止め","辞め"],"やめて":["止めて","辞めて"],"やめれる":["止めれる","辞めれる"],"やめられる":["止められる","辞められる"],"ただしい":["正しい"],"ただしかった":["正しかった"],"ただしくない":["正しくない"],"ただしくて":["正しくて"],"まさしく":["正しく"],"まさに":["正に"],"しょうご":["正午"],"せいはんたい":["正反対"],"せいじょう":["正常"],"しょうざ":["正座"],"せいしき":["正式"],"しょうがつ":["正月"],"しょうじき":["正直"],"せいしゃいん":["正社員"],"せいとうは":["正統派"],"せいぎ":["正義"],"せいろん":["正論"],"しょうめん":["正面"],"まとも":["正面"],"ぶりょく":["武力"],"ぶゆうでん":["武勇伝"],"ぶき":["武器"],"ぶし":["節","武士"],"もののふ":["武士"],"ぶしょう":["武将"],"むしゃ":["武者"],"ぶそう":["武装"],"ありき":["歩き"],"あるき":["歩き","歩き"],"あるきかた":["歩き方"],"あるく":["歩く"],"あるいた":["歩いた"],"あるかない":["歩かない"],"あるいて":["歩いて"],"あるける":["歩ける"],"あるかれる":["歩かれる"],"ほこう":["歩こう","歩行"],"あゆみ":["歩み","歩み"],"あゆむ":["歩む"],"あゆんだ":["歩んだ"],"あゆまない":["歩まない"],"あゆんで":["歩んで"],"あゆまれる":["歩まれる"],"ほいっぽ":["歩一歩"],"ほこうしゃ":["歩行者"],"ほどう":["歩道"],"いがみ":["歪み"],"ひずみ":["歪み"],"ゆがみ":["歪み"],"はごたえ":["歯ごたえ"],"はぶらし":["歯ブラシ"],"はみがき":["歯磨き"],"しかいいん":["歯科医院"],"さいじき":["歳時記"],"せいぼ":["歳暮"],"さいげつ":["歳月"],"れきだい":["歴代"],"れきし":["歴史"],"れきしじょう":["歴史上"],"れきしてき":["歴史的"],"しにそう":["死にそう"],"しぬ":["死ぬ"],"しんだ":["死んだ"],"しなない":["死なない"],"しに":["死に"],"しんで":["死んで"],"しねる":["死ねる"],"しなれる":["死なれる"],"しけい":["死刑"],"しきょ":["死去"],"しご":["死語","死後"],"しにがみ":["死神"],"ししゃ":["試写","死者"],"ほとんど":["殆ど"],"のこす":["残す"],"のこした":["残した"],"のこさない":["残さない"],"のこし":["残し"],"のこして":["残して"],"のこせる":["残せる"],"のこされる":["残される"],"のこった":["残った","残った"],"のこり":["残り","残り"],"のこりもの":["残り物"],"のこる":["残る"],"のこらない":["残らない"],"のこって":["残って"],"のこれる":["残れる"],"のこられる":["残られる"],"ざんねん":["残念"],"ざんねんながら":["残念ながら"],"ざんしょ":["残暑"],"ざんぎょう":["残業"],"ざんりゅう":["残留"],"ざんこく":["残酷"],"ざんだか":["残高"],"だんだん":["段々"],"だんどり":["段取り"],"だんさ":["段差"],"ころし":["殺し","殺し"],"ころす":["殺す"],"ころした":["殺した"],"ころさない":["殺さない"],"ころして":["殺して"],"ころせる":["殺せる"],"ころされる":["殺される"],"さつじん":["殺人"],"さつじんじけん":["殺人事件"],"さっしょう":["殺傷"],"さっとう":["殺到"],"さつがい":["殺害"],"さつがいじけん":["殺害事件"],"しんがり":["殿"],"との":["殿"],"かか":["母"],"はは":["母"],"かあさん":["母さん"],"かあちゃん":["母ちゃん"],"ははのひ":["母の日"],"ぼにゅう":["母乳"],"ぼし":["母子"],"ぼこう":["母校"],"ははおや":["母親"],"ごと":["毎"],"ごとに":["毎に"],"まいかい":["毎回"],"まいとし":["毎年"],"まいねん":["毎年"],"まいど":["毎度"],"まいにち":["毎日"],"まいにちまいにち":["毎日毎日"],"まいばん":["毎晩"],"まいげつ":["毎月"],"まいつき":["毎月"],"まいあさ":["毎朝"],"まいちょう":["毎朝"],"まいしゅう":["毎週"],"どく":["毒","独"],"どくぜつ":["毒舌"],"ころおい":["頃","比"],"くらべ":["比べ","比べ"],"くらべる":["比べる"],"くらべた":["比べた"],"くらべない":["比べない"],"くらべて":["比べて"],"くらべれる":["比べれる"],"くらべられる":["比べられる"],"ひれい":["比例"],"ひりつ":["比率"],"ひかく":["比較"],"ひかくてき":["比較的"],"もうふ":["毛布"],"けがわ":["毛皮"],"もうひ":["毛皮"],"けあな":["毛穴"],"けいと":["毛糸"],"うじ":["氏"],"たみ":["民"],"みんしゅ":["民主"],"みんしゅしゅぎ":["民主主義"],"みんしゅとう":["民主党"],"みんじ":["民事"],"みんぞく":["民族","民俗"],"みんえい":["民営"],"みんえいか":["民営化"],"みんか":["民家"],"みんしゅく":["民宿"],"みんぽう":["民放"],"みんせい":["民生"],"みんしゅう":["民衆"],"みんよう":["民謡"],"みんかん":["民間"],"きがかり":["気がかり"],"きがする":["気がする"],"きがつく":["気がつく","気が付く"],"きがついた":["気がついた","気が付いた"],"きがつかない":["気がつかない","気が付かない"],"きがつき":["気がつき","気が付き"],"きがついて":["気がついて","気が付いて"],"きがつける":["気がつける","気が付ける"],"きがつかれる":["気がつかれる","気が付かれる"],"きさく":["気さく"],"きづく":["気づく","気付く"],"きづいた":["気づいた","気付いた"],"きづかない":["気づかない","気付かない"],"きづき":["気づき","気付き","気付き"],"きづいて":["気づいて","気付いて"],"きづける":["気づける","気付ける"],"きづかれる":["気づかれる","気付かれる"],"きにする":["気にする"],"きになる":["気になる"],"きにいり":["気に入り"],"きのせい":["気のせい"],"きのむくままに":["気の向くままに"],"きのどく":["気の毒"],"きまぐれ":["気まぐれ","気紛れ"],"きまま":["気まま"],"きをつけて":["気をつけて","気を付けて"],"きをつける":["気をつける"],"きぶん":["気分"],"きぶんてんかん":["気分転換"],"きりょく":["気力"],"きあい":["気合","気合い"],"ぎみ":["気味"],"きもち":["気持ち","気持"],"きもちいい":["気持ちいい"],"きもちいかった":["気持ちいかった"],"きもちいくない":["気持ちいくない"],"きもちいくて":["気持ちいくて"],"きもちわるい":["気持ち悪い"],"きもちわるかった":["気持ち悪かった"],"きもちわるくない":["気持ち悪くない"],"きもちわるくて":["気持ち悪くて"],"きもちよい":["気持ち良い"],"きもちよかった":["気持ち良かった"],"きもちよくない":["気持ち良くない"],"きもちよくて":["気持ち良くて"],"きばらし":["気晴らし"],"きらく":["気楽"],"きおん":["気温"],"きしょうちょう":["気象庁"],"かたぎ":["気質"],"きしつ":["気質"],"きがる":["気軽"],"きはく":["気迫"],"きづかい":["気遣い"],"きはい":["気配"],"けはい":["気配"],"きくばり":["気配り"],"きなが":["気長"],"すいじょう":["水上"],"みなかみ":["水上"],"すいちゅう":["水中"],"すいぶん":["水分"],"すいぶんほきゅう":["水分補給"],"すいさいが":["水彩画"],"すいぞくかん":["水族館"],"すいよう":["水曜"],"すいようび":["水曜日"],"みずき":["水木"],"すいそう":["水槽","水草"],"すいぼつ":["水没"],"すいえい":["水泳"],"すいおん":["水温"],"すいじゅん":["水準"],"すいてき":["水滴"],"みずたま":["水玉"],"すいさん":["水産"],"すいでん":["水田"],"みずぎ":["水着"],"みずいろ":["水色"],"みずくさ":["水草"],"みずな":["水菜"],"すいへん":["水辺"],"みずべ":["水辺"],"みずあそび":["水遊び"],"すいどう":["水道"],"みなも":["水面"],"みのも":["水面"],"こおり":["氷","郡"],"えいきゅう":["永久"],"とこしえ":["永久"],"えいえん":["永遠"],"しる":["知る","汁"],"もとむ":["求む"],"もとんだ":["求んだ"],"もとまない":["求まない"],"もとみ":["求み"],"もとんで":["求んで"],"もとまれる":["求まれる"],"もとめ":["求め","求め"],"もとめる":["求める"],"もとめた":["求めた"],"もとめない":["求めない"],"もとめて":["求めて"],"もとめれる":["求めれる"],"もとめられる":["求められる"],"きゅうじん":["求人"],"あせ":["汗"],"きたない":["汚い"],"きたなかった":["汚かった"],"きたなくない":["汚くない"],"きたなくて":["汚くて"],"けがれ":["汚れ"],"よごれ":["汚れ"],"おせん":["汚染"],"おしょく":["汚職"],"えど":["江戸"],"えどっこ":["江戸っ子"],"えどがわ":["江戸川"],"えどじだい":["江戸時代"],"いけ":["行け","池"],"けして":["決して","消して"],"けっして":["決して"],"きまって":["決まって","決まって"],"きまり":["決まり","決まり"],"きまる":["決まる"],"きまった":["決まった"],"きまらない":["決まらない"],"きまれる":["決まれる"],"きまられる":["決まられる"],"きめる":["決める"],"きめた":["決めた"],"きめない":["決めない"],"きめて":["決めて","決め手"],"きめれる":["決めれる"],"きめられる":["決められる"],"けっしょう":["決勝","結晶"],"けっしょうせん":["決勝戦"],"けってい":["決定"],"けっていせん":["決定戦"],"けっていてき":["決定的"],"けっしん":["決心"],"けつい":["決意"],"けっせん":["決戦"],"けつだん":["決断"],"けっさい":["決済"],"けっちゃく":["決着"],"けっさん":["決算"],"けっこう":["結構","決行"],"けつぎ":["決議"],"きしゃ":["記者","汽車"],"しずむ":["沈む"],"しずんだ":["沈んだ"],"しずまない":["沈まない"],"しずみ":["沈み"],"しずんで":["沈んで"],"しずまれる":["沈まれる"],"ちんぼつ":["沈没"],"ちんもく":["沈黙"],"おきなわ":["沖縄"],"おきなわけん":["沖縄県"],"しゃ":["者","社","舎","紗","沙"],"さた":["沙汰"],"ぼつ":["点","没"],"ぼつご":["没後"],"ぼっとう":["没頭"],"さわ":["沢"],"たくさん":["沢山"],"はのい":["河内"],"かせん":["河川"],"かせんしき":["河川敷"],"かせんじき":["河川敷"],"ふっとう":["沸騰"],"あぶら":["油","脂"],"あぶらあげ":["油揚げ"],"あぶらげ":["油揚げ"],"ゆだん":["油断"],"なおす":["治す","直す"],"なおした":["治した","直した"],"なおさない":["治さない","直さない"],"なおし":["治し","直し","直し"],"なおして":["治して","直して"],"なおせる":["治せる","直せる"],"なおされる":["治される","直される"],"なおる":["治る"],"なおった":["治った"],"なおらない":["治らない"],"なおり":["治り"],"なおって":["治って"],"なおれる":["治れる"],"なおられる":["治られる"],"じあん":["治安"],"ちあん":["治安"],"ちりょう":["治療"],"ちりょうほう":["治療法"],"ちゆ":["治癒"],"ぬま":["沼"],"ぞい":["沿い"],"そって":["沿って"],"えんがん":["沿岸"],"えんせん":["沿線"],"いずみ":["泉"],"ほうじ":["法事"],"ほうじん":["法人"],"ほうれい":["法令"],"ほうそく":["法則"],"ほうむ":["法務"],"ほうがくぶ":["法学部"],"ほうてい":["法廷"],"ほうりつ":["法律"],"ほうかいせい":["法改正"],"ほうあん":["法案"],"ほうてき":["法的"],"ほうよう":["法要"],"あぶく":["泡"],"あわ":["泡"],"あわもり":["泡盛"],"なみのり":["波乗り"],"はらん":["波乱"],"はらんばんじょう":["波乱万丈"],"はどう":["波動"],"はもん":["波紋"],"なきむし":["泣き虫"],"なく":["泣く","鳴く"],"ないた":["泣いた","鳴いた"],"なかない":["泣かない","鳴かない"],"ないて":["泣いて","鳴いて"],"なける":["泣ける","泣ける","鳴ける"],"なかれる":["泣かれる","鳴かれる"],"なくなく":["泣く泣く"],"なけた":["泣けた"],"なけない":["泣けない"],"なけ":["泣け"],"なけて":["泣けて"],"なけれる":["泣けれる"],"なけられる":["泣けられる"],"どろ":["泥"],"どろぼう":["泥棒"],"でいすい":["泥酔"],"そそぐ":["注ぐ"],"そそいだ":["注いだ"],"そそがない":["注がない"],"そそぎ":["注ぎ"],"そそいで":["注いで"],"そそげる":["注げる"],"そそがれる":["注がれる"],"ちゅうにゅう":["注入"],"ちゅうしゃ":["注射","駐車"],"ちゅうい":["注意"],"ちゅういじこう":["注意事項"],"ちゅういほう":["注意報"],"ちゅういてん":["注意点"],"ちゅうもん":["注文"],"ちゅうもく":["注目"],"およぎ":["泳ぎ","泳ぎ"],"およぐ":["泳ぐ"],"およいだ":["泳いだ"],"およがない":["泳がない"],"およいで":["泳いで"],"およげる":["泳げる"],"およがれる":["泳がれる"],"ようふく":["洋服"],"ようがく":["洋楽"],"ようがし":["洋菓子"],"ようさい":["洋裁"],"ようふう":["洋風"],"ようしょく":["洋食","養殖"],"しゃらく":["洒落"],"しゃれ":["洒落"],"あらい":["洗い","洗い","荒い"],"あらう":["洗う"],"あらった":["洗った"],"あらわない":["洗わない"],"あらって":["洗って"],"あらえる":["洗える"],"あらわれる":["現れる","洗われる"],"せんざい":["洗剤","潜在"],"せんたく":["選択","洗濯"],"せんたくき":["洗濯機"],"せんたっき":["洗濯機"],"せんたくもの":["洗濯物"],"せんれい":["洗礼"],"せんれん":["洗練"],"せんのう":["洗脳"],"せんめんじょ":["洗面所"],"せんがん":["洗顔"],"うろ":["空","洞"],"とうやこさみっと":["洞爺湖サミット"],"どうくつ":["洞窟"],"つなみ":["津波"],"つがる":["津軽"],"こうずい":["洪水"],"ひし":["洲"],"ひじ":["洲","肘"],"いかす":["生かす","活かす"],"いかした":["生かした","活かした"],"いかさない":["生かさない","活かさない"],"いかし":["生かし","活かし"],"いかして":["生かして","活かして"],"いかせる":["生かせる","活かせる"],"いかされる":["生かされる","活かされる"],"かつりょく":["活力"],"かつどう":["活動"],"かつじ":["活字"],"かっせい":["活性"],"かっせいか":["活性化"],"かっき":["活気"],"かつよう":["活用"],"かっぱつ":["活発"],"かつやく":["活躍"],"かつやくちゅう":["活躍中"],"はで":["派手"],"はけん":["派遣"],"はけんしゃいん":["派遣社員"],"る":["流"],"ながし":["流し"],"ながれ":["流れ","流れ"],"ながれる":["流れる"],"ながれた":["流れた"],"ながれない":["流れない"],"ながれて":["流れて"],"ながれれる":["流れれる"],"ながれられる":["流れられる"],"ながれぼし":["流れ星"],"りゅうしゅつ":["流出"],"りゅういき":["流域"],"りゅうせい":["流星"],"りゅうせいぐん":["流星群"],"りゅうよう":["流用"],"さすが":["流石"],"はやり":["流行","流行り"],"りゅうこう":["流行"],"りゅうこうご":["流行語"],"りゅうつう":["流通"],"じょうか":["浄化"],"あさい":["浅い"],"あさかった":["浅かった"],"あさくない":["浅くない"],"あさくて":["浅くて"],"はま":["浜"],"はままつ":["浜松"],"はまべ":["浜辺"],"ろうにん":["浪人"],"ろうまん":["浪漫"],"なにわ":["浪速"],"うかぶ":["浮かぶ"],"うかんだ":["浮かんだ"],"うかばない":["浮かばない"],"うかび":["浮かび"],"うかんで":["浮かんで"],"うかめる":["浮かめる"],"うかばれる":["浮かばれる"],"うく":["浮く"],"ういた":["浮いた"],"うかない":["浮かない"],"うき":["浮き"],"ういて":["浮いて"],"うかれる":["浮かれる"],"ふじょう":["浮上"],"うわき":["浮気"],"ふゆう":["浮遊"],"あびる":["浴びる"],"あびた":["浴びた"],"あびない":["浴びない"],"あび":["浴び"],"あびて":["浴びて"],"あびれる":["浴びれる"],"あびられる":["浴びられる"],"よくじょう":["浴場"],"よくしつ":["浴室"],"ゆかた":["浴衣"],"よくい":["浴衣"],"うみ":["海","生み","産み"],"わた":["海","綿","腸"],"わだ":["海"],"うみのひ":["海の日"],"かいがい":["海外"],"かいがいりょこう":["海外旅行"],"かいがん":["海岸"],"かいきょう":["海峡"],"かいすい":["海水"],"かいすいよく":["海水浴"],"かいよう":["海洋"],"かいひん":["海浜"],"かいぞく":["海賊"],"かいぐん":["海軍"],"うみべ":["海辺"],"かいへん":["海辺"],"うみかぜ":["海風"],"かいふう":["開封","海風"],"ひたる":["浸る"],"ひたった":["浸った"],"ひたらない":["浸らない"],"ひたり":["浸り"],"ひたって":["浸って"],"ひたれる":["浸れる"],"ひたられる":["浸られる"],"きえる":["消える"],"きえた":["消えた"],"きえない":["消えない"],"きえ":["消え"],"きえて":["消えて"],"きえれる":["消えれる"],"きえられる":["消えられる"],"けしごむ":["消しゴム"],"けす":["消す"],"けした":["消した"],"けさない":["消さない"],"けし":["消し"],"けせる":["消せる"],"けされる":["消される"],"しょうかふりょう":["消化不良"],"しょうきょ":["消去"],"しょうしつ":["消失"],"しょうきょくてき":["消極的"],"しょうどく":["消毒"],"しょうめつ":["消滅"],"しょうもう":["消耗"],"しょうひ":["消費"],"しょうひぜい":["消費税"],"しょうひしゃ":["消費者"],"しょうひしゃきんゆう":["消費者金融"],"しょうぼう":["消防"],"なみだ":["涙"],"るいせん":["涙腺"],"えきたい":["液体"],"えきしょう":["液晶"],"えきしょうてれび":["液晶テレビ"],"すずしい":["涼しい"],"すずしかった":["涼しかった"],"すずしくない":["涼しくない"],"すずしくて":["涼しくて"],"よどがわ":["淀川"],"あわい":["淡い"],"あわかった":["淡かった"],"あわくない":["淡くない"],"あわくて":["淡くて"],"ふかぶか":["深々"],"ふかかった":["深かった"],"ふかくない":["深くない"],"ふかくて":["深くて"],"ふかさ":["深さ"],"ふかまる":["深まる"],"ふかまった":["深まった"],"ふかまらない":["深まらない"],"ふかまり":["深まり"],"ふかまって":["深まって"],"ふかまれる":["深まれる"],"ふかまられる":["深まられる"],"ふかみ":["深み"],"ふかめる":["深める"],"ふかめた":["深めた"],"ふかめない":["深めない"],"ふかめ":["深め"],"ふかめて":["深めて"],"ふかめれる":["深めれる"],"ふかめられる":["深められる"],"しんこく":["深刻","申告"],"しんこきゅう":["深呼吸"],"しんや":["深夜"],"ふち":["縁","淵"],"まぜる":["混ぜる"],"まぜた":["混ぜた"],"まぜない":["混ぜない"],"まぜ":["混ぜ"],"まぜて":["混ぜて"],"まぜれる":["混ぜれる"],"まぜられる":["混ぜられる"],"こんだ":["混んだ"],"こまない":["混まない"],"こみ":["込み","混み"],"こんで":["混んで"],"こんらん":["混乱"],"こんにゅう":["混入"],"こんごう":["混合"],"こんせん":["混戦"],"こんとん":["混沌"],"こんざつ":["混雑"],"てんじょういん":["添乗員"],"てんぷ":["添付"],"てんかぶつ":["添加物"],"てんかもの":["添加物"],"すがすがしい":["清々しい"],"すがすがしかった":["清々しかった"],"すがすがしくない":["清々しくない"],"すがすがしくて":["清々しくて"],"せいそう":["清掃"],"せいそ":["清楚"],"きよみず":["清水"],"しみず":["清水"],"せいすい":["清水"],"せいりゅう":["青龍","清流"],"せいけつ":["清潔"],"ずみ":["済み","済"],"すませる":["済ませる"],"すませた":["済ませた"],"すませない":["済ませない"],"すませ":["済ませ"],"すませて":["済ませて"],"すませれる":["済ませれる"],"すませられる":["済ませられる"],"しぶい":["渋い"],"しぶかった":["渋かった"],"しぶくない":["渋くない"],"しぶくて":["渋くて"],"じゅうたい":["渋滞"],"たに":["谷","渓"],"けいりゅう":["渓流"],"けいこく":["警告","渓谷"],"なぎさ":["渚"],"へらす":["減らす"],"へらした":["減らした"],"へらさない":["減らさない"],"へらし":["減らし"],"へらして":["減らして"],"へらせる":["減らせる"],"へらされる":["減らされる"],"へった":["減った"],"へらない":["減らない"],"へって":["減って"],"へれる":["減れる"],"へられる":["減られる"],"げんしょう":["現象","減少"],"げんぜい":["減税"],"わたし":["私","渡し","渡し"],"わたす":["渡す"],"わたした":["渡した"],"わたさない":["渡さない"],"わたして":["渡して"],"わたせる":["渡せる"],"わたされる":["渡される"],"わたり":["渡り","渡り"],"わたる":["渡る"],"わたった":["渡った"],"わたらない":["渡らない"],"わたって":["渡って"],"わたれる":["渡れる"],"わたられる":["渡られる"],"あたためる":["温める"],"あたためた":["温めた"],"あたためない":["温めない"],"あたため":["温め"],"あたためて":["温めて"],"あたためれる":["温めれる"],"あたためられる":["温められる"],"ぬくめる":["温める"],"ぬくめた":["温めた"],"ぬくめない":["温めない"],"ぬくめ":["温め"],"ぬくめて":["温めて"],"ぬくめれる":["温めれる"],"ぬくめられる":["温められる"],"ぬるめる":["温める"],"ぬるめた":["温めた"],"ぬるめない":["温めない"],"ぬるめ":["温め"],"ぬるめて":["温めて"],"ぬるめれる":["温めれる"],"ぬるめられる":["温められる"],"ぬくもり":["温もり"],"おんぞん":["温存"],"おんしつ":["温室","音質"],"おんど":["温度","音頭"],"おんどさ":["温度差"],"おんだん":["温暖"],"おんせん":["温泉"],"おんせんやど":["温泉宿"],"そくてい":["測定"],"みなと":["港"],"みなとく":["港区"],"こんしん":["渾身"],"みずうみ":["湖"],"こはん":["湖畔"],"ゆ":["湯"],"ゆげ":["湯気"],"ゆぶね":["湯船"],"わんがん":["湾岸"],"しつど":["湿度"],"しっき":["湿気"],"しっけ":["湿気"],"まんまん":["満々"],"みたす":["満たす"],"みたした":["満たした"],"みたさない":["満たさない"],"みたし":["満たし"],"みたして":["満たして"],"みたせる":["満たせる"],"みたされる":["満たされる"],"みたない":["満たない"],"まんたん":["満タン"],"まんいん":["満員"],"まんいんおんれい":["満員御礼"],"まんきつ":["満喫"],"まんるい":["満塁"],"まんてん":["満点","満天"],"まんせき":["満席"],"まんえつ":["満悦"],"まんげつ":["満月"],"まんぷく":["満腹"],"まんぞく":["満足"],"まんぞくかん":["満足感"],"まんさい":["満載"],"まんかい":["満開"],"まんめん":["満面"],"みなもと":["源"],"げんじものがたり":["源氏物語"],"げんりゅう":["源流"],"じゅんじゅんけっしょう":["準々決勝"],"じゅんび":["準備"],"じゅんびばんたん":["準備万端"],"じゅんびちゅう":["準備中"],"じゅんゆうしょう":["準優勝"],"じゅんけっしょう":["準決勝"],"たまり":["溜まり","溜まり"],"たまる":["溜まる"],"たまった":["溜まった"],"たまらない":["溜まらない"],"たまって":["溜まって"],"たまれる":["溜まれる"],"たまられる":["溜まられる"],"どぶ":["溝"],"みぞ":["溝"],"あふれ":["溢れ","溢れ"],"あふれる":["溢れる"],"あふれた":["溢れた"],"あふれない":["溢れない"],"あふれて":["溢れて"],"あふれれる":["溢れれる"],"あふれられる":["溢れられる"],"あぶれる":["溢れる"],"あぶれた":["溢れた"],"あぶれない":["溢れない"],"あぶれ":["溢れ"],"あぶれて":["溢れて"],"あぶれれる":["溢れれる"],"あぶれられる":["溢れられる"],"とけた":["溶けた"],"とけない":["溶けない"],"とけ":["溶け"],"とけて":["溶けて"],"とけれる":["溶けれる"],"とけられる":["溶けられる"],"できあい":["溺愛"],"めつぼう":["滅亡"],"めった":["滅多"],"めったに":["滅多に"],"しがけん":["滋賀県"],"なめらか":["滑らか"],"すべり":["滑り","滑り"],"ぬめり":["滑り","滑り"],"すべりだい":["滑り台"],"すべる":["滑る"],"すべった":["滑った"],"すべらない":["滑らない"],"すべって":["滑って"],"すべれる":["滑れる"],"すべられる":["滑られる"],"ぬめる":["滑る"],"ぬめった":["滑った"],"ぬめらない":["滑らない"],"ぬめって":["滑って"],"ぬめれる":["滑れる"],"ぬめられる":["滑られる"],"たいざい":["滞在"],"たいざいちゅう":["滞在中"],"しずく":["雫","滴"],"りょうし":["漁師"],"ぎょぎょう":["漁業"],"ぎょせん":["漁船"],"ただよう":["漂う"],"ただよった":["漂った"],"ただよわない":["漂わない"],"ただよい":["漂い"],"ただよって":["漂って"],"ただよえる":["漂える"],"ただよわれる":["漂われる"],"ひょうりゅう":["漂流"],"もれ":["漏れ"],"えんじる":["演じる"],"えんじた":["演じた"],"えんじない":["演じない"],"えんじて":["演じて"],"えんじれる":["演じれる"],"えんじられる":["演じられる"],"えんしゅつ":["演出"],"えんげき":["演劇"],"えんそう":["演奏"],"えんそうかい":["演奏会"],"えんぎ":["演技","縁起"],"えんか":["演歌"],"えんもく":["演目"],"えんしゅう":["演習"],"えんじゃ":["演者"],"えんぜつ":["演説"],"ばくぜん":["漠然"],"おとこ":["男","漢"],"かんぽう":["漢方"],"かんぽうやく":["漢方薬"],"まんが":["漫画"],"まんがか":["漫画家"],"まんゆう":["漫遊"],"つけもの":["漬物"],"せんにゅう":["潜入"],"せんざいいしき":["潜在意識"],"せんすいかん":["潜水艦"],"うるおい":["潤い","潤い"],"うるおう":["潤う"],"うるおった":["潤った"],"うるおわない":["潤わない"],"うるおって":["潤って"],"うるおえる":["潤える"],"うるおわれる":["潤われる"],"うしお":["潮"],"しおかぜ":["潮風"],"はげしい":["激しい"],"はげしかった":["激しかった"],"はげしくない":["激しくない"],"はげしくて":["激しくて"],"げきれい":["激励"],"げきどう":["激動"],"げきやす":["激安"],"げきど":["激怒"],"げきせん":["激戦"],"げきげん":["激減"],"げきつう":["激痛"],"げきとつ":["激突"],"げきから":["激辛"],"げきとう":["激闘"],"こかった":["濃かった"],"こくて":["濃くて"],"こいめ":["濃い目"],"のうこう":["濃厚"],"のうど":["濃度"],"ぬれた":["濡れた"],"ぬれない":["濡れない"],"ぬれ":["濡れ"],"ぬれて":["濡れて"],"ぬれれる":["濡れれる"],"ぬれられる":["濡れられる"],"せ":["背","瀬"],"せと":["瀬戸"],"せとないかい":["瀬戸内海"],"やけど":["火傷"],"かざん":["火山"],"かせい":["火星"],"かようび":["火曜日"],"かさい":["火災"],"ともしび":["灯"],"とうだい":["灯台"],"とうゆ":["灯油"],"はいいろ":["灰色"],"しゃくねつ":["灼熱"],"さいがい":["災害"],"さいなん":["災難"],"たきこみ":["炊き込み"],"すいはんき":["炊飯器"],"ほのお":["炎"],"ほむら":["炎"],"えんじょう":["炎上"],"えんてんか":["炎天下"],"えんしょう":["炎症"],"いためる":["炒める"],"いためた":["炒めた"],"いためない":["炒めない"],"いため":["炒め"],"いためて":["炒めて"],"いためれる":["炒めれる"],"いためられる":["炒められる"],"いためもの":["炒め物"],"たんすいかぶつ":["炭水化物"],"すみび":["炭火"],"たんそ":["炭素"],"たんさん":["炭酸"],"さくれつ":["炸裂"],"ちょぼ":["点"],"てんざい":["点在"],"てんさ":["点差"],"てんすう":["点数"],"てんけん":["点検"],"ために":["為に"],"ためになる":["為になる"],"ためになった":["為になった"],"ためにならない":["為にならない"],"ためになり":["為になり"],"ためになって":["為になって"],"ためになれる":["為になれる"],"ためになられる":["為になられる"],"かわせ":["為替"],"ばいせん":["焙煎"],"むち":["無","策","無知"],"なかった":["無かった"],"なくない":["無くない"],"なくて":["無くて"],"なければ":["無ければ"],"なしで":["無しで"],"ぶじ":["無事"],"ぶじに":["無事に"],"ぶじしゅうりょう":["無事終了"],"ぶじん":["無人"],"むじん":["無人"],"むにん":["無人"],"むきゅう":["無休"],"むしゅうせい":["無修正"],"むしょう":["無償"],"むりょく":["無力"],"むじるし":["無印"],"むめい":["無名"],"むさべつ":["無差別"],"むじょう":["無常"],"むねん":["無念"],"むせい":["無性"],"むしょうに":["無性に"],"むいみ":["無意味"],"むいしき":["無意識"],"むすう":["無数"],"むてき":["無敵"],"むりょう":["無料"],"むだん":["無断"],"むだんで":["無断で"],"むだんてんさい":["無断転載"],"むじょうけん":["無条件"],"むざん":["無残"],"ぶさた":["無沙汰"],"むり":["無理"],"むりやり":["無理やり","無理矢理"],"むよう":["無用"],"むせん":["無線"],"むせんらん":["無線ＬＡＮ"],"むえん":["無縁"],"むざい":["無罪"],"むしょく":["無職"],"むのう":["無能"],"むちゃ":["無茶"],"むし":["虫","無視","蒸し"],"むごん":["無言"],"むろん":["無論"],"むぼう":["無謀"],"むせきにん":["無責任"],"むのうやく":["無農薬"],"むじゃき":["無邪気"],"むかんけい":["無関係"],"むかんしん":["無関心"],"ぶなん":["無難"],"むだい":["無題"],"むだ":["無駄"],"むだづかい":["無駄遣い"],"あせり":["焦り","焦り"],"あせる":["焦る"],"あせった":["焦った"],"あせらない":["焦らない"],"あせって":["焦って"],"あせれる":["焦れる"],"あせられる":["焦られる"],"やき":["焼き","焼き","焼"],"やきそば":["焼きそば"],"やきたて":["焼きたて"],"やきもの":["焼き物"],"やきにく":["焼肉","焼き肉"],"やきがし":["焼き菓子"],"やきとり":["焼き鳥"],"やいた":["焼いた"],"やかない":["焼かない"],"やいて":["焼いて"],"やける":["焼ける","焼ける"],"やかれる":["焼かれる"],"やけ":["焼け","焼け"],"やけた":["焼けた"],"やけない":["焼けない"],"やけて":["焼けて"],"やけれる":["焼けれる"],"やけられる":["焼けられる"],"しょうちゅう":["焼酎"],"せんべい":["煎餅"],"けぶ":["煙"],"けぶり":["煙"],"けむ":["煙"],"けむり":["煙"],"しょうめい":["証明","照明"],"ぼんのう":["煩悩"],"にる":["煮る"],"にた":["煮た"],"にれる":["煮れる"],"にられる":["煮られる"],"につけ":["煮付け"],"にもの":["煮物"],"にこみ":["煮込み"],"くまもとけん":["熊本県"],"じゅくねん":["熟年"],"じゅくせい":["熟成"],"じゅくすい":["熟睡"],"じゅくご":["熟語"],"ねつ":["熱"],"あつあつ":["熱々"],"ねっちゅう":["熱中"],"ねっちゅうしょう":["熱中症"],"ねっしょう":["熱唱"],"ねったい":["熱帯"],"ねったいや":["熱帯夜"],"ねったいぎょ":["熱帯魚"],"ねっしん":["熱心"],"ねつい":["熱意"],"ねつあい":["熱愛"],"ねっき":["熱気"],"ねつけ":["熱気"],"ねっとう":["熱湯"],"ねつれつ":["熱烈"],"ねっきょう":["熱狂"],"ねっきょうてき":["熱狂的"],"ねっけつ":["熱血"],"もえる":["燃える","萌える"],"もえた":["燃えた","萌えた"],"もえない":["燃えない","萌えない"],"もえ":["萌え","燃え","萌え"],"もえて":["燃えて","萌えて"],"もえれる":["燃えれる","萌えれる"],"もえられる":["燃えられる","萌えられる"],"ねんりょう":["燃料"],"ねんしょう":["燃焼"],"ねんぴ":["燃費"],"ばくだん":["爆弾"],"ばくはつ":["爆発"],"ばくはつてき":["爆発的"],"ばくすい":["爆睡"],"ばくは":["爆破"],"ばくしょう":["爆笑"],"ばくれつ":["爆裂"],"ばくそう":["爆走"],"らんまん":["爛漫"],"つめ":["爪","詰め"],"はちゅうるい":["爬虫類"],"ちちのひ":["父の日"],"ちちうえ":["父上"],"ちちはは":["父母"],"ふぼ":["父母"],"ちちおや":["父親"],"じい":["爺","祖父"],"じじい":["爺"],"じいさん":["爺さん"],"さわやか":["爽やか"],"そうかい":["総会","爽快"],"かたづけ":["片付け","片付け"],"かたづける":["片付ける"],"かたづけた":["片付けた"],"かたづけない":["片付けない"],"かたづけて":["片付けて"],"かたづけれる":["片付けれる"],"かたづけられる":["片付けられる"],"かたおもい":["片思い"],"かたて":["片手"],"かたほう":["片方"],"かたあし":["片足"],"かたみち":["片道"],"かたすみ":["片隅"],"かたすみに":["片隅に"],"きば":["牙"],"うし":["牛"],"ぎゅう":["牛"],"ぎゅうどん":["牛丼"],"ぎゅうにゅう":["牛乳"],"ぎゅうにく":["牛肉"],"ひんば":["牝馬"],"めうま":["牝馬"],"めま":["牝馬"],"ぼれい":["牡蠣"],"ぼくじょう":["牧場"],"まきば":["牧場"],"ぼくし":["牧師"],"ものごと":["物事"],"ぶっけん":["物件"],"ぶったい":["物体"],"もったい":["物体"],"ぶっか":["物価"],"ものすごい":["物凄い"],"ものすごかった":["物凄かった"],"ものすごくない":["物凄くない"],"ものすごくて":["物凄くて"],"ものずき":["物好き"],"ものかき":["物書き"],"ぶつよく":["物欲"],"ぶつり":["物理"],"ぶつりてき":["物理的"],"ぶっさん":["物産"],"ものおき":["物置"],"ぶっしょく":["物色"],"ものがたり":["物語"],"ぶっし":["物資"],"ぶっしつ":["物質"],"ものたりない":["物足りない"],"ものたりなかった":["物足りなかった"],"ものたりなくない":["物足りなくない"],"ものたりなくて":["物足りなくて"],"とくに":["特に"],"とっか":["特価"],"とくべつ":["特別"],"とくばい":["特売"],"とくだい":["特大"],"とくてい":["特定"],"とくちょう":["特徴"],"とくちょうてき":["特徴的"],"とっきゅう":["特急"],"とくせい":["特製","特性"],"とくぎ":["特技"],"とくさつ":["特撮"],"とっこうたい":["特攻隊"],"とくゆう":["特有"],"とっけん":["特権"],"とくしゅ":["特殊"],"とくはいん":["特派員"],"とくさん":["特産"],"とくさんひん":["特産品"],"とくばん":["特番"],"とくひつ":["特筆"],"とっくん":["特訓"],"とくせつ":["特設"],"とっきょ":["特許"],"とくせん":["特選"],"とくしゅう":["特集"],"ぎせい":["犠牲"],"ぎせいしゃ":["犠牲者"],"いぬ":["犬"],"いぬねこ":["犬猫"],"けんしゅ":["犬種"],"はんにん":["犯人"],"はんざい":["犯罪"],"はんざいしゃ":["犯罪者"],"はんこう":["犯行"],"じょうたい":["状態"],"きょうき":["狂気"],"きょうげん":["狂言"],"けつね":["狐"],"ねらい":["狙い","狙い"],"ねらう":["狙う"],"ねらった":["狙った"],"ねらわない":["狙わない"],"ねらって":["狙って"],"ねらえる":["狙える"],"ねらわれる":["狙われる"],"ひとりじめ":["独り占め"],"どくせん":["独占"],"どくがく":["独学"],"どくだん":["独断"],"どくとく":["独特"],"どくはく":["独白"],"どくりつ":["独立"],"どくじ":["独自"],"どくさい":["独裁"],"どくしん":["独身"],"せまい":["狭い"],"せまかった":["狭かった"],"せまくない":["狭くない"],"せまくて":["狭くて"],"はざま":["狭間"],"たぬき":["狸"],"もうしょ":["猛暑"],"もうれつ":["猛烈"],"もうこ":["猛虎"],"しし":["肉","獣","鹿","獅子","猪"],"ねこ":["猫"],"ねこずき":["猫好き"],"ねこぜ":["猫背"],"こんだて":["献立"],"けんけつ":["献血"],"ましら":["猿"],"けだもの":["獣"],"けもの":["獣"],"じゅうい":["獣医"],"かくとく":["獲得"],"えもの":["獲物"],"げんまい":["玄米"],"げんかん":["玄関"],"げんかんさき":["玄関先"],"りつ":["率"],"ひきいる":["率いる"],"ひきいた":["率いた"],"ひきいない":["率いない"],"ひきい":["率い"],"ひきいて":["率いて"],"ひきいれる":["率いれる"],"ひきいられる":["率いられる"],"そっちょく":["率直"],"ぎょく":["玉"],"たまねぎ":["玉ねぎ","玉葱"],"たまてばこ":["玉手箱"],"おうこく":["王国"],"おうじ":["王子","皇子"],"おうざ":["王座"],"おうさま":["王様"],"おうじゃ":["王者"],"おうどう":["王道"],"おもちゃ":["玩具"],"がんぐ":["玩具"],"さんご":["産後","珊瑚"],"めずらしい":["珍しい"],"めずらしかった":["珍しかった"],"めずらしくない":["珍しくない"],"めずらしくて":["珍しくて"],"ちんどうちゅう":["珍道中"],"しゅぎょく":["珠玉"],"うつつ":["現"],"げんに":["現に"],"あらわれ":["現れ","現れ"],"あらわれた":["現れた"],"あらわれない":["現れない"],"あらわれて":["現れて"],"あらわれれる":["現れれる"],"あらわれられる":["現れられる"],"げんだいしゃかい":["現代社会"],"げんぞう":["現像"],"げんざい":["現在"],"げんち":["現地"],"げんじょう":["現場","現状"],"げんば":["現場"],"げんじつ":["現実"],"げんじつてき":["現実的"],"げんじつとうひ":["現実逃避"],"げんえき":["現役"],"げんじてん":["現時点"],"げんぶつ":["現物"],"げんしょく":["現職"],"きゅうだん":["球団","糾弾"],"きゅうこん":["球根"],"きゅうかい":["球界"],"りふじん":["理不尽"],"りじ":["理事"],"りじかい":["理事会"],"りじちょう":["理事長"],"りくつ":["理屈"],"りせい":["理性"],"りそう":["理想"],"りそうてき":["理想的"],"りゆう":["理由"],"りか":["理科"],"りけい":["理系"],"りかい":["理解"],"りろん":["理論"],"たくま":["琢磨"],"きん":["金","筋","菌","琴","禁"],"びわ":["琵琶"],"るり":["瑠璃"],"たまき":["環"],"かんきょう":["環境"],"かんきょうほご":["環境保護"],"かんきょうもんだい":["環境問題"],"かんきょうしょう":["環境省"],"ぐらむ":["瓦"],"かわらばん":["瓦版"],"あまい":["甘い"],"あまかった":["甘かった"],"あまくない":["甘くない"],"あまくて":["甘くて"],"あまいもの":["甘いもの"],"あまえ":["甘え"],"あまえんぼう":["甘えん坊"],"あまみ":["甘味","甘み"],"かんみ":["甘味","甘み"],"あまくち":["甘口"],"あまから":["甘辛"],"なま":["生"],"おいたち":["生い立ち"],"いきがい":["生きがい"],"いきる":["生きる"],"いきた":["生きた"],"いきない":["生きない"],"いきて":["生きて"],"いきれる":["生きれる"],"いきられる":["生きられる"],"いきるみち":["生きる道"],"いきかた":["生き方"],"いきざま":["生き様"],"いきのこり":["生き残り","生き残り"],"いきのこる":["生き残る"],"いきのこった":["生き残った"],"いきのこらない":["生き残らない"],"いきのこって":["生き残って"],"いきのこれる":["生き残れる"],"いきのこられる":["生き残られる"],"いきもの":["生き物"],"いきいき":["生き生き"],"しょうじる":["生じる"],"しょうじた":["生じた"],"しょうじない":["生じない"],"しょうじて":["生じて"],"しょうじれる":["生じれる"],"しょうじられる":["生じられる"],"うまれ":["生まれ","生まれ"],"うまれてはじめて":["生まれて初めて"],"うまれる":["生まれる","生まれる","産まれる"],"うまれた":["生まれた"],"うまれない":["生まれない"],"うまれて":["生まれて"],"うまれれる":["生まれれる"],"うまれられる":["生まれられる"],"うみだす":["生み出す"],"うみだした":["生み出した"],"うみださない":["生み出さない"],"うみだし":["生み出し"],"うみだして":["生み出して"],"うみだせる":["生み出せる"],"うみだされる":["生み出される"],"うんだ":["生んだ","産んだ"],"うまない":["生まない","産まない"],"うんで":["生んで","産んで"],"なまはむ":["生ハム"],"なまびーる":["生ビール"],"なまちゅうけい":["生中継"],"せいぜん":["生前"],"せいきょう":["盛況","生協"],"せいめいたい":["生命体"],"せいめいほけん":["生命保険"],"せいめいりょく":["生命力"],"せいち":["生地","聖地"],"しょうが":["生姜"],"せいぞん":["生存"],"せいねんがっぴ":["生年月日"],"せいご":["生後"],"せいと":["生徒"],"せいそく":["生息"],"なまいき":["生意気"],"あいにく":["生憎"],"せいせい":["生成"],"なまほうそう":["生放送"],"せいぎょう":["生業"],"なりわい":["生業"],"せいかつ":["生活"],"せいかつほご":["生活保護"],"せいかつしゅうかんびょう":["生活習慣病"],"せいかつしゃ":["生活者"],"せいかつひ":["生活費"],"しょうがい":["障害","生涯"],"しょうがいがくしゅう":["生涯学習"],"なまえんそう":["生演奏"],"せいぶつ":["生物"],"なまもの":["生物"],"せいさん":["生産"],"せいざん":["生産","青山"],"せいさんしゃ":["生産者"],"きっすい":["生粋"],"せいいく":["生育"],"せいたん":["生誕"],"せいかん":["生還"],"さんらん":["産卵"],"さんぴん":["産品"],"さんち":["産地"],"さんふじんか":["産婦人科"],"うぶや":["産屋"],"さんぎょう":["産業"],"さんぶつ":["産物"],"さんけいしんぶん":["産経新聞"],"おいっこ":["甥っ子"],"もちいる":["用いる"],"もちいた":["用いた"],"もちいない":["用いない"],"もちい":["餅","用い"],"もちいて":["用いて"],"もちいれる":["用いれる"],"もちいられる":["用いられる"],"ようぐ":["用具"],"ようひん":["用品"],"ようじん":["用心"],"ようごしゅう":["用語集"],"ようと":["用途"],"ようたし":["用達"],"ようたつ":["用達"],"たんぼ":["田んぼ"],"でんえん":["田園"],"でんおん":["田園"],"たうえ":["田植え"],"ゆらい":["由来"],"かぶと":["甲"],"きのえ":["甲"],"よろい":["甲","鎧"],"こうしえん":["甲子園"],"もうしで":["申し出"],"もうしわけ":["申し訳"],"もうしわけありません":["申し訳ありません"],"もうしわけございません":["申し訳ございません"],"もうしわけない":["申し訳ない"],"もうしわけなかった":["申し訳なかった"],"もうしわけなくない":["申し訳なくない"],"もうしわけなくて":["申し訳なくて"],"もうしこみ":["申し込み","申込","申込み"],"おとこのひと":["男の人"],"おとこのこ":["男の子"],"だんじ":["男児"],"おとこまえ":["男前"],"おとこおんな":["男女"],"だんじょ":["男女"],"だんし":["男子"],"だんせい":["男性"],"だんしゃく":["男爵"],"まちなみ":["町並み","街並み"],"ちょうない":["町内"],"ちょうないかい":["町内会"],"ちょうそん":["町村"],"がはく":["画伯"],"がぞう":["画像"],"がか":["画家"],"かっきてき":["画期的"],"かくさく":["画策"],"がそ":["画素"],"がしつ":["画質"],"がしゅう":["画集"],"えづら":["画面"],"がめん":["画面"],"かいわい":["界隈"],"はたけ":["畑"],"りゅうがく":["留学"],"りゅうがくせい":["留学生"],"るす":["留守"],"るすばん":["留守番"],"ちくさん":["畜産"],"ほぼ":["略","粗"],"りゃく":["略"],"りゃくして":["略して"],"つがい":["番"],"ばんごう":["番号"],"ばんち":["番地"],"ばんがい":["番外"],"ばんて":["番手"],"ばんめ":["番目"],"ばんぐみ":["番組"],"ばんちょう":["番長"],"ことなる":["異なる"],"ことなった":["異なった"],"ことならない":["異ならない"],"ことなり":["異なり"],"ことなって":["異なって"],"ことなれる":["異なれる"],"ことなられる":["異なられる"],"いどう":["移動","異動"],"いこく":["異国"],"いへん":["異変"],"いじょうきしょう":["異常気象"],"いせい":["異性"],"いぶんか":["異文化"],"いよう":["異様"],"いしょく":["移植","異色"],"いろん":["異論"],"たたみ":["畳"],"たとう":["畳"],"うとい":["疎い"],"うとかった":["疎かった"],"うとくない":["疎くない"],"うとくて":["疎くて"],"うたがい":["疑い","疑い"],"うたがう":["疑う"],"うたがった":["疑った"],"うたがわない":["疑わない"],"うたがって":["疑って"],"うたがえる":["疑える"],"うたがわれる":["疑われる"],"ぎじ":["疑似"],"ぎもん":["疑問"],"ぎわく":["疑惑"],"つかれ":["疲れ","疲れ"],"つかれた":["疲れた","疲れた"],"つかれない":["疲れない"],"つかれて":["疲れて"],"つかれれる":["疲れれる"],"つかれられる":["疲れられる"],"しっかん":["疾患","質感"],"しっぷう":["疾風"],"はやて":["疾風"],"いたずき":["病"],"いたつき":["病"],"いたづき":["病"],"やまい":["病"],"びょうにん":["病人"],"びょうめい":["病名"],"びょうしつ":["病室"],"びょうとう":["病棟"],"びょうき":["病気"],"びょうじょう":["病状"],"びょういん":["病院"],"しょうこうぐん":["症候群"],"しょうじょう":["症状"],"かいい":["痒い"],"かいかった":["痒かった"],"かいくない":["痒くない"],"かいくて":["痒くて"],"かゆい":["痒い"],"かゆかった":["痒かった"],"かゆくない":["痒くない"],"かゆくて":["痒くて"],"いたいたしい":["痛々しい"],"いたいたしかった":["痛々しかった"],"いたいたしくない":["痛々しくない"],"いたいたしくて":["痛々しくて"],"いたい":["痛い","遺体"],"いたかった":["痛かった"],"いたくない":["痛くない"],"いたくて":["痛くて"],"いたみ":["痛み","痛み"],"いたむ":["痛む"],"いたんだ":["痛んだ"],"いたまない":["痛まない"],"いたんで":["痛んで"],"いたまれる":["痛まれる"],"つうかい":["痛快"],"つうこん":["痛恨"],"つうかん":["痛感"],"やせた":["痩せた","痩せた"],"やせる":["痩せる"],"やせない":["痩せない"],"やせ":["痩せ"],"やせて":["痩せて"],"やせれる":["痩せれる"],"やせられる":["痩せられる"],"ちかん":["痴漢"],"りょうほうし":["療法士"],"りょうよう":["療養"],"いやし":["癒し","癒し"],"いやしけい":["癒し系"],"いやす":["癒す"],"いやした":["癒した"],"いやさない":["癒さない"],"いやして":["癒して"],"いやせる":["癒せる"],"いやされる":["癒される"],"くせに":["癖に"],"はつれい":["発令"],"ほっさ":["発作"],"はっしん":["発信","発進"],"はつどう":["発動"],"はつばい":["発売"],"はつばいちゅう":["発売中"],"はつばいび":["発売日"],"はっしゃ":["発射","発車"],"はってん":["発展"],"はっそう":["発想","発送"],"はっくつ":["発掘"],"はっき":["発揮"],"はっさん":["発散"],"はつめい":["発明"],"はつもう":["発毛"],"はっちゅう":["発注"],"はつねつ":["発熱"],"はっせい":["発生"],"はっしょう":["発症","発祥"],"ほったん":["発端"],"はつが":["発芽"],"はっこう":["発行","発酵"],"はっぴょう":["発表"],"はっぴょうかい":["発表会"],"はっけん":["発見"],"はっかく":["発覚"],"はつげん":["発言"],"はっそく":["発足"],"ほっそく":["発足"],"はったつ":["発達"],"はつでん":["発電"],"はつおん":["発音"],"とうじょうじんぶつ":["登場人物"],"とざん":["登山"],"とざんどう":["登山道"],"とうろく":["登録"],"とうろくしょうひょう":["登録商標"],"とうちょう":["登頂"],"しろい":["白い"],"しろかった":["白かった"],"しろくない":["白くない"],"しろくて":["白くて"],"しろわいん":["白ワイン"],"はくじん":["白人"],"はくや":["白夜"],"びゃくや":["白夜"],"はくさん":["白山"],"しろぼし":["白星"],"はくしょ":["白書"],"しらかば":["白樺"],"しらかんば":["白樺"],"しらはま":["白浜"],"はくねつ":["白熱"],"しらたま":["白玉"],"しろいし":["白石"],"はくしょく":["白色"],"はくさい":["白菜"],"しろみ":["白身"],"しろがね":["銀","白金"],"はっきん":["白金"],"あおうま":["白馬"],"しろうま":["白馬"],"はくば":["白馬"],"しらが":["白髪"],"はくはつ":["白髪"],"しらとり":["白鳥"],"しろとり":["白鳥"],"はくちょう":["白鳥"],"しろくろ":["白黒"],"ひゃく":["百"],"ひゃくまん":["百万"],"ゆり":["百合"],"ひゃくしょう":["百姓"],"ひゃくせい":["百姓"],"ひゃくねん":["百年"],"ひゃっか":["百科","百花"],"ひゃっかじてん":["百科事典"],"ひゃっかてん":["百貨店"],"ひゃくせん":["百選"],"まと":["的"],"てきちゅう":["的中"],"てきかく":["的確"],"てっかく":["的確"],"みな":["皆"],"みんな":["皆"],"みなさん":["皆さん"],"みんなさん":["皆さん"],"みなさま":["皆様"],"かいむ":["皆無"],"こうたいし":["皇太子"],"こうしつ":["皇室"],"こうきょ":["皇居"],"ひにく":["皮肉"],"ひふ":["皮膚"],"ひふか":["皮膚科"],"ぼんさい":["盆栽"],"ぼんおどり":["盆踊り"],"ますます":["益々"],"とうるい":["盗塁"],"とうさつ":["盗撮"],"さかり":["盛り"],"もりあがり":["盛り上がり","盛り上がり"],"もりあがる":["盛り上がる"],"もりあがった":["盛り上がった"],"もりあがらない":["盛り上がらない"],"もりあがって":["盛り上がって"],"もりあがれる":["盛り上がれる"],"もりあがられる":["盛り上がられる"],"もりつけ":["盛り付け"],"もりあわせ":["盛り合わせ"],"もりだくさん":["盛り沢山"],"さかん":["盛ん"],"せいだい":["盛大"],"めいゆう":["盟友"],"かんしゅう":["監修","観衆"],"かんさ":["監査"],"かんとく":["監督"],"めがさめる":["目が覚める"],"めにする":["目にする"],"めにみえる":["目に見える"],"めにみえた":["目に見えた"],"めにみえない":["目に見えない"],"めにみえ":["目に見え"],"めにみえて":["目に見えて"],"めにみえれる":["目に見えれる"],"めにみえられる":["目に見えられる"],"めのまえ":["目の前"],"めのまえに":["目の前に"],"まのあたり":["目の当たり"],"めした":["目下"],"もっか":["目下"],"めさき":["目先"],"もくぜん":["目前"],"めじるし":["目印"],"めやす":["目安"],"めあて":["目当て"],"めざす":["目指す"],"めざした":["目指した"],"めざさない":["目指さない"],"めざし":["目指し"],"めざして":["目指して"],"めざせる":["目指せる"],"めざされる":["目指される"],"もくげき":["目撃"],"もくひょう":["目標"],"もくじ":["目次"],"めだま":["目玉"],"めじろおし":["目白押し"],"もくてき":["目的"],"もくてきち":["目的地"],"めだつ":["目立つ"],"めだった":["目立った"],"めだたない":["目立たない"],"めだち":["目立ち"],"めだって":["目立って"],"めだてる":["目立てる"],"めだたれる":["目立たれる"],"めせん":["目線"],"めぐすり":["目薬"],"めざまし":["目覚まし"],"めざめ":["目覚め","目覚め"],"めざめる":["目覚める"],"めざめた":["目覚めた"],"めざめない":["目覚めない"],"めざめて":["目覚めて"],"めざめれる":["目覚めれる"],"めざめられる":["目覚められる"],"めぐろ":["目黒"],"もうどうけん":["盲導犬"],"あたいえ":["直"],"じか":["直","自家"],"ちょく":["直"],"ひた":["直"],"すぐ":["直ぐ"],"すぐに":["直ぐに"],"ただちに":["直ちに"],"じかに":["直に"],"じきに":["直に"],"ちょくぜん":["直前"],"ちょくばい":["直売"],"ちょっけい":["直径"],"ちょくご":["直後"],"ちょっかん":["直感"],"ちょくせつ":["直接"],"ちょくせつてき":["直接的"],"ちょくげき":["直撃"],"ちょくきゅう":["直球"],"ちょっきゅう":["直球"],"ちょっけつ":["直結"],"ちょくせん":["直線"],"ちょっこう":["直行"],"ちょっきん":["直近"],"ちょくそう":["直送"],"ちょくめん":["直面"],"そうご":["相互"],"そうば":["相場"],"あいかわらず":["相変わらず"],"そうとう":["相当"],"そうおう":["相応"],"ふさわしい":["相応しい"],"ふさわしかった":["相応しかった"],"ふさわしくない":["相応しくない"],"ふさわしくて":["相応しくて"],"あいて":["相手","開いて","空いて"],"すもう":["相撲"],"あいかた":["相方"],"あいぼう":["相棒"],"あいついで":["相次いで","相次いで"],"あいつぐ":["相次ぐ"],"あいついだ":["相次いだ"],"あいつがない":["相次がない"],"あいつぎ":["相次ぎ"],"あいつげる":["相次げる"],"あいつがれる":["相次がれる"],"そうぞく":["相続"],"そうだん":["相談"],"そうだんじょ":["相談所"],"そうい":["相違"],"しょうえね":["省エネ"],"しょうりゃく":["省略"],"まみえ":["見え","眉"],"まゆ":["眉"],"まゆげ":["眉毛"],"かんばん":["看板"],"かんびょう":["看病"],"かんご":["看護"],"かんごし":["看護師","看護士"],"かんごふ":["看護婦"],"あがた":["県"],"けんがい":["県外"],"けんちょう":["県庁"],"けんみん":["県民"],"けんりつ":["県立"],"けんけい":["県警"],"ま":["間","真","魔"],"まっさき":["真っ先"],"まっただなか":["真っ只中"],"まっくら":["真っ暗"],"まっさいちゅう":["真っ最中"],"まっしろ":["真っ白"],"まっさかり":["真っ盛り"],"まっすぐ":["真っ直ぐ"],"まっか":["真っ赤"],"まっさお":["真っ青"],"まっくろ":["真っ黒"],"しんに":["真に"],"しんの":["真の"],"まんなか":["真ん中"],"まうえ":["真上"],"まねし":["真似し"],"まふゆ":["真冬"],"しんけん":["真剣"],"まなつ":["真夏"],"まなつび":["真夏日"],"まよなか":["真夜中"],"さな":["真実"],"しんじつ":["真実"],"しんい":["真意"],"しんし":["親子","紳士","真摯"],"ましょうめん":["真正面"],"しんじゅ":["真珠"],"さなだ":["真田"],"しんめんぼく":["真面目"],"しんめんもく":["真面目"],"まじめ":["真面目"],"ねむい":["眠い"],"ねむかった":["眠かった"],"ねむくない":["眠くない"],"ねむくて":["眠くて"],"ねむたい":["眠たい"],"ねむたかった":["眠たかった"],"ねむたくない":["眠たくない"],"ねむたくて":["眠たくて"],"ねむり":["眠り","眠り"],"ねぶる":["眠る"],"ねむる":["眠る"],"ねむった":["眠った"],"ねむらない":["眠らない"],"ねむって":["眠って"],"ねむれる":["眠れる"],"ねむられる":["眠られる"],"ねむけ":["眠気"],"まぶしい":["眩しい"],"まぶしかった":["眩しかった"],"まぶしくない":["眩しくない"],"まぶしくて":["眩しくて"],"まぼしい":["眩しい"],"まぼしかった":["眩しかった"],"まぼしくない":["眩しくない"],"まぼしくて":["眩しくて"],"ながめ":["眺め","眺め","長め"],"ながめる":["眺める"],"ながめた":["眺めた"],"ながめない":["眺めない"],"ながめて":["眺めて"],"ながめれる":["眺めれる"],"ながめられる":["眺められる"],"ちょうぼう":["眺望"],"まなこ":["眼"],"まなざし":["眼差し"],"がんか":["眼科"],"がんきょう":["眼鏡"],"めがね":["眼鏡"],"ちゃく":["着"],"きぐるみ":["着ぐるみ"],"きつけ":["着付け"],"ちゃくしん":["着信"],"ちゃくち":["着地"],"ちゃくじつ":["着実"],"ちゃっこう":["着工"],"ちゃくしゅ":["着手"],"きがえ":["着替え"],"きもの":["着物"],"ちゃくよう":["着用"],"ちゃくりく":["着陸"],"すいみん":["睡眠"],"すいみんぶそく":["睡眠不足"],"すいみんじかん":["睡眠時間"],"すいれん":["睡蓮"],"めいそう":["迷走","瞑想"],"しゅんじ":["瞬時"],"しゅんかん":["瞬間"],"むじゅん":["矛盾"],"やさき":["矢先"],"しっている":["知っている"],"しっていた":["知っていた"],"しっていない":["知っていない"],"しってい":["知ってい"],"しっていて":["知っていて"],"しっていれる":["知っていれる"],"しっていられる":["知っていられる"],"しらず":["知らず"],"しらせ":["知らせ","知らせ"],"しらせる":["知らせる"],"しらせた":["知らせた"],"しらせない":["知らせない"],"しらせて":["知らせて"],"しらせれる":["知らせれる"],"しらせられる":["知らせられる"],"しらない":["知らない","知らない"],"しらなかった":["知らなかった"],"しらなくない":["知らなくない"],"しらなくて":["知らなくて"],"しらないうちに":["知らないうちに"],"しりあい":["知り合い"],"しった":["知った"],"しって":["知って"],"しれる":["知れる"],"しられる":["知られる"],"しるひとぞしる":["知る人ぞ知る"],"ちじ":["知事"],"ちじん":["知人"],"ちめいど":["知名度"],"ちせい":["知性"],"ちえ":["知恵"],"ちえぶくろ":["知恵袋"],"ちてき":["知的"],"ちしき":["知識"],"みじかい":["短い"],"みじかかった":["短かった"],"みじかくない":["短くない"],"みじかくて":["短くて"],"みじかめ":["短め"],"たんざく":["短冊"],"たんじゃく":["短冊"],"たんだい":["短大"],"たんじかん":["短時間"],"たんき":["短期"],"たんきかん":["短期間"],"たんぺん":["短編"],"たんしゅく":["短縮"],"たんきょり":["短距離"],"せっけん":["石鹸","石けん"],"いしがき":["石垣"],"いしかわけん":["石川県"],"いしばし":["石橋"],"せっきょう":["説教","石橋"],"せきゆ":["石油"],"すな":["砂"],"すなどけい":["砂時計"],"すなはま":["砂浜"],"さばく":["砂漠"],"さとう":["砂糖"],"けんしゅう":["研修"],"けんしゅうかい":["研修会"],"けんきゅう":["研究"],"けんきゅうかい":["研究会"],"けんきゅういん":["研究員"],"けんきゅうしつ":["研究室"],"けんきゅうか":["研究家"],"けんきゅうしょ":["研究所"],"けんきゅうじょ":["研究所"],"けんきゅうしゃ":["研究者"],"けんきゅうかいはつ":["研究開発"],"やぶり":["破り","破り"],"やぶる":["破る"],"やぶった":["破った"],"やぶらない":["破らない"],"やぶって":["破って"],"やぶられる":["破られる"],"はかい":["破壊"],"はそん":["破損"],"はめつ":["破滅"],"はさん":["破産"],"はたん":["破綻"],"いおう":["硫黄"],"いしぶみ":["碑"],"あお":["青","蒼","碧"],"たしか":["確か","確"],"たしかに":["確かに"],"たしかめる":["確かめる"],"たしかめた":["確かめた"],"たしかめない":["確かめない"],"たしかめ":["確かめ"],"たしかめて":["確かめて"],"たしかめれる":["確かめれる"],"たしかめられる":["確かめられる"],"かくほ":["確保"],"かくてい":["確定"],"かくていしんこく":["確定申告"],"かくじつ":["確実"],"かくりつ":["確率","確立"],"かくにん":["確認"],"みがき":["磨き","磨き"],"みがく":["磨く"],"みがいた":["磨いた"],"みがかない":["磨かない"],"みがいて":["磨いて"],"みがける":["磨ける"],"みがかれる":["磨かれる"],"しめし":["示し","示し"],"しめす":["示す"],"しめした":["示した"],"しめさない":["示さない"],"しめして":["示して"],"しめせる":["示せる"],"しめされる":["示される"],"しさ":["示唆"],"れいぎ":["礼儀"],"らいはい":["礼拝"],"れいはい":["礼拝"],"やしろ":["社"],"しゃこう":["社交"],"しゃかい":["社会"],"しゃかいじん":["社会人"],"しゃかいほけん":["社会保険"],"しゃかいほけんろうむし":["社会保険労務士"],"しゃかいほけんちょう":["社会保険庁"],"しゃかいほしょう":["社会保障"],"しゃかいもんだい":["社会問題"],"しゃかいてき":["社会的"],"しゃかいふくし":["社会福祉"],"しゃかいか":["社会科"],"しゃかいこうけん":["社会貢献"],"しゃない":["車内","社内"],"しゃいん":["社員"],"しゃだん":["社団"],"しゃだんほうじん":["社団法人"],"しゃせつ":["社説"],"しゃちょう":["社長"],"ぎおん":["祇園"],"ぎおんまつり":["祇園祭"],"いのり":["祈り","祈り"],"いのる":["祈る"],"いのった":["祈った"],"いのらない":["祈らない"],"いのって":["祈って"],"いのれる":["祈れる"],"いのられる":["祈られる"],"きねん":["記念","祈念"],"きがん":["祈願"],"そこく":["祖国"],"うば":["祖母"],"そぼ":["祖母"],"おおじ":["祖父"],"そふ":["祖父"],"そぶ":["祖父"],"そふぼ":["祖父母"],"いわい":["祝","祝い","祝い"],"いわう":["祝う"],"いわった":["祝った"],"いわわない":["祝わない"],"いわって":["祝って"],"いわえる":["祝える"],"いわわれる":["祝われる"],"しゅくじつ":["祝日"],"しゅくふく":["祝福"],"かみがみ":["神々"],"かながわけん":["神奈川県"],"じんぐう":["神宮"],"こうべ":["頭","神戸","首"],"かぐら":["神楽"],"かみさま":["神様"],"かみた":["神田"],"じんじゃ":["神社"],"じんじゃぶっかく":["神社仏閣"],"しんぴ":["神秘"],"しんぴてき":["神秘的"],"しんけい":["神経"],"しんけいしつ":["神経質"],"しんわ":["神話"],"みこし":["神輿"],"ひょう":["表","票","評"],"まつり":["祭り","祭"],"きんだん":["禁断"],"きんし":["禁止"],"きんえん":["禁煙"],"きんもつ":["禁物"],"ふくいけん":["福井県"],"ふくおか":["福岡"],"ふくおかけん":["福岡県"],"ふくしまけん":["福島県"],"ふくし":["福祉"],"ふくぶくろ":["福袋"],"ふくいん":["福音"],"しゅういつ":["秀逸"],"あたくし":["私"],"あたし":["私"],"あっし":["私"],"わし":["私","鷲"],"わたい":["私"],"わたくし":["私"],"わっし":["私"],"わっち":["私"],"わて":["私"],"わらわ":["私"],"わたくしたち":["私たち","私達"],"わたしたち":["私たち","私達"],"わたくしのばあい":["私の場合"],"わたくしごと":["私事"],"しふく":["至福","私服"],"しせいかつ":["私生活"],"わたしてき":["私的"],"わたくしりつ":["私立"],"わたくしじしん":["私自身"],"わたしじしん":["私自身"],"しけん":["試験","私見"],"してつ":["私鉄"],"あき":["秋","開き","空き","飽き","飽き","空き"],"さんま":["秋刀魚"],"あきばれ":["秋晴れ"],"あきたけん":["秋田県"],"あきかぜ":["秋風"],"しゅうふう":["秋風"],"かがくぎじゅつ":["科学技術"],"かがくてき":["科学的"],"かがくしゃ":["科学者"],"かもく":["科目"],"びょう":["秒","苗"],"ひほう":["秘宝"],"ひみつ":["秘密"],"ひしょ":["秘書"],"ひぞう":["秘蔵"],"ひけつ":["秘訣"],"ひわ":["秘話"],"ちつじょ":["秩序"],"しょうごう":["称号"],"うつりかわり":["移り変わり"],"いじゅう":["移住"],"いにゅう":["移入"],"いみん":["移民"],"いせき":["移籍","遺跡"],"いてん":["移転"],"ほど":["程"],"ほどに":["程に"],"ていど":["程度"],"ほどとおい":["程遠い"],"ほどとおかった":["程遠かった"],"ほどとおくない":["程遠くない"],"ほどとおくて":["程遠くて"],"ぜい":["税"],"ぜいせい":["税制"],"ぜいりつ":["税率"],"ぜいりし":["税理士"],"ぜいこみ":["税込","税込み"],"ぜいきん":["税金"],"たね":["種"],"しゅもく":["種目"],"しゅるい":["種類"],"いね":["稲"],"いねかり":["稲刈り"],"いなほ":["稲穂"],"いなり":["稲荷"],"かせぎ":["稼ぎ","稼ぎ","鹿"],"かせぐ":["稼ぐ"],"かせいだ":["稼いだ"],"かせがない":["稼がない"],"かせいで":["稼いで"],"かせげる":["稼げる","稼げる"],"かせがれる":["稼がれる"],"かせげた":["稼げた"],"かせげない":["稼げない"],"かせげ":["稼げ"],"かせげて":["稼げて"],"かせげれる":["稼げれる"],"かせげられる":["稼げられる"],"かどう":["稼動","稼働","花道"],"けいこ":["稽古"],"けいこば":["稽古場"],"こくもつ":["穀物"],"つみかさね":["積み重ね"],"せっきょくてき":["積極的"],"せきせつ":["積雪"],"おだやか":["穏やか"],"あなば":["穴場"],"あなうま":["穴馬"],"きゅうきょく":["究極"],"くう":["空","食う"],"あきち":["空き地"],"あかない":["開かない","空かない"],"あける":["開ける","開ける","空ける"],"あかれる":["開かれる","空かれる"],"すく":["空く"],"すいた":["空いた"],"すかない":["空かない"],"すいて":["空いて"],"すける":["空ける"],"すかれる":["空かれる"],"からっぽ":["空っぽ"],"くうちゅう":["空中"],"からまわり":["空回り"],"くうせき":["空席"],"くうそう":["空想"],"からて":["空手"],"からぶり":["空振り"],"そらもよう":["空模様"],"くうき":["空気"],"くうこう":["空港"],"くうはく":["空白"],"くうふく":["空腹"],"そらいろ":["空色"],"くうしゅう":["空襲"],"あきま":["空間"],"くうかん":["空間"],"そらとぶ":["空飛ぶ"],"そらとんだ":["空飛んだ"],"そらとばない":["空飛ばない"],"そらとび":["空飛び"],"そらとんで":["空飛んで"],"そらとめる":["空飛める"],"そらとばれる":["空飛ばれる"],"つっこみ":["突っ込み","突っ込み"],"つっこむ":["突っ込む"],"つっこんだ":["突っ込んだ"],"つっこまない":["突っ込まない"],"つっこんで":["突っ込んで"],"つっこまれる":["突っ込まれる"],"とつにゅう":["突入"],"とつじょ":["突如"],"とつげき":["突撃"],"とつぜん":["突然"],"とっぱつ":["突発"],"とっぱ":["突破"],"まど":["窓"],"まどぐち":["窓口"],"まどべ":["窓辺"],"まどぎわ":["窓際"],"きゅうくつ":["窮屈"],"かま":["缶","釜","窯","鎌"],"たちあがり":["立ち上がり","立ち上がり"],"たちあがる":["立ち上がる"],"たちあがった":["立ち上がった"],"たちあがらない":["立ち上がらない"],"たちあがって":["立ち上がって"],"たちあがれる":["立ち上がれる"],"たちあがられる":["立ち上がられる"],"たちあげ":["立ち上げ"],"たちいり":["立ち入り"],"たちむかう":["立ち向かう"],"たちむかった":["立ち向かった"],"たちむかわない":["立ち向かわない"],"たちむかい":["立ち向かい"],"たちむかって":["立ち向かって"],"たちむかえる":["立ち向かえる"],"たちむかわれる":["立ち向かわれる"],"たちよる":["立ち寄る"],"たちよった":["立ち寄った"],"たちよらない":["立ち寄らない"],"たちより":["立ち寄り"],"たちよって":["立ち寄って"],"たちよれる":["立ち寄れる"],"たちよられる":["立ち寄られる"],"たちよみ":["立ち読み"],"たてつづけ":["立て続け"],"りったい":["立体"],"りっこうほ":["立候補"],"たちば":["立場"],"りっぱ":["立派"],"りっしゅう":["立秋"],"りゅうめ":["竜馬"],"どうわ":["童話"],"はな":["花","華","鼻","端"],"はなから":["端から"],"はしっこ":["端っこ"],"はじっこ":["端っこ"],"たんまつ":["端末"],"きそう":["競う"],"きそった":["競った"],"きそわない":["競わない"],"きそい":["競い"],"きそって":["競って"],"きそえる":["競える"],"きそわれる":["競われる"],"きょうそう":["競争","競走"],"きょうぎじょう":["競技場"],"きょうえい":["競泳"],"きょうそうば":["競走馬"],"けいりん":["競輪"],"けいば":["競馬"],"けいばじょう":["競馬場"],"たけばやし":["竹林"],"ちくりん":["竹林"],"さお":["竿"],"わらい":["笑い","笑い"],"わらいごえ":["笑い声"],"わらう":["笑う"],"わらった":["笑った"],"わらわない":["笑わない"],"わらって":["笑って"],"わらえる":["笑える"],"わらわれる":["笑われる"],"えみ":["笑み"],"えがお":["笑顔"],"だいいち":["第１","第一"],"だいいちいんしょう":["第一印象"],"だいいっかい":["第一回"],"だいいちじ":["第一次"],"だいいっぽ":["第一歩"],"だいさん":["第３","第三"],"だいさんしゃ":["第三者"],"だいに":["第２","第二"],"だいにじ":["第二次"],"だいにぶ":["第二部"],"だいご":["第五"],"だいよん":["第４","第四"],"ふで":["筆"],"ひっしゃ":["筆者"],"ひっき":["筆記"],"ひっとう":["筆頭"],"はず":["筈"],"など":["等"],"とうとう":["等々"],"などなど":["等々"],"ひとしい":["等しい"],"ひとしかった":["等しかった"],"ひとしくない":["等しくない"],"ひとしくて":["等しくて"],"とうしんだい":["等身大"],"すじ":["筋"],"きんとれ":["筋トレ"],"きんりょく":["筋力"],"きんにく":["筋肉"],"すじにく":["筋肉"],"きんにくつう":["筋肉痛"],"たけのこ":["筍"],"とうべん":["答弁"],"さくてい":["策定"],"かじょう":["過剰","箇条"],"さんすう":["算数"],"くだ":["管"],"かんり":["管理"],"かんりにん":["管理人"],"かんりしゃ":["管理者"],"かんりしょく":["管理職"],"はこ":["箱"],"はこいり":["箱入り"],"のっと":["節"],"ふし":["節"],"せちぶん":["節分"],"せつぶん":["節分"],"ふしめ":["節目"],"せつやく":["節約"],"はんい":["範囲"],"はんいない":["範囲内"],"きずく":["築く"],"きずいた":["築いた"],"きずかない":["築かない"],"きずき":["築き"],"きずいて":["築いて"],"きずける":["築ける"],"きずかれる":["築かれる"],"ついじ":["築地"],"つきじ":["築地"],"かんい":["簡易"],"ぼき":["簿記"],"べい":["米"],"めめ":["米"],"よね":["米"],"めーとる":["米"],"べいこく":["米国"],"べいぐん":["米軍"],"こな":["粉"],"ふんまつ":["粉末"],"つぶ":["粒"],"そまつ":["粗末"],"ねばり":["粘り"],"ねばつち":["粘土"],"かゆ":["粥"],"せいいっぱい":["精一杯"],"せいりょくてき":["精力的"],"せいみつ":["精密"],"せいしん":["精神"],"せいしんりょく":["精神力"],"せいしんてき":["精神的"],"せいしんか":["精神科"],"せいつう":["精通"],"しょうじん":["精進"],"そうじん":["精進"],"せいれい":["精霊"],"とうにょうびょう":["糖尿病"],"くそ":["糞"],"かて":["糧"],"けいれつ":["系列"],"けいとう":["系統"],"やくそく":["約束"],"べに":["紅"],"こうはく":["紅白"],"こうちゃ":["紅茶"],"もみじ":["紅葉"],"ぐれん":["紅蓮"],"おさめ":["納め"],"のうひん":["納品"],"なっとく":["納得"],"のうりょう":["納涼"],"のうぜい":["納税"],"なっとう":["納豆"],"ひも":["紐"],"じゅんじょう":["純情"],"じゅんせい":["純正"],"じゅんすい":["純粋"],"かみひとえ":["紙一重"],"かみぶくろ":["紙袋"],"しめん":["紙面"],"まぎれ":["紛れ"],"まぐれ":["紛れ"],"ふんそう":["紛争"],"ふんしつ":["紛失"],"しろうと":["素人"],"すてき":["素敵"],"すばやく":["素早く"],"すばらしい":["素晴らしい","素晴しい"],"すばらしかった":["素晴らしかった","素晴しかった"],"すばらしくない":["素晴らしくない","素晴しくない"],"すばらしくて":["素晴らしくて","素晴しくて"],"すんばらしい":["素晴らしい","素晴しい"],"すんばらしかった":["素晴らしかった","素晴しかった"],"すんばらしくない":["素晴らしくない","素晴しくない"],"すんばらしくて":["素晴らしくて","素晴しくて"],"すばらしき":["素晴らしき"],"そぼく":["素朴"],"そざい":["素材"],"すなお":["素直"],"すどおり":["素通り"],"すがお":["素顔"],"さくいん":["索引"],"むらさき":["紫"],"しがいせん":["紫外線"],"むらさきいろ":["紫色"],"るいけい":["累計"],"いささ":["細"],"いさら":["細"],"ささら":["細"],"さざら":["細"],"さざれ":["細"],"ほそ":["細"],"こまごま":["細々"],"ほそぼそ":["細々"],"こまごまと":["細々と"],"ほそい":["細い"],"ほそかった":["細かった"],"ほそくない":["細くない"],"ほそくて":["細くて"],"こまかい":["細かい"],"こまかかった":["細かかった"],"こまかくない":["細かくない"],"こまかくて":["細かくて"],"こまかいこと":["細かいこと"],"こまかく":["細かく"],"こまやか":["細やか"],"ささやか":["細やか"],"さいく":["細工"],"さいぼう":["細胞"],"ほそみち":["細道"],"さいぶ":["細部"],"おわり":["終わり","終わり","終","終り"],"じまい":["終い"],"おえる":["追える","終える"],"おえた":["終えた"],"おえない":["終えない"],"おえ":["終え"],"おえて":["終えて"],"おえれる":["終えれる"],"おえられる":["終えられる"],"おわる":["終わる"],"おわった":["終わった"],"おわらない":["終わらない"],"おわって":["終わって"],"おわれる":["終われる","追われる"],"おわられる":["終わられる"],"しゅうりょうご":["終了後"],"しゅうせん":["終戦"],"しゅうせんきねんび":["終戦記念日"],"しゅうじつ":["終日"],"ひねもす":["終日"],"ひめもす":["終日"],"ひもすがら":["終日"],"しゅうえん":["終焉","終演"],"しゅうてん":["終点"],"しゅうばん":["終盤"],"しゅうけつ":["集結","終結"],"しゅうでん":["終電"],"くみ":["組","組み","組み","苦味"],"くみあわせ":["組み合わせ"],"くみたて":["組み立て"],"くむ":["組む"],"くんだ":["組んだ"],"くまない":["組まない"],"くんで":["組んで"],"くまれる":["組まれる"],"くみあい":["組合"],"くみきょく":["組曲"],"そしき":["組織"],"くみちょう":["組長"],"きずな":["絆"],"たていと":["経"],"けいえい":["経営"],"けいえいしゃ":["経営者"],"けいれき":["経歴"],"けいざい":["経済"],"けいざいがく":["経済学"],"けいざいせいちょう":["経済成長"],"けいざいてき":["経済的"],"けいり":["経理"],"けいゆ":["経由"],"いきさつ":["経緯"],"けいひ":["経費"],"けいろ":["経路"],"けいか":["経過"],"けいけん":["経験"],"けいけんち":["経験値"],"けいけんしゃ":["経験者"],"むすび":["結び","結び"],"むすぶ":["結ぶ"],"むすんだ":["結んだ"],"むすばない":["結ばない"],"むすんで":["結んで"],"むすめる":["結める"],"むすばれる":["結ばれる"],"けっこん":["結婚"],"けっこんしき":["結婚式"],"けっこんせいかつ":["結婚生活"],"けっこんきねんび":["結婚記念日"],"けっきょく":["結局"],"けっきょくのところ":["結局のところ"],"けっせい":["結成"],"けつまつ":["結末"],"けっか":["結果"],"けっかはっぴょう":["結果発表"],"けっかてき":["結果的"],"けっこうたいへん":["結構大変"],"けっしゃ":["結社"],"けつろん":["結論"],"けっしゅう":["結集"],"しぼり":["絞り"],"からみ":["絡み","絡み"],"がらみ":["絡み"],"からむ":["絡む"],"からんだ":["絡んだ"],"からまない":["絡まない"],"からんで":["絡んで"],"からまれる":["絡まれる"],"きゅうよ":["給与"],"きゅうふ":["給付"],"きゅうりょうび":["給料日"],"きゅうゆ":["給油"],"きゅうしょく":["給食"],"じゅうたん":["絨毯"],"とういつ":["統一"],"とうせい":["統制"],"とうごう":["統合"],"とうけい":["統計"],"えのぐ":["絵の具"],"えをえがく":["絵を描く"],"えをえがいた":["絵を描いた"],"えをえがかない":["絵を描かない"],"えをえがき":["絵を描き"],"えをえがいて":["絵を描いて"],"えをえがける":["絵を描ける"],"えをえがかれる":["絵を描かれる"],"えをかく":["絵を描く"],"えをかいた":["絵を描いた"],"えをかかない":["絵を描かない"],"えをかき":["絵を描き"],"えをかいて":["絵を描いて"],"えをかける":["絵を描ける"],"えをかかれる":["絵を描かれる"],"えし":["絵師"],"えてがみ":["絵手紙"],"えかき":["絵描き"],"えもじ":["絵文字"],"えにっき":["絵日記"],"えほん":["絵本"],"えがら":["絵柄"],"かいが":["絵画"],"えはがき":["絵葉書"],"たえず":["絶えず"],"ぜっく":["絶句"],"ぜっきょう":["絶叫"],"ぜっぴん":["絶品"],"ぜつだい":["絶大"],"ぜっこう":["絶好"],"ぜっこうちょう":["絶好調"],"ぜつみょう":["絶妙"],"ぜったい":["絶対"],"ぜったいに":["絶対に"],"ぜったいてき":["絶対的"],"ぜっけい":["絶景"],"ぜつぼう":["絶望"],"ぜつぼうてき":["絶望的"],"ぜつめつ":["絶滅"],"ぜっさん":["絶賛"],"けいしょう":["継承"],"けいぞく":["継続"],"けいぞくはちからなり":["継続は力なり"],"しょく":["色","食","続","職"],"ぞくぞく":["続々"],"つづき":["続き","続き"],"つづく":["続く"],"つづいた":["続いた"],"つづかない":["続かない"],"つづいて":["続いて"],"つづける":["続ける","続ける"],"つづかれる":["続かれる"],"つづけた":["続けた"],"つづけない":["続けない"],"つづけ":["続け"],"つづけて":["続けて"],"つづけれる":["続けれる"],"つづけられる":["続けられる"],"ぞくしゅつ":["続出"],"ぞくほう":["続報"],"ぞくへん":["続編"],"ぞっこう":["続行"],"かせ":["綛"],"いしん":["維新"],"あみど":["網戸"],"もうら":["網羅"],"つづり":["綴り","綴り"],"つづる":["綴る"],"つづった":["綴った"],"つづらない":["綴らない"],"つづって":["綴って"],"つづれる":["綴れる"],"つづられる":["綴られる"],"めん":["面","麺","綿"],"きんちょう":["緊張"],"きんきゅう":["緊急"],"きんぱく":["緊迫"],"そうむ":["総務"],"そうむしょう":["総務省"],"そうぜい":["総勢"],"そうごう":["総合"],"そうごうてき":["総合的"],"そうかつ":["総括"],"そうり":["総理"],"そうりだいじん":["総理大臣"],"そうさい":["総裁"],"そうさいせん":["総裁選"],"そうせんきょ":["総選挙"],"そうしゅうへん":["総集編"],"そうがく":["総額"],"みどり":["緑"],"りょくか":["緑化"],"りょっか":["緑化"],"りょくち":["緑地"],"みどりいろ":["緑色"],"りょくしょく":["緑色"],"りょくちゃ":["緑茶"],"いとぐち":["緒"],"せんろ":["線路"],"しめきり":["締め切り","締切"],"あみもの":["編み物"],"へんせい":["編成"],"へんきょく":["編曲"],"へんしゅう":["編集"],"へんしゅうしゃ":["編集者"],"へんしゅうぶ":["編集部"],"へんしゅうちょう":["編集長"],"ゆるやか":["緩やか"],"かんわ":["閑話","緩和"],"れんしゅう":["練習"],"れんしゅうじょう":["練習場"],"れんしゅうじあい":["練習試合"],"ちみつ":["緻密"],"えに":["縁"],"えにし":["縁"],"ゆかり":["縁"],"えんがわ":["縁側"],"なわ":["縄"],"じょうもん":["縄文"],"ほしいまま":["縦"],"じゅうだん":["縦断"],"しゅくしょう":["縮小"],"はんしょく":["繁殖"],"はんじょう":["繁盛"],"はんかがい":["繁華街"],"せんさい":["繊細"],"せんい":["繊維"],"つながり":["繋がり","繋がり"],"つながる":["繋がる"],"つながった":["繋がった"],"つながらない":["繋がらない"],"つながって":["繋がって"],"つながれる":["繋がれる","繋がれる"],"つながられる":["繋がられる"],"つなぐ":["繋ぐ"],"つないだ":["繋いだ"],"つながない":["繋がない"],"つなぎ":["繋ぎ"],"つないで":["繋いで"],"つなげる":["繋げる"],"くりひろげる":["繰り広げる"],"くりひろげた":["繰り広げた"],"くりひろげない":["繰り広げない"],"くりひろげ":["繰り広げ"],"くりひろげて":["繰り広げて"],"くりひろげれる":["繰り広げれる"],"くりひろげられる":["繰り広げられる"],"くりかえす":["繰り返す"],"くりかえした":["繰り返した"],"くりかえさない":["繰り返さない"],"くりかえして":["繰り返して"],"くりかえせる":["繰り返せる"],"くりかえされる":["繰り返される"],"ほとぎ":["缶"],"かんこーひー":["缶コーヒー"],"かんづめ":["缶詰"],"わな":["罠"],"つみ":["罪"],"ざいあくかん":["罪悪感"],"おきざり":["置き去り"],"おきば":["置き場"],"おかない":["置かない"],"おいて":["置いて","追い風"],"おける":["置ける"],"おかれる":["置かれる"],"おきもの":["置物"],"ばち":["罰"],"ばつ":["罰"],"ばっきん":["罰金"],"しょめい":["署名"],"うすもの":["羅"],"らしんばん":["羅針盤"],"うつくしい":["美しい"],"うつくしかった":["美しかった"],"うつくしくない":["美しくない"],"うつくしくて":["美しくて"],"びじん":["美人"],"びみ":["美味"],"おいしい":["美味しい"],"おいしかった":["美味しかった"],"おいしくない":["美味しくない"],"おいしくて":["美味しくて"],"びじょ":["美女"],"びがく":["美学"],"びよう":["美容"],"びようし":["美容師"],"びよういん":["美容院"],"びしょうじょ":["美少女"],"びけい":["美形"],"びはく":["美白"],"びてき":["美的"],"びはだ":["美肌"],"びきゃく":["美脚"],"びじゅつ":["美術"],"びじゅつてん":["美術展"],"びじゅつかん":["美術館"],"びしょく":["美食"],"しゅうちしん":["羞恥心"],"ぐん":["軍","郡","群"],"むれ":["群れ"],"ぐんじょう":["群生"],"ぐんせい":["群生"],"ぐんまけん":["群馬県"],"うらやましい":["羨ましい"],"うらやましかった":["羨ましかった"],"うらやましくない":["羨ましくない"],"うらやましくて":["羨ましくて"],"ぎむ":["義務"],"ぎぼ":["義母"],"ぎり":["義理"],"はね":["羽","羽根"],"ぱ":["羽"],"うか":["羽化"],"はめ":["羽目"],"おきな":["翁"],"よくとし":["翌年"],"よくねん":["翌年"],"よくじつ":["翌日"],"よくげつ":["翌月"],"よくあさ":["翌朝"],"よくちょう":["翌朝"],"ならいごと":["習い事"],"ならう":["習う"],"ならった":["習った"],"ならわない":["習わない"],"ならい":["習い"],"ならって":["習って"],"ならえる":["習える"],"ならわれる":["習われる"],"しゅうとく":["習得"],"しゅうかん":["週間","週刊","習慣"],"ほんろう":["翻弄"],"ほんやく":["翻訳"],"ろうじん":["老人"],"ろうじんほーむ":["老人ホーム"],"ろうご":["老後"],"しにせ":["老舗"],"ろうほ":["老舗"],"ろうじゃく":["老若"],"ろうにゃく":["老若"],"ろうじゃくだんじょ":["老若男女"],"ろうにゃくなんにょ":["老若男女"],"かんがえ":["考え","考え"],"かんがえてみれば":["考えてみれば"],"かんがえられない":["考えられない"],"かんがえられなかった":["考えられなかった"],"かんがえられなくない":["考えられなくない"],"かんがえられなくて":["考えられなくて"],"かんがえる":["考える"],"かんがえた":["考えた"],"かんがえない":["考えない"],"かんがえて":["考えて"],"かんがえれる":["考えれる"],"かんがえられる":["考えられる"],"かんがえかた":["考え方"],"こうさつ":["考察"],"こうりょ":["考慮"],"たえる":["耐える"],"たえた":["耐えた"],"たえない":["耐えない"],"たえ":["耐え"],"たえて":["耐えて"],"たえれる":["耐えれる"],"たえられる":["耐えられる"],"たいきゅう":["耐久"],"たいしん":["耐震"],"みみ":["耳"],"みみにする":["耳にする"],"じびか":["耳鼻科"],"ひじり":["聖"],"せいなる":["聖なる"],"せいどう":["聖堂"],"せいしょ":["聖書"],"せいかりれー":["聖火リレー"],"きこえ":["聞こえ","聞こえ"],"きこえる":["聞こえる"],"きこえた":["聞こえた"],"きこえない":["聞こえない"],"きこえて":["聞こえて"],"きこえれる":["聞こえれる"],"きこえられる":["聞こえられる"],"ちょうかく":["聴覚"],"しょくにん":["職人"],"しょくむ":["職務"],"しょくいん":["職員"],"しょくば":["職場"],"しょくぎょう":["職業"],"しょくしゅ":["職種"],"にく":["肉"],"にくまん":["肉まん"],"にくたい":["肉体"],"にくたいてき":["肉体的"],"にくや":["肉屋"],"にくりょうり":["肉料理"],"にくきゅう":["肉球"],"にくしょく":["肉食"],"はだ":["肌"],"はだえ":["肌"],"はださむい":["肌寒い"],"はださむかった":["肌寒かった"],"はださむくない":["肌寒くない"],"はださむくて":["肌寒くて"],"はだざむい":["肌寒い"],"はだざむかった":["肌寒かった"],"はだざむくない":["肌寒くない"],"はだざむくて":["肌寒くて"],"しょうぞう":["肖像"],"きも":["肝"],"かんじん":["肝心"],"かんえん":["肝炎"],"かんぞう":["肝臓"],"こかんせつ":["股関節"],"ひりょう":["肥料"],"ひまん":["肥満"],"かたこり":["肩こり"],"かたがき":["肩書き"],"そだち":["育ち","育ち"],"そだつ":["育つ"],"そだった":["育った"],"そだたない":["育たない"],"そだって":["育って"],"そだてる":["育てる","育てる"],"そだたれる":["育たれる"],"そだて":["育て","育て"],"そだてた":["育てた"],"そだてない":["育てない"],"そだてて":["育てて"],"そだてれる":["育てれる"],"そだてられる":["育てられる"],"そだてかた":["育て方"],"いくじ":["育児"],"いくせい":["育成"],"さかな":["魚","肴"],"はいえん":["肺炎"],"いぶくろ":["胃袋"],"せなか":["背中"],"せなかのいたみ":["背中の痛み"],"せのび":["背伸び"],"はいご":["背後"],"せばんごう":["背番号"],"せすじ":["背筋"],"はいきん":["背筋"],"しょった":["背負った"],"しょわない":["背負わない"],"しょい":["背負い"],"しょって":["背負って"],"しょえる":["背負える"],"しょわれる":["背負われる"],"せおう":["背負う"],"せおった":["背負った"],"せおわない":["背負わない"],"せおい":["背負い"],"せおって":["背負って"],"せおえる":["背負える"],"せおわれる":["背負われる"],"ごま":["胡麻"],"むなもと":["胸元"],"のう":["脳","農","能"],"のうりょく":["能力"],"やに":["脂"],"きょうはく":["脅迫"],"わきやく":["脇役"],"みゃく":["脈"],"きゃくほん":["脚本"],"きゃくほんか":["脚本家"],"ぬぐ":["脱ぐ"],"ぬいだ":["脱いだ"],"ぬがない":["脱がない"],"ぬぎ":["脱ぎ"],"ぬいで":["脱いで"],"ぬげる":["脱げる"],"ぬがれる":["脱がれる"],"だっしゅつ":["脱出"],"だつりょく":["脱力"],"だっきゃく":["脱却"],"だつぼう":["脱帽"],"だつもう":["脱毛"],"だっぴ":["脱皮"],"だっせん":["脱線"],"だっそう":["脱走"],"だったい":["脱退"],"のうみそ":["脳みそ"],"のうない":["脳内"],"のうこうそく":["脳梗塞"],"のうり":["脳裏"],"じんぞう":["腎臓"],"ふじょし":["腐女子"],"ふはい":["腐敗"],"うで":["腕"],"かいな":["腕"],"うでまえ":["腕前"],"うでどけい":["腕時計"],"ようつう":["腰痛"],"はらわた":["腸"],"はらがたつ":["腹が立つ"],"はらごしらえ":["腹ごしらえ"],"はらのうち":["腹の中"],"はらのなか":["腹の中"],"はらいっぱい":["腹一杯"],"はらいた":["腹痛"],"ふくつう":["腹痛"],"はらすじ":["腹筋"],"ふくきん":["腹筋"],"ふっきん":["腹筋"],"ひざ":["膝"],"ふくらむ":["膨らむ"],"ふくらんだ":["膨らんだ"],"ふくらまない":["膨らまない"],"ふくらみ":["膨らみ"],"ふくらんで":["膨らんで"],"ふくらまれる":["膨らまれる"],"ぼうだい":["膨大"],"おくびょう":["臆病"],"りんじょうかん":["臨場感"],"りんしょう":["臨床"],"りんじ":["臨時"],"りんかい":["臨海"],"みずから":["自ら"],"じしゅ":["自主"],"じしゅてき":["自主的"],"じた":["自他"],"じでん":["自伝"],"じさく":["自作"],"じぶん":["自分"],"じぶんでも":["自分でも"],"じぶんなり":["自分なり"],"じぶんのために":["自分のために"],"じぶんのちから":["自分の力"],"じぶんかって":["自分勝手"],"じぶんがって":["自分勝手"],"じぶんじしん":["自分自身"],"じまえ":["自前"],"じりき":["自力"],"じどうてき":["自動的"],"じどうはんばいき":["自動販売機"],"じどうしゃ":["自動車"],"じどうしゃほけん":["自動車保険"],"じどうしゃどう":["自動車道"],"じもん":["自問"],"じえいぎょう":["自営業"],"じざい":["自在"],"じたく":["自宅"],"じかせい":["自家製"],"じこちゅうしん":["自己中心"],"じこしゅちょう":["自己主張"],"じこけいはつ":["自己啓発"],"じこけんお":["自己嫌悪"],"じこまん":["自己満"],"じこまんぞく":["自己満足"],"じこしょうかい":["自己紹介"],"じりつ":["自立","自律"],"じあい":["自愛"],"じまん":["自慢"],"じが":["自画","自我"],"じさつ":["自殺"],"じみん":["自民"],"じみんとう":["自民党"],"じちかい":["自治会"],"じちたい":["自治体"],"じめつ":["自滅"],"じすい":["自炊"],"しぜん":["自然"],"しぜんに":["自然に"],"しぜんたい":["自然体"],"しぜんかんきょう":["自然環境"],"しぜんかい":["自然界"],"しぜんかがく":["自然科学"],"じばく":["自爆"],"じせい":["自生"],"じゆう":["自由"],"じゆうに":["自由に"],"じゆうしゅぎ":["自由主義"],"じゆうじん":["自由人"],"じゆうけんきゅう":["自由研究"],"じがじさん":["自画自賛"],"じしゃ":["自社"],"じしゅく":["自粛"],"じきゅうじそく":["自給自足"],"じぎゃく":["自虐"],"じえいたい":["自衛隊"],"じかく":["自覚"],"じふ":["自負"],"じはんき":["自販機"],"じてんしゃ":["自転車"],"じでんしゃ":["自転車"],"じへいしょう":["自閉症"],"くさい":["臭い"],"くさかった":["臭かった"],"くさくない":["臭くない"],"くさくて":["臭くて"],"いたって":["至って","至って"],"いたる":["至る"],"いたった":["至った"],"いたらない":["至らない"],"いたり":["至り"],"いたれる":["至れる"],"いたられる":["至られる"],"しごく":["至極"],"ちめいてき":["致命的"],"きょうみ":["興味"],"きょうみない":["興味ない"],"きょうみなかった":["興味なかった"],"きょうみなくない":["興味なくない"],"きょうみなくて":["興味なくて"],"きょうみしんしん":["興味津々"],"きょうみぶかい":["興味深い"],"きょうみぶかかった":["興味深かった"],"きょうみぶかくない":["興味深くない"],"きょうみぶかくて":["興味深くて"],"こうふん":["興奮"],"ほそう":["舗装"],"まう":["舞う"],"まわない":["舞わない"],"まえる":["舞える"],"ぶたい":["舞台","部隊"],"ぶたいうら":["舞台裏"],"まいこ":["舞妓"],"ぶよう":["舞踊"],"ふね":["船","舟"],"こうくう":["航空"],"こうくうがいしゃ":["航空会社"],"こうくうけん":["航空券"],"こうくうき":["航空機"],"はんにゃ":["般若"],"せんきょう":["船橋"],"ふなばし":["船橋"],"せんぱく":["船舶"],"せんちょう":["船長"],"かんちょう":["館長","艦長"],"かんたい":["艦隊"],"よいおとしを":["良いお年を"],"よいてんき":["良い天気"],"よかったら":["良かったら"],"よくなる":["良くなる"],"よくもわるくも":["良くも悪くも"],"よければ":["良ければ"],"よさ":["良さ"],"よさそう":["良さそう"],"りょうひん":["良品"],"りょうこう":["良好"],"りょうしんてき":["良心的"],"りょうしき":["良識"],"りょうしつ":["良質"],"いろ":["色"],"いろいろ":["色々"],"いろいろあって":["色々あって"],"いろっぽい":["色っぽい"],"いろっぽかった":["色っぽかった"],"いろっぽくない":["色っぽくない"],"いろっぽくて":["色っぽくて"],"いろとりどり":["色とりどり"],"いろんな":["色んな"],"いろあい":["色合い"],"しきさい":["色彩"],"いろけ":["色気"],"いろがみ":["色紙"],"しきし":["色紙"],"いろちがい":["色違い"],"いろあざやか":["色鮮やか"],"つや":["艶","通夜"],"いも":["芋"],"しばい":["芝居"],"しばふ":["芝生"],"はなばな":["花々"],"はなびら":["花びら"],"はなだより":["花便り"],"はなさく":["花咲く"],"はなさいた":["花咲いた"],"はなさかない":["花咲かない"],"はなさき":["花咲き"],"はなさいて":["花咲いて"],"はなさける":["花咲ける"],"はなさかれる":["花咲かれる"],"かえん":["花園"],"はなぞの":["花園"],"かだん":["花壇"],"はなよめ":["花嫁"],"はなや":["花屋"],"はなたば":["花束"],"かへい":["花柄"],"はながら":["花柄"],"はなび":["花火"],"はなびたいかい":["花火大会"],"かびん":["花瓶"],"はながめ":["花瓶"],"はなばたけ":["花畑"],"はなざかり":["花盛り"],"かふん":["花粉"],"かふんしょう":["花粉症"],"はなみ":["花見"],"はなことば":["花言葉"],"はなみち":["花道"],"かちょう":["課長","花鳥"],"かちょうふうげつ":["花鳥風月"],"げいにん":["芸人"],"げいのう":["芸能"],"げいのうじん":["芸能人"],"げいのうかい":["芸能界"],"げいじゅつ":["芸術"],"げいじゅつか":["芸術家"],"げいじゅつてき":["芸術的"],"こけ":["苔","鱗"],"みゃお":["苗"],"みょうじ":["苗字"],"わか":["若"],"わかかった":["若かった"],"わかくない":["若くない"],"わかくて":["若くて"],"わかき":["若き"],"わかさ":["若さ"],"じゃっかん":["若干"],"じゃくねん":["若年"],"わかて":["若手"],"わかまつ":["若松"],"わかもの":["若者"],"わかば":["若葉"],"にがい":["苦い"],"にがかった":["苦かった"],"にがくない":["苦くない"],"にがくて":["苦くて"],"くるしい":["苦しい"],"くるしかった":["苦しかった"],"くるしくない":["苦しくない"],"くるしくて":["苦しくて"],"くるしみ":["苦しみ","苦しみ"],"くるしむ":["苦しむ"],"くるしんだ":["苦しんだ"],"くるしまない":["苦しまない"],"くるしんで":["苦しんで"],"くるしまれる":["苦しまれる"],"くろう":["苦労"],"にがみ":["苦味"],"くのう":["苦悩"],"くじょう":["苦情"],"くせん":["苦戦"],"にがて":["苦手"],"くつう":["苦痛"],"くしょう":["苦笑"],"にがわらい":["苦笑い"],"くげん":["苦言"],"くとう":["苦闘"],"くなん":["苦難"],"えいかいわ":["英会話"],"えいわ":["英和"],"えいこく":["英国"],"えいすう":["英数"],"えいぶん":["英文"],"えいめい":["英明"],"えいけん":["英検"],"えいご":["英語"],"えいごばん":["英語版"],"えいゆう":["英雄"],"なす":["茄子"],"なすび":["茄子"],"くき":["茎"],"あかね":["茜"],"いばらきけん":["茨城県"],"ちゃ":["茶"],"ちゃちゃ":["茶々"],"ちゃのま":["茶の間"],"ちゃかい":["茶会"],"ちゃや":["茶屋"],"さぼう":["茶房"],"ちゃづけ":["茶漬け"],"ちゃめ":["茶目"],"ちゃわん":["茶碗"],"ちゃいろ":["茶色"],"ちゃいろい":["茶色い"],"ちゃいろかった":["茶色かった"],"ちゃいろくない":["茶色くない"],"ちゃいろくて":["茶色くて"],"ちゃどう":["茶道"],"さはんじ":["茶飯事"],"くさ":["草"],"くさはら":["草原"],"そうげん":["草原"],"くさとり":["草取り"],"くさき":["草木"],"そうもく":["草木"],"くさばな":["草花"],"くさやきゅう":["草野球"],"あらかった":["荒かった"],"あらくない":["荒くない"],"あらくて":["荒くて"],"あらき":["荒木"],"あらの":["荒野"],"あれの":["荒野"],"こうや":["荒野"],"にもつ":["荷物"],"にづくり":["荷造り"],"ばくだい":["莫大"],"かしぱん":["菓子パン"],"かしや":["菓子屋"],"あやめ":["菖蒲"],"なのはな":["菜の花"],"さいえん":["菜園"],"ぼさつ":["菩薩"],"はなやか":["華やか"],"ふぁーりゅう":["華流"],"はぎ":["萩"],"はぎはら":["萩原"],"はぎわら":["萩原"],"おち":["落ち","落ち","落"],"おちる":["落ちる"],"おちた":["落ちた"],"おちない":["落ちない"],"おちて":["落ちて"],"おちれる":["落ちれる"],"おちられる":["落ちられる"],"おちついた":["落ち着いた","落ち着いた"],"おちつき":["落ち着き","落ち着き"],"おちつく":["落ち着く"],"おちつかない":["落ち着かない"],"おちついて":["落ち着いて"],"おちつける":["落ち着ける"],"おちつかれる":["落ち着かれる"],"おちば":["落ち葉"],"おちこみ":["落ち込み","落ち込み"],"おちこむ":["落ち込む"],"おちこんだ":["落ち込んだ"],"おちこまない":["落ち込まない"],"おちこんで":["落ち込んで"],"おちこまれる":["落ち込まれる"],"おとしあな":["落とし穴"],"おとす":["落とす"],"おとした":["落とした"],"おとさない":["落とさない"],"おとし":["落とし"],"おとして":["落として"],"おとせる":["落とせる"],"おとされる":["落とされる"],"らっか":["落下"],"らくがき":["落書き"],"らくさつ":["落札"],"らくたん":["落胆"],"らくご":["落語"],"らくせん":["落選"],"らくらい":["落雷"],"はっぱ":["葉っぱ"],"はがき":["葉書"],"はづき":["葉月"],"ちょ":["著"],"いちじるしく":["著しく"],"ちょさく":["著作"],"ちょさくけん":["著作権"],"ちょめい":["著名"],"ちょしょ":["著書"],"ちょしゃ":["著者"],"くず":["葛"],"かっとう":["葛藤"],"ぶどう":["葡萄"],"そうぎ":["葬儀"],"そうしき":["葬式"],"あおい":["青い","葵","蒼い"],"むしあつい":["蒸し暑い"],"むしあつかった":["蒸し暑かった"],"むしあつくない":["蒸し暑くない"],"むしあつくて":["蒸し暑くて"],"ちくせき":["蓄積"],"はす":["蓮"],"はちす":["蓮"],"そばむぎ":["蕎麦"],"そまむぎ":["蕎麦"],"そばや":["蕎麦屋"],"つぼみ":["蕾"],"うす":["薄"],"すすき":["薄"],"うすい":["薄い"],"うすかった":["薄かった"],"うすくない":["薄くない"],"うすくて":["薄くて"],"うすぎり":["薄切り"],"うすあじ":["薄味"],"はくみ":["薄味"],"うすぐらい":["薄暗い"],"うすぐらかった":["薄暗かった"],"うすぐらくない":["薄暗くない"],"うすぐらくて":["薄暗くて"],"しょうび":["薔薇"],"そうび":["薔薇","装備"],"たきぎ":["薪"],"かおり":["香り","香","薫","香り"],"くすり":["薬"],"やくざいし":["薬剤師"],"やくみ":["薬味"],"やくひん":["薬品"],"やくがい":["薬害"],"やっきょく":["薬局"],"くすりし":["薬師"],"やくし":["薬師"],"やくぶつ":["薬物"],"とうほん":["藤本"],"やぶ":["藪"],"よみがえる":["蘇る"],"よみがえった":["蘇った"],"よみがえらない":["蘇らない"],"よみがえり":["蘇り"],"よみがえって":["蘇って"],"よみがえれる":["蘇れる"],"よみがえられる":["蘇られる"],"ぎゃくたい":["虐待"],"ぎゃくさつ":["虐殺"],"きょこう":["虚構"],"とりこ":["虜"],"むしば":["虫歯"],"にじいろ":["虹色"],"くちなわ":["蛇"],"へび":["蛇"],"へみ":["蛇"],"けいこうとう":["蛍光灯"],"かいる":["蛙"],"かわず":["蛙"],"はちみつ":["蜂蜜"],"くも":["雲","蜘蛛"],"ちょうちょ":["蝶々"],"ちょうちょう":["蝶々"],"ゆうごう":["融合"],"かに":["蟹"],"かにこうせん":["蟹工船"],"けつあつ":["血圧"],"けつえき":["血液"],"けつえきがた":["血液型"],"けつえきけんさ":["血液検査"],"けっとう":["血統","血糖"],"しゅうぎいん":["衆議院"],"しゅうぎいんぎいん":["衆議院議員"],"しゅういん":["衆院"],"おこない":["行い","行い","行ない"],"おこなう":["行う","行なう"],"おこなった":["行った","行なった"],"おこなわない":["行わない","行なわない"],"おこなって":["行って","行なって"],"おこなえる":["行える","行なえる"],"おこなわれる":["行われる","行われる","行なわれる"],"ゆき":["行き","雪","行き","逝き"],"いきたくない":["行きたくない"],"いきたくなかった":["行きたくなかった"],"いきたくなくない":["行きたくなくない"],"いきたくなくて":["行きたくなくて"],"いきつけ":["行きつけ"],"ゆきつけ":["行きつけ"],"いきさき":["行き先"],"ゆきさき":["行き先"],"いきき":["行き来"],"ゆきき":["行き来"],"いきつく":["行き着く"],"いきついた":["行き着いた"],"いきつかない":["行き着かない"],"いきつき":["行き着き"],"いきついて":["行き着いて"],"いきつける":["行き着ける"],"いきつかれる":["行き着かれる"],"ゆきつく":["行き着く"],"ゆきついた":["行き着いた"],"ゆきつかない":["行き着かない"],"ゆきつき":["行き着き"],"ゆきついて":["行き着いて"],"ゆきつける":["行き着ける"],"ゆきつかれる":["行き着かれる"],"ゆく":["行く","逝く"],"ゆかない":["行かない","逝かない"],"ゆける":["行ける","逝ける"],"ゆかれる":["行かれる","逝かれる"],"ゆくすえ":["行く末"],"いけない":["行けない","行けない"],"いけません":["行けません"],"いけた":["行けた"],"いけて":["行けて"],"いけれる":["行けれる"],"いけられる":["行けられる"],"いったりきたり":["行ったり来たり"],"いってきます":["行ってきます","行って来ます"],"いってくる":["行ってくる"],"いってくた":["行ってくた"],"いってこない":["行ってくない"],"いってき":["行ってき"],"いってきて":["行ってくて"],"いってこれる":["行ってくれる"],"いってこられる":["行ってくられる"],"おこなわれた":["行われた"],"おこなわれない":["行われない"],"おこなわれ":["行われ"],"おこなわれて":["行われて"],"おこなわれれる":["行われれる"],"おこなわれられる":["行われられる"],"ぎょうじ":["行事"],"ぎょうぎ":["行儀"],"ぎょうれつ":["行列"],"こうどう":["行動"],"ぎょうせい":["行政"],"ぎょうせいしょし":["行政書士"],"ゆくえ":["行方"],"ゆくえふめい":["行方不明"],"こうらく":["行楽"],"ぎょうじゃ":["行者"],"じゅつ":["術"],"すべ":["術"],"じゅつご":["術後"],"じゅつぜん":["術後"],"まちじゅう":["街中"],"まちかど":["街角"],"がいろじゅ":["街路樹"],"かいどう":["街道"],"がいとう":["該当","街頭"],"えいせい":["衛星","衛生"],"しょうどう":["衝動"],"しょうどうがい":["衝動買い"],"しょうげき":["衝撃"],"しょうとつ":["衝突"],"きぬ":["衣"],"ころも":["衣"],"ころもがえ":["衣替え"],"いしょう":["衣装"],"いるい":["衣類"],"おもて":["表","面"],"あらわす":["表す"],"あらわした":["表した"],"あらわさない":["表さない"],"あらわし":["表し"],"あらわして":["表して"],"あらわせる":["表せる"],"あらわされる":["表される"],"ひょうす":["表す"],"ひょうした":["表した"],"ひょうさない":["表さない"],"ひょうして":["表して"],"ひょうせる":["表せる"],"ひょうされる":["表される"],"ひょうしょうしき":["表彰式"],"ひょうじょう":["表情"],"ひょうめい":["表明"],"ひょうさつ":["表札"],"ひょうげん":["表現"],"ひょうげんりょく":["表現力"],"ひょうじ":["表示"],"ひょうき":["表記"],"ひょうめん":["表面"],"ひょうだい":["表題"],"おとろえ":["衰え"],"すいたい":["衰退"],"ふくろ":["袋"],"そで":["袖"],"ひしゃたい":["被写体"],"ひこく":["被告"],"ひがい":["被害"],"ひがいしゃ":["被害者"],"ひさい":["被災"],"ひさいしゃ":["被災者"],"ひばく":["被爆"],"さいばん":["裁判"],"さいばんいん":["裁判員"],"さいばんいんせいど":["裁判員制度"],"さいばんかん":["裁判官"],"さいばんしょ":["裁判所"],"さいほう":["裁縫"],"よそおい":["装い"],"そうちゃく":["装着"],"そうち":["装置"],"そうしょく":["装飾"],"うらがわ":["裏側"],"うらぎり":["裏切り"],"うらにわ":["裏庭"],"うらわざ":["裏技"],"うらかた":["裏方"],"うらはら":["裏腹"],"うらばなし":["裏話"],"りめん":["裏面"],"ほしゅう":["補修"],"ほじゅう":["補充"],"ほじょ":["補助"],"ほじょきん":["補助金"],"ほきょう":["補強"],"ほせい":["補正"],"ほきゅう":["補給"],"ほそく":["補足"],"はだか":["裸"],"はだし":["裸足"],"せいさくしょ":["製作所"],"せいさくじょ":["製作所"],"せいさくしゃ":["製作者"],"せいひん":["製品"],"せいほん":["製本"],"せいぞう":["製造"],"せいぞうぎょう":["製造業"],"せいぞうはんばい":["製造販売"],"せいめん":["製麺"],"すそ":["裾"],"すそわけ":["裾分け"],"ふくごう":["複合"],"ふくすう":["複数"],"ふくせい":["複製"],"ふくざつ":["複雑"],"ほうび":["褒美"],"えり":["襟","領"],"おそう":["襲う"],"おそった":["襲った"],"おそわない":["襲わない"],"おそい":["遅い","襲い","鈍い"],"おそって":["襲って"],"おそえる":["襲える"],"おそわれる":["襲われる"],"しゅうげき":["襲撃"],"しゅうらい":["襲来"],"にし":["西"],"にしがわ":["西側"],"にしぐち":["西口"],"にしにっぽん":["西日本"],"にしにほん":["西日本"],"せいぶ":["西部"],"かなめ":["要"],"ようする":["要する"],"ようするに":["要するに"],"ようは":["要は"],"ようけん":["要件"],"よういん":["要因"],"ようぼう":["要望"],"ようきゅう":["要求"],"ようちゅうい":["要注意"],"ようやく":["要約"],"ようそ":["要素"],"みえ":["見え","見え"],"まみえる":["見える"],"まみえた":["見えた"],"まみえない":["見えない"],"まみえて":["見えて"],"まみえれる":["見えれる"],"まみえられる":["見えられる"],"みえる":["見える"],"みえた":["見えた"],"みえない":["見えない"],"みえて":["見えて"],"みえれる":["見えれる"],"みえられる":["見えられる"],"みえがくれ":["見え隠れ"],"みかけ":["見かけ","見かけ"],"みかける":["見かける"],"みかけた":["見かけた"],"みかけない":["見かけない"],"みかけて":["見かけて"],"みかけれる":["見かけれる"],"みかけられる":["見かけられる"],"みせる":["見せる"],"みせた":["見せた"],"みせない":["見せない"],"みせて":["見せて"],"みせれる":["見せれる"],"みせられる":["見せられる"],"みせば":["見せ場"],"みたところ":["見たところ"],"みため":["見た目"],"みつかる":["見つかる"],"みつかった":["見つかった"],"みつからない":["見つからない"],"みつかり":["見つかり"],"みつかって":["見つかって"],"みつかれる":["見つかれる"],"みつかられる":["見つかられる"],"みつける":["見つける"],"みつけた":["見つけた"],"みつけない":["見つけない"],"みつけ":["見つけ"],"みつけて":["見つけて"],"みつけれる":["見つけれる"],"みつけられる":["見つけられる"],"みつめる":["見つめる"],"みつめた":["見つめた"],"みつめない":["見つめない"],"みつめ":["見つめ"],"みつめて":["見つめて"],"みつめれる":["見つめれる"],"みつめられる":["見つめられる"],"みてくれ":["見てくれ"],"みどころ":["見所","見どころ"],"みにいく":["見に行く"],"みにいった":["見に行った"],"みにいかない":["見に行かない"],"みにいき":["見に行き"],"みにいって":["見に行って"],"みにいける":["見に行ける"],"みにいかれる":["見に行かれる"],"みるめ":["見る目"],"みれた":["見れた"],"みれない":["見れない"],"みれ":["見れ"],"みれて":["見れて"],"みれれる":["見れれる"],"みれられる":["見れられる"],"みあげる":["見上げる"],"みあげた":["見上げた"],"みあげない":["見上げない"],"みあげ":["見上げ"],"みあげて":["見上げて"],"みあげれる":["見上げれる"],"みあげられる":["見上げられる"],"みおろす":["見下ろす"],"みおろした":["見下ろした"],"みおろさない":["見下ろさない"],"みおろし":["見下ろし"],"みおろして":["見下ろして"],"みおろせる":["見下ろせる"],"みおろされる":["見下ろされる"],"みごと":["見事"],"みだし":["見出し"],"みわけ":["見分け"],"みきり":["見切り"],"みあい":["見合い"],"けんがく":["見学"],"みまもる":["見守る"],"みまもった":["見守った"],"みまもらない":["見守らない"],"みまもり":["見守り"],"みまもって":["見守って"],"みまもれる":["見守れる"],"みまもられる":["見守られる"],"みあたらない":["見当たらない"],"みあたらなかった":["見当たらなかった"],"みあたらなくない":["見当たらなくない"],"みあたらなくて":["見当たらなくて"],"みごたえ":["見応え"],"みほん":["見本"],"みほんいち":["見本市"],"みばえ":["見栄え"],"みわたす":["見渡す"],"みわたした":["見渡した"],"みわたさない":["見渡さない"],"みわたし":["見渡し"],"みわたして":["見渡して"],"みわたせる":["見渡せる"],"みわたされる":["見渡される"],"けんぶつ":["見物"],"みなおし":["見直し","見直し"],"みなおす":["見直す"],"みなおした":["見直した"],"みなおさない":["見直さない"],"みなおして":["見直して"],"みなおせる":["見直せる"],"みなおされる":["見直される"],"みしらぬ":["見知らぬ"],"みしり":["見知り"],"みつもり":["見積もり"],"みならい":["見習い"],"けんぶん":["見聞"],"けんもん":["見聞"],"みきき":["見聞き"],"みまい":["見舞い"],"みおぼえ":["見覚え"],"けんかい":["見解"],"みこみ":["見込み"],"みおくり":["見送り","見送り"],"みおくる":["見送る"],"みおくった":["見送った"],"みおくらない":["見送らない"],"みおくって":["見送って"],"みおくれる":["見送れる"],"みおくられる":["見送られる"],"みのがし":["見逃し","見逃し"],"みのがす":["見逃す"],"みのがした":["見逃した"],"みのがさない":["見逃さない"],"みのがして":["見逃して"],"みのがせる":["見逃せる"],"みのがされる":["見逃される"],"みとおし":["見通し"],"みごろ":["見頃"],"きそく":["規則"],"きてい":["規定"],"きぼ":["規模"],"きやく":["規約"],"しりょく":["視力"],"しさつ":["視察"],"しちょうりつ":["視聴率"],"しちょうしゃ":["視聴者"],"しや":["視野"],"のぞき":["除き","覗き","覗き"],"のぞく":["除く","覗く"],"のぞいた":["除いた","覗いた"],"のぞかない":["除かない","覗かない"],"のぞいて":["除いて","除いて","覗いて"],"のぞける":["除ける","覗ける"],"のぞかれる":["除かれる","覗かれる"],"おぼえ":["覚え","覚え"],"おぼえる":["覚える"],"おぼえた":["覚えた"],"おぼえない":["覚えない"],"おぼえて":["覚えて"],"おぼえれる":["覚えれる"],"おぼえられる":["覚えられる"],"おぼえがき":["覚書","覚え書き"],"さめる":["覚める"],"さめた":["覚めた"],"さめない":["覚めない"],"さめ":["覚め"],"さめて":["覚めて"],"さめれる":["覚めれる"],"さめられる":["覚められる"],"かくご":["覚悟"],"かくせい":["覚醒"],"したしい":["親しい"],"したしかった":["親しかった"],"したしくない":["親しくない"],"したしくて":["親しくて"],"ちかしい":["親しい"],"ちかしかった":["親しかった"],"ちかしくない":["親しくない"],"ちかしくて":["親しくて"],"したしく":["親しく"],"したしみ":["親しみ"],"おやばか":["親ばか"],"おやぶん":["親分"],"しんゆう":["親友"],"しんぜん":["親善"],"おやこ":["親子"],"おやこうこう":["親孝行"],"おやご":["親御"],"しんせき":["親戚"],"おやゆび":["親指"],"おやかた":["親方"],"しんぞく":["親族"],"おやじ":["親父","親爺"],"しんぼく":["親睦"],"しんきんかん":["親近感"],"かんこうち":["観光地"],"かんこうきゃく":["観光客"],"かんきゃく":["観客"],"かんさつ":["観察"],"かんさつにっき":["観察日記"],"かんねん":["観念"],"かんせんき":["観戦記"],"かんそく":["観測"],"かんようしょくぶつ":["観葉植物"],"かんらん":["観覧"],"かんらんしゃ":["観覧車"],"かんのん":["観音"],"かど":["角","門","過度"],"つの":["角"],"かくど":["角度"],"かくに":["角煮"],"ほどく":["解く"],"ほどいた":["解いた"],"ほどかない":["解かない"],"ほどき":["解き"],"ほどいて":["解いて"],"ほどける":["解ける"],"ほどかれる":["解かれる"],"かいたい":["解体"],"かいぼう":["解剖"],"かいさん":["解散"],"かいけつ":["解決"],"かいけつさく":["解決策"],"かいきん":["解禁"],"かいやく":["解約"],"かいせつ":["解説","開設"],"かいどく":["買い得","解読"],"かいしゃく":["解釈"],"さわる":["触る"],"さわった":["触った"],"さわらない":["触らない"],"さわり":["触り"],"さわって":["触って"],"さわれる":["触れる"],"さわられる":["触られる"],"ふれ":["触れ","触れ"],"ふれた":["触れた"],"ふれない":["触れない"],"ふれて":["触れて"],"ふれれる":["触れれる"],"ふれられる":["触れられる"],"しょくはつ":["触発"],"いいたいほうだい":["言いたい放題"],"いいながら":["言いながら"],"いいよう":["言いよう"],"いいだす":["言い出す"],"いいだした":["言い出した"],"いいださない":["言い出さない"],"いいだし":["言い出し"],"いいだして":["言い出して"],"いいだせる":["言い出せる"],"いいだされる":["言い出される"],"いいぶん":["言い分"],"いいまわし":["言い回し"],"いいかた":["言い方"],"いいわけ":["言い訳"],"いうとおり":["言うとおり"],"いうところ":["言うところ"],"いうまでもない":["言うまでもない"],"ゆうまでもない":["言うまでもない"],"いうまでもなく":["言うまでもなく"],"ゆうまでもなく":["言うまでもなく"],"いうこと":["言う事"],"ことのは":["言の葉"],"いわずとしれた":["言わずと知れた"],"いわんばかり":["言わんばかり"],"げんどう":["言動"],"げんきゅう":["言及"],"けとば":["言葉"],"ことば":["言葉","詞"],"げんご":["言語"],"ごんご":["言語"],"げんろん":["言論"],"ことだま":["言霊"],"ていせい":["訂正"],"けいそく":["計測"],"けいかく":["計画"],"けいかくてき":["計画的"],"けいさん":["計算"],"とうろん":["討論"],"くんれん":["訓練"],"きした":["記した"],"きさない":["記さない"],"きして":["記して"],"きせる":["記せる"],"きされる":["記される"],"しるす":["記す"],"しるした":["記した"],"しるさない":["記さない"],"しるして":["記して"],"しるせる":["記せる"],"しるされる":["記される"],"きにゅう":["記入"],"きごう":["記号"],"きねんしゃしん":["記念写真"],"きねんひん":["記念品"],"きねんび":["記念日"],"きねんかん":["記念館"],"きおく":["記憶"],"きおくりょく":["記憶力"],"きしゃかいけん":["記者会見"],"きさい":["記載"],"きじゅつ":["記述"],"きろく":["記録"],"きろくてき":["記録的"],"おとずれ":["訪れ","訪れ"],"おとずれる":["訪れる"],"おとずれた":["訪れた"],"おとずれない":["訪れない"],"おとずれて":["訪れて"],"おとずれれる":["訪れれる"],"おとずれられる":["訪れられる"],"ほうもん":["訪問"],"ほうもんしゃ":["訪問者"],"せつび":["設備"],"せってい":["設定"],"せつりつ":["設立"],"せっち":["設置"],"せっけい":["設計"],"ばかし":["許し"],"ばっかし":["許し"],"ゆるし":["許し","許し"],"ゆるす":["許す"],"ゆるした":["許した"],"ゆるさない":["許さない"],"ゆるして":["許して"],"ゆるせる":["許せる"],"ゆるされる":["許される"],"きょか":["許可"],"きょよう":["許容"],"わけじゃない":["訳じゃない"],"わけではない":["訳ではない"],"うったえ":["訴え","訴え"],"うったえる":["訴える"],"うったえた":["訴えた"],"うったえない":["訴えない"],"うったえて":["訴えて"],"うったえれる":["訴えれる"],"うったえられる":["訴えられる"],"そしょう":["訴訟"],"しんさつ":["診察"],"しんだん":["診断"],"しんりょう":["診療"],"しんりょうしょ":["診療所"],"しんりょうじょ":["診療所"],"しょうけん":["証券"],"しょうけんがいしゃ":["証券会社"],"しょうこ":["証拠"],"しょうこきん":["証拠金"],"しょうめいしょ":["証明書"],"しょうげん":["証言"],"さぎ":["詐欺"],"さぎし":["詐欺師"],"ひょうか":["評価"],"ひょうばん":["評判"],"ひょうろん":["評論"],"ひょうろんか":["評論家"],"ためす":["試す"],"ためした":["試した"],"ためさない":["試さない"],"ためして":["試して"],"ためせる":["試せる"],"ためされる":["試される"],"こころみ":["試み","試み"],"こころみる":["試みる"],"こころみた":["試みた"],"こころみない":["試みない"],"こころみて":["試みて"],"こころみれる":["試みれる"],"こころみられる":["試みられる"],"しあい":["試合"],"しあいしゅうりょう":["試合終了"],"しちゃく":["試着"],"しれん":["試練"],"しこうさくご":["試行錯誤"],"ししょく":["試食"],"しいん":["試飲"],"しじん":["詩人"],"わび":["詫び"],"づめ":["詰め"],"つめあわせ":["詰め合わせ"],"はなし":["話","話し","話し"],"はなしかける":["話しかける"],"はなしかけた":["話しかけた"],"はなしかけない":["話しかけない"],"はなしかけ":["話しかけ"],"はなしかけて":["話しかけて"],"はなしかけれる":["話しかけれる"],"はなしかけられる":["話しかけられる"],"はなしあい":["話し合い"],"はなしかた":["話し方"],"はなす":["話す"],"はなした":["話した"],"はなさない":["話さない"],"はなして":["話して"],"はなせる":["話せる","話せる"],"はなされる":["話される"],"はなせた":["話せた"],"はなせない":["話せない"],"はなせ":["話せ"],"はなせて":["話せて"],"はなせれる":["話せれる"],"はなせられる":["話せられる"],"はなしをする":["話をする"],"わだい":["話題"],"くわしい":["詳しい"],"くわしかった":["詳しかった"],"くわしくない":["詳しくない"],"くわしくて":["詳しくて"],"くわしく":["詳しく"],"しょうさい":["詳細"],"ほこる":["誇る"],"ほこった":["誇った"],"ほこらない":["誇らない"],"ほこって":["誇って"],"ほこれる":["誇れる"],"ほこられる":["誇られる"],"みとめ":["認め","認め"],"したためる":["認める"],"したためた":["認めた"],"したためない":["認めない"],"したため":["認め"],"したためて":["認めて"],"したためれる":["認めれる"],"したためられる":["認められる"],"みとめる":["認める"],"みとめた":["認めた"],"みとめない":["認めない"],"みとめて":["認めて"],"みとめれる":["認めれる"],"みとめられる":["認められる"],"にんか":["認可"],"にんち":["認知"],"にんちしょう":["認知症"],"にんしょう":["認証"],"にんしき":["認識"],"ちかい":["近い","誓い"],"たんじょう":["誕生"],"たんじょうかい":["誕生会"],"たんじょうび":["誕生日"],"たんじょうびおめでとうございます":["誕生日おめでとうございます"],"いざない":["誘い","誘い"],"さそい":["誘い","誘い"],"いざなう":["誘う"],"いざなった":["誘った"],"いざなわない":["誘わない"],"いざなって":["誘って"],"いざなえる":["誘える"],"いざなわれる":["誘われる"],"さそう":["誘う"],"さそった":["誘った"],"さそわない":["誘わない"],"さそって":["誘って"],"さそえる":["誘える"],"さそわれる":["誘われる"],"ゆうどう":["誘導"],"ゆうわく":["誘惑"],"ゆうかい":["誘拐"],"かたり":["語り","語","語り"],"かたりくち":["語り口"],"かたる":["語る"],"かたった":["語った"],"かたらない":["語らない"],"かたって":["語って"],"かたられる":["語られる"],"ごがく":["語学"],"ごげん":["語源"],"ごろく":["語録"],"せいじつ":["誠実"],"せいい":["誠意"],"あやまって":["誤って","謝って"],"あやまり":["誤り","謝り"],"ごじ":["誤字"],"ごさん":["誤算"],"ごかい":["誤解"],"せっとく":["説得"],"せっとくりょく":["説得力"],"せつめい":["説明"],"せつめいしょ":["説明書"],"よみ":["読み","読み"],"よみやすい":["読みやすい"],"よみやすかった":["読みやすかった"],"よみやすくない":["読みやすくない"],"よみやすくて":["読みやすくて"],"よみごたえ":["読み応え"],"よみかた":["読み方"],"よみもの":["読み物"],"よみとく":["読み解く"],"よみといた":["読み解いた"],"よみとかない":["読み解かない"],"よみとき":["読み解き"],"よみといて":["読み解いて"],"よみとける":["読み解ける"],"よみとかれる":["読み解かれる"],"よむ":["読む"],"よまない":["読まない"],"よまれる":["読まれる"],"どくりょう":["読了"],"よみうり":["読売"],"とくしょ":["読書"],"どくしょ":["読書"],"とくほん":["読本"],"どくほん":["読本"],"どくは":["読破"],"どくしゃ":["読者"],"だれ":["誰"],"だれか":["誰か"],"だれしも":["誰しも"],"だれだって":["誰だって"],"だれでも":["誰でも"],"だれにでも":["誰にでも"],"だれにも":["誰にも"],"だれも":["誰も"],"かだい":["課題"],"ひぼう":["誹謗"],"ひぼうちゅうしょう":["誹謗中傷"],"しらべ":["調べ","調べ"],"しらべる":["調べる"],"しらべた":["調べた"],"しらべない":["調べない"],"しらべて":["調べて"],"しらべれる":["調べれる"],"しらべられる":["調べられる"],"ちょうみりょう":["調味料"],"ちょうわ":["調和"],"ちょうし":["調子","銚子"],"ちょうきょう":["調教"],"ちょうせい":["調整"],"ちょうさ":["調査"],"ちょうさけっか":["調査結果"],"ちょうり":["調理"],"ちょうせつ":["調節"],"ちょうたつ":["調達"],"だんごう":["談合"],"だんぎ":["談義"],"だんわ":["談話"],"だんわしつ":["談話室"],"せいきゅう":["請求"],"ろん":["論"],"ろんそう":["論争"],"ろんぶん":["論文"],"ろんてん":["論点"],"ろんり":["論理"],"ろんりてき":["論理的"],"ろんしゃ":["論者"],"ろんぴょう":["論評"],"ろんぎ":["論議"],"あきらめ":["諦め","諦め"],"あきらめる":["諦める"],"あきらめた":["諦めた"],"あきらめない":["諦めない"],"あきらめて":["諦めて"],"あきらめれる":["諦めれる"],"あきらめられる":["諦められる"],"もろもろ":["諸々"],"しょくん":["諸君"],"しょこく":["諸国"],"しょとう":["諸島"],"しょぎょう":["諸行"],"しょぎょうむじょう":["諸行無常"],"なぞとき":["謎解き"],"けんきょ":["謙虚"],"こうしゅうかい":["講習会"],"あやまる":["謝る"],"あやまった":["謝った"],"あやまらない":["謝らない"],"あやまれる":["謝れる"],"あやまられる":["謝られる"],"しゃざい":["謝罪"],"きんがしんねん":["謹賀新年"],"けいび":["警備"],"けいびいん":["警備員"],"けいほう":["警報"],"けいさつ":["警察"],"けいさつかん":["警察官"],"けいさつしょ":["警察署"],"けいかい":["警戒","軽快"],"けいしちょう":["警視庁"],"ぎじろく":["議事録"],"ぎかい":["議会"],"ぎいん":["議員"],"ぎろん":["議論"],"ぎちょう":["議長"],"じょうと":["譲渡"],"ごけん":["護憲"],"たにがわ":["谷川"],"たにあい":["谷間"],"たにま":["谷間"],"まめちしき":["豆知識"],"とうふ":["豆腐"],"ゆたか":["豊か"],"ほうさく":["豊作"],"ぶた":["豚"],"とんにく":["豚肉"],"ぶたにく":["豚肉"],"とんこつ":["豚骨"],"しょうちょう":["象徴"],"えら":["豪"],"ごうかい":["豪快"],"ごうか":["豪華"],"ごうう":["豪雨"],"かいがら":["貝殻"],"まけ":["負け","負け"],"まけた":["負けた"],"まけない":["負けない"],"まけて":["負けて"],"まけれる":["負けれる"],"まけられる":["負けられる"],"まけいぬ":["負け犬"],"ふしょう":["負傷"],"ふたん":["負担"],"ざいむ":["財務"],"ざいむしょう":["財務省"],"ざいだん":["財団"],"ざいだんほうじん":["財団法人"],"さいふ":["財布"],"ざいせい":["財政"],"ざいげん":["財源"],"ざいさん":["財産"],"こうけん":["貢献"],"まずしい":["貧しい"],"まずしかった":["貧しかった"],"まずしくない":["貧しくない"],"まずしくて":["貧しくて"],"びんぼう":["貧乏"],"びんぼうにん":["貧乏人"],"ひんこん":["貧困"],"ひんけつ":["貧血"],"かもつ":["貨物"],"はんばい":["販売"],"はんばいかかく":["販売価格"],"はんばいてん":["販売店"],"はんばいき":["販売機"],"たんよく":["貪欲"],"とんよく":["貪欲"],"どんよく":["貪欲"],"つらぬく":["貫く"],"つらぬいた":["貫いた"],"つらぬかない":["貫かない"],"つらぬき":["貫き"],"つらぬいて":["貫いて"],"つらぬける":["貫ける"],"つらぬかれる":["貫かれる"],"かんろく":["貫禄"],"せきにん":["責任"],"せきにんかん":["責任感"],"せきにんしゃ":["責任者"],"ちょちく":["貯蓄"],"ちょきん":["貯金"],"もらう":["貰う"],"もらった":["貰った"],"もらわない":["貰わない"],"もらい":["貰い"],"もらって":["貰って"],"もらえる":["貰える"],"もらわれる":["貰われる"],"きじょ":["貴女"],"きほう":["貴方"],"かいあげ":["買い上げ"],"かいだし":["買い出し"],"かいかた":["買い替た","買い方"],"かいかえ":["買い替え"],"かいかない":["買い替ない"],"かいか":["開花","買い替"],"かいかて":["買い替て"],"かいかれる":["買い替れる"],"かいかられる":["買い替られる"],"かいもの":["買い物","買物"],"かわない":["買わない","飼わない"],"ばいしゅう":["買収"],"かいとり":["買取"],"かしだし":["貸し出し"],"ひよう":["費用"],"はりつけ":["貼り付け"],"ぼうえき":["貿易"],"ちんたい":["賃貸"],"ちんぎん":["賃金"],"しりょう":["資料"],"しりょうかん":["資料館"],"しほん":["資本"],"しほんしゅぎ":["資本主義"],"しげん":["資源"],"しさん":["資産"],"ししつ":["資質"],"しきん":["資金"],"にぎやか":["賑やか"],"にぎわい":["賑わい"],"さんぴ":["賛否"],"さんぴりょうろん":["賛否両論"],"しょうみ":["賞味"],"しょうみきげん":["賞味期限"],"しょうさん":["賞賛"],"しょうきん":["賞金"],"ばいしょう":["賠償"],"かしこ":["賢"],"かしこい":["賢い"],"かしこかった":["賢かった"],"かしこくない":["賢くない"],"かしこくて":["賢くて"],"けんじゃ":["賢者"],"しつもん":["質問"],"しつかん":["質感"],"しつぎ":["質疑"],"こうにゅう":["購入"],"こうどく":["購読"],"こうばい":["購買"],"ぜいたく":["贅沢"],"おくりもの":["贈り物"],"おくる":["送る","贈る"],"おくった":["送った","贈った"],"おくらない":["送らない","贈らない"],"おくり":["送り","送り","贈り"],"おくって":["送って","贈って"],"おくれる":["送れる","贈れる","遅れる"],"おくられる":["送られる","贈られる"],"ひいき":["贔屓"],"あかい":["赤い"],"あかかった":["赤かった"],"あかくない":["赤くない"],"あかくて":["赤くて"],"あかちゃん":["赤ちゃん"],"あかんぼう":["赤ん坊"],"あかれんが":["赤レンガ"],"あかわいん":["赤ワイン"],"せきがいせん":["赤外線"],"あかじ":["赤字"],"あかげ":["赤毛"],"あかいろ":["赤色"],"せきしょく":["赤色"],"せきらら":["赤裸々"],"はしって":["走って","走って"],"はしり":["走り","走り"],"はしりまわる":["走り回る"],"はしりまわった":["走り回った"],"はしりまわらない":["走り回らない"],"はしりまわり":["走り回り"],"はしりまわって":["走り回って"],"はしりまわれる":["走り回れる"],"はしりまわられる":["走り回られる"],"はしる":["走る"],"はしった":["走った"],"はしらない":["走らない"],"はしれる":["走れる"],"はしられる":["走られる"],"そうこう":["走行"],"そうこうきょり":["走行距離"],"おもむく":["赴く"],"おもむいた":["赴いた"],"おもむかない":["赴かない"],"おもむき":["趣","赴き"],"おもむいて":["赴いて"],"おもむける":["赴ける"],"おもむかれる":["赴かれる"],"おきる":["起きる"],"おきた":["起きた"],"おきない":["起きない"],"おきれる":["起きれる"],"おきられる":["起きられる"],"おこす":["起こす"],"おこした":["起こした"],"おこさない":["起こさない"],"おこして":["起こして"],"おこせる":["起こせる"],"おこされる":["起こされる"],"きぎょうか":["起業家"],"こえた":["超えた","越えた"],"こえない":["超えない","越えない"],"こえて":["超えて","越えて"],"こえれる":["超えれる","越えれる"],"こえられる":["超えられる","越えられる"],"ちょうじん":["超人"],"ちょうぜつ":["超絶"],"ちょうのうりょく":["超能力"],"ごし":["越し"],"えちご":["越後"],"しゅこう":["趣向"],"しゅみ":["趣味"],"しゅし":["趣旨"],"あしあと":["足跡","足あと"],"あしのうら":["足の裏"],"たらず":["足らず"],"たりない":["足りない"],"たりなかった":["足りなかった"],"たりなくない":["足りなくない"],"たりなくて":["足りなくて"],"あしもと":["足元"],"あしさき":["足先"],"あしとり":["足取り"],"あしどり":["足取り"],"あしば":["足場"],"あしゆ":["足湯"],"あしこし":["足腰"],"あしおと":["足音"],"あしくび":["足首"],"きょり":["距離"],"きょりかん":["距離感"],"あとち":["跡地"],"ろじょう":["路上"],"ろじ":["路地"],"ろせん":["路線"],"ろめん":["路面"],"ろめんでんしゃ":["路面電車"],"おどり":["踊り","踊り"],"おどる":["踊る"],"おどった":["踊った"],"おどらない":["踊らない"],"おどって":["踊って"],"おどれる":["踊れる"],"おどられる":["踊られる"],"ふんだ":["踏んだ"],"ふまない":["踏まない"],"ふんで":["踏んで"],"ふまれる":["踏まれる"],"しゅうきゅう":["蹴球"],"ちゅうちょ":["躊躇"],"やくどう":["躍動"],"やくしん":["躍進"],"むくろ":["身"],"みにつける":["身につける"],"みのまわり":["身の回り"],"しんたい":["身体"],"みうち":["身内"],"みぶん":["身分"],"みがって":["身勝手"],"しんぺん":["身辺"],"みぢか":["身近"],"しつけ":["躾"],"くるま":["車"],"くるまいす":["車椅子","車いす"],"しゃりょう":["車両"],"しゃちゅう":["車中"],"しゃたい":["車体"],"しゃこ":["車庫"],"しゃけん":["車検"],"しゃしゅ":["車種"],"しゃそう":["車窓"],"しゃせん":["車線"],"しゃりん":["車輪"],"しゃどう":["車道"],"ぐんじ":["軍事"],"ぐんじん":["軍人"],"ぐんだん":["軍団"],"ぐんそう":["軍曹"],"ぐんかん":["軍艦"],"ぐんたい":["軍隊"],"てんてん":["転々"],"ころび":["転び"],"てんどう":["転倒"],"てんきん":["転勤"],"てんばい":["転売"],"てんかん":["転換"],"てんしょう":["転生"],"てんよう":["転用"],"てんしょく":["転職"],"てんらく":["転落"],"てんそう":["転送"],"じく":["軸"],"かるい":["軽い"],"かるかった":["軽かった"],"かるくない":["軽くない"],"かるくて":["軽くて"],"かろい":["軽い"],"かろかった":["軽かった"],"かろくない":["軽くない"],"かろくて":["軽くて"],"かるやか":["軽やか"],"かろやか":["軽やか"],"けいげん":["軽減"],"けいじどうしゃ":["軽自動車"],"けいし":["軽視"],"けいりょう":["軽量"],"かがやき":["輝き","輝き"],"かがやく":["輝く"],"かがやいた":["輝いた"],"かがやかない":["輝かない"],"かがやいて":["輝いて"],"かがやける":["輝ける"],"かがやかれる":["輝かれる"],"しゅにゅう":["輸入"],"ゆにゅう":["輸入"],"しゅしゅつ":["輸出"],"ゆしゅつ":["輸出"],"ゆそう":["輸送"],"かのと":["辛"],"からい":["辛い"],"からかった":["辛かった"],"からくない":["辛くない"],"からくて":["辛くて"],"つらい":["辛い"],"つらかった":["辛かった"],"つらくない":["辛くない"],"つらくて":["辛くて"],"づらい":["辛い"],"からくち":["辛口"],"しんぼう":["辛抱"],"じにん":["辞任"],"ことばてん":["辞典"],"じしょ":["辞書"],"じしょく":["辞職"],"のうさぎょう":["農作業"],"のうえん":["農園"],"のうじょう":["農場"],"のうか":["農家"],"のうそん":["農村"],"のうりん":["農林"],"のうぎょう":["農業"],"のうみん":["農民"],"のうすい":["農水"],"のうすいしょう":["農水省"],"のうさんぶつ":["農産物"],"のうやく":["農薬"],"ほとり":["辺り"],"つじ":["辻"],"まで":["迄"],"じんそく":["迅速"],"むかえ":["迎え","迎え"],"むかえにいく":["迎えに行く"],"むかえた":["迎えた"],"むかえない":["迎えない"],"むかえて":["迎えて"],"むかえれる":["迎えれる"],"むかえられる":["迎えられる"],"きんきん":["近々"],"ちかぢか":["近々"],"ちかかった":["近かった"],"ちかくない":["近くない"],"ちかくて":["近くて"],"ちかいうちに":["近いうちに"],"ちかいしょうらい":["近い将来"],"ちかく":["近く"],"ちかづき":["近づき","近づき"],"ちかづく":["近づく"],"ちかづいた":["近づいた"],"ちかづかない":["近づかない"],"ちかづいて":["近づいて"],"ちかづける":["近づける"],"ちかづかれる":["近づかれる"],"きんだい":["近代"],"ちかば":["近場"],"きんねん":["近年"],"きんじょ":["近所"],"きんじつ":["近日"],"きんじつちゅうに":["近日中に"],"きんみらい":["近未来"],"きんきょう":["近況"],"きんき":["近畿"],"きんぺん":["近辺"],"ちかみち":["近道"],"きんこう":["近郊"],"きんてつ":["近鉄"],"きんりん":["近隣"],"ちかごろ":["近頃"],"かえし":["返し","返し"],"かえす":["返す"],"かえした":["返した"],"かえさない":["返さない"],"かえして":["返して"],"かえせる":["返せる"],"かえされる":["返される"],"へんじょう":["返上"],"へんじ":["返事"],"へんきゃく":["返却"],"へんさい":["返済"],"へんとう":["返答"],"へんきん":["返金"],"せまる":["迫る"],"せまった":["迫った"],"せまらない":["迫らない"],"せまり":["迫り"],"せまって":["迫って"],"せまれる":["迫れる"],"せまられる":["迫られる"],"はくりょく":["迫力"],"のべた":["述べた"],"のべない":["述べない"],"のべ":["述べ"],"のべて":["述べて"],"のべれる":["述べれる"],"のべられる":["述べられる"],"まよい":["迷い","迷い"],"まよう":["迷う"],"まよった":["迷った"],"まよわない":["迷わない"],"まよって":["迷って"],"まよえる":["迷える"],"まよわれる":["迷われる"],"まいご":["迷子"],"めいきゅう":["迷宮"],"めいわく":["迷惑"],"めいわくめーる":["迷惑メール"],"めいろ":["迷路"],"おいかける":["追いかける"],"おいかけた":["追いかけた"],"おいかけない":["追いかけない"],"おいかけ":["追いかけ"],"おいかけて":["追いかけて"],"おいかけれる":["追いかけれる"],"おいかけられる":["追いかけられる"],"おいつく":["追いつく"],"おいついた":["追いついた"],"おいつかない":["追いつかない"],"おいつき":["追いつき"],"おいついて":["追いついて"],"おいつける":["追いつける"],"おいつかれる":["追いつかれる"],"おいこみ":["追い込み"],"おいかぜ":["追い風"],"おわない":["追わない"],"おっかけ":["追っかけ"],"ついしん":["追伸"],"ついか":["追加"],"ついきゅう":["追求","追及"],"ついとう":["追悼"],"ついおく":["追憶"],"ついほう":["追放"],"ついき":["追記"],"ついせき":["追跡"],"たいにん":["退任"],"たいじょう":["退場"],"たいくつ":["退屈"],"たいさん":["退散"],"たいしょく":["退職"],"たいいん":["退院","隊員"],"おくりび":["送り火"],"そうふ":["送付"],"そうしん":["送信"],"そうべつ":["送別"],"そうべつかい":["送別会"],"そうりょう":["送料"],"そうげい":["送迎"],"にげ":["逃げ","逃げ"],"にげる":["逃げる"],"にげた":["逃げた"],"にげない":["逃げない"],"にげて":["逃げて"],"にげれる":["逃げれる"],"にげられる":["逃げられる"],"のがす":["逃す"],"のがした":["逃した"],"のがさない":["逃さない"],"のがし":["逃し"],"のがして":["逃して"],"のがせる":["逃せる"],"のがされる":["逃される"],"とうぼう":["逃亡"],"とうそう":["闘争","逃走"],"とうひ":["逃避"],"ぎゃく":["逆"],"ぎゃくに":["逆に"],"ぎゃくもどり":["逆戻り"],"ぎゃくしゅう":["逆襲"],"ぎゃくてん":["逆転"],"とうめい":["透明"],"とうめいど":["透明度"],"とじょう":["途上"],"とじょうこく":["途上国"],"とちゅう":["途中"],"とちゅうげしゃ":["途中下車"],"とほう":["途方"],"とたん":["途端"],"とたんに":["途端に"],"つう":["通"],"かよい":["通い","通い"],"かよった":["通った"],"かよわない":["通わない"],"かよって":["通って"],"かよえる":["通える"],"かよわれる":["通われる"],"とおし":["通し","通し"],"つうじ":["通じ","通じ"],"つうじて":["通じて","通じて"],"つうじる":["通じる"],"つうじた":["通じた"],"つうじない":["通じない"],"つうじれる":["通じれる"],"つうじられる":["通じられる"],"とおす":["通す"],"とおした":["通した"],"とおさない":["通さない"],"とおして":["通して"],"とおせる":["通せる"],"とおされる":["通される"],"とおり":["通り","通り"],"どおり":["通り"],"とおりすがり":["通りすがり"],"とおりすぎる":["通り過ぎる"],"とおりすぎた":["通り過ぎた"],"とおりすぎない":["通り過ぎない"],"とおりすぎ":["通り過ぎ"],"とおりすぎて":["通り過ぎて"],"とおりすぎれる":["通り過ぎれる"],"とおりすぎられる":["通り過ぎられる"],"とおりま":["通り魔"],"とおる":["通る"],"とおった":["通った"],"とおらない":["通らない"],"とおって":["通って"],"とおれる":["通れる"],"とおられる":["通られる"],"つうしん":["通信"],"つうしんきょういく":["通信教育"],"つうしんぼ":["通信簿"],"つうしんはんばい":["通信販売"],"つうきん":["通勤"],"つうきんでんしゃ":["通勤電車"],"つうこく":["通告"],"つうほう":["通報"],"つうがく":["通学"],"つうじょう":["通常"],"つうよう":["通用"],"つうようしない":["通用しない"],"つうち":["通知"],"つうしょう":["通称"],"つうさん":["通算"],"つうこう":["通行"],"つうこうにん":["通行人"],"つうこうどめ":["通行止め"],"つうやく":["通訳"],"つうわ":["通話"],"つうか":["通過","通貨"],"つうはん":["通販"],"つうろ":["通路"],"つうたつ":["通達"],"つういん":["通院"],"せいきょ":["逝去"],"はやさ":["速さ"],"そくほう":["速報"],"そくど":["速度"],"ぞうけい":["造形","造詣"],"むらじ":["連"],"れん":["連"],"つれ":["連れ"],"つれて":["連れて"],"つれていく":["連れて行く"],"つれていった":["連れて行った"],"つれていかない":["連れて行かない"],"つれていき":["連れて行き"],"つれていって":["連れて行って"],"つれていける":["連れて行ける"],"つれていかれる":["連れて行かれる"],"れんどら":["連ドラ"],"れんじゅう":["連中"],"れんちゅう":["連中"],"れんきゅう":["連休"],"れんきゅうあけ":["連休明け"],"れんどう":["連動"],"れんしょう":["連勝"],"れんごう":["連合"],"れんごうかい":["連合会"],"れんこ":["連呼"],"れんたい":["連帯"],"れんそう":["連想"],"れんせん":["連戦"],"れんだ":["連打"],"れんけい":["連携"],"れんぱい":["連敗"],"れんじつ":["連日"],"れんぱつ":["連発"],"れんめい":["連盟"],"れんけつ":["連結"],"れんらく":["連絡"],"れんらくさき":["連絡先"],"れんらくせん":["連絡先"],"れんぞく":["連続"],"れんこう":["連行"],"れんぱ":["連覇"],"れんさい":["連載"],"れんぽう":["連邦"],"れんさ":["連鎖"],"たいほ":["逮捕"],"しゅうかんし":["週刊誌"],"しゅうあけ":["週明け"],"しゅうまつ":["週末"],"すすみ":["進み","進み"],"すすむ":["進む"],"すすんだ":["進んだ"],"すすまない":["進まない"],"すすんで":["進んで","進んで"],"すすまれる":["進まれる"],"すすめる":["進める"],"すすめた":["進めた"],"すすめない":["進めない"],"すすめて":["進めて"],"すすめれる":["進めれる"],"すすめられる":["進められる"],"しんしゅつ":["進出"],"しんか":["進化"],"しんがく":["進学"],"しんてん":["進展"],"しんちょく":["進捗"],"しんぽ":["進歩"],"しんこうけい":["進行形"],"しんろ":["進路"],"ついに":["遂に"],"すいこう":["遂行"],"おそかった":["遅かった","鈍かった"],"おそくない":["遅くない","鈍くない"],"おそくて":["遅くて","鈍くて"],"おそく":["遅く"],"おくれ":["遅れ","遅れ"],"おそればせながら":["遅ればせながら"],"おくれた":["遅れた"],"おくれない":["遅れない"],"おくれて":["遅れて"],"おくれれる":["遅れれる"],"おくれられる":["遅れられる"],"ちこく":["遅刻"],"ちえん":["遅延"],"あそび":["遊び","遊び"],"あそびにいく":["遊びに行く"],"あそびにいった":["遊びに行った"],"あそびにいかない":["遊びに行かない"],"あそびにいき":["遊びに行き"],"あそびにいって":["遊びに行って"],"あそびにいける":["遊びに行ける"],"あそびにいかれる":["遊びに行かれる"],"あそびば":["遊び場"],"あそびごころ":["遊び心"],"あすぶ":["遊ぶ"],"あそぶ":["遊ぶ"],"あそんだ":["遊んだ"],"あそばない":["遊ばない"],"あそんで":["遊んで"],"あそめる":["遊める"],"あそばれる":["遊ばれる"],"ゆうぐ":["遊具"],"ゆうえんち":["遊園地"],"ゆうぎ":["遊戯"],"ゆうほどう":["遊歩道"],"はこび":["運び","運び"],"はこぶ":["運ぶ"],"はこんだ":["運んだ"],"はこばない":["運ばない"],"はこんで":["運んで"],"はこめる":["運める"],"はこばれる":["運ばれる"],"うんどう":["運動"],"うんどうぶそく":["運動不足"],"うんどうかい":["運動会"],"うんどうりょう":["運動量"],"うんせい":["運勢"],"うんめい":["運命"],"うんえい":["運営"],"うんが":["運河"],"うんよう":["運用"],"うんよく":["運良く"],"うんこう":["運行"],"うんちん":["運賃"],"うんてん":["運転"],"うんてんめんきょ":["運転免許"],"うんてんせき":["運転席"],"うんてんしゅ":["運転手"],"へんろ":["遍路"],"すぎる":["過ぎる"],"すぎた":["過ぎた"],"すぎない":["過ぎない"],"すぎて":["過ぎて"],"すぎれる":["過ぎれる"],"すぎられる":["過ぎられる"],"よぎる":["過ぎる"],"よぎった":["過ぎった"],"よぎらない":["過ぎらない"],"よぎり":["過ぎり"],"よぎって":["過ぎって"],"よぎれる":["過ぎれる"],"よぎられる":["過ぎられる"],"すごす":["過ごす"],"すごした":["過ごした"],"すごさない":["過ごさない"],"すごし":["過ごし"],"すごして":["過ごして"],"すごせる":["過ごせる"],"すごされる":["過ごされる"],"あやまち":["過ち"],"かろう":["過労"],"かはんすう":["過半数"],"かこ":["過去"],"かこさいこう":["過去最高"],"かごん":["過言"],"みちしるべ":["道しるべ"],"みちのり":["道のり","道程"],"みちのえき":["道の駅"],"どうちゅう":["道中"],"どうちゅうき":["道中記"],"どうぐ":["道具"],"どうない":["道内"],"どうふけん":["道府県"],"どうとく":["道徳"],"どうらく":["道楽"],"どさんこ":["道産子"],"どうてい":["道程"],"みちばた":["道端"],"みちくさ":["道草"],"どうろ":["道路"],"たっする":["達する"],"たつじん":["達人"],"たっせい":["達成"],"たっしゃ":["達者"],"ちがい":["違い","違い"],"ちがいない":["違いない"],"ちがいなかった":["違いなかった"],"ちがいなくない":["違いなくない"],"ちがいなくて":["違いなくて"],"たがう":["違う"],"たがった":["違った"],"たがわない":["違わない"],"たがって":["違って"],"たがえる":["違える"],"たがわれる":["違われる"],"ちがう":["違う"],"ちがった":["違った"],"ちがわない":["違わない"],"ちがって":["違って"],"ちがえる":["違える"],"ちがわれる":["違われる"],"いはん":["違反"],"いわかん":["違和感"],"いほう":["違法"],"はるか":["遥か","遙か"],"とおい":["遠い"],"とおかった":["遠かった"],"とおくない":["遠くない"],"とおくて":["遠くて"],"とおいむかし":["遠い昔"],"とおく":["遠く"],"とおくから":["遠くから"],"とおで":["遠出"],"とおぼえ":["遠吠え"],"とおまわり":["遠回り"],"えんせい":["遠征"],"えんりょ":["遠慮"],"えんりょなく":["遠慮なく"],"えんぽう":["遠方"],"おちかた":["遠方"],"とおめ":["遠目"],"えんそく":["遠足"],"えんきょり":["遠距離"],"はるかに":["遥かに"],"たまたま":["適"],"てきせつ":["適切"],"てきごう":["適合"],"てきど":["適度"],"てきとう":["適当"],"てきおう":["適応"],"てきせい":["適正","適性"],"てきよう":["適用"],"てきりょう":["適量"],"そうぐう":["遭遇"],"そうなん":["遭難"],"えらばれる":["選ばれる","選ばれる"],"えらばれた":["選ばれた"],"えらばれない":["選ばれない"],"えらばれ":["選ばれ"],"えらばれて":["選ばれて"],"えらばれれる":["選ばれれる"],"えらばれられる":["選ばれられる"],"えらびかた":["選び方"],"えらぶ":["選ぶ"],"えらんだ":["選んだ"],"えらばない":["選ばない"],"えらび":["選び"],"えらんで":["選んで"],"えらめる":["選める"],"せんしゅつ":["選出"],"せんべつ":["選別"],"せんしゅ":["選手"],"せんしゅけん":["選手権"],"せんしゅけんたいかい":["選手権大会"],"せんばつ":["選抜"],"せんたくし":["選択肢"],"せんきょく":["選曲","選挙区"],"せんじゃ":["選者"],"いでん":["遺伝"],"いでんし":["遺伝子"],"いぞく":["遺族"],"いさん":["遺産"],"いげん":["遺言"],"いごん":["遺言"],"ゆいごん":["遺言"],"よけ":["避け","避け"],"さけた":["避けた"],"さけない":["避けない"],"さけ":["酒","鮭","避け"],"さけて":["避けて"],"さけれる":["避けれる"],"さけられる":["避けられる"],"よける":["避ける"],"よけた":["避けた"],"よけない":["避けない"],"よけて":["避けて"],"よけれる":["避けれる"],"よけられる":["避けられる"],"ひにん":["避妊"],"ひなん":["非難","避難"],"まいしん":["邁進"],"かんげん":["還元"],"かんれき":["還暦"],"ほうがく":["邦楽"],"ほうが":["邦画"],"よこしま":["邪"],"じゃま":["邪魔"],"こうがい":["郊外"],"ぶか":["部下"],"ぶかい":["部会"],"ぶぶん":["部分"],"ぶぶんてき":["部分的"],"ぶひん":["部品"],"ぶいん":["部員"],"へや":["部屋"],"ぶかつ":["部活"],"ぶしょ":["部署"],"ぶちょう":["部長"],"ぶもん":["部門"],"ぶるい":["部類"],"ゆうびん":["郵便"],"ゆうびんきょく":["郵便局"],"ゆうせいみんえいか":["郵政民営化"],"ゆうそう":["郵送"],"さと":["里","郷"],"きょうどりょうり":["郷土料理"],"とかい":["都会"],"とない":["都内"],"つごう":["都合"],"つごうのいい":["都合のいい"],"つごうのいかった":["都合のいかった"],"つごうのいくない":["都合のいくない"],"つごうのいくて":["都合のいくて"],"とえい":["都営"],"としでんせつ":["都市伝説"],"つど":["都度"],"としん":["都心"],"とちじ":["都知事"],"とりつ":["都立"],"とどうふけん":["都道府県"],"くばる":["配る"],"くばった":["配った"],"くばらない":["配らない"],"くばり":["配り"],"くばって":["配って"],"くばれる":["配れる"],"くばられる":["配られる"],"はいしん":["配信"],"はいぶん":["配分"],"はいごう":["配合"],"はいぞく":["配属"],"はいふ":["配布"],"はいとう":["配当"],"はいやく":["配役"],"はいりょ":["配慮"],"はいきゅう":["配給"],"はいち":["配置"],"はいそう":["配送"],"はいたつ":["配達"],"さかば":["酒場"],"さけずき":["酒好き"],"さかや":["酒屋"],"さかだな":["酒店"],"さかみせ":["酒店"],"さけてん":["酒店"],"しゅてん":["酒店"],"しゅぞう":["酒造"],"さけのみ":["酒飲み"],"よわない":["酔わない"],"よえる":["酔える"],"よわれる":["酔われる"],"よっぱらい":["酔っ払い"],"こうそ":["酵素"],"ひどい":["酷い"],"ひどかった":["酷かった"],"ひどくない":["酷くない"],"ひどくて":["酷くて"],"むごい":["酷い"],"むごかった":["酷かった"],"むごくない":["酷くない"],"むごくて":["酷くて"],"こくしょ":["酷暑"],"さんそ":["酸素"],"だいごみ":["醍醐味"],"みにくい":["醜い"],"みにくかった":["醜かった"],"みにくくない":["醜くない"],"みにくくて":["醜くて"],"しょうゆ":["醤油"],"じょうぞう":["醸造"],"さいはい":["采配"],"さとやま":["里山"],"さとがえり":["里帰り"],"さとおや":["里親"],"おもかった":["重かった"],"おもくない":["重くない"],"おもくて":["重くて"],"おもさ":["重さ"],"おもたい":["重たい"],"おもたかった":["重たかった"],"おもたくない":["重たくない"],"おもたくて":["重たくて"],"かさなり":["重なり","重なり"],"おもなる":["重なる"],"かさなる":["重なる"],"かさなった":["重なった"],"かさならない":["重ならない"],"かさなって":["重なって"],"かさなれる":["重なれる"],"かさなられる":["重なられる"],"かさね":["重ね","重ね"],"かさねて":["重ねて","重ねて"],"かさねる":["重ねる"],"かさねた":["重ねた"],"かさねない":["重ねない"],"かさねれる":["重ねれる"],"かさねられる":["重ねられる"],"おもみ":["重み"],"じゅうこう":["重厚"],"じゅうだい":["重大","１０代"],"じゅうほう":["重宝"],"ちょうほう":["重宝"],"じゅうど":["重度"],"じゅうてん":["重点"],"じゅうしょう":["重症"],"じゅうふく":["重複"],"ちょうふく":["重複"],"じゅうよう":["重要"],"じゅうようせい":["重要性"],"じゅうし":["重視"],"じゅうりょう":["重量"],"ぬ":["野"],"ののはな":["野の花"],"やとう":["野党"],"のはら":["野原"],"やがい":["野外"],"やぼう":["野望"],"やきゅう":["野球"],"やきゅうちーむ":["野球チーム"],"やきゅうせんしゅ":["野球選手"],"やきゅうぶ":["野球部"],"やせい":["野生"],"のら":["野良"],"のらねこ":["野良猫"],"のぐさ":["野草"],"やそう":["野草"],"やさい":["野菜"],"やちょう":["野鳥"],"りょうさん":["量産"],"りょうはんてん":["量販店"],"こがね":["金","黄金"],"きんめだる":["金メダル"],"かねもうけ":["金儲け"],"かなぐ":["金具"],"きんり":["金利"],"きんじょう":["金城"],"きんす":["金子"],"きんぞく":["金属"],"かなやま":["金山"],"きんざん":["金山"],"かねぐら":["金庫"],"きんこ":["金庫"],"かねもち":["金持ち"],"きんよう":["金曜"],"きんようび":["金曜日"],"きんいろ":["金色"],"こんじき":["金色"],"きんゆう":["金融"],"きんゆうきかん":["金融機関"],"きんせん":["金銭"],"きんがく":["金額"],"きんぱつ":["金髪"],"きんぎょ":["金魚"],"くぎ":["釘"],"くぎづけ":["釘付け"],"つり":["釣り","釣","釣り"],"つりびと":["釣り人"],"つった":["釣った"],"つらない":["釣らない"],"つって":["釣って"],"つれる":["釣れる"],"つられる":["釣られる"],"ちょうか":["釣果","長靴"],"にぶい":["鈍い"],"にぶかった":["鈍かった"],"にぶくない":["鈍くない"],"にぶくて":["鈍くて"],"のろかった":["鈍かった"],"のろくない":["鈍くない"],"のろくて":["鈍くて"],"どんかん":["鈍感"],"すず":["鈴"],"くろがね":["鉄"],"てつ":["鉄"],"てつじん":["鉄人"],"てっぱん":["鉄板"],"てつわん":["鉄腕"],"てつどう":["鉄道"],"えんぴつ":["鉛筆"],"はちうえ":["鉢植え"],"ぎん":["銀"],"ぎんざ":["銀座"],"ぎんなん":["銀杏"],"ぎんいろ":["銀色"],"ぎんこう":["銀行"],"あかがね":["銅"],"どうめだる":["銅メダル"],"どうはんが":["銅版画"],"めいがら":["銘柄"],"めいか":["銘菓"],"ぜに":["銭"],"するどい":["鋭い"],"するどかった":["鋭かった"],"するどくない":["鋭くない"],"するどくて":["鋭くて"],"はがね":["鋼"],"にしき":["錦"],"れんきんじゅつ":["錬金術"],"れんきんじゅつし":["錬金術師"],"さっかく":["錯覚"],"さくご":["錯誤"],"ろくが":["録画"],"ろくおん":["録音"],"なべ":["鍋"],"なべもの":["鍋物"],"きたえる":["鍛える"],"きたえた":["鍛えた"],"きたえない":["鍛えない"],"きたえ":["鍛え"],"きたえて":["鍛えて"],"きたえれる":["鍛えれる"],"きたえられる":["鍛えられる"],"かぎ":["鍵"],"けんばん":["鍵盤"],"くさり":["鎖"],"ちんざ":["鎮座"],"かがみ":["鏡"],"つば":["鐔"],"おさ":["長"],"ながなが":["長々"],"ながい":["長い","長居"],"ながかった":["長かった"],"ながくない":["長くない"],"ながくて":["長くて"],"ながいあいだ":["長い間"],"ながさ":["長さ"],"ながの":["長の"],"ながらく":["長らく"],"ちょうじょ":["長女"],"ちょうじゅ":["長寿"],"ながさきけん":["長崎県"],"ながねん":["長年"],"ちょうしょ":["長所"],"ながもち":["長持ち"],"ちょうぶん":["長文"],"ちょうじかん":["長時間"],"ちょうき":["長期"],"ちょうきてき":["長期的"],"ちょうきけいかく":["長期計画"],"ちょうきかん":["長期間"],"ながいき":["長生き"],"ちょうなん":["長男"],"ながつづき":["長続き"],"ちょうへん":["長編"],"ちょうじゃ":["長者"],"ちょうだ":["長蛇"],"ちょうだのれつ":["長蛇の列"],"ながそで":["長袖"],"ちょうきょり":["長距離"],"ながのけん":["長野県"],"ながぐつ":["長靴"],"もんぜん":["門前"],"とじる":["閉じる"],"とじた":["閉じた"],"とじない":["閉じない"],"とじ":["閉じ"],"とじて":["閉じて"],"とじれる":["閉じれる"],"とじられる":["閉じられる"],"へいかい":["閉会"],"へいかいしき":["閉会式"],"へいまく":["閉幕"],"へいてん":["閉店"],"へいさ":["閉鎖"],"ひらき":["開き","開き"],"ひらく":["開く"],"ひらいた":["開いた"],"ひらかない":["開かない"],"ひらいて":["開いて"],"ひらける":["開ける","開ける"],"ひらかれる":["開かれる"],"あけた":["開けた"],"あけない":["開けない"],"あけて":["開けて"],"あけれる":["開けれる"],"あけられる":["開けられる"],"ひらけた":["開けた"],"ひらけない":["開けない"],"ひらけ":["開け"],"ひらけて":["開けて"],"ひらけれる":["開けれる"],"ひらけられる":["開けられる"],"かいかいしき":["開会式"],"かいさい":["開催"],"かいさいちゅう":["開催中"],"かいさいび":["開催日"],"かいし":["開始"],"かいきょく":["開局"],"かいまく":["開幕"],"かいまくせん":["開幕戦"],"かいたく":["開拓"],"かいぎょう":["開業"],"かいえん":["開演"],"かいはつ":["開発"],"かいじ":["開示"],"かいこう":["開講"],"かいつう":["開通"],"かいうん":["開運"],"かんわきゅうだい":["閑話休題"],"あいだ":["間"],"あいだに":["間に"],"まにあう":["間に合う"],"まにあった":["間に合った"],"まにあわない":["間に合わない"],"まにあい":["間に合い"],"まにあって":["間に合って"],"まにあえる":["間に合える"],"まにあわれる":["間に合われる"],"まもない":["間もない"],"まもなく":["間もなく"],"まどり":["間取り"],"まぬけ":["間抜け"],"まぢか":["間近"],"まちがい":["間違い"],"まちがいない":["間違いない"],"まちがえ":["間違え","間違え"],"まちがえる":["間違える"],"まちがえた":["間違えた"],"まちがえない":["間違えない"],"まちがえて":["間違えて"],"まちがえれる":["間違えれる"],"まちがえられる":["間違えられる"],"まぎわ":["間際"],"ぜき":["関"],"かかわらず":["関わらず"],"かかわり":["関わり","関わり"],"かかわる":["関わる"],"かかわった":["関わった"],"かかわらない":["関わらない"],"かかわって":["関わって"],"かかわれる":["関われる"],"かかわられる":["関わられる"],"かんよ":["関与"],"かんけい":["関係"],"かんけいない":["関係ない"],"かんけいしゃ":["関係者"],"かんしんじ":["関心事"],"かんとうちほう":["関東地方"],"かんせつ":["関節"],"かんさい":["関西"],"かんさいべん":["関西弁"],"かんれん":["関連"],"かんれんじょうほう":["関連情報"],"かんもん":["関門"],"かっか":["閣下"],"かくりょう":["閣僚"],"えつらん":["閲覧"],"とうびょう":["闘病"],"ふせぐ":["防ぐ"],"ふせいだ":["防いだ"],"ふせがない":["防がない"],"ふせぎ":["防ぎ"],"ふせいで":["防いで"],"ふせげる":["防げる"],"ふせがれる":["防がれる"],"ぼうぎょ":["防御"],"ぼうすい":["防水"],"ぼうさい":["防災"],"ぼうはん":["防犯"],"ぼうえい":["防衛"],"ぼうえいしょう":["防衛省"],"そし":["阻止"],"あわおどり":["阿波踊り"],"こうばん":["降板"],"こうかく":["降格"],"こうりん":["降臨"],"かぎり":["限り","限り"],"かぎる":["限る"],"かぎった":["限った"],"かぎらない":["限らない"],"かぎって":["限って"],"かぎれる":["限れる"],"かぎられる":["限られる"],"げんてい":["限定"],"げんていばん":["限定版"],"げんど":["限度"],"げんかい":["限界"],"へいか":["陛下"],"いんせい":["院生"],"いんちょう":["院長"],"じんえい":["陣営"],"じょきょ":["除去"],"じょがい":["除外"],"おちいる":["陥る"],"おちいった":["陥った"],"おちいらない":["陥らない"],"おちいり":["陥り"],"おちいって":["陥って"],"おちいれる":["陥れる"],"おちいられる":["陥られる"],"いんぼう":["陰謀"],"ちんれつ":["陳列"],"とうげい":["陶芸"],"りく":["陸"],"りくじょう":["陸上"],"りくぐん":["陸軍"],"すま":["隅"],"すみずみ":["隅々"],"かいだて":["階建て"],"かいきゅう":["階級"],"ずいぶん":["随分"],"ずいそう":["随想"],"ずいしょ":["随所"],"ずいじ":["随時"],"ずいひつ":["随筆"],"かくり":["隔離"],"すきけ":["隙"],"すきま":["隙間"],"きわ":["際"],"さいに":["際に"],"しょうがいしゃ":["障害者"],"かくし":["隠し","隠し"],"かくす":["隠す"],"かくした":["隠した"],"かくさない":["隠さない"],"かくして":["隠して"],"かくせる":["隠せる"],"かくされる":["隠される"],"かくれ":["隠れ","隠れ"],"かくれる":["隠れる"],"かくれた":["隠れた"],"かくれない":["隠れない"],"かくれて":["隠れて"],"かくれれる":["隠れれる"],"かくれられる":["隠れられる"],"かくれが":["隠れ家"],"いんきょ":["隠居"],"いんぺい":["隠蔽"],"となり":["隣","隣り"],"りんじん":["隣人"],"りんせつ":["隣接"],"となりまち":["隣町"],"おさけび":["雄叫び"],"おたけび":["雄叫び"],"ゆうだい":["雄大"],"みやび":["雅"],"つどい":["集い","集い"],"つどう":["集う"],"つどった":["集った"],"つどわない":["集わない"],"つどって":["集って"],"つどえる":["集える"],"つどわれる":["集われる"],"あつまり":["集まり","集まり"],"あつまる":["集まる"],"あつまった":["集まった"],"あつまらない":["集まらない"],"あつまって":["集まって"],"あつまれる":["集まれる"],"あつまられる":["集まられる"],"あつめ":["集め","集め"],"あつめる":["集める"],"あつめた":["集めた"],"あつめない":["集めない"],"あつめて":["集めて"],"あつめれる":["集めれる"],"あつめられる":["集められる"],"しゅうちゅう":["集中"],"しゅうちゅうりょく":["集中力"],"しゅうちゅうごうう":["集中豪雨"],"しゅうごう":["集合"],"しゅうごうばしょ":["集合場所"],"しゅうだん":["集団"],"しゅうきゃく":["集客"],"しゅうせき":["集積"],"しゅうやく":["集約"],"しゅうらく":["集落"],"しゅうけい":["集計"],"こよう":["雇用"],"ざつ":["雑"],"ざった":["雑多"],"ざつがく":["雑学"],"ぞうきん":["雑巾"],"ざっかん":["雑感"],"ざつぶん":["雑文"],"ぞうすい":["雑炊"],"ざつよう":["雑用"],"ざっしゅ":["雑種"],"ざっこく":["雑穀"],"ざっそう":["雑草"],"ざっき":["雑記"],"ざっきちょう":["雑記帳"],"ざっし":["雑誌"],"ざつだん":["雑談"],"ざっか":["雑貨"],"ざっかや":["雑貨屋"],"ざっかてん":["雑貨店"],"ひな":["雛"],"ひよこ":["雛"],"はなれ":["離れ","離れ"],"ばなれ":["離れ"],"はなれる":["離れる"],"はなれた":["離れた"],"はなれない":["離れない"],"はなれて":["離れて"],"はなれれる":["離れれる"],"はなれられる":["離れられる"],"りにゅうしょく":["離乳食"],"りこん":["離婚"],"りとう":["離島"],"りだつ":["離脱"],"むずかしい":["難しい"],"むずかしかった":["難しかった"],"むずかしくない":["難しくない"],"むずかしくて":["難しくて"],"むつかしい":["難しい"],"むつかしかった":["難しかった"],"むつかしくない":["難しくない"],"むつかしくて":["難しくて"],"むずかしさ":["難しさ"],"なんいど":["難易度"],"なんみん":["難民"],"なんば":["難波"],"なんてん":["難点"],"なんびょう":["難病"],"なんかん":["難関"],"あまあがり":["雨上がり"],"あめあがり":["雨上がり"],"うてん":["雨天"],"あまもよう":["雨模様"],"あめもよう":["雨模様"],"あめふり":["雨降り"],"ゆきだるま":["雪だるま"],"ゆきぐに":["雪国"],"ゆきやま":["雪山"],"ゆきげしき":["雪景色"],"せつげっか":["雪月花"],"ふんいき":["雰囲気"],"くものうえ":["雲の上"],"いかずち":["雷"],"いかづち":["雷"],"かみなり":["雷"],"らいう":["雷雨"],"いなずま":["電"],"いなづま":["電"],"でんりょく":["電力"],"でんか":["電化"],"でんき":["電気","電機","電器"],"でんし":["電子"],"でんしれんじ":["電子レンジ"],"でんげき":["電撃"],"でんきだい":["電気代"],"でんきや":["電気屋"],"でんち":["電池"],"でんぱ":["電波"],"でんげん":["電源"],"でんせん":["電線"],"でんのう":["電脳"],"でんわ":["電話"],"でんわちょう":["電話帳"],"でんわばんごう":["電話番号"],"でんしゃ":["電車"],"でんてつ":["電鉄"],"じゅよう":["需要"],"ふるえ":["震え","震え"],"ふるえる":["震える"],"ふるえた":["震えた"],"ふるえない":["震えない"],"ふるえて":["震えて"],"ふるえれる":["震えれる"],"ふるえられる":["震えられる"],"しんど":["震度"],"しんさい":["震災"],"かすみ":["霞"],"あらわ":["露"],"ろしゅつ":["露出"],"ろてい":["露呈"],"ろてん":["露天","露店"],"ろてんぶろ":["露天風呂"],"ろこつ":["露骨"],"あおかった":["青かった"],"あおくない":["青くない"],"あおくて":["青くて"],"あおいとり":["青い鳥"],"せいしょうねん":["青少年"],"せいねん":["青年"],"せいしゅん":["青春"],"せいしゅんじだい":["青春時代"],"あおき":["青木"],"あおうめ":["青梅"],"あおもりけん":["青森県"],"あおぞら":["青空"],"あおいろ":["青色"],"せいしょく":["青色"],"あおば":["青葉"],"せいりょう":["青龍"],"せいこく":["靖国"],"やすくに":["靖国"],"やすくにじんじゃ":["靖国神社"],"しずか":["静か"],"しずかに":["静かに"],"しずけさ":["静けさ"],"しじま":["静寂"],"せいじゃく":["静寂"],"しずおか":["静岡"],"しずおかけん":["静岡県"],"ひこうしき":["非公式"],"ひこうかい":["非公開"],"ひえいり":["非営利"],"ひこくみん":["非国民"],"ひじょう":["非常"],"ひじょうに":["非常に"],"ひじょうきん":["非常勤"],"ひじょうしき":["非常識"],"ひにちじょう":["非日常"],"つら":["面","頬"],"づら":["面"],"めんめん":["面々"],"めんかい":["面会"],"めんどう":["面倒"],"めんどうくさい":["面倒くさい"],"めんどうくさかった":["面倒くさかった"],"めんどうくさくない":["面倒くさくない"],"めんどうくさくて":["面倒くさくて"],"めんこ":["面子"],"めんつ":["面子"],"おもかげ":["面影"],"めんせつ":["面接"],"おもしろ":["面白"],"おもしろい":["面白い"],"おもしろかった":["面白かった"],"おもしろくない":["面白くない"],"おもしろくて":["面白くて"],"おもしろさ":["面白さ"],"めんだん":["面談"],"つくりかわ":["革"],"つくりがわ":["革"],"かくめい":["革命"],"くつ":["靴"],"くつした":["靴下"],"かばん":["鞄"],"からくに":["韓国"],"かんこくじん":["韓国人"],"かんこくご":["韓国語"],"かんりゅう":["韓流"],"はんりゅう":["韓流"],"おんじょう":["音声"],"おんせい":["音声"],"おんがく":["音楽"],"おんがくか":["音楽家"],"おんがっか":["音楽家"],"おんがくえいが":["音楽映画"],"おんがくさい":["音楽祭"],"おんげん":["音源"],"おんち":["音痴"],"おんいろ":["音色"],"おんしょく":["音色"],"ねいろ":["音色"],"おんりょう":["音量"],"おんきょう":["音響"],"ひびき":["響き","響き","響"],"ひびく":["響く"],"ひびいた":["響いた"],"ひびかない":["響かない"],"ひびいて":["響いて"],"ひびける":["響ける"],"ひびかれる":["響かれる"],"おおがい":["頁"],"ぺーじ":["頁"],"いただき":["頂き","頂き","頂"],"いただきもの":["頂き物"],"いただく":["頂く"],"いただいた":["頂いた"],"いただかない":["頂かない"],"いただいて":["頂いて"],"いただける":["頂ける","頂ける"],"いただかれる":["頂かれる"],"いただけた":["頂けた"],"いただけない":["頂けない"],"いただけ":["頂け"],"いただけて":["頂けて"],"いただけれる":["頂けれる"],"いただけられる":["頂けられる"],"ちょうじょう":["頂上"],"ちょうだい":["頂戴"],"ちょうてん":["頂点"],"うなじ":["項"],"こうもく":["項目"],"じゅんに":["順に"],"じゅんい":["順位"],"じゅんじょ":["順序"],"じゅんとう":["順当"],"じゅんじ":["順次"],"じゅんばん":["順番"],"じゅんちょう":["順調"],"あずかり":["預かり"],"あずけ":["預け"],"よきん":["預金"],"かたくな":["頑"],"がんこ":["頑固"],"がんばって":["頑張って","頑張って"],"がんばり":["頑張り","頑張り"],"がんばる":["頑張る"],"がんばった":["頑張った"],"がんばらない":["頑張らない"],"がんばれる":["頑張れる"],"がんばられる":["頑張られる"],"りょうしゅうしょ":["領収書"],"りょうど":["領土"],"りょういき":["領域"],"ほお":["頬"],"ほほ":["頬"],"あたま":["頭"],"がしら":["頭"],"つぶり":["頭"],"つむ":["頭"],"つむり":["頭"],"どたま":["頭"],"あたまから":["頭から"],"あたまがいたい":["頭が痛い"],"ずじょう":["頭上"],"かしらもじ":["頭文字"],"ずつう":["頭痛"],"ずのう":["頭脳"],"ひんど":["頻度"],"ひんぱん":["頻繁"],"たのみ":["頼み","頼み"],"たのむ":["頼む"],"たのんだ":["頼んだ"],"たのまない":["頼まない"],"たのんで":["頼んで"],"たのまれる":["頼まれる"],"たのもしい":["頼もしい"],"たのもしかった":["頼もしかった"],"たのもしくない":["頼もしくない"],"たのもしくて":["頼もしくて"],"たよりになる":["頼りになる"],"たよりになった":["頼りになった"],"たよりにならない":["頼りにならない"],"たよりになり":["頼りになり"],"たよりになって":["頼りになって"],"たよりになれる":["頼りになれる"],"たよりになられる":["頼りになられる"],"たよる":["頼る"],"たよった":["頼った"],"たよらない":["頼らない"],"たよって":["頼って"],"たよれる":["頼れる"],"たよられる":["頼られる"],"だいめい":["題名"],"だいざい":["題材"],"ひたい":["額"],"あご":["顎"],"かお":["顔"],"かんばせ":["顔"],"かおつき":["顔つき"],"かおぶれ":["顔ぶれ"],"かおをだす":["顔を出す"],"かおもじ":["顔文字"],"かおだち":["顔立ち"],"かおいろ":["顔色"],"がんしょく":["顔色"],"かおまけ":["顔負け"],"がんめん":["顔面"],"けんちょ":["顕著"],"ねがい":["願い","願い"],"ねがいごと":["願い事"],"ねがう":["願う"],"ねがった":["願った"],"ねがわない":["願わない"],"ねがって":["願って"],"ねがえる":["願える"],"ねがわれる":["願われる"],"がんぼう":["願望"],"がんもう":["願望"],"てんまつ":["顛末"],"たぐい":["類"],"るいじ":["類似"],"こもん":["顧問"],"こかく":["顧客"],"こきゃく":["顧客"],"ふうぞく":["風俗"],"ふうりょく":["風力"],"ふろ":["風呂"],"ふろば":["風呂場"],"ふうど":["風土"],"ふぜい":["風情"],"ふうけい":["風景"],"ふうげつ":["風月"],"ふうりんかざん":["風林火山"],"ふうすい":["風水"],"ふうりゅう":["風流"],"ふうちょう":["風潮"],"ふうぶつし":["風物詩"],"ふうしゅう":["風習"],"ふうせん":["風船"],"ふうぼう":["風貌"],"かざぐるま":["風車"],"ふうしゃ":["風車"],"ふうじゃ":["風邪"],"かぜぎみ":["風邪気味"],"ふうりん":["風鈴"],"さっそう":["颯爽"],"とばし":["飛ばし","飛ばし"],"とばす":["飛ばす"],"とばした":["飛ばした"],"とばさない":["飛ばさない"],"とばして":["飛ばして"],"とばせる":["飛ばせる"],"とばされる":["飛ばされる"],"とび":["飛び","飛び"],"とびだし":["飛び出し","飛び出し"],"とびだす":["飛び出す"],"とびだした":["飛び出した"],"とびださない":["飛び出さない"],"とびだして":["飛び出して"],"とびだせる":["飛び出せる"],"とびだされる":["飛び出される"],"とびこみ":["飛び込み"],"とぶ":["飛ぶ"],"とばない":["飛ばない"],"とんで":["飛んで","飛んで"],"とばれる":["飛ばれる"],"ひこう":["飛行"],"ひこうき":["飛行機"],"ひやく":["飛躍"],"ひちょう":["飛鳥"],"くいしんぼう":["食いしん坊"],"くいだおれ":["食い倒れ"],"くいもの":["食い物"],"くった":["食った"],"くわない":["食わない"],"くって":["食って"],"くえる":["食える"],"くわれる":["食われる"],"しょくす":["食す"],"しょくした":["食した"],"しょくさない":["食さない"],"しょくし":["食し"],"しょくして":["食して"],"しょくせる":["食せる"],"しょくされる":["食される"],"たべる":["食べる"],"たべた":["食べた"],"たべない":["食べない"],"たべ":["食べ"],"たべて":["食べて"],"たべれる":["食べれる"],"たべられる":["食べられる"],"たべほうだい":["食べ放題"],"たべかた":["食べ方"],"たべあるき":["食べ歩き"],"たべもの":["食べ物"],"たべすぎ":["食べ過ぎ"],"くわずぎらい":["食わず嫌い"],"しょくぱん":["食パン"],"しょくちゅうどく":["食中毒"],"しょくじ":["食事"],"しょくたく":["食卓"],"しょくひん":["食品"],"しょっき":["食器"],"しょくどう":["食堂"],"じきどう":["食堂"],"しょくご":["食後"],"しょっかん":["食感"],"しょくぶんか":["食文化"],"しょくりょう":["食料","食糧"],"しょくりょうひん":["食料品"],"しょくざい":["食材"],"しょくよく":["食欲"],"しょくもつ":["食物"],"しょくがん":["食玩"],"しょくせいかつ":["食生活"],"しょくよう":["食用"],"しょくいく":["食育"],"しょくひ":["食費"],"まんま":["飯"],"めし":["飯"],"のみかい":["飲み会"],"のみや":["飲み屋"],"のみほうだい":["飲み放題"],"のみもの":["飲み物"],"のみくい":["飲み食い"],"のめる":["飲める"],"のめた":["飲めた"],"のめない":["飲めない"],"のめ":["飲め"],"のめて":["飲めて"],"のめれる":["飲めれる"],"のめられる":["飲められる"],"いんりょう":["飲料"],"のみりょう":["飲料"],"いんしゅ":["飲酒"],"いんしゅうんてん":["飲酒運転"],"いんしょく":["飲食"],"いんしょくてん":["飲食店"],"かいぬし":["飼い主"],"かいねこ":["飼い猫"],"しいく":["飼育"],"あきる":["飽きる"],"あきた":["飽きた"],"あきない":["飽きない"],"あきて":["飽きて"],"あきれる":["飽きれる"],"あきられる":["飽きられる"],"かざり":["飾り","飾り"],"かざる":["飾る"],"かざった":["飾った"],"かざらない":["飾らない"],"かざって":["飾って"],"かざれる":["飾れる"],"かざられる":["飾られる"],"ぎょうざ":["餃子"],"あも":["餅"],"あんも":["餅"],"かちん":["餅"],"ようじょう":["養生"],"ようろう":["養老"],"えさ":["餌"],"やかた":["館"],"かんない":["館内"],"まんじゅう":["饅頭"],"おひと":["首"],"おびと":["首"],"しゅい":["首位"],"しゅしょう":["首相"],"しゅのう":["首脳"],"くびわ":["首輪"],"しゅと":["首都"],"しゅとけん":["首都圏"],"こうばしい":["香ばしい"],"こうばしかった":["香ばしかった"],"こうばしくない":["香ばしくない"],"こうばしくて":["香ばしくて"],"かおる":["香る"],"かおった":["香った"],"かおらない":["香らない"],"かおって":["香って"],"かおれる":["香れる"],"かおられる":["香られる"],"かがわけん":["香川県"],"こうすい":["香水"],"ほんこん":["香港"],"こうしんりょう":["香辛料"],"うま":["馬"],"うまぬし":["馬主"],"ばしゅ":["馬主"],"ばぬし":["馬主"],"ばけん":["馬券"],"ばれん":["馬連"],"ばかに":["馬鹿に"],"なじみ":["馴染み"],"だぶん":["駄文"],"だがし":["駄菓子"],"えきでん":["駅伝"],"えきまえ":["駅前"],"えきべん":["駅弁"],"かけひき":["駆け引き"],"かけこみ":["駆け込み"],"くじょ":["駆除"],"ちゅうざい":["駐在"],"ちゅうしゃじょう":["駐車場"],"きじょう":["騎乗"],"さわぎ":["騒ぎ","騒ぎ"],"さわぐ":["騒ぐ"],"さわいだ":["騒いだ"],"さわがない":["騒がない"],"さわいで":["騒いで"],"さわげる":["騒げる"],"さわがれる":["騒がれる"],"そうどう":["騒動"],"そうおん":["騒音"],"おどろき":["驚き","驚き"],"おどろく":["驚く"],"おどろいた":["驚いた"],"おどろかない":["驚かない"],"おどろいて":["驚いて"],"おどろける":["驚ける"],"おどろかれる":["驚かれる"],"おどろくべき":["驚くべき"],"きょうがく":["驚愕"],"きょういてき":["驚異的"],"ほね":["骨"],"こっせつ":["骨折"],"こつばん":["骨盤"],"こっとう":["骨董"],"こつずい":["骨髄"],"たか":["高","鷹"],"だか":["高"],"たかい":["高い"],"たかかった":["高かった"],"たかくない":["高くない"],"たかくて":["高くて"],"たかさ":["高さ"],"たかまる":["高まる"],"たかまった":["高まった"],"たかまらない":["高まらない"],"たかまり":["高まり"],"たかまって":["高まって"],"たかまれる":["高まれる"],"たかまられる":["高まられる"],"たかめる":["高める"],"たかめた":["高めた"],"たかめない":["高めない"],"たかめ":["高め"],"たかめて":["高めて"],"たかめれる":["高めれる"],"たかめられる":["高められる"],"たかね":["高値"],"こうげん":["高原"],"たかだい":["高台"],"こうひんしつ":["高品質"],"こうがくねん":["高学年"],"こうそうびる":["高層ビル"],"こうざん":["高山"],"こうど":["高度"],"こうせいのう":["高性能"],"こうぼく":["高木"],"こうこう":["高校"],"こうこうせい":["高校生"],"こうこうやきゅう":["高校野球"],"こうきのう":["高機能"],"こうおん":["高温"],"こうねつ":["高熱"],"こうちけん":["高知県"],"こうとうがっこう":["高等学校"],"こうきゅう":["高級"],"こうけつあつ":["高血圧"],"こうそくどうろ":["高速道路"],"こうれいか":["高齢化"],"こうれいしゃ":["高齢者"],"かみのけ":["髪の毛"],"ひげ":["髭"],"おに":["鬼"],"さきがけ":["魁"],"たましい":["魂"],"だましい":["魂"],"みりょう":["魅了"],"みりょく":["魅力"],"みりょくてき":["魅力的"],"みわく":["魅惑"],"もうりょう":["魍魎"],"まりょく":["魔力"],"まじょ":["魔女"],"まほう":["魔法"],"まほうつかい":["魔法使い"],"まおう":["魔王"],"まじゅつ":["魔術"],"まじゅつし":["魔術師"],"うお":["魚"],"ぎょかい":["魚介"],"ぎょかいるい":["魚介類"],"さかなや":["魚屋"],"ぎょりょうり":["魚料理"],"あゆ":["鮎"],"しゃけ":["鮭"],"あざやか":["鮮やか"],"せんめい":["鮮明"],"くじら":["鯨"],"かつお":["鰹"],"うなぎ":["鰻"],"うろこ":["鱗"],"とりいんふるえんざ":["鳥インフルエンザ"],"とっとりけん":["鳥取県"],"とりい":["鳥居"],"とりはだ":["鳥肌"],"なきごえ":["鳴き声"],"ならす":["鳴らす"],"ならした":["鳴らした"],"ならさない":["鳴らさない"],"ならし":["鳴らし"],"ならして":["鳴らして"],"ならせる":["鳴らせる"],"ならされる":["鳴らされる"],"かもめ":["鴎"],"おおとり":["鵬"],"くたかけ":["鶏"],"にわとり":["鶏"],"けいにく":["鶏肉"],"とりにく":["鶏肉"],"たず":["鶴"],"かのしし":["鹿"],"しかにく":["鹿"],"かごしまけん":["鹿児島県"],"ふもと":["麓"],"むぎ":["麦"],"むぎちゃ":["麦茶"],"めんるい":["麺類"],"まーぼーどうふ":["麻婆豆腐"],"あさぬの":["麻布"],"まふ":["麻布"],"まひ":["麻痺"],"まやく":["麻薬"],"あさごろも":["麻衣"],"ますい":["麻酔"],"まあじゃん":["麻雀"],"まぜじゃん":["麻雀"],"こうこん":["黄昏"],"たそがれ":["黄昏"],"おうしょく":["黄色"],"きいろ":["黄色"],"こうしょく":["黄色"],"きいろい":["黄色い"],"きいろかった":["黄色かった"],"きいろくない":["黄色くない"],"きいろくて":["黄色くて"],"おうごん":["黄金"],"きがね":["黄金"],"くがね":["黄金"],"くろ":["黒"],"くろい":["黒い"],"くろかった":["黒かった"],"くろくない":["黒くない"],"くろくて":["黒くて"],"こくじん":["黒人"],"くろじ":["黒字"],"くろき":["黒木"],"こくばん":["黒板"],"くろねこ":["黒猫"],"くろまめ":["黒豆"],"くろかみ":["黒髪"],"こどう":["鼓動"],"ねず":["鼠"],"はなみず":["鼻水"],"はなじ":["鼻血"],"はなぢ":["鼻血"],"いちまんえん":["１万円"],"いちわり":["１割"],"とおか":["１０日"],"じゅうがつ":["１０月"],"ひゃくえんしょっぷ":["１００円ショップ"],"ひゃっきん":["１００均"],"じゅういちがつ":["１１月"],"ひゃくとおばん":["１１０番"],"じゅうにがつ":["１２月"],"じゅうはちきん":["１８禁"],"にわり":["２割"],"ふたぐみ":["２組"],"にじっせいき":["２０世紀"],"にじゅっせいき":["２０世紀"],"はつか":["２０日"],"さんくみ":["３組"],"みくみ":["３組"],"さんぶ":["３部"],"いつか":["５日"],"むいか":["６日"],"なぬか":["７日"],"なのか":["７日"],"ようか":["８日"],"ここのか":["９日"],"えーがた":["Ａ型"],"えーでぃー":["ＡＤ"],"えーあい":["ＡＩ"],"えーおー":["ＡＯ"],"えーてぃーえむ":["ＡＴＭ"],"びーがた":["Ｂ型"],"びーびーえす":["ＢＢＳ"],"びーしー":["ＢＣ"],"びーでぃー":["ＢＤ"],"びーじーえむ":["ＢＧＭ"],"きゃど":["ＣＡＤ"],"しーでぃー":["ＣＤ"],"しーえふ":["ＣＦ"],"しーじー":["ＣＧ"],"しーじーあい":["ＣＧＩ"],"しーえむ":["ＣＭ"],"しーおーでぃー":["ＣＯＤ"],"しーてぃー":["ＣＴ"],"でぃーじぇー":["ＤＪ"],"でぃーえる":["ＤＬ"],"でぃーえぬえー":["ＤＮＡ"],"でぃーぶいでぃー":["ＤＶＤ"],"えりっく":["ＥＲＩＣ"],"いーてぃーしー":["ＥＴＣ"],"いーゆー":["ＥＵ"],"えふえむ":["ＦＭ"],"じーだぶりゅー":["ＧＷ"],"えいちぴー":["ＨＰ"],"えっちぴー":["ＨＰ"],"えっちてぃーえむえる":["ＨＴＭＬ"],"えいちてぃーてぃーぴー":["ＨＴＴＰ","ｈｔｔｐ"],"えっちてぃーてぃーぴー":["ＨＴＴＰ","ｈｔｔｐ"],"あいでぃー":["ＩＤ"],"あいぴー":["ＩＰ"],"あいてぃー":["ＩＴ"],"えるいーでぃー":["ＬＥＤ"],"えむ":["Ｍ"],"みでぃ":["ＭＩＤＩ"],"みでぃー":["ＭＩＤＩ"],"えむぴーすりー":["ＭＰ３"],"えぬじー":["ＮＧ"],"えぬえっちけー":["ＮＨＫ"],"えぬてぃーてぃー":["ＮＴＴ"],"おーがた":["Ｏ型"],"おーびー":["ＯＢ"],"おーじー":["ＯＧ"],"おっけー":["ＯＫ"],"おーけー":["ＯＫ"],"おーえる":["ＯＬ"],"おーえす":["ＯＳ"],"ぴーしー":["ＰＣ"],"ぴーでぃーえー":["ＰＤＡ"],"ぴーてぃーえー":["ＰＴＡ"],"ぷろもーしょんびでお":["ＰＶ"],"きゅーあーるこーど":["ＱＲコード"],"ろむ":["ＲＯＭ"],"えす":["Ｓ"],"えすえふ":["ＳＦ"],"えすえる":["ＳＬ"],"えすえぬえす":["ＳＮＳ"],"えすおーえす":["ＳＯＳ"],"てぃーしゃつ":["Ｔシャツ"],"てーべー":["ＴＢ"],"ゆーたーん":["Ｕターン"],"ゆーふぉー":["ＵＦＯ"],"ゆーえむえー":["ＵＭＡ"],"ゆーま":["ＵＭＡ"],"ゆーえん":["ＵＮ"],"ゆーあーるえる":["ＵＲＬ"],"ゆーえすびー":["ＵＳＢ"],"ぶいえす":["ＶＳ"],"だぶるはい":["Ｗ杯"],"だぶりゅーだぶりゅーだぶりゅー":["ＷＷＷ"],"えっくすえむえる":["ＸＭＬ"],"うぇぶはくしゅ":["ｗｅｂ拍手"],"ちょめちょめ":["ｘｘ"]};
},{}],"G63o/f":[function(require,module,exports){
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
},{"dict":"Ikh15T"}],"saPlFO":[function(require,module,exports){
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



},{"edict":"G63o/f"}],"1bQYIb":[function(require,module,exports){
var server = "http://localhost:3000";

module.exports = function() {
	var cache = {};

	this.getSelections = function(hiragana) {
		$.support.cors = true;
		return $.ajax(server, {
			data: {
				text: hiragana
			},
			type: "GET",
			dataType: "jsonp",
			contentType: "application/json; charset=utf8"
		});
	};
}
},{}],5:[function(require,module,exports){
var Composition = require("./js/composition");

function insertAtCaret(element, text) {
    if (document.selection) {
        element.focus();
        var sel = document.selection.createRange();
        sel.text = text;
        element.focus();
    } else if (element.selectionStart || element.selectionStart === 0) {
        var startPos = element.selectionStart;
        var endPos = element.selectionEnd;
        var scrollTop = element.scrollTop;
        element.value = element.value.substring(0, startPos) + text + element.value.substring(endPos, element.value.length);
        element.focus();
        element.selectionStart = startPos + text.length;
        element.selectionEnd = startPos + text.length;
        element.scrollTop = scrollTop;
    } else {
        element.value += text;
        element.focus();
    }
}

// $(function() {
	
// 	var a = $('#area')
// 	.on("keydown", function(e) {
// 		if(e.which == Keys.RIGHT) {
// 			a.setSelectionRange(a.selectionStart+2, a.selectionEnd+2);
// 		} else if(e.which == Keys.LEFT) {
// 			a.setSelectionRange(a.selectionStart-2, a.selectionEnd-2);
// 		}

// 		return false;
// 	})
// 	.get(0);
// 	a.setSelectionRange(0, 3);
// 	a.focus();
	

// });

function setRangeText(area, text) {
	if(area.setRangeText) area.setRangeText(text);
	else {
		var val = area.value;
		var start = area.selectionStart;
    	area.value = val.slice(0, area.selectionStart) + text + val.slice(area.selectionEnd);
		area.setSelectionRange(start, start + text.length);
	}
}

function imeify(box) {
		
	var win = $("<ol>", {"class": "ime_window"}).appendTo("body");
	var underlines = [];

	var composition = new Composition();

	function onLengthChanged(text) {
		// var pos = composition.from;
		// while(underlines.length < text.length) {
		// 	underlines.push($("<div>", {"class": "underline"}).appendTo("body"));

		// }
		// var bpos = $(box).offset();

		// for(var i = 0; i < underlines.length; i++) {
		// 	var u = underlines[i];
		// 	if(i < text.length) {
		// 		u.show();
		// 		var pxls = $(box).getCaretPosition(composition.from + i);
		// 		u.css({
		// 			left: pxls.left + bpos.left,
		// 			top: pxls.top + bpos.top + 16
		// 		});
		// 	} else {
		// 		u.hide();
		// 	}
			
		// }
	}

	composition.on("select", function(from, to) {
		box.setSelectionRange(from, to);
	});
	composition.on("move", function(step) {
		box.setSelectionRange(box.selectionStart + step, box.selectionEnd + step);
	});

	composition.on("replace", function(from, to, text) {
		if(!to && !text) {
			box.setRangeText(from);
		} else {
			// console.log(from, to, text);
			box.setSelectionRange(from, to);
			// box.setRangeText(text);
			setRangeText(box, text);
			box.setSelectionRange(from + text.length, from + text.length);
		}
		onLengthChanged(text);
	});

	composition.on("insert", function(text) {
		insertAtCaret(box, text);
		onLengthChanged(text);
	});

	composition.on("done", function() {
		$.each(underlines, function() {
			$(this).hide();
		});
		// $(underlines).hide();
	});

	composition.on("show_window", function(values) {
		win.empty();
		$.each(values, function(i, val) {
			$("<li>").append(
				$("<span>").text(val)
			).appendTo(win);
		});
		var pos = $(box).getCaretPosition();
		var bpos = $(box).offset();

		win.css({
			left: pos.left + bpos.left,
			top: pos.top + bpos.top + 16
		});
		win.show();
	});

	composition.on("hide_window", function() {
		win.hide();
	});

	composition.on("select_entry", function(index) {
		win.children().removeClass("selected").filter("li:eq("+index+")").addClass("selected");
	});


	box.addEventListener("keydown", function(e) {
		if(!composition.preInterpret(e, box.selectionStart)) {
			e.preventDefault();
		}
	});
	// This is our textbox!
	box.addEventListener("keypress", function(e) {
		if(!composition.interpret(e, box.selectionStart)) {
			e.preventDefault();
		}
		// e.preventDefault();
	}, false);


	box.addEventListener("keyup", function(e) {

	}, false);
}


$(function() {
	// return false;
	$("textarea").each(function() {
		imeify(this);
	});	
	
});
},{"./js/composition":6}],6:[function(require,module,exports){
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
},{"./japanesestring":7,"./selectionlist":11}],7:[function(require,module,exports){


var JapaneseString = module.exports = function() {
	var self = this;

	this.input = "";
	// this.rem = "";

	this.result = "";

	this.add = function(letter, index) {
		if(index === null) index = this.length();

		this.input = convert(this.input.substr(0, index) + letter, true)
					+ this.input.substr(index);
	
	};

	this.hiragana = function() {
		return this.input;
	}
	this.current = function() {
		return this.result || this.hiragana();
	}

	this.remove = function(i) {
		this.input = this.input.substr(0, i)
		           + this.input.substr(i + 1);
	}

	this.empty = function() {
		this.input = "";
		// this.rem = "";
	}

	this.length = function() {
		return this.hiragana().length;
	};
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
}


IMERoma2KatakanaTable_ = {'.':'。',',':'、','-':'ー','~':'〜','va':'う゛ぁ','vi':'う゛ぃ','vu':'う゛','ve':'う゛ぇ','vo':'う゛ぉ','vv': ['っ',1],'xx': ['っ',1],'kk': ['っ',1],'gg': ['っ',1],'ss': ['っ',1],'zz': ['っ',1],'jj': ['っ',1],'tt': ['っ',1],'dd': ['っ',1],'hh': ['っ',1],'ff': ['っ',1],'bb': ['っ',1],'pp': ['っ',1],'mm': ['っ',1],'yy': ['っ',1],'rr': ['っ',1],'ww': ['っ',1],'cc': ['っ',1],'kya':'きゃ','kyi':'きぃ','kyu':'きゅ','kye':'きぇ','kyo':'きょ','gya':'ぎゃ','gyi':'ぎぃ','gyu':'ぎゅ','gye':'ぎぇ','gyo':'ぎょ','sya':'しゃ','syi':'しぃ','syu':'しゅ','sye':'しぇ','syo':'しょ','sha':'しゃ','shi':'し','shu':'しゅ','she':'しぇ','sho':'しょ','zya':'じゃ','zyi':'じぃ','zyu':'じゅ','zye':'じぇ','zyo':'じょ','tya':'ちゃ','tyi':'ちぃ','tyu':'ちゅ','tye':'ちぇ','tyo':'ちょ','cha':'ちゃ','chi':'ち','chu':'ちゅ','che':'ちぇ','cho':'ちょ','dya':'ぢゃ','dyi':'ぢぃ','dyu':'ぢゅ','dye':'ぢぇ','dyo':'ぢょ','tha':'てゃ','thi':'てぃ','thu':'てゅ','the':'てぇ','tho':'てょ','dha':'でゃ','dhi':'でぃ','dhu':'でゅ','dhe':'でぇ','dho':'でょ','nya':'にゃ','nyi':'にぃ','nyu':'にゅ','nye':'にぇ','nyo':'にょ','jya':'じゃ','jyi':'じ','jyu':'じゅ','jye':'じぇ','jyo':'じょ','hya':'ひゃ','hyi':'ひぃ','hyu':'ひゅ','hye':'ひぇ','hyo':'ひょ','bya':'びゃ','byi':'びぃ','byu':'びゅ','bye':'びぇ','byo':'びょ','pya':'ぴゃ','pyi':'ぴぃ','pyu':'ぴゅ','pye':'ぴぇ','pyo':'ぴょ','fa':'ふぁ','fi':'ふぃ','fu':'ふ','fe':'ふぇ','fo':'ふぉ','mya':'みゃ','myi':'みぃ','myu':'みゅ','mye':'みぇ','myo':'みょ','rya':'りゃ','ryi':'りぃ','ryu':'りゅ','rye':'りぇ','ryo':'りょ','n\'':'ん','nn':'ん','n':'ん','a':'あ','i':'い','u':'う','e':'え','o':'お','xa':'ぁ','xi':'ぃ','xu':'ぅ','xe':'ぇ','xo':'ぉ','la':'ぁ','li':'ぃ','lu':'ぅ','le':'ぇ','lo':'ぉ','ka':'か','ki':'き','ku':'く','ke':'け','ko':'こ','ga':'が','gi':'ぎ','gu':'ぐ','ge':'げ','go':'ご','sa':'さ','si':'し','su':'す','se':'せ','so':'そ','za':'ざ','zi':'じ','zu':'ず','ze':'ぜ','zo':'ぞ','ja':'じゃ','ji':'じ','ju':'じゅ','je':'じぇ','jo':'じょ','ta':'た','ti':'ち','tu':'つ','tsu':'つ','te':'て','to':'と','da':'だ','di':'ぢ','du':'づ','de':'で','do':'ど','xtu':'っ','xtsu':'っ','na':'な','ni':'に','nu':'ぬ','ne':'ね','no':'の','ha':'は','hi':'ひ','hu':'ふ','fu':'ふ','he':'へ','ho':'ほ','ba':'ば','bi':'び','bu':'ぶ','be':'べ','bo':'ぼ','pa':'ぱ','pi':'ぴ','pu':'ぷ','pe':'ぺ','po':'ぽ','ma':'ま','mi':'み','mu':'む','me':'め','mo':'も','xya':'ゃ','ya':'や','xyu':'ゅ','yu':'ゆ','xyo':'ょ','yo':'よ','ra':'ら','ri':'り','ru':'る','re':'れ','ro':'ろ','xwa':'ゎ','wa':'わ','wi':'うぃ','we':'うぇ','wo':'を'};
},{}],"localstore":[function(require,module,exports){
module.exports=require('saPlFO');
},{}],9:[function(require,module,exports){
var SelectionStore = require("localstore");
// var EventEmitter2 = require("eventemitter2");

var store = new SelectionStore();


var Selection = module.exports = function(text, from, length) {
	EventEmitter2.apply(this, arguments);

	this.length = length;
	this.from = from;
	this.text = text;
	this.index = 0;

	this.selections = [this.actualText()];
	var dummy = $.Deferred();
	dummy.resolve(this.selections);
	this.promise = dummy.promise();
}

Selection.prototype = Object.create(EventEmitter2.prototype);

Selection.prototype.update = function() {
	var self = this;
	// this.changeValues([this.actualText()]);
	this.setIndex(0);
	this.promise = store.getSelections(this.actualText()).then(function(selections) {
		self.changeValues(selections);
	});
	
};

Selection.prototype.changeValues = function(values) {
	//If they're equal, return
	if($(this.selections).not(values).length == 0 && $(values).not(this.selections).length == 0) return false;

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
},{"localstore":"saPlFO"}],"serverstore":[function(require,module,exports){
module.exports=require('1bQYIb');
},{}],11:[function(require,module,exports){
var Selection = require("./selection");
// var EventEmitter2 = require("eventemitter2");


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

},{"./selection":9}],"dict":[function(require,module,exports){
module.exports=require('Ikh15T');
},{}],"edict":[function(require,module,exports){
module.exports=require('G63o/f');
},{}]},{},[5])
;