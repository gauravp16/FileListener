const Router = require('./Router.js');
const Mailer = require('./Mailer.js');
const Builder = require('./Builder.js');
const util = require('./util.js');

function Specification(){
	this.subscribers = [];
}

Specification.prototype = function(){
	return {
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

		route : function(to, removeOriginal, timestamp){
			this.subscribers.push(Router.create(util.combine(this.source, this.pattern), util.combine(to, this.pattern), removeOriginal, timestamp));
			return this;	
		},

		isValid : function(){
			if(typeof(this.source) === undefined || (!this.source) || util.directoryExists(this.source) === false)
				throw new Error('not a valid source directory');

			if(typeof(this.pattern) === undefined || !this.pattern || util.fileExists(util.combine(this.source, this.pattern)) === false)
				throw new Error('not a valid source file');

			if(typeof(this.interval) === undefined || typeof(this.interval) != 'number')
				throw new Error('not a valid interval');

			return true;
		},

		completeSourceFilePath : function(){
			return util.combine(this.source, this.pattern);
		}
	};
}();


var api = {
	createSpecification : function(){
		return new Specification();
	},

	build : function(specification){
		return Builder.create().build(specification);
	}
};

module.exports = api;