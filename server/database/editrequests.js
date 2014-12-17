pg = require("pg");
util = require("./utilities");
var EditRequest = require('../models/EditRequest');

var conString = "postgres://hoard:hoardingisfun@178.62.105.68:5432/hoard";


exports.findByEditType = function (edittype, callback) {
    pg.connect(conString, function (err, editrequest, done) {
        if (err) {
            return callback(err, null);
        }

        var query = editrequest.query("SELECT * FROM editrequest WHERE edittype = $1", [edittype]);

        query.on("row", function (row, result) {
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
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
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
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
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
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
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
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
		
		if(filterBy == "User") {
			queryStr += "WHERE submittedby = $1 OFFSET $2 LIMIT $3";
			query = editrequest.query(queryStr, [value, (from - 1) * to, to]);
		}
		else if (filterBy == "Status") {
			queryStr += "WHERE editstatus = $1 OFFSET $2 LIMIT $3";
			query = editrequest.query(queryStr, [value, (from - 1) * to, to]);
		}
		else {
			queryStr += "OFFSET $1 LIMIT $2";
			query = editrequest.query(queryStr, [(from - 1) * to, to]);
		}
         

        query.on("row", function (row, result) {
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
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
		
		if(filterBy == "User") {
			queryStr += "WHERE submittedby = $1";
			query = editrequest.query(queryStr, [value]);
		}
		else if (filterBy == "Status") {
			queryStr += "WHERE editstatus = $1";
			query = editrequest.query(queryStr, [value]);
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
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
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

exports.newRequest = function (productid, userid, editType, description, reason, fields, callback) {
    pg.connect(conString, function (err, editrequest, done) {
        if (err) {
            return callback(err, null);
        }

        if (fields.name == undefined) fields.name = null;
        if (fields.link == undefined) fields.link = null;
        if (fields.imageName == undefined) fields.imageName = null;
        if (fields.category == undefined) fields.category = null;

        var query1 = editrequest.query("SELECT * FROM product WHERE productid = $1", [productid]);

        query1.on("row", function (row, result) {
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
        });

        query1.on("end", function (result) {
            var resultData = result.rows[0];

            if (result.rows.length < 1) {
                done();
                callback(err, null);
            } else {
                var query2 = editrequest.query("INSERT INTO product (productid, submittedby, edittype, description, name, link, imageName, category, reason) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)", [productid, userid, editType, description, fields.name, fields.link, fields.imageName, fields.category, reason]);

                query2.on("row", function (row, result2) {
                    result2.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
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
                result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
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
                        result2.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
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
                result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
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

                            if(resultData.name != undefined)
                            {
                                var query3 = editrequest.query("UPDATE product SET name = $1 WHERE productid = $2", [resultData.name, resultData.productid]);

                                query3.on("error", function (err) {
                                    done();
                                    callback(err, null);
                                });

                                query3.on("end", function (result) {
                                    done();
                                    callback(null, result);
                                });
                            }

                            if(resultData.link != undefined)
                            {
                                var query4 = editrequest.query("UPDATE product SET link = $1 WHERE productid = $2", [resultData.link, resultData.productid]);

                                query4.on("error", function (err) {
                                    done();
                                    callback(err, null);
                                });

                                query4.on("end", function (result) {
                                    done();
                                    callback(null, result);
                                });
                            }

                            if(resultData.imageName != undefined)
                            {
                                var query5 = editrequest.query("UPDATE product SET imageName = $1 WHERE productid = $2", [resultData.imageName, resultData.productid]);

                                query5.on("error", function (err) {
                                    done();
                                    callback(err, null);
                                });

                                query5.on("end", function (result) {
                                    done();
                                    callback(null, result);
                                });
                            }

                            if(resultData.category != undefined)
                            {
                                var query6 = editrequest.query("UPDATE product SET category = $1 WHERE productid = $2", [resultData.category, resultData.productid]);

                                query6.on("error", function (err) {
                                    done();
                                    callback(err, null);
                                });

                                query6.on("end", function (result) {
                                    done();
                                    callback(null, result);
                                });
                            }

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
            result.addRow(new EditRequest(row.requestid, row.product, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
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

        //console.log("Field is: " + field); console.log("Input is: " + input);

        if(field == "product")
            var query = editrequest.query("SELECT * FROM editrequest, product WHERE product.productid = editrequest.productid AND similarity(product.name, $1) > 0.2", [input]);
        else if (field == "user")
            var query = editrequest.query("SELECT * FROM editrequest, useraccount WHERE useraccount.userid = editrequest.submittedby AND similarity(useraccount.email, $1) > 0.2", [input]);
        else
            return callback(err, null);

        query.on("row", function (row, result) {
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.name, row.link, row.imageName, row.category, row.reason, Date(row.editdate)));
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
