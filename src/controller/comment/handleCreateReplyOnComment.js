const increamentCommentField = require('../../helper/increamentCommentField');
const replyModel = require('../../models/reply');
const pushNotification=require('../../helper/dataBase/pushNotification')
const handleCreateReplyOnComment = async (req, res, next) => {
    try {
        const userId = res.locals.id;
        const { content, commentId, postId, commentOwnerId } = req.body;
        const new_Reply = new replyModel({ userId, content, commentId, postId });
        const response = await new_Reply.save();
        if (response) {
            const [res1,res2]=await Promise.all([increamentCommentField(commentId, 'replyCount', 1),pushNotification(commentOwnerId,userId,'reply',postId)]);
        
            return res.status(200).send({ msg: 'reply published' });
        }
    } catch (err) {
        next(err);
    }
}
module.exports = handleCreateReplyOnComment;