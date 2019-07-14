var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//************* sign-up of a new user endpoint ****************
router.post('/signup', (req, res, next) => {
	User.register(new User({username: req.body.username}), 
		req.body.password, (err, user) =>{
		if(err) {
			res.statusCode=500;
			res.setHeader('Content-Type', 'application/json');			
			res.json({err:err});
		}
		else {
			passport.authenticate('local')(req, res, () => {
				res.statusCode=200;
				res.setHeader('Content-Type', 'application/json');
				res.json({sucess: true, status: 'Registration successful!'});
			});
		}
	});
});


//********** logging in endpoint *************
router.post('/login', passport.authenticate('local'), (req, res) => {
	res.statusCode=200;
	res.setHeader('Content-Type', 'application/json');
	res.json({sucess: true, status: 'You are logged in'});
});


//************* logging out endpoint ****************
router.get('/logout', (req, res) => { //method GET as the user doesn't supply any new info anout himsef (is already logged in and recongnised by the server)
	if (req.session) { //if the session exists (otherwise can't log out)
		req.session.destroy(); //end the session and removes all cookies from server site
		res.clearCookie('session-id'); //asking the user to delete the cookie on his part, so he can't start a new session without logging in
		res.redirect('/');  //send the user to some standard page on the website (like index)
	}
	else {
		var err = new Error ('You are not logged in!'); //so you can't log out
		err.status = 403; //forbidden operation
		next(err);
	}		
});

module.exports = router;
