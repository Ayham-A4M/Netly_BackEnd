const paginitionVariables = require('../../helper/paginitionVariables');
const eventModel = require('../../models/event');
const interestingInModel = require('../../models/interestingin')
const calculateNumberOfPages = require('../../helper/calculateNumberOfPages')
const ObjectId = require('mongoose').Types.ObjectId;
const handleGetEvents = async (req, res, next) => {
    const getUserEvents = async (userId,skip,limit) => {
        const response = await eventModel.aggregate([
            {
                $match: { userId: new ObjectId(userId) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userInformation'
                }
            }, {
                $unwind: "$userInformation"
            }, {
                $project: {
                    _id: true,
                    userId: true,
                    userName: "$userInformation.userName",
                    avatar: "$userInformation.avatar",
                    defaultCoverColor: "$userInformation.defaultCoverColor",
                    title: true,
                    date: true,
                    description: true,
                    eventType: true,
                    location: true,
                    meetingApplication: true,
                    interestedCount: true
                }
            }
        ]).skip(skip).limit(limit);
        return response;
    }
    const getSuggestionEvents = async (userId,skip,limit) => {
        const response = await eventModel.aggregate([
            {
                $match: {
                    userId: { $ne: new ObjectId(userId) },
                    date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
                }
            },
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
                        }
                    ],
                    as: 'userInterest'
                }
            },
            {
                $match: {
                    'userInterest': { $eq: [] } // Filter out events where user has shown interest
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userInformation'
                }
            }, {
                $unwind: "$userInformation"
            }, {
                $project: {
                    _id: true,
                    userId: true,
                    userName: "$userInformation.userName",
                    avatar: "$userInformation.avatar",
                    defaultCoverColor: "$userInformation.defaultCoverColor",
                    title: true,
                    date: true,
                    description: true,
                    eventType: true,
                    location: true,
                    meetingApplication: true,
                    interestedCount: true
                }
            }
        ]).skip(skip).limit(limit);
        return response;
    }
    const getUpcomingUserEvents = async (userId,skip,limit) => {
        const response = await interestingInModel.aggregate([
            { $match: { userId: new ObjectId(userId) } }, // filter early
            {
                $lookup: {
                    from: "events",
                    let: { eventId: "$eventId" },
                    pipeline: [
                        // { $match: { $expr: { $eq: ["$_id", "$$eventId"] }, date: { $gte: new Date() }, createdBy: { $ne: ObjectId("USER_ID") } } }
                        { $match: { $expr: { $eq: ["$_id", "$$eventId"] }, userId: { $ne: new ObjectId(userId) } } }
                    ],
                    as: "event"
                }
            },
            { $unwind: "$event" },
            {
                $lookup: {
                    from: "users",
                    localField: "event.userId",
                    foreignField: "_id",
                    as: "creator"
                }
            },
            { $unwind: "$creator" },
            {
                $project: {
                    _id: "$event._id",
                    userId: "$event._id",
                    userName: "$creator.userName",
                    avatar: "$creator.avatar",
                    defaultCoverColor: "$creator.defaultCoverColor",
                    title: "$event.title",
                    date: "$event.date",
                    description: "$event.description",
                    eventType: "$event.eventType",
                    location: "$event.location",
                    meetingApplication: "$event.meetingApplication",
                    interestedCount: "$event.interestedCount",

                }
            }
        ]).skip(skip).limit(limit);
        return response

    }
    try {
        const userId = res.locals.id;
        const filter = req.params.filter;
        const page = req.query.page || 1;
        const { skip, limit } = paginitionVariables(page, 10);
        let response;
        if (filter == "true") {
            response = await getUserEvents(userId,skip,limit);
        } else if (filter === "false") {
            response = await getSuggestionEvents(userId,skip,limit);
        } else {
            response = await getUpcomingUserEvents(userId,skip,limit);
        }

        if (response?.length > 0) {
            let numberOfDocs = 1;
            if (page == 1) {
                if (filter === "true") {
                    numberOfDocs = await eventModel.countDocuments({ userId: userId });
                } else if (filter === "false") {
                    const result = await eventModel.aggregate([
                        { $match: { userId: { $ne: new ObjectId(userId) } } },
                        {
                            $lookup: {
                                from: "interestingIns",
                                let: { eventId: "$_id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ["$eventId", "$$eventId"] },
                                                    { $eq: ["$userId", new ObjectId(userId)] }
                                                ]
                                            }
                                        }
                                    },
                                ],
                                as: "userInterest"
                            }
                        },
                        { $match: { userInterest: { $eq: [] } } },
                        { $count: "totalSuggestions" }
                    ])
                    console.log(result);
                    numberOfDocs = result[0]?.totalSuggestions



                } else {
                    numberOfDocs = await interestingInModel.countDocuments({ userId: userId })
                }

            }
            if (page == 1) {
                return res.status(200).send({ events: response, limitOfPages: calculateNumberOfPages(numberOfDocs, limit) })
            } else {
                return res.status(200).send({ events: response });
            }
        } else {
            return res.status(200).send({ events: [] });
        }


    } catch (err) {
        next(err);
    }
}
module.exports = handleGetEvents;