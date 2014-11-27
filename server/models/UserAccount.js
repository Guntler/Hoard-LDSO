util = require('../database/utilities');

var UserAccount = function (userid, email, permissions, registerdate) {
	this.userid = userid;
	this.email = email;
	this.permissions = permissions;
	this.registerdate = util.formatDate(new Date(registerdate));
}



UserAccount.prototype.userid = -1;
UserAccount.prototype.name = "";
UserAccount.prototype.permissions = "";
UserAccount.prototype.registerdate = "";

module.exports = UserAccount;