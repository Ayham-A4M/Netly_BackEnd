const commentReactionModel = require('../../models/commentReaction');
const commentModel = require('../../models/comment');
const handleDeleteReaction = async (req, res, next) => {
    try {
        const commentId = req.params.id;
        const userId = res.locals.id;
        const response = await commentReactionModel.findOneAndDelete({ commentId: commentId, userId: userId });
        if (response) {
            await commentModel.findByIdAndUpdate(commentId, { $inc: { loveCount: -1 } });
            return res.status(200).send({msg:"reaction disabled"});
        }
    } catch (err) {
        next(err);
    }
}
module.exports = handleDeleteReaction