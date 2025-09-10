const { default: mongoose } = require("mongoose");
const { Types: { ObjectId } } = mongoose;
// for normal user
const reactionSchema = new mongoose.Schema({
    postId: { type: ObjectId, required: true },
    userId: { type: ObjectId, required: true }, // who react on post
    postOwnerId: { type: ObjectId, required: true }, // who create this post
});
reactionSchema.index(
    { postId: 1, userId: 1 },
    {
        unique: true,

    }
)
const reactionModel = mongoose.model('reaction', reactionSchema, 'reactions');

module.exports = reactionModel;