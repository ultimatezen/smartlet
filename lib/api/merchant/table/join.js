/**
 * @file merchant/table/join API handler
 */


var db = require('../../../system/database');

/**
 * @function merchant/table#join
 * @desc Join table
 *
 * @param {string[]} ids - merchant ids
 * @return {object[]} merchants - merchants
 */
function *join(next) {

	var body = this.request.body;
	var userId = body.userId;
	var merchantId = body.merchantId;
	var tableId = body.tableId;

	var client = db.get();
	var sql = 'SELECT * FROM tables WHERE merchantId = $1 AND uid = $2';
	var params = [ merchantId, tableId ];

	var results = yield client.queryPromise(sql, params);
	var result = results.rows.pop();
	var table = result.data;
	var users = table.users;

	if (users.indexOf(userId) === -1) {
		users.push(userId);
	}

	sql = 'UPDATE tables SET data = $1 WHERE merchantId = $2 AND uid = $3';
	params = [ table, merchantId, tableId ];

	yield client.queryPromise(sql, params);

	this.body = {
		code: 200
	};

	return yield next;

}


/** exports **/

module.exports = join;

