const userModel=require('../../models/user');
const bcrybt = require('bcryptjs');
const AppError = require('../../utils/AppError');
const getRandomColor=require('../../helper/getRandomColor')
const handleSignUp = async (req, res, next) => {
    try {
     
        const register = req.body;
        // first check if there any user with this email
        const emailCheck = await userModel.findOne({ email: register.email });

        if (emailCheck) { throw new AppError(400, 'email exist before') }
        // start hash the password
        const hashPassword = await bcrybt.hashSync(register.password, 10);
        register.password = hashPassword;
        register.defaultCoverColor=getRandomColor();
        const saveUser = new userModel(register);
        saveUser.save().then((response) => {
            return res.status(200).send({ msg: 'user saved successfully please login now' })
        })
    } catch (err) {
        // next(err);
        console.log(err);
        return res.status(400).send(err)
    }

}
module.exports = handleSignUp 