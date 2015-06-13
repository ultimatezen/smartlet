/**
 * @file test/get API handler
 */


var db = require('../../system/database');


/**
 * @function test#get
 * @desc placeholder
 *
 * @param {string} test - test
 * @return {object} test - test
 */
function *get(next) {

	var body = this.request.query;

	var client = db.get();
	var sql = 'SELECT * FROM users WHERE id = $1';
	var results = yield client.queryPromise(sql, [ 1 ]);

	console.log('resutls', results.rows);
	var test = {
		test: 'test'
	};

	this.body = {
		code: 200,
		test: test
	};

	return yield next;

}


/** exports **/

module.exports = get;

