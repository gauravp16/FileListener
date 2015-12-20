const Router = require('./Router.js');
const Mailer = require('./Mailer.js');
const Builder = require('./Builder.js');

function Specification(){
	this.subscribers = [];
}

Specification.prototype = {
	listenAt : function(location){
		this.source = location;
		return this;	
	},

	forFiles : function(pattern){
		this.pattern = pattern;
		return this;
	},

	every : function(interval){
		this.interval = interval;
		return this;
	},

	mail : function(mailArgs){
		this.subscribers.push(Mailer.create(mailArgs));
		return this;
	},

	doCustom : function(custom){
		this.subscribers.push(custom);
		return this;
	},

	route : function(to, removeFromSource){
		this.subscribers.push(Router.create(this.source+ '/' + this.pattern, to + '/'+ this.pattern, removeFromSource));
		return this;	
	},

	isValid : function(){
		if(this.source === null || this.source === undefined)
			return false;

		if(this.pattern === null || this.pattern === undefined)
			return false;

		if(this.interval === undefined || !typeof(this.interval) === 'number')
			return false;

		return true;
	},

	completeSourceFilePath : function(){
		return this.source + '/' + this.pattern;
	}
}


var api = {
	createSpecification : function(){
		return new Specification();
	},

	build : function(specification){
		return Builder.create().build(specification);
	}
};

module.exports = api;