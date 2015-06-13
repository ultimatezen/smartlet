
var db = require('../../system/database');


function processItem(item, orders) {

	var order, transaction;
	var transactions, j, jlen;
	var count = 0;
	var users = {};
	var costs = {};

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

				if (!costs[order.userid]) {
					costs[order.userid] = 0;
				}

				costs[order.userid] += transaction.amount * item.price;
				users[order.userid] += transaction.amount;
			}
		}
	}

	if (count > 0) {
		return {
			name: item.name,
			price: item.price,
			users: users,
			costs: costs
		};
	}

	return null;

}


function getTotals(userId, lines) {

	var user = 0;
	var check = 0;
	var costs;

	for (var i = 0, len = lines.length; i < len; i += 1) {
		costs = lines[i].costs;

		for (var key in costs) {
			if (key === userId) {
				user += costs[key];
			}

			check += costs[key];
		}

		delete lines[i].costs;
	}

	return {
		user: user,
		check: check
	};

}


function processMenu(userId, menu, orders) {

	var processed = [];
	var thing;
	var userCost;

	for (var i = 0, len = menu.length; i < len; i += 1) {
		item = menu[i];
		thing = processItem(item, orders);

		if (thing) {
			processed.push(thing);
		}
	}

	var totals = getTotals(userId, processed);

	var data = {
		total: totals.user,
		checkTotal: totals.check,
		items: processed
	};

	return data;

}


function *get(next) {

	var body = this.request.body;
	var merchantId = body.merchantId;
	var tableId = body.tableId;
	var userId = body.userId;

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

	var data = processMenu(userId, menu, orders);

	this.body = data;

	return yield next;

}


/** exports **/

module.exports = get;

