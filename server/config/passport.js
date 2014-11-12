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
	
	passport.use('local-signup', new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function(req, email, password, done) {
			Users.findByEmail(email,function(err, user) {
				if(err)
					return done(err);
					
				if(user) {
					return done(null, false, req.flash('signupMessage','That email is already registered'));
				}
				else {
					Users.registerUser(email, password, function(err, user) {
						if(err)
							return done(err);
						
						return done(null, user);
					});
				}
			});
		})
	);
	
	passport.use('local-signin', new LocalStrategy(
		{
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback : true // allows us to pass back the entire request to the callback
		},
		function(req, email, password, done) { // callback with email and password from our form
        
        Users.checkLogin(email, password, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'Login failed.'));
				
			return done(null,user);
		});

    }));
}
