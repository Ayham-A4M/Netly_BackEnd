
const commentModel = require('../../models/comment')
const commentReactionModel = require('../../models/commentReaction');
const pushNotification=require('../../helper/dataBase/pushNotification');
const handleReactionOnComment = async (req, res, next) => {
    try {
        const { commentOwnerId, commentId,postId } = req.body;
        const userId = res.locals.id;
        const reactionObject = {
            userId,
            commentId,
            commentOwnerId
        }
        const reaction_save = new commentReactionModel(reactionObject);
        const response = await reaction_save.save();
        if (response) {
            await commentModel.findByIdAndUpdate(commentId, { $inc: { loveCount: 1 } }) // new reaction
            await pushNotification(commentOwnerId,userId,'comment_reaction',postId)
        }
        return res.status(200).send({ msg: 'reaction published' })
        

    } catch (err) {
        next(err);
    }
}
module.exports = handleReactionOnComment;