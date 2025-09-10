const Joi = require('joi');
const reactionSchema = Joi.object({
    postId:Joi.string().required(),
    postOwnerId:Joi.string().required(),
})



module.exports = reactionSchema