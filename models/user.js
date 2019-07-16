
// ************ for express sessions ***********
// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;

// var User = new Schema({
// 	username: {
// 		type: String,
// 		required: true,
// 		unique: true
// 	},
// 	password: {
// 		type: String,
// 		required: true
// 	},
// 	admin: {
// 		type: Boolean,
// 		default: false
// 	}


//************for passport****************

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose'); //stores encrypted (hashed) passwords

var User = new Schema({
	firstname: {
		type: String,
		default: ''
	},
	lastname: {
		type: String,
		default: ''
	},		
	admin: {
		type: Boolean,
		default: false  //to have an user with admin privileges you need to update this flag to "true" directly in the database, not through an API
	}
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);