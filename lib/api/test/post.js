/**
 * @file test#post API handler
 */


var session = require('../../system/session');


/**
 * @function test#post
 * @desc placeholder
 *
 * @param {string} test - test
 * @return {object} test - test
 */
function *post(next) {

	var body = this.request.body;

	var test = {
		test: 'test'
	};

	this.body = {
		code: 200,
		test: test
	};

	session.set('test', test);

	return yield next;

}


/** exports **/

module.exports = post;

