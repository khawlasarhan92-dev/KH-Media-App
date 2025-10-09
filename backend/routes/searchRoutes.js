

const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');
const searchController = require('../controllers/searchController'); 

const router = express.Router();


router.use(isAuthenticated); 


router.get('/', searchController.searchAll);


module.exports = router;