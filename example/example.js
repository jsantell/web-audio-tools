var tool = new WebAudioTools(window, document.querySelector("#graph-target"));
var ctx = window.AudioContext ? new AudioContext() : new webkitAudioContext();
var carrier1 = ctx.createOscillator();
var carrier2 = ctx.createOscillator();
var gain1 = ctx.createGain();
var filter = ctx.createBiquadFilter();
filter.frequency.value = 500;
carrier1.frequency.value = 40;
carrier2.frequency.value = 80;
carrier1.type = "sawtooth";
carrier2.type = "square";
gain1.gain.value = 1;

var modulator = ctx.createOscillator();
var modGain = ctx.createGain();
modulator.frequency.value = 0.5;
modGain.gain.value = 400;

var modulator2 = ctx.createOscillator();
modulator2.frequency.value = 4;
var modGain2 = ctx.createGain();
modGain2.gain.value = 50;
modulator2.connect(modGain2);
modGain2.connect(gain1.gain);
modulator2.start(0);

modulator.connect(modGain);
modGain.connect(filter.frequency);

carrier1.connect(filter);
carrier2.connect(filter);
filter.connect(gain1);
gain1.connect(ctx.destination);

modulator.start(0);
carrier1.start(0);
carrier2.start(0);
