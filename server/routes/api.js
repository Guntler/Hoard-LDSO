var users = require('../database/users');
var products = require('../database/products');
var editrequests = require('../database/editrequests');
var favoriteProducts = require('../database/favoriteProducts');
var categories = require('../database/categories');
var preferences = require('../database/preferences');

//IMPORTANT
//change this so it doesn't send the passwords and redirects if the user isn't logged in
//Get all users from the DB
exports.users = function (req, res) {
    users.getAllUsers(function (err, result) {
        if (err)
            res.send({result: [], message: "Error on retrieving the users.", success: false});
        else
            res.send({result: result, message: "Success on retrieving the users.", success: true});
    });
};

//Returns all the users for pagination purposes.
exports.usersFromTo = function (req, res) {
    if (req.params.from == undefined || req.params.to == undefined) {
        res.send({result: false, message: "Please supply the required fields.", success: false});
    } else {
        users.getUsersFromTo(req.params.from, req.params.to, req.query.filterBy, req.query.value, req.query.search, function (err, result) {
            if (err)
                res.send({result: [], message: "Error on retrieving the users for pagination.", success: false, err: err});
            else if (result)
                res.send({result: result, message: "Success on retrieving the users for pagination.", success: true});
            else
                res.send({result: [], message: "Something went wrong.", success: false});
        });
    }
};

//Returns the total number of users in the database.
exports.userCount = function (req, res) {
    users.getUserCount(req.query.filterBy, req.query.value, req.query.search, function (err, result) {
        if (err || !result) {
            res.send({result: null, message: "Error on retrieving the total numbers of users.", success: false, err: err});
		}
        else
            res.send({result: result, message: "Success on retrieving the total numbers of users.", success: true});
    });
};


//Returns a user with a specific id.
exports.userById = function (req, res) {
    if (req.params.id == undefined) {
        res.send({result: false, message: ['Please supply the required field.'], success: false});
    } else {
        users.findById(req.params.id, function (err, result) {
            if (err)
                res.send({result: null, message: "Error on retrieving the desired user.", success: false});
            else
                res.send({result: result, message: "Success on retrieving the desired user.", success: true});
        });
    }
};

//Returns a user with a specific email.
exports.userByEmail = function (req, res) {
    if (req.params.email == undefined) {
        res.send({result: false, message: ['Please supply the required field.'], success: false});
    } else {
        users.findByEmail(req.params.email, function (err, result) {
            if (err)
                res.send({result: null, message: "Error on retrieving the desired user.", success: false});
            else
                res.send({result: result, message: "Success on retrieving the desired user.", success: true});
        });
    }
};

//Checks if a user with a specific email and password exists.
exports.checkLogin = function (req, res) {
    if (req.params.email == undefined || req.params.password == undefined) {
        res.send({result: false, message: "Please supply the required fields.", success: false});
    } else {
        users.checkLogin(req.params.email, req.params.password, function (err, result) {
            if (err)
                res.send({result: false, message: "Error on checking the login.", success: false});
            else if (result)
                res.send({result: true, message: "Login successfully checked.", success: true});
            else
                res.send({result: false, message: "Something went wrong.", success: true});
        });
    }
};

//Changes the password of a specific user.
exports.changePassword = function (req, res) {
    if (req.body.oldPassword == undefined || req.body.newPassword == undefined || req.user == undefined) {
        res.send({result: false, message: "Please supply the required fields.", success: false});
    } else {
        users.changePassword(req.body.oldPassword, req.body.newPassword, req.user.email, function (err, result) {
            if (err) {
                res.send({result: false, message: "Error on changing the user's password.", success: false});
			}
            else if (result)
                res.send({result: true, message: "Success on changing the user's password.", success: true});
            else
                res.send({result: false, message: "Something went wrong.", success: true});
        });
    }
};

//Check if a user exists.
exports.userExists = function (req, res) {
    if (req.params.email == undefined) {
        res.send({result: false, message: ['Please supply the required field.'], success: false});
    } else {
        users.findByEmail(req.params.email, function (err, result) {
            if (err)
                res.send({result: false, message: "Error on checking the user's existence.", success: false});
            else if (result)
                res.send({result: true, message: "Success on checking the user's existence.", success: true});
            else
                res.send({result: false, message: "Something went wrong.", success: true});
        });
    }
};

//Registers a new user.
exports.registerUser = function (req, res) {
    if (req.body.email == undefined) {
        res.send({result: false, message: "Please supply the required field.", success: false});
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
                    res.send({result: false, message: "Something went wrong.", success: true});
        });
    }
};

//Changes the privileges of a specific user.
exports.changePrivileges = function (req, res) {
    if (req.params.id == undefined) {
        res.send({result: false, message: "Please supply the required field.", success: false});
    } else {
		if(req.query.permission != "User" && req.query.permission != "Manager" && req.query.permission != "Admin")
			res.send({result: false, success: false});
		else {
			users.changePrivileges(req.params.id, req.query.permission, function (err, result) {
				if (err)
					res.send({result: false, message: "Error on changing the user's privileges.", success: false});
				else if (result)
					res.send({result: true, message: "Success on changing the user's privileges.", success: true});
				else
					res.send({result: false, message: "Something went wrong.", success: true});
			});
		}
    }
};


//Returns all the users with manager privileges.
exports.getAllManagers = function (req, res) {
    users.getAllManagers(function (err, result) {
        if (err)
            res.send({result: [], message: "Error on retrieving all the managers.",success: false});
        else if (result)
            res.send({result: result, message: "Success on retrieving all the managers.", success: true});
        else
            res.send({result: [], message: "Something went wrong.", success: true});
    });
};

//Returns all the users with similar fields to the ones provided.
exports.getSimilarFieldUsers = function (req, res) {
    if (req.params.field == undefined || req.params.input == undefined) {
        res.send({result: false, message: "Please supply the required field.", success:false});
    } else {
        users.getSimilarFieldUsers(req.params.field, req.params.input, function (err, result) {
            if (err)
                res.send({result: [], message: "Error on searching users.", success: false});
            else if (result)
                res.send({result: result, message: "Success on searching users.", success: true});
            else
                res.send({result: [], message: "Something went wrong.", success: true});
        });
    }
};

//Returns all the products.
exports.products = function (req, res) {
    products.getAllProducts(function (err, result) {
        if (err)
            res.send({result: [], message: "Error on retrieving products.", success: false});
        else if (result)
            res.send({result: result, message: "Success on retrieving products.",success: true});
        else
            res.send({result: [], message: "Something went wrong.", success: true});
    });
};

//Returns the total number of products.
exports.productCount = function (req, res) {
    products.getProductCount(req.query.search, function (err, result) {
        if (err || !result)
            res.send({result: null, message: "Error on retrieving the total numbers of products.", success: false});
        else
            res.send({result: result, message: "Success on retrieving the total numbers of products.", success: true});
    });
};

//Adds a new product.
exports.newProduct = function (req, res) {
    if (req.body.name == undefined || req.body.link == undefined || req.body.category == undefined || req.body.imagename == undefined || req.body.imagecontents == undefined || req.user == undefined) {
        res.send({result: false, message: "Please supply the required fields.", success: false});
    } else {
        products.newProduct(req.body.name, req.body.link, req.body.imagename, req.body.category, req.body.imagecontents, req.user.userid, function (err, result){
            if (err) {
                res.send({result: false, message: "Error on inserting a new product.", success: false, err: err});
			}
            else if (result)
                res.send({result: true, message: "Success on inserting a new product.", success: true});
            else
                res.send({result: false, message: "Something went wrong.", success: true});
        });
    }
};

//Returns a specifiec number of products.
exports.viewProducts = function (req, res) {
    if (req.params.n == undefined) {
        products.getProducts(null, function (err, result) {
            if (err)
                res.send({result: [], message: "Error on retrieving all the products.", success: false});
            else if (result)
                res.send({result: result, message: "Success on retrieving all the products.", success: true});
            else
                res.send({result: [], message: "Something went wrong.", success: true});
        });
    } else {
        products.getProducts(req.params.n, function (err, result) {
            if (err)
                res.send({result: [], message: "Error on retrieving products.", success: false});
            else if (result)
                res.send({result: result, message: "Success on retrieving products.", success: true});
            else
                res.send({result: [], message: "Something went wrong.", success: true});
        });
    }
};

//Returns a specific interval of products for pagination purposes.
exports.productsFromTo = function (req, res) {
    if (req.params.from == undefined || req.params.to == undefined) {
        res.send({result: [], message: "Please supply the required field.", success: false});
    } else {
        products.getProductsFromTo(req.params.from, req.params.to, req.query.search, function (err, result) {
            if (err)
                res.send({result: [], message: "Error on retrieving products for pagination.", success: false, err: err});
            else if (result)
                res.send({result: result, message: "Success on retrieving products for pagination.", success: true});
            else
                res.send({result: [], message: "Something went wrong.", success: true});
        });
    }
};

//Returns a product with a specific id.
exports.productById = function (req, res) {
    if (req.params.id == undefined) {
        res.send({result: [], message: "Please supply the required field.", success: false});
    } else {
        products.findById(req.params.id, function (err, result) {
            if (err)
                res.send({result: null, message: "Error on retrieving the desired product.", success: false});
            else if (result)
                res.send({result: result, message: "Success on retrieving the desired product.", success: true});
            else
                res.send({result: [], message: "Something went wrong.", success: false});
        });
    }
};

//Adds a product to a user's favorites.
exports.addToFavorites = function (req, res) {
    if (req.params.productid == undefined || req.user == undefined) {
        res.send({result: false, message: "Please supply the required field.", success: false});
    } else {
        products.addToFavorites(req.params.productid, req.user.userid, function (err, result) {
            if (err)
                res.send({result: false, message: "Error on adding the desired product to the user's favorites.", success: false});
            else if (result)
                res.send({result: true, message: "Success on adding the desired product to the user's favorites.", success: true});
            else
                res.send({result: false, message: "Something went wrong.", success: true});
        });
    }
};

//Moves up a product on the user's favorites.
exports.favoriteUp = function (req, res) {
    if (req.params.productid == undefined || req.user == undefined) {
        res.send({result: false,  message: "Please supply the required fields.", success: false});
    } else {
        products.favoriteUp(req.user.id, req.params.productid, function (err, result) {
            if (err)
                res.send({result: false, message: "Error on moving the product on the user's favorites list.", success: false});
            else if (result)
                res.send({result: result, message: "Success on moving the product on the user's favorites list.", success: true});
            else
                res.send({result: false, message: "Something went wrong.", success: true});
        });
    }
};

//Moves down a product on the user's favorites.
exports.favoriteDown = function (req, res) {
    if (req.params.productid == undefined || req.user == undefined) {
        res.send({result: false,  message: "Please supply the required fields.", success: false});
    } else {
        products.favoriteDown(req.user.id, req.params.productid, function (err, result) {
            if (err)
                res.send({result: false, message: "Error on moving the product on the user's favorites list.", success: false});
            else if (result)
                res.send({result: result, message: "Success on moving the product on the user's favorites list.", success: true});
            else
                res.send({result: false, message: "Something went wrong.", success: true});
        });
    }
};

//Returns the user's favorites.
exports.getFavorites = function (req, res) {
    if (req.user == undefined) {
        res.send({result: [],  message: "Please supply the required field.", success: false, err: "User is not logged in."});
    } else {
        products.getFavorites(req.user.userid, function (err, result) {
            if (err)
                res.send({result: [], message: "Error on retrieving the user's favorites.", success: false, err: err});
            else if (result)
                res.send({result: result,  message: "Success on retrieving the user's favorites.", success: true});
            else
                res.send({result: [],  message: "Something went wrong.", success: true});
        });
    }
};

//Removes a product from the database.
exports.removeProduct = function (req, res) {
    if (req.params.id == undefined) {
        res.send({result: false,  message: "Please supply the required field.", success: true});
    } else {
        products.removeProduct(req.params.id, function (err, result) {
            if (err)
                res.send({result: false,  message: "Error on removing a product.", success: false});
            else if (result)
                res.send({result: result, message: "Success on removing a product.", success: true});
            else
                res.send({result: false,  message: "Something went wrong.", success: true});
        });
    }
};

//Removes a product from a user's favorites.
exports.removeProductFromFavorites = function (req, res) {
    if (req.params.productid == undefined || req.user == undefined) {
        res.send({result: false,  message: "Please supply the required fields.", success: false});
    } else {
        products.removeProductFromFavorites(req.params.productid, req.user.userid, function (err, result) {
            if (err)
                res.send({result: false,  message: "Error on removing a product from the user's favorites.", success: false});
            else if (result)
                res.send({result: true,  message: "Success on removing a product from the user's favorites.", success: true});
            else
                res.send({result: false,  message: "Something went wrong.", success: true});
        });
    }
};

//Returns the similar products to the search fields provided.
exports.getSimilarFieldProducts = function (req, res) {
    if (req.params.field == undefined || req.params.input == undefined) {
        res.send({result: [],  message: "Please supply the required fields.", success: false});
    } else {
        products.getSimilarFieldProducts(req.params.field, req.params.input, function (err, result) {
            if (err)
                res.send({result: false, message: "Error on the search on products.", success: false});
            else if (result)
                res.send({result: result, message: "Success on the search on products.", success: true});
            else
                res.send({result: false, message: "Something went wrong.", success: true});
        });
    }
};

//Updates the specified user's email.
exports.updateUserEmail = function (req, res) {
    if (req.params.email == undefined || req.user == undefined) {
        res.send({result: false,  message: "Please supply the required fields.", success: false});
    } else {
        users.updateUserEmail(req.user.userid, req.params.email, function (err, result) {
            if (err)
                res.send({result: false, message: "Error on updating the user's email.", success: false});
            else if (result)
                res.send({result: result, message: "Success on updating the user's email.", success: true});
            else
                res.send({result: false, message: "Something went wrong.", success: true});
        });
    }
};

//Sends a new password to a user.
exports.forgotPassword = function (req, res) {
    if (req.params.email == undefined) {
        res.send({result: false,  message: "Please supply the required field.", success: false});
    } else {
        users.forgotPassword(req.params.email, function (err, result) {
            if (err)
                res.send({result: false, message: "Error on the password recovery process.", success: false});
            else if (result)
                res.send({result: true, message: "Success on the password recovery process.", success: true});
            else
                res.send({result: false, message: "Something went wrong.", success: true});
        });
    }
};

//Returns a specified editrequest
exports.editById = function (req, res) {
    if (req.params.id == undefined) {
        res.send({result: null,  message: "Please supply the required fields.", success: false});
    } else {
        editrequests.findById(req.params.id, function (err, result) {
            if (err)
                res.send({result: null, message: "Error on retrieving the specified editrequest.", success: false});
            else if (result)
                res.send({result: result, message: "Success on retrieving the specified editrequest.", success: true});
            else
                res.send({result: null, message: "Something went wrong.", success: true});
        });
    }
};


//Returns all the editrequests.
exports.editrequests = function (req, res) {
    editrequests.getAllById(function (err, result) {
        if (err)
            res.send({result: [], message: "Error on retrieving all the editrequests.", success: false});
        else if (result)
            res.send({result: result, message: "Success on retrieving all the editrequests.", success: true});
        else
            res.send({result: [], message: "Something went wrong.", success: true});
    });
};

//Returns an interval of editrequests for pagination purposes.
exports.editsFromTo = function (req, res) {
    if (req.params.from == undefined || req.params.to == undefined) {
        res.send({result: [], message: "Please supply the required fields.", success: false});
    } else {
        editrequests.getEditsFromTo(req.params.from, req.params.to, req.query.filterBy, req.query.value, 
			function (err, result) {
				if (err)
					res.send({result: [], message: "Error on retrieving the editrequests for pagination.", success: false, err: err});
				else if (result)
					res.send({result: result, message: "Success on retrieving the editrequests for pagination.", success: true});
				else
					res.send({result: [], message: "Something went wrong.", success: true});
			});
    }
};

//Returns the number of all the editrequests.
exports.editCount = function (req, res) {
    editrequests.getEditCount(req.query.filterBy, req.query.value, function (err, result) {
        if (err || !result)
            res.send({result: null, message: "Error ou counting the total number of editrequests.", success: false, err: err});
        else
            res.send({result: result, message: "Success on couting the total number of editrequests.", success: true});
    });
};

//Returns all the editrequests ordered by date.
exports.requestsByDate = function (req, res) {
    editrequests.getAllByDate(function (err, result) {
        if (err)
            res.send({result: [], message: "Error on retrieving the edirequests ordered by date.", success: false});
        else if (result)
            res.send({result: result, message: "Success on retrieving the editrequests ordered by date.", success: true});
        else
            res.send({result: [], message: "Something went wrong.", success: true});
    });
};

//Returns all the editrequests of a specified type.
exports.requestsByEditType = function (req, res) {
    if (req.params.edittype == undefined) {
        res.send({result: [],  message: "Please supply the required field.", success: false});
    } else {
        editrequests.findByEditType(req.params.edittype, function (err, result) {
            if (err)
                res.send({result: [], message: "Error on retrieving all the editrequests of a specified type.", success: false});
            else if (result)
                res.send({result: result, message: "Success on retrieving all the editrequests of a specified type.", success: true});
            else
                res.send({result: [], message: "Something went wrong.", success: true});
        });
    }
};

//Returns all the editrequests of a specific manager.
exports.requestsByManagerId = function (req, res) {
    if (req.params.id == undefined) {
        res.send({result: [],  message: "Please supply the required field.", success: false});
    } else {
        editrequests.getManagerEdits(req.params.id, function (err, result) {
            if (err)
                res.send({result: [], message: "Error on retrieving all the edits of a specific manager.", success: false});
            else if (result)
                res.send({result: result, message: "Success on retrieving all the edits of a specific manager.", success: true});
            else
                res.send({result: [], message: "Something went wrong.", success: true});
        });
    }
};

//Insers a new editrequests.
exports.newRequest = function(req, res) {
    if (req.body.productid == undefined || req.user.userid == undefined || req.body.edittype == undefined || (req.body.edittype != "Add" && req.body.edittype != "Edit" && req.body.edittype != "Delete")) {
        res.send({result: false, message: "Please supply the required fields.", success: false});
    } else {
        editrequests.newRequest(req.body.productid, req.user.userid, req.body.edittype, req.body.reason, req.body.name, req.body.link, req.body.image, req.body.imagename, req.body.imagecontents, req.body.category, function (err, result) {
            if (err) {
                res.send({result: false, message: "Error on inserting a new editrequest.", success: false});
			}
            else if (result)
                res.send({result: true, message: "Success on inserting a new editrequest.", success: true});
            else
                res.send({result: false, message: "Something went wrong.", success: true});
        });
    }
};

//Approves a specific editrequest.
exports.approveRequest = function (req, res) {
    if (req.params.id == undefined || req.user == undefined) {
        res.send({result: false,  message: "Please supply the required fields.", success: false});
    } else {
        editrequests.approveRequest(req.user.userid, req.params.id, function (err, result) {
            if (err)
                res.send({result: false, message: "Error on approving an editrequest.", success: false});
            else if (result)
                res.send({result: true, message: "Success on approving an editrequest.", success: true});
            else
                res.send({result: false, message: "Something went wrong.", success: true});
        });
    }
};

//Rejects a specific editrequest
exports.rejectRequest = function (req, res) {
    if (req.params.id == undefined || req.user == undefined) {
        res.send({result: false,  message: "Please supply the required fields.", success: false});
    } else {
        editrequests.rejectRequest(req.user.userid, req.params.id, function (err, result) {
            if (err)
                res.send({result: false, message: "Error on rejecting an editrequest.", success: false});
            else if (result)
                res.send({result: true, message: "Success on rejecting an editrequest.", success: true});
            else
                res.send({result: false, message: "Something went wrong.", success: true});
        });
    }
};

//Returns all the editrequests of a product.
exports.getEditsOfProduct = function (req, res) {
    if (req.params.product == undefined) {
        res.send({result: [],  message: "Please supply the required field.", success: false});
    } else {
        editrequests.getEditsOfProduct(req.params.product, function (err, result) {
            if (err)
                res.send({result: [], message: "Error on retrieving all the editrequests of a product.", success: false});
            else if (result)
                res.send({result: result, message: "Success on retrieving all the editrequests of a product.", success: true});
            else
                res.send({result: [], message: "Something went wrong.", success: true});
        });
    }
};

//Returns the similar editrequests to the search fields provided.
exports.getSimilarFieldEdits = function (req, res) {
    if (req.params.field == undefined || req.params.input == undefined) {
        res.send({result: [], message: "Please supply the required field.", success: false});
    } else {
        editrequests.getSimilarFieldEdits(req.params.field, req.params.input, function (err, result) {
            if (err)
                res.send({result: false, message: "Error on searching the edirequests.", success: false});
            else if (result)
                res.send({result: result, message: "Success on searching the editrequests.", success: true});
            else
                res.send({result: false, message: "Something went wrong.", success: true});
        });
    }
};

//Returns the specified favorite product
exports.favoriteProductsById = function (req, res) {
    if (req.params.id == undefined) {
        res.send({result: [], message: "Please supply the required field.", success: false});
    } else {
        favoriteProducts.findById(req.params.id, function (err, result) {
            if (err)
                res.send({result: [], message: "Error on retrieving the favorite product.", success: false});
            else
                res.send({result: result, message: "Success on retrieving the favorite product.", success: true});
        });
    }
};

//Returns all the product categories.
exports.categories = function (req, res) {
    categories.getAllCategories(function (err, result) {
        if (err)
            res.send({result: [], message: "Error on retrieving all the categories from the database.", success: false});
        else if (result)
            res.send({result: result, message: "Success on retrieving all the categories from the database.", success: true});
        else
            res.send({result: [], message: "Something went wrong.", success: true});
    });
};

//Returns a specific product category.
exports.categoryById = function (req, res) {
    if (req.params.id == undefined) {
        res.send({result: null, message: "Please supply the required field.", success: false});
    } else {
        categories.findById(req.params.id, function (err, result) {
            if (err)
                res.send({result: null, message: "Error on retrieving the specified category .", success: false});
            else
                res.send({result: result, message: "Success on retrieving the specified category.", success: true});
        });
    }
};

//Returns a set of products according to the user's favorite products.
exports.getUserPreferences = function (req, res) {
    console.log("here");
    if (req.user == undefined) {
        res.send({result: null, message: "Please supply the required field.", success: false});
    } else {
        preferences.getPreferences(req.user.userid, function (err, result) {
            if (err)
                res.send({result: null, message: "Error on retrieving products according to the user's preferences.", success: false});
            else {
                console.log(result);
                res.send({result: result, message: "Success on retrieving products according to the user's preferences.", success: true});
            }
        });
    }
};

//States that a specific user has seen a specific product.
exports.addViewedProduct = function (req, res) {
    if (req.user == undefined || req.params.productid == undefined) {
        res.send({result: null, message: "Please supply the required fields.", success: false});
    } else {
        products.addViewedProduct(req.user.userid, req.params.productid, function (err, result) {
            if (err)
                res.send({result: null, message: "Error on adding entry to viewedProducts.", success: false});
            else
                res.send({result: result, message: "Success on adding entry to viewedProducts.", success: true});
        });
    }
};