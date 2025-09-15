const eventModel = require('../../models/event');
const handleCreateEvent = async (req, res, next) => {
    try {
        const userId = res.locals.id;
        const { eventType, title, description, date, meetingApplication, location } = req.body;
        const obj = {
            userId,
            title,
            description,
            date,
            eventType,
        }
        if (eventType === "onsite") {
            obj.location = location
        } else if (eventType === "online") {
            obj.meetingApplication = meetingApplication
        }
        const newEvent = new eventModel(obj);
        const response = await newEvent.save();
        if (response) {
            return res.status(200).send({ msg: "event created" });
        }
    } catch (err) {
        next(err);
    }
}
module.exports = handleCreateEvent;