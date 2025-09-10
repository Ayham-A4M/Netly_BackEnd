const reactionSchema = require('./schemas/reaction.schema');
const validateReactionOnPost = (req, res, next) => {
    try {
        const { error } = reactionSchema.validate(req.body);
        if (error) {
            console.log(error);
            throw error
        }
        next();
    } catch (err) {
        next(err);
    }
}
module.exports = validateReactionOnPost