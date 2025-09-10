const reactionModel = require('../../models/reaction');
const postModel = require('../../models/post');
const handleDeleteReaction = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const userId = res.locals.id;
        const response = await reactionModel.findOneAndDelete({ userId: userId, postId: postId });
        if (response) {
            await postModel.findByIdAndUpdate(postId, { $inc: { loveCount: -1 } });
            return res.status(200).send({ msg: "reaction disabled" });
        }
    } catch (err) {
        next(err);
    }
}
module.exports = handleDeleteReaction