/**
 * User model schema with validation
 */
var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
	name : {
		type : String,
		required : [ true, " name is required" ]
	},
	email : {
		type : String,
		required : [ true, "email is required" ]
	},
	password : {
		type : String,
		required : [ true, "password is required" ]
	}
});

mongoose.model("authusers",UserSchema);
module.exports = mongoose.model("authusers");
