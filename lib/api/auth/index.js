/**
 * @file Entry point for auth api
 */


var koaBody = require('koa-body');


function setup(router) {

	router.post('/auth/login', koaBody(), require('./login'));

}


/** exports **/

exports.setup = setup;

