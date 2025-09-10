const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/verifyUser');
// handler
const handleGetComments = require('../controller/comment/handleGetComments');
const handleCreateComment = require('../controller/comment/handleCreateComment');
const handleReactionOnComment = require('../controller/comment/handleReactionOnComment');
const handleGetCommentReplies = require('../controller/comment/handleGetCommentReplies');
// validators
const validateCommentOnPost = require('../validators/comment/comment.validator');
const validateReplyOnComment = require('../validators/comment/reply.validator');
const validateReactionOnComment = require('../validators/comment/commentReaction.validator');
const handleCreateReplyOnComment = require('../controller/comment/handleCreateReplyOnComment');
const handleDeleteReaction = require('../controller/comment/handleDeleteReaction');
// const validateReactionOnPost = require('../validators/posts/reaction.validator');
// const handleDeletePost = require('../controller/posts/handleDeletePost');

router.get('/api/comment/getCommentReplies', verifyUser, handleGetCommentReplies)
router.get('/api/comment/getComments', verifyUser, handleGetComments)

router.post('/api/comment/newComment', verifyUser, validateCommentOnPost, handleCreateComment);
router.post('/api/comment/react', verifyUser, validateReactionOnComment, handleReactionOnComment);
router.post('/api/comment/reply', verifyUser, validateReplyOnComment, handleCreateReplyOnComment);

router.delete('/api/comment/react/:id', verifyUser, handleDeleteReaction);



module.exports = router;