const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());
const mongoose = require('mongoose');
const Promotions = require('../models/promotions');


promoRouter.route('/')
.get((req, res, next) => {
	Promotions.find({})
	.then((promotions) => {
		res.statusCode=200;
		res.setHeader('Content-Type', 'application/json');
		res.json(promotions);
	}, (err) => next(err))
	.catch((err) => next(err));
})
.post((req, res, next) => {
	Promotions.create(req.body)
	.then((promotion) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json')
		res.json(promotion);
	}, (err) => next(err))
	.catch((err) => next(err));
})
.put((req, res, next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on the whole list of promotions');
})
.delete((req, res, next) => {
	Promotions.deleteMany({})
	.then ((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
});


promoRouter.route('/:promoId')
.get((req, res, next) => {
	Promotions.findById(req.params.promoId)
	.then((promotion) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(promotion);
	}, (err) => nest(err))
	.catch((err) =>next(err));
})
.post((req, res, next) => {
	res.statusCode = 403;
	res.end('POST operation not done on existing promotions');
})
.put((req, res, next) => {
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
.delete((req, res, next) => {
	Promotions.findByIdAndDelete(req.params.promoId)
	.then((resp) =>{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
});


module.exports = promoRouter;