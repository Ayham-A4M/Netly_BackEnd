const userModel = require('../../models/user')
const bcrybt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppError = require('../../utils/AppError');
const notificationModel = require('../../models/notification');
const handleLogin = async (req, res, next) => {
    try {
        const user = req.body;
        const userFromDB = await userModel.findOne({ email: user.email })

        // check if the user is exist

        console.log("before thrown")
        if (!userFromDB) { throw new AppError(403, 'wrong password or email') }
        // start compare between passwords !!
        await bcrybt.compare(user.password, userFromDB.password).then((response) => {
            if (!response) {
                throw new AppError(403, 'wrong password or email')
            }
            // create jwt token (role && tokenVersion && fullName) http only cookies
            const payload = { id: userFromDB._id, userName: userFromDB.userName, tokenVersion: userFromDB.tokenVersion }
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' }); // after 30 miniuts it will expired and return 401
            const refreshToken = jwt.sign({ ...payload, tokenVersion: userFromDB.tokenVersion }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
            // after create jwt and refresh token send it to user with done operation
            res.cookie('jwt', accessToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 30 * 60 * 1000 }); //original
            res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 }); // original
        })
        const numberOfNotification = await notificationModel.countDocuments({ receiverId: userFromDB._id, isRead: false });
        return res.status(201).send({ msg: 'you are logged in', numberOfNotification });
    } catch (err) {
        next(err);
    }
}
module.exports = handleLogin;