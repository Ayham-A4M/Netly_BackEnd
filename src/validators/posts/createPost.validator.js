const createPostSchema = require('./schemas/createPost.schema');
const validateCreatePost = (req, res, next) => {
    try {
        const postInformation= JSON.parse(req.body.postInformation);
        const { error } = createPostSchema.validate(postInformation);
        if (error) {
            console.log(error);
            throw error
        }
        next();
    } catch (err) {
        next(err);
    }
}
module.exports = validateCreatePost