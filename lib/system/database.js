/**
 * @module database
 * @desc Some wrapper logic for pooling mysql connections
 */


var co = require('co');
var pg = require('co-pg')(require('pg'));
 
var config = require('config');
var dbCfg = config.db.postgres;

var connectionString = 'postgres://' + dbCfg.user + ':' + dbCfg.password + '@' + dbCfg.host + '/' + dbCfg.database;
var client, done;


function *connect(next) {

	try {

		var connectionResults = yield pg.connectPromise(connectionString);
		client = connectionResults[0];
		done = connectionResults[1];

	} catch(ex) {
		console.error(ex.toString());
	}

}


function get() {
	return client;
}


/** exports **/

exports.connect = connect;
exports.get = get;

