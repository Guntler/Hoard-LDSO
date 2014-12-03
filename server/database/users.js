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

exports.getUsersFromTo = function (from, to, callback) {
    pg.connect(conString, function (err, user, done) {
        if (err) {
            return callback(err, null);
        }

        var query = user.query("SELECT * FROM useraccount OFFSET $1 LIMIT $2", [(from - 1) * to, to]);

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


exports.getSimilarEmailUsers = function (input, callback) {
    pg.connect(conString, function (err, user, done) {
        if (err) {
            return callback(err, null);
        }

        var query = user.query("SELECT * FROM useraccount WHERE email LIKE '%' || $1 || '%'", [input]);

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
            var userMail = result[0].email
            var newPassword = crypto.randomBytes(Math.ceil(10 * 3 / 4))
                .toString("base64")
                .slice(10)
                .replace(/\+/g, '0')
                .replace(/\//g, '0');
            bcrypt.genSalt(10, function (err, salt) {
                if (err) return callback(err, null);

                bcrypt.hash(newPassword, salt, function (err, hash) {
                    if (err) return callback(err, null);
                    var query2 = user.query("UPDATE useraccount SET password = $1", [hash]);

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
                            '<p>Here it is:' + newPassword +
                            '<br><br>The Hoard Team' // html body
                        };

                        transporter.sendMail(mailOptions, function(error, info){
                            if(error){
                                callback(err, false);
                            }else{
                                done();
								if(info.accepted.length < 1)
									callback(null, false);
								else callback(null, true);
                                console.log('Message sent: ' + info.response);
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
