jsIME
=====
Pseudo-IME for the Japanese language built with JavaScript made just for fun. Uses a [special flavor](http://www.geocities.jp/ep3797/edict_01.html) of the [EDICT file](http://www.csse.monash.edu.au/~jwb/edict_doc.html) by Hiroshi Utsumi that includes word frequency. 


Requirements
------------
You'll need [node.js](http://www.nodejs.org/), [Grunt](http://gruntjs.com/) and a working internet connection.

Installation
------------
Just clone the repository `git clone git@github.com:EusthEnoptEron/jsIME.git` and go through the usual procedure:
```shell
$ cd jsIME
$ npm install
$ grunt
```

Usage
-----
There are two ways to use this tool—a slimmed-down standalone version that runs entirely in the browser, and a server version where the dictionary data is provided by a simple express server.
At this point, the server version can't be used without any source modifications. For the standalone version, simply open `vanilla/index.html`.

To give it a whirl, [open the demo](http://www.zomg.ch/ime/) and enter some text. Tested in Chrome, but it *should* work in Firefox and IE10. Maybe.
