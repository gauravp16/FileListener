## Installation
npm install --save filelistener

## Usage
File listener watches a directory for a file and once the file is available in the folder, it allows for certain tasks to be executed like sending the file as an attachment in a mail, placing the file into a different folder (timestamped if required) or any other user defined task.

### Creating a file listener

The first step is to create a listener configuration.
```javascript
const module = require('FileListener');

//any custom task
var custom = {
 	subscribeFileListener : function(listener){
 		listener.on('fileReceived', function(){
 			console.log('File received!!!!!');
 		});
 	}
 };

var specification = module.createSpecification().
				listenAt('source').
				forFiles('testFileListener.txt').
				every(4000).
				mail({
					'smtpHost' : 'smtp.gmail.com',
					'user' : 'someid@gmail.com',
					'password' : 'password',
					'mail' : {
						'to' : 'receiver@gmail.com',
						'from' : 'someid@gmail.com',
						'cc' : '',
						'subject' : 'Test file listener',
						'body' : 'Hi, just testing file listener'
					}
				}).
				doCustom(custom).
				route('destination', {removeOriginal:false}, {timestamp:false});
```
### Build and start listener

The next step is to build and start listener.

```javascript
var listener = module.build(specification);
listener.start();
```

## License
Licensed under MIT