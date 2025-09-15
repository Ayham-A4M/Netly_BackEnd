const newEventScheam = require('./schemas/newEvent.schema');
const validateCreatePost = (req, res, next) => {
    try {  
        const { error } = newEventScheam.validate(req.body)
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