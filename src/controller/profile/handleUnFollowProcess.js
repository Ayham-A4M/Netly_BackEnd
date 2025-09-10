const followModel = require('../../models/follow');
const AppError = require('../../utils/AppError');
const userModel=require('../../models/user');
const increamentUserField=require('../../helper/dataBase/increamentUserField')
const handleUnFollowProcess = async (req, res, next) => {
    try {
        const profileId = req.params.profileId;
        const userId = res.locals.id;
        console.log(profileId, "     ", userId);
        if (!profileId) {
            throw new AppError(404, "no specific user");
        }
        const response = await followModel.findOneAndDelete({ userId: profileId, followerId: userId });
        if (response) {
            const [r1,r2]=await Promise.all([increamentUserField(profileId,"followersCount",-1),increamentUserField(userId,"followingCount",-1)])
            return res.status(200).send({ msg: "unfollow process complete " });
        }
    } catch (err) {
        next(err);
    }
}
module.exports = handleUnFollowProcess