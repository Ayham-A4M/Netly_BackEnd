const eventModel = require('../../models/event');
const followModel = require('../../models/follow');
const ObjectId = require('mongoose').Types.ObjectId;

const handleGetRightSideBarInformation = async (req, res, next) => {
    try {
        const userId = res.locals.id;
        // Get 3 upcoming events in the future that the user is interested in
        const upcomingEvents = await eventModel.aggregate([
            {
                $lookup: {
                    from: 'interestingIns',
                    let: { eventId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$eventId', '$$eventId'] },
                                        { $eq: ['$userId', new ObjectId(userId)] }
                                    ]
                                }
                            }
                        },
                        { $limit: 1 }
                    ],
                    as: 'userInterest'
                }
            },
            { $match: { date: { $gte: new Date() }, userInterest: { $ne: [] } } },
            { $sort: { date: 1 } },
            { $limit: 3 },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    date: 1,
                    eventType: 1,
                    location: 1,
                    meetingApplication: 1,
                    interestedCount: 1,
                }
            }
        ]);

        // Get 3 random followers who follow the user
        const followers = await followModel.aggregate([
            { $match: { userId: new ObjectId(userId) } },
            { $sample: { size: 3 } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'followerId',
                    foreignField: '_id',
                    as: 'followerInfo'
                }
            },
            { $unwind: '$followerInfo' },
            {
                $project: {
                    _id: 1,
                    followerId: 1,
                    createdAt: 1,
                    userName: '$followerInfo.userName',
                    avatar: '$followerInfo.avatar',
                    defaultCoverColor: '$followerInfo.defaultCoverColor',
                    title: '$followerInfo.title',
                }
            }
        ]);

        return res.status(200).send({ upcomingEvents, followers });
    } catch (err) {
        next(err);
    }
}

module.exports = handleGetRightSideBarInformation;