
var db = require('../../system/database');


function processItem(item, orders) {

	var order, transaction;
	var transactions, j, jlen;
	var count = 0;
	var users = {};

	for (var i = 0, len = orders.length; i < len; i += 1) {
		order = orders[i];
		transactions = order.data.items;

		for (j = 0, jlen = transactions.length; j < jlen; j += 1) {
			transaction = transactions[j];

			if (transaction.id === item.id) {
				count += transaction.amount;

				if (!users[order.userid]) {
					users[order.userid] = 0;
				}

				users[order.userid] += transaction.amount;
			}
		}
	}

	if (count > 0) {
		return {
			name: item.name,
			total: count,
			users: users
		};
	}

	return null;

}


function processMenu(menu, orders) {

	var processed = [];
	var thing;

	for (var i = 0, len = menu.length; i < len; i += 1) {
		item = menu[i];
		thing = processItem(item, orders);

		if (thing) {
			processed.push(thing);
		}
	}

	return processed;

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

	sql = 'SELECT * FROM orders WHERE userId IN (';
	var frag = [];
	params = [];

	for (var i = 0, len = users.length; i < len; i += 1) {
		frag.push('$' + (i + 1));
		params.push(users[i]);
	}

	sql += frag.join(',');
	sql += ')';

	results  = yield client.queryPromise(sql, params);
	var orders = results.rows;

	var sql = 'SELECT * FROM merchants WHERE uid = $1';

	var results = yield client.queryPromise(sql, [ merchantId ]);
	var merchant = results.rows.pop();
	var menu = merchant.data.menu;

	var items = processMenu(menu, orders);

	this.body.items = items;

	return yield next;

}


/** exports **/

module.exports = get;

