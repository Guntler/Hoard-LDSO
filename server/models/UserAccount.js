var UserAccount = function (id, email/*, password*/, permissions, registerdate, favorites, loggedin) {
	this.id = id;
	this.email = email;
	//this.password = password;
	this.permissions = permissions;
	this.registerdate = registerdate;
	this.favorites = favorites;
	this.loggedin = loggedin;
}



UserAccount.prototype.id = -1;
UserAccount.prototype.name = "";
//UserAccount.prototype.password = "";
UserAccount.prototype.permissions = "";
UserAccount.prototype.registerdate = "";
UserAccount.prototype.favorites = [];
UserAccount.prototype.loggedin = false;

module.exports = UserAccount;