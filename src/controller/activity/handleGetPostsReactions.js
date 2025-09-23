const reactionModel = require('../../models/reaction');
const paginationVariable = require('../../helper/paginitionVariables');
const calculateNumberOfPages = require('../../helper/calculateNumberOfPages');
const ObjectId = require('mongoose').Types.ObjectId;
const handleGetPostsReactions = async (req, res, next) => {
    try {
        const userId = res.locals.id;
        const page = parseInt(req.query.page) || 1;
        const { skip, limit } = paginationVariable(page, 8);
        const reactions = await reactionModel.aggregate([
            { $match: { userId: new ObjectId(userId) } },
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: 'posts',
                    let: { id: '$postId' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$id'] } } },
                        { $project: { content: 1, userId: 1 } }
                    ],
                    as: 'postInfo'
                }
            },
            { $unwind: '$postInfo' },
            {
                $lookup: {
                    from: 'users',
                    let: { ownerId: '$postOwnerId' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$_id', '$$ownerId'] } } },
                        { $project: { userName: 1 } }
                    ],
                    as: 'postOwner'
                }
            },
            { $unwind: '$postOwner' },
            {
                $project: {
                    _id: 1,
                    postId: 1,
                    postOwnerId: 1,
                    postOwnerName: '$postOwner.userName',
                    postContent: { $substr: ['$postInfo.content', 0, 20] },
                }
            }
        ])
        console.log(reactions);
        let response = { activity: reactions };
        if (page === 1) {
            const totalDocs = await reactionModel.countDocuments({ userId });
            const limitOfPages = calculateNumberOfPages(totalDocs, limit);
            response.limitOfPages = limitOfPages;
        }
        return res.status(200).send(response);
    } catch (err) {
        next(err);
    }
};

module.exports = handleGetPostsReactions;