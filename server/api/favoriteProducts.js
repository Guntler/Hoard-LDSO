pg  = require("pg");
var FavoriteProduct = require('../models/FavoriteProduct');

var conString = "postgres://hoard:hoardingisfun@178.62.105.68:5432/hoard";

exports.findById = function(id, callback) {
	pg.connect(conString, function(err, favoriteProduct, done) {
		if(err) {
			return callback(err, null);
		}
		
		var query = favoriteProduct.query("SELECT * FROM FavoriteProduct WHERE userID=$1", [id]);
		
		query.on("row", function(row, result) {
			result.addRow(new FavoriteProduct(row.productid, row.userid, row.position, row.visible, row.lastfavorited));
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




