const commentReactionSchema = require('./schemas/commentReaction.schema');
const valiReactionOnComment = (req, res, next) => {
    try {
        const { error } = commentReactionSchema.validate(req.body);
        if (error) {
            console.log(error);
            throw error
        }
        next();
    } catch (err) {
        next(err);
    }
}
module.exports = valiReactionOnComment