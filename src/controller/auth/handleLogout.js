const increamentUserField = require('../../helper/dataBase/increamentUserField')
const handleLogout = async (req, res, next) => {
    try {
        // Clear authentication cookies
        const userId = res.locals.id;
        const response = await increamentUserField(userId, "tokenVersion", Math.ceil(Math.random()*1500)); // more secure than increament it 1 by 1
        if (response) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'None', secure: true });
        }
        return res.status(200).send({ msg: 'logged out successfully' });
    } catch (err) {
        next(err);
    }
}
module.exports = handleLogout;