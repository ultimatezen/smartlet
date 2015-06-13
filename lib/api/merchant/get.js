/**
 * @file merchant/get API handler
 */


var db = require('../../system/database');


/**
 * @function merchant#get
 * @desc Get merchants
 *
 * @param {string[]} ids - merchant ids
 * @return {object[]} merchants - merchants
 */
function *get(next) {

	var body = this.request.query;
	var ids = body.ids;
	ids = [ 'test' ];

	var client = db.get();
	var sql = 'SELECT * FROM merchants WHERE uid IN (';

	var frag = [];

	for (var i = 1, len = ids.length; i <= len; i += 1) {
		frag.push('$' + i);
	}

	sql += frag.join(',');
	sql += ')';

	var results = yield client.queryPromise(sql, ids);
	var merchants = results.rows;

	this.body = {
		code: 200,
		merchants: merchants
	};

	return yield next;

}


/** exports **/

module.exports = get;

