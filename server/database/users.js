pg = require("pg");
var User = require('../models/UserAccount');
var bcrypt = require("bcrypt-nodejs");

var conString = "postgres://hoard:hoardingisfun@178.62.105.68:5432/hoard";

exports.findById = function (id, callback) {
    pg.connect(conString, function (err, client, done) {
        if (err) {
            return callback(err, null);
        }

        var query = client.query("SELECT * FROM userAccount WHERE userId = $1", [id]);

        query.on("row", function (row, result) {
            result.addRow(new User(row.userid, row.email, row.permissions, row.registerdate, [], false));
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

exports.findByEmail = function (email, callback) {
    pg.connect(conString, function (err, client, done) {
        if (err) {
            return callback(err, null);
        }

        var query = client.query("SELECT * FROM userAccount WHERE email = $1", [email]);

        query.on("row", function (row, result) {
            result.addRow(new User(row.userid, row.email, row.permissions, row.registerdate, [], false));
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

exports.checkLogin = function (email, password, callback) {
    pg.connect(conString, function (err, client, done) {
        if (err) {
            return callback(err, null);
        }

        var query = client.query("SELECT * FROM userAccount WHERE email = $1", [email]);
        query.on("row", function (row, result) {
			result.addRow({user: new User(row.userid, row.email, row.permissions, row.registerdate, [], false), password: row.password});
        });

        query.on("end", function (result) {
            done();
			
            if (result.rows.length < 1)
                callback(null, null);
            else {
				bcrypt.compare(password, result.rows[0].password, function (err, res) {
					if (res === true) {
						return callback(null, result.rows[0].user);
					}
					else {
						return callback(null, null);
					}
				});
			}
        });

        query.on("error", function (err) {
            done();
            return callback(err, null);
        });
    });
};

exports.changePassword = function (oldPassword, newPassword, email, callback) {

    pg.connect(conString, function (err, client, done) {
        if (err) return callback(err, null);

        exports.checkLogin(email, oldPassword, function (err, result) {
            if (err)
                return callback(err, null);

            bcrypt.genSalt(10, function (err, salt) {
                if (err) return callback(err, null);

                bcrypt.hash(newPassword, salt, function (err, hash) {
                    if (err) return callback(err, null);

                    var query = client.query("UPDATE  userAccount SET password=$1 WHERE email=$2", [hash, email]);

                    query.on("row", function (row, result) {
                        result.addRow(new User(row.userid, row.email/*, row.password*/, row.permissions, row.registerdate, [], false));
                    });

                    query.on("end", function (result) {
                        done();
                        callback(null, result);
                    });

                    query.on("error", function (err) {
                        done();
                        callback(err, null);
                    });

                });
            });
        });


    });

};


exports.registerUser = function (email, password, callback) {
    pg.connect(conString, function (err, client, done) {
        if (err) return callback(err, null);

        bcrypt.genSalt(10, function (err, salt) {
            if (err) return callback(err, null);

            bcrypt.hash(password, salt, function (err, hash) {
                if (err) return callback(err, null);

                var query = client.query("INSERT INTO userAccount(email,password,registerdate) VALUES ($1,$2, Now()) RETURNING *", [email, hash]);

                query.on("row", function (row, result) {
                    result.addRow(new User(row.userid, row.email/*, row.password*/, row.permissions, row.registerdate, [], false));
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
        });

    });

};

exports.getAllUsers = function (callback) {
    pg.connect(conString, function (err, client, done) {
        if (err) {
            return callback(err, null);
        }

        var query = client.query("SELECT * FROM userAccount ORDER BY userID");

        query.on("row", function (row, result) {
            result.addRow(new User(row.userid, row.email, row.permissions, row.registerdate, [], false));
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

exports.getUsersFromTo = function (from, to, callback) {
    pg.connect(conString, function (err, user, done) {
        if (err) {
            return callback(err, null);
        }

        var query = user.query("SELECT * FROM useraccount OFFSET $1 LIMIT $2", [(from - 1) * to, to]);

        query.on("row", function (row, result) {
            result.addRow(new User(row.userid, row.email, row.permissions, row.registerdate, [], false));
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

exports.getUserCount = function (callback) {
    pg.connect(conString, function (err, user, done) {
        if (err) {
            return callback(err, null);
        }

        var query = user.query("SELECT COUNT (*) FROM useraccount");

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

exports.updateUserEmail = function (userID, newEmail, callback) {
    pg.connect(conString, function (err, user, done) {
        if (err) {
            return callback(err, null);
        }

        var query = user.query("UPDATE useraccount SET email = $1 WHERE userid= $2", [newEmail, userID]);

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

//-------------------------------------------------------------------------------------------------------------

exports.removeManagerPrivileges = function (userID, callback) {
    pg.connect(conString, function (err, user, done) {
        if (err) {
            return callback(err, null);
        }

        var query = user.query("UPDATE useraccount SET permissions = 'User' WHERE userid= $1", [userID]);

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

exports.grantManagerPrivileges = function (userID, callback) {
    pg.connect(conString, function (err, user, done) {
        if (err) {
            return callback(err, null);
        }

        var query = user.query("UPDATE useraccount SET permissions = 'Manager' WHERE userid= $1", [userID]);

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

exports.getAllManagers = function (callback) {
    pg.connect(conString, function (err, user, done) {
        if (err) {
            return callback(err, null);
        }

        var query = user.query("SELECT * FROM useraccount WHERE permissions = 'Manager' ORDER BY userID");

        query.on("row", function (row, result) {
            result.addRow(new User(row.userid, row.email/*, row.password*/, row.permissions, row.registerdate, [], false));
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


exports.getSimilarEmailUsers = function (input, callback) {
    pg.connect(conString, function (err, user, done) {
        if (err) {
            return callback(err, null);
        }

        var query = user.query("SELECT * FROM useraccount WHERE email LIKE '%' || $1 || '%'", [input]);

        query.on("row", function (row, result) {
            result.addRow(new User(row.userid, row.email/*, row.password*/, row.permissions, row.registerdate, [], false));
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



