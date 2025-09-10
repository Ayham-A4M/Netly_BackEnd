const postModel = require('../../models/post');
const handleDeletePost = async (req, res, next) => {
    try {
        const userId = res.locals.id;
        const postId = req.params.postId;
        const response = await postModel.findOneAndDelete({ _id: postId, userId: userId });
        if (response) {
            return res.status(200).send({ msg: 'post deleted', postId });
        }
    } catch (err) {
        next(err);
    }
}
module.exports = handleDeletePost