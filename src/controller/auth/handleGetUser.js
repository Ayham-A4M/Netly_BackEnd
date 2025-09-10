const notificationModel = require('../../models/notification');
const userModel = require('../../models/user');
const AppError = require('../../utils/AppError');
const handleGetUser = async (req, res, next) => {
    try {
        const userId = res.locals.id;
        const response = await userModel.findById(userId);
        if(!response){
            throw new AppError(404,'user not find');
        }
        const numberOfNotification=await notificationModel.countDocuments({receiverId:userId,isRead:false});
        return res.status(200).send({numberOfNotification});
    } catch (err) {
        next(err);
    }
}
module.exports = handleGetUser