

function getTimestamp() {

	var timestamp = Math.floor(Date.now() / 1000);
	return timestamp;

}


/** exports **/

exports.getTimestamp = getTimestamp;

