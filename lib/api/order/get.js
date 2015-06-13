
var db = require('../../system/database');


function buildOrders() {

}

function *get(next) {

	var body = this.request.body;
	var merchantId = body.merchantId;
	var tableId = body.tableId;

	var client = db.get();

	var sql = 'SELECT * FROM tables WHERE merchantId = $1 AND uid = $2';
	var params = [ merchantId, tableId ];

	var results = yield client.queryPromise(sql, params);
	var result = results.rows.pop();
	var table = result.data;
	var users = table.users;

	if (!users.length) {
		this.body = { orders: [] };
		return yield next;
	}

	sql = 'SELECT * FROM orders userId IN (';
	var frag = [];
	params = [];

	for (var i = 0, len = users.length; i < len; i += 1) {
		frag.push('$' + (i + 1));
		params.push(users[i]);
	}

	sql += frag.join(',');
	sql += ')';


	results  = yield client.queryPromist(sql, params);
	var orders = results.rows;

	console.log('orders', orders);


	return yield next;

}


/** exports **/

module.exports = get;

