/**
 * @file Entry point for test api
 */


var koaBody = require('koa-body');


function setup(router) {

	router.get('/test/get', require('./get'));
	router.post('/test/post', koaBody(), require('./post'));

}


/** exports **/

exports.setup = setup;

