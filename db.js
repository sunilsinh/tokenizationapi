var mongoose = require('mongoose');
var mongodbUrl = "mongodb://sunilsj:Guddu123!@ds153869.mlab.com:53869/sunilsjapp";
mongoose.connect(mongodbUrl,  { useNewUrlParser: true });

mongoose.connection.on("connected", function(){
	console.log("mongoose database connected with " + mongodbUrl);
});
mongoose.connection.on("error", function(err){
	console.log("Unable to connect with " +mongodbUrl + "error are"+ err);
})
