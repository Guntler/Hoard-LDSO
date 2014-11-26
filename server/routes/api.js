var users = require('../database/users');
var products = require('../database/products');
var editrequests = require('../database/editrequests');
var favoriteProducts = require('../database/favoriteProducts');
var categories = require('..//database//categories');

//IMPORTANT
//change this so it doesn't send the passwords and redirects if the user isn't logged in
//Get all users from the DB
exports.users = function (req, res) {
    users.getAllUsers(function (err, result) {
        if (err)
            res.send({result: false});
        else
            res.send(result);
    });
};

//Get users paginated
exports.usersFromTo = function (req, res) {
    if (req.params.from == undefined || req.params.to == undefined) {
        res.send({result: false});
    } else {
        users.getUsersFromTo(req.params.from, req.params.to, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
};

exports.userCount = function (req, res) {
    users.getUserCount(function (err, result) {
        if (err || !result)
            res.send({result: false});
        else
            res.send(result);
    });
};


//Get a user by id
exports.userById = function (req, res) {
    users.findById(req.params.id, function (err, result) {
        if (err)
            res.send({result: false});
        else
            res.send(result);
    });
};

//Get a user by email
exports.userByEmail = function (req, res) {
    users.findByEmail(req.params.email, function (err, result) {
        if (err)
            res.send({result: false});
        else
            res.send(result);
    });
};

//Check if a user with a specific email and pass exists
//IMPORTANT - Change to use hash instead of password
exports.checkLogin = function (req, res) {
    users.checkLogin(req.params.email, req.params.password, function (err, result) {
        if (err)
            res.send({result: false});
        else if (result)
            res.send({result: true});
        else
            res.send({result: false});
    });
};

exports.changePassword = function (req, res) {
    users.changePassword(req.params.oldPassword, req.params.newPassword, req.user.email, function (err, result) {
        if (err)
            res.send({result: false});
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
            res.send({result: false});
        else if (result)
            res.send({result: true});
        else
            res.send({result: false});
    });
};

//Register new user
exports.registerUser = function (req, res) {
    users.registerUser(req.body.email, req.body.password, function (err, result) {
        if (err)
            res.send({result: false});
        else if (result)
            res.send({result: true});
        else
            res.send({result: false});
    });
};

//Remove Manager Privileges
exports.removeManagerPrivileges = function (req,res) {
    if (req.params.id == undefined) {
        res.send({result: false});
    } else {
        users.removeManagerPrivileges(req.params.id, function(err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
};

//Grant Manager Privileges
exports.grantManagerPrivileges = function (req,res) {
    if (req.params.id == undefined) {
        res.send({result: false});
    } else {
        users.grantManagerPrivileges(req.params.id, function(err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
};


//Get All Managers 
exports.getAllManagers = function (req,res) {
    users.getAllManagers(function(err, result) {
        if (err)
            res.send({result: false});
        else if (result)
            res.send(result);
        else
            res.send({result: false});
    });
};

//Get Users With Similar Emails
exports.getSimilarEmailUsers = function (req,res) {
    users.getSimilarEmailUsers(req.params.input, function(err, result) {
        if (err)
            res.send({result: false});
        else if (result)
            res.send(result);
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
    products.getProductCount(function (err, result) {
        if (err || !result)
            res.send({result: false});
        else
            res.send(result);
    });
};

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

exports.productsFromTo = function (req, res) {
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
            res.send({result: false});
        else
            res.send(result);
    });
};

exports.addToFavorites = function (req, res) {
    if (req.params.id == undefined || req.user == undefined) {
        res.send({result: false});
    } else {
        products.addToFavorites(req.params.id, req.user.id, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
};

exports.favoriteUp = function (req, res) {
    if (req.params.productid == undefined || req.user == undefined) {
        res.send({result: false});
    } else {
        products.favoriteUp(req.user.id, req.params.productid, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
};
exports.favoriteDown = function (req, res) {
    if (req.params.productid == undefined || req.user == undefined) {
        res.send({result: false});
    } else {
        products.favoriteDown(req.user.id, req.params.productid, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
};

exports.getFavorites = function (req, res) {
    if (req.user == undefined) {
        res.send({result: false});
    } else {
        products.getFavorites(req.user.id, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
};

exports.removeProduct = function (req, res) {
    if (req.params.id == undefined) {
        res.send({result: false});
    } else {
        products.removeProduct(req.params.id, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
};

exports.removeProductFromFavorites = function (req, res) {
    if (req.params.productid == undefined || req.user ==  undefined) {
		res.send({result: false});
    } else {
        products.removeProductFromFavorites(req.params.productid, req.user.id, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
};

exports.getSimilarProducts = function (req, res) {
    products.getSimilarProducts(req.params.input, function (err, result) {
        if (err)
            res.send(err);
        else
            res.send(result);
    });
};

//edit user email
exports.updateUserEmail = function(req, res)
{	
	if (req.params.email == undefined || req.user ==  undefined) {
		res.send({result: false});
    } else {
        users.updateUserEmail(req.user.id, req.params.email, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
};

exports.editById = function (req, res) {
    editrequests.findById(req.params.id, function (err, result) {
        if (err)
            res.send({result: false});
        else if (result)
            res.send(result);
        else
            res.send({result: false});
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

//Get edit requests paginated
exports.editsFromTo = function (req, res) {
    if (req.params.from == undefined || req.params.to == undefined) {
        res.send({result: false});
    } else {
        editrequests.getEditsFromTo(req.params.from, req.params.to, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
};

exports.editCount = function (req, res) {
    editrequests.getEditCount(function (err, result) {
        if (err || !result)
            res.send({result: false});
        else
            res.send(result);
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

exports.approveRequest = function (req, res) {
    editrequests.approveRequest(req.user.id, req.params.id, function (err, result) {
        if (err)
            res.send({result: false});
        else if (result)
            res.send(result);
        else
            res.send({result: false});
    });
};

exports.rejectRequest = function (req, res) {
    editrequests.rejectRequest(req.user.id, req.params.id, function (err, result) {
        if (err)
            res.send({result: false});
        else if (result)
            res.send(result);
        else
            res.send({result: false});
    });
};

exports.getEditsOfProduct = function (req,res) {
    editrequests.getEditsOfProduct(req.params.product, function(err, result) {
        if (err)
            res.send({result: false});
        else if (result)
            res.send(result);
        else
            res.send({result: false});
    });
};

exports.favoriteProductsById = function (req, res) {

    favoriteProducts.findById(req.params.id, function (err, result) {
        if (err)
            res.send({result: false});
        else
            res.send(result);
    });


};
//Get the category product from DB


exports.categories = function(req,res) {
	categories.getAllCategories(function (err, result) {
        if (err)
            res.send({result: false});
        else if (result)
            res.send(result);
        else
            res.send({result: false});
    });
}

exports.categoryById = function(req,res) {
	categories.findById(function (err, result) {
        if (err)
            res.send({result: false});
        else if (result)
            res.send(result);
        else
            res.send({result: false});
    });
}

