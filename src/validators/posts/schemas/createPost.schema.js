const Joi = require('joi');
const feelingArray = [
  "happy",
  "blessed",
  "excited",
  "sad",
  "angry",
  "tired",
  "loved",
  "confused",
  "proud",
  "grateful",
  "nostalgic",
  "cool",
  "sick",
  "funny",
  "romantic",
  ""
];
const createPostSchema = Joi.object({
    content: Joi.string().min(1).max(3072).optional(),
    feeling: Joi.string().valid(...feelingArray).min(3).max(25).optional(),
    tags: Joi.array().items(Joi.string()).min(1).max(10).required(),
    visibility: Joi.string().valid('public', 'private').required(),
    publishedAt:Joi.date().required(),
})



module.exports = createPostSchema