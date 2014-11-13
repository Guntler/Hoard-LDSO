var api = require('./api');

module.exports = function(app, passport) {

	//----------- GETS ------------//
	app.get('/', function(req, res){
		res.render('index');
	});
	
	app.get('/p/user/:name', managerPermissions, function (req, res) {
		var name = req.params.name;
		res.render('p/user/' + name, {user: req.user});
	});
	
	app.get('/p/product/:name', managerPermissions, function(req, res) {
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
	app.get('/api/users/checklogin/:email/:password', api.checkLogin);
	app.get('/api/users/exists/:email',api.userExists);
	app.get('/api/users/register/:email/:password', api.registerUser);
	app.get('/api/products/all', api.products);
	app.get('/api/products/view', api.someProducts);
	app.get('/api/products/id/:id', api.productById);
	app.get('/api/users/signout', function(req, res){
		req.logout();
		res.send({result: true});
	});
	
	app.get('*', function(req, res){
		res.render('index');
	});
	
	//----------- POSTS -----------//
										
	app.post('/api/users/signin', function(req,res,next) {
										passport.authenticate("local-signin", function(err, user, info) {
											console.log("hi");
											if(err)
												return next(err);
											if(!user) {
												console.log("here");
												return res.send({message: req.flash('loginMessage'), user: false});
											}
											else req.login(user, function(err) {
												if(err)
													return next(err);
													
												res.send({user: user, message: req.flash('loginMessage')});
											});
										})(req,res,next);
									});
}

function isLoggedIn(req) {
	if(req.isAuthenticated()) {
		return true;
	}
		
	return false;
}

function managerPermissions(req, res, next) {
	if(isLoggedIn(req)) {
		if(req.user.permissions === "Manager" || req.user.permissions === "Admin")
			return next();
	}

	res.sendStatus(401);
}
