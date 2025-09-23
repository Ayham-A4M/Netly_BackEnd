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
const updatePostSchema = Joi.object({
    content: Joi.string().min(1).max(3072).required(),
    feeling: Joi.string().valid(...feelingArray).min(3).max(25).optional(),
})



module.exports = updatePostSchema