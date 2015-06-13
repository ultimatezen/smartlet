/**
 * @file auth/login API handler
 */


var crypto = require('crypto');
var db = require('../../system/database');
var session = require('../../system/session');
var auth = require('./auth');


/**
 * @function auth/login
 * @desc Login a user
 *
 * @param {string} email - user email
 * @param {string} password - user password
 * @return {number} code - status code
 * @return {object} user - user info { id, name, group_id }
 */
function *login(next) {

	// grab all params and create hash from password
	var body = this.request.body;
	var name = body.name;
	var id = body.id;
	var secret = body.secret;

	var sql = 'SELECT * FROM users WHERE id = ?';
	var params = [ id ];

	var client = db.get();
	var rows = yield client.query(sql, params).rows;
	var result = rows.pop();

	if (!result) {
		this.body.code = 500;
		return yield next;
	}

	var user = {
		id: id,
		name: name,
		secret: secret
	};

	this.body = {
		code: 200
	};

	session.set(secret, user);

	return yield next;

}


/** exports **/

module.exports = login;

