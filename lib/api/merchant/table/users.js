
var db = require('../../../system/database');


function *users(next) {

	var client = db.get();
	var body = this.request.body;
	var merchantId = body.merchantId;
	var tableId = body.tableId;

	var sql = 'SELECT * FROM tables WHERE merchantId = $1 AND uid = $2';
	var params = [ merchantId, tableId ];

	var results = yield client.queryPromise(sql, params);
	var result = results.rows.pop();
	var table = result.data;
	var users = table.users;

	var sql = 'SELECT uid, data FROM users WHERE uid IN (';

	var frag = [];
	params = [];

	for (var i = 0, len = users.length; i < len; i += 1) {
		frag.push('$' + (i + 1));
		params.push(users[i]);
	}

	sql += frag.join(',');
	sql += ')';

	var results = yield client.queryPromise(sql, params);
	users = results.rows;

	this.body = {
		code: 200,
		users: users
	};

	return yield next;

}


/** exports **/

module.exports = users;

