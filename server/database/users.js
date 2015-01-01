var pg = require("pg");
var User = require('../models/UserAccount');
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var bcrypt = require("bcrypt-nodejs");

var conString = "postgres://hoard:hoardingisfun@178.62.105.68:5432/hoard";

exports.findById = function (id, callback) {
    pg.connect(conString, function (err, client, done) {
        if (err) {
            return callback(err, null);
        }

        var query = client.query("SELECT * FROM userAccount WHERE userId = $1", [id]);

        query.on("row", function (row, result) {
            result.addRow(new User(row.userid, row.email, row.permissions, row.registerdate));
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
            result.addRow(new User(row.userid, row.email, row.permissions, row.registerdate));
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
            result.addRow({
                user: new User(row.userid, row.email, row.permissions, row.registerdate),
                password: row.password
            });
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
			else if(result) {
				bcrypt.genSalt(10, function (err, salt) {
					if (err) return callback(err, null);

					bcrypt.hash(newPassword, salt, function (err, hash) {
						if (err) return callback(err, null);

						var query = client.query("UPDATE  userAccount SET password=$1 WHERE email=$2", [hash, email]);

						query.on("row", function (row, result) {
							result.addRow(new User(row.userid, row.email, row.permissions, row.registerdate));
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
			}
			else
				return callback(null, null);
        });


    });

};


exports.registerUser = function (email, password, callback) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!email.match(re)) {
        return callback(null, null);
    }
    pg.connect(conString, function (err, client, done) {
        if (err) return callback(err, null);

        bcrypt.genSalt(10, function (err, salt) {
            if (err) return callback(err, null);

            bcrypt.hash(password, salt, function (err, hash) {
                if (err) return callback(err, null);

                var query = client.query("INSERT INTO userAccount(email,password,registerdate) VALUES ($1,$2, Now()) RETURNING *", [email, hash]);

                query.on("row", function (row, result) {
                    result.addRow(new User(row.userid, row.email, row.permissions, row.registerdate));
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
            result.addRow(new User(row.userid, row.email, row.permissions, row.registerdate));
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

exports.getUsersFromTo = function (from, to, filterBy, value, search, callback) {
    pg.connect(conString, function (err, user, done) {
        if (err) {
            return callback(err, null);
        }
		
		var queryStr = "SELECT * FROM useraccount ";
		var query;
		
		var filterVals = [];
		if(value != undefined && value != null) {
			filterVals = value.split("|");
		}
		var i = 0;
		var currArg = 1;
		var arr = [];
		
		if(filterBy == "Permissions") {
			queryStr += "WHERE ";
			
			if(search != undefined && search != null) {
				queryStr += "similarity(email, $1) > 0.5"
				currArg++;
				arr = [search];
			}
			
			for(i = 0; i < filterVals.length; i++) {
				if(i == 0 && currArg > 1)
					queryStr += " AND ( ";
				queryStr += "permissions = $" + (i+currArg);
				if(i < filterVals.length-1)
					queryStr += " OR ";
				else if(currArg > 1)
					queryStr += ")";
			}
			queryStr += " ORDER BY userID OFFSET $" + (i+currArg) + " LIMIT $" + (i+currArg+1);
			arr = arr.concat(filterVals);
			arr = arr.concat([(from - 1) * to, to]);
			query = user.query(queryStr, arr);
		}
		else {
			queryStr += " ORDER BY userID OFFSET $1 LIMIT $2";
			query = user.query(queryStr, [(from - 1) * to, to]);
		}

        query.on("row", function (row, result) {
            result.addRow(new User(row.userid, row.email, row.permissions, row.registerdate));
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

exports.getUserCount = function (filterBy, value, search, callback) {
    pg.connect(conString, function (err, user, done) {
        if (err) {
            return callback(err, null);
        }
		
		var queryStr = "SELECT COUNT (*) FROM useraccount ";
		var query;

		var filterVals = [];
		if(value != undefined && value != null) {
			filterVals = value.split("|");
		}
		var i = 0;
		var currArg = 1;
		var arr = [];
		
		if(filterBy == "Permissions") {
			queryStr += "WHERE ";
			
			if(search != undefined && search != null) {
				queryStr += "similarity(email, $1) > 0.5"
				currArg++;
				arr = [search];
			}
			
			for(i = 0; i < filterVals.length; i++) {
				if(i == 0 && currArg > 1)
					queryStr += " AND ( ";
				queryStr += "permissions = $" + (i+currArg);
				if(i < filterVals.length-1)
					queryStr += " OR ";
				else if(currArg > 1)
					queryStr += ")";
			}
			
			
			arr = arr.concat(filterVals);
			query = user.query(queryStr, arr);
		}
		else {
			query = user.query(queryStr);
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

exports.changePrivileges = function (userID, permission, callback) {
    pg.connect(conString, function (err, user, done) {
        if (err) {
            return callback(err, null);
        }

        var query = user.query("UPDATE useraccount SET permissions = $1 WHERE userid= $2", [permission, userID]);

        query.on("row", function (row) {
            done();
            callback(null, row);
        });
		
		query.on("end", function (row) {
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
            result.addRow(new User(row.userid, row.email, row.permissions, row.registerdate));
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


exports.getSimilarFieldUsers = function (field, input, callback) {
    pg.connect(conString, function (err, user, done) {
        if (err) {
            return callback(err, null);
        }

        if(field == "email")
            var query = user.query("SELECT * FROM useraccount WHERE similarity(email, $1) > 0.2", [input]);
        else
            return callback(err, null);

        query.on("row", function (row, result) {
            result.addRow(new User(row.userid, row.email, row.permissions, row.registerdate));
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

exports.forgotPassword = function (email, callback) {
    pg.connect(conString, function (err, user, done) {
        if (err) {
            return callback(err, null);
        }

        var query = user.query("SELECT * FROM useraccount WHERE email = $1", [email]);

        query.on("row", function (row, result) {
            result.addRow(new User(row.userid, row.email, row.permissions, row.registerdate));
        });


        query.on("end", function (result) {
            if (result.rows.length == 0)
                callback(null, null);
            var userMail = result.rows[0].email;
            var newPassword = Math.random().toString(36).slice(-10);

            bcrypt.genSalt(10, function (err, salt) {
                if (err) return callback(err, null);

                bcrypt.hash(newPassword, salt, function (err, hash) {
                    if (err) return callback(err, null);
                    var query2 = user.query("UPDATE useraccount SET password = $1 WHERE email = $2", [hash, userMail]);

                    query2.on("error", function (err) {
                        done();
                        callback(err, null);
                    });

                    query2.on("end", function (result) {
                        var transporter = nodemailer.createTransport({
                            service: 'Gmail',
                            auth: {
                                user: 'hoardapp@gmail.com',
                                pass: 'hoardingisfun'
                            }
                        });

                        var mailOptions = {
                            from: 'Hoard App ✔ <hoardapp@gmail.com>', // sender address
                            to: userMail, // list of receivers
                            subject: 'Password Reset', // Subject line
                            text: 'Hello!\n\nYou seem to have forgotten your password, so we reset it and sent you a new one!\nHere it is:' + newPassword + '\n\nThe Hoard Team',
                            html: '<b>Hello!</b><br><br>' +
                            '<p>You seem to have forgotten your password, so we reset it and sent you a new one!</p>' +
                            '<p>Here it is: ' + newPassword +
                            '<br><br>The Hoard Team' // html body
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                callback(err, false);
                            } else {
                                done();
                                if (info.accepted.length < 1)
                                    callback(null, false);
                                else callback(null, info.accepted);
                            }
                        });
                    });
                });
            });
        });

        query.on("error", function (err) {
            done();
            callback(err, null);
        });
    });

};
