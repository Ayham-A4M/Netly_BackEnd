const eventModel = require('../../models/event');
const interestingInModel = require('../../models/interestingin');
const handleUnInterestingEvent = async (req, res, next) => {
    try {
        const eventId = req.params.eventId;
        const userId = res.locals.id;
        const [res1, res2] = await Promise.all([eventModel.findByIdAndUpdate(eventId, { $inc: { interestedCount: -1 } }), interestingInModel.findOneAndDelete({ userId: userId, eventId: eventId })]);
        if (res1 && res2) {
            return res.status(200).send({ msg: "event remove from upcoming event" });
        }
    } catch (err) {
        next(err);
    }
}

module.exports = handleUnInterestingEvent;