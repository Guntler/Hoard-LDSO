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
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.reason, Date(row.editdate), [], false));
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
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.reason, Date(row.editdate), [], false));
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
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.reason, Date(row.editdate), [], false));
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
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.reason, Date(row.editdate), [], false));
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

exports.getEditsFromTo = function (from, to, callback) {
    pg.connect(conString, function (err, editrequest, done) {
        if (err) {
            return callback(err, null);
        }

        var query = editrequest.query("SELECT * FROM editrequest OFFSET $1 LIMIT $2", [(from - 1) * to, to]);

        query.on("row", function (row, result) {
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.reason, Date(row.editdate), [], false));
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

exports.getEditCount = function (callback) {
    pg.connect(conString, function (err, editrequest, done) {
        if (err) {
            return callback(err, null);
        }

        var query = editrequest.query("SELECT COUNT (*) FROM editrequest");

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
            result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.reason, Date(row.editdate), [], false));
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
}

exports.rejectRequest = function (adminid, editid, callback) {
    pg.connect(conString, function (err, editrequest, done) {
            if (err) {
                return callback(err, null);
            }

            var query1 = editrequest.query("SELECT * FROM editrequest WHERE requestid = $1 AND editstatus = 'Pending'", [editid]);

            query1.on("row", function (row, result) {
                result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.reason, Date(row.editdate), [], false));
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

                    query1.on("row", function (row, result2) {
                        result2.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.reason, Date(row.editdate), [], false));
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
                result.addRow(new EditRequest(row.requestid, row.productid, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.reason, Date(row.editdate), [], false));
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
            result.addRow(new EditRequest(row.requestid, row.product, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.reason, Date(row.editdate), [], false));
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
