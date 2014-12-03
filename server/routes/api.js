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
        res.send({result: false});
    } else {
        users.getUsersFromTo(req.params.from, req.params.to, function (err, result) {
            if (err)
                res.send({result: [], success: false});
            else if (result)
                res.send({result: result, success: true});
            else
                res.send({result: [], success: false});
        });
    }
};

exports.userCount = function (req, res) {
    users.getUserCount(function (err, result) {
        if (err || !result)
            res.send({result: 0, success: false});
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
    if (req.params.oldPassword == undefined || req.params.newPassword == undefined || req.user == undefined) {
        res.send({result: false});
    } else {
        users.changePassword(req.params.oldPassword, req.params.newPassword, req.user.email, function (err, result) {
            if (err)
                res.send({result: false, success: false});
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
        res.send({result: false});
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
    if (req.params.email == undefined) {
        res.send({result: false});
    } else {
        users.registerUser(req.body.email, req.body.password, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send({result: true});
            else
                res.send({result: false});
        });
    }
};

//Remove Manager Privileges
exports.removeManagerPrivileges = function (req, res) {
    if (req.params.id == undefined) {
        res.send({result: false});
    } else {
        users.removeManagerPrivileges(req.params.id, function (err, result) {
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
exports.grantManagerPrivileges = function (req, res) {
    if (req.params.id == undefined) {
        res.send({result: false});
    } else {
        users.grantManagerPrivileges(req.params.id, function (err, result) {
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
exports.getAllManagers = function (req, res) {
    users.getAllManagers(function (err, result) {
        if (err)
            res.send({result: false});
        else if (result)
            res.send(result);
        else
            res.send({result: false});
    });
};

//Get Users With Similar Emails
exports.getSimilarEmailUsers = function (req, res) {
    if (req.params.input == undefined) {
        res.send({result: false});
    } else {
        users.getSimilarEmailUsers(req.params.input, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
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
        products.addToFavorites(req.params.id, req.user.userid, function (err, result) {
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
        products.getFavorites(req.user.userid, function (err, result) {
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
    if (req.params.productid == undefined || req.user == undefined) {
        res.send({result: false});
    } else {
        products.removeProductFromFavorites(req.params.productid, req.user.userid, function (err, result) {
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
    if (req.params.input == undefined) {
        res.send({result: false});
    } else {
        products.getSimilarProducts(req.params.input, function (err, result) {
            if (err)
                res.send(err);
            else
                res.send(result);
        });
    }
};

//edit user email
exports.updateUserEmail = function (req, res) {
    if (req.params.email == undefined || req.user == undefined) {
        res.send({result: false});
    } else {
        users.updateUserEmail(req.user.userid, req.params.email, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
};

//send new password to user
exports.forgotPassword = function (req, res) {
    if (req.params.email == undefined) {
        res.send({result: false, message: 'Please supply email'});
    } else {
        users.forgotPassword(req.params.email, function (err, result) {
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
    if (req.params.id == undefined) {
        res.send({result: false});
    } else {
        editrequests.findById(req.params.id, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
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
    if (req.params.edittype == undefined) {
        res.send({result: false});
    } else {
        editrequests.findByEditType(req.params.edittype, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
};

exports.requestsByManagerId = function (req, res) {
    if (req.params.id == undefined) {
        res.send({result: false});
    } else {
        editrequests.getManagerEdits(req.params.id, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
};

exports.approveRequest = function (req, res) {
    if (req.params.id == undefined || req.user == undefined) {
        res.send({result: false});
    } else {
        editrequests.approveRequest(req.user.userid, req.params.id, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
};

exports.rejectRequest = function (req, res) {
    if (req.params.id == undefined || req.user == undefined) {
        res.send({result: false});
    } else {
        editrequests.rejectRequest(req.user.userid, req.params.id, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
};

exports.getEditsOfProduct = function (req, res) {
    if (req.params.product == undefined) {
        res.send({result: false});
    } else {
        editrequests.getEditsOfProduct(req.params.product, function (err, result) {
            if (err)
                res.send({result: false});
            else if (result)
                res.send(result);
            else
                res.send({result: false});
        });
    }
};

exports.favoriteProductsById = function (req, res) {
    if (req.params.id == undefined) {
        res.send({result: false});
    } else {
        favoriteProducts.findById(req.params.id, function (err, result) {
            if (err)
                res.send({result: false});
            else
                res.send(result);
        });
    }
};
//Get the category product from DB


exports.categories = function (req, res) {
    categories.getAllCategories(function (err, result) {
        if (err)
            res.send({result: false});
        else if (result)
            res.send(result);
        else
            res.send({result: false});
    });
};

exports.categoryById = function (req, res) {
    if (req.params.id == undefined) {
        res.send({result: false});
    } else {
        categories.findById(req.params.id, function (err, result) {
            if (err)
                res.send({result: false});
            else
                res.send(result);
        });
    }
};

