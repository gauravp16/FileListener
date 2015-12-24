var module  = require('../index.js');
var fs = require('fs');
var util = require('../util.js');

describe('I build a FileListener with an incorrect specification', function(){
	it('should throw error if no specification is provided', function(){
		expect(function(){module.build(null);}).toThrowError('specification cannot be null or undefined');
	});

	it('should throw error if the listenAt location is invalid', function(){
		var specification = module.createSpecification().
				listenAt('C:/doesnotexist').
				forFiles('test.txt').
				every(5000).
				route('C:/Users/Gaurav', false);

		expect(function(){module.build(specification);}).toThrowError('not a valid source directory');
	});

	it('should throw error if the file name is invalid', function(){
		var specification = module.createSpecification().
				listenAt('C:/test').
				forFiles('doesnotexist.txt').
				every(5000).
				route('C:/Users/Gaurav', false);
		expect(function(){module.build(specification);}).toThrowError('not a valid source file');
	});

	it('should throw error if the interval is invalid', function(){
		var specification = module.createSpecification().
				listenAt('C:/test').
				forFiles('test.txt').
				route('C:/Users/Gaurav', false);
		expect(function(){module.build(specification);}).toThrowError('not a valid interval');
	});
});

describe('I build a FileListener with a correct specification', function(){
	var custom = null;
	beforeEach(function(done){
		custom = {
			subscribeFileListener : function(listener){
					listener.on('fileReceived', function(){
						console.log('File received');
					});
				}
		};

		spyOn(custom, 'subscribeFileListener');
		var specification = module.createSpecification().
				listenAt('C:/test').
				forFiles('test.txt').
				every(0).
				doCustom(custom).
				route('C:/Users/Gaurav', {removeOriginal:true}, {timestamp:true});


		var listener = module.build(specification);	
		listener.start();
		done();
	});

	it('should be able to notify if file is available', function(done){
		expect(custom.subscribeFileListener).toHaveBeenCalled();
		done();
	});

	it('if specified, should be able to copy the file in the configured folder', function(done){
		expect(util.fileExists('C:/Users/Gaurav/test.txt')).toBe(true);
		done();
	});

	it('if specified, should be able to remove the file from the source directory', function(done){
		expect(util.fileExists('C:/test/test.txt')).toBe(false);
		done();
	});

	it('if specified, should be able to mail the file', function(){

	});

	it('if specified, should be able to execute any custom task', function(done){
		expect(custom.subscribeFileListener).toHaveBeenCalled();
		done();
	});
});

describe('when one of the tasks fails', function(){
	var custom = null;
	beforeEach(function(done){
		custom = {
			subscribeFileListener : function(listener){
					listener.on('fileReceived', function(){
						console.log('File received');
					});
				}
		};

		spyOn(custom, 'subscribeFileListener');
		var specification = module.createSpecification().
				listenAt('C:/test').
				forFiles('test.txt').
				every(0).
				doCustom(custom).
				route('C:/doesnotexist', {removeOriginal:true}, {timestamp:true});


		var listener = module.build(specification);	
		listener.start();
		done();
	});

	it('should not prevent any other task from execution', function(done){
		expect(custom.subscribeFileListener).toHaveBeenCalled();
		done();
	});
});