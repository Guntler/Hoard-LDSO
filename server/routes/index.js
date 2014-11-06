var express = require('express');
var routes = require('./routes');
var api = require('./api');

var routeController = express.Router();

routeController.get('/', routes.index);
routeController.get('/p/user/:name', routes.userpages);
routeController.get('/p/product/:name', routes.productpages);
routeController.get('/api/users', api.users);
routeController.get('*', routes.index);

exports.router = routeController;
