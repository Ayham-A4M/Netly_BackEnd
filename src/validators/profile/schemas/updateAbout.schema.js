const Joi = require('joi');
const updateAboutSchema = Joi.object({
   bio:Joi.string().max(1024).optional(),
   title:Joi.string().max(500).optional(),
   links:Joi.array().items(Joi.string()).max(3).optional(),
   location:Joi.string().regex(/^[A-Z][a-zA-Z]+-[A-Z][a-zA-Z]+$/).optional(),
})

module.exports = updateAboutSchema