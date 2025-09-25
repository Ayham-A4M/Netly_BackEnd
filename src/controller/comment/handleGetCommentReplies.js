const replyModel = require('../../models/reply');
const calculateNumberOfPages = require('../../helper/calculateNumberOfPages');
const ObjectId = require('mongoose').Types.ObjectId
const paginitionVariables = require('../../helper/paginitionVariables');
const handlGetCommentReplies = async (req, res, next) => {
    try {
        const commentId = req.query?.commentId || null;
        const page = req.query?.page || 1;
        const { skip, limit } = paginitionVariables(page, 15);

        if (!!!commentId) { throw new Error('no specific comment'); }
        const response = await replyModel.aggregate([
            {
                $match: { commentId: new ObjectId(commentId) }
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
                $project: {
                    userName: "$userInformation.userName",
                    userImage: "$userInformation.image",
                    defaultCoverColor: "$userInformation.defaultCoverColor",
                    userId: true,
                    content: true,
                    commentId: true,
                    _id: true,
                }
            }
        ]).skip(skip).limit(limit);
        
        if (response) {
            if (page === 1) {
                const numberOfDocuments = await replyModel.countDocuments({ commentId });
                return res.status(200).send({ replies: response, limitofPages: calculateNumberOfPages(numberOfDocuments, limit) });
            } else {
                return res.status(200).send({ replies: response });
            }
        }
    } catch (err) {
        next(err);
    }
}
module.exports = handlGetCommentReplies;