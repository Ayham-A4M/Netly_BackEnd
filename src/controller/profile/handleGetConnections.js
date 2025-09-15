const paginitionVariables = require('../../helper/paginitionVariables')
const calculateNumberOfPages = require('../../helper/calculateNumberOfPages')
const followModel = require('../../models/follow');
const userModel = require('../../models/user');
const ObjectId = require('mongoose').Types.ObjectId;
const handleGetConnections = async (req, res, next) => {
    const GetFollowers = async (skip, limit, userId, searchByName) => {
        const response = await followModel.aggregate([
            {
                $match: {
                    userId: new ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'followerId',
                    foreignField: '_id',
                    as: 'userInformation'
                }
            },
            {
                $unwind: '$userInformation'
            },
            {
                $match: {
                    'userInformation.userName': {
                        $regex: searchByName, // user's search input
                        $options: 'i' // case-insensitive
                    }
                }
            },
            {
                $project: {
                    userName: "$userInformation.userName",
                    avatar: "$userInformation.avatar",
                    defaultCoverColor: "$userInformation.defaultCoverColor",
                    title: "$userInformation.title",
                    createdAt: true,
                    _id: true,
                    followerId: true,
                }
            }
        ]).skip(skip).limit(limit);
        console.log(response);
        return response;
    }

    const GetFollowing = async (skip, limit, userId, searchByName) => {
        const response = await followModel.aggregate([
            {
                $match: {
                    followerId: new ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userInformation'
                }
            },
            {
                $unwind: '$userInformation'
            },
            {
                $match: {
                    'userInformation.userName': {
                        $regex: searchByName, // user's search input
                        $options: 'i' // case-insensitive
                    }
                }
            },
            {
                $project: {
                    userName: "$userInformation.userName",
                    avatar: "$userInformation.avatar",
                    defaultCoverColor: "$userInformation.defaultCoverColor",
                    title: "$userInformation.title",
                    createdAt: true,
                    _id: true,
                    userId: true,
                }
            }
        ]).skip(skip).limit(limit);
        console.log(response);
        return response;
    }
    const GetSuggestion = async (skip, limit, currentUserId, searchByName) => {


        const suggestions = await userModel.aggregate([
            {
                // Match everyone except the current user
                $match: {
                    userName: {
                        $regex: searchByName, // user's search input
                        $options: 'i' // case-insensitive
                    },
                    _id: { $ne: new ObjectId(currentUserId) },
                }
            },
            {
                // Left join follows to see if current user follows this user
                $lookup: {
                    from: 'follows',
                    let: { userId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$userId', '$$userId'] },
                                        { $eq: ['$followerId', new ObjectId(currentUserId)] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'isFollowed'
                }
            },
            {
                // Only keep users not followed by current user
                $match: {
                    isFollowed: { $size: 0 }
                }
            },
            {
                // Optionally limit fields returned
                $project: {
                    _id: 1,
                    defaultCoverColor: 1,
                    userName: 1,
                    avatar: 1,
                    title: 1
                }
            }
        ]).skip(skip).limit(limit);

        console.log(suggestions);
        return suggestions;
    }
    const escapeRegex = (text) => {
        const t = text.trim();
        return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }


    try {
        const userId = res.locals.id;
        const seachByName = req.query.seachByName;
        const getFollowers = req.params.getFollowers; //boolean for get followers or following
        const page = req.query.page || 1;
        const { skip, limit } = paginitionVariables(page, 15); // limit of documents will return that allow to get in each page 15 in this case


        let response;
        if (getFollowers === "true") {
            response = await GetFollowers(skip, limit, userId, escapeRegex(seachByName));
        } else if (getFollowers === "false") {
            response = await GetFollowing(skip, limit, userId, escapeRegex(seachByName));
        } else if (getFollowers === "null") {
            response = await GetSuggestion(skip, limit, userId, escapeRegex(seachByName));
        }
        if (response && page == 1) {

            if (getFollowers === "true") {
                let numberOfDocs = await followModel.countDocuments({ userId: userId });
                console.log(numberOfDocs);
                return res.status(200).send({ followers: response, limitOfPages: calculateNumberOfPages(numberOfDocs, limit) });
            } else if (getFollowers === "false") {
                let numberOfDocs = await followModel.countDocuments({ followerId: userId });
                return res.status(200).send({ following: response, limitOfPages: calculateNumberOfPages(numberOfDocs, limit) });
            } else if (getFollowers === "null") {
                return res.status(200).send({ suggestions: response });
            }

        } else if (response) {
            if (getFollowers === "true") {
                return res.status(200).send({ followers: response })
            }
            else if (getFollowers === "false") {
                return res.status(200).send({ following: response })
            }
        }
    } catch (err) {
        next(err)
    }
}
module.exports = handleGetConnections;