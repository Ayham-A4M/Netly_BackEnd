const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/verifyUser');
const handleGetUserComments = require('../controller/activity/handleGetUserComments');
const handleGetPostsReactions = require('../controller/activity/handleGetPostsReactions');
const handleGetCommentsReactions = require('../controller/activity/handleGetCommentsReactions');

router.get('/api/activity/comments', verifyUser, handleGetUserComments);
router.get('/api/activity/postReactions', verifyUser, handleGetPostsReactions);
router.get('/api/activity/commentsReactions', verifyUser, handleGetCommentsReactions);
// router.get('/api/activity/sharing', verifyUser, handleGetUserComments);


module.exports = router;