const email = require('emailjs/email');
const util = require('./util.js');
const os = require('os');

function Mail(args){
	this.to = args.mail.to;
	this.from = args.mail.from;
	this.cc = args.mail.cc;
	this.subject = args.mail.subject;
	this.body = args.mail.body;
}

function MailSettings(args){
	this.smtpHost = args.smtpHost;
	this.user = args.user;
	this.password = args.password;
}

function Mailer(settings, mail){
	this.settings =  settings;
	this.mail = mail;
}

Mailer.prototype.send = function(path){
	var server  = email.server.connect({
	   user:     this.settings.user, 
	   password: this.settings.password,
	   host:     this.settings.smtpHost, 
	   ssl:      true
	});

	var message = {
		   	text:    this.mail.body, 
		   	from:    this.mail.from, 
		   	to:      this.mail.to,
		   	cc:      this.mail.cc,
		   	subject: this.mail.subject,
		   	attachment: 
		   	[
		   		{stream:util.createReadStream(path)}
		   	]
		};
	
	server.send(message, function(err, message){ 
		cleanUpTemp(path);
		if(err) 
			throw err;
	});
};

Mailer.prototype.subscribeFileListener = function(listener){
		var mailer = this;
		listener.on('fileAvailable', function(){
			mailer.send(util.combine(os.tmpdir(), listener.specification.pattern));
		});
};

function cleanUpTemp(path){
	util.deleteFile(path);
}

module.exports = {
	create : function(mailArgs){
		return new Mailer(new MailSettings(mailArgs), new Mail(mailArgs));
	}
};