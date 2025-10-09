
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const isAuthenticated = require('../middleware/isAuthenticated'); 


router.use(isAuthenticated);


router.get('/', chatController.getChats);


router.post('/', chatController.createOrGetChat);


router.get('/:chatId/messages', chatController.getMessages);



module.exports = router;