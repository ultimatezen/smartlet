
var koaBody = require('koa-body');
var session = require('../../system/session');

function setup(router) {

	router.post('/order/place', koaBody(), session.check, require('./place'));

}


/** exports **/

exports.setup = setup;

