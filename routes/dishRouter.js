const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Dishes = require('../models/dishes');

//*********wersja bez mongoose**************
// dishRouter.route('/')
// .all((req, res, next) => {
// 	res.statusCode = 200;
// 	res.setHeader('Content-Type', 'text/plain');
// 	next(); //to continue further operations below for /dishes
// })
// .get((req, res, next) => {
// 	res.end('Later on it will retrieve json data from a MongoDB here');
// })
// .post((req, res, next) => {
// 	res.end('When integrated with MongoDB it will add the dish name: ' + req.body.name + 
// 		' with the details: ' + req.body.description);
// })
// .put((req, res, next) => {
// 	res.statusCode = 403;
// 	res.end('PUT operation arbitrarily not supported on dishes');
// })
// .delete((req, res, next) => {
// 	res.end('Deleting all the dishes when integrated with MongoDB!!!');
// });


// dishRouter.route('/:dishId')
// .get((req, res, next) => {
// 	res.end('When integrated with MongoDB it will give details of the dish:' + req.params.dishId + ' to you');
// })
// .post((req, res, next) => {
// 	res.statusCode = 403;
// 	res.end('POST operation not done on existing dishes');
// })
// .put((req, res, next) => {
// 	res.write('Updating the dish: ' + req.params.dishId + "\n");
// 	res.end('When integrated with MongoDB it will update the dish called: ' + req.body.name + 
// 		' with the following details: ' + req.body.description);
// })
// .delete((req, res, next) => {
// 	res.end('When integrated with MongoDB it will delete dish: ' + req.params.dishId);
// });


dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);}) //for cors preflight 
.get(cors.cors, (req, res, next) => {
	Dishes.find({})
	.populate('comments.author')
	.then((dishes) => {
		res.statusCode=200;
		res.setHeader('Content-Type', 'application/json');
		res.json(dishes);
	}, (err) => next(err))
	.catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	Dishes.create(req.body)
	.then((dish) => {
		console.log('Dish created: ', dish);
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json')
		res.json(dish);
	}, (err) => next(err))
	.catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on the whole list of dishes');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	Dishes.deleteMany({})
	.then ((resp) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
});


dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);}) //for cors preflight 
.get(cors.cors, (req, res, next) => {
	Dishes.findById(req.params.dishId)
	.populate('comments.author')
	.then((dish) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(dish);
	}, (err) => nest(err))
	.catch((err) =>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	res.statusCode = 403;
	res.end('POST operation not done on existing dishes');
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	res.write('Updating the dish: ' + req.params.dishId + "\n");
	Dishes.findByIdAndUpdate(req.params.dishId, {
		$set: req.body}, {new: true})
	.then((dish) => {
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(dish);
	}, (err) => next(err))
	.catch((err) =>next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	Dishes.findByIdAndDelete(req.params.dishId).
	then((resp) =>{
		res.statusCode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.json(resp);
	}, (err) => next(err))
	.catch((err) => next(err));
});


dishRouter.route('/:dishId/comments')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);}) //for cors preflight 
.get(cors.cors, (req, res, next) => {
	Dishes.findById(req.params.dishId)
	.populate('comments.author')	
	.then((dish) => {
		if (dish != null) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(dish.comments);
		}
		else {
			err = new Error('Dish ' + req.params.dishId + ' not found.');
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
	.catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	Dishes.findById(req.params.dishId)
	.then((dish) => {
		if (dish != null) {
			req.body.author = req.user._id; //author taken from the authenticate.verifyUser
			dish.comments.push(req.body);
			dish.save()
			.then((dish) => {
				Dishes.findById(dish._id)
					.populate('comments.author')
					.then((dish) => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(dish);						
					})
			}, (err) => next(err));
		}
		else {
			err = new Error('Dish ' + req.params.dishId + ' not found.');
			err.status = 404;
			return next(err);
		}
	}, (err) => next(err))
	.catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	res.statusCode = 403;
	res.end('PUT operation not supported on /dishes/' + req.params.dishId +'/comments');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
	Dishes.findById(req.params.dishId)
	.then((dish) => {
		if (dish != null) {
			for (var i = (dish.comments.length-1); i>=0; i--){
				dish.comments.id(dish.comments[i]._id).remove();
			}
			dish.save()
			.then((dish) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'application/json');
				res.json(dish);
			}, (err) => next(err));
		}
		else {
			err = new Error('Dish ' + req.params.dishId + ' not found.');
			return next(err);
		}
	}, (err) => next(err))
	.catch((err) => next(err));
});


dishRouter.route('/:dishId/comments/:commentId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);}) //for cors preflight 
.get(cors.cors, (req, res, next) => {
	Dishes.findById(req.params.dishId)
	.populate('comments.author')	
	.then((dish) => {
		if (dish != null 
			&& dish.comments.id(req.params.commentId) != null) {
			res.statusCode = 200;
			res.setHeader('Content-Type', 'application/json');
			res.json(dish.comments.id(req.params.commentId));
		}
		else if (dish == null) {
			err = new Error('Dish ' + req.params.dishId + ' not found.');
			err.status = 404;
			return next(err);
		}
		else {
			err = new Error('Comment ' + req.params.commentId + ' not found.');
			err.status = 404;
			return next(err);			
		}
	}, (err) => next(err))
	.catch((err) =>next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	res.statusCode = 403;
	res.end('POST operation not done on existing dishes' + req.params.dishId 
		+ '/comments/' + req.params.commentId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	Dishes.findById(req.params.dishId)
	.then((dish) => {
		if (dish != null && dish.comments.id(req.params.commentId) != null
			&& (req.user._id).equals(dish.comments.id(req.params.commentId).author._id)) {
			if (req.body.rating) {
				dish.comments.id(req.params.commentId).rating = req.body.rating;
			}			
			if (req.body.comment) {
				dish.comments.id(req.params.commentId).comment = req.body.comment;
			}
			dish.save()
			.then((dish) => {
				Dishes.findById(dish._id)
					.populate('comment.author')
					.then((dish) => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(dish);						
					})
			}, (err) => next(err));
		}
		else if (dish == null) {
			err = new Error('Dish ' + req.params.dishId + ' not found.');
			err.status = 404;
			return next(err);
		}
		else if (!(req.user._id).equals(dish.comments.id(req.params.commentId).author._id)) {
				res.statusCode = 403;
				res.end('This is an operation supported only by the comment\'s author');
		}
		else
		{
			err = new Error('Comment ' + req.params.commentId + ' not found.');
			err.status = 404;
			return next(err);			
		}
	}, (err) => next(err))
	.catch((err) =>next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
	Dishes.findById(req.params.dishId)
	.then((dish) => {
		if (dish != null && dish.comments.id(req.params.commentId) != null
			&& (req.user._id).equals(dish.comments.id(req.params.commentId).author._id)) {
			dish.comments.id(req.params.commentId).remove();
			dish.save()
			.then((dish) => {
				Dishes.findById(dish._id)
					.populate('comment.author')
					.then((dish) => {
						res.statusCode = 200;
						res.setHeader('Content-Type', 'application/json');
						res.json(dish);						
					})
			}, (err) => next(err));
		}
		else if (dish == null) {
			err = new Error('Dish ' + req.params.dishId + ' not found.');
			err.status = 404;
			return next(err);
		}
		else if (!(req.user._id).equals(dish.comments.id(req.params.commentId).author._id)) {
				res.statusCode = 403;
				res.end('This is an operation supported only by the comment\'s author');
		}
		else {
			err = new Error('Comment ' + req.params.commentId + ' not found.');
			err.status = 404;
			return next(err);			
		}
	}, (err) => next(err))
	.catch((err) => next(err));
});


module.exports = dishRouter;