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

	var body = this.request.body;
	var ids = body.ids;

	if (!ids || !ids.length) {
		this.body.merchants = [];
		return yield next;
	}

	var client = db.get();
	//var sql = 'SELECT uid AS id, data FROM merchants WHERE uid IN (';
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
		merchants: merchants
	};

	return yield next;

}


/** exports **/

module.exports = get;

