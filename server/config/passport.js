var LocalStrategy = require('passport-local');
var Users = require('../api/users');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	
	passport.deserializeUser(function(id, done) {
		Users.findById(id, function(err, user) {
			done(err, user);
		});
	});
}
