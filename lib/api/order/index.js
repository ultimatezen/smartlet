
var koaBody = require('koa-body');
var session = require('../../system/session');

function setup(router) {

	router.post('/order/place', koaBody(), session.check, require('./place'));
	router.post('/order/get', koaBody(), session.check, require('./get'));

	router.post('/order/check/get', koaBody(), session.check, require('./check/get'));
	router.post('/order/check/close', koaBody(), session.check, require('./check/close'));

}


/** exports **/

exports.setup = setup;

