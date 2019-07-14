
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
	admin: {
		type: Boolean,
		default: false
	}
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);