var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//************* sign-up of a new user endpoint ****************
router.post('/signup', (req, res, next) => {
	User.findOne({username: req.body.username})
	.then((user) => {
		if(user != null) {
			var err = new Error('User ' + req.body.username + ' already exists');
			err.status = 403;
			next(err);  //this is an EXIT (return) with calling the error handler
		}
		else {
			return User.create({
				username: req.body.username,
				password: req.body.password})
		}
	})
	.then((user) => {
		res.statusCode=200;
		res.setHeader('Content-Type', 'application/json');
		res.json({status: 'Registration successful!', user: user});
	}), (err) => next(err)
	.catch((err) => next(err));
});


//********** logging in endpoint *************
router.post('/login', (req, res, next) => {

	  if (!req.session.user) {

    var authHeader = req.headers.authorization;
    if (!authHeader){
      var err = new Error('You are not authenticated');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];

    User.findOne({username: username})
    .then((user) => {

    	if (user===null){
 	      var err = new Error('User ' + username + ' does not exist');
	      err.status = 403;
	      return next(err);   		
    	}
    	else if (user.password !== password){
 	      var err = new Error('Your password is incorrect');
	      err.status = 403;
	      return next(err);
    	}

    	else if (user.username === username && user.password === password) {
    	   req.session.user = 'authenticated';
    	   res.statusCode = 200;
    	   res.setHeader('Content-Type', 'text/plain');
    	   res.end('You are authenticated');
	       next(); // this allows to pass through further
	    }
    })
    .catch((err) => next(err));
  }
  else { //in case the user is already logged in
  	res.statusCode = 200;
  	res.setHeader('Content-Type', 'text/plain');
  	res.end('You are already authenticated');
  }
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
