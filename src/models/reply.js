const { default: mongoose } = require("mongoose");
const { Types: { ObjectId } } = mongoose;
// for normal user
const replySchema = new mongoose.Schema({
    commentId: { type: ObjectId, required: true, ref: 'comments' }, // id of original comment
    userId: { type: ObjectId, required: true }, // who create this reply on post
    content: { type: String, required: true },
    postId: { type: ObjectId, required: true, ref: 'posts' }
    // Reactions

});

const replyModel = mongoose.model('reply', replySchema, 'replies');

module.exports = replyModel;