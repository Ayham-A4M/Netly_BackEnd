const jwt = require('jsonwebtoken');
const AppError = require('../../utils/AppError');
const userModel = require('../../models/user');
require('dotenv');
const handleRefreshToken = (req, res, next) => {
    try {
        const refreshToke = req.cookies.refreshToken;
        if (!refreshToke) { throw new AppError(403, "the session was ended you should login") }
        jwt.verify(refreshToke, process.env.REFRESH_TOKEN_SECRET, async (err, decode) => {
            if (err) { return res.status(403).send({ msg: "the session was ended you should login" }) }
            if (decode) {
                const user = await userModel.findById(decode.id);
                if (!user) { return res.status(404).send({ msg: "user not found" }); }
                if (user.tokenVersion === decode.tokenVersion) {
                    const payload = { id: user._id, userName: user.userName, tokenVersion: user.tokenVersion }
                    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' }); // after 30 miniuts it will expired and return 401
                    res.cookie('jwt', accessToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 30 * 60 * 1000 }); //original
                    return res.status(200).send({});
                } else {
                    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
                    res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
                    return res.status(403).send({ msg: "the session was ended you should login" });
                }
            }
        })
    } catch (err) {
        next(err);
    }
}
module.exports = handleRefreshToken;