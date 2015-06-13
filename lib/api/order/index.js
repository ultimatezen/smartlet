
var koaBody = require('koa-body');
var session = require('../../system/session');

function setup(router) {

	router.post('/order/place', koaBody(), session.check, require('./place'));
	router.post('/order/get', koaBody(), session.check, require('./get'));

}


/** exports **/

exports.setup = setup;

