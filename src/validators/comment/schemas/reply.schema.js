const Joi = require('joi');
const replySchema = Joi.object({
   commentId:Joi.string().required(),
   content:Joi.string().max(3000).required(),
   postId:Joi.string().required(),
   commentOwnerId:Joi.string().required()
})

module.exports = replySchema