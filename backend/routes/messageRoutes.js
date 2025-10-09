

const express = require('express');
const messageController = require('../controllers/messageController');
const isAuthenticated = require('../middleware/isAuthenticated');


const router = express.Router();


router.use(isAuthenticated); 

router
    .route('/')
    .post(messageController.sendMessage);

module.exports = router;