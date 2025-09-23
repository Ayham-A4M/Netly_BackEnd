const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
require('dotenv')
const verifyUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) { return res.status(401).send({ msg: 'unauthorized' }) }
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decode) => {
            if (err) { return res.status(401).send({ msg: 'unauthorized' }) }
            const response = await userModel.findById(decode.id);
            if (response) {
                if(decode.tokenVersion!==response.tokenVersion){
                    return res.status(401).send({ msg: 'unauthorized' })
                }
                res.locals.id = decode.id;
                return next();
            }
            else {
                return res.status(404).send({ msg: 'unkown user' });
            }
        })
    } catch (err) {
        return res.status(500).send({ msg: 'server error' });
    }
}
module.exports = verifyUser;