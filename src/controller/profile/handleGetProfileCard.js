const userModel = require('../../models/user');
const handleGetProfileCard = async (req, res, next) => {
    try {
        const userId = res.locals.id;
        const response = await userModel.findById(userId, { userName: true, bio: true, avatar: true, defaultCoverColor: true, coverImage:true,_id: true,followersCount:true,followingCount:true });
        if (response) {
            return res.status(200).send({ profileCard: response });
        }
    } catch (err) {
        next(err);
    }
}
module.exports = handleGetProfileCard;