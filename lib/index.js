/**
 * @file Main entry point for the app
 */


var co = require('co');
var koa = require('koa');
var KoaRouter = require('koa-router');
var config = require('config');
var debug = require('debug')('main');

var database = require('./system/database');
var api = require('./api');

var app = koa();
var apiRouter = new KoaRouter({ prefix: '/api' });


// set response type to json
app.use(function * (next) {

	this.res.type = 'application/json';
	this.body = {};
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

	var port = config.server.port;
	app.listen(port);
	debug('Server started on port:', port);

});

