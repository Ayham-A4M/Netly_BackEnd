const Joi = require('joi');
const newEventSchema = Joi.object({
    title:Joi.string().min(1).max(100).required(),
    description:Joi.string().min(100).max(1024).required(),
    location:Joi.string().max(100).optional(),
    meetingApplication:Joi.string().max(50).optional(),
    date:Joi.date().required(),
    eventType:Joi.string().valid(...["onsite","online"]).required()

})



module.exports = newEventSchema