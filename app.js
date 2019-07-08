var express = require('express');
var app = express();
var db = require('./db');
//var AuthController = require('./auth/AuthController');
var UserController = require('./user/UserController');
app.use('/api/auth', UserController);
module.exports = app;


module.exports = app;