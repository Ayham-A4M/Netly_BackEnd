const sharePostSchema = require('./schemas/sharePost.schema');
const validateSharePost = (req, res, next) => {
    try {
        const { error } = sharePostSchema.validate(req.body);
        if (error) {
            console.log(error);
            throw error
        }
        next();
    } catch (err) {
        next(err);
    }
}
module.exports = validateSharePost