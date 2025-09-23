const postModel = require('../../models/post');
const userModel = require('../../models/user');
const ObjectId = require('mongoose').Types.ObjectId
const userReactionPipline = require('../../helper/dataBase/userReactionPipline');
const sharedPostPipeline = require('../../helper/dataBase/sharedPostPipeline');
const followModel = require('../../models/follow');
const handleGetUserProfileById = async (req, res, next) => {

    const getUserPosts = async (userId, userIdReq) => {
        const response = await postModel.aggregate([
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
            },
            {
                $unwind: '$userInformation'
            },
            ...sharedPostPipeline(userIdReq),
            ...userReactionPipline(userIdReq),
            {
                $addFields: {
                    isEditable: {
                        $cond: {
                            if: { $eq: ['$userId', new ObjectId(userIdReq)] },
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    userName: "$userInformation.userName",
                    avatar: "$userInformation.avatar",
                    defaultCoverColor: "$userInformation.defaultCoverColor",
                    userId: true,
                    feeling: true,
                    content: true,
                    images: true,
                    tags: true,
                    likesCount: true,
                    happyCount: true,
                    sadCount: true,
                    wowCount: true,
                    loveCount: true,
                    commentsCount: true,
                    sharedCount: true,
                    publishedAt: true,
                    isEditable: true,
                    _id: true,
                    userReaction: true,  // Include the user's reaction in the output
                    sharedPost: true
                }
            },
            {
                $sort: { publishedAt: -1 }
            }
        ])
        return response;
    }


    try {
        const userIdReq = res.locals.id; // who made the request
        const userId = req.query.userId;
        if (!userId) {
            throw new Error('no specific user');
        }
        if (userId === userIdReq) {
            const [profile, userPosts] = await Promise.all([userModel.findById(userId, { tokenVersion: false, email: false, password: false }), getUserPosts(userId, userIdReq)])
            return res.status(200).send({ profile, posts: userPosts, isEditableProfile: userId === userIdReq });
        }
        const [profile, userPosts, isFollowing] = await Promise.all([userModel.findById(userId, { tokenVersion: false, email: false, password: false }), getUserPosts(userId, userIdReq), followModel.findOne({ userId: userId, followerId: userIdReq })])

        return res.status(200).send({ profile, posts: userPosts, isEditableProfile: userId === userIdReq, isFollowing: !!isFollowing });

    } catch (err) {
        next(err)
    }
}
module.exports = handleGetUserProfileById