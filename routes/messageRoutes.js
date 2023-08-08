const express = require('express');
const routes = express.Router();
const { newMessage, getAllMessages } = require('../controllers/messageController.js');
const rateLimit = require('express-rate-limit');

const messageLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	// store: ... , // Use an external store for more precise rate limiting
})

// routes.get('/', (req, res) => {
//     res.send({message: 'Hello Lerry!'});
// });

routes.post('/newmessage', messageLimiter, newMessage);
routes.post('/inbox', getAllMessages);

module.exports = routes;