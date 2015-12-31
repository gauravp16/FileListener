const fs = require('fs.extra');
const util = require('./util.js');

function Router(from, to, removeOriginal, timestamp){
	this.from = from;
	this.to = to;
	this.removeOriginal = removeOriginal;
	this.timestamp = timestamp;
}

Router.prototype = {
	route : function(){
		var destination = this.to;
		if(typeof(this.timestamp) != undefined && this.timestamp.timestamp === true)
			destination = util.timestamped(this.to);

		if(typeof(this.removeOriginal) != undefined && this.removeOriginal.removeOriginal === true)
			fs.move(this.from, destination, function(err){
				if(err)
					throw err;
			});
		else
			fs.copy(this.from, destination, {replace: true}, function(err){
				if(err)
					throw err;
			});		
	},

	subscribeFileListener : function(listener){
		var router = this;
		listener.on('fileAvailable', function(){
			router.route();
		});
	}
};

var router = {
	create : function(from, to, removeOriginal, timestamp){
		return new Router(from, to, removeOriginal, timestamp);
	}
};

module.exports = router;