const updateAboutSchema = require('./schemas/updateAbout.schema');
const validateReactionOnPost = (req, res, next) => {
    try {
        const { error } = updateAboutSchema.validate(req.body);
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