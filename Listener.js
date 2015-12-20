var fs = require('fs');
const EventEmitter = require("events").EventEmitter;
const util = require("util");

function Listener(specification){
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
	if(this.specification.isValid()){
		setInterval(listen, this.specification.interval, this);
	}
};

module.exports = {
	create: function(specification){
		return new Listener(specification);
	}
}
