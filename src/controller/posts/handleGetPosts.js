const postModel = require('../../models/post');
const skipDocuments = require('../../helper/skipDocuments');
const calculateNumberOfPages = require('../../helper/calculateNumberOfPages');
const userReactionPipleine = require('../../helper/dataBase/userReactionPipline');
const ObjectId = require('mongoose').Types.ObjectId
const paginationVariable = require('../../helper/paginitionVariables')
const handleGetPosts = async (req, res, next) => {
    const page = req.query.page || 1;
    const { limit, skip } = paginationVariable(page, 2);
    const userId = res.locals.id;
    try {

        const response = await postModel.aggregate([
            {
                $match: { visibility: "public" }
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
                    userReaction: true  // Include the user's reaction in the output
                }
            },
            {
                $sort: { publishedAt: -1 }
            }
        ]).skip(skip).limit(limit);

        const countOfPosts = await postModel.countDocuments({ visibility: 'public' });
        if (response) {
            return res.status(200).send({ posts: response, limitOfPages: calculateNumberOfPages(countOfPosts, limit) })
        } else {
            return res.status(300).send({ msg: 'no posts new' });
        }
    } catch (err) {
        next(err);
    }
}

module.exports = handleGetPosts