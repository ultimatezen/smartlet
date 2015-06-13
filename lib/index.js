/**
 * @file Main entry point for the app
 */


var co = require('co');
var koa = require('koa');
var KoaRouter = require('koa-router');
var config = require('config');
var debug = require('debug')('main');

var path = require('path');
var staticCache = require('koa-static-cache');

var database = require('./system/database');
var api = require('./api');

var app = koa();
var apiRouter = new KoaRouter({ prefix: '/api' });


app.use(function *(next) {

	try {
		yield next;
	} catch (err) {
		this.status = err.status || 500;
		this.body = err.message;
		this.app.emit('error', err, this);
	}

});


app.use(function *(next) {

	this.set("Access-Control-Allow-Origin", "*");
	this.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	this.set("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");

	yield next;

});


var staticPath = path.join(__dirname, 'img');

console.log('staticPath', staticPath)

var files;

app.use(staticCache(staticPath, {}, files));
console.log('files', files);


// set response type to json
app.use(function *(next) {

	if (this.req.method === 'POST' || this.req.method === 'OPTIONS') {
		this.res.type = 'application/json';
		this.body = {};
	}

	yield next;

});


// setup apis and register routes
api.setup(apiRouter, function (err) {
	if (err) {
		debug(err);
		process.exit(1);
	}

	// setup database
	co(database.connect);

	app.use(apiRouter.routes());

	var port = process.env.PORT || config.server.port;
	app.listen(port);
	debug('Server started on port:', port);

});

