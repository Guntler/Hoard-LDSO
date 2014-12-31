var util = require('../database/utilities');

var EditRequest = function (requestid, productid, submittedby, approvedby, edittype, editstatus, name, link, imageName, category, reason, editdate) {
	this.id = requestid;
	this.productid = productid;
	this.submittedby = submittedby;
	this.approvedby = approvedby;
	this.edittype = edittype;
	this.editstatus = editstatus;
	this.name = name;
	this.link = link;
	this.imageName = imageName;
	this.category = category;
	this.reason = reason;
	this.editdate = util.formatDate(new Date(editdate));
}

EditRequest.prototype.requestid = -1;
EditRequest.prototype.productid = null;
EditRequest.prototype.submittedby = null;
EditRequest.prototype.approvedby = null;
EditRequest.prototype.edittype = "";
EditRequest.prototype.editstatus = "";
EditRequest.prototype.name = null;
EditRequest.prototype.link = null;
EditRequest.prototype.imageName = null;
EditRequest.prototype.category = null;
EditRequest.prototype.reason = "";
EditRequest.prototype.editdate = "";

module.exports = EditRequest;