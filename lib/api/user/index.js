/**
 * @file Entry point for test api
 */


var koaBody = require('koa-body');


function setup(router) {

	router.get('/user/get', require('./get'));
	router.post('/user/post', koaBody(), require('./post'));

}


/** exports **/

exports.setup = setup;

