

function *auth(id, secret, next) {

	return yield next;

}



/** exports **/

exports.auth = auth;

