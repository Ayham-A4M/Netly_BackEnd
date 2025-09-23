const paginationVariable = require('../../helper/paginitionVariables');
const calculateNumberOfPages = require('../../helper/calculateNumberOfPages');
const ObjectId = require('mongoose').Types.ObjectId;
const commentReactionModel = require('../../models/commentReaction');
const handleGetCommentsReactions = async (req, res, next) => {
    try {
        const userId = res.locals.id;
        const page = req.query.page || 1;
        const { skip, limit } = paginationVariable(page, 10);
        let response={};
        const reactions = await commentReactionModel.aggregate([
            { $match: { userId: new ObjectId(userId) } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'comments',
                    let: { id: '$commentId' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$id'] } } },
                        { $project: { content: 1,postId:1 } }
                    ],
                    as: 'commentInfo'
                }
            },
            { $unwind: '$commentInfo' },
            {
                $lookup: {
                    from: 'users',
                    let: { ownerId: '$commentOwnerId' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$ownerId'] } } },
                        { $project: { userName: 1 } }
                    ],
                    as: "userInfo"
                }

            },
            { $unwind: '$userInfo' },
            {
                $project: {
                    _id: 1,
                    postId: "$commentInfo.postId",
                    commentId:1,
                    ownerUserName: "$userInfo.userName",
                    commentContent: { $substr: ["$commentInfo.content", 0, 20] },
                }
            }
        ]);
        response.activity = reactions;
        if (page === 1) {
            const limitOfPages = calculateNumberOfPages(await commentReactionModel.countDocuments({ userId }), limit);
            response.limitOfPages = limitOfPages;
        }
        return res.status(200).send(response);

    } catch (err) {
        next(err);
    }
}
module.exports = handleGetCommentsReactions;