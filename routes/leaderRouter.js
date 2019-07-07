const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req, res, next) => {
	res.statusCode = 200;
	res.setHeader('Content-Type', 'text/plain');
	next(); 
})
.get((req, res, next) => {
	res.end('Later on it will retrieve json data from a MongoDB here');
})
.post((req, res, next) => {
	res.end('When integrated with MongoDB it will add the leader: ' + req.body.name + 
		' with the details: ' + req.body.description);
})
.put((req, res, next) => {
	res.statusCode = 403;
	res.end('PUT operation arbitrarily not supported on leaders');
})
.delete((req, res, next) => {
	res.end('Deleting all the leaders when integrated with MongoDB!!!');
});


leaderRouter.route('/:leaderId')
.get((req, res, next) => {
	res.end('When integrated with MongoDB it will give details of the leader:' + req.params.leaderId + ' to you');
})
.post((req, res, next) => {
	res.statusCode = 403;
	res.end('POST operation not done on existing leaders');
})
.put((req, res, next) => {
	res.write('Updating the leader: ' + req.params.leaderId + "\n");
	res.end('When integrated with MongoDB it will update the leader: ' + req.body.name + 
		' with the following details: ' + req.body.description);
})
.delete((req, res, next) => {
	res.end('When integrated with MongoDB it will delete leader: ' + req.params.leaderId);
});


module.exports = leaderRouter;