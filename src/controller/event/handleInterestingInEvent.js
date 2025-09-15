const eventModel = require('../../models/event');
const interestingInModel = require('../../models/interestingin');
const handleInterestingInEvent = async (req, res, next) => {
    try {
        const eventId = req.params.eventId;
        const userId = res.locals.id;
        const [res1, res2] = await Promise.all([
            new interestingInModel({ eventId, userId }).save(),
            eventModel.findByIdAndUpdate(eventId, { $inc: { interestedCount: 1 } })
        ])
        if(res1 && res2){
            return res.status(200).send({msg:"event added to upcoming events"});
        }
    } catch (err) {
        next(err)
    }
}
module.exports = handleInterestingInEvent;