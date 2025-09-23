const updatePostSchema = require('./schemas/updatePost.schema');
const validateUpdatePost = (req, res, next) => {
    try {
        const { error } = updatePostSchema.validate(req.body);
        if (error) {
            console.log(error);
            throw error
        }
        next();
    } catch (err) {
        next(err);
    }
}
module.exports = validateUpdatePost