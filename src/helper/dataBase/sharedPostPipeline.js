// helper/dataBase/sharedPostPipeline.js
const { Types: { ObjectId } } = require('mongoose');

function sharedPostPipeline(userId) {
  return [
    // join original post if shared
    {
      $lookup: {
        from: 'posts',
        localField: 'sharedPostId',
        foreignField: '_id',
        as: 'sharedPost'
      }
    },
    { $unwind: { path: '$sharedPost', preserveNullAndEmptyArrays: true } },

    // join original post's author
    {
      $lookup: {
        from: 'users',
        localField: 'sharedPost.userId',
        foreignField: '_id',
        as: 'sharedPostUser'
      }
    },
    { $unwind: { path: '$sharedPostUser', preserveNullAndEmptyArrays: true } },

    // reshape sharedPost fields
    {
      $addFields: {
        sharedPost: {
          $cond: {
            if: { $ifNull: ["$sharedPost._id", false] }, // only if original post exists
            then: {
              _id: "$sharedPost._id",
              content: "$sharedPost.content",
              images: "$sharedPost.images",
              feeling: "$sharedPost.feeling",
              publishedAt: "$sharedPost.publishedAt",
              userId: "$sharedPost.userId",
              userName: "$sharedPostUser.userName",
              avatar: "$sharedPostUser.avatar",
              defaultCoverColor: "$sharedPostUser.defaultCoverColor"
            },
            else: "$$REMOVE" // 🔥 removes the field completely if no sharedPost
          }
        }
      }
    }
  ];
}

module.exports = sharedPostPipeline;
