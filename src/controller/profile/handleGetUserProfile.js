const postModel = require('../../models/post');
const userModel = require('../../models/user');
const ObjectId = require('mongoose').Types.ObjectId
const userReactionPipleine = require('../../helper/dataBase/userReactionPipline');
const sharedPostPipeline=require('../../helper/dataBase/sharedPostPipeline');
const handleGetUserProfile = async (req, res, next) => {
    const getUserPosts = async (userId) => {
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
            // Add this new $lookup stage to check for user reaction
            ...sharedPostPipeline(userId),
            ...userReactionPipleine(userId)
            ,
            {
                $addFields: {
                    isEditable: {
                        $cond: {
                            if: { $eq: ['$userId', new ObjectId(userId)] },
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
                    defaultCoverColor:"$userInformation.defaultCoverColor",
                    userId: true,
                    feeling: true,
                    content: true,
                    images: true,
                    tags: true,
                    loveCount: true,
                    commentsCount: true,
                    sharedCount: true,
                    publishedAt: true,
                    isEditable: true,
                    _id: true,
                    userReaction: true,  // Include the user's reaction in the output
                    sharedPost:true
                }
            },
            {
                $sort: { publishedAt: -1 }
            }
        ])
        return response;
    }


    try {
        const userId = res.locals.id;
        const [profile, userPosts] = await Promise.all([userModel.findById(userId, { tokenVersion: false, email: false, password: false }), getUserPosts(userId)])
        return res.status(200).send({ profile, posts: userPosts });
    } catch (err) {
        next(err)
    }
}
module.exports = handleGetUserProfile