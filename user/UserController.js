var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var bcrypt = require("bcryptjs");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./User');
var jwt = require("jsonwebtoken");
var sendResponse = require('../commonComponent/./common').common;
// for supersecret
var config = require("../config");
// require verifyToken
var VerifyToken = require('../auth/./VerifyToken');
/**	
 * Add new user data
 */
router.post("/registration",(req, res)=>{
	
	userAvailability(req,res)
	.then((userData)=>{
		if(userData==null){
			var hashedPassword = bcrypt.hashSync(req.body.password, 8);
			User.create({
				name:req.body.name,
				email:req.body.email,
				password: hashedPassword
			},(err, data)=>{
				if(err){
					sendResponse.setResponse(res,500,`Something went wrong ${err}`,data);
				} else {
					sendResponse.setResponse(res,200,`Data successfully added`,data);
				}
			});

		}else{
			sendResponse.setResponse(res,404,`User already exist`);
		
		}
	});
		
		
	
});


// RETURNS ALL THE USERS IN THE DATABASE
router.get('/getallusers', function (req, res) {
    User.find({}, function (err, data) {
        if (err){
			sendResponse.setResponse(res,500,"There was a problem finding the users.");
		} else {
			sendResponse.setResponse(res,200,`All users data`,data);
		}
    });
});
// GETS A SINGLE USER FROM THE DATABASE
router.get('/getuserbyid/:id', function (req, res) {
    User.findById(req.params.id, function (err, data) {
        if (err) return sendResponse.setResponse(res,500,"There was a problem finding the users.");
        if (!user) return sendResponse.setResponse(res,404,"User not found");
		sendResponse.setResponse(res,200,`Single users data`,data);
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/deleteuserbyid/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, data) {
        if (err) return sendResponse.setResponse(res,500,"There was a problem finding the users.");
		sendResponse.setResponse(res,200,`User ${data.name} was deleted`);
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/updateuserbyid/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, data) {
        if (err) return sendResponse.setResponse(res,500,"There was a problem to update user's data.");
		sendResponse.setResponse(res,200,`Updated user's data`,data);
    });
});

router.post('/userlogin',function(req, res){
	User.findOne({
		//email:req.body.email,
		email:req.body.email
	   }, (err, data)=>{
		   if(err) {
			sendResponse.setResponse(res, 500, "something ss went wrong", null);
			   return;
		   } 
		   if(!data){
			sendResponse.setResponse(res, 401, "Unable to fetch data", null);	
			   return;
		   }
		   var passwordIsValid = bcrypt.compareSync(req.body.password, data.password);
		   if (!passwordIsValid){
			sendResponse.setResponse(res, 401, "Authentication failed", null);
		   } else {
			   // sendResponse(res, 200, "users data", data);
			   // Generate token
			   var token = jwt.sign({
				   id:data._id,
				   email:data.email
				   }, config.secret,{
				   expiresIn: 86400 // expires in 24 hours
			   });
			   
			   sendResponse.setResponse(res, 200, "Generated token", {token: token});
		   }
	   });
});

router.get('/verifytoken', VerifyToken, function(req, res, next) {
	
	User.findById(req.userId, { password: 0 }, function (err, data) {
	  if (err) return sendResponse.setResponse(res,500,"There was a problem to finding user's data.");
	  if (!user) return sendResponse.setResponse(res,404,"Opps, no user found");
	  sendResponse.setResponse(res, 200, "Verified user", data);
	});
});

/**
 * Check user availability
 * Date : 08 july 2019
 */

 const userAvailability = (req,res)=>{
	 
	return User.findOne({
		"email":req.body.email
	}).then((data)=>{
		return data;
		//sendResponse.setResponse(res, 200, `${req.body.email} Email id already exist`);
	}, (err)=>{
		throw new Error(`Something went wrong ${err.message}`);
	});
}




module.exports = router;