const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/verifyUser');
// handler
const handleCreatePost = require('../controller/posts/handleCreatePost');
const handleGetPosts = require('../controller/posts/handleGetPosts');
const handleReactOnPost = require('../controller/posts/handleReactOnPost');
// validators
const createPostValidator = require('../validators/posts/createPost.validator');
const validateReactionOnPost = require('../validators/posts/reaction.validator');
const handleDeletePost = require('../controller/posts/handleDeletePost');
const upload = require('../utils/imageUpload');
const handleDeleteReaction = require('../controller/posts/handleDeleteReaction');
const handleGetPost = require('../controller/posts/handleGetPost');

// get
router.get('/api/post/getPosts', verifyUser, handleGetPosts)
router.get('/api/post/:postId', verifyUser, handleGetPost)



// post
router.post('/api/post/createPost', verifyUser, upload.array('postImages'), createPostValidator, handleCreatePost);
router.post('/api/post/react', verifyUser, validateReactionOnPost, handleReactOnPost);

router.delete('/api/post/:postId', verifyUser, handleDeletePost);
router.delete('/api/post/react/:postId', verifyUser, handleDeleteReaction);


module.exports = router;