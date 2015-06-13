

var db = require('../../../system/database');


function *close(next) {

	var body = this.request.body;
	var merchantId = body.merchantId;
	var tableId = body.tableId;
	var userId = body.userId;
	var receipt = body.receipt;

	var client = db.get();

	var sql = 'UPDATE orders SET status = $1 WHERE tableId = $2 AND userId = $3 AND status = $4 RETURNING id';
	var params = [ 'closed', tableId, userId, 'open' ];

	console.log('sql', sql)
	console.log('params', params)
	var results = yield client.queryPromise(sql, params);

	var result = results.rows.pop();

	if (!result) {
		return yield next;
	}

	sql = 'INSERT INTO receipts (orderId, data) VALUES ($1, $2)';
	params = [ result.id, receipt ];

	yield client.queryPromise(sql, params);

	return yield next;

}


/** exports **/

module.exports = close;

