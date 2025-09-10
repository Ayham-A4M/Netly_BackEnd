const { date } = require('joi');
const calculateNumberOfPages = require('../../helper/calculateNumberOfPages');
const skipDocuments = require('../../helper/skipDocuments');
const notificationModel = require('../../models/notification');
const ObjectId = require('mongoose').Types.ObjectId;
const handleGetNotifications = async (req, res, next) => {
    const Limit = 15;
    try {
        const userId = res.locals.id;
        const page = req?.query?.page || 1;
        console.log(page, "  ", "page")
        const skip = skipDocuments(page, Limit);
        const response = await notificationModel.aggregate([
            {
                $match: {
                    receiverId: new ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'senderId',
                    foreignField: '_id',
                    as: 'userInformation'
                }
            },
            {
                $unwind: '$userInformation'
            }, {
                $project: {
                    userName: "$userInformation.userName",
                    avatar: "$userInformation.avatar",
                    defaultCoverColor: "$userInformation.defaultCoverColor",
                    message: true,
                    date: true,
                    isRead: true,
                    postId: true,
                    type: true,
                    senderId: true,
                }
            }
        ]).skip(skip).limit(Limit).sort({ date: -1 });
        console.log(response);
        if (response) {
        
            if (page == 1) {
                const numberOfDocuments = await notificationModel.countDocuments({ receiverId: userId });
                return res.status(200).send({ notifications: response, limit: calculateNumberOfPages(numberOfDocuments, Limit) })
            } else {
                return res.status(200).send({ notifications: response })
            }
        }
    } catch (err) {
        next(err);
    }
}
module.exports = handleGetNotifications;