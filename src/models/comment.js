const { default: mongoose } = require("mongoose");
const { Types: { ObjectId } } = mongoose;
// for normal user
const commentSchema = new mongoose.Schema({
    postId: { type: ObjectId, required: true },
    userId: { type: ObjectId, required: true }, // who react on post
    content: { type: String, required: true },
    // Reactions
    loveCount: { type: Number, default: 0 },
    // Reactions
    replyCount:{type:Number,default:0},
});

const commentModel = mongoose.model('comment', commentSchema, 'comments');

module.exports = commentModel;