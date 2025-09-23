const { default: mongoose } = require("mongoose");
const { Types: { ObjectId } } = mongoose;

const commentReactionSchema = new mongoose.Schema({
    commentId: { type: ObjectId, required: true },
    userId: { type: ObjectId, required: true }, // who react on comment
    commentOwnerId: { type: ObjectId, required: true }, // who post this comment
});
commentReactionSchema.index(
    { commentId: 1, userId: 1 },
    {
        unique: true,
    }
)
const commentReactionModel = mongoose.model('commentReaction', commentReactionSchema, 'commentReactions');

module.exports = commentReactionModel;