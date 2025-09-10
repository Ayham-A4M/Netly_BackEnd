const userModel = require('../../models/user');
const followModel = require('../../models/follow');
const AppError = require('../../utils/AppError');
const increamentUserField = require('../../helper/dataBase/increamentUserField');
const pushNotification=require('../../helper/dataBase/pushNotification')
const handleFollowProcess = async (req, res, next) => {
    try {
        const userId = res.locals.id; // who Send this request to follow someOne
        const followingUserId = req.body.followingUserId;
        if (!followingUserId) { throw new AppError(400, 'no specific user to follow') }
        const followObject = { userId: followingUserId, followerId: userId, createdAt: new Date() };
        const follow_save = new followModel(followObject);
        const response = await follow_save.save();
        if (response) {
            const [res1, res2,res3] = await Promise.all([increamentUserField(userId, 'followingCount', 1), increamentUserField(followingUserId, 'followersCount', 1),pushNotification(followingUserId,userId,'follow')])
            return res.status(200).send({});
        }
    } catch (err) {
        next(err);
    }
}
module.exports = handleFollowProcess

