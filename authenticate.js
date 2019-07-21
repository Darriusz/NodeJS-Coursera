var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var JwtStrategy = require('passport-jwt').Strategy; //jwt - jasonWebToken
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');

var config = require('./config');

exports.local = passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
	return jwt.sign(user, config.secretKey, 
		{expiresIn: 3600}) //here 3600 seconds = hour
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, 
	(jwt_payload, done) => {
		console.log("JWT payload: ", jwt_payload);
		User.findOne({_id: jwt_payload._id}, (err, user) => {
			if (err){
				return done(err, false); //false czyli user doesn't exist
			}
			else if (user) {
				return done (null, user); //null czyli no error
				}
				else {
					return done(null, false);
				}
		});
	}));

exports.verifyUser = passport.authenticate('jwt', {session: false}); //we are using JWT, not sessions, therefore "false"

exports.verifyAdmin = function (req, res, next) {
	if (req.user.admin === true)
		next();
	else {
		res.statusCode = 403;
		res.end('This operation requires elevated privileges.');
	}
}

// alternative "else" with error declaration
// else {
//         err = new Error('You are not authorized to perform this operation!');
//         err.status = 403;
//         next(err);
//     }
