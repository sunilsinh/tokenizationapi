/**
 * User registration with hashing
 */

var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

// Import user model
var User = require("../user/User");
var jwt = require("jsonwebtoken");
// bcryptjs for hashing password
var bcrypt = require("bcryptjs");
// for supersecret
var config = require("../config");
// require verifyToken
var VerifyToken = require('./VerifyToken');



/**
 * User registration with hashing
 */

router.post("/registration", (req, res) =>{
	var hashPassword = bcrypt.hashSync(req.body.password, 8);
	User.create({
		name : req.body.name,
		email: req.body.email,
		password:hashPassword
	},
	(err, userdata)=>{
		if(err){
			common(res, 500,"Unable to save data", null);
		} else {
			sendResponse(res, 200,"Successfully added data", userdata);
		}
	});
});

/**
 * Get all the user's information
 */
router.get("/getusers",(req,res) =>{
	User.find({},(err,data)=>{
		if(err){
			sendResponse(res, 500, "something went wrong", null);
		} else {
			sendResponse(res, 200, "fetch all data", data);
		}
	});
});

/**
 * login with user details
 */

router.post("/login",(req, res)=>{
	User.findOne({
	 email:req.body.email,
	}, (err, data)=>{
		if(err) sendResponse(res, 500, "something went wrong", null); 
		if(!data) sendResponse(res, 401, "Unable to fetch data", null);	
		var passwordIsValid = bcrypt.compareSync(req.body.password, data.password);
	    if (!passwordIsValid){
	    	sendResponse(res, 401, "Authentication failed", null);
	    } else {
	    	// sendResponse(res, 200, "users data", data);
	    	// Generate token
	    	var token = jwt.sign({
	    		id:data._id,
	    		email:data.email
	    		}, config.secret,{
	    		expiresIn: 86400 // expires in 24 hours
	    	});
	    	
	    	sendResponse(res, 200, "Generated token", {token: token});
	    }
	});
});
router.get('/me', VerifyToken, function(req, res, next) {
	  User.findById(req.userId, { password: 0 }, function (err, user) {
	    if (err) return res.status(500).send("There was a problem finding the user.");
	    if (!user) return res.status(404).send("No user found.");
	    
	    res.status(200).send(user).end();
	  });
});
/**
 * Destroy the token
 * 
 * @param req
 * @param res
 * @returns
 */
router.get('/logout', function(req, res) {
  sendResponse(res, 200, "Token destroyed", {token: null})
  
});

/**
 * 
 * @param res
 * @param status
 * @param message
 * @param data
 * @returns
 */

function sendResponse(res = null, status = "", message = "", data="" ){
	return res.status(status).json({
		status: status,
		message: message,
		data:data
	}).end();
}










module.exports = router;