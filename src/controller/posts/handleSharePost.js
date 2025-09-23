const AppError = require("../../utils/AppError");
const postModel = require('../../models/post');
const pushNotification = require('../../helper/dataBase/pushNotification');
const increamentPostField = require('../../helper/increamentPostField');
const handleSharePost = async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const userId = res.locals.id;
        const { content, feeling, publishedAt } = req.body;
        if (!postId) { throw new AppError(400, 'no specific post') }
        const validPost = await postModel.findById(postId);
        if (validPost) {
            const newPost = {
                sharedPostId: postId,
                userId: userId,
                publishedAt: publishedAt
            };
            if (content) { newPost.content = content }
            if (feeling) { newPost.feeling = feeling }
            const save_post = new postModel(newPost);
            const response = await save_post.save();
            if (response) {
                const [res1, res2] = await Promise.all([increamentPostField(postId, 'sharedCount', 1), pushNotification(validPost.userId, userId, 'share', response?._id)]);
                return res.status(200).send({ msg: "post shared" });
            }
        } else {
            throw new AppError(404, 'post not found');
        }
    } catch (err) {
        next(err);
    }
}
module.exports = handleSharePost;