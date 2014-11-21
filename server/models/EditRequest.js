var util = require('..\\database\\utilities');

var EditRequest = function (id, product, submittedby, approvedby, edittype, editstatus, description, reason, editdate) {
	this.id = id;
	this.product = product;
	this.submittedby = submittedby;
	this.approvedby = approvedby;
	this.edittype = edittype;
	this.editstatus = editstatus;
	this.description = description;
	this.reason = reason;
	this.editdate = util.formatDate(new Date(editdate));
}

EditRequest.prototype.id = -1;
EditRequest.prototype.product = null;
EditRequest.prototype.submittedby = null;
EditRequest.prototype.approvedby = null;
EditRequest.prototype.edittype = "";
EditRequest.prototype.editstatus = "";
EditRequest.prototype.description = "";
EditRequest.prototype.reason = "";
EditRequest.prototype.editdate = "";

module.exports = EditRequest;