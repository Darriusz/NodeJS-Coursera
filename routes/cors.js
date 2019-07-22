const express = require('express');
const cors = require('cors');
const app = express();

// ***** whitelist with allowed origins
const whitelist = ['http://localhost:3000', 'https://localhost:3443'];
var corsOptionsDelegate = (req, callback) => {
	var corsOptions;

	if(whitelist.indexOf(req.header('Origin')) !==-1) { //if there's an Origin in the req header
		corsOptions = {origin: true};  //so cors module gives an OK to this origin
	}
	else {
		corsOptions = {origin: false};
	}
	callback(null, corsOptions);
};

exports.cors = cors();  //this replies with wild card toll (*) access control; good especially for GET
exports.corsWithOptions = cors(corsOptionsDelegate); //replies with the defined options