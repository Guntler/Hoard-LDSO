util = require('../database/utilities');

var UserAccount = function (id, email, permissions, registerdate, favorites, loggedin) {
	this.id = id;
	this.email = email;
	this.permissions = permissions;
	this.registerdate = util.formatDate(new Date(registerdate));
}



UserAccount.prototype.id = -1;
UserAccount.prototype.name = "";
UserAccount.prototype.permissions = "";
UserAccount.prototype.registerdate = "";

module.exports = UserAccount;