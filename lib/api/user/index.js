/**
 * @file Entry point for test api
 */


var koaBody = require('koa-body');
var session = require('../../system/session');


function setup(router) {

	router.get('/user/get', session.check, require('./get'));
	router.post('/user/post', koaBody(), session.check, require('./post'));

}


/** exports **/

exports.setup = setup;

