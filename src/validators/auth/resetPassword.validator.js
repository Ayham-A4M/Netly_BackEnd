const resetPasswordSchema = require('./schemas/resetPassword.schema');
const validateResetPassword = (req, res, next) => {
    try {
        const { error } = resetPasswordSchema.validate(req.body);
        if (error) {
            console.log(error);
            throw error
        }
        next();
    } catch (err) {
        next(err);
    }
}
module.exports = validateResetPassword