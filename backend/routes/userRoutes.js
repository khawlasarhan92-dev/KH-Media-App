const express = require('express');

const isAuthenticated = require('../middleware/isAuthenticated');
const { getProfile ,editProfile,
  getMe ,suggestedUser,followUnfollow } = require('../controllers/userController');
const upload = require('../middleware/multer');

const router = express.Router();



router.get('/profile/:id', getProfile);
router.post('/edit-profile',
   isAuthenticated,
   upload.single('profilePicture') 
   ,editProfile);
router.get('/suggested-user' , isAuthenticated , suggestedUser);
router.get('/me', isAuthenticated, getMe);
router.route('/follow/:id')
    .post(isAuthenticated, followUnfollow)
    .delete(isAuthenticated, followUnfollow);


module.exports = router;
