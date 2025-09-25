const commentModel = require('../../models/comment');
const ObjectId = require('mongoose').Types.ObjectId;
const calculateNumberOfPages = require('../../helper/calculateNumberOfPages')
const paginitionVariables = require('../../helper/paginitionVariables');
const handleGetComments = async (req, res, next) => {
    const postId = req.query.postId;
    const userId = res.locals.id;
    const page = req.query.page || 1;
    const { skip, limit } = paginitionVariables(page, 15);
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
        ]).skip(skip).limit(limit);

        if (response) {
            if (page === 1) {
                const countOfComments = await commentModel.countDocuments();
                return res.status(200).send({ comments: response.length > 0 ? response : null, limitOfPages: calculateNumberOfPages(countOfComments, limit) })
            } else {
                return res.status(200).send({ comments: response.length > 0 ? response : null })
            }
        }
    } catch (err) {
        next(err)
    }
}
module.exports = handleGetComments