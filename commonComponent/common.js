const rendResponse  = function sendResposne(res = null, status = "", message = "", data="" ){
	return res.status(status).json({
		status: status,
		message: message,
		data:data
	});
}

module.exports.common = rendResponse();