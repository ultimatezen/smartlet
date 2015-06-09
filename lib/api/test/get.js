/**
 * @file test/get API handler
 */


var session = require('../../system/session');


/**
 * @function test#get
 * @desc placeholder
 *
 * @param {string} test - test
 * @return {object} test - test
 */
function *get(next) {

	var body = this.request.query;

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

module.exports = get;

