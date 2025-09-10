// create notificatiojn and save it in collection
const notificationModel = require('../../models/notification');
const messages = {
    post_reaction: "React on your post",
    comment_reaction:"React on your comment",
    follow: "Following you",
    comment: "write a comment on your post",
    reply:"replay on your comment",
    share: "shared your post",
}
const pushNotification = async (receiverId, senderId, type,postId) => {
    if (receiverId === senderId) { return; }
    if (!receiverId || !senderId || !type) { return }
    const notification = { receiverId, senderId, type, date: new Date(), message: messages[type] };
    if(postId){notification.postId=postId};
    const new_notification = new notificationModel(notification);
    const response = await new_notification.save();
    return response;
}
module.exports = pushNotification