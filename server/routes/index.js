var api = require('./api');

module.exports = function (app, passport) {

    //----------- GETS ------------//
    app.get('/', function (req, res) {
        res.render('index.ejs');
    });

    app.get('/partials/user/:name', managerPermissions, function (req, res) {
        var name = req.params.name;
        res.render('partials/user/' + name, {user: req.user});
    });

    app.get('/partials/product/:name', managerPermissions, function (req, res) {
        var name = req.params.name;
        res.render('partials/product/' + name, {user: req.user});
    });
	
	app.get('/partials/edit/:name', managerPermissions, function (req, res) {
        var name = req.params.name;
        res.render('partials/edit/' + name, {user: req.user});
    });

    app.get('/partials/common/:name', managerPermissions, function (req, res) {
        var name = req.params.name;
        res.render('partials/common/' + name, {user: req.user});
    });

    app.get('/partials/:name', function (req, res) {
        var name = req.params.name;
        res.render('partials/' + name);
    });

	app.get('/api/categories/all',api.categories);
	app.get('/api/categories/id/:id',api.categoryById);

    app.get('/api/users/managers/all', adminApiPermissions, api.getAllManagers);
    app.get('/api/users/managers/add/:id', adminApiPermissions, api.grantManagerPrivileges);
    app.get('/api/users/managers/remove/:id', adminApiPermissions, api.removeManagerPrivileges);
    app.get('/api/users/similaremail/:input', adminApiPermissions, api.getSimilarEmailUsers);


    app.get('/api/users/all', adminApiPermissions, api.users);
    app.get('/api/users/id/:id', adminApiPermissions, api.userById);
    app.get('/api/users/email/:email', adminApiPermissions, api.userByEmail);
	app.get('/api/users/changePassword/:oldPassword/:newPassword', api.changePassword);
    app.get('/api/users/fromTo/:from/:to', adminApiPermissions, api.usersFromTo);
	app.get('/api/users/count', adminApiPermissions, api.userCount);
    app.get('/api/users/exists/:email', adminApiPermissions, api.userExists);
    app.get('/api/users/productsFromTo/:from/:to', managerApiPermissions, api.productsFromTo);
    app.get('/api/users/:id/favoriteProducts', adminApiPermissions, api.favoriteProductsById);
    app.get('/api/users/forgotPassword/:email', api.forgotPassword);
    app.get('/api/users/signout', function (req, res) {
        req.logout();
        res.send({result: true});
    });
    app.get('/api/users/current', function (req, res) {
        if (isLoggedIn(req)) {
            res.send    ({user: req.user});
        }
        else res.send({user: false});
    });
    app.get('/api/products/all', api.products);
    app.get('/api/products/viewProducts/:n', api.viewProducts);
    app.get('/api/products/viewProducts', api.viewProducts);
    app.get('/api/products/fromTo/:from/:to', managerApiPermissions, api.productsFromTo);
	app.get('/api/products/count', managerApiPermissions, api.productCount);
    app.get('/api/products/id/:id', api.productById);
    app.get('/api/products/getFavorites', api.getFavorites);
    app.get('/api/products/addToFavorites/:id', api.addToFavorites);
	app.get('/api/products/favoriteUp/:productid', api.favoriteUp);
	app.get('/api/products/favoriteDown/:productid', api.favoriteDown);
    app.get('/api/products/remove/:id', adminApiPermissions, api.removeProduct  );
    app.get('/api/products/similarname/:input', api.getSimilarProducts);
    
    app.get('/api/editrequests/byProduct/:product', adminApiPermissions, api.getEditsOfProduct);
    app.get('/api/editrequests/all', adminApiPermissions, api.editrequests);
	app.get('/api/editrequests/id/:id', adminApiPermissions, api.editById);
    app.get('/api/editrequests/fromTo/:from/:to', adminApiPermissions, api.editsFromTo);
	app.get('/api/editrequests/count', adminApiPermissions, api.editCount);
    app.get('/api/editrequests/approve/:id', adminApiPermissions, api.approveRequest)
    app.get('/api/editrequests/reject/:id', adminApiPermissions, api.rejectRequest)
    app.get('/api/editrequests/date', adminApiPermissions, api.requestsByDate);
    app.get('/api/editrequests/type/:edittype', adminApiPermissions, api.requestsByEditType);
    app.get('/api/editrequests/manager/:id', adminApiPermissions, api.requestsByManagerId);

    app.get('*', function (req, res) {
        res.render('index.ejs');
    });

    //----------- POSTS -----------//

    app.post('/api/users/signin', function (req, res, next) {
        passport.authenticate("local-signin", function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) 
                return res.send({message: req.flash('loginMessage'), user: null, success: true});
            else req.login(user, function (err) {
                if (err)
                    return next(err);
                res.send({user: user, message: req.flash('loginMessage'), success: true});
            });
        })(req, res, next);
    });
	
	app.post('/api/users/signin-app', function (req, res, next) {
        passport.authenticate("local-signin-app", function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) 
                return res.send({message: req.flash('loginMessage'), user: null, success: true});
            else req.login(user, function (err) {
                if (err)
                    return next(err);
                res.send({message: req.flash('loginMessage'), success: true});
            });
        })(req, res, next);
    });
	
	
    app.post('/api/users/register', api.registerUser);
}

function isLoggedIn(req) {
    if (req.isAuthenticated()) {
        return true;
    }

    return false;
}

function managerPermissions(req, res, next) {
    if (isLoggedIn(req)) {
        if (req.user.permissions === "Manager" || req.user.permissions === "Admin")
            return next();
    }

    res.sendStatus(401);
}

function managerApiPermissions(req, res, next) {
    if (isLoggedIn(req)) {
        if (req.user.permissions === "Manager" || req.user.permissions === "Admin")
            return next();
    }

    res.send({result: null, success: false});
}

function adminApiPermissions(req, res, next) {
    if (isLoggedIn(req)) {
        if (req.user.permissions === "Admin")
            return next();
    }
    res.send({result: null, success: false});
}
