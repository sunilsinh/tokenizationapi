var jwt = require("jsonwebtoken");
var config = require("../config");
function verifyToken(req, res,next){
	var token = req.headers['x-access-token'];
	if(!token){
		res.status(403).json({
			auth:false, message:"no token provided."
		}).end();
	}
	jwt.verify(token, config.secret, (err, decoded)=>{
		if(err){
			return res.status(500).json({
				auth:false,
				message:"failed to authenticate token."
			});
			} else {
				// if everythig is correct
				req.userId = decoded.id;
				console.log(decoded);
				next();
						
		}
	})
}
module.exports = verifyToken;