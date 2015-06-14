
var db = require('../../../system/database');


function getMenuMap(menu) {

	var menuMap = {};

	for (var i = 0, len = menu.length; i < len; i += 1) {
		item = menu[i];
		menuMap[item.id] = item;
	}

	return menuMap;

}


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


function processCheck(merchant, orders) {

	orders = orders.data.items;
	var check = {};
	var menuMap = getMenuMap(merchant.data.menu);
	var rows = [];
	var item, menuItem, price, desc, amount, total;
	var checkTotal = 0;

	for (var i = 0, len = orders.length; i < len; i += 1) {
		item = orders[i];
		menuItem = menuMap[item.id];
		price = menuItem.price;
		amount = item.amount;
		desc = menuMap[item.id].name + ' x ' + amount;
		total = price * amount;
		checkTotal += total;

		line = {
			desc: desc,
			price: price,
			total: total
		};

		rows.push(line);
	}

	var ppInfo = {
		description: 'Payment for ' + merchant.data.name,
		amount: {
			total: checkTotal,
			currency: 'JPY',
			details: {
				subtotal: checkTotal,
				tax: 0,
				shipping: 0
			}
		}
	};

	check.total = checkTotal;
	check.lines = rows;
	check.ppInfo = ppInfo;

	return check;

}


function *get(next) {

	var body = this.request.body;
	var merchantId = body.merchantId;
	var tableId = body.tableId;
	var userId = body.userId;

	var client = db.get();

	var sql = 'SELECT * FROM orders WHERE userId = $1';
	var params = [ userId ];

	results  = yield client.queryPromise(sql, params);
	var orders = results.rows.pop();

	sql = 'SELECT * FROM merchants WHERE uid = $1';
	params = [ merchantId ];

	var results = yield client.queryPromise(sql, params);
	var merchant = results.rows.pop();

	var check = processCheck(merchant, orders);

	this.body.check = check;

	return yield next;

}


/** exports **/

module.exports = get;

