const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Promotions = require('../models/promotions');


promoRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);}) //for cors preflight 
.get(cors.cors, (req, res, next) => {
	Promotions.find({})
	.then((promotions) => {
		res.statusCode=200;
		res.setHeader('Content-Type', 'application/json');
		res.json(promotions);
	}, (err) => next(err))
	.catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	Promotions.create(req.body)
	.then((promotion) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json')
		res.json(promotion);
	}, (err) => next(err))
	.catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on the whole list of promotions');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	Promotions.deleteMany({})
	.then ((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
});


promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);}) //for cors preflight 
.get(cors.cors, (req, res, next) => {
	Promotions.findById(req.params.promoId)
	.then((promotion) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(promotion);
	}, (err) => nest(err))
	.catch((err) =>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	res.statusCode = 403;
	res.end('POST operation not done on existing promotions');
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	res.write('Updating the promotion: ' + req.params.promoId + "\n");
	Promotions.findByIdAndUpdate(req.params.promoId, {
		$set: req.body}, {new: true})
	.then((promotion)=>{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(promotion);
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	Promotions.findByIdAndDelete(req.params.promoId)
	.then((resp) =>{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
});


module.exports = promoRouter;