/*var express = require('express');
var routes = require('./routes');

var routeController = express.Router();

routeController.get('/', routes.index);
routeController.get('/p/user/:name', routes.userpages);
routeController.get('/p/product/:name', routes.productpages);
routeController.get('/api/users', api.users);
routeController.get('*', routes.index);

exports.router = routeController;*/

var api = require('./api');

module.exports = function(app, passport) {

	//----------- GETS ------------//
	app.get('/', function(req, res){
		res.render('index');
	});
	
	app.get('/p/user/:name', isLoggedIn, function (req, res) {
		var name = req.params.name;
		res.render('p/user/' + name, {user: req.user});
	});
	
	app.get('/p/product/:name', isLoggedIn, function(req, res) {
		var name = req.params.name;
		res.render('p/product/' + name, {user: req.user});
	});
	
	app.get('/api/users/all', api.users);
	app.get('/api/users/id/:id', api.userById);
	app.get('/api/users/email/:email', api.userByEmail);
	app.get('/api/users/login/:email/:password', api.checkLogin);
	app.get('/api/users/exists/:email',api.userExists);
	app.get('/api/users/register/:email/:password', api.registerUser);
	
	app.get('*', function(req, res){
		res.render('index');
	});
	
	//----------- POSTS -----------//
	
}

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated())
		return next();
		
	res.redirect('/');
}
