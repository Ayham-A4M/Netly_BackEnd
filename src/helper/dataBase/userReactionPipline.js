const userReactionPipleine = (userId) => {
const ObjectId=require('mongoose').Types.ObjectId
    const lookup = {
        $lookup: {
            from: 'reactions',
            let: { postId: '$_id' },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ['$postId', '$$postId'] },
                                { $eq: ['$userId', new ObjectId(userId)] }
                            ]
                        }
                    }
                },
                { $limit: 1 }
            ],
            as: 'userReaction'
        }
    }
    const addFileds = {
        $addFields: {
            userReaction: {
                $cond: {
                    if: { $gt: [{ $size: "$userReaction" }, 0] }, // if there are element in the array and length of it gt of 0
                    then: true,
                    else: false
                }
            }
        }
    }
    return [lookup, addFileds];
}
module.exports = userReactionPipleine