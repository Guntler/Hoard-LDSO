var LocalStrategy = require('passport-local');
var Users = require('../database/users');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.userid);
	});
	
	passport.deserializeUser(function(id, done) {
		Users.findById(id, function(err, user) {
			done(err, user);
		});
	});
	
	passport.use('local-signin', new LocalStrategy(
		{
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback : true 
		},
		function(req, email, password, done) { 
        
        Users.checkLogin(email, password, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err) {
                return done(err);
			}

            // if no user is found, return the message
            if (!user) {
                return done(null, false, req.flash('loginMessage', "There's no user registered with that email/password."));
			}
			else if (user.permissions === "User")
				return done(null, false, req.flash('loginMessage', "You don't have the necessary permissions to sign in."));
			
			return done(null, user, req.flash('loginMessage', "Welcome " + user.email + "!"));
		});

    }));
}
