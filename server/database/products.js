pg = require("pg");
var Product = require('../models/Product');

var conString = "postgres://hoard:hoardingisfun@178.62.105.68:5432/hoard";

exports.findById = function (id, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query = product.query("SELECT * FROM product WHERE productId = $1", [id]);

        query.on("row", function (row, result) {
            result.addRow(new Product(row.productid, row.name, row.price, row.link, row.imagename, row.category, row.visible, row.addedby, row.dateadded, [], false));
        });

        query.on("end", function (result) {
            done();
            if (result.rows.length < 1)
                callback(null, null);
            else
                callback(null, result.rows[0]);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};

exports.getProducts = function (n, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query;

        if (n == null) {
            query = product.query("SELECT * FROM product WHERE visible OFFSET random() * (SELECT COUNT(*) FROM product) LIMIT 5");
        } else {
            query = product.query("SELECT * FROM product WHERE visible OFFSET random() * (SELECT COUNT(*) FROM product) LIMIT $1", [n]);
        }

        query.on("row", function (row, result) {
            result.addRow(new Product(row.productid, row.name, row.price, row.link, row.imagename, row.category, row.visible, row.addedby, row.dateadded, [], false));
        });

        query.on("end", function (result) {
            done();
            callback(null, result.rows);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};

exports.getProductsFromTo = function (from, to, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query = product.query("SELECT * FROM product OFFSET $1 LIMIT $2", [(from - 1) * to, to]);

        query.on("row", function (row, result) {
            result.addRow(new Product(row.productid, row.name, row.price, row.link, row.imagename, row.category, row.visible, row.addedby, row.dateadded, [], false));
        });

        query.on("end", function (result) {
            done();
            callback(null, result.rows);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};


exports.getAllProducts = function (callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query = product.query("SELECT * FROM product WHERE visible ORDER BY name");

        query.on("row", function (row, result) {
            result.addRow(new Product(row.productid, row.name, row.price, row.link, row.imagename, row.category, row.visible, row.addedby, row.dateadded, [], false));
        });

        query.on("end", function (result) {
            done();
            callback(null, result.rows);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};

exports.getProductCount = function (callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query = product.query("SELECT COUNT (*) FROM product WHERE visible");

        query.on("row", function (row) {
            done();
            callback(null, row);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};

exports.addToFavorites = function (productid, userid, callback) {
    pg.connect(conString, function (err, favorite, done)  {
        if (err) {
            return callback(err, null);
        }

        var query = favorite.query("SELECT COUNT (*) FROM favoriteproduct WHERE userid = $1", [userid]);

        query.on("row", function (row, result) {
            result.addRow(row);
        });

        query.on("end", function (result) {
            var nquery = favorite.query("INSERT INTO favoriteproduct (productid, userid, position) VALUES ($1, $2, $3)", [productid, userid, result.rows[0].count*1+1]);

            nquery.on("row", function (row, result) {
                result.addRow(new FavoriteProduct(row.productid, row.userid, row.position, row.visible, row.lastfavorited));
            });

            nquery.on("end", function (result) {
                done();
                callback(null, result);
            });

            nquery.on("error", function (err) {
                done();
                callback(err, null);
            });
        })


    });
};

exports.removeProduct = function (productid, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query = product.query("UPDATE product SET visible = 'false' WHERE productid = $1", [productid]);

        query.on("row", function (row) {
            done();
            callback(null, row);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};

exports.getFavorites = function (userid, callback) {
    pg.connect(conString, function (err, product, done) {
        if (err) {
            return callback(err, null);
        }

        var query;
            query = product.query("SELECT * FROM favoriteproduct NATURAL JOIN product WHERE userid = $1 AND visible", [userid]);

        query.on("row", function (row, result) {
            result.addRow(new Product(row.productid, row.name, row.price, row.link, row.imagename, row.category, row.visible, row.addedby, row.dateadded, [], false));
        });

        query.on("end", function (result) {
            done();
            callback(null, result.rows);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};
