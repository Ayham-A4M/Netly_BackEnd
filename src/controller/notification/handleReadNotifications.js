const notificationModel = require('../../models/notification');
const handleReadNotifications = async (req, res, next) => {
    try {
        const userId = res.locals.id;
        const response = await notificationModel.updateMany({ receiverId: userId, isRead: false }, { $set: { isRead: true } });
        if (response) {
            return res.status(200).send({});
        }
    } catch (err) {
        next(err);
    }
}
module.exports = handleReadNotifications;