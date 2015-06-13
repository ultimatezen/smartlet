
var db = require('../../system/database');
var utils = require('../../system/utils');


function getNewOrder(items) {

	var order = {
		items: items
	};

	return order;

}


function addItems(order, items, timestamp) {

	var transactions = order.transactions;
	var transaction;

	items.forEach(function (item) {
		transaction = { timestamp: timestamp, id: item.id, amount: item.amount };
		transactions.push(transaction);
	});

	return order;

}


function *place(next) {

	var body = this.request.body;
	var userId = body.userId;
	var merchantId = body.merchantId;
	var tableId = body.tableId;
	var items = body.items;

	if (!items || !items.length) {
		return yield next;
	}

	var client = db.get();
	var sql = 'SELECT * FROM orders WHERE merchantId = $1 AND tableId = $2 AND userId = $3 AND status = $4';
	var params = [ merchantId, tableId, userId, 'open' ];

	var results = yield client.queryPromise(sql, params);
	var result = results.rows.pop();
	var order;

	if (!result) {
		order = getNewOrder(items);

		sql = 'INSERT INTO orders (merchantId, tableId, userId, data, status) VALUES ($1, $2, $3, $4, $5)';
		params = [ merchantId, tableId, userId, order, 'open' ];
		return yield client.queryPromise(sql, params);
	}

	order = result.data;
	order.items = items;

	sql = 'UPDATE orders SET data = $1 WHERE merchantId = $2 AND tableId = $3 AND userId = $4';
	params = [ order, merchantId, tableId, userId ];

	yield client.queryPromise(sql, params);

	return yield next;

}


/** exports **/

module.exports = place;

