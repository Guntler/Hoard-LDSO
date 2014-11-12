pg  = require("pg");
var EditRequest = require('../models/EditRequest');

var conString = "postgres://hoard:hoardingisfun@178.62.105.68:5432/hoard";

exports.findById = function(id, callback) {
	pg.connect(conString, function(err, editrequest, done) {
		if(err) {
			return callback(err, null);
		}
		
		var query = editrequest.query("SELECT * FROM editrequest WHERE requestid = $1", [id]);
		
		query.on("row", function(row, result) {
			result.addRow(new EditRequest(row.requestid, row.product, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.reason, row.editdate, [], false));
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

exports.findByEditType = function(edittype, callback) {
	pg.connect(conString, function(err, editrequest, done) {
		if(err) {
			return callback(err, null);
		}
		
		var query = editrequest.query("SELECT * FROM editrequest WHERE edittype = $", [edittype]);
		
		query.on("row", function(row, result) {
			result.addRow(new EditRequest(row.requestid, row.product, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.reason, row.editdate, [], false));
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

exports.getAllById = function(callback) {
	pg.connect(conString, function(err, editrequest, done) {
		if(err) {
			return callback(err, null);
		}
		
		var query = editrequest.query("SELECT * FROM editrequest ORDER BY editdate desc");
		
		query.on("row", function(row, result) {
			result.addRow(new EditRequest(row.requestid, row.product, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.reason, row.editdate, [], false));
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

exports.getAllByDate = function(callback) {
	pg.connect(conString, function(err, editrequest, done) {
		if(err) {
			return callback(err, null);
		}
		
		var query = editrequest.query("SELECT * FROM editrequest ORDER BY requestid");
		
		query.on("row", function(row, result) {
			result.addRow(new EditRequest(row.requestid, row.product, row.submittedby, row.approvedby, row.edittype, row.editstatus, row.description, row.reason, row.editdate, [], false));
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
