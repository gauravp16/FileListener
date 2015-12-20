var email = require('emailjs/email');

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

Mailer.prototype.send = function(){
	var server  = email.server.connect({
		   user:     this.settings.user, 
		   password: this.settings.password,
		   host:     this.settings.smtpHost, 
		   ssl:      true
	});
	
	server.send({
	   text:    this.mail.body, 
	   from:    this.mail.from, 
	   to:      this.mail.to,
	   cc:      this.mail.cc,
	   subject: this.mail.subject
	}, function(err, message) { console.log(err); });
}

Mailer.prototype.subscribeFileListener = function(listener){
		var mailer = this;
		listener.on('fileReceived', function(){
			mailer.send();
		});
}

module.exports = {
	create : function(mailArgs){
		return new Mailer(new MailSettings(mailArgs), new Mail(mailArgs));
	}
};