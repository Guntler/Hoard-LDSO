var EditRequest = function (id, product, submittedby, approvedby, edittype, editstatus, description, justification, editdate) {
	this.id = id;
	this.product = product;
	this.submittedby = submittedby;
	this.approvedby = approvedby;
	this.edittype = edittype;
	this.editstatus = editstatus;
	this.description = description;
	this.justification = justification;
	this.editdate = editdate;
}

EditRequest.prototype.id = -1;
EditRequest.prototype.product = null;
EditRequest.prototype.submittedby = null;
EditRequest.prototype.approvedby = null;
EditRequest.prototype.edittype = "";
EditRequest.prototype.editstatus = "";
EditRequest.prototype.description = "";
EditRequest.prototype.justification = "";
EditRequest.prototype.editdate = "";

module.exports = EditRequest;