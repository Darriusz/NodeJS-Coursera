const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all((req, res, next) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	next(); //to continue further operations below for /dishes
})
.get((req, res, next) => {
	res.end('Later on it will retrieve json data from a MongoDB here');
})
.post((req, res, next) => {
	res.end('When integrated with MongoDB it will add the dish name: ' + req.body.name + 
		' with the details: ' + req.body.description);
})
.put((req, res, next) => {
	res.statusCode = 403;
	res.end('PUT operation arbitrarily not supported on dishes');
})
.delete((req, res, next) => {
	res.end('Deleting all the dishes when integrated with MongoDB!!!');
});


dishRouter.route('/:dishId')
.get((req, res, next) => {
	res.end('When integrated with MongoDB it will give details of the dish:' + req.params.dishId + ' to you');
})
.post((req, res, next) => {
	res.statusCode = 403;
	res.end('POST operation not done on existing dishes');
})
.put((req, res, next) => {
	res.write('Updating the dish: ' + req.params.dishId + "\n");
	res.end('When integrated with MongoDB it will update the dish called: ' + req.body.name + 
		' with the following details: ' + req.body.description);
})
.delete((req, res, next) => {
	res.end('When integrated with MongoDB it will delete dish: ' + req.params.dishId);
});


module.exports = dishRouter;