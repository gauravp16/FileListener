const module = require("./index.js");
const util = require('./util.js');

var custom = {
	subscribeFileListener : function(listener){
		var instance = this;
		listener.on('fileAvailable', function(){
			console.log('fileAvailable!!!!!');
		});
	}
};

var specification = module.createSpecification().
				listenAt('source').
				forFiles('testFileListener.txt').
				every(4000).
				/*mail({
					'smtpHost' : 'smtp.gmail.com',
					'user' : 'gauravp16@gmail.com',
					'password' : 'stendulkar',
					'mail' : {
						'to' : 'gauravp16@gmail.com',
						'from' : 'gauravp16@gmail.com',
						'cc' : '',
						'subject' : 'test file listener',
						'body' : 'Hi, just testing file listener'
					}
				}).*/
				doCustom(custom).
				route('doesnotexist', {removeOriginal:false}, {timestamp:false});

var listener = module.build(specification);
listener.start();

