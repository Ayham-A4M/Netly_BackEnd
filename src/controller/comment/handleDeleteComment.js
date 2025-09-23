const commentModel = require('../../models/comment');
const AppError = require('../../utils/AppError');
const increamentPostField = require('../../helper/increamentPostField');

const handleDeleteComment = async (req, res, next) => {
    try {
        const userId = res.locals.id;
        const commentId = req.params.id;
        const deleted = await commentModel.findOneAndDelete({ _id: commentId, userId });
        if (!deleted) {
            throw new AppError(404, "Comment not found or not authorized");
        }
        // Decrement post's commentCount by -1
        await increamentPostField(deleted.postId, 'commentsCount', -1);
        res.status(200).send({ msg: 'comment deleted successfully' });
    } catch (err) {
        next(err);
    }
};



module.exports = handleDeleteComment;