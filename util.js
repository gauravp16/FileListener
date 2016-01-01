const fs = require('fs.extra');
const path = require('path');

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
			return path.join(pathOne, pathTwo);
		},

		timestamped: function(arg){
			var dir = path.dirname(arg);
			var extn = path.extname(arg);
			var file = path.basename(arg, extn);
			var timestamp = new Date().getTime().toString();
						
			return path.join(dir,file+timestamp+extn);
		},

		createReadStream: function(path){
			return fs.createReadStream(path);
		},

		deleteFile : function(path){
			fs.unlink(path);
		}
	};
}();