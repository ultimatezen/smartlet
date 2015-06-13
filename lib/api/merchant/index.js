/**
 * @file Entry point for test api
 */


var koaBody = require('koa-body');


function setup(router) {

	router.get('/merchant/get', require('./get'));

}


/** exports **/

exports.setup = setup;

