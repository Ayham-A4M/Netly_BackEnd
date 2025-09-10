const postModel = require('../../models/post')
const reactionModel = require('../../models/reaction');
const pushNotification = require('../../helper/dataBase/pushNotification');
const handleReactOnPost = async (req, res, next) => {
    try {
        const userId = res.locals.id;
        const { postId, postOwnerId } = req.body;
        const newReaction = new reactionModel({ postId, userId, postOwnerId });
        const response = await newReaction.save();
        if (response) {
            const [res1, res2] = await Promise.all([postModel.findByIdAndUpdate(postId, { $inc: { loveCount: 1 } }), pushNotification(postOwnerId, userId, 'post_reaction',postId)])
            return res.status(200).send({ msg: 'reaction complete' });
        }
    } catch (err) {
        next(err);
    }

}
module.exports = handleReactOnPost