var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate =  require('../authenticate'); //needed for JWT tokens

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


//********** logging in endpoint with sessions (without token)  *************
// router.post('/login', passport.authenticate('local'), (req, res) => {
// 	res.statusCode=200;
// 	res.setHeader('Content-Type', 'application/json');
// 	res.json({sucess: true, status: 'You are logged in'});
// });


//********** logging in endpoint with token (without sessions)  *************
router.post('/login', passport.authenticate('local'), (req, res) => {

	var token = authenticate.getToken({_id: req.user._id}); //creating of a token for an authenticated user
	res.statusCode=200;
	res.setHeader('Content-Type', 'application/json');
	res.json({sucess: true, token: token, status: 'You are logged in'});
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
