const userReactionPipleine = require('../../helper/dataBase/userReactionPipline');
const postModel = require('../../models/post');
const AppError = require('../../utils/AppError');
const ObjectId = require('mongoose').Types.ObjectId;
const sharedPostPipeline=require('../../helper/dataBase/sharedPostPipeline');
const handleGetPost = async (req, res, next) => {

    try {
        const postId = req.params.postId
        const userId = res.locals.id;
        if (!postId) { throw new AppError(404, "no specific post"); }
        const response = await postModel.aggregate([
            {
                $match: { _id: new ObjectId(postId) }
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
            ...sharedPostPipeline(userId),
            ...userReactionPipleine(userId)
            , {
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
                    defaultCoverColor: "$userInformation.defaultCoverColor",
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

        ])
        if(response){
            return res.status(200).send({posts:response});
        }
    } catch (err) {
        next(err);
    }
}
module.exports = handleGetPost