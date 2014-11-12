var users = require('../api/users');
var products = require('../api/products');
var favoriteProducts =  require('../api/favoriteProducts');
var productsCategory =  require('../api/productCategory');
//IMPORTANT
//change this so it doesn't send the passwords and redirects if the user isn't logged in
//Get all users from the DB
exports.users = function(req, res){
	users.getAll(function(err, result) {
		if(err)
			res.send(err);
		else 
			res.send(result);
	});
};

//Get a user by id
exports.userById = function(req, res){
	users.findById(req.params.id, function(err, result) {
		if(err)
			res.send(err);
		else 
			res.send(result);
	});
};

//Get a user by email
exports.userByEmail = function(req, res){
	users.findByEmail(req.params.email, function(err, result) {
		if(err)
			res.send(err);
		else 
			res.send(result);
	});
};

//Check if a user with a specific email and pass exists
//IMPORTANT - Change to use hash instead of password
exports.checkLogin = function(req, res){
	users.checkLogin(req.params.email, req.params.password, function(err, result) {
		if(err)
			res.send(err);
		else if (result)
			res.send({result: true});
		else
			res.send({result: false});
	});
};

//Check if a user exists
exports.userExists = function(req, res){
	users.userByEmail(req.params.email, function(err, result) {
		if(err)
			res.send(err);
		else if (result)
			res.send({result: true});
		else
			res.send({result: false});
	});
};

//Register new user
exports.registerUser = function(req, res){
	users.registerUser(req.params.email, req.params.password, function(err, result) {
		if(err)
			res.send({result: false});
		else if(result)
			res.send({result: true});
		else
			res.send({result: false});
	});
};

//Get all products from the DB
exports.products = function(req, res){
	products.getAll(function(err, result) {
		if(err)
			res.send({result: false});
		else if(result)
			res.send(result);
		else
			res.send({result: false});
	});
};

exports.someProducts = function(req, res){
	products.getSomeProducts(function(err, result) {
		if(err)
			res.send({result: false});
		else if(result)
			res.send(result);
		else
			res.send({result: false});
	});
};


exports.productById = function(req, res){
	products.findById(req.params.id, function(err, result) {
		if(err)
			res.send(err);
		else 
			res.send(result);
	});
};
	
//Get all EditRequest from the DB
//Get all FavoriteProducts of a User 
exports.favoriteProductsById = function(req,res){

favoriteProducts.findById(req.params.id, function(err, result) {
		if(err)
			res.send(err);
		else 
			res.send(result);
	});



}
//Get the category product from DB

