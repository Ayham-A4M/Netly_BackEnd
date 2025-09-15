const { default: mongoose } = require("mongoose");
const { Types: { ObjectId } } = mongoose;
// for normal user
const interestinginSchema = new mongoose.Schema({
    userId: { type: ObjectId, required: true, ref: 'user' }, // who create the event
    eventId: { type: ObjectId, required: true,ref:'event' },
});

const interestinginModel = mongoose.model('interestingIn', interestinginSchema, 'interestingIns');

module.exports = interestinginModel;