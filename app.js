#!/bin/env node

/* Add modules */
var fs = require('fs'),
	express = require('express'),
	socketio = require('socket.io'),
	exec = require('child_process').exec;

/* Set app properties */
var app = express();
app.set('view engine', 'jade');
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(app.router);

/* Development only */
if ('development' == app.get('env')) {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

/* Landingpage */
app.get('/', function(req, res) {
	res.render('index');
});

/* Login and registration */
app.get('/login', function(req, res) {
	res.json({ message: "welcome to login" });
});
app.get('/guest', function(req, res) {
	res.json({ message: "welcome to guest login" });
});
app.all('/signup', function(req, res) {
	res.json({ message: "welcome to signup" });
});
app.get('/sumorobot', function(req, res) {
	res.render('sumorobot');
});

/* Start the express server */
var server = app.listen(process.env.PORT, function() {
	console.log("INFO", "express server listening on port:", process.env.PORT);
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
		console.log("INFO", "get :", user);
	});

	/* User send sumorobot code */
	socket.on('send-sumorobot-code', function(code) {
		console.log("INFO", "received sumorobot code:", code);
		/* Write the program to the file */
		fs.writeFile("public/compiler/main.ino", code, function(err) {
			if (err) socket.emit('sumorobot-message', "upload failed");
			else console.log("INFO", "sumorobot code was saved");
		});
		console.log("INFO", "compiling sumorobt code");
		/* Compile the program and upload it */
		var child = exec("cd public/compiler && make all && make upload",
			function (error, stdout, stderr) {
				console.log("INFO", "stdout:", stdout);
				console.log("INFO", "stderr:", stderr);
				socket.emit('sumorobot-message', "upload successful");
			}
		);
	});

	/* User disconnected from socket */
	socket.on('disconnect', function() {
		console.log("INFO", "socket connection ended");
	});
});