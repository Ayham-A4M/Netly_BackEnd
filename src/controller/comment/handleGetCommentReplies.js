const replyModel = require('../../models/reply');
const skipDocuments = require('../../helper/skipDocuments');
const calculateNumberOfPages = require('../../helper/calculateNumberOfPages');
const ObjectId = require('mongoose').Types.ObjectId
const Limit = 15;
const handlGetCommentReplies = async (req, res, next) => {
    try {
        const commentId = req.query?.commentId || null;
        const page = req.query?.page || 1;
        const skip = skipDocuments(page, Limit);
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
                    commentId:true,
                    _id: true,
                }
            }
        ]).skip(skip).limit(Limit);
        if (response) {
            const numberOfDocuments = await replyModel.countDocuments({ commentId });
            return res.status(200).send({ replies: response, limit: calculateNumberOfPages(numberOfDocuments) });
        }
    } catch (err) {
        next(err);
    }
}
module.exports = handlGetCommentReplies;