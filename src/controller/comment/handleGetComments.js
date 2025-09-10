const commentModel = require('../../models/comment');
const ObjectId = require('mongoose').Types.ObjectId;
const Limit = 10;
const skipDocuments = require('../../helper/skipDocuments');
const calculateNumberOfPages = require('../../helper/calculateNumberOfPages')
const handleGetComments = async (req, res, next) => {
    const postId = req.query.postId;
    const userId = res.locals.id;
    const page = req.query.page || 1;

    try {
        const response = await commentModel.aggregate([
            {
                $match: { postId: new ObjectId(postId) }
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
                $lookup: {
                    from: 'commentReactions',
                    let: { commentId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$commentId', '$$commentId'] },
                                        { $eq: ['$userId', new ObjectId(userId)] }
                                    ]
                                }
                            }
                        },
                        { $limit: 1 }
                    ],
                    as: 'userReaction'
                }
            },
            {
                $addFields: {
                    userReaction: {
                        $cond: {
                            if: { $gt: [{ $size: "$userReaction" }, 0] }, // if there are element in the array and length of it gt of 0
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                $project: {
                    userName: "$userInformation.userName",
                    userImage: "$userInformation.image",
                    avatar: "$userInformation.avatar",
                    defaultCoverColor: "$userInformation.defaultCoverColor",
                    userId: true,
                    postId: true,
                    content: true,
                    loveCount: true,
                    replyCount: true,
                    userReaction: true,
                    _id: true,
                }
            }
        ]).skip(skipDocuments(page, Limit)).limit(Limit);


        const countOfComments = await commentModel.countDocuments();
        if (response) {
            return res.status(200).send({ comments: response.length > 0 ? response : null, limitPages: calculateNumberOfPages(countOfComments, Limit) })
        }
    } catch (err) {
        next(err)
    }
}
module.exports = handleGetComments