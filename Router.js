var fs = require('fs.extra');

function Router(from, to, removeFromSource){
	this.from = from;
	this.to = to;
	this.removeFromSource = removeFromSource;
}

Router.prototype = {
	route : function(){
		if(this.removeFromSource)
			fs.move(this.from, this.to, function(err){
				if(err)
					throw err;
			});
		else
			fs.copy(this.from, this.to, {replace: true}, function(err){
				if(err)
					throw err;
			});		
	},

	subscribeFileListener : function(listener){
		var router = this;
		listener.on('fileReceived', function(){
			router.route();
		});
	}
};



var router = {
	create : function(from, to, removeFromSource){
		return new Router(from, to, removeFromSource);
	}
};

module.exports = router;