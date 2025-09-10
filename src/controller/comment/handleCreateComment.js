const commentModel = require('../../models/comment');
const increamentPostField = require('../../helper/increamentPostField');
const pushNotification = require('../../helper/dataBase/pushNotification');

const handleCreateComment = async (req, res, next) => {
    try {
        const userId = res.locals.id;
        const { postId, content,postOwnerId } = req.body;
        const newComment = new commentModel({ userId, postId, content });
        const response = await newComment.save();
        if (response) {
            const response = await Promise.all[increamentPostField(postId, 'commentsCount', 1),pushNotification(postOwnerId,userId,'comment',postId)]
            return res.status(200).send({ msg: 'comment published' });
        }
    } catch (err) {
        next(err);
    }
}
module.exports = handleCreateComment;