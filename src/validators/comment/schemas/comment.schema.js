const Joi = require('joi');
const commentSchema = Joi.object({
   postId:Joi.string().required(),
   content:Joi.string().max(3000).required(),
   postOwnerId:Joi.string().required(),
})

module.exports = commentSchema