pg  = require("pg");
var Product = require('../models/Product');

var conString = "postgres://hoard:hoardingisfun@178.62.105.68:5432/hoard";

exports.findById = function(id, callback) {
	pg.connect(conString, function(err, product, done) {
		if(err) {
			return callback(err, null);
		}
		
		var query = product.query("SELECT * FROM product WHERE productId = $1", [id]);
		
		query.on("row", function(row, result) {
			result.addRow(new User(row.productid, row.name, row.price, row.link, row.imagename, row.category, row.visible, row.addedby, row.dateadded, [], false));
		});
		
		query.on("end", function(result) {
			done();
			if(result.rows.length < 1)
				callback(null, null);
			else
				callback(null, result.rows[0]);
		});
		
		query.on("error", function(err) {
			done();
			callback(err, null);
		});
	});
};

exports.getSomeProducts = function(email, callback) {
	pg.connect(conString, function(err, product, done) {
		if(err) {
			return callback(err, null);
		}
		
		var query = product.query("SELECT * FROM product WHERE random() < 0.01 LIMIT 20");
		
		query.on("row", function(row, result) {
			result.addRow(new User(row.productid, row.name, row.price, row.link, row.imagename, row.category, row.visible, row.addedby, row.dateadded, [], false));
		});
		
		query.on("end", function(result) {
			done();
			callback(null, result.rows);
		});
		
		query.on("error", function(err) {
			done();
			callback(err, null);
		});
	});
};



exports.getAll = function(callback) {
	pg.connect(conString, function(err, product, done) {
		if(err) {
			return callback(err, null);
		}
		
		var query = product.query("SELECT * FROM userAccount ORDER BY userID");
		
		query.on("row", function(row, result) {
			result.addRow(new User(row.productid, row.name, row.price, row.link, row.imagename, row.category, row.visible, row.addedby, row.dateadded, [], false));
		});
		
		query.on("end", function(result) {
			done();
			callback(null, result.rows);
		});
		
		query.on("error", function(err) {
			done();
			callback(err, null);
		});
	});
};