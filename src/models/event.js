const { required } = require("joi");
const { default: mongoose } = require("mongoose");
const { Types: { ObjectId } } = mongoose;
// for normal user
const eventSchema = new mongoose.Schema({
    userId: { type: ObjectId, required: true }, // who create the event
    title: { type: String, required: true },
    description: { type: String, required: true },
    eventType: { type: String, enum: ['online', 'onsite'], required: true },
    location: { type: String, required: false },
    meetingApplication: { type: String, required: false },
    date: { type: Date, required: true },
    interestedCount: { type: Number, default: 0 }
});

const eventModel = mongoose.model('event', eventSchema, 'events');

module.exports = eventModel;