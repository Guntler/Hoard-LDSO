pg  = require("pg");
var User = require('../models/UserAccount');

var conString = "postgres://hoard:hoardingisfun@178.62.105.68:5432/hoard";

exports.findById = function(id, callback) {
	pg.connect(conString, function(err, client, done) {
		if(err) {
			return callback(err, null);
		}
		
		var query = client.query("SELECT * FROM userAccount WHERE userId = $1", [id]);
		
		query.on("row", function(row, result) {
			result.addRow(new User(row.userid, row.email/*, row.password*/, row.permissions, row.registerdate, [], false));
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

exports.findByEmail = function(email, callback) {
	pg.connect(conString, function(err, client, done) {
		if(err) {
			return callback(err, null);
		}
		
		var query = client.query("SELECT * FROM userAccount WHERE email = $1", [email]);
		
		query.on("row", function(row, result) {
			result.addRow(new User(row.userid, row.email/*, row.password*/, row.permissions, row.registerdate, [], false));
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

exports.checkLogin = function(email, password, callback) {
	pg.connect(conString, function(err, client, done) {
		if(err) {
			return callback(err, {result: false});
		}
		
		var query = client.query("SELECT * FROM userAccount WHERE email = $1 AND password = $2", [email,password]);
		
		query.on("row", function(row, result) {
			result.addRow(new User(row.userid, row.email/*, row.password*/, row.permissions, row.registerdate, [], false));
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

exports.registerUser = function(email, password, callback) {
	pg.connect(conString, function(err, client, done) {
		if(err) {
			return callback(err, null);
		}
		
		var query = client.query("INSERT INTO userAccount(email,password,registerdate) VALUES ($1,$2, Now()) RETURNING *", [email,password]);
		
		query.on("end", function(result) {
			done();
			if(result.rows.length < 1)
				callback(null, null);
			else
				callback(null,result.rows[0]);	
		});
		query.on("row", function(row, result) {
			result.addRow(new User(row.userid, row.email/*, row.password*/, row.permissions, row.registerdate, [], false));
		});
		query.on("error", function(err) {
			done();
			callback(null, null);
		});
	});
};

exports.getAll = function(callback) {
	pg.connect(conString, function(err, client, done) {
		if(err) {
			return callback(err, null);
		}
		
		var query = client.query("SELECT * FROM userAccount ORDER BY userID");
		
		query.on("row", function(row, result) {
			result.addRow(new User(row.userid, row.email/*, row.password*/, row.permissions, row.registerdate, [], false));
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