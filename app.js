#!/bin/env node

/* Add modules */
var fs = require('fs'),
	express = require('express'),
	socketio = require('socket.io'),
	requirejs = require('requirejs'),
	exec = require('child_process').exec;

/* Set app properties */
var app = express();
app.set('view engine', 'jade');
app.use(express.static(__dirname + "/public"));

/* Landingpage */
app.get('/', function(req, res) {
	res.render('index');
});
/* Login page */
app.get('/login', function(req, res) {
	res.json({ message: "welcome to login" });
});
/* Guest login page */
app.get('/guest', function(req, res) {
	res.json({ message: "welcome to guest login" });
});
/* Signup page */
app.all('/signup', function(req, res) {
	res.json({ message: "welcome to signup" });
});
/* Sumorobot programming page */
app.get('/sumorobot', function(req, res) {
	res.render("sumorobot");
	//res.redirect('http://91.102.9.98:3000/sumorobot');
});
/* Sumorobot controller page */
app.get('/controller', function(req, res) {
	res.json({ message: "welcome to sumorobot controller" });
});
/* Order process */
app.post('/order', function(req, res) {
	res.send({ message: "thank you for your order", order: req.body });
});

/* Start the express server */
var server = app.listen(3000, function() {
	console.log("INFO", "express server listening on port:", 3000);
});

/* Start socket.io */
io = socketio.listen(server);
console.log("INFO", "socket.io started");

/* User initiated socket connection */
io.sockets.on('connection', function(socket) {
	/* User connected to socketio */
	console.log("INFO", "socket connection established");

	/* User asks for someones code */
	socket.on('get-sumorobot-code', function(user) {
		console.log("INFO", "get sumorobot code:", user);
	});

	/* User send sumorobot code */
	socket.on('send-sumorobot-code', function(code) {
		console.log("INFO", "received sumorobot code:", code);
		/* Write the program to the file */
		fs.writeFile("public/compiler/code.ino", code, function(err) {
			if (err) socket.emit('sumorobot-message', "upload failed");
			else console.log("INFO", "sumorobot code was saved");
		});
		console.log("INFO", "compiling sumorobt code");
		/* Compile the program and upload it */
		var child = exec("cd public/compiler && make upload",
			function (error, stdout, stderr) {
				console.log("INFO", "stdout:", stdout);
				console.log("INFO", "stderr:", stderr);
				socket.emit('sumorobot-message', "upload failed");
			}
		);
	});

	/* User disconnected from socket */
	socket.on('disconnect', function() {
		console.log("INFO", "socket connection ended");
	});
});
