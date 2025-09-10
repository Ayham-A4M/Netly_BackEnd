const replySchema = require('./schemas/reply.schema');
const validateReplyOnComment = (req, res, next) => {
    try {
        const { error } = replySchema.validate(req.body);
        if (error) {
            console.log(error);
            throw error
        }
        next();
    } catch (err) {
        next(err);
    }
}
module.exports = validateReplyOnComment