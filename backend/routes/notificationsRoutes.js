

const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated'); 
const notificationsController = require('../controllers/notificationsController'); 

const router = express.Router();


router.use(isAuthenticated); 


router.get('/', notificationsController.getNotifications);


router.patch('/read-all', notificationsController.markAllRead);


module.exports = router;