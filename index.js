var EventEmitter = require("events").EventEmitter;
var util = require("util");
var Instrumentation = require("web-audio-instrumentation");
var ContextView = require("./lib/context");
var AudioNodes = require("./lib/model");

module.exports = WebAudioTools;

function WebAudioTools (win, el) {
  this.el = el;
  this.core = new Instrumentation();
  this.nodes = new AudioNodes(this.core);
  this.core.instrument(win);

  this.context = new ContextView(this.core, this.nodes, el);
}

/**
 * Inherits from `EventEmitter`.
 */
util.inherits(WebAudioTools, EventEmitter);
