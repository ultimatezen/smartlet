/**
 * @file Entry point for test api
 */


var koaBody = require('koa-body');
var session = require('../../system/session');

function setup(router) {

	// merchant
	router.post('/merchant/get', koaBody(), session.check, require('./get'));

	// table
	router.post('/merchant/table/join', koaBody(), session.check, require('./table/join'));
	router.post('/merchant/table/users', koaBody(), session.check, require('./table/users'));

}


/** exports **/

exports.setup = setup;

