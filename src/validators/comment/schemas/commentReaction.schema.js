const Joi = require('joi');
const commentReactionSchema = Joi.object({
    commentId:Joi.string().required(),
    commentOwnerId:Joi.string().required(),
    postId:Joi.string().required(),
})



module.exports = commentReactionSchema