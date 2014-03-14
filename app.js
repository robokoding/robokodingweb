#!/bin/env node

/* Add modules */
var express = require('express'),
	app = express();

/* Set app properties */
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
	res.sendfile(__dirname + '/index.html');
});

/* Login and registration */
app.get('/login', function() {
	res.json({ message: "welcome to login" });
});
app.get('/guest', function() {
	res.json({ message: "welcome to guest login" });
});
app.all('/signup', function() {
	res.json({ message: "welcome to signup" });
});

/* Start the app and sockets */
var server = app.listen(process.env.PORT, function() {
	console.log("INFO", "express server listening on port:", process.env.PORT);
});