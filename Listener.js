const fs = require('fs');
const EventEmitter = require("events").EventEmitter;
const util = require("util");

function Listener(specification){
	this.poller = null;
	this.specification = specification;
	EventEmitter.call(this);
}

util.inherits(Listener, EventEmitter);

function listen(listener){
	fs.stat(listener.specification.completeSourceFilePath(), function(err, stats){
		if(!err && stats.isFile()){
			listener.emit("fileReceived", {});
		}
	});
}

Listener.prototype.start = function(){
 	this.poller = setInterval(listen, this.specification.interval, this);
};

Listener.prototype.stop = function(){
	clearInterval(this.poller);
};

module.exports = {
	create: function(specification){
		return new Listener(specification);
	}
}
