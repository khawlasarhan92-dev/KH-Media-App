const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');
const upload = require('../middleware/multer');
const {createPost ,getAllPost,
  getUserPosts ,saveOrUnsavePost,
  deletePost ,likeOrDislikePost, addComment, getPostById} = require('../controllers/postController');


const router = express.Router();


router.post('/create-post',
  isAuthenticated,
  upload.single('image'),
  createPost);
router.get('/all', getAllPost);
router.get('/user-post/:id' ,getUserPosts);
router.get('/post/:id', getPostById);
router.post('/save-unsave-post/:postId',isAuthenticated ,saveOrUnsavePost);
router.delete('/delete-post/:id',isAuthenticated ,deletePost);
router.post('/like-dislike-post/:id',isAuthenticated ,likeOrDislikePost);
router.post('/comment/:id',isAuthenticated ,addComment);

module.exports = router;