const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const multer = require('multer');


//********* configuration of multer *******
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'public/images');
	},
	filename: (req, file, callback) => {
		callback(null, file.originalname)   //file.originalname wezmie ierwotną nazwę ładowanego pliku, inaczej multer nada swoją przypadkową bez rozszerzenia
	}
});

const imageFileFilter = (req, file, callback) => {
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
		return callback(new Error('You can only upload image files'), false);
	}
	else {
		callback(null, true); //the file type is OK
	}
};

const upload = multer({storage: storage, fileFilter: 
	imageFileFilter});


//********* configuration of the router *******
const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);}) //for cors preflight 
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, 
	upload.single('imageFile'), (req, res) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(req.file); //will send the path to the uploaded file for the admin to include it in the dish description
})
.get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	res.statusCode = 403;
	res.end('GET operation not supported on /imageUpload');
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on /imageUpload');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	res.statusCode = 403;
	res.end('DELETE operation not supported on /imageUpload');
})

module.exports = uploadRouter;