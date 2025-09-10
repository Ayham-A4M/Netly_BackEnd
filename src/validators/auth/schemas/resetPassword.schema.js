 const Joi = require('joi');
const resetPasswordSchema = Joi.object({
  newPassword:Joi.string().min(8).max(30).required()
})
module.exports = resetPasswordSchema