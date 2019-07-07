const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req, res, next) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	next(); 
})
.get((req, res, next) => {
	res.end('Later on it will retrieve json data from a MongoDB here');
})
.post((req, res, next) => {
	res.end('When integrated with MongoDB it will add the promo name: ' + req.body.name + 
		' with the details: ' + req.body.description);
})
.put((req, res, next) => {
	res.statusCode = 403;
	res.end('PUT operation arbitrarily not supported on promotions');
})
.delete((req, res, next) => {
	res.end('Deleting all the promotions when integrated with MongoDB!!!');
});


promoRouter.route('/:promoId')
.get((req, res, next) => {
	res.end('When integrated with MongoDB it will give details of the promo:' + req.params.promoId + ' to you');
})
.post((req, res, next) => {
	res.statusCode = 403;
	res.end('POST operation not done on existing promotions');
})
.put((req, res, next) => {
	res.write('Updating the promotion: ' + req.params.promoId + "\n");
	res.end('When integrated with MongoDB it will update the promo called: ' + req.body.name + 
		' with the following details: ' + req.body.description);
})
.delete((req, res, next) => {
	res.end('When integrated with MongoDB it will delete promotion: ' + req.params.promoId);
});


module.exports = promoRouter;