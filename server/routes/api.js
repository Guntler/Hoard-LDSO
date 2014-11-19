var users = require('../database/users');
var products = require('../database/products');
var editrequests = require('../database/editrequests');
var favoriteProducts = require('../database/favoriteProducts');

//IMPORTANT
//change this so it doesn't send the passwords and redirects if the user isn't logged in
//Get all users from the DB
exports.users = function (req, res) {
    users.getAllUsers(function (err, result) {
        if (err)
            res.send(err);
        else
            res.send(result);
    });
};

//Get a user by id
exports.userById = function (req, res) {
    users.findById(req.params.id, function (err, result) {
        if (err)
            res.send(err);
        else
            res.send(result);
    });
};

//Get a user by email
exports.userByEmail = function (req, res) {
    users.findByEmail(req.params.email, function (err, result) {
        if (err)
            res.send(err);
        else
            res.send(result);
    });
};

//Check if a user with a specific email and pass exists
//IMPORTANT - Change to use hash instead of password
exports.checkLogin = function (req, res) {
    users.checkLogin(req.params.email, req.params.password, function (err, result) {
        if (err)
            res.send(err);
        else if (result)
            res.send({result: true});
        else
            res.send({result: false});
    });
};

//Check if a user exists
exports.userExists = function (req, res) {
    users.userByEmail(req.params.email, function (err, result) {
        if (err)
            res.send(err);
        else if (result)
            res.send({result: true});
        else
            res.send({result: false});
    });
};

//Register new user
exports.registerUser = function (req, res) {
    users.registerUser(req.params.email, req.params.password, function (err, result) {
        if (err)
            res.send({result: false});
        else if (result)
            res.send({result: true});
        else
            res.send({result: false});
    });
};

//Get all products from the DB
exports.products = function (req, res) {
    products.getAllProducts(function (err, result) {
        if (err)
            res.send({result: false});
        else if (result)
            res.send(result);
        else
            res.send({result: false});
    });
};

exports.productCount = function (req, res) {
	products.getProductCount(function(err, result) {
		if(err || !result)
			res.send({result: false});
		else
			res.send(result);
	});
}

exports.viewProducts = function (req, res) {
    if (req.params.n == undefined) {
        products.getProducts(null, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    } else {
        products.getProducts(req.params.n, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
};

exports.viewProductsFromTo = function (req, res) {
    if (req.params.from == undefined || req.params.to == undefined) {
        res.send({result: false});
    } else {
        products.getProductsFromTo(req.params.from, req.params.to, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
};


exports.productById = function (req, res) {
    products.findById(req.params.id, function (err, result) {
        if (err)
            res.send(err);
        else
            res.send(result);
    });
};

//Get all EditRequest from the DB
exports.editrequests = function (req, res) {
    editrequests.getAllById(function (err, result) {
        if (err)
            res.send({result: false});
        else if (result)
            res.send(result);
        else
            res.send({result: false});
    });
};

exports.requestsByDate = function (req, res) {
    editrequests.getAllByDate(function (err, result) {
        if (err)
            res.send({result: false});
        else if (result)
            res.send(result);
        else
            res.send({result: false});
    });
};

exports.requestsByEditType = function (req, res) {
    editrequests.findByEditType(req.params.edittype, function (err, result) {
        if (err)
            res.send({result: false});
        else if (result)
            res.send(result);
        else
            res.send({result: false});
    });
};

exports.requestsByManagerId = function (req, res) {
    editrequests.getManagerEdits(req.params.id, function (err, result) {
        if (err)
            res.send({result: false});
        else if (result)
            res.send(result);
        else
            res.send({result: false});
    });
};



//New edit request
//Approve edit request
//Refuse edit request
//Get a Product's edits
//Get all FavoriteProducts of a User
//Get the category product from DB

exports.favoriteProductsById = function (req, res) {

    favoriteProducts.findById(req.params.id, function (err, result) {
        if (err)
            res.send(err);
        else
            res.send(result);
    });


}
//Get the category product from DB

