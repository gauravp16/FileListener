const fs = require('fs');
const fsExtra = require('fs.extra');

module.exports = function(){
	return {
		fileExists : function(filePath){
			try{
				return fs.statSync(filePath).isFile();
			}
			catch(err){
				return false;
			}
		},

		directoryExists : function(directoryPath){
			try{
				return fs.statSync(directoryPath).isDirectory();
			}
			catch(err){
				return false;
			}
		},

		combine : function(pathOne, pathTwo){
			return pathOne + '/' + pathTwo;
		},

		timestamped: function(arg){
			timestamp = new Date().getTime().toString();
			return  arg+timestamp;
		},

		createReadStream: function(path){
			return fs.createReadStream(path);
		},

		deleteFile : function(path){
			fs.unlink(path);
		}
	};
}();