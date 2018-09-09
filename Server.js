var express=require('express');
var nodemailer = require("nodemailer");
var app=express();
const auth = require('./auth');
app.use(auth);
app.use(express.static('.'));
/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "YOURUSERNAME",
        pass: "YOURPASSWORD"
    }
});

app.get('/',function(req,res){
    res.sendFile('/');
});
app.get('/send',function(req,res){
    var mailOptions={
//	from : "accounts@gmail.com",
        to : req.query.to,
        subject : req.query.subject,
        text : req.query.text
    }
    console.log(req.query.count);
    console.log(mailOptions);
    for (let i = 0, p = Promise.resolve(); i < Number(req.query.count); i++) {
    p = p.then(_ => new Promise(resolve =>
        setTimeout(function () {
	    smtpTransport.sendMail(mailOptions, function(error, response){
	     if(error){
	            console.log(error);
	        res.end("error");
	     }else{
	            console.log("Message sent: " + response.message);
	        res.end("sent");
	         }
	});
            resolve();
        }, Math.random() * 1000)
    ));
}
});


app.listen(3000,function(){
    console.log("Express Started on Port 3000");
});
