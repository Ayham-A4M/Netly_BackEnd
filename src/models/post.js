const { default: mongoose } = require("mongoose");
const { Types: { ObjectId } } = mongoose;
const postSchema = new mongoose.Schema({
    userId: { type: ObjectId, ref: 'user', required: true },
    feeling: { type: String }, // optional like Homam is  feeling happy
    content: { type: String },
    images: [{ type: String }],
    tags: [{
        type: String,
        lowercase: true,
    }],
    loveCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    sharedCount: { type: Number, default: 0 },
    // if the post is shared
    sharedPostId: { type: ObjectId, ref: 'post' },

    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    publishedAt: {
        type: Date,
        required: true
    }


});
const postModel = mongoose.model('post', postSchema, 'posts');
module.exports = postModel;