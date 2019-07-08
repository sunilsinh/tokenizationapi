console.log("common js data");
var sendResponse = {};
sendResponse.setResponse = function(res = null, status = "", message = "", data="" ){
	return res.status(status).json({
		status: status,
		message: message,
		data:data
	}).end();
}

module.exports.common = sendResponse;