var users = require('../database/users');
var products = require('../database/products');
var editrequests = require('../database/editrequests');
var favoriteProducts = require('../database/favoriteProducts');
var categories = require('../database/categories');

//IMPORTANT
//change this so it doesn't send the passwords and redirects if the user isn't logged in
//Get all users from the DB
exports.users = function (req, res) {
    users.getAllUsers(function (err, result) {
        if (err)
            res.send({result: [], success: false});
        else
            res.send({result: result, success: true});
    });
};

//Get users paginated
exports.usersFromTo = function (req, res) {
    if (req.params.from == undefined || req.params.to == undefined) {
        res.send({result: false, success: false});
    } else {
        users.getUsersFromTo(req.params.from, req.params.to, req.query.filterBy, req.query.value, req.query.search, function (err, result) {
            if (err)
                res.send({result: [], success: false, err: err});
            else if (result)
                res.send({result: result, success: true});
            else
                res.send({result: [], success: false});
        });
    }
};

exports.userCount = function (req, res) {
    users.getUserCount(req.query.filterBy, req.query.value, req.query.search, function (err, result) {
        if (err || !result) {
            res.send({result: null, success: false, err: err});
		}
        else
            res.send({result: result, success: true});
    });
};


//Get a user by id
exports.userById = function (req, res) {
    users.findById(req.params.id, function (err, result) {
        if (err) 
            res.send({result: null, success:false});
        else
            res.send({result: result, success:true});
    });
};

//Get a user by email
exports.userByEmail = function (req, res) {
    if (req.params.email == undefined) {
        res.send({result: false});
    } else {
        users.findByEmail(req.params.email, function (err, result) {
            if (err)
                res.send({result: null, success: false});
            else
                res.send({result: result, success: true});
        });
    }
};

//Check if a user with a specific email and pass exists
//IMPORTANT - Change to use hash instead of password
exports.checkLogin = function (req, res) {
    if (req.params.email == undefined || req.params.password == undefined) {
        res.send({result: false});
    } else {
        users.checkLogin(req.params.email, req.params.password, function (err, result) {
            if (err)
                res.send({result: false, success: false});
            else if (result)
                res.send({result: true, success: true});
            else
                res.send({result: false, success: true});
        });
    }
};

exports.changePassword = function (req, res) {
    if (req.body.oldPassword == undefined || req.body.newPassword == undefined || req.user == undefined) {
        res.send({result: false, success: false});
    } else {
        users.changePassword(req.body.oldPassword, req.body.newPassword, req.user.email, function (err, result) {
            if (err) {
                res.send({result: false, success: false});
			}
            else if (result)
                res.send({result: true, success: true});
            else
                res.send({result: false, success: true});
        });
    }
};

//Check if a user exists
exports.userExists = function (req, res) {
    if (req.params.email == undefined) {
        res.send({result: false, success: false});
    } else {
        users.findByEmail(req.params.email, function (err, result) {
            if (err)
                res.send({result: false, success: false});
            else if (result)
                res.send({result: true, success: true});
            else
                res.send({result: false, success: true});
        });
    }
};

//Register new user
exports.registerUser = function (req, res) {
    if (req.body.email == undefined) {
        res.send({result: false, success: false});
    } else {
        users.registerUser(req.body.email, req.body.password, function (err, result) {
            if (err)
                if (err.code == "23505")
                    res.send({result: false, message: "That email is already in use.", success: true});
                else
                    res.send({result: false, message: "Something went wrong.", success: false});
            else 
                if (result)
                    res.send({result: true, message: "You've successfully registered.", success: true});
                else
                    res.send({result: false, message: "Something went wrong.", success: false});
        });
    }
};

//Remove Manager Privileges
exports.changePrivileges = function (req, res) {
    if (req.params.id == undefined) {
        res.send({result: false, success: false});
    } else {
		if(req.query.permission != "User" && req.query.permission != "Manager" && req.query.permission != "Admin")
			res.send({result: false, success: false});
		else {
			users.changePrivileges(req.params.id, req.query.permission, function (err, result) {
				if (err)
					res.send({result: false, success: false});
				else if (result)
					res.send({result: true, success: true});
				else
					res.send({result: false, success: true});
			});
		}
    }
};


//Get All Managers 
exports.getAllManagers = function (req, res) {
    users.getAllManagers(function (err, result) {
        if (err)
            res.send({result: [], success: false});
        else if (result)
            res.send({result: result, success: true});
        else
            res.send({result: [], success: true});
    });
};

//Get Users With Similar Emails
exports.getSimilarFieldUsers = function (req, res) {
    if (req.params.field == undefined || req.params.input == undefined) {
        res.send({result: false});
    } else {
        users.getSimilarFieldUsers(req.params.field, req.params.input, function (err, result) {
            if (err)
                res.send({result: [], success: false});
            else if (result)
                res.send({result: result, success: true});
            else
                res.send({result: [], success: true});
        });
    }
};

//Get all products from the DB
exports.products = function (req, res) {
    products.getAllProducts(function (err, result) {
        if (err)
            res.send({result: [], success: false});
        else if (result)
            res.send({result: result, success: true});
        else
            res.send({result: [], success: true});
    });
};

exports.productCount = function (req, res) {
    products.getProductCount(req.query.search, function (err, result) {
        if (err || !result)
            res.send({result: null, success: false});
        else
            res.send({result: result, success: true});
    });
};

exports.newProduct = function (req, res) {
    if (req.body.name == undefined || req.body.link == undefined || req.body.category == undefined || req.body.imagename == undefined || req.body.imagecontents == undefined || req.user == undefined) {
        res.send({result: false, success: false});
    } else {
        products.newProduct(req.body.name, req.body.link, req.body.imagename, req.body.category, req.body.imagecontents, req.user.userid, function (err, result){
            if (err) {
                res.send({result: false, success: false, err: err});
			}
            else if (result)
                res.send({result: true, success: true});
            else
                res.send({result: false, success: true});
        });
    }
};

exports.viewProducts = function (req, res) {
    if (req.params.n == undefined) {
        products.getProducts(null, function (err, result) {
            if (err)
                res.send({result: [], success: false});
            else if (result)
                res.send({result: result, success: true});
            else
                res.send({result: [], success: true});
        });
    } else {
        products.getProducts(req.params.n, function (err, result) {
            if (err)
                res.send({result: [], success: false});
            else if (result)
                res.send({result: reslut, success: true});
            else
                res.send({result: [], success: true});
        });
    }
};

exports.productsFromTo = function (req, res) {
    if (req.params.from == undefined || req.params.to == undefined) {
        res.send({result: [], success: false});
    } else {
        products.getProductsFromTo(req.params.from, req.params.to, req.query.search, function (err, result) {
            if (err)
                res.send({result: [], success: false, err: err});
            else if (result)
                res.send({result: result, success: true});
            else
                res.send({result: [], success: true});
        });
    }
};


exports.productById = function (req, res) {
    products.findById(req.params.id, function (err, result) {
        if (err)
            res.send({result: null, success: false});
        else
            res.send({result: result, success: true});
    });
};

exports.addToFavorites = function (req, res) {
    if (req.params.id == undefined || req.user == undefined) {
        res.send({result: false, success: false});
    } else {
        products.addToFavorites(req.params.id, req.user.userid, function (err, result) {
            if (err)
                res.send({result: false, success: false});
            else if (result)
                res.send({result: result, success: true});
            else
                res.send({result: false, success: true});
        });
    }
};

exports.favoriteUp = function (req, res) {
    if (req.params.productid == undefined || req.user == undefined) {
        res.send({result: false, success: false});
    } else {
        products.favoriteUp(req.user.id, req.params.productid, function (err, result) {
            if (err)
                res.send({result: false, success: false});
            else if (result)
                res.send({result: result, success: true});
            else
                res.send({result: false, success: true});
        });
    }
};

exports.favoriteDown = function (req, res) {
    if (req.params.productid == undefined || req.user == undefined) {
        res.send({result: false, success: false});
    } else {
        products.favoriteDown(req.user.id, req.params.productid, function (err, result) {
            if (err)
                res.send({result: false, success: false});
            else if (result)
                res.send({result: result, success: true});
            else
                res.send({result: false, success: true});
        });
    }
};

exports.getFavorites = function (req, res) {
    if (req.user == undefined) {
        res.send({result: [], success: false});
    } else {
        products.getFavorites(req.user.userid, function (err, result) {
            if (err)
                res.send({result: [], success: false});
            else if (result)
                res.send({result: result, success: true});
            else
                res.send({result: [], success: true});
        });
    }
};

exports.removeProduct = function (req, res) {
    if (req.params.id == undefined) {
        res.send({result: false, success: true});
    } else {
        products.removeProduct(req.params.id, function (err, result) {
            if (err)
                res.send({result: false, success: false});
            else if (result)
                res.send({result: result, success: true});
            else
                res.send({result: false, success: true});
        });
    }
};

exports.removeProductFromFavorites = function (req, res) {
    if (req.params.productid == undefined || req.user == undefined) {
        res.send({result: false, success: false});
    } else {
        products.removeProductFromFavorites(req.params.productid, req.user.userid, function (err, result) {
            if (err)
                res.send({result: false, success: false});
            else if (result)
                res.send({result: result, success: true});
            else
                res.send({result: false, success: true});
        });
    }
};

exports.getSimilarFieldProducts = function (req, res) {
    if (req.params.field == undefined || req.params.input == undefined) {
        res.send({result: [], success: false});
    } else {
        products.getSimilarFieldProducts(req.params.field, req.params.input, function (err, result) {
            if (err)
                res.send({result: false, success: false});
            else if (result)
                res.send({result: result, success: true});
            else
                res.send({result: false, success: true});
        });
    }
};

//edit user email
exports.updateUserEmail = function (req, res) {
    if (req.params.email == undefined || req.user == undefined) {
        res.send({result: false, success: false});
    } else {
        users.updateUserEmail(req.user.userid, req.params.email, function (err, result) {
            if (err)
                res.send({result: false, success: false});
            else if (result)
                res.send({result: result, success: true});
            else
                res.send({result: false, success: true});
        });
    }
};

//send new password to user
exports.forgotPassword = function (req, res) {
    if (req.params.email == undefined) {
        res.send({result: false, message: ['Please supply email'], success: false});
    } else {
        users.forgotPassword(req.params.email, function (err, result) {
            if (err)
                res.send({result: false, success: false});
            else if (result)
                res.send({result: true, success: true});
            else
                res.send({result: false, success: true});
        });
    }
};

exports.editById = function (req, res) {
    if (req.params.id == undefined) {
        res.send({result: null, success: false});
    } else {
        editrequests.findById(req.params.id, function (err, result) {
            if (err)
                res.send({result: null, success: false});
            else if (result)
                res.send({result: result, success: true});
            else
                res.send({result: null, success: true});
        });
    }
};


//Get all EditRequest from the DB
exports.editrequests = function (req, res) {
    editrequests.getAllById(function (err, result) {
        if (err)
            res.send({result: [], success: false});
        else if (result)
            res.send({result: result, success: true});
        else
            res.send({result: [], success: true});
    });
};

//Get edit requests paginated
exports.editsFromTo = function (req, res) {
    if (req.params.from == undefined || req.params.to == undefined) {
        res.send({result: [], success: false});
    } else {
        editrequests.getEditsFromTo(req.params.from, req.params.to, req.query.filterBy, req.query.value, 
			function (err, result) {
				if (err)
					res.send({result: [], success: false, err: err});
				else if (result)
					res.send({result: result, success: true});
				else
					res.send({result: [], success: true});
			});
    }
};

exports.editCount = function (req, res) {
    editrequests.getEditCount(req.query.filterBy, req.query.value, function (err, result) {
        if (err || !result)
            res.send({result: null, success: false, err: err});
        else
            res.send({result: result, success: true});
    });
};


exports.requestsByDate = function (req, res) {
    editrequests.getAllByDate(function (err, result) {
        if (err)
            res.send({result: [], success: false});
        else if (result)
            res.send({result: result, success: true});
        else
            res.send({result: [], success: true});
    });
};

exports.requestsByEditType = function (req, res) {
    if (req.params.edittype == undefined) {
        res.send({result: [], success: false});
    } else {
        editrequests.findByEditType(req.params.edittype, function (err, result) {
            if (err)
                res.send({result: [], success: false});
            else if (result)
                res.send({result: result, success: true});
            else
                res.send({result: [], success: true});
        });
    }
};

exports.requestsByManagerId = function (req, res) {
    if (req.params.id == undefined) {
        res.send({result: [], success: false});
    } else {
        editrequests.getManagerEdits(req.params.id, function (err, result) {
            if (err)
                res.send({result: [], success: false});
            else if (result)
                res.send({result: result, success: true});
            else
                res.send({result: [], success: true});
        });
    }
};

exports.newRequest = function(req, res) {
    if (req.body.productid == undefined || req.user.userid == undefined || req.body.edittype == undefined || (req.body.edittype != "Add" && req.body.edittype != "Edit" && req.body.edittype != "Delete")) {
        res.send({result: false, success: false});
    } else {
        editrequests.newRequest(req.body.productid, req.user.userid, req.body.edittype, req.body.reason, req.body.name, req.body.link, req.body.image, req.body.imagename, req.body.imagecontents, req.body.category, function (err, result) {
            if (err) {
                res.send({result: false, success: false});
			}
            else if (result)
                res.send({result: true, success: true});
            else
                res.send({result: false, success: true});
        });
    }
};

exports.approveRequest = function (req, res) {
    if (req.params.id == undefined || req.user == undefined) {
        res.send({result: false, success: false});
    } else {
        editrequests.approveRequest(req.user.userid, req.params.id, function (err, result) {
            if (err)
                res.send({result: false, success: false});
            else if (result)
                res.send({result: true, success: true});
            else
                res.send({result: false, success: true});
        });
    }
};

exports.rejectRequest = function (req, res) {
    if (req.params.id == undefined || req.user == undefined) {
        res.send({result: false, success: false});
    } else {
        editrequests.rejectRequest(req.user.userid, req.params.id, function (err, result) {
            if (err)
                res.send({result: false, success: false});
            else if (result)
                res.send({result: true, success: true});
            else
                res.send({result: false, success: true});
        });
    }
};

exports.getEditsOfProduct = function (req, res) {
    if (req.params.product == undefined) {
        res.send({result: [], success: false});
    } else {
        editrequests.getEditsOfProduct(req.params.product, function (err, result) {
            if (err)
                res.send({result: [], success: false});
            else if (result)
                res.send({result: result, success: true});
            else
                res.send({result: [], success: true});
        });
    }
};

exports.getSimilarFieldEdits = function (req, res) {
    if (req.params.field == undefined || req.params.input == undefined) {
        res.send({result: [], success: false});
    } else {
        editrequests.getSimilarFieldEdits(req.params.field, req.params.input, function (err, result) {
            if (err)
                res.send({result: false, success: false});
            else if (result)
                res.send({result: result, success: true});
            else
                res.send({result: false, success: true});
        });
    }
};

exports.favoriteProductsById = function (req, res) {
    if (req.params.id == undefined) {
        res.send({result: [], success: false});
    } else {
        favoriteProducts.findById(req.params.id, function (err, result) {
            if (err)
                res.send({result: [], success: false});
            else
                res.send({result: result, success: true});
        });
    }
};
//Get the category product from DB


exports.categories = function (req, res) {
    categories.getAllCategories(function (err, result) {
        if (err)
            res.send({result: [], success: false});
        else if (result)
            res.send({result: result, success: true});
        else
            res.send({result: [], success: true});
    });
};

exports.categoryById = function (req, res) {
    if (req.params.id == undefined) {
        res.send({result: null, success: false});
    } else {
        categories.findById(req.params.id, function (err, result) {
            if (err)
                res.send({result: null, success: false});
            else
                res.send({result: result, success: true});
        });
    }
};

