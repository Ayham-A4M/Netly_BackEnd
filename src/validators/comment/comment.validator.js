const commentSchema = require('./schemas/comment.schema');
const validateCommentOnPost = (req, res, next) => {
    try {
        const { error } = commentSchema.validate(req.body);
        if (error) {
            console.log(error);
            throw error
        }
        next();
    } catch (err) {
        next(err);
    }
}
module.exports = validateCommentOnPost