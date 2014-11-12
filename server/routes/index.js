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
	
	app.get('/p/:name', function(req,res) {
		var name = req.params.name;
		res.render('p/' + name);
	});
	
	app.get('/api/users/all', api.users);
	app.get('/api/users/id/:id', api.userById);
	app.get('/api/users/email/:email', api.userByEmail);
	app.get('/api/users/login/:email/:password', api.checkLogin);
	app.get('/api/users/exists/:email',api.userExists);
	app.get('/api/users/register/:email/:password', api.registerUser);
	app.get('/api/products/all', api.products);
	app.get('/api/products/view', api.someProducts);
	app.get('/api/products/id/:id', api.productById);
	app.get('/api/editrequests/all', api.editrequests);
	app.get('/api/editrequests/date', api.requestsByDate);
	app.get('/api/editrequests/type/:edittype', api.requestsByEditType);
	
	app.get('*', function(req, res){
		res.render('index');
	});
	
	//----------- POSTS -----------//
	app.post('/actions/user/signup', passport.authenticate("local-signup"), 
		function(req, res) {
			res.send(req.user);
		});
	
	app.post('/actions/user/signin', passport.authenticate("local-signin"), 
		function(req, res) {
			console.log("logged in");
			res.send(req.user);
		});
}

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated())
		return next();
	
	res.sendStatus(401);
}
