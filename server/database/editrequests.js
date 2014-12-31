pg = require("pg");
util = require("./utilities");
var EditRequest = require('../models/EditRequest');
var Product = require('../models/Product');

var conString = "postgres://hoard:hoardingisfun@178.62.105.68:5432/hoard";


exports.findByEditType = function (edittype, callback) {
    pg.connect(conString, function (err, editrequest, done) {
        if (err) {
            return callback(err, null);
        }

        var query = editrequest.query("SELECT * FROM editrequest WHERE edittype = $1", [edittype]);

        query.on("row", function (row, result) {
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
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

exports.findById = function (id, callback) {
    pg.connect(conString, function (err, editrequest, done) {
        if (err) {
            return callback(err, null);
        }

        var query = editrequest.query("SELECT * FROM editrequest WHERE requestid = $1", [id]);

        query.on("row", function (row, result) {
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
        });

        query.on("end", function (result) {
            done();
            if (result.rows.length < 1) {
                callback(null, null);
            }
            else
                callback(null, result.rows[0]);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });
};

exports.getAllById = function (callback) {
    pg.connect(conString, function (err, editrequest, done) {
        if (err) {
            return callback(err, null);
        }

        var query = editrequest.query("SELECT * FROM editrequest ORDER BY requestid");

        query.on("row", function (row, result) {
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
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

exports.getAllByDate = function (callback) {
    pg.connect(conString, function (err, editrequest, done) {
        if (err) {
            return callback(err, null);
        }

        var query = editrequest.query("SELECT * FROM editrequest ORDER BY editdate asc");

        query.on("row", function (row, result) {
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
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

exports.getEditsFromTo = function (from, to, filterBy, value, callback) {
    pg.connect(conString, function (err, editrequest, done) {
        if (err) {
            return callback(err, null);
        }

        var queryStr = "SELECT * FROM editrequest ";
        var query;

        var filterVals = [];
        if (value != undefined && value != null) {
            filterVals = value.split("|");
        }
        var i = 0;

        if (filterBy == "User") {

            queryStr += "WHERE ";

            for (i = 0; i < filterVals.length; i++) {
                queryStr += "submittedby = $" + (i + 1);
                if (i < filterVals.length - 1)
                    queryStr += " OR ";
            }
            queryStr += " ORDER BY editdate asc OFFSET $" + (i + 1) + " LIMIT $" + (i + 2);
            var arr = filterVals.concat([(from - 1) * to, to]);
            query = editrequest.query(queryStr, arr);
        }
        else if (filterBy == "Status") {
            queryStr += "WHERE ";

            for (i = 0; i < filterVals.length; i++) {
                queryStr += "editstatus = $" + (i + 1);
                if (i < filterVals.length - 1)
                    queryStr += " OR ";
            }
            queryStr += " ORDER BY editdate asc OFFSET $" + (i + 1) + " LIMIT $" + (i + 2);
            var arr = filterVals.concat([(from - 1) * to, to]);
            query = editrequest.query(queryStr, arr);
        }
        else if (filterBy == "Product") {
            queryStr += "WHERE ";

            for (i = 0; i < filterVals.length; i++) {
                queryStr += "productid = $" + (i + 1);
                if (i < filterVals.length - 1)
                    queryStr += " OR ";
            }
            queryStr += " ORDER BY editdate asc OFFSET $" + (i + 1) + " LIMIT $" + (i + 2);
            var arr = filterVals.concat([(from - 1) * to, to]);
            query = editrequest.query(queryStr, arr);
        }
        else {
            queryStr += " ORDER BY editdate asc OFFSET $1 LIMIT $2";
            query = editrequest.query(queryStr, [(from - 1) * to, to]);
        }


        query.on("row", function (row, result) {
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.name, row.link, row.imageName, row.category, row.reason, row.editdate));
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

exports.getEditCount = function (filterBy, value, callback) {
    pg.connect(conString, function (err, editrequest, done) {
        if (err) {
            return callback(err, null);
        }

        var queryStr = "SELECT COUNT (*) FROM editrequest ";
        var query;

        var filterVals = [];
        if (value != undefined && value != null) {
            filterVals = value.split("|");
        }
        var i = 0;

        if (filterBy == "User") {

            queryStr += "WHERE ";

            for (i = 0; i < filterVals.length; i++) {
                queryStr += "submittedby = $" + (i + 1);
                if (i < filterVals.length - 1)
                    queryStr += " OR ";
            }

            query = editrequest.query(queryStr, filterVals);
        }
        else if (filterBy == "Status") {
            queryStr += "WHERE ";

            for (i = 0; i < filterVals.length; i++) {
                queryStr += "editstatus = $" + (i + 1);
                if (i < filterVals.length - 1)
                    queryStr += " OR ";
            }

            query = editrequest.query(queryStr, filterVals);
        }
        else if (filterBy == "Product") {
            queryStr += "WHERE ";

            for (i = 0; i < filterVals.length; i++) {
                queryStr += "productid = $" + (i + 1);
                if (i < filterVals.length - 1)
                    queryStr += " OR ";
            }

            query = editrequest.query(queryStr, filterVals);
        }
        else {
            query = editrequest.query(queryStr);
        }

        query.on("row", function (row, result) {
            done();
            callback(null, row);
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    })
}

exports.getManagerEdits = function (managerId, callback) {
    pg.connect(conString, function (err, editrequest, done) {
        if (err) {
            return callback(err, null);
        }

        var query = editrequest.query("SELECT * FROM editrequest WHERE submittedby = $1 ", [managerId]);

        query.on("row", function (row, result) {
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
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

exports.newRequest = function (productid, userid, editType, reason, name, link, imageName, category, callback) {
    pg.connect(conString, function (err, editrequest, done) {
        if (err) {
            return callback(err, null);
        }

        var productExists = false;

        if (name == undefined) name = null;
        if (link == undefined) link = null;
        if (imageName == undefined) imageName = null;
        if (category == undefined) category = null;

        console.log(productid);
        var query1 = editrequest.query("SELECT * FROM product WHERE productid = $1", [productid]);

        query1.on("row", function (row, result) {
            productExists = true;
        });

        query1.on("end", function (result) {

            if (!productExists) {
                done();
                callback(err, null);
            } else {
                var query2 = editrequest.query("INSERT INTO editrequest (productid, submittedby, edittype, reason, name, link, imageName, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)", [productid, userid, editType, reason, name, link, imageName, category]);

                query2.on("end", function (result2) {
                    done();
                    callback(null, true);
                });

                query2.on("error", function (err) {
                    done();
                    callback(err, null);
                });
            }
        });

        query1.on("error", function (err) {
            done();
            callback(err, null);
        });

    });
};

exports.rejectRequest = function (adminid, editid, callback) {
    pg.connect(conString, function (err, editrequest, done) {
            if (err) {
                return callback(err, null);
            }

            var query1 = editrequest.query("SELECT * FROM editrequest WHERE requestid = $1 AND editstatus = 'Pending'", [editid]);

            query1.on("row", function (row, result) {
                result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
            });

            query1.on("error", function (err) {
                done();
                callback(err, null);
            });

            query1.on("end", function (result) {
                var resultData = result.rows[0];

                if (result.rows.length < 1) {
                    done();
                    callback(err, null);
                } else {
                    var query2 = editrequest.query("UPDATE editrequest SET approvedby = $1, editstatus = 'Denied' WHERE requestid = $2", [adminid, editid]);

                    query2.on("row", function (row, result2) {
                        result2.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
                    });

                    query2.on("end", function (result2) {
                        done();
                        callback(null, result2);
                    });

                    query2.on("error", function (err) {
                        done();
                        callback(err, null);
                    });
                }
            });
        }
    );
};

exports.approveRequest = function (adminid, editid, callback) {
    pg.connect(conString, function (err, editrequest, done) {
            if (err) {
                return callback(err, null);
            }

            var query1 = editrequest.query("SELECT * FROM editrequest WHERE requestid = $1 AND editstatus = 'Pending'", [editid]);

            query1.on("row", function (row, result) {
                result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
            });

            query1.on("end", function (result) {
                var resultData = result.rows[0];

                if (result.rows.length < 1) {
                    done();
                    callback(err, null);
                } else {
                    var query2 = editrequest.query("UPDATE editrequest SET approvedby = $1, editstatus = 'Approved' WHERE requestid = $2", [adminid, editid]);

                    query2.on("end", function (result) {

                        if (resultData.edittype == 'Add') {
                            var query3 = editrequest.query("UPDATE product SET visible = 'true' WHERE productid = $1", [resultData.productid]);

                            query3.on("error", function (err) {
                                done();
                                callback(err, null);
                            });

                            query3.on("end", function (result) {
                                done();
                                callback(null, result);
                            });
                        } else if (resultData.edittype == 'Delete') {

                            var query3 = editrequest.query("UPDATE product SET visible = 'false' WHERE productid = $1", [resultData.productid]);

                            query3.on("error", function (err) {
                                done();
                                callback(err, null);
                            });

                            query3.on("end", function (result) {
                                done();
                                callback(null, result);
                            });
                        } else if (resultData.edittype == 'Edit') {

                            var query3 = editrequest.query("SELECT * FROM product WHERE productid = $1", [resultData.productid]);

                            query3.on("row", function (row, result) {
                                result.addRow(new Product(row.productid, row.name, row.link, row.imagename, row.category, row.visible, row.addedby, row.dateadded))
                            });

                            query3.on("error", function (err) {
                                done();
                                callback(err, null);
                            });

                            query3.on("end", function (result) {
                                product = result.rows[0];
                                if (resultData.name != undefined) {
                                    product.name = resultData.name;
                                }
                                if (resultData.link != undefined) {
                                    product.link = resultData.link;
                                }
                                if (resultData.imageName != undefined) {
                                    product.imageName = resultData.imageName;
                                }
                                if (resultData.category != undefined) {
                                    product.category = resultData.category;
                                }

                                var query4 = editrequest.query("UPDATE product SET name = $1, link = $2, imagename = $3, category = $4 WHERE productid = $5", [product.name, product.link, product.imageName, product.category, resultData.productid]);

                                query4.on("error", function (err) {
                                    done();
                                    callback(err, null);
                                });

                                query4.on("end", function (result) {
                                    done();
                                    callback(null, result);
                                });
                            });
                        } else {
                            done();
                            callback(null, null);
                        }
                    });

                    query2.on("error", function (err) {
                        done();
                        callback(err, null);
                    });
                }
            });
        }
    );
};

exports.getEditsOfProduct = function (product, callback) {
    pg.connect(conString, function (err, editrequest, done) {
        if (err) {
            return callback(err, null);
        }

        var query = editrequest.query("SELECT * FROM editrequest WHERE productID = $1", [product]);

        query.on("row", function (row, result) {
            result.addRow(new EditRequest(row.requestid, row.product, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
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

exports.getSimilarFieldEdits = function (field, input, callback) {
    pg.connect(conString, function (err, editrequest, done) {
        if (err) {
            return callback(err, null);
        }

        if (field == "product")
            var query = editrequest.query("SELECT * FROM editrequest, product WHERE product.productid = editrequest.productid AND similarity(product.name, $1) > 0.2", [input]);
        else if (field == "user")
            var query = editrequest.query("SELECT * FROM editrequest, useraccount WHERE useraccount.userid = editrequest.submittedby AND similarity(useraccount.email, $1) > 0.2", [input]);
        else
            return callback(err, null);

        query.on("row", function (row, result) {
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
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
