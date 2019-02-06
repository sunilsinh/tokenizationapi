var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('./User');

// CREATES A NEW USER
router.post('/', function (req, res) {
    User.create({
            name : req.body.name,
            email : req.body.email,
            password : req.body.password
        }, 
        function (err, user) {
            if (err) return res.status(500).send("There was a problem adding the information to the database.");
            res.status(200).send(user);
        });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
    User.find({}, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: "+ user.name +" was deleted.");
    });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
});

router.post('/userlogin',function(req, res){
	
	User.find({
		email: req.body.email,
		password: req.body.password
	}, function(err,data){
		if(err){
			res.status(500).json({
				status: 500,
				message:`Something went wrong`+err,
				data : null
				
			}).end();
		} else {
			res.status(200).json({
				status: 200,
				message:"successfully data recieved",
				data: data
			}).end();
		}
		
	});
});

router.post("/registration",(req, res)=>{
	var hashedPassword = bcrypt.hashSync(req.body.password, 8);
	User.create({
		name:req.body.name,
		email:req.body.email,
		password: req.body.password
	}, (err, data)=>{
		if(err){
			res.status(500).json({
				status: 500,
				message:`Something went wrong ${err}`,
				data: null
			}).end();
		} else {
			res.status(200).json({
				status: 200,
				message:"data successfully added",
				data: data
			}).end();
		}
	});
})


module.exports = router;