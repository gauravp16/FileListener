const Listener = require('./Listener.js');
const util = require('./util.js')
const fsExtra = require('fs.extra');
const os = require('os');

function Builder(){}

Builder.prototype = function(){
	function registerSubscribers(listener, specification){
		if(specification.subscribers.length > 0){
			for(var i = 0; i < specification.subscribers.length; i++){
				if(specification.subscribers[i] != null && specification.subscribers[i] != undefined)
					specification.subscribers[i].subscribeFileListener(listener);
			}
		}
	}

	function registerMandatorySubscribers(listener, specification){
		listener.on('fileReceived', function(){
			fsExtra.copy(specification.completeSourceFilePath(), util.combine(os.tmpdir(), specification.pattern), {replace:true}, function(err){
				if(err)
					throw err;
				listener.emit('fileAvailable', {});
			});
			//util.copyFile(specification.completeSourceFilePath(), util.combine('C:/temp', specification.pattern));	
		});
	}

	return {
		build : function(specification){
			if(!specification) 
				throw new Error('specification cannot be null or undefined');

			if(specification.isValid()){
				var listener = Listener.create(specification);
				registerMandatorySubscribers(listener, specification);
				registerSubscribers(listener, specification);
				return listener;
			}
		}	
	};
}();

var builder = {
	create : function(){
		return new Builder();
	}
};

module.exports = builder;