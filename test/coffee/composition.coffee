expect = require "expect.js"
Composition = require "../../coffee/coffee/composition"

process.stdout.write "Loading dict ..."
LocalStore = require "../../lib/localstore"
console.log " done"

store = new LocalStore()

# Constants
LEFT = 37
RIGHT = 39
SPACE = 32

describe "composition", ->

	it "should convert text into hiragana", ->
		composition = new Composition()

		inputText "hiragana", composition

		expect(composition.input).to.equal("ひらがな")
		expect(composition.preview).to.equal("ひらがな")

	it "should handle ん correctly", ->
		composition = new Composition()

		inputText "haren", composition

		expect(composition.input).to.equal("はれn")
		
		inputText "chi", composition

		expect(composition.input).to.equal("はれんち")

	it "should convert two n to ん", ->
		composition = new Composition()

		inputText "nn", composition

		expect(composition.input).to.equal("ん")
	
	it "should ignore invalid hiragana", ->
		composition = new Composition()

		inputText "krzwlp", composition

		expect(composition.input).to.equal("krzwlp")

	it "should correctly handle key arrows", ->
		composition = new Composition()

		inputText "shoutnn", composition
		input LEFT, composition
		input "a", composition

		for i in [0..20]
			input LEFT, composition
		inputText "gashinn", composition

		expect(composition.input).to.equal("がしんしょうたん")

	it "should convert n into ん on SPACE", ->
		composition = new Composition(store)

		input "n", composition
		input SPACE, composition

		expect(composition.input).to.equal "ん"

	it "should convert 'ore' into '俺' as the first choice", (done) ->

		composition = new Composition(store)

		inputText "ore", composition
		input SPACE, composition

		setTimeout(
			->
				expect(composition.preview).to.equal "俺"
				done()
			10)

	it "should suggest something else than 俺 when selecting the next item", (done) ->

		composition = new Composition(store)

		inputText "ore", composition
		input SPACE, composition

		setTimeout(
			->
				# Put this here because the script needs to fetch the dictionary
				# data first.
				input SPACE, composition
				expect(composition.preview).to.not.equal "俺"
				expect(composition.preview).to.not.equal "おれ"
				done()
			10)

	

###

HELPERS

###
inputText = (text, composition) ->
	for key in text
			input key, composition

input = (key, composition) ->
	composition.preInterpret(shamKeyEvent key) and
	composition.interpret(shamKeyEvent key)

shamKeyEvent = (letter, ctrlKey = false, shiftKey = false) ->
	return {
		which: if letter.charCodeAt? then letter.charCodeAt(0) else letter
		ctrlKey: false
		shiftKey: false
		altKey: false
	}