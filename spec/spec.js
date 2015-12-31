var module  = require('../index.js');
const fs = require('fs.extra');
const util = require('../util.js');
const os = require('os');

function setUp(){
	try 
	{
		if(util.directoryExists('source') === true){
			fs.removeSync('source');		
		}
		if(util.directoryExists('destination') === true){
			fs.removeSync('destination');		
		}
		fs.mkdirSync('source');
		fs.mkdirSync('destination');
		fs.writeFileSync('source/testFileListener.txt', 'Test file listener!');
	} 
	catch(e) {
		console.log(e);
		if ( e.code != 'EEXIST' ) throw e;
	}
}

function cleanUp(){
	fs.removeSync('source');
	fs.removeSync('destination');
}

describe('File listener specification', function(){
	describe('I build a FileListener with an incorrect specification', function(){
		beforeEach(function(){
			setUp();
		});

		afterEach(function(){
			cleanUp();
		});

		it('should throw error if no specification is provided', function(){
			expect(function(){module.build(null);}).toThrowError('specification cannot be null or undefined');
		});

		it('should throw error if the listenAt location is invalid', function(){
			var specification = module.createSpecification().
					listenAt('doesnotexist').
					forFiles('testFileListener.txt').
					every(5000).
					route('destination', false);

			expect(function(){module.build(specification);}).toThrowError('not a valid source directory');
		});

		it('should throw error if the file name is invalid', function(){
			var specification = module.createSpecification().
					listenAt('source').
					forFiles('doesnotexist.txt').
					every(5000).
					route('destination', false);
			expect(function(){module.build(specification);}).toThrowError('not a valid source file');
		});

		it('should throw error if the interval is invalid', function(){
			var specification = module.createSpecification().
					listenAt('./source').
					forFiles('testFileListener.txt').
					route('./destination', false);
			expect(function(){module.build(specification);}).toThrowError('not a valid interval');
		});
	});

	describe('I build a FileListener with a correct specification', function(){
		var custom = null;
		beforeEach(function(done){
			setUp();
			custom = {
				touch : function(){},
				subscribeFileListener : function(listener){
					var instance = this;
					listener.on('fileAvailable', function(){
						instance.touch();
					});
				}
			};

			spyOn(custom, 'touch');
			var specification = module.createSpecification().
					listenAt('source').
					forFiles('testFileListener.txt').
					every(1000).
					doCustom(custom).
					route('destination', {removeOriginal:true}, {timestamp:false});

			var listener = module.build(specification);		
			listener.start();
			setTimeout(done, 3000);
		});

		afterEach(function(){
			cleanUp();
		});

		it('should be able to execute all the configured tasks', function(done){
			expect(custom.touch).toHaveBeenCalled();
			done();
		});

		it('if specified, should be able to copy the file in the configured folder', function(done){
			expect(util.fileExists('destination/testFileListener.txt')).toBe(true);
			done();
		});

		it('if specified, should be able to remove the file from the source directory', function(done){
			expect(util.fileExists('source/testFileListener.txt')).toBe(false);
			done();
		});
	});
});


