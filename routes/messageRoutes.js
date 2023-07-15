const express = require('express');
const routes = express.Router();
const { newMessage, getAllMessages } = require('../controllers/messageController.js');

// routes.get('/', (req, res) => {
//     res.send({message: 'Hello Lerry!'});
// });

routes.post('/newmessage', newMessage);
routes.post('/inbox', getAllMessages);

module.exports = routes;