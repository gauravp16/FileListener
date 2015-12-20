const Listener = require('./Listener.js');

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

	return {
		build : function(specification){
			//if(specification === null || specification === undefined || !specification.isValid()) 
			var listener = Listener.create(specification);
			registerSubscribers(listener, specification);
			return listener;
		}	
	};
}();

var builder = {
	create : function(){
		return new Builder();
	}
};

module.exports = builder;