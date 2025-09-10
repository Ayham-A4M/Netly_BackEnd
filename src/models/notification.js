const { default: mongoose } = require("mongoose");
const { Types: { ObjectId } } = mongoose;
// for normal user
const notificationSchema = new mongoose.Schema({
    receiverId: { type: ObjectId, required: true, ref: 'users' }, // notification Owner
    senderId: { type: ObjectId, required: true, ref: 'users' }, // who do something then created the notification
    type: {
        type: String,
        enum: ['follow', 'share', 'post_reaction', 'comment', 'reply','comment_reaction'],
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    message: { type: String, required: true },
    postId: { type: ObjectId, required: false, ref: 'posts' },
    isRead: { type: Boolean, default: false },
});
// createIndexes()
const notificationModel = mongoose.model('notification', notificationSchema, 'notifications');

module.exports = notificationModel;