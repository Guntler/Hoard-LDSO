var pg = require("pg");
var ProductCategory = require('../models/ProductCategory');

var conString = "postgres://hoard:hoardingisfun@178.62.105.68:5432/hoard";

exports.findById = function (id, callback) {
    pg.connect(conString, function (err, category, done) {
        if (err) {
            return callback(err, null);
        }

        var query = category.query("SELECT * FROM productCategory WHERE categoryid = $1", [id]);

        query.on("row", function (row, result) {
            result.addRow(new ProductCategory(row.categoryid, row.categoryname));
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

exports.getAllCategories = function (callback) {
    pg.connect(conString, function (err, client, done) {
        if (err) {
            return callback(err, null);
        }

        var query = client.query("SELECT * FROM productCategory");

        query.on("row", function (row, result) {
            result.addRow(new ProductCategory(row.categoryid, row.name));
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