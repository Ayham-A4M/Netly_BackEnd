const commentModel = require('../../models/comment');
const AppError = require('../../utils/AppError');

const handleUpdateComment = async (req, res, next) => {
    try {
        const userId = res.locals.id;
        const commentId = req.params.id;
        const { content } = req.body;
        if (!content || typeof content !== 'string' || !content.trim()) {
            throw new AppError(400, 'Content must not be empty');
        }
        const updated = await commentModel.findOneAndUpdate(
            { _id: commentId, userId },
            { content },
        );
        if (!updated) {
            throw new AppError(404, 'Comment not found or not authorized');
        }
        return res.status(200).send({ msg: 'Comment updated successfully' });
    } catch (err) {
        next(err);
    }
};
module.exports = handleUpdateComment;