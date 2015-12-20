var module = require("./index.js");

var custom = {
	subscribeFileListener : function(listener){
		listener.on('fileReceived', function(){
			console.log('File received!!!!!');
		});
	}
};

var specification = module.createSpecification().
				listenAt('C:/test').
				forFiles('test.txt').
				every(5000).
				mail({
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
				}).
				doCustom(custom).
				route('C:/Users/Gaurav', false);

var listener = module.build(specification);
listener.start();


